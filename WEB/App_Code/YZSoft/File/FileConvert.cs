using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Diagnostics;
using GleamTech.DocumentUltimate;

namespace YZSoft.Web.File
{
    public class FileConvert
    {
        public static void Pdf2Html(string pdfPath)
        {
            string exePath = Path.Combine(System.AppDomain.CurrentDomain.SetupInformation.PrivateBinPath,"pdf2htmlEX\\pdf2htmlEX.exe");
            string lastErrorLine = null;

            Process p = new Process();

            p.StartInfo.FileName = exePath;
            p.StartInfo.Arguments = String.Format("{0}", Path.GetFileName(pdfPath));
            //p.StartInfo.Arguments = String.Format("--embed i {0}", Path.GetFileName(pdfPath));
            //p.StartInfo.Arguments = String.Format("--embed-css 1 --embed-font 1 --embed-image 1 --embed-javascript 1 --embed-outline 1 {0}", Path.GetFileName(pdfPath));

            p.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
            p.StartInfo.CreateNoWindow = true;
            p.StartInfo.UseShellExecute = false;
            p.StartInfo.WorkingDirectory = Path.GetDirectoryName(pdfPath);
            p.StartInfo.RedirectStandardInput = true;
            p.StartInfo.RedirectStandardOutput = true;
            p.StartInfo.RedirectStandardError = true;

            p.ErrorDataReceived += delegate(object o, DataReceivedEventArgs args){
                if(args.Data != null)
                {
                    lastErrorLine = args.Data;
                }
            };

            p.OutputDataReceived += delegate(object o, DataReceivedEventArgs args){
            };

            p.Start();

            p.BeginErrorReadLine();
            p.BeginOutputReadLine();

            p.WaitForExit();

            if (p.ExitCode != 0)
                throw new Exception(lastErrorLine);

            p.Close();
        }
    
        public static string Excel2Html(Stream stream,string ext)
        {
            string fileExtNoDot = ext == null ? "" : ext.TrimStart('.');
            string folder = Path.Combine(AttachmentManager.AttachmentRootPath, "temp");
            string fileName = "Excel_" + Guid.NewGuid().ToString();
            DocumentFormat excelFormat = (DocumentFormat)Enum.Parse(typeof(DocumentFormat), fileExtNoDot, true);

            string excelFile = Path.Combine(folder, String.Format("{0}.{1}", fileName, fileExtNoDot));
            Directory.CreateDirectory(folder);

            try
            {
                using (FileStream filestream = System.IO.File.Create(excelFile))
                {
                    stream.Seek(0, SeekOrigin.Begin);
                    stream.CopyTo(filestream);
                }

                DocumentConverterResult result = DocumentConverter.Convert(
                    new GleamTech.IO.BackSlashPath(excelFile),
                    new InputOptions(excelFormat),
                    DocumentFormat.Html
                );

                string htmlFile = result.OutputFiles[0];

                for(int i = 1 ; i < result.OutputFiles.Length ; i++)
                {
                    System.IO.File.Delete(result.OutputFiles[i]);
                }

                return htmlFile;
            }
            finally
            {
                System.IO.File.Delete(excelFile);
            }
        }
    }
}