using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;

namespace YZSoft.Services.REST.Attachment
{
    public partial class AssistHandler : AttachmentServiceBase
    {
        public AttachmentInfo GetAttachmentInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");
            AttachmentInfo rv;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                     rv = AttachmentManager.GetAttachmentInfo(provider, cn, fileid);
                }
            }

            rv.MimeType = YZMimeMapping.GetMimeType(rv.Ext);
            return rv;
        }

        public object GetFileSize(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileId = request.GetString("fileid");
            string filePath = AttachmentInfo.FileIDToPath(fileId, AttachmentManager.AttachmentRootPath);

            if (!File.Exists(filePath))
                throw new Exception(String.Format(Resources.YZStrings.Aspx_Upload_FileIDNotFount, fileId));

            FileInfo fileInfo = new FileInfo(filePath);
            return new
            {
                size = fileInfo.Length
            };
        }

        public AttachmentInfoCollection GetAttachmentsInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string[] ids = request.GetString("fileids").Split(',', ';');

            AttachmentInfoCollection attachments = new AttachmentInfoCollection();
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    attachments = AttachmentManager.GetAttachmentsInfo(provider, cn, ids);
                }
            }

            AttachmentInfoCollection rv = new AttachmentInfoCollection();
            foreach(string id in ids)
            {
                AttachmentInfo attachmentInfo = attachments.TryGetItem(id);
                if (attachmentInfo != null)
                    rv.Add(attachmentInfo);
            }
            return rv;
        }

        public object GetImageSize(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");
            Size size;

            AttachmentInfo attachment;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    attachment = AttachmentManager.TryGetAttachmentInfo(provider, cn, fileid);
                }
            }

            if (attachment == null)
            {
                size = new Size(55, 47);
            }
            else
            {

                if (attachment.LParam1 != -1)
                {
                    size = new Size(attachment.LParam1 / 10000, attachment.LParam1 % 10000);
                }
                else
                {
                    string filePath = this.GetImageFile(attachment, ScaleMode.None, 0, 0, null);
                    if (!String.IsNullOrEmpty(filePath))
                    {
                        size = this.GetImageSize(filePath);
                        attachment.LParam1 = size.Width * 10000 + size.Height;

                        using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                        {
                            using (IDbConnection cn = provider.OpenConnection())
                            {
                                AttachmentManager.Update(provider, cn, attachment);
                            }
                        }
                    }
                    else
                    {
                        if (YZMimeMapping.isVedioFile(attachment.Ext))
                            size = new Size(55, 47);
                        else
                            size = new Size(55, 47);
                    }
                }
            }

            return new {
                width = size.Width,
                height = size.Height
            };
        }

        public JObject GetFileInfoFromFileIDs(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string idstr = request.GetString("fileids","");

            JObject rv = new JObject();
            rv["success"] = true;

            JArray files = new JArray();
            rv["files"] = files;

            if (!String.IsNullOrEmpty(idstr))
            {
                string[] ids = idstr.Split(',', ';');
                AttachmentInfoCollection attachments;

                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {
                        attachments = AttachmentManager.GetAttachmentsInfo(provider, cn, ids);
                    }
                }

                foreach (AttachmentInfo attachment in attachments)
                {
                    JObject file = new JObject();
                    files.Add(file);

                    file["fileid"] = attachment.FileID;
                    file["name"] = attachment.Name;
                    file["type"] = attachment.Ext;
                    file["size"] = attachment.Size;
                }
            }

            return rv;
        }

        public void RenameFile(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");
            string newName = request.GetString("newName");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    AttachmentManager.Rename(provider, cn, fileid, newName);
                }
            }
        }

        public JObject Base64ImageFromFileID(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid", null);
            ScaleMode scale = request.GetEnum<ScaleMode>("scale", ScaleMode.None);
            ImageFormat format = YZImageHelper.ParseImageFormat(request.GetString("format", "png"));

            int width = 0;
            int height = 0;
            if (scale != ScaleMode.None)
            {
                width = request.GetInt32("width");
                height = request.GetInt32("height");
            }

            AttachmentInfo attachment;
            string filePath = this.GetImageFileFromFileID(fileid,scale,width,height,format,out attachment);
            if (String.IsNullOrEmpty(filePath))
            {
                if (YZMimeMapping.isVedioFile(attachment.Ext))
                    filePath = context.Server.MapPath("~/YZSoft/attachment/img/EmptyImageAttachment.png");
                else
                    filePath = context.Server.MapPath("~/YZSoft/attachment/img/EmptyImageAttachment.png");
            }

            string fileName = Path.GetFileNameWithoutExtension(attachment.Name) + Path.GetExtension(filePath);

            Bitmap bmp = new Bitmap(filePath);
            MemoryStream ms = new MemoryStream();
            bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
            byte[] arr = new byte[ms.Length];
            ms.Position = 0;
            ms.Read(arr, 0, (int)ms.Length);
            ms.Close();

            JObject rv = new JObject();
            rv["base64"] = Convert.ToBase64String(arr);
            return rv;
        }
    }
}