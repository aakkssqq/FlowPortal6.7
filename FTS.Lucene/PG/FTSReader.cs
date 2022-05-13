using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using Microsoft.Office.Interop.Word;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using System.IO;
using System.Data;
//using Microsoft.Office.Interop.Excel;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;

namespace FTS.PG
{
    public class FTSReader
    {
        public string ReadContent(FileInfo file) {
            switch (file.Extension.ToLower())
            {
                case ".pdf":
                    return ContentPdf(file.FullName);
                case ".doc":
                    //return ContentDoc(file.FullName);
                case ".docx":
                    //return ContentDoc(file.FullName);
                case ".ppt":
                    //return ContentPpt(file.FullName);
                case ".pptx":
                    //return ContentPpt(file.FullName);
                case ".xls":
                    return ContentExcel(file.FullName);
                //case ".xlsx":
                //    return ContentExcel(file.FullName);
                case ".txt":
                    return ContentTxt(file.FullName);
                default:
                    return "Err: Reader failure";
            }
        }

        /// <summary>ide
        /// 讀取doc、docx
        /// </summary>url
        /// <param name="filepath">文件路徑</param>
        /// <returns>字符串</returns>
        //private string ContentDoc(string filepath)
        //{
        //    Microsoft.Office.Interop.Word.Application app = new Microsoft.Office.Interop.Word.Application();//能夠打開word程序
        //    Document doc = null;//一會要記錄word打開的文檔
        //    object unknow = Type.Missing;
        //    app.Visible = true;
        //    string str = filepath;
        //    object file = str;
        //    doc = app.Documents.Open(ref file,
        //        ref unknow, ref unknow, ref unknow, ref unknow,
        //        ref unknow, ref unknow, ref unknow, ref unknow,
        //        ref unknow, ref unknow, ref unknow, ref unknow,
        //        ref unknow, ref unknow, ref unknow);
        //    //string temp = doc.Paragraphs[1].Range.Text.Trim();//分段讀取
        //    string temp = doc.Content.Text;
        //    return temp;
        //}

        /// <summary>
        /// 讀取ppt內容
        /// </summary>
        /// <param name="filepath"></param>
        /// <returns></returns>
        //private string ContentPpt(string filepath)
        //{
        //    Microsoft.Office.Interop.PowerPoint.Application pa = new Microsoft.Office.Interop.PowerPoint.Application();
        //    Microsoft.Office.Interop.PowerPoint.Presentation pp = pa.Presentations.Open(filepath,
        //                    Microsoft.Office.Core.MsoTriState.msoTrue,
        //                    Microsoft.Office.Core.MsoTriState.msoFalse,
        //                    Microsoft.Office.Core.MsoTriState.msoFalse);
        //    string pps = "";
        //    foreach (Microsoft.Office.Interop.PowerPoint.Slide slide in pp.Slides)
        //    {
        //        foreach (Microsoft.Office.Interop.PowerPoint.Shape shape in slide.Shapes)
        //            try
        //            {
        //                pps += shape.TextFrame.TextRange.Text.ToString();
        //            }
        //            catch (Exception) { }
                    
        //    }
        //    return pps;
        //}

        /// <summary>
        /// 讀取含有文本的pdf
        /// </summary>
        /// <param name="filepath">文件路徑</param>
        /// <returns>字符串</returns>
        private string ContentPdf(string filepath)
        {
            StringBuilder text = new StringBuilder();
            string fileName = filepath;
            if (System.IO.File.Exists(fileName))
            {
                PdfReader pdfReader = new PdfReader(fileName);
                for (int page = 1; page <= pdfReader.NumberOfPages; page++)
                {
                    ITextExtractionStrategy strategy = new SimpleTextExtractionStrategy();
                    string currentText = PdfTextExtractor.GetTextFromPage(pdfReader, page, strategy);
                    currentText = Encoding.UTF8.GetString(ASCIIEncoding.Convert(Encoding.Default, Encoding.UTF8, Encoding.Default.GetBytes(currentText)));
                    text.Append(currentText);
                }
                pdfReader.Close();
            }
            return text.ToString();
        }

