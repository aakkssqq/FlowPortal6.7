using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using YZSoft.Web.DAL;
using BPM;

namespace YZSoft.Web.BPA
{
    [DataContract]
    public class Sprite : YZObject, IComparable
    {
        public File File{get;set;}

        [DataMember]
        public string Id { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string RelatiedFile { get; set; }
        [DataMember]
        public bool Assisit { get; set; }
        [DataMember]
        public int FolderID { get; set; }

        private SpriteProperty _property = null;
        private SpriteCollection _nextSprites = null;
        private SpriteCollection _prevSprites = null;

        [DataMember, JsonProperty(PropertyName = "property")]
        public SpriteProperty Property
        {
            get
            {
                if (this._property == null)
                    this._property = new SpriteProperty();
                return this._property;
            }
            set
            {
                this._property = value;
            }
        }

        public ReferenceCollection RelatiedFileReference
        {
            get
            {
                ReferenceCollection rv = new ReferenceCollection();
                if (!String.IsNullOrEmpty(this.RelatiedFile))
                    rv.Add(new Reference(ReferenceType.SpriteToProcess,this.RelatiedFile));

                return rv;
            }
        }

        public SpriteCollection NextSprites
        {
            get
            {
                if (this._nextSprites == null)
                {
                    this._nextSprites = new SpriteCollection(this.File);

                    foreach (Link link in this.File.Links)
                    {
                        if (String.Compare(link.FromNodeId, this.Id, true) == 0)
                        {
                            Sprite sprite = this.File.Sprites.TryGetItem(link.ToNodeId);
                            if (sprite != null)
                                this._nextSprites.Add(sprite);
                        }
                    }
                }

                return this._nextSprites;
            }
        }

        public SpriteCollection PrevSprites
        {
            get
            {
                if (this._prevSprites == null)
                {
                    this._prevSprites = new SpriteCollection(this.File);

                    foreach (Link link in this.File.Links)
                    {
                        if (String.Compare(link.ToNodeId, this.Id, true) == 0)
                        {
                            Sprite sprite = this.File.Sprites.TryGetItem(link.FromNodeId);
                            if (sprite != null)
                                this._prevSprites.Add(sprite);
                        }
                    }
                }

                return this._prevSprites;
            }
        }

        public ReferenceCollection AllReferences
        {
            get
            {
                ReferenceCollection refs = new ReferenceCollection();
                refs.AddRange(this.RelatiedFileReference);
                refs.AddRange(this.Property.Responsible);
                refs.AddRange(this.Property.Accountable);
                refs.AddRange(this.Property.Consulted);
                refs.AddRange(this.Property.Informed);
                refs.AddRange(this.Property.Regulation);
                refs.AddRange(this.Property.Risk);
                refs.AddRange(this.Property.ControlPoint);
                refs.AddRange(this.Property.KPI);
                refs.AddRange(this.Property.Form);
                refs.AddRange(this.Property.ITSystem);

                return refs;
            }
        }

        public SpriteLinkCollection AllSpriteLink
        {
            get
            {
                SpriteLinkCollection links = new SpriteLinkCollection();

                foreach (Reference @ref in this.RelatiedFileReference)
                    links.Add(new SpriteLink(this, @ref, "RelatiedFile"));

                foreach (Reference @ref in this.Property.Responsible)
                    links.Add(new SpriteLink(this, @ref, "Responsible"));

                foreach (Reference @ref in this.Property.Accountable)
                    links.Add(new SpriteLink(this, @ref, "Accountable"));

                foreach (Reference @ref in this.Property.Consulted)
                    links.Add(new SpriteLink(this, @ref, "Consulted"));

                foreach (Reference @ref in this.Property.Informed)
                    links.Add(new SpriteLink(this, @ref, "Informed"));

                foreach (Reference @ref in this.Property.Regulation)
                    links.Add(new SpriteLink(this, @ref, "Regulation"));

                foreach (Reference @ref in this.Property.Risk)
                    links.Add(new SpriteLink(this, @ref, "Risk"));

                foreach (Reference @ref in this.Property.ControlPoint)
                    links.Add(new SpriteLink(this, @ref, "ControlPoint"));

                foreach (Reference @ref in this.Property.KPI)
                    links.Add(new SpriteLink(this, @ref, "KPI"));

                foreach (Reference @ref in this.Property.Form)
                    links.Add(new SpriteLink(this, @ref, "Form"));

                foreach (Reference @ref in this.Property.ITSystem)
                    links.Add(new SpriteLink(this, @ref, "ITSystem"));

                return links;
            }
        }

        public SpriteCollection GetUsedBySprites(IYZDbProvider provider, IDbConnection cn)
        {
            return this.GetUsedBySprites(provider, cn, null);
        }

        public SpriteCollection GetUsedBySprites(IYZDbProvider provider, IDbConnection cn, string property)
        {
            SpriteCollection sprites = new SpriteCollection();

            SpriteLinkCollection links = BPAManager.GetSpriteUsedByLinks(provider, cn, this.File.FileID, this.Id, property);
            foreach (SpriteLink link in links)
            {
                if (link.LinkType != ReferenceType.SpriteToSprite)
                    continue;

                File file = File.TryLoad(provider, cn, link.FileID);

                if (file == null)
                    continue;

                Sprite sprite = file.Sprites.TryGetItem(link.SpriteID);
                if (sprite != null && !sprites.Contains(sprite.File.FileID,sprite.Id))
                    sprites.Add(sprite);
            }

            return sprites;
        }

        public DataTable ToActivityTable(IYZDbProvider provider, IDbConnection cn, string tableName)
        {
            DataTable table = new DataTable(tableName);
            DataRow row = table.NewRow();
            table.Rows.Add(row);

            this.AddCommonColumns(table);
            table.Columns.Add("Responsible", typeof(string));
            table.Columns.Add("Form", typeof(string));
            table.Columns.Add("Regulation", typeof(string));
            table.Columns.Add("ControlPoint", typeof(string));
            table.Columns.Add("Accountable", typeof(string));
            table.Columns.Add("ITSystem", typeof(string));
            table.Columns.Add("Informed", typeof(string));
            table.Columns.Add("Consulted", typeof(string));
            table.Columns.Add("KPI", typeof(string));

            this.SetCommonValue(row);
            row["Responsible"] = String.Join(",",this.Property.Responsible.ToString(provider, cn));
            row["Form"] = String.Join(",", this.Property.Form.ToString(provider, cn));
            row["Regulation"] = String.Join(",", this.Property.Regulation.ToString(provider, cn));
            row["ControlPoint"] = String.Join(",", this.Property.ControlPoint.ToString(provider, cn));
            row["Accountable"] = String.Join(",", this.Property.Accountable.ToString(provider, cn));
            row["ITSystem"] = String.Join(",", this.Property.ITSystem.ToString(provider, cn));
            row["Informed"] = String.Join(",", this.Property.Informed.ToString(provider, cn));
            row["Consulted"] = String.Join(",", this.Property.Consulted.ToString(provider, cn));
            row["KPI"] = String.Join(",", this.Property.KPI.ToString(provider, cn));

            return table;
        }

        public DataTable ToPositionTable(IYZDbProvider provider, IDbConnection cn, string tableName)
        {
            DataTable table = new DataTable(tableName);
            DataRow row = table.NewRow();
            table.Rows.Add(row);

            this.AddCommonColumns(table);
            table.Columns.Add("KPISummary", typeof(string));

            this.SetCommonValue(row);
            row["KPISummary"] = String.Join(",",this.GetUsedBySprites(provider, cn).GetActivityReferenceSummary(provider, cn, "KPI"));

            return table;
        }

        private void AddCommonColumns(DataTable table)
        {
            table.Columns.Add("CompanyName", typeof(string));
            table.Columns.Add("FileName", typeof(string));
            table.Columns.Add("ObjectName", typeof(string));
            table.Columns.Add("ObjectType", typeof(string));
            table.Columns.Add("ObjectTypeName", typeof(string));
            table.Columns.Add("Date", typeof(string));
            table.Columns.Add("Desc", typeof(string));
            table.Columns.Add("Remark", typeof(string));
            table.Columns.Add("NextObjects", typeof(string));
            table.Columns.Add("PrevObjects", typeof(string));
        }

        private void SetCommonValue(DataRow row)
        {
            Type resType = typeof(Resources.YZStrings);
            System.Resources.ResourceManager mgr = new System.Resources.ResourceManager(resType.FullName, resType.Assembly);
            string objectTypeName = mgr.GetString("Aspx_SpriteTypes_" + this.Property.SpriteType.ToString());
            if(objectTypeName == null)
                objectTypeName = this.Property.SpriteType.ToString();

            row["CompanyName"] = System.Web.Configuration.WebConfigurationManager.AppSettings["CompanyInfoCompanyName"];
            row["FileName"] = this.File.FileName;
            row["ObjectName"] = this.Name;
            row["ObjectType"] = this.Property.SpriteType.ToString();
            row["ObjectTypeName"] = objectTypeName;
            row["Date"] = DateTime.Now;
            row["Desc"] = this.Property.Description;
            row["Remark"] = this.Property.Remark;
            row["NextObjects"] = String.Join("/",this.NextSprites.ToStringList());
            row["PrevObjects"] = String.Join("/",this.PrevSprites.ToStringList());
        }

        int IComparable.CompareTo(object obj)
        {
            Sprite other = obj as Sprite;
            if (other == null)
                return -1;

            if (this.File == null || other.File == null)
                return 0;

            return -String.Compare(this.File.FileID, other.File.FileID);
        }
    }
}