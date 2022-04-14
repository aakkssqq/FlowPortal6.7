using System;
using System.Collections.Generic;
using System.Web;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;
using NPOI.HSSF.UserModel;
using NPOI.XSSF.UserModel;
using NPOI.POIFS.FileSystem;
using NPOI.SS.UserModel;
using System.Threading;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json.Linq;


/// <summary>
///YZExcelHelper 的摘要说明

/// </summary>
namespace YZSoft.Web.Excel
{
    public class ExcelLoader
    {
        public static DataSet LoadExcel(HttpContext context, bool ignoreCellException)
        {
            if (context.Request.Files.Count == 0)
                throw new Exception("No file upload");

            HttpPostedFile file = context.Request.Files[0];

            YZRequest request = new YZRequest(context);
            int titleRowIndex = request.GetInt32("titleRowIndex", 1);
            int dataRowIndex = request.GetInt32("dataRowIndex", 2);

            return LoadExcel(file.InputStream, file.FileName, titleRowIndex, dataRowIndex, ignoreCellException);
        }

        public static DataSet LoadExcel(Stream stream, string fileName, int titleRowIndex, int dataRowIndex, bool ignoreCellException)
        {
            //打开文件
            IWorkbook book = null;
            IFormulaEvaluator evaluator = null;

            string ext = Path.GetExtension(fileName);
            if (YZStringHelper.EquName(ext, ".xlsx"))
            {
                book = new XSSFWorkbook(stream);
                evaluator = new XSSFFormulaEvaluator(book);
            }

            if (book == null)
            {
                book = new HSSFWorkbook(stream);
                evaluator = new HSSFFormulaEvaluator(book);
            }

            DataSet dataset = new DataSet();
            for (int i = 0; i < book.NumberOfSheets; i++)
            {
                ISheet sheet = (ISheet)book.GetSheetAt(i);

                DataTable table = new DataTable(sheet.SheetName);
                dataset.Tables.Add(table);

                if (sheet.LastRowNum != 0)
                {
                    for (int r = 0; r <= sheet.LastRowNum; r++)
                    {
                        IRow row = (IRow)sheet.GetRow(r);
                        if (row == null) //存在row为null的情况
                            break;// continue;

                        DataRow dataRow = null;
                        bool containsValue = false;
                        for (int c = 0; c < row.LastCellNum; c++)
                        {
                            ICell cell = (ICell)row.GetCell(c); //存在cell为null的情况
                            object value = cell == null ? null : ExcelHelper.GetCellValue(evaluator, cell, ignoreCellException);
                            if (!String.IsNullOrEmpty(Convert.ToString(value)))
                                containsValue = true;

                            string columnName = ExcelHelper.ColumnIndexToName(c);
                            if (r == titleRowIndex)
                            {
                                DataColumn dataColumn = new DataColumn(columnName, typeof(object));
                                table.Columns.Add(dataColumn);
                                dataColumn.Caption = Convert.ToString(value);
                            }
                            else if (r >= dataRowIndex)
                            {
                                if (!table.Columns.Contains(columnName))
                                {
                                    DataColumn dataColumn = new DataColumn(columnName, typeof(object));
                                    table.Columns.Add(dataColumn);
                                }

                                if (dataRow == null)
                                    dataRow = table.NewRow();

                                dataRow[columnName] = value;

                                if (c == row.LastCellNum - 1 && containsValue)
                                    table.Rows.Add(dataRow);
                            }
                        }
                    }
                }
            }

            return dataset;
        }
    }
}
