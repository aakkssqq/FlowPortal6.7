using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.IO;
using System.Drawing;
using System.Reflection;
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
//using YZNPOI.HSSF.Record.Formula;
using System.Data;
using System.Data.SqlClient;
using YZSoft.Web.DAL;

/// <summary>
///YZExcelService 已废弃，以后将被移除，请使用YZExcelGenerate

/// </summary>
namespace YZSoft.Web.Excel
{
    public class ExcelService
    {
        protected DataSet Fill(HSSFWorkbook book, Dictionary<string, string> reportParams, DataSet extdataset)
        {
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

        protected void LoadDataSet(HSSFWorkbook book, Dictionary<string, string> reportParams, ref DataSet dataset)
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

        protected void DoFixFill(HSSFWorkbook book, DataSet dataset)
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
                if (table.Rows.Count != 0)
                    valuefill = table.Rows[0][columnName];

                //执行填充
                MethodInfo method = this.GetType().GetMethod(render, BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public);
                if (method == null)
                    continue;

                method.Invoke(this, new object[] { cellfill, varName, dataset, valuefill, emptyText });
            }
        }

        protected void DoGridFill(HSSFWorkbook book, DataSet dataset)
        {
            HSSFSheet sheetFillDefine = (HSSFSheet)book.GetSheet("GridFill");
            if (sheetFillDefine == null)
                return;

            GridDefineCollection gridDefines = new GridDefineCollection();
            GridDefine gridDefine = null;
            object curSection = null;
            for (int r = 1; r <= sheetFillDefine.LastRowNum; r++)
            {
                HSSFRow excelRow = (HSSFRow)sheetFillDefine.GetRow(r);
                if (excelRow == null)
                    continue;

                //获得FixFill中的一设定行
                string[] values = new string[12];
                for (int i = 0; i <= values.Length - 1 && i <= excelRow.LastCellNum; i++)
                {
                    HSSFCell cell = (HSSFCell)excelRow.GetCell(i);
                    if (cell == null)
                        continue;

                    string value;
                    if (cell.CellType == CellType.NUMERIC)
                        value = cell.NumericCellValue.ToString();
                    else
                        value = cell.StringCellValue;

                    if (value != null)
                        value = value.Trim();

                    values[i] = value;
                }

                string sheetName = values[0]; //填充到的sheet
                string startRow = values[1]; //填充到的Cell
                string blockRows = values[2];  //替换Cell中的一部分
                string tableName = values[3]; //用那个表中的数据填充
                string sectionName = values[4]; //用那列数据填充
                string minRows = values[11]; //至少几行

                //应用缺省值
                if (String.IsNullOrEmpty(sheetName))
                    sheetName = book.GetSheetName(0);

                if (!String.IsNullOrEmpty(startRow))
                {
                    gridDefine = new GridDefine();
                    gridDefines.Add(gridDefine);

                    gridDefine.SheetName = sheetName;
                    gridDefine.Sheet = (HSSFSheet)book.GetSheet(sheetName);
                    gridDefine.StartRow = Int32.Parse(startRow) - 1;
                    gridDefine.BlockRowCount = Int32.Parse(blockRows);
                    gridDefine.FillTableName = tableName;
                    gridDefine.MinRows = 0;
                    Int32.TryParse(minRows, out gridDefine.MinRows);
                }

                if (gridDefine == null)
                    continue;

                if (!String.IsNullOrEmpty(sectionName))
                {
                    if (String.Compare(sectionName, "Fill", true) == 0)
                    {
                        curSection = gridDefine.GridCellFills;
                    }
                    else if (String.Compare(sectionName, "Template", true) == 0)
                    {
                        curSection = gridDefine.GridBlockTemplates;
                    }
                    else if (String.Compare(sectionName, "Group", true) == 0)
                    {
                        curSection = gridDefine.Groups;
                    }
                    else
                    {
                        curSection = null;
                    }
                }
                else
                {
                    if (curSection is GridCellFillCollection)
                    {
                        GridCellFillCollection fills = curSection as GridCellFillCollection;
                        GridCellFill fill = new GridCellFill();
                        fills.Add(fill);

                        string cellName = values[5];
                        string cellVarName = values[6];
                        string fillColumnName = values[7];
                        string renderFunction = values[8];
                        string emptyText = values[9];

                        //应用缺省值
                        if (String.IsNullOrEmpty(renderFunction))
                            renderFunction = "DefaultRender";

                        Point cellPos = ExcelHelper.CellNameToIndex(cellName);

                        fill.RowOffset = cellPos.Y - gridDefine.StartRow;
                        fill.ColumnIndex = cellPos.X;
                        fill.CellVarName = cellVarName;
                        fill.FillColumnName = fillColumnName;
                        fill.RenderFunction = renderFunction;
                        fill.EmptyText = emptyText;

                    }
                    else if (curSection is GridBlockTemplateCollection)
                    {
                        string templateName = values[5];
                        string startRowIndexStr = values[6];
                        string condition = values[7];

                        int startRowIndex = 0;
                        if (Int32.TryParse(startRowIndexStr, out startRowIndex))
                        {
                            GridBlockTemplateCollection templates = curSection as GridBlockTemplateCollection;
                            GridBlockTemplate template = new GridBlockTemplate(gridDefine);
                            templates.Add(template);

                            template.Name = templateName;
                            template.StartRow = startRowIndex - 1;
                            template.Condition = condition;
                        }
                    }
                    else if (curSection is GroupCollection)
                    {
                        string columnName = values[5];

                        if (!String.IsNullOrEmpty(columnName))
                        {
                            GroupCollection groups = curSection as GroupCollection;
                            Group group = new Group();
                            groups.Add(group);

                            group.ColumnName = columnName;
                        }
                    }
                    else
                    {
                    }
                }
            }

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

                        if (this.IsReportDefineSheet(sheet))
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
                if (this.IsReportDefineSheet(sheet))
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

                        if (this.IsReportDefineSheet(sheet))
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
                                this.CopyRow(grid.BlockRowCount, j, srcRow, newRow);
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

                this.ShiftRows(sheetfill, grid.TemplateEndRow + 1, -(grid.TemplateEndRow - grid.StartRow + 1));

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
                            object valuefill = row[fill.FillColumnName];

                            //执行填充
                            MethodInfo method = this.GetType().GetMethod(fill.RenderFunction, BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public);
                            if (method == null)
                                continue;

                            method.Invoke(this, new object[] { cellfill, fill.CellVarName, dataset, valuefill, fill.EmptyText });
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

                    this.MergeCells(sheetfill, grid, grid.Groups, 0, grid.StartRow, gridTagRowCount);
                }
            }
        }

        protected void MergeCells(HSSFSheet sheetfill, GridDefine grid, GroupCollection groups, int index, int startRow, int count)
        {
            if (groups == null || groups.Count <= index)
                return;

            Group group = groups[index];
            GridCellFill fill = grid.GridCellFills[group.ColumnName];
            if (fill == null || count == 0)
                return;

            int startRowIndex = startRow;
            int rowIndex = startRowIndex;
            string curvalue = Convert.ToString(ExcelHelper2003.GetCellValue(null, sheetfill.GetRow(startRowIndex).GetCell(fill.ColumnIndex) as HSSFCell));
            for (int i = 0; i < count; i++)
            {
                string value = null;
                rowIndex = startRow + i;

                value = Convert.ToString(ExcelHelper2003.GetCellValue(null, sheetfill.GetRow(rowIndex).GetCell(fill.ColumnIndex) as HSSFCell));
                if (String.Compare(value, curvalue, true) == 0)
                    continue;

                rowIndex--;
                if (rowIndex - startRowIndex >= 1)
                {
                    CellRangeAddress range = new CellRangeAddress(startRowIndex, rowIndex, fill.ColumnIndex, fill.ColumnIndex);
                    sheetfill.AddMergedRegion(range);
                    if (index < groups.Count - 1)
                        this.MergeCells(sheetfill, grid, groups, index + 1, startRowIndex, rowIndex - startRowIndex + 1);
                }

                startRowIndex = rowIndex + 1;
                curvalue = value;
            }

            if (rowIndex - startRowIndex >= 1)
            {
                CellRangeAddress range = new CellRangeAddress(startRowIndex, rowIndex, fill.ColumnIndex, fill.ColumnIndex);
                sheetfill.AddMergedRegion(range);

                if (index < groups.Count - 1)
                    this.MergeCells(sheetfill, grid, groups, index + 1, startRowIndex, rowIndex - startRowIndex + 1);
            }
        }

        protected void ShiftRows(HSSFSheet sheet, int startRowIndex, int offset)
        {
            HSSFSheet sheetfill = sheet;
            int firstRowIndex = Math.Min(startRowIndex, startRowIndex + offset);
            int lastRowIndex = Math.Max(startRowIndex, startRowIndex + offset) - 1;
            CellRangeAddressCollection savedRegions = new CellRangeAddressCollection();

            for (int i = 0; i < sheet.NumMergedRegions; i++)
            {
                CellRangeAddress region = sheet.GetMergedRegion(i);

                if (region.FirstRow >= firstRowIndex && region.LastRow <= lastRowIndex)
                {
                    sheet.RemoveMergedRegion(i);
                    i--;
                    continue;
                }

                if ((region.FirstRow < firstRowIndex && region.LastRow >= firstRowIndex) ||
                    (region.LastRow > lastRowIndex && region.FirstRow <= lastRowIndex))
                {
                    savedRegions.Add(region);
                    sheet.RemoveMergedRegion(i);
                    i--;
                    continue;
                }
            }

            sheet.ShiftRows(startRowIndex, sheet.LastRowNum, offset, true, true);

            foreach (CellRangeAddress region in savedRegions)
            {
                region.LastRow += offset;
                sheet.AddMergedRegion(region);
            }
        }

        protected void CopyRow(int blockRowCount, int tagRowBlockIndex, HSSFRow srcRow, HSSFRow tagRow)
        {
            tagRow.Height = srcRow.Height;
            //tagRow.RowStyle = srcRow.RowStyle;

            for (int i = 0; i < srcRow.LastCellNum; i++)
            {
                // Grab a copy of the old/new cell
                HSSFCell srcCell = (HSSFCell)srcRow.GetCell(i);
                HSSFCell tagCell = (HSSFCell)tagRow.CreateCell(i);

                // If the old cell is null jump to next cell
                if (srcCell == null)
                    continue;

                // Copy style from old cell and apply to new cell
                tagCell.CellStyle = srcCell.CellStyle;

                // If there is a cell comment, copy
                if (tagCell.CellComment != null) tagCell.CellComment = srcCell.CellComment;

                // If there is a cell hyperlink, copy
                if (srcCell.Hyperlink != null) tagCell.Hyperlink = srcCell.Hyperlink;

                // Set the cell data type
                tagCell.SetCellType(srcCell.CellType);

                // Set the cell data value
                switch (srcCell.CellType)
                {
                    case CellType.BLANK:
                        tagCell.SetCellValue(srcCell.StringCellValue);
                        break;
                    case CellType.BOOLEAN:
                        tagCell.SetCellValue(srcCell.BooleanCellValue);
                        break;
                    case CellType.ERROR:
                        tagCell.SetCellErrorValue(srcCell.ErrorCellValue);
                        break;
                    case CellType.FORMULA:
                        int sheetIndex = srcRow.Sheet.Workbook.GetSheetIndex(srcRow.Sheet);
                        Ptg[] ptgs = HSSFFormulaParser.Parse(srcCell.CellFormula, srcRow.Sheet.Workbook as HSSFWorkbook, FormulaType.CELL, sheetIndex);
                        foreach (Ptg ptg in ptgs)
                        {
                            if (ptg is RefPtgBase)
                            {
                                RefPtgBase refptg = ptg as RefPtgBase;
                                if (refptg.Row >= srcRow.RowNum - tagRowBlockIndex && refptg.Row <= srcRow.RowNum - tagRowBlockIndex + blockRowCount)
                                    refptg.Row += tagRow.RowNum - srcRow.RowNum;
                            }
                            else if (ptg is AreaPtgBase)
                            {
                                AreaPtgBase aptg = ptg as AreaPtgBase;
                                if (aptg.FirstRow >= srcRow.RowNum - tagRowBlockIndex && aptg.FirstRow <= srcRow.RowNum - tagRowBlockIndex + blockRowCount)
                                {
                                    aptg.FirstRow += tagRow.RowNum - srcRow.RowNum;
                                    aptg.LastRow += tagRow.RowNum - srcRow.RowNum;
                                }
                            }
                        }
                        tagCell.CellFormula = HSSFFormulaParser.ToFormulaString(srcRow.Sheet.Workbook as HSSFWorkbook, ptgs);
                        break;
                    case CellType.NUMERIC:
                        tagCell.SetCellValue(srcCell.NumericCellValue);
                        break;
                    case CellType.STRING:
                        tagCell.SetCellValue(srcCell.RichStringCellValue);
                        break;
                    case CellType.Unknown:
                        tagCell.SetCellValue(srcCell.StringCellValue);
                        break;
                }
            }
        }

        protected void SetCellValueDate(HSSFCell cell, DateTime date, string emptyText)
        {
            if (date == DateTime.MinValue)
                cell.SetCellValue(emptyText);
            else
                cell.SetCellValue(date);
        }

        protected bool IsReportDefineSheet(HSSFSheet sheet)
        {
            if (String.Compare(sheet.SheetName, "DataSource", true) == 0 ||
                String.Compare(sheet.SheetName, "FixFill", true) == 0 ||
                String.Compare(sheet.SheetName, "GridFill", true) == 0)
                return true;
            else
                return false;
        }

        protected void DefaultRender(HSSFCell cell, string varName, DataSet dataset, object value, string emptyText)
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

                            DateTime dateValue = DateTime.MinValue;
                            if (DateTime.TryParse(strValue, out dateValue))
                            {
                                SetCellValueDate(cell, dateValue, emptyText);
                                break;
                            }

                            double doubleValue;
                            if (Double.TryParse(strValue, out doubleValue))
                            {
                                cell.SetCellValue(doubleValue);
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

        protected void TimeSpanRender(HSSFCell cell, string varName, DataSet dataset, object value, string emptyText)
        {
            try
            {
                value = YZStringHelper.MinutesToStringDHM(Convert.ToInt32(value));
            }
            catch (Exception)
            {
            }

            DefaultRender(cell, varName, dataset, value, emptyText);
        }

        public class GridCellFill
        {
            public int RowOffset;
            public int ColumnIndex;
            public string CellVarName;
            public string FillColumnName;
            public string RenderFunction;
            public string EmptyText;
        }

        public class GridCellFillCollection : List<GridCellFill>
        {
            public GridCellFill this[string columnName]
            {
                get
                {
                    foreach (GridCellFill fill in this)
                    {
                        if (String.Compare(fill.FillColumnName, columnName, true) == 0)
                            return fill;
                    }

                    return null;
                }
            }
        }

        public class RowCollection : List<HSSFRow>
        {
        }

        public class CellRangeAddressCollection : List<CellRangeAddress>
        {
        }

        public class PtgCollection : List<Ptg>
        {
            public bool InRange(HSSFSheet ptgsheet, HSSFSheet testSheet, int startRowIndex, int endRowIndex)
            {
                foreach (Ptg ptg in this)
                {
                    HSSFSheet sheet = PtgCollection.GetPtgSheet(ptgsheet, ptg);
                    if (sheet != testSheet)
                        return false;

                    if (ptg is RefPtgBase)
                    {
                        RefPtgBase refPtg = ptg as RefPtgBase;

                        if (refPtg.Row < startRowIndex || refPtg.Row > endRowIndex)
                            return false;
                    }

                    if (ptg is AreaPtgBase)
                    {
                        AreaPtgBase areaPtg = ptg as AreaPtgBase;

                        if (areaPtg.FirstRow < startRowIndex || areaPtg.LastRow > endRowIndex)
                            return false;
                    }
                }

                return true;
            }

            public static HSSFSheet GetPtgSheet(HSSFSheet sheet, Ptg ptg)
            {
                if (ptg is RefPtg)
                {
                    return sheet;
                }
                if (ptg is Ref3DPtg)
                {
                    Ref3DPtg ptg3 = (Ref3DPtg)ptg;
                    int idx = sheet.book.GetSheetIndexFromExternSheetIndex(ptg3.ExternSheetIndex);
                    if (idx == -1)
                        return null;

                    return sheet.Workbook.GetSheetAt(idx) as HSSFSheet;
                }
                if (ptg is Area2DPtgBase)
                {
                    return sheet;
                }
                if (ptg is Area3DPtg)
                {
                    Area3DPtg aptg = (Area3DPtg)ptg;
                    int idx = sheet.book.GetSheetIndexFromExternSheetIndex(aptg.ExternSheetIndex);
                    if (idx == -1)
                        return null;

                    return sheet.Workbook.GetSheetAt(idx) as HSSFSheet;
                }
                return null;
            }
        }

        public class GridBlockTemplate
        {
            public string Name;
            public int StartRow;
            public string Condition;
            private RowCollection _rows;
            private CellRangeAddressCollection _mergedRegions;
            private SeriesTemplateCollection _seriesTemplates;
            public GridDefine Grid;

            public GridBlockTemplate(GridDefine grid)
            {
                this.Grid = grid;
            }

            public RowCollection Rows
            {
                get
                {
                    if (this._rows == null)
                        this._rows = new RowCollection();

                    return this._rows;
                }
                set
                {
                    this._rows = value;
                }
            }

            public CellRangeAddressCollection MergedRegions
            {
                get
                {
                    if (this._mergedRegions == null)
                        this._mergedRegions = new CellRangeAddressCollection();

                    return this._mergedRegions;
                }
                set
                {
                    this._mergedRegions = value;
                }
            }

            public SeriesTemplateCollection SeriesTemplates
            {
                get
                {
                    if (this._seriesTemplates == null)
                        this._seriesTemplates = new SeriesTemplateCollection();

                    return this._seriesTemplates;
                }
                set
                {
                    this._seriesTemplates = value;
                }
            }

            public bool Contains(HSSFSheet seriesSheet, HSSFChart.HSSFSeries series)
            {
                LinkedDataRecordCollection linkedDataRecords = new LinkedDataRecordCollection();
                linkedDataRecords.Add(series.GetDataValues());

                if (!linkedDataRecords.InRange(seriesSheet, this.Grid.Sheet, this.StartRow, this.StartRow + this.Grid.BlockRowCount - 1))
                    return false;

                return true;
            }
        }

        public class GridBlockTemplateCollection : List<GridBlockTemplate>
        {
            public GridBlockTemplate GetTemplate(DataTable table, int rowIndex)
            {
                foreach (GridBlockTemplate template in this)
                {
                    //如设置了过滤条件,则过滤出所需数据
                    if (String.IsNullOrEmpty(template.Condition))
                        return template;

                    DataView view = new DataView(table);
                    view.RowFilter = template.Condition.Replace("$totalRow", table.Rows.Count.ToString());
                    DataTable rvTable = view.ToTable();
                    if (rvTable.Rows.Count == 1)
                        return template;
                }

                if (this.Count != 0)
                    return this[this.Count - 1];
                else
                    return null;
            }
        }

        public class Group
        {
            public string ColumnName;
        }

        public class GroupCollection : List<Group>
        {
        }

        public class LinkedDataRecordCollection : List<LinkedDataRecord>
        {
            public void Offset(int offset)
            {
                foreach (LinkedDataRecord link in this)
                {
                    Ptg[] ptgs = link.FormulaOfLink;
                    foreach (Ptg ptg in ptgs)
                    {
                        if (ptg is RefPtgBase)
                        {
                            RefPtgBase refPtg = ptg as RefPtgBase;

                            refPtg.Row += offset;
                            link.FormulaOfLink = ptgs;
                        }

                        if (ptg is AreaPtgBase)
                        {
                            AreaPtgBase areaPtg = ptg as AreaPtgBase;

                            areaPtg.FirstRow += offset;
                            areaPtg.LastRow += offset;
                            link.FormulaOfLink = ptgs;
                        }
                    }
                }
            }

            public bool InRange(HSSFSheet ptgsheet, HSSFSheet testSheet, int startRowIndex, int endRowIndex)
            {
                PtgCollection ptgs = new PtgCollection();
                foreach (LinkedDataRecord link in this)
                    ptgs.AddRange(link.FormulaOfLink);

                return ptgs.InRange(ptgsheet, testSheet, startRowIndex, endRowIndex);
            }
        }

        public class SeriesTemplate
        {
            public HSSFChart Chart;
            public HSSFChart.HSSFSeries Series;

            public HSSFChart.HSSFSeries CloneSeries(HSSFSheet sheet, int offset)
            {
                LinkedDataRecordCollection linkedDataRecords = new LinkedDataRecordCollection();
                HSSFChart.HSSFSeries series = this.Chart.CreateSeries();
                series.GetDataName().FormulaOfLink = (Ptg[])this.Series.GetDataName().FormulaOfLink.Clone();
                series.GetDataValues().FormulaOfLink = (Ptg[])this.Series.GetDataValues().FormulaOfLink.Clone();
                linkedDataRecords.Add(series.GetDataName());
                linkedDataRecords.Add(series.GetDataValues());
                linkedDataRecords.Offset(offset);
                return series;
            }
        }

        public class SeriesTemplateCollection : List<SeriesTemplate>
        {
        }

        public class GridDefine : IComparable
        {
            public HSSFSheet Sheet;
            public string SheetName;
            public int StartRow;
            public int BlockRowCount;
            public string FillTableName;
            public int MinRows;
            private GridCellFillCollection _gridCellFills;
            private GridBlockTemplateCollection _gridBlockTemplates;
            private GroupCollection _groups;

            public GridCellFillCollection GridCellFills
            {
                get
                {
                    if (this._gridCellFills == null)
                        this._gridCellFills = new GridCellFillCollection();

                    return this._gridCellFills;
                }
                set
                {
                    this._gridCellFills = value;
                }
            }

            public GridBlockTemplateCollection GridBlockTemplates
            {
                get
                {
                    if (this._gridBlockTemplates == null)
                        this._gridBlockTemplates = new GridBlockTemplateCollection();

                    return this._gridBlockTemplates;
                }
                set
                {
                    this._gridBlockTemplates = value;
                }
            }

            public GroupCollection Groups
            {
                get
                {
                    if (this._groups == null)
                        this._groups = new GroupCollection();

                    return this._groups;
                }
                set
                {
                    this._groups = value;
                }
            }

            public int TemplateEndRow
            {
                get
                {
                    int rv = this.StartRow;
                    foreach (GridBlockTemplate template in this.GridBlockTemplates)
                    {
                        rv = Math.Max(rv, template.StartRow);
                    }

                    return rv + this.BlockRowCount - 1;
                }
            }

            #region IComparable 成员

            public int CompareTo(object obj)
            {
                GridDefine grid2 = obj as GridDefine;
                if (grid2 == null)
                    return Int32.MinValue;

                return grid2.StartRow - this.StartRow;
            }

            #endregion
        }

        public class GridDefineCollection : List<GridDefine>
        {
        }
    }
}