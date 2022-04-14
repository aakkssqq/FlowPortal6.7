using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.IO;
using System.Drawing;
using System.Reflection;
using System.Data;
using System.Data.SqlClient;
using BPM;
using YZNPOI.HSSF.Util;
using YZNPOI.HSSF.UserModel;
using YZNPOI.HSSF.Model;
using YZNPOI.HSSF.Record;
using YZNPOI.HSSF.Record.Aggregates;
using YZNPOI.HSSF.Record.Chart;
using YZNPOI.POIFS.FileSystem;
using YZNPOI.SS.UserModel;
using YZNPOI.SS.Util;
using YZNPOI.SS.Formula;
using YZNPOI.SS.Formula.PTG;
using Newtonsoft.Json.Linq;
using YZSoft.Web.DAL;

namespace YZSoft.Web.Excel
{
    public partial class ExcelGenerator : ExcelGeneratorBase
    {
        #region 对外服务

        public static HSSFWorkbook Fill(string templatePath, Dictionary<string, string> reportParams, DataSet dataset)
        {
            HSSFWorkbook book;
            using (FileStream stream = new FileStream(templatePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                book = new HSSFWorkbook(stream);
            }
            ExcelGenerator.Fill(book, reportParams, dataset);
            return book;
        }

        // extdataset - 外部提供的额外数据，比如导出时，外部提供的GridStore数据表
        public static DataSet Fill(HSSFWorkbook book, Dictionary<string, string> reportParams, DataSet extdataset)
        {
            if (reportParams == null)
                reportParams = new Dictionary<string, string>();

            //准备报表数据源
            DataSet dataset = extdataset;
            if (dataset == null)
                dataset = new DataSet();

            LoadDataSet(book, reportParams, ref dataset);

            //为table添加RowNum列
            foreach (DataTable table in dataset.Tables)
            {
                if (!table.Columns.Contains("RowNum"))
                {
                    DataColumn rowNumColumn = new DataColumn("RowNum", typeof(int));
                    table.Columns.Add(rowNumColumn);

                    for (int i = 0; i < table.Rows.Count; i++)
                    {
                        table.Rows[i]["RowNum"] = i + 1;
                    }
                }
            }

            //建立查询参数数据源表
            DataTable tableParam = new DataTable("ReportParam");
            dataset.Tables.Add(tableParam);

            foreach (string key in reportParams.Keys)
                tableParam.Columns.Add(key, typeof(string));

            DataRow row = tableParam.NewRow();
            tableParam.Rows.Add(row);

            foreach (string key in reportParams.Keys)
                row[key] = reportParams[key];

            //执行填充
            DoFixFill(book, dataset);
            DoGridFill(book, dataset);

            return dataset;
        }

        public static HSSFWorkbook NoTemplateExport(ColumnDefineCollection columnDefines, DataTable table)
        {
            //创建工作簿
            HSSFWorkbook book = new HSSFWorkbook();

            //增加标题Style
            HSSFCellStyle styleHeader = (HSSFCellStyle)book.CreateCellStyle();
            styleHeader.FillForegroundColor = HSSFColor.BLUE.index;
            styleHeader.FillPattern = FillPatternType.SOLID_FOREGROUND;

            //设置Font
            HSSFFont fontHeader = (HSSFFont)book.CreateFont();
            fontHeader.FontName = "Tahoma";
            fontHeader.FontHeight = 200;
            fontHeader.Color = HSSFColor.WHITE.index;
            styleHeader.SetFont(fontHeader);

            //设置缺省Style
            HSSFCellStyle styleDefault = (HSSFCellStyle)book.CreateCellStyle();
            HSSFFont fontDefault = (HSSFFont)book.CreateFont();
            styleDefault.SetFont(fontDefault);
            fontDefault.FontName = "Tahoma";
            fontDefault.FontHeight = 200;

            //创建Sheet
            HSSFRow row;
            HSSFCell cell;
            HSSFSheet sheet = (HSSFSheet)book.CreateSheet("Sheet1");

            //创建标题列                
            row = (HSSFRow)sheet.CreateRow(0);
            for (int i = 0; i < columnDefines.Count; i++)
            {
                ColumnDefine columnDefine = columnDefines[i];

                //创建cell
                cell = (HSSFCell)row.CreateCell(i, CellType.STRING);

                //应用style
                HSSFCellStyle style = (HSSFCellStyle)book.CreateCellStyle();
                style.CloneStyleFrom(styleHeader);
                style.Alignment = columnDefine.Align;
                cell.CellStyle = style;

                //设置值
                cell.SetCellValue(columnDefine.Text);

                sheet.SetColumnWidth(i,ExcelHelper.PixelToExcel(columnDefine.Width));
            }

            foreach (DataRow dataRow in table.Rows)
            {
                row = (HSSFRow)sheet.CreateRow(sheet.LastRowNum + 1);
                for (int i = 0; i < columnDefines.Count; i++)
                {
                    ColumnDefine columnDefine = columnDefines[i];
                    object objValue = dataRow[columnDefine.ColumnName];

                    //SQL Server数据库中monery4位小数点处理
                    if (objValue is decimal)
                        objValue = (decimal)Decimal.ToDouble((decimal)objValue);

                    //创建cell
                    cell = (HSSFCell)row.CreateCell(i, CellType.STRING);

                    //应用style
                    if (columnDefine.Style == null)
                    {
                        columnDefine.Style = (HSSFCellStyle)book.CreateCellStyle();
                        columnDefine.Style.CloneStyleFrom(styleDefault);
                        columnDefine.Style.Alignment = columnDefine.Align;
                    }
                    cell.CellStyle = columnDefine.Style;

                    //设置值
                    TypeCode typeCode = Type.GetTypeCode(objValue == null ? typeof(string) : objValue.GetType());
                    switch (typeCode)
                    {
                        case TypeCode.Boolean:
                            cell.SetCellValue(Convert.ToBoolean(objValue));
                            break;
                        case TypeCode.DateTime:
                            DateTime date = (DateTime)objValue;
                            string strValue = date == DateTime.MinValue ? "" : YZStringHelper.DateToStringL(date);
                            cell.SetCellValue(strValue);
                            break;
                        case TypeCode.Decimal:
                        case TypeCode.Double:
                        case TypeCode.Int16:
                        case TypeCode.Int32:
                        case TypeCode.Int64:
                        case TypeCode.Single:
                        case TypeCode.UInt16:
                        case TypeCode.UInt32:
                        case TypeCode.UInt64:
                        case TypeCode.SByte:
                        case TypeCode.Byte:
                            cell.SetCellValue(Convert.ToDouble(objValue));
                            break;
                        default:
                            cell.SetCellValue(Convert.ToString(objValue));
                            break;
                    }
                }
            }

            return book;
        }

        public static void PrepareForOutput(HSSFWorkbook book)
        {
            //删除报表定义sheet
            for (int i = book.NumberOfSheets - 1; i >= 0; i--)
            {
                HSSFSheet sheet = book.GetSheetAt(i) as HSSFSheet;

                if (IsSystemSheet(sheet))
                    book.RemoveSheetAt(i);
            }

            HSSFFormulaEvaluator.EvaluateAllFormulaCells(book);

            //设置打开时强制计算合计项
            //for (int i = 0; i < book.NumberOfSheets; i++)
            //{
            //    HSSFSheet sheet = book.GetSheetAt(i) as HSSFSheet;
            //    sheet.ForceFormulaRecalculation = true;
            //}

            book.SetActiveSheet(0);
        }

        #endregion

        #region render

        protected static void DefaultRender(HSSFCell cell, string varName, DataSet dataset, object value, string emptyText)
        {
            //SQL Server数据库中monery4位小数点处理
            if (value is decimal)
                value = (decimal)Decimal.ToDouble((decimal)value);

            //部分替换的情况
            if (!String.IsNullOrEmpty(varName))
            {
                if (cell.CellType == CellType.STRING)
                {
                    string orgText = cell.StringCellValue;
                    string newText = orgText.Replace(varName, Convert.ToString(value));
                    cell.SetCellValue(newText);
                }

                return;
            }

            if (String.IsNullOrEmpty(Convert.ToString(value)))
            {
                cell.SetCellValue(emptyText);
                return;
            }

            //如果单元格定义了格式，则应用单元格上定义的格式
            //如果单元格未定义格式，则根据值设置格式
            switch (cell.CellType)
            {
                case CellType.BOOLEAN:
                    {
                        cell.SetCellValue(Convert.ToBoolean(value));
                        break;
                    }
                case CellType.NUMERIC:
                    {
                        if (value is DateTime)
                        {
                            SetCellValueDate(cell, Convert.ToDateTime(value), emptyText);
                        }
                        else if (value is String)
                        {
                            string strValue = (string)value;

                            double doubleValue;
                            if (Double.TryParse(strValue, out doubleValue))
                            {
                                cell.SetCellValue(doubleValue);
                                break;
                            }

                            DateTime dateValue = DateTime.MinValue;
                            if (DateTime.TryParse(strValue, out dateValue))
                            {
                                SetCellValueDate(cell, dateValue, emptyText);
                                break;
                            }

                            cell.SetCellValue(strValue);
                        }
                        else
                        {
                            cell.SetCellValue(Convert.ToDouble(value));
                        }
                        break;
                    }
                case CellType.BLANK: //未定义格式 - 根据值设置格式
                    {
                        TypeCode typeCode = Type.GetTypeCode(value.GetType());
                        switch (typeCode)
                        {
                            case TypeCode.Boolean:
                                cell.SetCellValue(Convert.ToBoolean(value));
                                break;
                            case TypeCode.DateTime:
                                SetCellValueDate(cell, Convert.ToDateTime(value), emptyText);
                                break;
                            case TypeCode.Decimal:
                            case TypeCode.Double:
                            case TypeCode.Int16:
                            case TypeCode.Int32:
                            case TypeCode.Int64:
                            case TypeCode.Single:
                            case TypeCode.UInt16:
                            case TypeCode.UInt32:
                            case TypeCode.UInt64:
                            case TypeCode.SByte:
                            case TypeCode.Byte:
                                cell.SetCellValue(Convert.ToDouble(value));
                                break;
                            default:
                                cell.SetCellValue(Convert.ToString(value));
                                break;
                        }
                        break;
                    }
                case CellType.STRING:
                    {
                        if (value is DateTime)
                        {
                            DateTime date = (DateTime)value;
                            value = date == DateTime.MinValue ? "" : YZStringHelper.DateToStringL(date);
                        }

                        cell.SetCellValue(Convert.ToString(value));
                        break;
                    }
            }
        }

        protected static void TimeSpanRender(HSSFCell cell, string varName, DataSet dataset, object value, string emptyText)
        {
            value = YZStringHelper.MinutesToStringDHM(Convert.ToInt32(value));
            DefaultRender(cell, varName, dataset, value, emptyText);
        }

        protected static void ProcessStatusRender(HSSFCell cell, string varName, DataSet dataset, object value, string emptyText)
        {
            bool active = (bool)value;
            DefaultRender(cell, varName, dataset, active ? Resources.YZStrings.Process_Status_Active : Resources.YZStrings.Process_Status_History, null);
        }

        protected static void OrgAdminSupervisorsRender(HSSFCell cell, string varName, DataSet dataset, object value, string emptyText)
        {
            string strValue = Convert.ToString(value);
            string rv = null;
            if (!String.IsNullOrEmpty(strValue))
            {
                JArray array = JArray.Parse(strValue);

                BPMObjectNameCollection names = new BPMObjectNameCollection();
                foreach (JObject item in array)
                    names.Add((string)(item["UserName"]));

                rv = String.Join(",", names.ToArray());
            }

            DefaultRender(cell, varName, dataset, rv, String.Empty);
        }

        protected static void XFormAdminLengthRender(HSSFCell cell, string varName, DataSet dataset, object value, string emptyText)
        {
            DefaultRender(cell, varName, dataset, YZStringHelper.GetFileSize(value), String.Empty);
        }

        protected static void ReportViewsRender(HSSFCell cell, string varName, DataSet dataset, object value, string emptyText)
        {
            string strValue = Convert.ToString(value);
            string rv = null;
            if (!String.IsNullOrEmpty(strValue))
            {
                JArray array = JArray.Parse(strValue);

                BPMObjectNameCollection names = new BPMObjectNameCollection();
                foreach (JObject item in array)
                    names.Add((string)(item["ViewType"]));

                rv = String.Join(",", names.ToArray());
            }
            DefaultRender(cell, varName, dataset, rv, String.Empty);
        }

        protected static void FormServiceStatesRender(HSSFCell cell, string varName, DataSet dataset, object value, string emptyText)
        {
            string strValue = Convert.ToString(value);
            string rv = null;
            if (!String.IsNullOrEmpty(strValue))
            {
                JArray array = JArray.Parse(strValue);

                BPMObjectNameCollection names = new BPMObjectNameCollection();
                foreach (JObject item in array)
                    names.Add((string)(item["Name"]));

                rv = String.Join(",", names.ToArray());
            }
            DefaultRender(cell, varName, dataset, rv, String.Empty);
        }

        protected static void YeaNoRender(HSSFCell cell, string varName, DataSet dataset, object value, string emptyText)
        {
            bool bValue = Convert.ToBoolean(value);

            string rv = bValue ? Resources.YZStrings.All_Yes : Resources.YZStrings.All_No;

            DefaultRender(cell, varName, dataset, rv, String.Empty);
        }

        protected static void DeviceDisabledRender(HSSFCell cell, string varName, DataSet dataset, object value, string emptyText)
        {
            bool bValue = Convert.ToBoolean(value);

            string rv = bValue ? Resources.YZStrings.All_Disabled : "";

            DefaultRender(cell, varName, dataset, rv, String.Empty);
        }

        #endregion

        #region 内部方法

        //合并外部与内部数据源，获得总的数据集
        protected static void LoadDataSet(HSSFWorkbook book, Dictionary<string, string> reportParams, ref DataSet dataset)
        {
            HSSFSheet sheetDS = (HSSFSheet)book.GetSheet("DataSource");
            if (sheetDS == null)
                return;

            //查询得到所有用于填充的数据
            for (int r = 1; r <= sheetDS.LastRowNum; r++)
            {
                HSSFRow excelRow = (HSSFRow)sheetDS.GetRow(r);

                //获得DataSource中的一设定行
                string[] values = new string[3];
                for (int i = 0; i <= 2 && i <= excelRow.LastCellNum; i++)
                {
                    HSSFCell cell = (HSSFCell)excelRow.GetCell(i);
                    if (cell == null)
                        continue;

                    string value = cell.StringCellValue;
                    if (value != null)
                        value = value.Trim();

                    values[i] = value;
                }

                string resultTableName = values[0];
                string query = values[1];
                string datasourceName = values[2];

                //跳过空行
                if (String.IsNullOrEmpty(resultTableName) ||
                    String.IsNullOrEmpty(query))
                    continue;

                //应用查询条件
                foreach (KeyValuePair<string, string> kv in reportParams)
                    query = query.Replace("{" + kv.Key + "}", kv.Value);

                List<string> vars = new List<string>();
                foreach (string value in reportParams.Values)
                    vars.Add(value);
                query = String.Format(query, vars);

                dataset.Tables.Add(YZDbProviderManager.DefaultProvider.Query2Table(datasourceName, query, resultTableName));
            }
        }

        //固定填充
        protected static void DoFixFill(HSSFWorkbook book, DataSet dataset)
        {
            HSSFSheet sheetFillDefine = (HSSFSheet)book.GetSheet("FixFill");
            if (sheetFillDefine == null)
                return;

            for (int r = 1; r <= sheetFillDefine.LastRowNum; r++)
            {
                HSSFRow excelRow = (HSSFRow)sheetFillDefine.GetRow(r);

                //获得FixFill中的一设定行
                string[] values = new string[8];
                for (int i = 0; i <= 7 && i <= excelRow.LastCellNum; i++)
                {
                    HSSFCell cell = (HSSFCell)excelRow.GetCell(i);
                    if (cell == null)
                        continue;

                    string value = cell.StringCellValue;
                    if (value != null)
                        value = value.Trim();

                    values[i] = value;
                }

                string sheetName = values[0]; //填充到的sheet
                string cellName = values[1]; //填充到的Cell
                string varName = values[2];  //替换Cell中的一部分
                string tableName = values[3]; //用那个表中的数据填充
                string columnName = values[4]; //用那列数据填充

                string filter = values[5]; //过滤条件.net DataView filter语法
                string render = values[6]; //数据格式化函数 - 暂时不用
                string emptyText = values[7]; //数据空时的显示文字


                //应用缺省值
                if (String.IsNullOrEmpty(render))
                    render = "DefaultRender";

                if (String.IsNullOrEmpty(sheetName))
                    sheetName = book.GetSheetName(0);

                //跳过空行
                if (String.IsNullOrEmpty(cellName) ||
                    String.IsNullOrEmpty(tableName) ||
                    String.IsNullOrEmpty(columnName))
                    continue;

                //获得填充用数据源表
                DataTable srcTable = dataset.Tables[tableName];
                if (srcTable == null)
                    continue;

                //填充数据
                DataTable table = srcTable;

                //如设置了过滤条件,则过滤出所需数据
                if (!String.IsNullOrEmpty(filter))
                {
                    DataView view = new DataView(srcTable);
                    view.RowFilter = filter;
                    table = view.ToTable();
                }

                //获得填充到的sheet
                HSSFSheet sheetfill = (HSSFSheet)book.GetSheet(sheetName);
                if (sheetfill == null)
                    continue;

                //获得要填充的cell的行列序号
                Point cellPos = ExcelHelper.CellNameToIndex(cellName);
                HSSFRow rowfill = (HSSFRow)sheetfill.GetRow(cellPos.Y);
                if (rowfill == null)
                    continue;

                //获得要填充的cell
                HSSFCell cellfill = (HSSFCell)rowfill.GetCell(cellPos.X);
                if (cellfill == null)
                    continue;

                //获得填充值
                object valuefill = null;
                if (table.Rows.Count != 0 && table.Columns.Contains(columnName))
                    valuefill = table.Rows[0][columnName];

                //执行填充
                DoRender(render, cellfill, varName, dataset, valuefill, emptyText);
            }
        }

        //Grid填充
        protected static void DoGridFill(HSSFWorkbook book, DataSet dataset)
        {
            GridDefineCollection gridDefines = ParseGridDefins(book, dataset);

            gridDefines.Sort();

            foreach (GridDefine grid in gridDefines)
            {
                HSSFSheet sheetfill = grid.Sheet;

                foreach (GridBlockTemplate template in grid.GridBlockTemplates)
                {
                    for (int i = 0; i < grid.BlockRowCount; i++)
                    {
                        HSSFRow row = (HSSFRow)sheetfill.GetRow(template.StartRow + i);
                        template.Rows.Add(row);
                    }

                    for (int i = 0; i < sheetfill.NumMergedRegions; i++)
                    {
                        CellRangeAddress region = sheetfill.GetMergedRegion(i);
                        if (region.FirstRow >= template.StartRow && region.LastRow <= template.StartRow + grid.BlockRowCount - 1)
                        {
                            region = region.Copy();
                            region.FirstRow -= template.StartRow;
                            region.LastRow -= template.StartRow;
                            template.MergedRegions.Add(region);
                        }
                    }

                    for (int i = 0; i < book.NumberOfSheets; i++)
                    {
                        HSSFSheet sheet = book.GetSheetAt(i) as HSSFSheet;

                        if (IsSystemSheet(sheet))
                            continue;

                        foreach (HSSFChart chart in HSSFChart.GetSheetCharts(sheet))
                        {
                            foreach (HSSFChart.HSSFSeries series in chart.Series)
                            {
                                if (template.Contains(sheet, series))
                                {
                                    SeriesTemplate seriesTemplate = new SeriesTemplate();
                                    template.SeriesTemplates.Add(seriesTemplate);
                                    seriesTemplate.Chart = chart;
                                    seriesTemplate.Series = series;
                                }
                            }
                        }
                    }
                }

                if (grid.GridBlockTemplates.Count != 0)
                    grid.GridBlockTemplates[grid.GridBlockTemplates.Count - 1].Condition = null;
            }

            for (int i = 0; i < book.NumberOfSheets; i++)
            {
                HSSFSheet sheet = book.GetSheetAt(i) as HSSFSheet;
                if (IsSystemSheet(sheet))
                    continue;

                foreach (CellValueRecordInterface recInferface in sheet.Sheet.RowsAggregate.GetValueRecords())
                {
                    if (recInferface is FormulaRecordAggregate)
                    {
                        FormulaRecordAggregate fraInterface = recInferface as FormulaRecordAggregate;
                        FormulaRecord formulaRecord = fraInterface.FormulaRecord;
                        if (formulaRecord.IsSharedFormula)
                            fraInterface.UnlinkSharedFormula();
                    }
                }
            }

            foreach (GridDefine grid in gridDefines)
            {
                //创建空Grid
                HSSFSheet sheetfill = grid.Sheet;
                DataTable dataTable = dataset.Tables[grid.FillTableName];
                int gridTagBlockCount = Math.Max(dataTable.Rows.Count, grid.MinRows);
                int gridTagRowCount = grid.BlockRowCount * gridTagBlockCount;

                //GroupData(dataTable);
                //DataView view1 = new DataView(dataTable);
                //view1.Sort = "City asc,Shop asc";
                //dataTable = view1.ToTable();

                if (dataTable != null && dataTable.Rows.Count != 0)
                {
                    if (dataTable.Rows.Count != 0 && sheetfill.LastRowNum >= grid.TemplateEndRow + 1)
                        sheetfill.ShiftRows(grid.TemplateEndRow + 1, sheetfill.LastRowNum, gridTagRowCount, true, false);

                    for (int i = 0; i < sheetfill.NumMergedRegions; i++)
                    {
                        CellRangeAddress region = sheetfill.GetMergedRegion(i);
                        if (region.FirstRow <= grid.StartRow && region.LastRow >= grid.TemplateEndRow)
                            region.LastRow += Math.Max(dataTable.Rows.Count, grid.MinRows);
                    }

                    HSSFSheet hssfsheet = sheetfill as HSSFSheet;
                    foreach (CellValueRecordInterface recInferface in hssfsheet.Sheet.RowsAggregate.GetValueRecords())
                    {
                        if (recInferface is FormulaRecordAggregate)
                        {
                            FormulaRecord formulaRecord = ((FormulaRecordAggregate)recInferface).FormulaRecord;
                            Ptg[] ptgs = formulaRecord.ParsedExpression;
                            foreach (Ptg ptg in ptgs)
                            {
                                List<int> rowIndexs = new List<int>();
                                List<int> newRowIndexs = new List<int>();

                                if (ptg is RefPtgBase)
                                {
                                    RefPtgBase refPtg = ptg as RefPtgBase;
                                    rowIndexs.Add(refPtg.Row);
                                }
                                else if (ptg is AreaPtgBase)
                                {
                                    AreaPtgBase aptg = ptg as AreaPtgBase;
                                    rowIndexs.Add(aptg.FirstRow);
                                    rowIndexs.Add(aptg.LastRow);
                                }

                                foreach (int rowIndex in rowIndexs)
                                {
                                    int newRowIndex = rowIndex;
                                    if (formulaRecord.Row < grid.StartRow || formulaRecord.Row > grid.TemplateEndRow)
                                    {
                                        if (rowIndex == grid.StartRow)
                                            newRowIndex = grid.TemplateEndRow + 1;

                                        if (rowIndex == grid.TemplateEndRow)
                                            newRowIndex = grid.TemplateEndRow + gridTagRowCount;
                                    }

                                    newRowIndexs.Add(newRowIndex);
                                }

                                for (int i = 0; i < rowIndexs.Count; i++)
                                {
                                    int rowIndex = rowIndexs[i];
                                    int newRowIndex = newRowIndexs[i];

                                    if (newRowIndex != rowIndex)
                                    {
                                        if (ptg is RefPtgBase)
                                        {
                                            RefPtgBase refPtg = ptg as RefPtgBase;
                                            refPtg.Row = newRowIndex;
                                        }
                                        else if (ptg is AreaPtgBase)
                                        {
                                            AreaPtgBase aptg = ptg as AreaPtgBase;
                                            if (i == 0)
                                                aptg.FirstRow = newRowIndex;
                                            else
                                                aptg.LastRow = newRowIndex;
                                        }
                                        formulaRecord.ParsedExpression = ptgs;
                                    }
                                }
                            }
                        }
                    }

                    for (int i = 0; i < book.NumberOfSheets; i++)
                    {
                        HSSFSheet sheet = book.GetSheetAt(i) as HSSFSheet;

                        if (IsSystemSheet(sheet))
                            continue;

                        foreach (RecordBase recbase in sheet.Sheet.Records)
                        {
                            if (recbase is LinkedDataRecord)
                            {
                                LinkedDataRecord link = recbase as LinkedDataRecord;
                                Ptg[] ptgs = ptgs = link.FormulaOfLink;
                                foreach (Ptg ptg in ptgs)
                                {
                                    HSSFSheet sheetptg = PtgCollection.GetPtgSheet(sheet, ptg);
                                    if (sheetptg == sheetfill)
                                    {
                                        if (ptg is RefPtgBase)
                                        {
                                            RefPtgBase refPtg = ptg as RefPtgBase;

                                            if (refPtg.Row > grid.TemplateEndRow)
                                            {
                                                refPtg.Row += gridTagRowCount - (grid.TemplateEndRow - grid.StartRow + 1);
                                                link.FormulaOfLink = ptgs;
                                            }
                                        }
                                        if (ptg is AreaPtgBase)
                                        {
                                            AreaPtgBase areaPtg = ptg as AreaPtgBase;
                                            if (areaPtg.FirstRow <= grid.StartRow && areaPtg.LastRow >= grid.TemplateEndRow)
                                            {
                                                areaPtg.LastRow += gridTagRowCount - (grid.TemplateEndRow - grid.StartRow + 1);
                                                link.FormulaOfLink = ptgs;
                                            }
                                            else if (areaPtg.FirstRow > grid.TemplateEndRow)
                                            {
                                                areaPtg.FirstRow += gridTagRowCount - (grid.TemplateEndRow - grid.StartRow + 1);
                                                areaPtg.LastRow += gridTagRowCount - (grid.TemplateEndRow - grid.StartRow + 1);
                                                link.FormulaOfLink = ptgs;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    dataTable.Columns.Add("_gridTemplateIndex", typeof(object));
                    foreach (GridBlockTemplate template in grid.GridBlockTemplates)
                    {
                        if (String.IsNullOrEmpty(template.Condition))
                        {
                            foreach (DataRow dataRow in dataTable.Rows)
                            {
                                if (Convert.IsDBNull(dataRow["_gridTemplateIndex"]))
                                    dataRow["_gridTemplateIndex"] = template;
                            }

                            break;
                        }

                        DataView view = new DataView(dataTable);
                        view.RowFilter = template.Condition.Replace("$totalRow", dataTable.Rows.Count.ToString());
                        DataTable rvTable = view.ToTable();
                        foreach (DataRow dataRow in rvTable.Rows)
                        {
                            int rowIndex = Convert.ToInt32(dataRow["RowNum"]);
                            DataRow dataRowSrc = dataTable.Rows[rowIndex - 1];
                            dataRowSrc["_gridTemplateIndex"] = template;
                        }
                    }

                    for (int i = 0; i < gridTagBlockCount; i++)
                    {
                        GridBlockTemplate template;

                        if (i >= dataTable.Rows.Count)
                            template = grid.GridBlockTemplates[grid.GridBlockTemplates.Count - 1];
                        else
                            template = dataTable.Rows[i]["_gridTemplateIndex"] as GridBlockTemplate;

                        int startRowIndex = grid.TemplateEndRow + 1 + i * grid.BlockRowCount;
                        for (int j = 0; j < grid.BlockRowCount; j++)
                        {
                            int newRowIndex = startRowIndex + j;
                            HSSFRow newRow = (HSSFRow)sheetfill.GetRow(newRowIndex);
                            if (newRow == null)
                                newRow = (HSSFRow)sheetfill.CreateRow(newRowIndex);

                            if (template != null)
                            {
                                HSSFRow srcRow = template.Rows[j];
                                CopyRow(grid.BlockRowCount, j, srcRow, newRow);
                            }
                        }

                        foreach (CellRangeAddress region in template.MergedRegions)
                            sheetfill.AddMergedRegion(new CellRangeAddress(startRowIndex + region.FirstRow, startRowIndex + region.FirstRow, region.FirstColumn, region.LastColumn));

                        foreach (SeriesTemplate seriesTemplate in template.SeriesTemplates)
                            seriesTemplate.CloneSeries(sheetfill, i * grid.BlockRowCount - (template.StartRow - grid.StartRow));
                    }

                    foreach (GridBlockTemplate template in grid.GridBlockTemplates)
                    {
                        foreach (SeriesTemplate seriesTemplate in template.SeriesTemplates)
                            seriesTemplate.Chart.RemoveSeries(seriesTemplate.Series);
                    }
                }

                //删除模板
                int addedExcelRowCount = 0;
                if (dataTable != null)
                    addedExcelRowCount = dataTable.Rows.Count * grid.BlockRowCount;

                for (int i = grid.StartRow; i <= grid.TemplateEndRow; i++)
                    sheetfill.CreateRow(i);

                int firstRow = grid.StartRow;
                int lastRow = grid.TemplateEndRow;

                ShiftRows(sheetfill, grid.TemplateEndRow + 1, -(grid.TemplateEndRow - grid.StartRow + 1));

                //填充数据
                if (dataTable != null)
                {
                    for (int i = 0; i < dataTable.Rows.Count; i++)
                    {
                        DataRow row = dataTable.Rows[i];
                        foreach (GridCellFill fill in grid.GridCellFills)
                        {
                            Point cellPos = new Point();
                            cellPos.X = fill.ColumnIndex;
                            cellPos.Y = grid.StartRow + fill.RowOffset + i * grid.BlockRowCount;

                            //获得要填充的cell的行列序号
                            HSSFRow rowfill = (HSSFRow)sheetfill.GetRow(cellPos.Y);
                            if (rowfill == null)
                                continue;

                            //获得要填充的cell
                            HSSFCell cellfill = (HSSFCell)rowfill.GetCell(cellPos.X);
                            if (cellfill == null)
                                cellfill = (HSSFCell)rowfill.CreateCell(cellPos.X);

                            //获得填充值                        
                            object valuefill = null;
                            if (dataTable.Columns.Contains(fill.FillColumnName))
                                valuefill = row[fill.FillColumnName];

                            //执行填充
                            DoRender(fill.RenderFunction, cellfill, fill.CellVarName, dataset, valuefill, fill.EmptyText);
                        }
                    }

                    for (int i = dataTable.Rows.Count; i < grid.MinRows; i++)
                    {
                        foreach (GridCellFill fill in grid.GridCellFills)
                        {

                            Point cellPos = new Point();
                            cellPos.X = fill.ColumnIndex;
                            cellPos.Y = grid.StartRow + fill.RowOffset + i * grid.BlockRowCount;

                            //获得要填充的cell的行列序号
                            HSSFRow rowfill = (HSSFRow)sheetfill.GetRow(cellPos.Y);
                            if (rowfill == null)
                                continue;

                            //获得要填充的cell
                            HSSFCell cellfill = (HSSFCell)rowfill.GetCell(cellPos.X);
                            if (cellfill == null)
                                cellfill = (HSSFCell)rowfill.CreateCell(cellPos.X);

                            //获得填充值
                            cellfill.SetCellValue("");
                        }
                    }

                    MergeCells(sheetfill, grid, grid.Groups, 0, grid.StartRow, gridTagRowCount);
                }
            }
        }

        protected static void DoRender(string RenderFunction, HSSFCell cell, string varName, DataSet dataset, object value, string emptyText)
        {
            MethodInfo method = typeof(ExcelGenerator).GetMethod(RenderFunction, BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public);
            if (method == null)
            {
                DefaultRender(cell, varName, dataset, String.Format("{0} not found", RenderFunction), emptyText);
            }
            else
            {
                try
                {
                    method.Invoke(null, new object[] { cell, varName, dataset, value, emptyText });
                }
                catch (Exception e)
                {
                    DefaultRender(cell, varName, dataset, String.Format("{0} : {1}", RenderFunction, e.InnerException.Message), emptyText);
                }
            }
        }

        protected static bool IsSystemSheet(HSSFSheet sheet)
        {
            if (String.Compare(sheet.SheetName, "DataSource", true) == 0 ||
                String.Compare(sheet.SheetName, "FixFill", true) == 0 ||
                String.Compare(sheet.SheetName, "GridFill", true) == 0)
                return true;
            else
                return false;
        }

        #endregion
    }
}