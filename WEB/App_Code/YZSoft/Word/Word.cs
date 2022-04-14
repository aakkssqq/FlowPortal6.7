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
    public class Word
    {
        #region 内部方法

        protected static List<XWPFTable> GetAllTables(XWPFDocument doc)
        {
            List<XWPFTable> rv = new List<XWPFTable>();

            foreach (XWPFHeader header in doc.HeaderList)
            {
                rv.AddRange(header.Tables);
            }

            rv.AddRange(doc.Tables);

            foreach (XWPFFooter footer in doc.FooterList)
            {
                rv.AddRange(footer.Tables);
            }

            return rv;
        }

        protected static List<XWPFParagraph> GetAllParagraphs(XWPFDocument doc)
        {
            List<XWPFParagraph> rv = new List<XWPFParagraph>();

            foreach (XWPFHeader header in doc.HeaderList)
            {
                rv.AddRange(header.Paragraphs);
            }

            rv.AddRange(doc.Paragraphs);

            foreach (XWPFFooter footer in doc.FooterList)
            {
                rv.AddRange(footer.Paragraphs);
            }

            return rv;
        }

        protected static GridDefine ParseGridDefine(XWPFTable table)
        {
            GridDefine gridDefine = null;

            for (int i = 0; i < table.Rows.Count; i++)
            {
                XWPFTableRow row = table.Rows[i];
                MergeField mergeField = WordGenerator.GetFirstArrayMergeField(row);
                if (mergeField == null)
                {
                    if (gridDefine == null)
                        continue;
                    else
                        break;
                }
                else
                {
                    if (gridDefine == null)
                    {
                        gridDefine = new GridDefine();
                        gridDefine.TableName = mergeField.TableName;
                        gridDefine.StartRowIndex = i;
                        gridDefine.EndRowIndex = i;
                        gridDefine.Templates.Add(row);
                    }
                    else
                    {
                        gridDefine.EndRowIndex = i;
                        gridDefine.Templates.Add(row);
                    }
                }
            }

            return gridDefine;
        }

        protected static MergeField GetFirstArrayMergeField(XWPFTableRow row)
        {
            foreach (XWPFTableCell cell in row.GetTableCells())
            {
                foreach (XWPFParagraph ph in cell.Paragraphs)
                {
                    foreach (XWPFRun run in ph.Runs)
                    {
                        MergeField mergeField = WordGenerator.ParesMergeField(run);
                        if (mergeField != null && mergeField.isArray)
                            return mergeField;
                    }
                }
            }

            return null;
        }

        protected static XWPFRun TryGetNextRun(XWPFRun run)
        {
            int index = run.Paragraph.Runs.IndexOf(run);

            if (index >= run.Paragraph.Runs.Count - 1)
                return null;
            else
                return run.Paragraph.Runs[index + 1];
        }

        protected static MergeField ParesMergeField(XWPFRun run)
        {
            string text = run.Text;
            List<XWPFRun> nexts = new List<XWPFRun>();

            if (String.IsNullOrEmpty(text))
                return null;

            if (text.StartsWith("«"))
            {
                XWPFRun curRun = run;
                int i;
                for (i = 0; true; i++)
                {
                    if (text.EndsWith("»"))
                    {
                        break;
                    }
                    else
                    {
                        curRun = TryGetNextRun(curRun);
                        if (curRun == null)
                            break;

                        nexts.Add(curRun);
                        text += curRun.Text;
                    }
                }
            }

            MergeField field = null;
            int index;
            if (text.StartsWith("«") && text.EndsWith("»"))
            {
                run.SetText(text);
                foreach (XWPFRun next in nexts)
                    next.SetText("");

                field = new MergeField();
                text = text.Substring(1, text.Length - 2).Trim();

                index = text.LastIndexOf(':');
                if (index != -1)
                {
                    field.Render = text.Substring(index + 1).Trim();
                    text = text.Substring(0, index).Trim();
                }

                index = text.LastIndexOf('.');
                if (index == -1)
                {
                    field.TableName = "Global";
                    field.ColumnName = text;
                }
                else
                {
                    field.ColumnName = text.Substring(index + 1).Trim();
                    text = text.Substring(0, index).Trim();

                    if (text.EndsWith("[?]"))
                    {
                        field.TableName = text.Substring(0, text.Length - 3).Trim();
                        field.isArray = true;
                    }
                    else
                    {
                        field.TableName = text;
                    }
                }
            }

            return field;
        }

        protected static bool HasMergeField(XWPFParagraph ph)
        {
            for (int i = 0; i < ph.Runs.Count; i++)
            {
                MergeField field = WordGenerator.ParesMergeField(ph.Runs[i]);
                if (field != null)
                    return true;
            }

            return false;
        }

        protected static bool HasMergeField(IList<XWPFParagraph> phs)
        {
            foreach (XWPFParagraph ph in phs)
            {
                if (HasMergeField(ph))
                    return true;
            }

            return false;
        }

        protected static DataTable TryGetDataTable(DataSet dataset, GridDefine gridDefine)
        {
            return dataset.Tables[gridDefine.TableName];
        }

        #endregion

        #region 循环

        protected static List<LoopDefine> ParseLoops(XWPFDocument doc)
        {
            List<LoopDefine> loops = new List<LoopDefine>();
            LoopDefine curLoop = null;

            foreach (XWPFParagraph ph in GetAllParagraphs(doc))
            {
                string text = ph.Text;
                if (String.IsNullOrEmpty(text))
                    continue;

                if (text.StartsWith("«Loop:", true, null) && text.EndsWith("»"))
                {
                    int index = text.IndexOf(':');
                    string tableName = text.Substring(index + 1, text.Length - (index + 2));

                    if (curLoop == null)
                    {
                        curLoop = new LoopDefine();
                        curLoop.Identify = text;
                        curLoop.StartParagraph = ph;
                        curLoop.TableName = tableName;
                    }
                    else
                    {
                        if (String.Compare(curLoop.Identify, text, true) == 0)
                        {
                            loops.Add(curLoop);
                            curLoop.EndParagraph = ph;
                            curLoop = null;
                        }
                        else
                        {
                            curLoop = new LoopDefine();
                            curLoop.Identify = text;
                            curLoop.StartParagraph = ph;
                            curLoop.TableName = tableName;
                        }
                    }
                }
                else
                {
                    if (curLoop != null)
                        curLoop.Templates.Add(ph);
                }
            }

            return loops;
        }

        protected static int GetObjectIndex(List<DocumentBodyItemChoiceType> names, DocumentBodyItemChoiceType type, int p)
        {
            int num2 = 0;
            for (int i = 0; i < names.Count; i++)
            {
                if (names[i] == type)
                {
                    if (num2 == p)
                    {
                        return i;
                    }
                    num2++;
                }
            }
            return -1;
        }

        #endregion
    }
}