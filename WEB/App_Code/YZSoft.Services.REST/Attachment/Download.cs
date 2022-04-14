using System;
using System.Web;
using System.Web.UI;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Win32;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using YZNPOI.HSSF.Util;
using YZNPOI.HSSF.UserModel;
using YZNPOI.POIFS.FileSystem;
using YZNPOI.SS.UserModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NReco.VideoConverter;
using BPM;
using BPM.Client;
using BPM.Client.Json.Converters;
using YZSoft.Web.DAL;
using iTextSharp.text.pdf;
using GleamTech.DocumentUltimate;
using YZSoft.Web.Excel;

namespace YZSoft.Services.REST.Attachment
{
    public partial class DownloadHandler : DownloadServiceBase
    {
        protected override void AuthCheck(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string method = request.GetString("method", "Download");

            if (NameCompare.EquName(method, "GetHeadshot"))
                return;

            YZAuthHelper.AshxAuthCheck();
        }

        public virtual void Download(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            bool osfile = request.GetBool("osfile", false);

            //if (context.Request.Headers["If-None-Match"] != null || context.Request.Headers["If-Modified-Since"] != null)
            //{
            //    context.Response.Status = "304 Not Modified";
            //    context.Response.Cache.AppendCacheExtension("max-age=" + 365 * 24 * 60 * 60);
            //    context.Response.Cache.SetExpires(DateTime.Now.AddYears(1));
            //    context.Response.AppendHeader("ETag", "Never_Modify");
            //    context.Response.Cache.SetETag("Never_Modify");
            //    context.Response.Cache.SetLastModified(DateTime.Now.AddMinutes(-1));
            //    context.Response.End();
            //    return;
            //}

            string filePath;
            string fileName;
            long fileSize;
            string fileExt;

            if (osfile)
            {
                string root = request.GetString("root");
                string path = request.GetString("path");
                fileName = request.GetString("name");
                string rootPath = YZSoft.FileSystem.OSDirectoryManager.GetRootPath(context, root);
                filePath = Path.Combine(rootPath, path, fileName);

                if (!File.Exists(filePath))
                    throw new Exception(String.Format(Resources.YZStrings.Aspx_Upload_FileIDNotFount, fileName));

                FileInfo fileInfo = new FileInfo(filePath);
                fileSize = fileInfo.Length;
                fileExt = fileInfo.Extension;
            }
            else
            {
                string fileId = request.GetString("fileid");

                AttachmentInfo attachment;
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {
                        attachment = AttachmentManager.GetAttachmentInfo(provider, cn, fileId);
                    }
                }

                fileName = attachment.Name;
                fileExt = attachment.Ext;
                fileSize = attachment.Size;
                filePath = AttachmentInfo.FileIDToPath(fileId, AttachmentManager.AttachmentRootPath);

                if (!File.Exists(filePath))
                    throw new Exception(String.Format(Resources.YZStrings.Aspx_Upload_FileIDNotFount, fileId));
            }

            string fileExtNoDot = fileExt == null ? "" : fileExt.TrimStart('.');

            bool contentDisposition = true;
            string range = context.Request.Headers["Range"];
            string contentType = YZMimeMapping.GetMimeType(fileExt);

            context.Response.AppendHeader("Content-Type", contentType);

            if (contentDisposition)
                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + context.Server.UrlEncode(fileName));

            context.Response.AppendHeader("Accept-Ranges", "bytes");

