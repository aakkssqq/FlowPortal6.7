using System;
using System.Text;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using System.IO;
using EPocalipse.IFilter;

namespace FTS.PG
{
    public class FTSReader
    {
        private string singlequote = "&apos;";
        private string doublequote = "&quot";

        public string ReadContent(FileInfo file)
        {
            Console.WriteLine($@"[ReadContent] 讀取檔案內容 檔案名稱 : {file.Name}");
            try
            {
                switch (file.Extension.ToLower())
                {
                    case ".pdf":
                        return ContentPdf(file.FullName).Replace("'", singlequote).Replace("\"", doublequote);
                    default:
                        return ContentReader(file.FullName.Replace("'", singlequote).Replace("\"", doublequote));
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("[ReadContent] 執行錯誤 錯誤訊息 : {e.Message}");
                throw new Exception($@"FilePath:{file.FullName} ErrMsg : {e.Message}");
            }

        }

        /// <summary>
        /// 讀取ppt內容
        /// </summary>
        /// <param name="filepath"></param>
        /// <returns></returns>
        private string ContentReader(string filepath)
        {
            string text = string.Empty;
            string pptxPath = filepath;

            TextReader reader = new FilterReader(filepath);
            using (reader)
            {
                text += reader.ReadToEnd();
            }
            return text;
        }

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
                //sb.Append(Encoding.Default.GetString(b));
                sb.Append(Encoding.GetEncoding("utf-8").GetString(b));
                //sb.Append(Encoding.GetEncoding("gb2312").GetString(b));//從byte[]裏面把數據轉成字符放到sb裏面
            }
            return sb.ToString();

        }
    }
}
