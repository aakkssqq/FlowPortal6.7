using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using BPM;
using YZSoft.Web.DAL;

namespace YZSoft.Web.BPA
{
    public class FileCollection : BPMList<File>
    {
        protected override string GetKey(File value)
        {
            return value.FileID;
        }

        public FileIdentityCollection Identities
        {
            get
            {
                FileIdentityCollection rv = new FileIdentityCollection();
                foreach (File file in this)
                {
                    if (!rv.Contains(file.FileID))
                        rv.Add(new FileIdentity(file));
                }

                return rv;
            }
        }

        public FileCollection SortByOrder()
        {
            FileCollection rv = new FileCollection();
            rv.AddRange(this.OrderBy(a => (String.IsNullOrEmpty(a.Property.Order) ? 1 : 0)).ThenBy(a => a.Property.Order).ThenBy(a => a.Property.Code).ThenBy(a => a.FileID));
            return rv;
        }

        public DataTable ToDetailTable(IYZDbProvider provider, IDbConnection cn, string outputTableName)
        {
            DataTable table = new DataTable(outputTableName);
            table.Columns.Add("FileID", typeof(string));
            table.Columns.Add("FileName", typeof(string));
            table.Columns.Add("Code", typeof(string));
            table.Columns.Add("Order", typeof(string));
            table.Columns.Add("Milestone", typeof(string));
            table.Columns.Add("Since", typeof(DateTime));
            table.Columns.Add("Color", typeof(string));
            table.Columns.Add("ExecuteStatus", typeof(string));
            table.Columns.Add("Purpose", typeof(string));
            table.Columns.Add("Scope", typeof(string));
            table.Columns.Add("Definition", typeof(string));
            table.Columns.Add("Responsibility", typeof(string));
            table.Columns.Add("DispatchScope", typeof(string));
            table.Columns.Add("DesignPurpose", typeof(string));

            foreach (File file in this)
            {
                DataRow row = table.NewRow();
                table.Rows.Add(row);

                row["FileID"] = file.FileID;
                row["FileName"] = file.FileName;
                row["Code"] = String.IsNullOrEmpty(file.Property.Code) ? file.FileID : file.Property.Code;
                row["Order"] = file.Property.Order;
                row["Milestone"] = file.Property.Milestone.ToString();
                row["Since"] = file.Property.Since;
                row["Color"] = file.Property.Color.ToString();
                row["ExecuteStatus"] = file.Property.ExecuteStatus.ToString();
                row["Purpose"] = file.Property.Purpose;
                row["Scope"] = file.Property.Scope;
                row["Definition"] = file.Property.Definition;
                row["Responsibility"] = file.Property.Responsibility;
                row["DispatchScope"] = file.Property.DispatchScope;
                row["DesignPurpose"] = file.Property.DesignPurpose;
            }

            return table;
        }
    }
}