            if (range == null)
            {
                FileInfo fileinfo = new FileInfo(filePath);

                //全新下载
                context.Response.AppendHeader("Content-Length", fileinfo.Length.ToString());
                //context.Response.CacheControl = HttpCacheability.Public.ToString();
                //context.Response.Cache.AppendCacheExtension("max-age=" + 365 * 24 * 60 * 60);
                //context.Response.Cache.SetExpires(DateTime.Now.AddYears(1));
                //context.Response.AppendHeader("ETag", "Never_Modify");
                //context.Response.Cache.SetETag("Never_Modify");
                //context.Response.Cache.SetLastModified(DateTime.Now.AddMinutes(-1));

                context.Response.TransmitFile(filePath);
            }
            else
            {
                //断点续传以及多线程下载支持
                string[] file_range = range.Substring(6).Split(new char[1] { '-' });
                if (string.IsNullOrEmpty(file_range[0]))
                    file_range[0] = "0";
                if (string.IsNullOrEmpty(file_range[1]))
                    file_range[1] = fileSize.ToString();
                context.Response.Status = "206 Partial Content";
                context.Response.AppendHeader("Content-Range", "bytes " + file_range[0] + "-" + file_range[1] + "/" + fileSize.ToString());
                context.Response.AppendHeader("Content-Length", (Int32.Parse(file_range[1]) - Int32.Parse(file_range[0])).ToString());
                context.Response.TransmitFile(filePath, long.Parse(file_range[0]), (long)(Int32.Parse(file_range[1]) - Int32.Parse(file_range[0])));
            }
        }

        public virtual void DownloadTempFile(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileName = request.GetString("fileName");

            string folder = Path.Combine(AttachmentManager.AttachmentRootPath, "temp");
            string filePath = Path.Combine(folder,fileName);

            try
            {
                using (FileStream fs = File.OpenRead(filePath))
                {
                    fs.CopyTo(context.Response.OutputStream);
                }
            }
            finally
            {
                File.Delete(filePath);
            }
        }

        public virtual void Preview(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            bool osfile = request.GetBool("osfile", false);
            BPMObjectNameCollection supports = BPMObjectNameCollection.FromStringList(request.GetString("supports", null), ',');

            string filePath;
            string fileName;
            long fileSize;
            string fileExt;

            if (osfile)
            {
                string root = request.GetString("root");
                string path = request.GetString("path");
                fileName = request.GetString("name");
                string rootPath = YZSoft.FileSystem.OSDirectoryManager.GetRootPath(context, root);
                filePath = Path.Combine(rootPath, path, fileName);

                if (!File.Exists(filePath))
                    throw new Exception(String.Format(Resources.YZStrings.Aspx_Upload_FileIDNotFount, fileName));

                FileInfo fileInfo = new FileInfo(filePath);
                fileSize = fileInfo.Length;
                fileExt = fileInfo.Extension;
            }
            else
            {
                string fileId = request.GetString("fileid");

                AttachmentInfo attachment;
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {
                        attachment = AttachmentManager.GetAttachmentInfo(provider, cn, fileId);
                    }
                }

                fileName = attachment.Name;
                fileExt = attachment.Ext;
                fileSize = attachment.Size;
                filePath = AttachmentInfo.FileIDToPath(fileId, AttachmentManager.AttachmentRootPath);

                if (!File.Exists(filePath))
                    throw new Exception(String.Format(Resources.YZStrings.Aspx_Upload_FileIDNotFount, fileId));
            }

            string fileExtNoDot = fileExt == null ? "" : fileExt.TrimStart('.');

            //有请求格式并且请求格式非元文件格式
            if (supports.Count != 0 && !supports.Contains(fileExtNoDot))
            {
                //发现已有转换文件
                string existFile = null;
                foreach (string format in supports)
                {
                    string outputFile = Path.Combine(Path.GetDirectoryName(filePath), String.Format("{0}.{1}", Path.GetFileNameWithoutExtension(filePath), format));
                    if (File.Exists(outputFile))
                    {
                        existFile = outputFile;
                        break;
                    }
                }

                if (!String.IsNullOrEmpty(existFile))
                {
                    filePath = existFile;
                }
                else
                {
                    //转换文件
                    string targetExt = supports[0];
                    DocumentFormat targetFormat = (DocumentFormat)Enum.Parse(typeof(DocumentFormat), targetExt, true);
                    string outputFile = Path.Combine(Path.GetDirectoryName(filePath), String.Format("{0}.{1}", Path.GetFileNameWithoutExtension(filePath), targetExt));
                    DocumentFormat srcFormat = (DocumentFormat)Enum.Parse(typeof(DocumentFormat), fileExtNoDot, true);

                    if (srcFormat == DocumentFormat.Pdf && targetFormat == DocumentFormat.Html)
                    {
                        YZSoft.Web.File.FileConvert.Pdf2Html(filePath);
                        filePath = outputFile;
                    }
                    else
                    {
                        DocumentConverterResult result = DocumentConverter.Convert(
                            new GleamTech.IO.BackSlashPath(filePath),
                            new InputOptions(srcFormat),
                            new GleamTech.IO.BackSlashPath(outputFile),
                            targetFormat
                        );
                        filePath = result.OutputFiles[0];
                    }
                }

                fileExt = Path.GetExtension(filePath);
            }

            string range = context.Request.Headers["Range"];
            string contentType = YZMimeMapping.GetMimeType(fileExt);

            context.Response.AppendHeader("Content-Type", contentType);
            context.Response.AppendHeader("Accept-Ranges", "bytes");

            if (range == null)
            {
                FileInfo fileinfo = new FileInfo(filePath);

                //全新下载
                context.Response.AppendHeader("Content-Length", fileinfo.Length.ToString());
                //context.Response.CacheControl = HttpCacheability.Public.ToString();
                //context.Response.Cache.AppendCacheExtension("max-age=" + 365 * 24 * 60 * 60);
                //context.Response.Cache.SetExpires(DateTime.Now.AddYears(1));
                //context.Response.AppendHeader("ETag", "Never_Modify");
                //context.Response.Cache.SetETag("Never_Modify");
                //context.Response.Cache.SetLastModified(DateTime.Now.AddMinutes(-1));

                context.Response.TransmitFile(filePath);
            }
            else
            {
                //断点续传以及多线程下载支持
                string[] file_range = range.Substring(6).Split(new char[1] { '-' });
                context.Response.Status = "206 Partial Content";
                context.Response.AppendHeader("Content-Range", "bytes " + file_range[0] + "-" + file_range[1] + "/" + fileSize.ToString());
                context.Response.AppendHeader("Content-Length", (Int32.Parse(file_range[1]) - Int32.Parse(file_range[0]) + 1).ToString());
                context.Response.TransmitFile(filePath, long.Parse(file_range[0]), (long)(Int32.Parse(file_range[1]) - Int32.Parse(file_range[0]) + 1));
            }
        }

        public virtual void GetProcessThumbnail(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");
            string filePath = AttachmentInfo.FileIDToPath(fileid, AttachmentManager.AttachmentRootPath);
            string thumbnailPath = AttachmentManager.GetThumbnailPath(filePath, "thumbnail", "png");

            if (String.IsNullOrEmpty(thumbnailPath) || !File.Exists(thumbnailPath))
                thumbnailPath = context.Server.MapPath("~/YZSoft/attachment/img/Empty-ProcessThumbnail.png");

            this.ProcessResponseHeader(context, Path.GetFileName(thumbnailPath),true);
            context.Response.TransmitFile(thumbnailPath);
        }

        public virtual void GetBPATemplateThumbnail(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");
            string name = request.GetString("name");
            string templatePath = Path.Combine(context.Server.MapPath("~/YZSoft/BPA/templates/"),path,name);
            string thumbnailPath = AttachmentManager.GetThumbnailPath(templatePath, "thumbnail", "png");

            if (String.IsNullOrEmpty(thumbnailPath) || !File.Exists(thumbnailPath))
                thumbnailPath = context.Server.MapPath("~/YZSoft/attachment/img/Empty-ProcessThumbnail.png");

            this.ProcessResponseHeader(context, Path.GetFileName(thumbnailPath), true);
            context.Response.TransmitFile(thumbnailPath);
        }

        public virtual void GetHeadshot(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("account",null);
            string empty = request.GetString("empty", "Empty-Headshot.png");

            string filePath;
            if (!String.IsNullOrEmpty(account))
            {
                string userPath = this.GetUserPath(context, account);
                string imagePath = Path.Combine(userPath, "Headshot");

                FileInfo fileSrc = this.FindFile(imagePath, "Headshot.*");
                if (fileSrc == null)
                    fileSrc = new FileInfo(Path.Combine(imagePath, "Headshot"));

                string thumbnail = context.Request.Params["thumbnail"];
                filePath = this.GetOutputFile(fileSrc, thumbnail, ".png");
            }
            else
            {
                filePath = null;
            }

            if (String.IsNullOrEmpty(filePath) || !File.Exists(filePath))
                filePath = context.Server.MapPath("~/YZSoft/attachment/img/" + empty);

            string fileName = Path.GetFileName(filePath);
            this.ProcessResponseHeader(context, fileName, true);
            context.Response.TransmitFile(filePath);
        }

        public virtual void GetSignImage(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("account",null);

            string filePath;
            if (!String.IsNullOrEmpty(account))
            {
                string userPath = this.GetUserPath(context, account);
                string imagePath = Path.Combine(userPath, "Sign");

                FileInfo fileSrc = this.FindFile(imagePath, "Sign.*");
                if (fileSrc == null)
                    fileSrc = new FileInfo(Path.Combine(imagePath, "Sign"));

                string thumbnail = context.Request.Params["thumbnail"];
                filePath = this.GetOutputFile(fileSrc, thumbnail, ".png");
            }
            else
            {
                filePath = null;
            }

            if (String.IsNullOrEmpty(filePath) || !File.Exists(filePath))
                filePath = context.Server.MapPath("~/YZSoft/attachment/img/Empty-Sign.png");

            string fileName = Path.GetFileName(filePath);
            this.ProcessResponseHeader(context, fileName, true);
            context.Response.TransmitFile(filePath);
        }

        public virtual void XSDFromDataSetMap(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string filename = request.GetString("fileName", "schema.xsd");

            JObject jTables = JObject.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("map", null))));
            JsonSerializer serial = new JsonSerializer();
            serial.Converters.Add(new FlowDataSetConverter("TableName,MapTo", "ColumnName,DataType,MapTo"));

            FlowDataSet map = jTables.ToObject<FlowDataSet>(serial);
            foreach (FlowDataTable table in map.Tables)
            {
                if (!String.IsNullOrEmpty(table.MapTo))
                    table.TableName = table.MapTo;

                foreach (FlowDataColumn column in table.Columns)
                {
                    if (!String.IsNullOrEmpty(column.MapTo))
                        column.ColumnName = column.MapTo;
                }
            }

            this.ProcessResponseHeader(context, filename, true);
            map.ToDataSet().WriteXmlSchema(context.Response.OutputStream);
        }

        public virtual void SaveProcessAsFile(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string filename = request.GetString("fileName");

            JObject jProcess = JObject.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("process", null))));
            BPMProcess process = jProcess.ToObject<BPMProcess>();

            this.ProcessResponseHeader(context, filename, true);
            process.Save(context.Response.OutputStream);
        }

        public virtual void ExportBPAProcessAsFile(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string filename = request.GetString("fileName");
            string ext = request.GetString("ext",null);

            JObject jProcess = JObject.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("process", null))));
            JObject jChart = JObject.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("chart", null))));

            this.ProcessResponseHeader(context, filename + ext, true);
            using(System.IO.StreamWriter ws = new System.IO.StreamWriter(context.Response.OutputStream,System.Text.Encoding.UTF8))
                ws.Write(jProcess.ToString());
        }

        public virtual void ExportProcessAsPng(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string filename = request.GetString("fileName");
            string ext = request.GetString("ext", null);

            JObject jProcess = JObject.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("process", null))));
            JObject jChart = JObject.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("chart", null))));

            using (Bitmap image = this.DecodeCanvasChart(jChart))
            {
                this.ProcessResponseHeader(context, filename + ".png", true);
                image.Save(context.Response.OutputStream, ImageFormat.Png);
            }
        }

        public virtual void ExportProcessAsPdf(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string filename = request.GetString("fileName");
            string ext = request.GetString("ext", null);

            JObject jProcess = JObject.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("process", null))));
            JObject jChart = JObject.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("chart", null))));

            this.ProcessResponseHeader(context, filename + ".pdf", true);

            using (Bitmap image = this.DecodeCanvasChart(jChart))
            {
                float mmx;
                float mmy;

                using(Graphics g = Graphics.FromImage(image))
                {
                    mmx = (float)(image.Width * 25.4 / g.DpiX);
                    mmy = (float)(image.Height * 25.4 / g.DpiY);
                }

                float pointsx = iTextSharp.text.Utilities.MillimetersToPoints(mmx);
                float pointsy = iTextSharp.text.Utilities.MillimetersToPoints(mmy);

                iTextSharp.text.Rectangle pageSize = new iTextSharp.text.Rectangle(pointsx + 20, pointsy + 20);
                using (iTextSharp.text.Document doc = new iTextSharp.text.Document(pageSize, 10, 10, 10, 10))
                {
                    PdfWriter.GetInstance(doc, context.Response.OutputStream);
                    doc.Open();

                    iTextSharp.text.Image pic = iTextSharp.text.Image.GetInstance(image, ImageFormat.Png);
                    pic.ScaleAbsolute(pointsx, pointsy);
                    doc.Add(pic);
                }
            }
        }

        public virtual void DownloadXFormDesignerSetupPackage(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string filename = request.GetString("fileName");

            string filePath = context.Server.MapPath("~/YZSoft/BPM/XFormAdmin/Install/XFormDesigner.exe");
            this.ProcessResponseHeader(context, filename, true);
            context.Response.TransmitFile(filePath);
        }

        public virtual void ImageStreamFromFileID(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid", null);
            ScaleMode scale = request.GetEnum<ScaleMode>("scale", ScaleMode.None);
            ImageFormat format = YZImageHelper.ParseImageFormat(request.GetString("format", "png"));

            int width = 0;
            int height = 0;
            if (scale != ScaleMode.None)
            {
                width = Convert.ToInt32(request.GetDecimal("width"));
                height = Convert.ToInt32(request.GetDecimal("height"));
            }

            AttachmentInfo attachment;
            string filePath = this.GetImageFileFromFileID(fileid, scale, width, height, format, out attachment);
            if (String.IsNullOrEmpty(filePath))
            {
                if (attachment == null)
                {
                    filePath = context.Server.MapPath("~/YZSoft/attachment/img/EmptyImageAttachment.png");
                }
                else
                {
                    if (YZMimeMapping.isVedioFile(attachment.Ext))
                        filePath = context.Server.MapPath("~/YZSoft/attachment/img/EmptyImageAttachment.png");
                    else
                        filePath = context.Server.MapPath("~/YZSoft/attachment/img/EmptyImageAttachment.png");
                }
            }

            string fileName = Path.GetFileNameWithoutExtension(attachment == null ? "empty.png" : attachment.Name);
            if (String.IsNullOrEmpty(Path.GetExtension(filePath))) //原图
                fileName += attachment.Ext;
            else
                fileName += Path.GetExtension(filePath);

            this.ProcessResponseHeader(context, fileName, true);
            context.Response.TransmitFile(filePath);
        }

        public virtual void AudioStreamFromFileID(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileId = request.GetString("fileid");
            BPMObjectNameCollection supports = BPMObjectNameCollection.FromStringList(request.GetString("supports",null), ',');

            AttachmentInfo attachment;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    attachment = AttachmentManager.GetAttachmentInfo(provider, cn, fileId);
                }
            }

            string fileName = attachment.Name;
            string fileExt = attachment.Ext;
            string fileExtNoDot = fileExt == null ? "":fileExt.TrimStart('.');
            long fileSize = attachment.Size;
            string filePath = AttachmentInfo.FileIDToPath(fileId, AttachmentManager.AttachmentRootPath);

            if (!File.Exists(filePath))
                throw new Exception(String.Format(Resources.YZStrings.Aspx_Upload_FileIDNotFount, fileId));

            //有请求格式并且请求格式非元文件格式
            if (supports.Count != 0 && !supports.Contains(fileExtNoDot))
            {
                //发现已有转换文件
                string existFile = null;
                foreach (string format in supports)
                {
                    string outputFile = Path.Combine(Path.GetDirectoryName(filePath), String.Format("{0}.{1}", Path.GetFileNameWithoutExtension(filePath), format));
                    if (File.Exists(outputFile))
                    {
                        existFile = outputFile;
                        break;
                    }
                }

                if (!String.IsNullOrEmpty(existFile))
                {
                    filePath = existFile;
                }
                else
                {
                    //转换文件
                    string targetExt = supports[0];
                    string outputFile = Path.Combine(Path.GetDirectoryName(filePath), String.Format("{0}.{1}", Path.GetFileNameWithoutExtension(filePath), targetExt));

                    var ffMpeg = new NReco.VideoConverter.FFMpegConverter();
                    ffMpeg.ConvertMedia(filePath, fileExtNoDot, outputFile, targetExt, null);
                    filePath = outputFile;
                }
            }

            this.ProcessResponseHeader(context, fileName, true);
            context.Response.TransmitFile(filePath);
        }

        public virtual void VideoStreamFromFileID(HttpContext context)
        {
            //System.Threading.Thread.Sleep(6000);
            YZRequest request = new YZRequest(context);
            string fileId = request.GetString("fileid");
            BPMObjectNameCollection supports = BPMObjectNameCollection.FromStringList(request.GetString("supports", null), ',');

            AttachmentInfo attachment;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    attachment = AttachmentManager.GetAttachmentInfo(provider, cn, fileId);
                }
            }

            string fileName = attachment.Name;
            string fileExt = attachment.Ext;
            string fileExtNoDot = fileExt == null ? "" : fileExt.TrimStart('.');
            long fileSize = attachment.Size;
            string filePath = AttachmentInfo.FileIDToPath(fileId, AttachmentManager.AttachmentRootPath);

            if (!File.Exists(filePath))
                throw new Exception(String.Format(Resources.YZStrings.Aspx_Upload_FileIDNotFount, fileId));

            //有请求格式并且请求格式非元文件格式
            if (supports.Count != 0 && !supports.Contains(fileExtNoDot))
            {
                //发现已有转换文件
                string existFile = null;
                foreach (string format in supports)
                {
                    string outputFile = Path.Combine(Path.GetDirectoryName(filePath), String.Format("{0}.{1}", Path.GetFileNameWithoutExtension(filePath), format));
                    if (File.Exists(outputFile))
                    {
                        existFile = outputFile;
                        break;
                    }
                }

                if (!String.IsNullOrEmpty(existFile))
                {
                    filePath = existFile;
                }
                else
                {
                    //转换文件
                    string targetExt = supports[0];
                    string outputFile = Path.Combine(Path.GetDirectoryName(filePath), String.Format("{0}.{1}", Path.GetFileNameWithoutExtension(filePath), targetExt));

                    var ffMpeg = new NReco.VideoConverter.FFMpegConverter();
                    ffMpeg.ConvertMedia(filePath, fileExtNoDot, outputFile, targetExt, null);
                    filePath = outputFile;
                }
            }

            this.ProcessResponseHeader(context, fileName, true);
            context.Response.TransmitFile(filePath);
        }

        public virtual void ChartManagerImageService(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string id = request.GetString("id");

            string fileName;
            string blackImageFile;
            byte[] data = ChartManager.CurrentStore.Load(id, out fileName,out blackImageFile);

            if (data == null || data.Length == 0) //没图片数据
            {
                if (String.IsNullOrEmpty(blackImageFile))
                    blackImageFile = "~/YZSoft/theme/core/ui/s.gif"; //使用缺省空图片

                this.ProcessResponseHeader(context, "s.gif", true);
                context.Response.WriteFile(context.Server.MapPath(blackImageFile));
            }
            else
            {
                this.ProcessResponseHeader(context, fileName, true);
                context.Response.BinaryWrite(data);
            }

            ChartManager.CurrentStore.Delete(id);
        }

        #region excel

        public virtual void ExportGrid2Excel(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            bool dynamicParams = request.GetBool("dynamicParams",false);

            //获得数据 - jsonResponse
            string jsonResponse;

            JObject jRequest = JObject.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(context.Request.Params["request"])));
            string url = (string)jRequest["url"];
            url = "~/" + url;
            JToken jToken;
            using (StringWriter sw = new StringWriter())
            {
                HtmlTextWriter writer = new HtmlTextWriter(sw);
                HttpResponse response = new HttpResponse(writer);

                List<string> queryParams = new List<string>();
                queryParams.Add("DateFormat=text");
                foreach (KeyValuePair<string, JToken> property in (jRequest["params"] as JObject))
                    queryParams.Add(property.Key + "=" + HttpUtility.UrlEncode((string)property.Value, Encoding.Default));

                HttpRequest callrequest = new HttpRequest(null, context.Request.Url.ToString(), String.Join("&", queryParams.ToArray()));
                HttpContext callcontext = new HttpContext(callrequest, response);

                IHttpHandler handler = PageParser.GetCompiledPageInstance(url, context.Server.MapPath(url), context);
                handler.ProcessRequest(callcontext);

                jsonResponse = sw.ToString();

                jToken = JToken.Parse(jsonResponse);
                if (jToken is JObject)
                {
                    JObject jObject = jToken as JObject;
                    if (jObject["success"] != null && jObject["success"].Type == JTokenType.Boolean && (bool)jObject["success"] == false)
                        throw new Exception((string)jObject["errorMessage"]);
                }
            }

            //将数据转化为Table
            DataTable table;

            string rootProperty = request.GetString("rootProperty", null);
            JArray jTable;
            if (String.IsNullOrEmpty(rootProperty))
                jTable = jToken as JArray;
            else
                jTable = (jToken as JObject)[rootProperty] as JArray;

            foreach (JObject jRow in jTable)
            {
                foreach (KeyValuePair<string, JToken> jProperty in jRow)
                {
                    if (jProperty.Value is JArray)
                        jRow[jProperty.Key] = Convert.ToString(jProperty.Value);
                    if (jProperty.Value is JObject)
                        jRow[jProperty.Key] =  Convert.ToString(jProperty.Value);
                }
            }
            table = jTable.ToObject<DataTable>();

            table.TableName = "GridStore";

            //SQL Server数据库中monery4位小数点处理
            foreach (DataRow row in table.Rows)
            {
                foreach (DataColumn column in table.Columns)
                {
                    object value = row[column];
                    if (value is decimal)
                        value = (decimal)Decimal.ToDouble((decimal)value);

                    row[column] = value;

                }
            }

            //获得模板文件
            string templateFile = null;
            bool osfile = request.GetBool("osfile", false);
            if (osfile)
            {
                string templateFileName = request.GetString("templateFileName", null);
                if (!String.IsNullOrEmpty(templateFileName))
                {
                    string root = request.GetString("root");
                    string path = request.GetString("path");
                    string rootPath = YZSoft.FileSystem.OSDirectoryManager.GetRootPath(context, root);
                    templateFile = Path.Combine(rootPath, path, templateFileName);
                }
            }
            else
            {
                templateFile = request.GetString("templateExcel", null);
                if (!String.IsNullOrEmpty(templateFile))
                {
                    if (!templateFile.StartsWith("~/"))
                        templateFile = "~/" + templateFile;

                    templateFile = context.Server.MapPath(templateFile);
                }
            }

            //生成Excel
            HSSFWorkbook book = null;
            if (String.IsNullOrEmpty(templateFile))
            {
                book = this.NoTemplateExport(context, table);
            }
            else
            {
                Dictionary<string, string> reportParams = new Dictionary<string, string>();

                //获得查询参数
                foreach (KeyValuePair<string, JToken> property in (jRequest["params"] as JObject))
                    reportParams.Add(property.Key, (string)property.Value);

                if (!reportParams.ContainsKey("kwd"))
                    reportParams.Add("kwd", "");

                if (dynamicParams)
                {
                    string strRuntimeParams = reportParams["params"];
                    if (!String.IsNullOrEmpty(strRuntimeParams))
                    {
                        YZClientParamCollection runtimeParams = JArray.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(strRuntimeParams))).ToObject<YZClientParamCollection>();
                        foreach (YZClientParam clientParams in runtimeParams)
                            reportParams[clientParams.name] = Convert.ToString(clientParams.value);
                    }
                }

                //打开文件
                using (FileStream file = new FileStream(templateFile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                {
                    book = new HSSFWorkbook(file);
                }

                DataSet dataset = new DataSet();
                dataset.Tables.Add(table);
                ExcelGenerator.Fill(book, reportParams, dataset);
                ExcelGenerator.PrepareForOutput(book);
            }

            //Excel文件保存到流
            byte[] bytes;
            using (MemoryStream ms = new MemoryStream())
            {
                book.Write(ms);
                bytes = ms.ToArray();
            }

            //导出文件名
            string fileName = context.Request.Params["fileName"];
            if (String.IsNullOrEmpty(fileName))
                fileName = "Export";
            fileName += YZStringHelper.DateToString(DateTime.Now) + ".xls";

            this.ProcessResponseHeader(context, fileName, true);
            context.Response.BinaryWrite(bytes);

            //this.OnExported(context, table);

            //设置Response头
            //context.Response.Clear();
            //context.Response.ContentType = "application/vnd.ms-excel";
            //context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fileName, System.Text.Encoding.UTF8));
            //context.Response.AppendHeader("Content-Length", bytes.Length.ToString());

            //context.Response.BinaryWrite(bytes);
            //context.Response.End();
        }

        protected virtual HSSFWorkbook NoTemplateExport(HttpContext context, DataTable table)
        {
            YZRequest request = new YZRequest(context);
            string strGridColumns = request.GetString("columns",null);

            //获得列定义信息

            ExcelGenerator.ColumnDefineCollection columnDefines = new ExcelGenerator.ColumnDefineCollection();

            if (!String.IsNullOrEmpty(strGridColumns))
            {
                JArray jColumns = JArray.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(strGridColumns)));

                foreach (JObject jColumn in jColumns)
                {
                    ExcelGenerator.ColumnDefine columnDefine = new ExcelGenerator.ColumnDefine();

                    columnDefine.Text = (string)jColumn["text"];
                    columnDefine.ColumnName = (string)jColumn["dataIndex"];
                    columnDefine.Width = (int)jColumn["width"];
                    switch (((string)jColumn["align"]).ToLower())
                    {
                        case "center":
                            columnDefine.Align = YZNPOI.SS.UserModel.HorizontalAlignment.CENTER;
                            break;
                        case "right":
                            columnDefine.Align = YZNPOI.SS.UserModel.HorizontalAlignment.RIGHT;
                            break;
                        default:
                            columnDefine.Align = YZNPOI.SS.UserModel.HorizontalAlignment.LEFT;
                            break;
                    }

                    if (table.Columns.Contains(columnDefine.ColumnName))
                        columnDefines.Add(columnDefine);
                }
            }
            else
            {
                foreach (DataColumn column in table.Columns)
                {
                    ExcelGenerator.ColumnDefine columnDefine = new ExcelGenerator.ColumnDefine();

                    if (String.Compare(column.ColumnName, "ROWSTAT", true) == 0)
                        continue;

                    columnDefine.Text = column.ColumnName;
                    columnDefine.ColumnName = column.ColumnName;
                    columnDefine.Width = 100;

                    columnDefines.Add(columnDefine);
                }
            }

            return ExcelGenerator.NoTemplateExport(columnDefines, table);
        }

        #endregion

        public virtual void ConvertBase64Png(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string data = request.GetString("data");
            int bboxX = request.GetInt32("bboxX");
            int bboxY = request.GetInt32("bboxY");
            int bboxWidth = request.GetInt32("bboxWidth");
            int bboxHeight = request.GetInt32("bboxHeight");
            int width = request.GetInt32("width");
            int height = request.GetInt32("height");

            using (Bitmap image = YZImageHelper.FromBase64String(data))
            {
                using(Bitmap clipImage = YZImageHelper.ClipImage(image,new Rectangle(bboxX,bboxY,bboxWidth,bboxHeight)))
                {
                    using (Image thumbnailImage = YZImageHelper.CreateThumbnail(clipImage, width, height))
                    {
                        using (Image finalImage = YZImageHelper.CenterImage(thumbnailImage, width, height))
                        {
                            using (MemoryStream ms = new MemoryStream())
                            {
                                finalImage.Save(ms, System.Drawing.Imaging.ImageFormat.Png);

                                byte[] bytes = ms.GetBuffer();
                                this.ProcessResponseHeader(context, "export.png", true);
                                context.Response.BinaryWrite(bytes);
                            }
                        }
                    }
                }
            }
        }

        public virtual void DownloadXFormDesignerAssembly(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileName = HttpUtility.UrlDecode(request.GetString("filename")); //不知为何，路径中带%5C(即为：/)

            string path = context.Server.MapPath("~/YZSoft/BPM/XFormAdmin/Install/SyncFiles/");

            if (!Directory.Exists(path))
                return;

            string filePath = Path.Combine(path, fileName);

            this.ProcessResponseHeader(context, fileName, true);
            context.Response.TransmitFile(filePath);
        }

        private Bitmap DecodeCanvasChart(JObject jChart)
        {
            int bboxX = (int)jChart["bboxX"];
            int bboxY = (int)jChart["bboxY"];
            int bboxWidth = (int)jChart["bboxWidth"];
            int bboxHeight = (int)jChart["bboxHeight"];
            string imageBase64data = (string)jChart["data"];

            using (Bitmap image = YZImageHelper.FromBase64String(imageBase64data))
            {
                return YZImageHelper.ClipImage(image, new Rectangle(bboxX, bboxY, bboxWidth, bboxHeight));
            }
        }
    }
}
