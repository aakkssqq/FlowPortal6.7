using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Data;
using Microsoft.Win32;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;

namespace YZSoft.Services.REST.Attachment
{
    public abstract class AttachmentServiceBase : YZServiceHandler
    {
        public enum ScaleMode
        {
            Scale,
            Fit,
            AutoScale,
            None
        }

        //mode fortmat:[Alias]=[width]x[height][model]
        //S=200x200S S:按比例缩放
        //M=300x300F F:fit缩放
        //300x300F
        public class Mode
        {
            public int Width;
            public int Height;
            public ScaleMode Scale;
            public string Alias;
            public ImageFormat Format;

            public Mode()
            {
            }

            public Mode(string alias, ScaleMode scale, int width, int height, ImageFormat format)
            {
                this.Alias = alias;
                this.Width = width;
                this.Height = height;
                this.Scale = scale;
                this.Format = format;
            }

            public static Mode Parse(string strMode)
            {
                Mode mode = new Mode();

                if (String.IsNullOrEmpty(strMode))
                    return null;

                strMode.Trim();

                string[] alias = strMode.Split('=');
                if (alias.Length == 1)
                {
                    strMode = alias[0];
                }
                else if (alias.Length == 2)
                {
                    mode.Alias = alias[0];
                    strMode = alias[1];
                }
                else
                {
                    return null;
                }

                char lastChar = strMode[strMode.Length - 1];
                if (lastChar == 'S' || lastChar == 's')
                {
                    mode.Scale = ScaleMode.Scale;
                    strMode = strMode.Substring(0, strMode.Length - 1);
                }
                else if (lastChar == 'F' || lastChar == 'f')
                {
                    mode.Scale = ScaleMode.Fit;
                    strMode = strMode.Substring(0, strMode.Length - 1);
                }
                else
                {
                    mode.Scale = ScaleMode.Scale;
                }

                string[] modes = strMode.Split('x', 'X');
                if (modes.Length < 2)
                    return null;

                if (!Int32.TryParse(modes[0], out mode.Width) ||
                    !Int32.TryParse(modes[1], out mode.Height))
                    return null;

                return mode;
            }

            public string FileNameAddition
            {
                get
                {
                    string additionName;

                    if (String.IsNullOrEmpty(this.Alias))
                        additionName = String.Format("{0}x{1}", this.Width, this.Height);
                    else
                        additionName = this.Alias;

                    return "-" + additionName;
                }
            }
        }

        public virtual string GetSystemUserDataPath(HttpContext context)
        {
            if (YZSetting.UserDataPath.StartsWith("~/"))
                return context.Server.MapPath(YZSetting.UserDataPath);
            return YZSetting.UserDataPath;
        }

        public virtual string GetUserPath(HttpContext context, string account)
        {
            return Path.Combine(this.GetSystemUserDataPath(context), account);
        }

        public virtual void EmptyFolder(string path)
        {
            if (Directory.Exists(path))
            {
                DirectoryInfo folder = new DirectoryInfo(path);
                this.EmptyFolder(folder);
            }
        }

        public virtual void EmptyFolder(DirectoryInfo folder)
        {
            foreach (FileInfo file in folder.GetFiles())
                file.Delete();

            foreach (DirectoryInfo dir in folder.GetDirectories())
                dir.Delete(true);
        }

        public virtual FileInfo FindFile(string path, string fileName)
        {
            DirectoryInfo folder = new DirectoryInfo(path);
            if (!folder.Exists)
                return null;

            FileInfo[] files = folder.GetFiles(fileName, SearchOption.TopDirectoryOnly);

            if (files.Length >= 1)
                return files[0];
            else
                return null;
        }

        public virtual string GetOutputFile(FileInfo srcFileInfo, string thumbnail, string ext)
        {
            if (srcFileInfo == null)
                return null;

            if (String.IsNullOrEmpty(thumbnail))
                return srcFileInfo.FullName;

            if (String.IsNullOrEmpty(ext))
                ext = srcFileInfo.Extension;

            return Path.Combine(
                srcFileInfo.DirectoryName,
                Path.GetFileNameWithoutExtension(srcFileInfo.Name) + "-" + thumbnail + ext
            );
        }

        public virtual string GetThumbnailPath(string filePath, Mode mode)
        {
            string ext;

            if (mode.Format == null)
                ext = Path.GetExtension(filePath);
            else
                ext = "." + mode.Format.ToString().ToLower();

            string path = Path.Combine(
                Path.GetDirectoryName(filePath),
                Path.GetFileNameWithoutExtension(filePath) + mode.FileNameAddition + ext
            );

            return path;
        }

        public virtual string MakeThumbnail(string filePath, Mode mode)
        {
            using (Image originalImage = Image.FromFile(filePath))
            {
                return this.MakeThumbnail(originalImage, filePath, mode);
            }
        }

