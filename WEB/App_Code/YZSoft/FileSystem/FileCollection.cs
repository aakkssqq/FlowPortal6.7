using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using BPM;
using BPM.Client;
using YZSoft.Web.DAL;

namespace YZSoft.FileSystem
{
    public class FileCollection: BPMList<File>
    {
        protected override string GetKey(File value)
        {
            return value.ID.ToString();
        }

        public void AppendUnique(FileCollection files)
        {
            foreach (File file in files)
            {
                if (!this.ContainsFileID(file.FileID))
                    this.Add(file);
            }
        }

        public bool ContainsFileID(string fileid)
        {
            File file = this.TryGetFileByID(fileid);
            return file == null ? false : true;
        }

        public File TryGetFileByID(string fileid)
        {
            foreach (File file in this)
            {
                if (String.Compare(file.FileID, fileid, true) == 0)
                {
                    return file;
                }
            }

            return null;
        }

        public AttachmentInfoCollection GetAllAttachmentInfo(IYZDbProvider provider, IDbConnection cn)
        {
            AttachmentInfoCollection attachments = new AttachmentInfoCollection();

            foreach (File file in this)
            {
                AttachmentInfo attachment = AttachmentManager.TryGetAttachmentInfo(provider, cn, file.FileID);
                if (attachment != null)
                    attachments.Add(attachment);
            }

            return attachments;
        }

        public FileCollection PerformAttachmentInfo(IYZDbProvider provider, IDbConnection cn, BPMConnection bpmcn)
        {
            FileCollection files = new FileCollection();

            foreach (File file in this)
            {
                if (file.PerformAttachmentInfo(provider, cn, bpmcn))
                    files.Add(file);
            }

            return files;
        }

        public DataTable ToDetailTable(string outputTableName)
        {
            DataTable table = new DataTable(outputTableName);
            table.Columns.Add("ID", typeof(string));
            table.Columns.Add("FolderID", typeof(string));
            table.Columns.Add("FileID", typeof(string));
            table.Columns.Add("AddBy", typeof(string));
            table.Columns.Add("AddAt", typeof(DateTime));
            table.Columns.Add("Comments", typeof(string));
            table.Columns.Add("Name", typeof(string));
            table.Columns.Add("Size", typeof(int));
            table.Columns.Add("Ext", typeof(string));
            table.Columns.Add("LastUpdate", typeof(DateTime));
            table.Columns.Add("OwnerAccount", typeof(string));

            foreach (File file in this)
            {
                DataRow row = table.NewRow();
                table.Rows.Add(row);

                row["ID"] = file.ID;
                row["FolderID"] = file.FolderID;
                row["FileID"] = file.FileID;
                row["Comments"] = file.Comments;
                row["AddBy"] = file.AddBy;
                row["AddAt"] = file.AddAt;
                row["Comments"] = file.Comments;

                if (file["Name"] != null)
                    row["Name"] = file["Name"];

                if (file["Size"] != null)
                    row["Size"] = file["Size"];

                if (file["Ext"] != null)
                    row["Ext"] = file["Ext"];

                if (file["LastUpdate"] != null)
                    row["LastUpdate"] = file["LastUpdate"];

                if (file["OwnerAccount"] != null)
                    row["OwnerAccount"] = file["OwnerAccount"];
            }

            return table;
        }
    }
}