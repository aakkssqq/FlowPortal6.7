using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Collections.Generic;
using System.Data.SqlClient;
using BPM;
using BPM.Client;
using YZSoft.Web.DAL;
using System.IO;
using NPOI.XWPF.UserModel;
using YZNPOI.HSSF.UserModel;

/// <summary>
/// YZAttachmentHelp 的摘要说明
/// </summary>
public class AttachmentManager
{
    private static string _attachmentBaseUrl = null;
    private static string _attachmentRootPath = null;
    private delegate void SaveDocument(object obj, string savePath);

    public static AttachmentInfo SaveAsAttachment(HSSFWorkbook doc, AttachmentInfo attachment)
    {
        return AttachmentManager.SaveAsAttachment(doc, attachment, new SaveDocument(SaveHSSFWorkbook));
    }

    public static AttachmentInfo SaveAsAttachment(XWPFDocument doc, AttachmentInfo attachment)
    {
        return AttachmentManager.SaveAsAttachment(doc, attachment, new SaveDocument(SaveXWPFDocument));
    }

    public static AttachmentInfo SaveAsAttachment(HttpPostedFile doc, AttachmentInfo attachment)
    {
        return AttachmentManager.SaveAsAttachment(doc, attachment, new SaveDocument(SaveHttpPostedFile));
    }

    public static AttachmentInfo SaveAsAttachment(Stream stream, AttachmentInfo attachment)
    {
        return AttachmentManager.SaveAsAttachment(stream, attachment, new SaveDocument(SaveStream));
    }