        public virtual string MakeThumbnail(Image originalImage, string filePath, Mode mode)
        {
            string thumbnailPath = this.GetThumbnailPath(filePath, mode);

            int ow = originalImage.Width;
            int oh = originalImage.Height;
            int w = 0;
            int h = 0;
            if (mode.Scale == ScaleMode.Fit)
            {
                w = mode.Width;
                h = mode.Height;
            }
            else
            {
                if (mode.Scale == ScaleMode.AutoScale)
                {
                    if (mode.Width >= ow && mode.Height >= oh)
                        return filePath;
                }

                int maxWidth = Math.Min(mode.Width, ow);
                int maxHeight = Math.Min(mode.Height, oh);

                decimal rate = Math.Min((decimal)maxWidth / (decimal)ow, (decimal)maxHeight / (decimal)oh);
                w = (int)(ow * rate);
                h = (int)(oh * rate);
            }

            //新建一个bmp图片
            using (System.Drawing.Image bitmap = new System.Drawing.Bitmap(w, h))
            {
                //新建一个画板
                using (Graphics g = System.Drawing.Graphics.FromImage(bitmap))
                {
                    //设置高质量插值法
                    g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.Default;

                    //设置高质量,低速度呈现平滑程度
                    g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighSpeed;

                    //清空画布并以透明背景色填充
                    g.Clear(Color.Transparent);

                    //在指定位置并且按指定大小绘制原图片的指定部分
                    g.DrawImage(originalImage, new Rectangle(0, 0, w, h), new Rectangle(0, 0, ow, oh), GraphicsUnit.Pixel);


                    //以jpg格式保存缩略图
                    bitmap.Save(thumbnailPath, mode.Format == null ? originalImage.RawFormat : mode.Format);
                }
            }

            return thumbnailPath;
        }

        protected virtual void ProcessResponseHeader(HttpContext context, string fileName,bool attachment)
        {
            string fileExt = Path.GetExtension(fileName);
            string contentType = YZMimeMapping.GetMimeType(fileExt);

            fileName = context.Server.UrlEncode(fileName);
            fileName = fileName.Replace("%5b", "[");
            fileName = fileName.Replace("%5d", "]");

            context.Response.AppendHeader("Content-Type", contentType);
            if (attachment)
                context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + fileName);
            else
                context.Response.AppendHeader("Content-Disposition", "filename=" + fileName);

            context.Response.AppendHeader("Accept-Ranges", "bytes");
        }

        #region Image支持

        protected virtual Size GetImageSize(string filePath)
        {
            using (FileStream stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                using (System.Drawing.Image image = System.Drawing.Image.FromStream(stream))
                {
                    return new Size(image.Width, image.Height);
                }
            }
        }

        protected virtual string GetImageFile(AttachmentInfo attachment, ScaleMode scale, int width, int height, ImageFormat format)
        {
            if (attachment == null)
                return null;

            string filePath;

            if (YZMimeMapping.isVedioFile(attachment.Ext))
                filePath = this.GetVideoOutputFile(attachment, scale, width, height, format, null);
            else
                filePath = this.GetImageOutputFile(attachment, scale, width, height, format, null);

            return filePath;
        }

        protected virtual string GetImageFileFromFileID(string fileid, ScaleMode scale, int width, int height, ImageFormat format, out AttachmentInfo attachment)
        {
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    attachment = AttachmentManager.TryGetAttachmentInfo(provider, cn, fileid);
                }
            }

            return this.GetImageFile(attachment, scale, width, height, format);
        }

        protected virtual string GetImageOutputFile(AttachmentInfo attachment, ScaleMode scale, int width, int height, ImageFormat format, string emptyFile)
        {
            string fileName = attachment.Name;
            string fileExt = attachment.Ext;
            string srcFilePath = AttachmentInfo.FileIDToPath(attachment.FileID, AttachmentManager.AttachmentRootPath);

            if (File.Exists(srcFilePath))
            {
                if (scale != ScaleMode.None)
                {
                    Mode mode = new Mode(String.Format("{0}x{1}", width, height), scale, width, height, format);

                    string thumbnailPath = this.GetThumbnailPath(srcFilePath, mode);
                    if (!File.Exists(thumbnailPath))
                        thumbnailPath = this.MakeThumbnail(srcFilePath, mode);

                    return thumbnailPath;
                }
                else
                {
                    return srcFilePath;
                }
            }
            else
            {
                return emptyFile;
            }
        }

        protected virtual string GetVideoOutputFile(AttachmentInfo attachment, ScaleMode scale, int width, int height, ImageFormat format, string emptyFile)
        {
            string fileName = attachment.Name;
            string fileExt = attachment.Ext;
            string srcFilePath = AttachmentInfo.FileIDToPath(attachment.FileID, AttachmentManager.AttachmentRootPath);

            if (File.Exists(srcFilePath))
            {
                if (scale != ScaleMode.None)
                {
                    string imgFilePath = this.MakeVideoThumbnail(srcFilePath);

                    Mode mode = new Mode(String.Format("{0}x{1}", width, height), scale, width, height, format);
                    string thumbnailPath = this.GetThumbnailPath(imgFilePath, mode);
                    if (!File.Exists(thumbnailPath))
                        thumbnailPath = this.MakeThumbnail(imgFilePath, mode);

                    return thumbnailPath;
                }
                else
                {
                    return this.MakeVideoThumbnail(srcFilePath);
                }
            }
            else
            {
                return emptyFile;
            }
        }

        protected virtual string MakeVideoThumbnail(string filePath)
        {
            string outputFile = filePath + ".jpeg";

            var ffMpeg = new NReco.VideoConverter.FFMpegConverter();
            ffMpeg.GetVideoThumbnail(filePath, outputFile);

            return outputFile;
        }

        #endregion
    }
}