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
    public partial class WordGenerator : Word
    {
        #region 对外服务

        public static XWPFDocument Fill(string templatePath, DataSet dataset)
        {
            XWPFDocument doc;
            using (FileStream stream = new FileStream(templatePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                doc = new XWPFDocument(stream);
            }
            WordGenerator.Fill(doc, dataset);
            return doc;
        }

        public static void Fill(XWPFDocument doc, DataSet dataset)
        {
            //为table添加RowNum/No列
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

                if (!table.Columns.Contains("No"))
                {
                    DataColumn rowNumColumn = new DataColumn("No", typeof(int));
                    table.Columns.Add(rowNumColumn);

                    for (int i = 0; i < table.Rows.Count; i++)
                    {
                        table.Rows[i]["No"] = i + 1;
                    }
                }
            }

            //替换grid
            foreach (XWPFTable table in GetAllTables(doc))
            {
                GridDefine gridDefine = WordGenerator.ParseGridDefine(table);
                if (gridDefine != null)
                {
                    DataTable gridTable = WordGenerator.TryGetDataTable(dataset, gridDefine);
                    if (gridTable != null)
                    {
                        WordGenerator.AdjustGridRowCount(table, gridDefine, gridTable.Rows.Count);
                        WordGenerator.FillGrid(table, gridDefine, gridTable);
                    }
                }
            }

            //替换表格中的全局变量
            foreach (XWPFTable table in GetAllTables(doc))
            {
                foreach (XWPFTableRow row in table.Rows)
                {
                    foreach (XWPFTableCell cell in row.GetTableCells())
                    {
                        //不能调用以下代码，SOP文档，作者，状态栏目输出空
                        //MergeField(cell.Paragraphs, dataset);

                        if (!HasMergeField(cell.Paragraphs))
                            continue;

                        int count = cell.Paragraphs.Count;

                        //复制段落
                        for (int i = 0; i < count; i++)
                        {
                            XWPFParagraph ph = cell.AddParagraph();
                            WordGenerator.CopyParagraph(cell.Paragraphs[i], ph);
                        }

                        //移除原段落
                        for (int i = 0; i < count; i++)
                            cell.RemoveParagraph(0);

                        //替换
                        foreach (XWPFParagraph ph in cell.Paragraphs)
                        {
                            foreach (XWPFRun run in ph.Runs)
                                WordGenerator.MergeField(run, dataset);
                        }
                    }
                }
            }

            //替换循环段落
            List<LoopDefine> loops = ParseLoops(doc);
            foreach (LoopDefine loop in loops)
            {
                DataTable table = dataset.Tables[loop.TableName];
                if (table != null)
                    FillLoop(doc, loop, table);
            }

            //替换段落中的全局变量
            List<XWPFParagraph> phs = GetAllParagraphs(doc);
            MergeField(phs, dataset);
        }

        #endregion

        #region render

        public static XWPFPicture AddPicture(XWPFRun run, Stream pictureData, int pictureType, string filename, int width, int height)
        {
            width *= 9525;
            height *= 9525;
            pictureData.Seek(0, SeekOrigin.Begin);

            run.SetText("");
            //run = run.Paragraph.CreateRun();
            XWPFPicture pic = run.AddPicture(pictureData, pictureType, filename, width, height);

            ArrayList runItems = run.GetCTR().Items;
            CT_Drawing drawing = runItems[runItems.Count - 1] as CT_Drawing;
            CT_Inline inline = drawing.inline[0];

            inline.docPr.id = (uint)run.Document.GetNextPicNameNumber((int)PictureType.PNG);

            inline.effectExtent = new CT_EffectExtent();
            inline.effectExtent.l = 0;
            inline.effectExtent.t = 0;
            inline.effectExtent.r = 0;
            inline.effectExtent.b = 0;

            return pic;
        }

        private static Size GetPageSize(XWPFDocument doc)
        {
            CT_SectPr sectPr = doc.Document.body.sectPr;
            if (sectPr != null)
            {
                CT_PageSz pgSz = sectPr.pgSz;
                if (pgSz != null)
                    return new Size((int)(pgSz.w / 20), (int)(pgSz.h / 20));
            }

            return new Size(11906 / 20, 16838 / 20);
        }

        private static Size GetImageSize(Image image, int width, int height)
        {
            Size size = new Size();

            if (image.Width <= width && image.Height <= height)
            {
                size.Width = image.Width;
                size.Height = image.Height;
            }
            else if (image.Width > image.Height)
            {
                decimal rateX = (decimal)width / image.Width;
                decimal rateY = (decimal)height / image.Height;
                decimal rate = Math.Min(rateX, rateY);
                size.Width = (int)(rate * image.Width);
                size.Height = (int)(rate * image.Height);
            }

            return size;
        }

        protected static void DefaultRender(XWPFRun run, object value, DataRow row)
        {
            Image image = value as Image;
            if (image != null)
            {
                Size pageSize = GetPageSize(run.Document);
                Size imageSize = GetImageSize(image, pageSize.Width, pageSize.Height);

                using (MemoryStream stream = new MemoryStream())
                {
                    image.Save(stream, ImageFormat.Png);
                    AddPicture(run, stream, (int)PictureType.PNG, "image.png", imageSize.Width, imageSize.Height);
                }
            }
            else
            {
                run.SetText("");
                string text = Convert.ToString(value);
                using (StringReader rd = new StringReader(text))
                {
                    for (int i = 0; true; i++)
                    {
                        string line = rd.ReadLine();
                        if (line == null)
                            break;

                        if (i != 0)
                            run.AddBreak(BreakType.TEXTWRAPPING);

                        run.AppendText(line);
                    }
                }
            }
        }

        #endregion

        #region 内部方法

        protected static void DoRender(XWPFRun run, object value, DataRow row, string RenderFunction)
        {
            if (String.IsNullOrEmpty(RenderFunction))
            {
                DefaultRender(run, value, row);
            }
            else
            {
                MethodInfo method = typeof(WordGenerator).GetMethod(RenderFunction, BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public);
                if (method == null)
                {
                    DefaultRender(run, value, row);
                }
                else
                {
                    try
                    {
                        method.Invoke(null, new object[] { run, value, row });
                    }
                    catch (Exception e)
                    {
                        DefaultRender(run, new JValue(String.Format("{0} : {1}", RenderFunction, e.InnerException.Message)), null);
                    }
                }
            }
        }

        private static void Fill(XWPFRun run, MergeField field, object value, DataRow row)
        {
            WordGenerator.DoRender(run, value, row, field.Render);
        }

        private static void MergeField(IList<XWPFParagraph> phs, DataSet dataset)
        {
            foreach (XWPFParagraph ph in phs)
            {
                if (HasMergeField(ph))
                {
                    int count = ph.Runs.Count;
                    for (int i = 0; i < count; i++)
                    {
                        XWPFRun run = ph.Runs[i];
                        XWPFRun runNew = ph.CreateRun();
                        CopyRun(run, runNew);
                        run.SetText("");
                    }

                    for (int i = 0, n = 0; i < count; i++)
                    {
                        if (!ph.RemoveRun(n))
                            n++;
                    }

                    for (int i = 0; i < ph.Runs.Count; i++)
                    {
                        WordGenerator.MergeField(ph.Runs[i], dataset);
                    }
                }
            }
        }

        private static void MergeField(XWPFRun run, DataSet dataset)
        {
            MergeField field = WordGenerator.ParesMergeField(run);
            if (field != null && !field.isArray)
            {
                DataTable table = dataset.Tables[field.TableName];
                if (table != null && table.Columns.Contains(field.ColumnName))
                {
                    object value = null;
                    DataRow row = null;
                    if (table.Rows.Count >= 1)
                    {
                        row = table.Rows[0];
                        value = row[field.ColumnName];
                    }

                    WordGenerator.Fill(run, field, value, row);
                }
            }
        }

        private static void MergeField(XWPFRun run, DataRow row)
        {
            MergeField field = WordGenerator.ParesMergeField(run);
            if (field != null && String.Compare(field.TableName, row.Table.TableName, true) == 0)
            {
                if (row.Table.Columns.Contains(field.ColumnName))
                    WordGenerator.Fill(run, field, row[field.ColumnName], row);
            }
        }

        private static void FillGrid(XWPFTable doctable, GridDefine gridDefine, DataTable table)
        {
            for (int i = 0; i < table.Rows.Count; i++)
            {
                DataRow row = table.Rows[i];
                XWPFTableRow docrow = doctable.GetRow(gridDefine.StartRowIndex + i);
                foreach (XWPFTableCell cell in docrow.GetTableCells())
                {
                    foreach (XWPFParagraph ph in cell.Paragraphs)
                    {
                        foreach (XWPFRun run in ph.Runs)
                        {
                            MergeField field = WordGenerator.ParesMergeField(run);
                            if (field != null && table.Columns.Contains(field.ColumnName))
                                WordGenerator.Fill(run, field, row[field.ColumnName], row);
                        }
                    }
                }
            }
        }

        private static void AdjustGridRowCount(XWPFTable table, GridDefine gridDefine, int newRowCount)
        {
            for (int i = 0; i < newRowCount; i++)
            {
                XWPFTableRow row = table.InsertNewTableRow(gridDefine.StartRowIndex);
                XWPFTableRow templateRow = gridDefine.Templates[i == newRowCount - 1 ? gridDefine.Templates.Count - 1 : 0];
                WordGenerator.CopyRow(templateRow, row);
            }

            foreach (XWPFTableRow templateRow in gridDefine.Templates)
            {
                table.RemoveRow(table.Rows.IndexOf(templateRow));
            }
        }

        private static void CopyRow(XWPFTableRow templateRow, XWPFTableRow row)
        {
            if (row.Height != templateRow.Height)
                row.Height = templateRow.Height;

            List<XWPFTableCell> templateCells = templateRow.GetTableCells();
            foreach (XWPFTableCell templateCell in templateCells)
            {
                XWPFTableCell cell = row.CreateCell();
                WordGenerator.CopyCell(templateCell, cell);
            }
        }

        private static void CopyBorders(CT_TcBorders templateBorders, CT_TcBorders borders)
        {
            if (templateBorders.bottom != null)
            {
                borders.bottom = new CT_Border();
                WordGenerator.CopyBorder(templateBorders.bottom, borders.bottom);
            }

            if (templateBorders.left != null)
            {
                borders.bottom = new CT_Border();
                WordGenerator.CopyBorder(templateBorders.left, borders.left);
            }

            if (templateBorders.right != null)
            {
                borders.bottom = new CT_Border();
                WordGenerator.CopyBorder(templateBorders.right, borders.right);
            }

            if (templateBorders.top != null)
            {
                borders.bottom = new CT_Border();
                WordGenerator.CopyBorder(templateBorders.top, borders.top);
            }
        }

        private static void CopyBorder(CT_Border templateBorder, CT_Border border)
        {
            border.val = templateBorder.val;
            border.space = templateBorder.space;
            border.sz = templateBorder.sz;
            border.color = templateBorder.color;
        }

        private static void CopyCell(XWPFTableCell templateCell, XWPFTableCell cell)
        {
            cell.SetColor(templateCell.GetColor());

            CT_TcBorders templateBorders = templateCell.GetCTTc().tcPr.tcBorders;
            if (templateBorders != null)
            {
                CT_TcBorders borders = cell.GetCTTc().AddNewTcPr().AddNewTcBorders();
                WordGenerator.CopyBorders(templateBorders, borders);
            }

            for (int i = 0; i < cell.Paragraphs.Count; i++)
                cell.RemoveParagraph(0);

            foreach (XWPFParagraph templateph in templateCell.Paragraphs)
            {
                XWPFParagraph ph = cell.AddParagraph();
                WordGenerator.CopyParagraph(templateph, ph);
            }
        }

        private static void CopyParagraph(XWPFParagraph templateph, XWPFParagraph ph)
        {
            if (!String.IsNullOrEmpty(templateph.Style))
                ph.Style = templateph.Style;

            ph.SetNumID(templateph.GetNumID(), templateph.GetNumIlvl());

            ph.Alignment = templateph.Alignment;
            ph.BorderBetween = templateph.BorderBetween;
            ph.BorderBottom = templateph.BorderBottom;
            ph.BorderLeft = templateph.BorderLeft;
            ph.BorderRight = templateph.BorderRight;
            ph.BorderTop = templateph.BorderTop;
            ph.FillBackgroundColor = templateph.FillBackgroundColor;
            ph.FillPattern = templateph.FillPattern;

            ph.FirstLineIndent = templateph.FirstLineIndent;
            ph.FontAlignment = templateph.FontAlignment;
            //readonly FootnoteText = templateph.FootnoteText;
            ph.IndentationFirstLine = templateph.IndentationFirstLine;
            //ph.IndentationHanging = templateph.IndentationHanging;
            ph.IndentationLeft = templateph.IndentationLeft;
            ph.IndentationRight = templateph.IndentationRight;
            ph.IndentFromLeft = templateph.IndentFromLeft;
            ph.IndentFromRight = templateph.IndentFromRight;
            ph.IsPageBreak = templateph.IsPageBreak;

            ph.IsWordWrapped = templateph.IsWordWrapped;

            if (ph.SpacingAfter != templateph.SpacingAfter)
                ph.SpacingAfter = templateph.SpacingAfter;

            if (ph.SpacingAfterLines != templateph.SpacingAfterLines)
                ph.SpacingAfterLines = templateph.SpacingAfterLines;

            if (ph.SpacingBefore != templateph.SpacingBefore)
                ph.SpacingBefore = templateph.SpacingBefore;

            if (ph.SpacingBeforeLines != templateph.SpacingBeforeLines)
                ph.SpacingBeforeLines = templateph.SpacingBeforeLines;

            if (ph.SpacingLineRule != templateph.SpacingLineRule)
                ph.SpacingLineRule = templateph.SpacingLineRule;

            if (ph.VerticalAlignment != templateph.VerticalAlignment)
                ph.VerticalAlignment = templateph.VerticalAlignment;

            foreach (XWPFRun templaterun in templateph.Runs)
            {
                XWPFRun run = ph.CreateRun();
                WordGenerator.CopyRun(templaterun, run);
            }

            //公开的API中缩进信息不全
            MethodInfo method = templateph.GetType().GetMethod("GetCTInd", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public);
            if (method != null)
            {
                CT_Ind indTemplate = method.Invoke(templateph, new object[] { false }) as CT_Ind;
                CT_Ind indPh = method.Invoke(ph, new object[] { true }) as CT_Ind;
                if (indTemplate != null && indPh != null)
                {
                    indPh.firstLine = indTemplate.firstLine;
                    indPh.firstLineChars = indTemplate.firstLineChars;
                    indPh.firstLineSpecified = indTemplate.firstLineSpecified;
                    indPh.hanging = indTemplate.hanging;
                    indPh.hangingChars = indTemplate.hangingChars;
                    indPh.hangingSpecified = indTemplate.hangingSpecified;
                    indPh.left = indTemplate.left;
                    indPh.leftChars = indTemplate.leftChars;
                    indPh.right = indTemplate.right;
                    indPh.rightChars = indTemplate.rightChars;
                }
            }
        }

        private static void CopyRun(XWPFRun templaterun, XWPFRun run)
        {
            //复制样式
            run.FontFamily = templaterun.FontFamily;

            if (templaterun.FontSize > 0)
                run.FontSize = templaterun.FontSize;

            run.IsBold = templaterun.IsBold;
            run.IsCapitalized = templaterun.IsCapitalized;
            run.IsDoubleStrikeThrough = templaterun.IsDoubleStrikeThrough;
            run.IsEmbossed = templaterun.IsEmbossed;
            run.IsImprinted = templaterun.IsImprinted;
            run.IsItalic = templaterun.IsItalic;
            run.IsShadowed = templaterun.IsShadowed;
            run.IsSmallCaps = templaterun.IsSmallCaps;
            run.IsStrikeThrough = templaterun.IsStrikeThrough;
            run.Subscript = templaterun.Subscript;
            run.Kerning = templaterun.Kerning;

            run.SetColor(templaterun.GetColor());
            run.SetUnderline(templaterun.Underline);

            run.SetText(templaterun.ToString());
        }

        #endregion

        #region 循环

        private static void FillLoop(XWPFDocument doc, LoopDefine loop, DataTable table)
        {
            foreach (DataRow row in table.Rows)
            {
                foreach (XWPFParagraph templateph in loop.Templates)
                {
                    XWPFParagraph ph = doc.CreateParagraph();

                    int paragraphPos = doc.Paragraphs.IndexOf(loop.Templates[0]);

                    //公开的API中信息不全
                    //修改位置
                    FieldInfo propertyCtDocument = typeof(XWPFDocument).GetField("ctDocument", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public);
                    if (propertyCtDocument != null)
                    {
                        CT_Document ctDocument = propertyCtDocument.GetValue(doc) as CT_Document;
                        if (ctDocument != null)
                        {
                            ArrayList items = ctDocument.body.Items;
                            List<DocumentBodyItemChoiceType> names = ctDocument.body.ItemsElementName;

                            int pos = doc.Paragraphs.IndexOf(loop.Templates[0]);
                            int globalPos = GetObjectIndex(names, DocumentBodyItemChoiceType.p, paragraphPos);

                            items[globalPos] = items[items.Count - 1];
                            names[globalPos] = names[items.Count - 1];
                            for (int i = items.Count - 2; i >= globalPos; i--)
                            {
                                items[i + 1] = items[i];
                                names[i + 1] = names[i];
                            }
                        }
                    }

                    //修改列表中的位置
                    FieldInfo propertyParagraphs = typeof(XWPFDocument).GetField("paragraphs", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public);
                    FieldInfo propertyBodyElements = typeof(XWPFDocument).GetField("bodyElements", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public);
                    if (propertyParagraphs != null && propertyBodyElements != null)
                    {
                        List<XWPFParagraph> paragraphs = propertyParagraphs.GetValue(doc) as List<XWPFParagraph>;
                        List<IBodyElement> bodyElements = propertyBodyElements.GetValue(doc) as List<IBodyElement>;

                        paragraphs.Remove(ph);
                        bodyElements.Remove(ph);
                        paragraphs.Insert(paragraphs.IndexOf(loop.Templates[0]), ph);
                        bodyElements.Insert(bodyElements.IndexOf(loop.Templates[0]), ph);
                    }

                    WordGenerator.CopyParagraph(templateph, ph);

                    foreach (XWPFRun run in ph.Runs)
                        WordGenerator.MergeField(run, row);
                }
            }

            //删除模板
            doc.RemoveBodyElement(doc.BodyElements.IndexOf(loop.StartParagraph));
            doc.RemoveBodyElement(doc.BodyElements.IndexOf(loop.EndParagraph));
            foreach (XWPFParagraph template in loop.Templates)
                doc.RemoveBodyElement(doc.BodyElements.IndexOf(template));
        }


        #endregion
    }
}