    public static AttachmentInfo SaveAsAttachment(string path, AttachmentInfo attachment)
    {
        using (FileStream stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
        {
            return AttachmentManager.SaveAsAttachment(stream, attachment, new SaveDocument(SaveStream));
        }
    }

    private static void SaveHSSFWorkbook(object obj, string savePath)
    {
        HSSFWorkbook doc = obj as HSSFWorkbook;
        using (FileStream stream = File.Create(savePath))
        {
            doc.Write(stream);
        }
    }

    private static void SaveXWPFDocument(object obj, string savePath)
    {
        XWPFDocument doc = obj as XWPFDocument;
        using (FileStream stream = File.Create(savePath))
        {
            doc.Write(stream);
        }
    }

    private static void SaveHttpPostedFile(object obj, string savePath)
    {
        HttpPostedFile file = obj as HttpPostedFile;
        file.SaveAs(savePath);
    }

    private static void SaveStream(object obj, string savePath)
    {
        Stream srcStream = obj as Stream;
        using (FileStream stream = File.Create(savePath))
        {
            srcStream.CopyTo(stream);
        }
    }

    private static AttachmentInfo SaveAsAttachment(object doc, AttachmentInfo attachment, SaveDocument saveDocument)
    {
        string fileId = AttachmentManager.GetNewFileID();
        string savePath = AttachmentInfo.FileIDToPath(fileId, AttachmentManager.AttachmentRootPath);

        Directory.CreateDirectory(savePath.Substring(0, savePath.LastIndexOf(@"\")));
        saveDocument.Invoke(doc, savePath);

        attachment.FileID = fileId;
        if (String.IsNullOrEmpty(attachment.Name))
            attachment.Name = fileId + attachment.Ext;

        //attachment.Name = fileName;
        //attachment.Ext = fileExt;
        //attachment.Size = fileSize;
        attachment.LastUpdate = DateTime.Now;
        attachment.OwnerAccount = YZAuthHelper.LoginUserAccount;
        FileInfo fileInfo = new FileInfo(savePath);
        attachment.Size = fileInfo.Length;

        using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
        {
            using (IDbConnection cn = provider.OpenConnection())
            {
                provider.Insert(cn, attachment);
            }
        }

        return attachment;
    }

    public static AttachmentInfo UpdateAttachment(IYZDbProvider provider, IDbConnection cn, string fileid, string replacewithfileid)
    {
        AttachmentInfo attachmentInfo = AttachmentManager.GetAttachmentInfo(provider, cn, fileid);
        AttachmentInfo attachmentInfoReplaceWith = AttachmentManager.GetAttachmentInfo(provider, cn, replacewithfileid);

        File.Copy(attachmentInfoReplaceWith.FileInfo.FullName, attachmentInfo.FileInfo.FullName, true);
        attachmentInfo.Name = attachmentInfoReplaceWith.Name;
        attachmentInfo.Ext = attachmentInfoReplaceWith.Ext;
        attachmentInfo.Size = attachmentInfoReplaceWith.Size;
        attachmentInfo.LastUpdate = DateTime.Now;
        attachmentInfo.OwnerAccount = attachmentInfoReplaceWith.OwnerAccount;

        AttachmentManager.Update(provider, cn, attachmentInfo);
        return attachmentInfo;
    }

    public static string GetNewFileID()
    {
        using (BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();

            //确保不覆盖已存在的物理文件
            string fileId;
            string savePath;
            do
            {
                fileId = cn.GetSerialNum("yz_sys_att" + DateTime.Today.ToString("yyyyMMdd"), 4, 1, 1);
                fileId = fileId.Substring("yz_sys_att".Length);

                savePath = AttachmentInfo.FileIDToPath(fileId, AttachmentManager.AttachmentRootPath);
            } while (File.Exists(savePath));

            return fileId;
        }
    }

    public static string AttachmentBaseURL
    {
        get
        {
            if (AttachmentManager._attachmentBaseUrl == null)
                AttachmentManager._attachmentBaseUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["AttachmentBaseURL"];

            return AttachmentManager._attachmentBaseUrl;
        }
    }

    public static string AttachmentRootPath
    {
        get
        {
            if (AttachmentManager._attachmentRootPath == null)
                AttachmentManager._attachmentRootPath = System.Web.Configuration.WebConfigurationManager.AppSettings["AttachmentRootPath"];

            return AttachmentManager._attachmentRootPath;
        }
    }

    public static void Insert(IYZDbProvider provider, IDbConnection cn, AttachmentInfo attachment)
    {
        try
        {
            provider.Insert(cn, attachment);
        }
        catch (Exception e)
        {
            throw new BPMException(BPMExceptionType.DBInsertDataErr, "YZAppAttachment", e.Message);
        }
    }

    public static void Update(IYZDbProvider provider, IDbConnection cn, AttachmentInfo attachment)
    {
        try
        {
            provider.Update(cn, attachment);
        }
        catch (Exception e)
        {
            throw new BPMException(BPMExceptionType.DBUpdateDataErr, "YZAppAttachment", e.Message);
        }
    }

    public static void Delete(IYZDbProvider provider, IDbConnection cn, string fileid)
    {
        try
        {
            provider.DeleteAttachment(cn, fileid);
        }
        catch (Exception e)
        {
            throw new BPMException(BPMExceptionType.DBDeleteDataErr, "YZAppAttachment", e.Message);
        }
    }

    public static string GetThumbnailPath(string filePath, string postfix, string ext)
    {
        string path = System.IO.Path.Combine(
            System.IO.Path.GetDirectoryName(filePath),
            String.Format("{0}.{1}.{2}",System.IO.Path.GetFileName(filePath),postfix,ext)
        );

        return path;
    }

    public static AttachmentInfoCollection GetAttachmentsInfo(IYZDbProvider provider, IDbConnection cn, string[] fileIds)
    {
        AttachmentInfoCollection rv = new AttachmentInfoCollection();

        using (IDataReader reader = provider.GetAttachmentsInfo(cn, fileIds))
        {
            while (reader.Read())
                rv.Add(new AttachmentInfo(reader, AttachmentManager.AttachmentRootPath));
        }

        return rv;
    }

    public static AttachmentInfo TryGetAttachmentInfo(IYZDbProvider provider, IDbConnection cn, string fileId)
    {
        if (String.IsNullOrEmpty(fileId))
            throw new Exception(Resources.YZStrings.Aspx_Upload_EmptyFileID);

        AttachmentInfoCollection attachments = AttachmentManager.GetAttachmentsInfo(provider, cn, new string[] { fileId });

        if (attachments.Count == 0)
            return null;

        return attachments[0];
    }


    public static AttachmentInfo GetAttachmentInfo(IYZDbProvider provider, IDbConnection cn, string fileId)
    {
        if (String.IsNullOrEmpty(fileId))
            throw new Exception(Resources.YZStrings.Aspx_Upload_EmptyFileID);

        AttachmentInfo attachmentInfo = AttachmentManager.TryGetAttachmentInfo(provider, cn, fileId);

        if (attachmentInfo == null)
            throw new Exception(String.Format(Resources.YZStrings.Aspx_Upload_FileIDNotFount, fileId));

        return attachmentInfo;
    }

    public static void Rename(IYZDbProvider provider, IDbConnection cn, string fileId, string newName)
    {
        provider.RenameAttachment(cn,fileId, newName);
    }

    public static AttachmentInfo CloneFile(IYZDbProvider provider, IDbConnection cn, string fileid, string newFileName)
    {
        AttachmentInfo attachmentInfo = AttachmentManager.GetAttachmentInfo(provider, cn, fileid);
        return CloneFile(provider, cn, attachmentInfo, newFileName);
    }

    public static AttachmentInfo CloneFile(IYZDbProvider provider, IDbConnection cn, AttachmentInfo attachmentInfo, string newFileName)
    {
        string srcfileid = attachmentInfo.FileID;
        string srcfilePath = AttachmentInfo.FileIDToPath(srcfileid, AttachmentManager.AttachmentRootPath);
        string srcFolder = Path.GetDirectoryName(srcfilePath);
        string srcfilename = Path.GetFileName(srcfilePath);

        string newfileId = AttachmentManager.GetNewFileID();
        string tagfilePath = AttachmentInfo.FileIDToPath(newfileId, AttachmentManager.AttachmentRootPath);
        string tagFolder = Path.GetDirectoryName(tagfilePath);
        string tagfilename = Path.GetFileName(tagfilePath);

        Directory.CreateDirectory(tagFolder);

        DirectoryInfo srcDir = new DirectoryInfo(srcFolder);
        FileInfo[] files = srcDir.GetFiles(srcfilename + "*");

        foreach (FileInfo fileInfo in files)
        {
            if ((fileInfo.Attributes & FileAttributes.Directory) == 0 &&
                (fileInfo.Attributes & FileAttributes.System) == 0 &&
                (fileInfo.Attributes & FileAttributes.Hidden) == 0)
            {
                string srcfile = fileInfo.FullName;
                string tagfile = Path.Combine(tagFolder, tagfilename + fileInfo.Name.Substring(srcfilename.Length));
                File.Copy(srcfile, tagfile, true);
            }
        }

        attachmentInfo.FileID = newfileId;
        attachmentInfo.Name = newFileName;
        attachmentInfo.OwnerAccount = YZAuthHelper.LoginUserAccount;
        provider.Insert(cn, attachmentInfo);

        return attachmentInfo;
    }

    // 根据附件ID得到附件的URL
    public static string GetAttachmentURL(string id)
    {
        return GetAttachmentURL(id, "download", new Dictionary<string, string>());
    }

    public static string GetAttachmentURL(string id, string action, Dictionary<string, string> option)
    {
        if (String.IsNullOrEmpty(id))
            throw new Exception(Resources.YZStrings.Aspx_Invalid_FileID);

        switch (action)
        {
            case "view":    // 查看操作(仅限图片)
                if ("|max|min|crop|crop_top|".IndexOf("|" + option["method"] + "|") == -1)
                    option["method"] = "crop";
                return AttachmentBaseURL + "/default.ashx?" + id + "&view=" + option["method"] + "-" + option["width"] + "-" + option["height"];
            default:    //不指定操作, 则默认为下载
                return AttachmentBaseURL + "/default.ashx?" + id;
        }

    }
}
