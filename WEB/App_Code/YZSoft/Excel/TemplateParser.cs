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
    public partial class TemplateParser : ExcelGeneratorBase
    {
        #region 对外服务

        public static DataSet Parse(string templatePath)
        {
            DataSet dataset = new DataSet();
            HSSFWorkbook book;
            using (FileStream stream = new FileStream(templatePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                book = new HSSFWorkbook(stream);
            }
            Parse(book, dataset);
            return dataset;
        }

        public static void Parse(HSSFWorkbook book, DataSet dataset)
        {
            ParseFixFill(book, dataset);
            ParseGridFill(book, dataset);
        }

        protected static void ParseFixFill(HSSFWorkbook book, DataSet dataset)
        {
            HSSFSheet sheet = (HSSFSheet)book.GetSheet("FixFill");
            if (sheet == null)
                return;

            for (int r = 1; r <= sheet.LastRowNum; r++)
            {
                HSSFRow excelRow = (HSSFRow)sheet.GetRow(r);

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

                //跳过空行
                if (String.IsNullOrEmpty(cellName) ||
                    String.IsNullOrEmpty(tableName) ||
                    String.IsNullOrEmpty(columnName))
                    continue;

                //获得填充用数据源表
                DataTable table = dataset.Tables[tableName];
                if (table == null)
                {
                    table = new DataTable(tableName);
                    table.ExtendedProperties["isArray"] = false;
                    dataset.Tables.Add(table);
                }

                if (!table.Columns.Contains(columnName))
                    table.Columns.Add(columnName);
            }
        }

        protected static void ParseGridFill(HSSFWorkbook book, DataSet dataset)
        {
            GridDefineCollection gridDefines = ParseGridDefins(book, dataset);

            foreach (GridDefine grid in gridDefines)
            {
                string tableName = grid.FillTableName;

                if (String.IsNullOrEmpty(tableName))
                    continue;

                foreach (var cellFill in grid.GridCellFills)
                {
                    string columnName = cellFill.FillColumnName;

                    if (String.IsNullOrEmpty(columnName))
                        continue;

                    //获得填充用数据源表
                    DataTable table = dataset.Tables[tableName];
                    if (table == null)
                    {
                        table = new DataTable(tableName);
                        table.ExtendedProperties["isArray"] = true;
                        dataset.Tables.Add(table);
                    }

                    if (!table.Columns.Contains(columnName))
                        table.Columns.Add(columnName);
                }
            }
        }

        #endregion
    }
}