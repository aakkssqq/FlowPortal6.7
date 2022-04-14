using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Collections;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Reflection;
using System.Data;
using System.Data.SqlClient;
using NPOI;
using NPOI.XWPF.UserModel;
using NPOI.OpenXmlFormats.Wordprocessing;
using Newtonsoft.Json.Linq;
using NPOI.OpenXmlFormats.Dml.WordProcessing;
using System.Drawing.Drawing2D;

namespace YZSoft.Web.Word
{
    public class TemplateParser : Word
    {
        #region 对外服务

        public static DataSet Parse(string templatePath)
        {
            DataSet dataset = new DataSet();
            XWPFDocument doc;
            using (FileStream stream = new FileStream(templatePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                doc = new XWPFDocument(stream);
            }
            Parse(doc, dataset);
            return dataset;
        }

        public static void Parse(XWPFDocument doc, DataSet dataset)
        {
            //替换段落中的全局变量
            List<XWPFParagraph> phs = GetAllParagraphsExt(doc);
            foreach (XWPFParagraph ph in phs)
                Parse(ph, dataset);
        }

        #endregion

        protected static List<XWPFParagraph> GetAllParagraphsExt(XWPFDocument doc)
        {
            List<XWPFParagraph> rv = new List<XWPFParagraph>();

            foreach (XWPFHeader header in doc.HeaderList)
            {
                rv.AddRange(header.Paragraphs);
            }

            foreach (IBodyElement iBodyElement in doc.BodyElements)
            {
                if (iBodyElement is XWPFParagraph)
                {
                    rv.Add(iBodyElement as XWPFParagraph);
                }
                else if (iBodyElement is XWPFTable)
                {
                    XWPFTable table = iBodyElement as XWPFTable;
                    foreach (XWPFTableRow row in table.Rows)
                    {
                        foreach (XWPFTableCell cell in row.GetTableCells())
                        {
                            foreach (XWPFParagraph ph in cell.Paragraphs)
                                rv.Add(ph);
                        }
                    }
                }
            }

            foreach (XWPFFooter footer in doc.FooterList)
            {
                rv.AddRange(footer.Paragraphs);
            }

            return rv;
        }

        #region 内部方法

        static void Parse(XWPFParagraph ph, DataSet dataset)
        {
            for (int i = 0; i < ph.Runs.Count; i++)
            {
                XWPFRun run = ph.Runs[i];
                MergeField field = WordGenerator.ParesMergeField(run);
                if (field != null)
                {
                    if (field.TableName == "Global" && field.ColumnName == "Loop")
                        continue;

                    DataTable table = dataset.Tables[field.TableName];
                    if (table == null)
                    {
                        table = new DataTable(field.TableName);
                        table.ExtendedProperties["isArray"] = field.isArray;
                        dataset.Tables.Add(table);
                    }

                    if (!table.Columns.Contains(field.ColumnName))
                        table.Columns.Add(field.ColumnName);
                }
            }
        }

        #endregion
    }
}