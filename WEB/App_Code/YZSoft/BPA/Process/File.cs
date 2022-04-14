using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using BPM;
using YZSoft.Web.DAL;
using System.Drawing;

namespace YZSoft.Web.BPA
{
    [DataContract]
    public class File : YZObject
    {
        [DataMember]
        public string FileID { get; set; }
        [DataMember]
        public string FileName { get; set; }

        private Property _property = null;
        private SpriteCollection _sprites = null;
        private LinkCollection _links = null;
        private Image _chart;

        private AttachmentInfo _attachmentInfo = null;

        [DataMember]
        public Property Property
        {
            get
            {
                if (this._property == null)
                    this._property = new Property();
                return this._property;
            }
            set
            {
                this._property = value;
            }
        }

        [DataMember,JsonProperty("Nodes")]
        public SpriteCollection Sprites
        {
            get
            {
                if (this._sprites == null)
                    this._sprites = new SpriteCollection(this);

                return this._sprites;
            }
            set
            {
                this._sprites = value;
            }
        }

        [DataMember]
        public LinkCollection Links
        {
            get
            {
                if (this._links == null)
                    this._links = new LinkCollection(this);

                return this._links;
            }
            set
            {
                this._links = value;
            }
        }

        public Image Chart
        {
            get
            {
                return this._chart;
            }
            set
            {
                this._chart = value;
            }
        }

        public AttachmentInfo AttachmentInfo
        {
            get
            {
                if (this._attachmentInfo == null)
                    this._attachmentInfo = new AttachmentInfo();

                return this._attachmentInfo;
            }
            set
            {
                this._attachmentInfo = value;
            }
        }

        public bool isOperationProcess
        {
            get
            {
                if (NameCompare.EquName(this.AttachmentInfo.Ext, ".evc") &&
                    this.Property.EvcProcessType == EvcProcessType.OperationProcess)
                    return true;
                else
                    return false;
            }
        }

        public bool isStrategicProces
        {
            get
            {
                if (NameCompare.EquName(this.AttachmentInfo.Ext, ".evc") &&
                    this.Property.EvcProcessType == EvcProcessType.StrategicProcess)
                    return true;
                else
                    return false;
            }
        }

        public bool isSupportProcess
        {
            get
            {
                if (NameCompare.EquName(this.AttachmentInfo.Ext, ".flow") ||
                    NameCompare.EquName(this.AttachmentInfo.Ext, ".bpmn"))
                    return true;
                else
                    return false;
            }
        }

        public static string GetCategoryNameFromExt(string ext)
        {
            if(ext == null)
                return "";

            Type resType = typeof(Resources.YZStrings);
            System.Resources.ResourceManager mgr = new System.Resources.ResourceManager(resType.FullName, resType.Assembly);
            string categoryName = mgr.GetString("All_BPA_FileCategoryNamesModule_" + ext.Replace(".","").ToLower().Trim());
            if (categoryName == null)
                categoryName = ext;

            return categoryName;
        }

        public DataTable ToSOPTable(IYZDbProvider provider, IDbConnection cn, string tableName)
        {
            DataTable table = new DataTable(tableName);
            DataRow row = table.NewRow();
            table.Rows.Add(row);

            this.AddCommonColumns(provider, cn, table);
            this.SetCommonValue(provider, cn, row);
            return table;
        }

        public ReferenceCollection AllReferences
        {
            get
            {
                ReferenceCollection refs = new ReferenceCollection();
                refs.AddRange(this.Property.Owner);

                foreach (Sprite sprite in this.Sprites.SortByOrder())
                {
                    refs.AddRange(sprite.AllReferences);
                }

                return refs;
            }
        }

        public ReferenceCollection AllChildProcessReferences
        {
            get
            {
                ReferenceCollection refs = new ReferenceCollection();

                foreach (Sprite sprite in this.Sprites.SortByOrder())
                {
                    refs.AddRange(sprite.RelatiedFileReference);
                }

                return refs;
            }
        }

        public ReferenceCollection AllFormReferences
        {
            get
            {
                ReferenceCollection refs = new ReferenceCollection();

                foreach (Sprite sprite in this.Sprites.SortByOrder())
                {
                    refs.AddRange(sprite.Property.Form);
                }

                return refs;
            }
        }

        public SpriteLinkCollection AllSpriteLinks
        {
            get
            {
                SpriteLinkCollection links = new SpriteLinkCollection();

                foreach (Reference @ref in this.Property.Owner)
                    links.Add(new SpriteLink(this, @ref, "FileResponsible"));

                foreach (Sprite sprite in this.Sprites.SortByOrder())
                    links.AddRange(sprite.AllSpriteLink);

                return links;
            }
        }

        public FileCollection GetUsedByFiles(IYZDbProvider provider, IDbConnection cn)
        {
            return this.GetUsedByFiles(provider, cn, null);
        }

        public FileCollection GetUsedByFiles(IYZDbProvider provider, IDbConnection cn, string property)
        {
            FileCollection files = new FileCollection();

            SpriteLinkCollection links = BPAManager.GetFileUsedByLinks(provider, cn, this.FileID, property);
            foreach (SpriteLink link in links)
            {
                File file = File.TryLoad(provider, cn, link.FileID);

                if (file == null)
                    continue;

                if (files.Contains(file.FileID))
                    continue;

                files.Add(file);
            }

            return files;
        }

        public FileCollection GetRelatedFiles(IYZDbProvider provider, IDbConnection cn)
        {
            FileCollection files = new FileCollection();

            foreach (Reference @ref in this.AllReferences)
            {
                if (files.Contains(@ref.FileID))
                    continue;

                File file = File.TryLoad(provider,cn, @ref.FileID);
                if (file == null)
                    continue;

                files.Add(file);
            }

            return files;
        }

