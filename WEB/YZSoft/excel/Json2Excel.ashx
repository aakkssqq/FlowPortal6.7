<%@ WebHandler Language="C#" Class="YZSoft.Handler.Excel.Json2Excel" %>

using System;
using System.Web;
using System.IO;
using System.Collections.Generic;
using System.Collections;
using System.Data;
using System.Web.Script.Serialization;
using YZNPOI.HSSF.Util;
using YZNPOI.HSSF.UserModel;
using YZNPOI.POIFS.FileSystem;
using YZNPOI.SS.UserModel;
using YZNPOI.SS.Util;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using YZSoft.Web.Excel;

namespace YZSoft.Handler.Excel
{
    public class Json2Excel : ExcelService,IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                serializer.MaxJsonLength = 2097152 * 100; //最大400M，缺省最大4M
                Dictionary<string, object> rv = serializer.DeserializeObject(context.Request.Params["data"]) as Dictionary<string, object>;
                DataTable table = new DataTable("GridStore");

                //将数据转化为Table
                if (rv != null && rv.ContainsKey("rows"))
                {
                    object[] rows = rv["rows"] as object[];
                    if (rows != null && rows.Length >= 1)
                    {
                        foreach (Dictionary<string, object> jsonRow in rows)
                        {
                            DataRow row = table.NewRow();
                            table.Rows.Add(row);

                            foreach (KeyValuePair<string, object> jsonField in jsonRow)
                            {
                                if (!table.Columns.Contains(jsonField.Key))
                                {
                                    DataColumn column = new DataColumn(jsonField.Key);
                                    table.Columns.Add(column);
                                }
                                row[jsonField.Key] = jsonField.Value;
                            }
                        }
                    }
                }
                
                //移除空行
                while(table.Rows.Count != 0)
                {
                    DataRow row = table.Rows[0];
                    if (this.IsEmptyRow(row))
                        table.Rows.RemoveAt(0);
                    else
                        break;
                }

                while (table.Rows.Count != 0)
                {
                    DataRow row = table.Rows[table.Rows.Count-1];
                    if (this.IsEmptyRow(row))
                        table.Rows.RemoveAt(table.Rows.Count-1);
                    else
                        break;
                }
                
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
                HSSFRow excelRow;
                HSSFCell cell;
                HSSFSheet sheet = (HSSFSheet)book.CreateSheet("Sheet1");

                for (int r = 0; r < table.Rows.Count; r++)
                {
                    DataRow dataRow = table.Rows[r];
                    excelRow = (HSSFRow)sheet.CreateRow(r);
                    int ragionfirstCol = 0;
                    for (int i = 0; i < table.Columns.Count; i++)
                    {
                        DataColumn dataColumn = table.Columns[i];

                        string cellText = String.Empty;
                        object objValue = dataRow[dataColumn];
                        if (Convert.IsDBNull(objValue))
                        {
                            //创建cell
                            cell = (HSSFCell)excelRow.CreateCell(i, CellType.STRING);
                            sheet.AddMergedRegion(new CellRangeAddress(r, r, ragionfirstCol, i));
                        }
                        else
                        {
                            ragionfirstCol = i;
                            if (objValue != null)
                            {
                                if (objValue is DateTime)
                                {
                                    DateTime dateTime = (DateTime)objValue;
                                    cellText = YZStringHelper.DateToStringL(dateTime);
                                }
                                else
                                {
                                    cellText = System.Convert.ToString(objValue);
                                }
                            }

                            //创建cell
                            cell = (HSSFCell)excelRow.CreateCell(i, CellType.STRING);
                            //设置值
                            cell.SetCellValue(cellText);
                        }
                    }
                }

                //Excel文件保存到流
                byte[] bytes;
                using (MemoryStream ms = new MemoryStream())
                {
                    book.Write(ms);
                    bytes = ms.ToArray();
                }

                //导出文件名
                string fileName = "Export";
                fileName += YZStringHelper.DateToString(DateTime.Now) + ".xls";

                //throw new Exception("Aaa");

                //设置Response头
                context.Response.Clear();
                context.Response.ContentType = "application/vnd.ms-excel";
                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fileName, System.Text.Encoding.UTF8));
                context.Response.AppendHeader("Content-Length", bytes.Length.ToString());

                context.Response.BinaryWrite(bytes);
                context.Response.End();
            }
            catch (Exception exp)
            {
                JObject rv = new JObject();
                rv["success"] = false;
                rv["errorMessage"] = exp.Message;
                context.Response.Write(rv.ToString(Formatting.Indented, YZJsonHelper.Converters));
            }
        }

        private bool IsEmptyRow(DataRow row)
        {
            foreach (object objValue in row.ItemArray)
            {
                string cellText = System.Convert.ToString(objValue);
                if (!String.IsNullOrEmpty(cellText))
                    return false;
            }

            return true;
        }
        
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}