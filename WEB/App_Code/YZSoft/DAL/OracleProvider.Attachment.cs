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
using Oracle.ManagedDataAccess.Client;
using BPM;

namespace YZSoft.Web.DAL
{
    partial class OracleProvider
    {
        public IDataReader GetAttachmentsInfo(IDbConnection cn, string[] fileids)
        {
            List<string> ids = new List<string>();
            for (int i = 0; i < fileids.Length; i++)
                ids.Add("N'" + this.EncodeText(fileids[i]) + "'");

            string filter = ids.Count == 0 ? "1=0" : String.Format("WHERE FILEID IN({0})", String.Join(",", ids.ToArray()));
            string query = String.Format("SELECT * FROM YZAPPATTACHMENT {0}", filter);

            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = query;

                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, AttachmentInfo attInfo)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "INSERT INTO YZAPPATTACHMENT(FILEID,NAME,EXT,\"SIZE\",LASTUPDATE,OWNERACCOUNT,LParam1) VALUES(:FILEID,:NAME,:EXT,:PM_SIZE,:LASTUPDATE,:OWNERACCOUNT,:LParam1)";
                cmd.Parameters.Add(":FILEID", OracleDbType.NVarchar2).Value = attInfo.FileID;
                cmd.Parameters.Add(":NAME", OracleDbType.NVarchar2).Value = attInfo.Name;
                cmd.Parameters.Add(":EXT", OracleDbType.NVarchar2).Value = attInfo.Ext;
                cmd.Parameters.Add(":PM_SIZE", OracleDbType.Int32).Value = attInfo.Size;
                cmd.Parameters.Add(":LASTUPDATE", OracleDbType.Date).Value = attInfo.LastUpdate;
                cmd.Parameters.Add(":OWNERACCOUNT", OracleDbType.NVarchar2).Value = attInfo.OwnerAccount;
                cmd.Parameters.Add(":LParam1", OracleDbType.Int32).Value = attInfo.LParam1;

                cmd.ExecuteNonQuery();
            }
        }

        public void Update(IDbConnection cn, AttachmentInfo attInfo)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "UPDATE YZAppAttachment SET Name=:Name,Ext=:Ext,\"SIZE\"=:PM_SIZE,LastUpdate=:LastUpdate,OwnerAccount=:OwnerAccount,LParam1=:LParam1 WHERE FileID=:FileID";

                cmd.Parameters.Add(":Name", OracleDbType.NVarchar2).Value = attInfo.Name;
                cmd.Parameters.Add(":Ext", OracleDbType.NVarchar2).Value = attInfo.Ext;
                cmd.Parameters.Add(":PM_SIZE", OracleDbType.Int32).Value = attInfo.Size;
                cmd.Parameters.Add(":LastUpdate", OracleDbType.Date).Value = attInfo.LastUpdate;
                cmd.Parameters.Add(":OwnerAccount", OracleDbType.NVarchar2).Value = attInfo.OwnerAccount;
                cmd.Parameters.Add(":FileID", OracleDbType.NVarchar2).Value = attInfo.FileID;
                cmd.Parameters.Add(":LParam1", OracleDbType.Int32).Value = attInfo.LParam1;

                cmd.ExecuteNonQuery();
            }
        }

        public void RenameAttachment(IDbConnection cn, string fileid,string newName)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "UPDATE YZAPPATTACHMENT SET NAME=:NAME WHERE FILEID=:FILEID";

                cmd.Parameters.Add(":NAME", OracleDbType.NVarchar2).Value = this.Convert(newName, false);
                cmd.Parameters.Add(":FILEID", OracleDbType.NVarchar2).Value = this.Convert(fileid, false);

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteAttachment(IDbConnection cn, string fileid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "DELETE FROM YZAPPATTACHMENT WHERE FILEID=:FILEID";

                cmd.Parameters.Add(":FILEID", OracleDbType.NVarchar2).Value = this.Convert(fileid, false);

                cmd.ExecuteNonQuery();
            }
        }
    }
}