        public FileCollection GetChildProcess(IYZDbProvider provider, IDbConnection cn)
        {
            FileCollection files = new FileCollection();

            foreach (Reference @ref in this.AllChildProcessReferences)
            {
                if (files.Contains(@ref.FileID))
                    continue;

                File file = File.TryLoad(provider, cn, @ref.FileID);
                if (file == null)
                    continue;

                files.Add(file);
            }

            return files;
        }

        public static File Load(IYZDbProvider provider, IDbConnection cn, string fileid)
        {
            Exception exp;
            File file = File.TryLoad(provider, cn, fileid, out exp);
            if (exp != null)
                throw exp;

            return file;
        }

        public static File TryLoad(IYZDbProvider provider, IDbConnection cn, string fileid)
        {
            Exception exp;
            return File.TryLoad(provider, cn, fileid, out exp);
        }

        private static File TryLoad(IYZDbProvider provider,IDbConnection cn, string fileid,out Exception exp)
        {
            string filePath = AttachmentInfo.FileIDToPath(fileid, AttachmentManager.AttachmentRootPath);

            exp = null;
            if (!System.IO.File.Exists(filePath))
            {
                exp = new Exception(String.Format(Resources.YZStrings.Aspx_Upload_FileIDNotFount, fileid));
                return null;
            }

            JObject jProcess;
            using (System.IO.StreamReader rd = new System.IO.StreamReader(filePath))
                jProcess = JObject.Parse(rd.ReadToEnd());

            AttachmentInfo attachment = AttachmentManager.GetAttachmentInfo(provider, cn, fileid);

            File file = jProcess.ToObject<File>();
            file.FileID = fileid;
            file.FileName = attachment != null ? attachment.Name : "";
            file.AttachmentInfo = attachment;

            return file;
        }

        public void UpdateSpritesIdentityAndLink(IYZDbProvider provider, IDbConnection cn)
        {
            SpriteIdentityCollection spriteIdentitys = this.Sprites.SortByOrder().Identities;
            SpriteLinkCollection links = this.AllSpriteLinks;

            BPAManager.ClearSpriteIdentityOfFile(provider, cn, this.FileID);
            BPAManager.ClearLinkOfFile(provider, cn, this.FileID);

            foreach (SpriteIdentity spriteIdentity in spriteIdentitys)
                BPAManager.Insert(provider, cn, spriteIdentity);

            foreach (SpriteLink link in links)
                BPAManager.Insert(provider, cn, link);
        }

        private void AddCommonColumns(IYZDbProvider provider, IDbConnection cn, DataTable table)
        {
            table.Columns.Add("CompanyName", typeof(string));
            table.Columns.Add("FileID", typeof(string));
            table.Columns.Add("FileName", typeof(string));
            table.Columns.Add("Code", typeof(string));
            table.Columns.Add("Order", typeof(string));
            table.Columns.Add("Version", typeof(string));
            table.Columns.Add("Creator", typeof(string));
            table.Columns.Add("CreateAt", typeof(DateTime));
            table.Columns.Add("ChangeBy", typeof(string));
            table.Columns.Add("LastChange", typeof(DateTime));
            table.Columns.Add("Owner", typeof(string));
            table.Columns.Add("ReleaseDate", typeof(DateTime));
            table.Columns.Add("Auditor", typeof(string));
            table.Columns.Add("AuditDate", typeof(DateTime));
            table.Columns.Add("Approval", typeof(string));
            table.Columns.Add("ApproveDate", typeof(DateTime));
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
            table.Columns.Add("CreatorAccount", typeof(string));
            table.Columns.Add("ChangeByAccount", typeof(string));
            table.Columns.Add("Chart", typeof(Image));
        }

        private void SetCommonValue(IYZDbProvider provider, IDbConnection cn, DataRow row)
        {
            row["CompanyName"] = System.Web.Configuration.WebConfigurationManager.AppSettings["CompanyInfoCompanyName"];
            row["FileID"] = this.FileID;
            row["FileName"] = this.FileName;
            row["Code"] = this.Property.Code;
            row["Order"] = this.Property.Order;
            row["Version"] = this.Property.Version;
            row["Creator"] = this.Property.CreatorUser.ShortName;
            row["CreateAt"] = this.Property.CreateAt;
            row["ChangeBy"] = this.Property.ChangeByUser.ShortName;
            row["LastChange"] = this.Property.LastChange;
            row["Owner"] = String.Join(",", this.Property.Owner.ToString(provider, cn));
            row["ReleaseDate"] = this.Property.ReleaseDate;
            row["Auditor"] = String.Join(",", this.Property.Auditor.ToString(provider, cn));
            row["AuditDate"] = this.Property.AuditDate;
            row["Approval"] = String.Join(",", this.Property.Approval.ToString(provider, cn));
            row["ApproveDate"] = this.Property.ApproveDate;
            row["Milestone"] = this.Property.Milestone.ToString();
            row["Since"] = this.Property.Since;
            row["Color"] = this.Property.Color.ToString();
            row["ExecuteStatus"] = this.Property.ExecuteStatus.ToString();
            row["Purpose"] = this.Property.Purpose;
            row["Scope"] = this.Property.Scope;
            row["Definition"] = this.Property.Definition;
            row["Responsibility"] = this.Property.Responsibility;
            row["DispatchScope"] = this.Property.DispatchScope;
            row["DesignPurpose"] = this.Property.DesignPurpose;
            row["CreatorAccount"] = this.Property.Creator;
            row["ChangeByAccount"] = this.Property.ChangeBy;
            row["Chart"] = this.Chart;
        }
    }
}