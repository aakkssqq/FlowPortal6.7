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
using YZSoft.Web.Mobile;

namespace YZSoft.Web.DAL
{
    partial class OracleProvider
    {
        public IDataReader GetUserDevices(IDbConnection cn, string account, string filter, string sort, int startRowIndex, int rows)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                //查询条件
                filter = this.CombinCond(filter, "Account = :Account");
                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = account;

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "LastLogin DESC";

                this.GeneratePageCommand(cmd, "SELECT * FROM YZSysMobileDevice" + filter, sort, startRowIndex, rows);

                return cmd.ExecuteReader();
            }
        }

        public IDataReader GetDevice(IDbConnection cn, string account, string uuid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;
                cmd.CommandText = "SELECT * FROM YZSysMobileDevice WHERE Account=:Account AND UUID=:UUID";
                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = account;
                cmd.Parameters.Add(":UUID", OracleDbType.NVarchar2).Value = uuid;
                return cmd.ExecuteReader();
            }
        }

        public void Insert(IDbConnection cn, Device device)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("INSERT INTO YZSysMobileDevice(");
                sb.Append("Account,");
                sb.Append("UUID,");
                sb.Append("Name,");
                sb.Append("Model,");
                sb.Append("Description,");
                sb.Append("RegisterAt,");
                sb.Append("Disabled,");
                sb.Append("LastLogin) ");
                sb.Append("VALUES(");
                sb.Append(":Account,");
                sb.Append(":UUID,");
                sb.Append(":Name,");
                sb.Append(":Model,");
                sb.Append(":Description,");
                sb.Append(":RegisterAt,");
                sb.Append(":Disabled,");
                sb.Append(":LastLogin)");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = this.Convert(device.Account, false);
                cmd.Parameters.Add(":UUID", OracleDbType.NVarchar2).Value = this.Convert(device.UUID, false);
                cmd.Parameters.Add(":Name", OracleDbType.NVarchar2).Value = this.Convert(device.Name, true);
                cmd.Parameters.Add(":Model", OracleDbType.NVarchar2).Value = this.Convert(device.Model, true);
                cmd.Parameters.Add(":Description", OracleDbType.NVarchar2).Value = this.Convert(device.Description, true);
                cmd.Parameters.Add(":RegisterAt", OracleDbType.Date).Value = this.Convert(device.RegisterAt, true);
                cmd.Parameters.Add(":Disabled", OracleDbType.Int16).Value = this.ConvertBoolToInt16(device.Disabled);
                cmd.Parameters.Add(":LastLogin", OracleDbType.Date).Value = this.Convert(device.LastLogin, true);

                cmd.ExecuteNonQuery();
            }
        }

        public void Update(IDbConnection cn, Device device)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                StringBuilder sb = new StringBuilder();
                sb.Append("UPDATE YZSysMobileDevice SET ");
                sb.Append("Name=:Name,");
                sb.Append("Model=:Model,");
                sb.Append("Description=:Description,");
                sb.Append("RegisterAt=:RegisterAt,");
                sb.Append("Disabled=:Disabled,");
                sb.Append("LastLogin=:LastLogin ");
                sb.Append("WHERE Account=:Account AND UUID=:UUID");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add(":Name", OracleDbType.NVarchar2).Value = this.Convert(device.Name, true);
                cmd.Parameters.Add(":Model", OracleDbType.NVarchar2).Value = this.Convert(device.Model, true);
                cmd.Parameters.Add(":Description", OracleDbType.NVarchar2).Value = this.Convert(device.Description, true);
                cmd.Parameters.Add(":RegisterAt", OracleDbType.Date).Value = this.Convert(device.RegisterAt, true);
                cmd.Parameters.Add(":Disabled", OracleDbType.Int16).Value = this.ConvertBoolToInt16(device.Disabled);
                cmd.Parameters.Add(":LastLogin", OracleDbType.Date).Value = this.Convert(device.LastLogin, true);
                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = this.Convert(device.Account, false);
                cmd.Parameters.Add(":UUID", OracleDbType.NVarchar2).Value = this.Convert(device.UUID, false);

                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteDevice(IDbConnection cn, string account, string uuid)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                cmd.CommandText = "DELETE from YZSysMobileDevice WHERE Account=:Account AND UUID=:UUID";
                cmd.Parameters.Add(":Account", OracleDbType.NVarchar2).Value = this.Convert(account, false);
                cmd.Parameters.Add(":UUID", OracleDbType.NVarchar2).Value = this.Convert(uuid, false);

                cmd.ExecuteNonQuery();
            }
        }

        public IDataReader GetDevices(IDbConnection cn, string filter, string sort, int startRowIndex, int rows)
        {
            using (OracleCommand cmd = new OracleCommand())
            {
                cmd.Connection = cn as OracleConnection;
                cmd.BindByName = true;

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //排序
                if (String.IsNullOrEmpty(sort))
                    sort = "LastLogin DESC";

                this.GeneratePageCommand(cmd, "SELECT * FROM YZSysMobileDevice" + filter, sort, startRowIndex, rows);

                return cmd.ExecuteReader();
            }
        }
    }
}
