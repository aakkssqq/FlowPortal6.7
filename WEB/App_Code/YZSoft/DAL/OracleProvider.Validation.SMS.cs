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
using YZSoft.Web.Validation;

namespace YZSoft.Web.DAL
{
    partial class OracleProvider
    {
        public IDataReader GetValidationSMS(IDbConnection cn, string itemguid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "SELECT * FROM YZSysSMSValidation WHERE ItemGUID=:ItemGUID";
                cmd.Parameters.Add(":ItemGUID", OracleDbType.NVarchar2).Value = this.Convert(itemguid, false);
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, SMS sms)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

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
                sb.Append(":ItemGUID,");
                sb.Append(":IDDCode,");
                sb.Append(":PhoneNumber,");
                sb.Append(":ValidationCode,");
                sb.Append(":ExpireDate,");
                sb.Append(":CreateDate,");
                sb.Append(":CreateBy)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":ItemGUID", OracleDbType.NVarchar2).Value = this.Convert(sms.ItemGUID, false);
                cmd.Parameters.Add(":IDDCode", OracleDbType.NVarchar2).Value = this.Convert(sms.IDDCode, true);
                cmd.Parameters.Add(":PhoneNumber", OracleDbType.NVarchar2).Value = this.Convert(sms.PhoneNumber, true);
                cmd.Parameters.Add(":ValidationCode", OracleDbType.NVarchar2).Value = this.Convert(sms.ValidationCode, true);
                cmd.Parameters.Add(":ExpireDate", OracleDbType.Date).Value = this.Convert(sms.ExpireDate, true);
                cmd.Parameters.Add(":CreateDate", OracleDbType.Date).Value = this.Convert(sms.CreateDate, true);
                cmd.Parameters.Add(":CreateBy", OracleDbType.NVarchar2).Value = this.Convert(sms.CreateBy, true);

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteValidationSMS(IDbConnection cn, string itemguid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "DELETE from YZSysSMSValidation WHERE ItemGUID=:ItemGUID";
                cmd.Parameters.Add(":ItemGUID", OracleDbType.NVarchar2).Value = this.Convert(itemguid, false);

                cmd.ExecuteNonQuery();
            }
        }
    }
}