        /// <summary>
        /// 讀取txt
        /// </summary>
        /// <param name="filepath">文件路徑</param>
        /// <returns>字符串</returns>
        private string ContentTxt(string filepath)
        {
            StringBuilder sb = new StringBuilder();
            //Open the stream and read it back.
            using (FileStream fs = new FileStream(filepath, FileMode.Open))
            {
                byte[] b = new byte[fs.Length];
                fs.Read(b, 0, b.Length);//把文件讀進byte[]裏面
                sb.Append(Encoding.GetEncoding("gb2312").GetString(b));//從byte[]裏面把數據轉成字符放到sb裏面
            }
            return sb.ToString();

        }

        public string ContentExcel(string filepath) {
            string text=string.Empty;
            string excelPath = filepath;

            using (FileStream fs = new FileStream(excelPath, FileMode.Open, FileAccess.Read))
            {
                //从文件柄创建对象
                HSSFWorkbook workbook = new HSSFWorkbook(fs);
                for (int k = 0; k < workbook.Count; k++)
                {
                    //通过名称查找sheet
                    HSSFSheet hsheet = (HSSFSheet)workbook[k];
                    //格式对象，用来格式化cell内容，一律返回字符串
                    DataFormatter df = new DataFormatter();

                    for (int i = 0; i < hsheet.LastRowNum; i++)
                    {
                        if (hsheet.GetRow(i) != null)
                        {
                            for (int j = 0; j < hsheet.GetRow(i).LastCellNum; j++)
                            {
                                text += hsheet.GetRow(i).GetCell(j);
                            }
                        }
                    }
                }
                
            }
            return text;
        }

        //public string Word2String(FileInfo file)
        //{
        //    object readOnly = true;
        //    object missing = System.Reflection.Missing.Value;
        //    object fileName = file.FullName;
        //    Microsoft.Office.Interop.Word.Application wordapp = new Microsoft.Office.Interop.Word.Application();

        //    Document doc = wordapp.Documents.Open(ref fileName,
        //    ref missing, ref readOnly, ref missing, ref missing, ref missing,
        //    ref missing, ref missing, ref missing, ref missing, ref missing,
        //    ref missing, ref missing, ref missing, ref missing, ref missing);
        //    string text = doc.Content.Text;
            
        //    doc.Close(ref missing, ref missing, ref missing);
        //    wordapp.Quit(ref missing, ref missing, ref missing);
        //    //StreamWriter swWordChange = new StreamWriter(txtfile.FullName, false, Encoding.GetEncoding("gb2312"));
        //    //swWordChange.Write(text);
        //    //swWordChange.Close();
        //    return text;
        //}

        //public void ppt2txt(FileInfo file, FileInfo txtfile)
        //{
        //    Microsoft.Office.Interop.PowerPoint.Application pa = new Microsoft.Office.Interop.PowerPoint.Application();
        //    Microsoft.Office.Interop.PowerPoint.Presentation pp = pa.Presentations.Open(file.FullName,
        //    Microsoft.Office.Core.MsoTriState.msoTrue,
        //    Microsoft.Office.Core.MsoTriState.msoFalse,
        //    Microsoft.Office.Core.MsoTriState.msoFalse);
        //    string pps = "";
        //    StreamWriter swPPtChange = new StreamWriter(txtfile.FullName, false, Encoding.GetEncoding("gb2312"));
        //    foreach (Microsoft.Office.Interop.PowerPoint.Slide slide in pp.Slides)
        //    {
        //        foreach (Microsoft.Office.Interop.PowerPoint.Shape shape in slide.Shapes)
        //            pps += shape.TextFrame.TextRange.Text.ToString();
        //    }
        //    swPPtChange.Write(pps);
        //    swPPtChange.Close();

        //}
    }
}
