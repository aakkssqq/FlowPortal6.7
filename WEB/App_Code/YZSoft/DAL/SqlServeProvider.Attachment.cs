using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Drawing;
using System.Threading;
using System.Collections.Generic;
using System.Text;
using System.Data.Common;
using System.Data.SqlClient;
using BPM;

namespace YZSoft.Web.DAL
{
    partial class SqlServerProvider
    {
        public IDataReader GetAttachmentsInfo(IDbConnection cn, string[] fileids)
        {
            List<string> ids = new List<string>();
            for (int i = 0; i < fileids.Length; i++)
                ids.Add("N'" + this.EncodeText(fileids[i]) + "'");

            string filter = ids.Count == 0 ? "1=0" : String.Format("WHERE FileID IN({0})", String.Join(",", ids.ToArray()));
            string query = String.Format("SELECT * FROM YZAppAttachment {0}", filter);

            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = query;

                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, AttachmentInfo attInfo)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "INSERT INTO YZAppAttachment(FileID,Name,Ext,Size,LastUpdate,OwnerAccount,LParam1) values(@FileID,@Name,@Ext,@Size,@LastUpdate,@OwnerAccount,@LParam1)";

                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = attInfo.FileID;
                cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = attInfo.Name;
                cmd.Parameters.Add("@Ext", SqlDbType.NVarChar).Value = attInfo.Ext;
                cmd.Parameters.Add("@Size", SqlDbType.Int).Value = attInfo.Size;
                cmd.Parameters.Add("@LastUpdate", SqlDbType.DateTime).Value = attInfo.LastUpdate;
                cmd.Parameters.Add("@OwnerAccount", SqlDbType.NVarChar).Value = attInfo.OwnerAccount;
                cmd.Parameters.Add("@LParam1", SqlDbType.Int).Value = attInfo.LParam1;

                cmd.ExecuteNonQuery();
            }
        }

        public void Update(IDbConnection cn, AttachmentInfo attInfo)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "UPDATE YZAppAttachment SET Name=@Name,Ext=@Ext,Size=@Size,LastUpdate=@LastUpdate,OwnerAccount=@OwnerAccount,LParam1=@LParam1 WHERE FileID=@FileID";

                cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = attInfo.Name;
                cmd.Parameters.Add("@Ext", SqlDbType.NVarChar).Value = attInfo.Ext;
                cmd.Parameters.Add("@Size", SqlDbType.Int).Value = attInfo.Size;
                cmd.Parameters.Add("@LastUpdate", SqlDbType.DateTime).Value = attInfo.LastUpdate;
                cmd.Parameters.Add("@OwnerAccount", SqlDbType.NVarChar).Value = attInfo.OwnerAccount;
                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = attInfo.FileID;
                cmd.Parameters.Add("@LParam1", SqlDbType.Int).Value = attInfo.LParam1;

                cmd.ExecuteNonQuery();
            }
        }

        public void RenameAttachment(IDbConnection cn, string fileid,string newName)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "UPDATE YZAppAttachment SET Name=@Name WHERE FileID=@FileID";

                cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = this.Convert(newName, false);
                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = this.Convert(fileid, false);

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteAttachment(IDbConnection cn, string fileid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "DELETE FROM YZAppAttachment WHERE FileID=@FileID";

                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = this.Convert(fileid, false);

                cmd.ExecuteNonQuery();
            }
        }
    }
}
