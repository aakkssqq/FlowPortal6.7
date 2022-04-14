using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using YZSoft.Web.DAL;
using BPM;

namespace YZSoft.Web.BPA
{
    public class ReferenceCollection : BPMList<Reference>
    {
        public string[] ToString(IYZDbProvider provider, IDbConnection cn)
        {
            List<string> names = new List<string>();
            foreach(Reference reference in this)
            {
                names.Add(reference.ToString(provider, cn));
            }

            return names.ToArray();
        }

        public void RefreshName(IYZDbProvider provider, IDbConnection cn)
        {
            foreach (Reference @ref in this)
            {
                @ref.RefreshName(provider, cn);
            }
        }

        public bool Contains(SpriteIdentity identity)
        {
            Reference @ref = this.TryGetItem(identity);
            return @ref == null ? false:true;
        }

        public Reference TryGetItem(SpriteIdentity identity)
        {
            foreach (Reference @ref in this)
            {
                if (@ref.FileID == identity.FileID &&
                    @ref.SpriteID == identity.SpriteID)
                    return @ref;
            }

            return null;
        }

        public ReferenceCollection Intersect(SpriteCollection sprites)
        {
            ReferenceCollection rv = new ReferenceCollection();
            foreach(Reference @ref in this)
            {
                if (sprites.Contains(@ref.FileID, @ref.SpriteID))
                {
                    rv.Add(@ref);
                }
            }
            return rv;
        }

        public SpriteCollection GetSprites(IYZDbProvider provider,IDbConnection cn)
        {
            SpriteCollection rv = new SpriteCollection();

            foreach (Reference reference in this)
            {

                File file = File.TryLoad(provider, cn, reference.FileID);
                if (file != null)
                {
                    Sprite sprite = file.Sprites.TryGetItem(reference.SpriteID);

                    if (sprite != null)
                        rv.Add(sprite);
                }
            }

            return rv;
        }

        public DataTable ToDetailTable(IYZDbProvider provider, IDbConnection cn, string outputTableName)
        {
            DataTable table = new DataTable(outputTableName);
            table.Columns.Add("FileID", typeof(string));
            table.Columns.Add("FileName", typeof(string));
            table.Columns.Add("FileCode", typeof(string));
            table.Columns.Add("SpriteName", typeof(string));
            table.Columns.Add("Code", typeof(string));
            table.Columns.Add("Desc", typeof(string));

            foreach (Reference reference in this)
            {
                File file = File.TryLoad(provider,cn, reference.FileID);
                if (file != null)
                {
                    Sprite sprite = file.Sprites.TryGetItem(reference.SpriteID);

                    if (sprite != null)
                    {
                        DataRow row = table.NewRow();
                        table.Rows.Add(row);

                        row["FileID"] = file.FileID;
                        row["FileName"] = file.FileName;
                        row["FileCode"] = String.IsNullOrEmpty(file.Property.Code) ? file.FileID : file.Property.Code;
                        row["SpriteName"] = sprite.Name;
                        row["Code"] = sprite.Property.Code;
                        row["Desc"] = sprite.Property.Description;
                    }
                }
            }

            return table;
        }
    }
}