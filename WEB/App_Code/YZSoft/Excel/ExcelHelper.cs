using System;
using System.Collections.Generic;
using System.Web;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;
using NPOI.POIFS.FileSystem;
using NPOI.SS.UserModel;
using System.Threading;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json.Linq;
using YZSoft.Web.DAL;

/// <summary>
///YZExcelHelper 的摘要说明

/// </summary>
namespace YZSoft.Web.Excel
{
    public class ExcelHelper
    {
        public static int PixelToExcel(int width)
        {
            return width * 256 / 8 + 116;
        }

        public static System.Drawing.Point CellNameToIndex(string cellName)
        {
            int index = cellName.IndexOfAny(new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' });

            if (index == -1 || index == 0)
                throw new Exception(String.Format(Resources.YZStrings.Aspx_Excel_IncorrectCellName, cellName));

            string columnName = cellName.Substring(0, index);
            string rowIndex = cellName.Substring(index);

            System.Drawing.Point point = new System.Drawing.Point();
            point.X = GetColumnNumber(columnName) - 1;
            point.Y = Int32.Parse(rowIndex) - 1;

            return point;
        }

        public static string ColumnIndexToName(int colIndex)
        {
            char ch = (char)('A' + colIndex % 26);
            string colName = ch.ToString();
            int j = colIndex / 26 - 1;
            if (j >= 0)
            {
                char ch1 = (char)('A' + j);
                colName = ch1.ToString() + colName;
            }

            return colName;
        }

        public static object GetCellValue(IFormulaEvaluator evaluator, ICell cell, bool ignoreCellException)
        {
            object value = null;
            switch (cell.CellType)
            {
                case CellType.Blank:
                case CellType.Unknown:
                    value = Convert.ToString(cell.StringCellValue);
                    break;
                case CellType.Boolean:
                    value = cell.BooleanCellValue;
                    break;
                case CellType.Error:
                    value = Convert.ToString(cell.ErrorCellValue);
                    break;
                case CellType.Formula:
                    try
                    {
                        cell = evaluator.EvaluateInCell(cell) as ICell;
                        value = GetCellValue(evaluator, cell, ignoreCellException);
                    }
                    catch (Exception)
                    {
                        if (ignoreCellException)
                        {
                            value = "";
                        }
                        else
                        {
                            string formula = null;
                            try
                            {
                                formula = cell.CellFormula;
                            }
                            catch (Exception)
                            {
                            }

                            string err = String.Format(Resources.YZStrings.Aspx_Excel_Ext_Invalid_Express, ExcelHelper.ColumnIndexToName(cell.ColumnIndex) + (cell.RowIndex + 1).ToString(), formula);
                            throw new Exception(err);
                        }
                    }
                    break;
                case CellType.Numeric:
                    if (DateUtil.IsCellDateFormatted(cell))
                        value = cell.DateCellValue;
                    else
                        value = cell.NumericCellValue;
                    break;
                case CellType.String:
                    value = Convert.ToString(cell.RichStringCellValue);
                    break;
                default:
                    value = Convert.ToString(cell.StringCellValue);
                    break;
            }

            if (value is string && value != null)
                value = (value as string).Trim();

            return value;
        }

        private static int GetColumnNumber(string name)
        {
            int number = 0;
            int pow = 1;
            for (int i = name.Length - 1; i >= 0; i--)
            {
                number += (name[i] - 'A' + 1) * pow; pow *= 26;
            }

            return number;
        }
    }
}
