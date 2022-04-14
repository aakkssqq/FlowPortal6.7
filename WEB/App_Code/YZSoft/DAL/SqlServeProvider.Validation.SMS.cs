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
using YZSoft.Web.Validation;

namespace YZSoft.Web.DAL
{
    partial class SqlServerProvider
    {
        public IDataReader GetValidationSMS(IDbConnection cn, string itemguid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM YZSysSMSValidation WHERE ItemGUID=@ItemGUID";
                cmd.Parameters.Add("@ItemGUID", SqlDbType.NVarChar).Value = this.Convert(itemguid,false);
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, SMS sms)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZSysSMSValidation(");
                sb.Append("ItemGUID,");
                sb.Append("IDDCode,");
                sb.Append("PhoneNumber,");
                sb.Append("ValidationCode,");
                sb.Append("ExpireDate,");
                sb.Append("CreateDate,");
                sb.Append("CreateBy) ");
                sb.Append("VALUES(");
                sb.Append("@ItemGUID,");
                sb.Append("@IDDCode,");
                sb.Append("@PhoneNumber,");
                sb.Append("@ValidationCode,");
                sb.Append("@ExpireDate,");
                sb.Append("@CreateDate,");
                sb.Append("@CreateBy);");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@ItemGUID", SqlDbType.NVarChar).Value = this.Convert(sms.ItemGUID, false);
                cmd.Parameters.Add("@IDDCode", SqlDbType.NVarChar).Value = this.Convert(sms.IDDCode, true);
                cmd.Parameters.Add("@PhoneNumber", SqlDbType.NVarChar).Value = this.Convert(sms.PhoneNumber, true);
                cmd.Parameters.Add("@ValidationCode", SqlDbType.NVarChar).Value = this.Convert(sms.ValidationCode, true);
                cmd.Parameters.Add("@ExpireDate", SqlDbType.DateTime).Value = this.Convert(sms.ExpireDate, true);
                cmd.Parameters.Add("@CreateDate", SqlDbType.DateTime).Value = this.Convert(sms.CreateDate, true);
                cmd.Parameters.Add("@CreateBy", SqlDbType.NVarChar).Value = this.Convert(sms.CreateBy, true);

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteValidationSMS(IDbConnection cn, string itemguid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                cmd.CommandText = "DELETE from YZSysSMSValidation WHERE ItemGUID=@ItemGUID";
                cmd.Parameters.Add("@ItemGUID", SqlDbType.NVarChar).Value = this.Convert(itemguid, false);

                cmd.ExecuteNonQuery();
            }
        }
    }
}
