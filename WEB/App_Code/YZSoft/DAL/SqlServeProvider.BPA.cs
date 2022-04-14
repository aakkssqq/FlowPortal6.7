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
        public IDataReader GetSpriteUsedByLinks(IDbConnection cn, string fileid, string spriteid, string property)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM BPASpriteLink WHERE LinkedFileID=@LinkedFileID AND LinkedSpriteID=@LinkedSpriteID AND (@LinkedByProperty IS NULL OR LinkedByProperty=@LinkedByProperty) AND FileDeleted<>1";
                cmd.Parameters.Add("@LinkedFileID", SqlDbType.NVarChar).Value = fileid;
                cmd.Parameters.Add("@LinkedSpriteID", SqlDbType.NVarChar).Value = spriteid;
                cmd.Parameters.Add("@LinkedByProperty", SqlDbType.NVarChar).Value = this.Convert(property,true);
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetFileUsedByLinks(IDbConnection cn, string fileid, string property)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM BPASpriteLink WHERE LinkedFileID=@LinkedFileID AND (@LinkedByProperty IS NULL OR LinkedByProperty=@LinkedByProperty) AND FileDeleted<>1";
                cmd.Parameters.Add("@LinkedFileID", SqlDbType.NVarChar).Value = fileid;
                cmd.Parameters.Add("@LinkedByProperty", SqlDbType.NVarChar).Value = this.Convert(property, true);
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetUserPositions(IDbConnection cn, string uid) //uu1uu
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM BPAUserPosition WHERE UID=@UID";
                cmd.Parameters.Add("@UID", SqlDbType.NVarChar).Value = this.Convert(uid, false);
                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetSpriteIdentity(IDbConnection cn, string fileid, string spriteid) //uu1uu
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = @"SELECT * FROM BPASpriteIdentity WHERE FileID=@FileID AND SpriteID=@SpriteID";
                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = fileid;
                cmd.Parameters.Add("@SpriteID", SqlDbType.NVarChar).Value = spriteid;
                return cmd.ExecuteReader();
            }
        }

        public void ClearSpriteIdentityOfFile(IDbConnection cn, string fileid) //uu1uu
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "DELETE BPASpriteIdentity WHERE FileID=@FileID";
                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = fileid;

                cmd.ExecuteNonQuery();
            }
        }

        public void ClearLinkOfFile(IDbConnection cn, string fileid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "DELETE BPASpriteLink WHERE FileID=@FileID";
                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = fileid;

                cmd.ExecuteNonQuery();
            }
        }

        public void ClearUserPositions(IDbConnection cn, string uid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "DELETE BPAUserPosition WHERE UID=@UID";
                cmd.Parameters.Add("@UID", SqlDbType.NVarChar).Value = uid;

                cmd.ExecuteNonQuery();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.Web.BPA.SpriteIdentity spriteIdentity) //uu1uu
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO BPASpriteIdentity(");
                sb.Append("FileID,");
                sb.Append("SpriteID,");
                sb.Append("Name) ");
                sb.Append("VALUES(");
                sb.Append("@FileID,");
                sb.Append("@SpriteID,");
                sb.Append("@Name)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = this.Convert(spriteIdentity.FileID, false);
                cmd.Parameters.Add("@SpriteID", SqlDbType.NVarChar).Value = this.Convert(spriteIdentity.SpriteID, false);
                cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = this.Convert(spriteIdentity.Name, true);

                cmd.ExecuteNonQuery();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.Web.BPA.SpriteLink spriteLink)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO BPASpriteLink(");
                sb.Append("FileID,");
                sb.Append("SpriteID,");
                sb.Append("LinkType,");
                sb.Append("LinkedFileID,");
                sb.Append("LinkedSpriteID,");
                sb.Append("LinkedByProperty) ");
                sb.Append("VALUES(");
                sb.Append("@FileID,");
                sb.Append("@SpriteID,");
                sb.Append("@LinkType,");
                sb.Append("@LinkedFileID,");
                sb.Append("@LinkedSpriteID,");
                sb.Append("@LinkedByProperty)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = this.Convert(spriteLink.FileID, false);
                cmd.Parameters.Add("@SpriteID", SqlDbType.NVarChar).Value = this.Convert(spriteLink.SpriteID, false);
                cmd.Parameters.Add("@LinkType", SqlDbType.NVarChar).Value = spriteLink.LinkType.ToString();
                cmd.Parameters.Add("@LinkedFileID", SqlDbType.NVarChar).Value = this.Convert(spriteLink.LinkedFileID, false);
                cmd.Parameters.Add("@LinkedSpriteID", SqlDbType.NVarChar).Value = this.Convert(spriteLink.LinkedSpriteID, false);
                cmd.Parameters.Add("@LinkedByProperty", SqlDbType.NVarChar).Value = this.Convert(spriteLink.LinkedByProperty, false);

                cmd.ExecuteNonQuery();
            }
        }

        public void Insert(IDbConnection cn, YZSoft.Web.BPA.UserPosition userPosition)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO BPAUserPosition(");
                sb.Append("UID,");
                sb.Append("FileID,");
                sb.Append("SpriteID) ");
                sb.Append("VALUES(");
                sb.Append("@UID,");
                sb.Append("@FileID,");
                sb.Append("@SpriteID)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@UID", SqlDbType.NVarChar).Value = this.Convert(userPosition.UID, false);
                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = this.Convert(userPosition.FileID, false);
                cmd.Parameters.Add("@SpriteID", SqlDbType.NVarChar).Value = this.Convert(userPosition.SpriteID, false);

                cmd.ExecuteNonQuery();
            }
        }
    }
}
