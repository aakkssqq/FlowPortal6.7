using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using YZSoft.Web.DAL;
using System.Reflection;
using BPM;

namespace YZSoft.Web.BPA
{
    public class SpriteCollection : BPMList<Sprite>
    {
        public File File { get; set; }

        public SpriteCollection()
        {
            this.File = null;
        }

        public SpriteCollection(File file)
        {
            this.File = file;
        }

        public FileCollection Files
        {
            get
            {
                FileCollection rv = new FileCollection();
                foreach (Sprite sprite in this)
                {
                    if (!rv.Contains(sprite.File.FileID))
                        rv.Add(sprite.File);
                }

                return rv;
            }
        }

        public SpriteIdentityCollection Identities
        {
            get
            {
                SpriteIdentityCollection rv = new SpriteIdentityCollection();
                foreach (Sprite sprite in this.SortByOrder())
                {
                    if (sprite.Assisit)
                        continue;

                    if (!rv.Contains(sprite.File.FileID, sprite.Id))
                        rv.Add(new SpriteIdentity(sprite));
                }

                return rv;
            }
        }

        public SpriteCollection GetUsedBySprites(IYZDbProvider provider, IDbConnection cn, string property)
        {
            SpriteCollection rv = new SpriteCollection();
            foreach (Sprite sprite in this)
            {
                SpriteCollection sprites = sprite.GetUsedBySprites(provider, cn, property);
                foreach (Sprite sprite1 in sprites)
                {
                    if (!rv.Contains(sprite1.File.FileID, sprite1.Id))
                        rv.Add(sprite1);
                }
            }

            return rv;
        }

        public bool Contains(string fileid, string spriteid)
        {
            foreach (Sprite sprite in this)
            {
                if (sprite.File.FileID == fileid &&
                    sprite.Id == spriteid)
                    return true;
            }

            return false;
        }

        protected override void OnInsert(int index, Sprite value)
        {
            if (this.File != null)
                value.File = this.File;

            base.OnInsert(index, value);
        }

        protected override string GetKey(Sprite value)
        {
            return value.Id;
        }

        public static bool TableContains(DataTable table, Sprite sprite, Reference @ref)
        {
            foreach (DataRow row in table.Rows)
            {
                if (Convert.ToString(row["ProcessID"]) == sprite.File.FileID &&
                    Convert.ToString(row["ActivityID"]) == sprite.Id &&
                    Convert.ToString(row["FileID"]) == @ref.FileID &&
                    Convert.ToString(row["SpriteID"]) == @ref.SpriteID)

                    return true;
            }

            return false;
        }

        public SpriteCollection SortByOrder()
        {
            SpriteCollection rv = new SpriteCollection();
            rv.AddRange(this.OrderBy(a => (String.IsNullOrEmpty(a.Property.Order) ? 1:0)).ThenBy(a => a.Property.Order).ThenBy(a => a.Property.Code).ThenBy(a => a.Name));
            return rv;
        }

        public string[] GetActivityReferenceSummary(IYZDbProvider provider, IDbConnection cn, string propertyName)
        {
            List<string> names = new List<string>();
            PropertyInfo propertyInfo = typeof(SpriteProperty).GetProperty(propertyName);

            foreach (Sprite sprite in this)
            {
                ReferenceCollection refs = propertyInfo.GetValue(sprite.Property, null) as ReferenceCollection;
                if (refs == null)
                    continue;

                foreach (Reference @ref in refs)
                {
                    @ref.RefreshName(provider, cn);

                    string name = @ref.SpriteName;
                    if (!names.Contains(name))
                        names.Add(name);
                }
            }

            return names.ToArray();
        }

        public DataTable GetActivityReferenceDetailTable(IYZDbProvider provider,IDbConnection cn, string propertyName, string outputTableName)
        {
            PropertyInfo propertyInfo = typeof(SpriteProperty).GetProperty(propertyName);
            DataTable table = new DataTable(outputTableName);

            table.Columns.Add("ProcessID", typeof(string));
            table.Columns.Add("ProcessName", typeof(string));
            table.Columns.Add("ActivityID", typeof(string));
            table.Columns.Add("ActivityName", typeof(string));
            table.Columns.Add("FileID", typeof(string));
            table.Columns.Add("FileName", typeof(string));
            table.Columns.Add("SpriteID", typeof(string));
            table.Columns.Add("SpriteName", typeof(string));
            table.Columns.Add(propertyName, typeof(string));
            table.Columns.Add("Desc", typeof(string));
            table.Columns.Add("DescExt", typeof(string));

            foreach (Sprite sprite in this)
            {
                ReferenceCollection refs = propertyInfo.GetValue(sprite.Property, null) as ReferenceCollection;
                if (refs == null)
                    continue;

                foreach (Reference @ref in refs)
                {
                    if (SpriteCollection.TableContains(table, sprite, @ref))
                        continue;

                    File file = File.TryLoad(provider, cn, @ref.FileID);
                    if (file == null)
                        continue;

                    Sprite linkedSprite = file.Sprites[@ref.SpriteID];
                    if (linkedSprite == null)
                        continue;

                    
                    DataRow row = table.NewRow();
                    table.Rows.Add(row);

                    row["ProcessID"] = sprite.File.FileID;
                    row["ProcessName"] = sprite.File.FileName;
                    row["ActivityID"] = sprite.Id;
                    row["ActivityName"] = sprite.Name;
                    row["FileID"] = linkedSprite.File.FileID;
                    row["FileName"] = linkedSprite.File.FileName;
                    row["SpriteID"] = linkedSprite.Id;
                    row["SpriteName"] = linkedSprite.Name;
                    row[propertyName] = linkedSprite.Property.Description;
                    row["Desc"] = linkedSprite.Property.Description;
                    row["DescExt"] = String.Format("{0}>{1}:\n{2}",
                        linkedSprite.File.FileName,
                        linkedSprite.Name,
                        linkedSprite.Property.Description
                    );
                }
            }

            return table;
        }

