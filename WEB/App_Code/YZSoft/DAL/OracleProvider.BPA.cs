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
        public IDataReader GetSpriteUsedByLinks(IDbConnection cn, string fileid, string spriteid, string property)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM BPASpriteLink WHERE LinkedFileID=:LinkedFileID AND LinkedSpriteID=:LinkedSpriteID AND (:LinkedByProperty IS NULL OR LinkedByProperty=:LinkedByProperty) AND FileDeleted<>1";
                cmd.Parameters.Add(":LinkedFileID", OracleDbType.NVarchar2).Value = fileid;
                cmd.Parameters.Add(":LinkedSpriteID", OracleDbType.NVarchar2).Value = spriteid;
                cmd.Parameters.Add(":LinkedByProperty", OracleDbType.NVarchar2).Value = this.Convert(property, true);
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetFileUsedByLinks(IDbConnection cn, string fileid, string property)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM BPASpriteLink WHERE LinkedFileID=:LinkedFileID AND (:LinkedByProperty IS NULL OR LinkedByProperty=:LinkedByProperty) AND FileDeleted<>1";
                cmd.Parameters.Add(":LinkedFileID", OracleDbType.NVarchar2).Value = fileid;
                cmd.Parameters.Add(":LinkedByProperty", OracleDbType.NVarchar2).Value = this.Convert(property, true);
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetUserPositions(IDbConnection cn, string uid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "SELECT * FROM BPAUserPosition WHERE \"UID\"=:PM_UID";
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = this.Convert(uid, false);
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetSpriteIdentity(IDbConnection cn, string fileid, string spriteid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = @"SELECT * FROM BPASpriteIdentity WHERE FileID=:FileID AND SpriteID=:SpriteID";
                cmd.Parameters.Add(":FileID", OracleDbType.NVarchar2).Value = fileid;
                cmd.Parameters.Add(":SpriteID", OracleDbType.NVarchar2).Value = spriteid;
                return cmd.ExecuteReader();
            }
        }

        public void ClearSpriteIdentityOfFile(IDbConnection cn, string fileid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "DELETE BPASpriteIdentity WHERE FileID=:FileID";
                cmd.Parameters.Add(":FileID", OracleDbType.NVarchar2).Value = fileid;

                cmd.ExecuteNonQuery();
            }
        }

        public void ClearLinkOfFile(IDbConnection cn, string fileid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "DELETE BPASpriteLink WHERE FileID=:FileID";
                cmd.Parameters.Add(":FileID", OracleDbType.NVarchar2).Value = fileid;

                cmd.ExecuteNonQuery();
            }
        }

        public void ClearUserPositions(IDbConnection cn, string uid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "DELETE BPAUserPosition WHERE \"UID\"=:PM_UID";
                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = uid;

                cmd.ExecuteNonQuery();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.Web.BPA.SpriteIdentity spriteIdentity)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO BPASpriteIdentity(");
                sb.Append("FileID,");
                sb.Append("SpriteID,");
                sb.Append("Name) ");
                sb.Append("VALUES(");
                sb.Append(":FileID,");
                sb.Append(":SpriteID,");
                sb.Append(":Name)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":FileID", OracleDbType.NVarchar2).Value = this.Convert(spriteIdentity.FileID, false);
                cmd.Parameters.Add(":SpriteID", OracleDbType.NVarchar2).Value = this.Convert(spriteIdentity.SpriteID, false);
                cmd.Parameters.Add(":Name", OracleDbType.NVarchar2).Value = this.Convert(spriteIdentity.Name, true);

                cmd.ExecuteNonQuery();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.Web.BPA.SpriteLink spriteLink)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO BPASpriteLink(");
                sb.Append("FileID,");
                sb.Append("SpriteID,");
                sb.Append("LinkType,");
                sb.Append("LinkedFileID,");
                sb.Append("LinkedSpriteID,");
                sb.Append("LinkedByProperty) ");
                sb.Append("VALUES(");
                sb.Append(":FileID,");
                sb.Append(":SpriteID,");
                sb.Append(":LinkType,");
                sb.Append(":LinkedFileID,");
                sb.Append(":LinkedSpriteID,");
                sb.Append(":LinkedByProperty)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":FileID", OracleDbType.NVarchar2).Value = this.Convert(spriteLink.FileID, false);
                cmd.Parameters.Add(":SpriteID", OracleDbType.NVarchar2).Value = this.Convert(spriteLink.SpriteID, false);
                cmd.Parameters.Add(":LinkType", OracleDbType.NVarchar2).Value = spriteLink.LinkType.ToString();
                cmd.Parameters.Add(":LinkedFileID", OracleDbType.NVarchar2).Value = this.Convert(spriteLink.LinkedFileID, false);
                cmd.Parameters.Add(":LinkedSpriteID", OracleDbType.NVarchar2).Value = this.Convert(spriteLink.LinkedSpriteID, false);
                cmd.Parameters.Add(":LinkedByProperty", OracleDbType.NVarchar2).Value = this.Convert(spriteLink.LinkedByProperty, false);

                cmd.ExecuteNonQuery();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.Web.BPA.UserPosition userPosition)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO BPAUserPosition(");
                sb.Append("\"UID\",");
                sb.Append("FileID,");
                sb.Append("SpriteID) ");
                sb.Append("VALUES(");
                sb.Append(":PM_UID,");
                sb.Append(":FileID,");
                sb.Append(":SpriteID)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":PM_UID", OracleDbType.NVarchar2).Value = this.Convert(userPosition.UID, false);
                cmd.Parameters.Add(":FileID", OracleDbType.NVarchar2).Value = this.Convert(userPosition.FileID, false);
                cmd.Parameters.Add(":SpriteID", OracleDbType.NVarchar2).Value = this.Convert(userPosition.SpriteID, false);

                cmd.ExecuteNonQuery();
            }
        }
    }
}