        public DataTable GetDetailTable(IYZDbProvider provider, IDbConnection cn, string outputTableName)
        {
            DataTable table = new DataTable(outputTableName);

            table.Columns.Add("FileID", typeof(string));
            table.Columns.Add("FileName", typeof(string));
            table.Columns.Add("SpriteID", typeof(string));
            table.Columns.Add("SpriteName", typeof(string));
            table.Columns.Add("Code", typeof(string));
            table.Columns.Add("Order", typeof(string));
            table.Columns.Add("R", typeof(string));
            table.Columns.Add("A", typeof(string));
            table.Columns.Add("C", typeof(string));
            table.Columns.Add("I", typeof(string));
            table.Columns.Add("RACI", typeof(string));
            table.Columns.Add("Regulation", typeof(string));
            table.Columns.Add("Risk", typeof(string));
            table.Columns.Add("ControlPoint", typeof(string));
            table.Columns.Add("KPI", typeof(string));
            table.Columns.Add("Form", typeof(string));
            table.Columns.Add("ITSystem", typeof(string));
            table.Columns.Add("Desc", typeof(string));
            table.Columns.Add("Remark", typeof(string));

            foreach (Sprite sprite in this)
            {
                if (sprite.Assisit)
                    continue;

                if (String.IsNullOrEmpty(sprite.Name))
                    continue;

                DataRow row = table.NewRow();
                table.Rows.Add(row);

                row["FileID"] = sprite.File.FileID;
                row["FileName"] = sprite.File.FileName;
                row["SpriteID"] = sprite.Id;
                row["SpriteName"] = sprite.Name;
                row["Code"] = sprite.Property.Code;
                row["Order"] = sprite.Property.Order;

                row["R"] = String.Join(",", sprite.Property.Responsible.ToString(provider, cn));
                row["A"] = String.Join(",", sprite.Property.Accountable.ToString(provider, cn));
                row["C"] = String.Join(",", sprite.Property.Consulted.ToString(provider, cn));
                row["I"] = String.Join(",", sprite.Property.Informed.ToString(provider, cn));

                List<string> raci = new List<string>();
                string[] attrs = new string[] {"R", "A", "C", "I"};
                foreach (string attr in attrs)
                {
                    string value = (string)row[attr];
                    if (!String.IsNullOrEmpty(value))
                        raci.Add(String.Format("{0}:{1}", attr,value));
                }
                row["RACI"] = String.Join("\r\n", raci.ToArray());

                row["Regulation"] = String.Join(",", sprite.Property.Regulation.ToString(provider, cn));
                row["Risk"] = String.Join(",", sprite.Property.Risk.ToString(provider, cn));
                row["ControlPoint"] = String.Join(",", sprite.Property.ControlPoint.ToString(provider, cn));
                row["KPI"] = String.Join(",", sprite.Property.KPI.ToString(provider, cn));
                row["Form"] = String.Join(",", sprite.Property.Form.ToString(provider, cn));
                row["ITSystem"] = String.Join(",", sprite.Property.ITSystem.ToString(provider, cn));
                row["Desc"] = sprite.Property.Description;
                row["Remark"] = sprite.Property.Remark;
            }

            return table;
        }

        public DataTable GetRACIDetailTable(IYZDbProvider provider, IDbConnection cn, string outputTableName)
        {
            DataTable table = new DataTable(outputTableName);

            table.Columns.Add("FileID", typeof(string));
            table.Columns.Add("FileName", typeof(string));
            table.Columns.Add("SpriteID", typeof(string));
            table.Columns.Add("SpriteName", typeof(string));
            table.Columns.Add("R", typeof(string));
            table.Columns.Add("A", typeof(string));
            table.Columns.Add("C", typeof(string));
            table.Columns.Add("I", typeof(string));
            table.Columns.Add("Desc", typeof(string));
            table.Columns.Add("Remark", typeof(string));

            foreach (Sprite sprite in this)
            {
                DataRow row = table.NewRow();

                row["FileID"] = sprite.File.FileID;
                row["FileName"] = sprite.File.FileName;
                row["SpriteID"] = sprite.Id;
                row["SpriteName"] = sprite.Name;
                row["R"] = String.Join(",", sprite.Property.Responsible.ToString(provider, cn));
                row["A"] = String.Join(",", sprite.Property.Accountable.ToString(provider, cn));
                row["C"] = String.Join(",", sprite.Property.Consulted.ToString(provider, cn));
                row["I"] = String.Join(",", sprite.Property.Informed.ToString(provider, cn));
                row["Desc"] = sprite.Property.Description;
                row["Remark"] = sprite.Property.Remark;

                if (!String.IsNullOrEmpty((string)row["R"]) ||
                    !String.IsNullOrEmpty((string)row["A"]) ||
                    !String.IsNullOrEmpty((string)row["C"]) ||
                    !String.IsNullOrEmpty((string)row["I"]))
                {
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        public string[] ToStringList()
        {
            List<string> names = new List<string>();
            foreach (Sprite sprite in this)
            {
                if (!string.IsNullOrEmpty(sprite.Name))
                    names.Add(sprite.Name);
            }

            return names.ToArray();
        }
    }
}