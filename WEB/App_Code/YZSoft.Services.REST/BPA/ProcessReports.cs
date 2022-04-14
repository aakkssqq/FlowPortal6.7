using System;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using NPOI;
using NPOI.XWPF.UserModel;
using NPOI.OpenXmlFormats.Wordprocessing;
using YZNPOI.HSSF.UserModel;
using BPM;
using BPM.Client;
using BPM.Client.TaskTrace;
using YZSoft.Web.DAL;
using YZSoft.Web.Word;
using YZSoft.Library;
using YZSoft.Group;
using YZSoft.Web.BPA;
using YZSoft.Web.Excel;

namespace YZSoft.Services.REST.BPA
{
    public delegate DataSet GetFileReportDataHandler(string fileid, int documentFolderID, JObject jProcess, Image chart);
    public delegate DataSet GetObjectReportDataHandler(string fileid, string spriteid, JObject jProcess, Image chart);

    public partial class ProcessReportsHandler : YZServiceHandler
    {
        protected virtual AttachmentInfo GenerateFileReport(HttpContext context, GetFileReportDataHandler handler)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");
            string template = request.GetString("template");
            int tagfolderid = request.GetInt32("tagfolderid");
            string name = request.GetString("name");
            string method = request.GetString("method");
            string reportType = method.Substring(8, method.Length - 14);

            JObject jPost = request.GetPostData<JObject>();
            JObject jProcess = (JObject)jPost["process"];
            JObject jChart = (JObject)jPost["chart"];
            Image chart = this.GetImage(jChart);

            string templatePath = context.Server.MapPath(String.Format("~/YZSoft/BPA/processreport/templates/{0}/{1}", reportType, template));
            TemplateFileType templeteFileType = this.GetTemplateFileType(template);
            string ext = System.IO.Path.GetExtension(template);

            AttachmentInfo attachment = new AttachmentInfo();
            attachment.Name = name + ext;
            attachment.Ext = ext;

            DataSet dataset = handler.Invoke(fileid, tagfolderid, jProcess, chart);

            switch (templeteFileType)
            {
                case TemplateFileType.Excel:
                    HSSFWorkbook book;
                    using (System.IO.FileStream stream = new System.IO.FileStream(templatePath, System.IO.FileMode.Open, System.IO.FileAccess.Read, System.IO.FileShare.ReadWrite))
                    {
                        book = new HSSFWorkbook(stream);
                    }

                    ExcelGenerator.Fill(book, null, dataset);
                    ExcelGenerator.PrepareForOutput(book);
                    attachment = AttachmentManager.SaveAsAttachment(book, attachment);
                    break;
                default:
                    XWPFDocument doc;
                    using (System.IO.FileStream stream = new System.IO.FileStream(templatePath, System.IO.FileMode.Open, System.IO.FileAccess.Read, System.IO.FileShare.ReadWrite))
                    {
                        doc = new XWPFDocument(stream);
                    }
                    WordGenerator.Fill(doc, dataset);
                    attachment = AttachmentManager.SaveAsAttachment(doc, attachment);
                    break;
            }

            YZSoft.FileSystem.File file = new YZSoft.FileSystem.File();
            file.FolderID = tagfolderid;
            file.FileID = attachment.FileID;
            file.AddBy = YZAuthHelper.LoginUserAccount;
            file.AddAt = DateTime.Now;
            file.Flag = "Generate";

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    file.OrderIndex = YZSoft.FileSystem.DirectoryManager.GetFileNextOrderIndex(provider, cn, tagfolderid);
                    FileSystem.DirectoryManager.Insert(provider, cn, file);
                }
            }

            return attachment;
        }

        protected virtual AttachmentInfo GenerateObjectReport(HttpContext context, GetObjectReportDataHandler handler)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");
            string spriteid = request.GetString("spriteid");
            string template = request.GetString("template");
            int tagfolderid = request.GetInt32("tagfolderid");
            string name = request.GetString("name");
            string method = request.GetString("method");
            string reportType = method.Substring(8, method.Length - 14);

            JObject jPost = request.GetPostData<JObject>();
            JObject jProcess = (JObject)jPost["process"];
            JObject jChart = (JObject)jPost["chart"];
            Image chart = this.GetImage(jChart);

            string templatePath = context.Server.MapPath(String.Format("~/YZSoft/BPA/processreport/templates/{0}/{1}", reportType, template));
            TemplateFileType templeteFileType = this.GetTemplateFileType(template);
            string ext = System.IO.Path.GetExtension(template);

            AttachmentInfo attachment = new AttachmentInfo();
            attachment.Name = name + ext;
            attachment.Ext = ext;

            DataSet dataset = handler.Invoke(fileid, spriteid, jProcess, chart);

            switch (templeteFileType)
            {
                case TemplateFileType.Excel:
                    HSSFWorkbook book;
                    using (System.IO.FileStream stream = new System.IO.FileStream(templatePath, System.IO.FileMode.Open, System.IO.FileAccess.Read, System.IO.FileShare.ReadWrite))
                    {
                        book = new HSSFWorkbook(stream);
                    }

                    ExcelGenerator.Fill(book, null, dataset);
                    ExcelGenerator.PrepareForOutput(book);
                    attachment = AttachmentManager.SaveAsAttachment(book, attachment);
                    break;
                default:
                    break;
            }

            YZSoft.FileSystem.File file = new YZSoft.FileSystem.File();
            file.FolderID = tagfolderid;
            file.FileID = attachment.FileID;
            file.AddBy = YZAuthHelper.LoginUserAccount;
            file.AddAt = DateTime.Now;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    file.OrderIndex = YZSoft.FileSystem.DirectoryManager.GetFileNextOrderIndex(provider, cn, tagfolderid);
                    FileSystem.DirectoryManager.Insert(provider, cn, file);
                }
            }

            return attachment;
        }

        public virtual JObject GetBPMProcessOverviewInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string processName = request.GetString("processName");
            Version version = request.GetVersion("version");

            string fileid;
            NodeItemCollection nodes;
            LinkItemCollection links;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMProcess.GetKMInfo(cn, processName, version, out fileid, out nodes, out links);
            }

            if (String.IsNullOrEmpty(fileid))
                throw new Exception(String.Format(Resources.YZStrings.BPA_ProcessReport_NoRelatiedBPAFile, processName));

            File file;
            YZSoft.FileSystem.FileCollection docs;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    file = File.Load(provider, cn, fileid);
                    docs = FileSystem.DirectoryManager.GetFiles(provider, cn, file.AttachmentInfo.LParam1, null, "ID DESC", -1);
                    docs = docs.PerformAttachmentInfo(provider, cn, null);
                }
            }

            JObject rv = new JObject();
            rv["FileID"] = file.FileID;
            rv["Purpose"] = file.Property.Purpose;
            rv["Scope"] = file.Property.Scope;
            rv["Definition"] = file.Property.Definition;
            rv["Responsibility"] = file.Property.Responsibility;
            rv["DispatchScope"] = file.Property.DispatchScope;
            rv["DesignPurpose"] = file.Property.DesignPurpose;

            JArray activities = new JArray();
            rv["activities"] = activities;
            foreach (NodeItem nodeItem in nodes)
            {
                if (!nodeItem.IsHumanStep)
                    continue;

                JObject activity = new JObject();
                activities.Add(activity);

                activity["NodeName"] = nodeItem.Name;

                if (!String.IsNullOrEmpty(nodeItem.RelatedSpriteId))
                {
                    Sprite sprite = file.Sprites.TryGetItem(nodeItem.RelatedSpriteId);
                    if (sprite != null)
                    {
                        activity["SpriteID"] = sprite.Id;
                        activity["SpriteName"] = sprite.Name;
                    }
                }
            }

            rv["documents"] = JArray.FromObject(docs);

            return rv;
        }

        public virtual object GetBPMProcessRACI(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string processName = request.GetString("processName");
            Version version = request.GetVersion("version");

            string fileid;
            NodeItemCollection nodes;
            LinkItemCollection links;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMProcess.GetKMInfo(cn, processName, version, out fileid, out nodes, out links);
            }

            if (String.IsNullOrEmpty(fileid))
                throw new Exception(String.Format(Resources.YZStrings.BPA_ProcessReport_NoRelatiedBPAFile, processName));


            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    File file = File.Load(provider, cn, fileid);

                    DataTable table = file.Sprites.SortByOrder().GetRACIDetailTable(provider, cn, "result");
                    table = this.Map(table, nodes);
                    return table;
                }
            }
        }

        public virtual DataTable Map(DataTable srcTable, NodeItemCollection nodes)
        {
            DataTable tagTable = new DataTable(srcTable.TableName);

            foreach (DataColumn column in srcTable.Columns)
                tagTable.Columns.Add(column.ColumnName, column.DataType);

            tagTable.Columns.Add("NodeName", typeof(string));

            foreach (DataRow srcRow in srcTable.Rows)
            {
                NodeItem node = this.Find(nodes, Convert.ToString(srcRow["SpriteID"]));
                if (node != null)
                {
                    DataRow tagRow = tagTable.NewRow();
                    tagTable.Rows.Add(tagRow);

                    tagRow["NodeName"] = node.Name;

                    foreach (DataColumn column in srcTable.Columns)
                        tagRow[column.ColumnName] = srcRow[column.ColumnName];
                }
            }

            return tagTable;
        }

        public virtual JObject GetFileOverviewInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");

            File file;
            YZSoft.FileSystem.FileCollection docs;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    file = File.Load(provider, cn, fileid);
                    docs = FileSystem.DirectoryManager.GetFiles(provider, cn, file.AttachmentInfo.LParam1, null, "ID DESC", -1);
                    docs = docs.PerformAttachmentInfo(provider, cn, null);
                }
            }

            JObject rv = new JObject();
            rv["FileID"] = file.FileID;
            rv["Purpose"] = file.Property.Purpose;
            rv["Scope"] = file.Property.Scope;
            rv["Definition"] = file.Property.Definition;
            rv["Responsibility"] = file.Property.Responsibility;
            rv["DispatchScope"] = file.Property.DispatchScope;
            rv["DesignPurpose"] = file.Property.DesignPurpose;

            JArray activities = new JArray();
            rv["activities"] = JArray.FromObject(file.Sprites.SortByOrder().Identities);

            rv["documents"] = JArray.FromObject(docs);

            return rv;
        }

        public virtual object GetSpriteOverviewInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");
            string spriteid = request.GetString("spriteid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    File file = File.Load(provider,cn,fileid);

                    Sprite sprite = file.Sprites[spriteid];
                    sprite.AllReferences.RefreshName(provider, cn);

                    SpriteCollection usedby = sprite.GetUsedBySprites(provider, cn);

                    YZSoft.FileSystem.FileCollection docs = new FileSystem.FileCollection();
                    if (sprite.FolderID != 0)
                    {
                        docs = FileSystem.DirectoryManager.GetFiles(provider, cn, sprite.FolderID, null, "ID DESC", -1);
                        docs = docs.PerformAttachmentInfo(provider, cn, null);
                    }

                    return new
                    {
                        sprite = sprite,
                        usedby = usedby.Identities,
                        usedbyFiles = usedby.Files.Identities,
                        parentFile = new FileIdentity(file),
                        documents = docs
                    };
                }
            }
        }

        public virtual object GetPersonalOverviewInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    UserPositionCollection positions = BPAManager.GetUserPositions(provider, cn, uid);
                    SpriteCollection sprites = positions.GetSprites(provider, cn);
                    FileCollection files = sprites.GetUsedBySprites(provider, cn, null).Files;

                    return new
                    {
                        positions = sprites.Identities,
                        files = files.Identities,
                        Responsible = sprites.GetUsedBySprites(provider, cn, "Responsible").Identities,
                        Accountable = sprites.GetUsedBySprites(provider, cn, "Accountable").Identities,
                        Consulted = sprites.GetUsedBySprites(provider, cn, "Consulted").Identities,
                        Informed = sprites.GetUsedBySprites(provider, cn, "Informed").Identities
                    };
                }
            }
        }

        public virtual object GetStepOverviewInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("stepid");

            string fileid;
            string spriteid;
            BPMProcStep step;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMProcStep.GetRelatedSprite(cn, stepid, out fileid, out spriteid);
                step = BPMProcStep.Load(cn, stepid);
            }

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    File file = File.Load(provider, cn, fileid);

                    Sprite sprite = file.Sprites[spriteid];
                    sprite.AllReferences.RefreshName(provider, cn);

                    SpriteCollection usedby = sprite.GetUsedBySprites(provider, cn);

                    return new
                    {
                        sprite = sprite,
                        usedby = usedby.Identities,
                        usedbyFiles = usedby.Files.Identities,
                        parentProcess = new {
                            ProcessName = step.ProcessName,
                            Version = step.ProcessVersion.ToString(2)
                        }
                    };
                }
            }
        }

        public virtual object GetFileActivities(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    File file = File.Load(provider, cn, fileid);

                    DataTable table = file.Sprites.SortByOrder().GetDetailTable(provider, cn, "result");
                    return table;
                }
            }
        }

        public virtual object GetFileRACI(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    File file = File.Load(provider, cn, fileid);

                    DataTable table = file.Sprites.SortByOrder().GetRACIDetailTable(provider, cn, "result");
                    return table;
                }
            }
        }

        public virtual object GetFileRisk(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    File file = File.Load(provider, cn, fileid);

                    DataTable table = file.Sprites.SortByOrder().GetActivityReferenceDetailTable(provider, cn, "Risk", "result");
                    return table;
                }
            }
        }

        public virtual object GetFileKPI(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string fileid = request.GetString("fileid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    File file = File.Load(provider, cn, fileid);

                    DataTable table = file.Sprites.SortByOrder().GetActivityReferenceDetailTable(provider, cn, "KPI", "result");
                    return table;
                }
            }
        }

        public virtual JArray GetUserActivities(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");

            JArray rv = new JArray();
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    UserPositionCollection userpositions = BPAManager.GetUserPositions(provider, cn, uid);
                    SpriteCollection posSprites = userpositions.GetSprites(provider, cn);
                    SpriteCollection usedbySprites = posSprites.GetUsedBySprites(provider, cn, null);
                    usedbySprites.Sort();

                    foreach (Sprite usedbySprite in usedbySprites)
                    {
                        JObject jItem = new JObject();
                        rv.Add(jItem);

                        jItem["FileID"] = usedbySprite.File.FileID;
                        jItem["FileName"] = usedbySprite.File.FileName;
                        jItem["SpriteID"] = usedbySprite.Id;
                        jItem["SpriteName"] = usedbySprite.Name;
                        jItem["Desc"] = usedbySprite.Property.Description;
                        jItem["Remark"] = usedbySprite.Property.Remark;
                        jItem["RACI"] = String.Join("/", this.GetRACIFlags(usedbySprite, posSprites));
                    }
                }

                return rv;
            }
        }

        public virtual JArray GetUserRisks(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");

            JArray rv = new JArray();
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    UserPositionCollection userpositions = BPAManager.GetUserPositions(provider, cn, uid);
                    SpriteCollection posSprites = userpositions.GetSprites(provider, cn);
                    SpriteCollection usedbySprites = posSprites.GetUsedBySprites(provider, cn, null);
                    usedbySprites.Sort();

                    foreach (Sprite usedbySprite in usedbySprites)
                    {
                        List<string> risks = new List<string>();
                        foreach (Sprite riskSprite in usedbySprite.Property.Risk.GetSprites(provider,cn))
                        {
                            risks.Add(String.Format("{0}>{1}:\n{2}",
                                riskSprite.File.FileName,
                                riskSprite.Name,
                                riskSprite.Property.Description));
                        }

                        if (risks.Count != 0)
                        {
                            JObject jItem = new JObject();
                            rv.Add(jItem);

                            jItem["FileID"] = usedbySprite.File.FileID;
                            jItem["FileName"] = usedbySprite.File.FileName;
                            jItem["SpriteID"] = usedbySprite.Id;
                            jItem["SpriteName"] = usedbySprite.Name;
                            jItem["Desc"] = usedbySprite.Property.Description;
                            jItem["Remark"] = usedbySprite.Property.Remark;
                            jItem["Risk"] = String.Join("\n",risks.ToArray());
                            jItem["RACI"] = String.Join("/", this.GetRACIFlags(usedbySprite, posSprites));
                        }
                    }
                }

                return rv;
            }
        }

        public virtual JArray GetUserKPIs(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");

            JArray rv = new JArray();
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    UserPositionCollection userpositions = BPAManager.GetUserPositions(provider, cn, uid);
                    SpriteCollection posSprites = userpositions.GetSprites(provider, cn);
                    SpriteCollection usedbySprites = posSprites.GetUsedBySprites(provider, cn, null);
                    usedbySprites.Sort();

                    foreach (Sprite usedbySprite in usedbySprites)
                    {
                        List<string> kpis = new List<string>();
                        foreach (Sprite kpiSprite in usedbySprite.Property.KPI.GetSprites(provider, cn))
                        {
                            kpis.Add(String.Format("{0}>{1}:\n{2}",
                                kpiSprite.File.FileName,
                                kpiSprite.Name,
                                kpiSprite.Property.Description));
                        }

                        if (kpis.Count != 0)
                        {
                            JObject jItem = new JObject();
                            rv.Add(jItem);

                            jItem["FileID"] = usedbySprite.File.FileID;
                            jItem["FileName"] = usedbySprite.File.FileName;
                            jItem["SpriteID"] = usedbySprite.Id;
                            jItem["SpriteName"] = usedbySprite.Name;
                            jItem["Desc"] = usedbySprite.Property.Description;
                            jItem["Remark"] = usedbySprite.Property.Remark;
                            jItem["KPI"] = String.Join("\n", kpis.ToArray());
                            jItem["RACI"] = String.Join("/", this.GetRACIFlags(usedbySprite, posSprites));
                        }
                    }
                }

                return rv;
            }
        }

        public virtual JArray GetUserRACI(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");

            JArray rv = new JArray();
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    UserPositionCollection userpositions = BPAManager.GetUserPositions(provider, cn, uid);
                    SpriteCollection posSprites = userpositions.GetSprites(provider, cn);
                    SpriteCollection usedbySprites = posSprites.GetUsedBySprites(provider, cn, null);
                    usedbySprites.Sort();

                    foreach (Sprite usedbySprite in usedbySprites)
                    {
                        JObject jItem = new JObject();
                        rv.Add(jItem);

                        jItem["FileID"] = usedbySprite.File.FileID;
                        jItem["FileName"] = usedbySprite.File.FileName;
                        jItem["SpriteID"] = usedbySprite.Id;
                        jItem["SpriteName"] = usedbySprite.Name;
                        jItem["Desc"] = usedbySprite.Property.Description;
                        jItem["Remark"] = usedbySprite.Property.Remark;
                        jItem["R"] = String.Join(",", usedbySprite.Property.Responsible.ToString(provider, cn));
                        jItem["A"] = String.Join(",", usedbySprite.Property.Accountable.ToString(provider, cn));
                        jItem["C"] = String.Join(",", usedbySprite.Property.Consulted.ToString(provider, cn));
                        jItem["I"] = String.Join(",", usedbySprite.Property.Informed.ToString(provider, cn));
                    }
                }

                return rv;
            }
        }

        protected virtual NodeItem Find(NodeItemCollection nodes, string spriteid)
        {
            foreach (NodeItem node in nodes)
            {
                if (String.Compare(node.RelatedSpriteId, spriteid, true) == 0)
                    return node;
            }

            return null;
        }

        protected virtual string[] GetRACIFlags(Sprite sprite, SpriteCollection posSprites)
        {
            List<string> raci = new List<string>();
            if (sprite.Property.Responsible.Intersect(posSprites).Count != 0)
                raci.Add("R");
            if (sprite.Property.Accountable.Intersect(posSprites).Count != 0)
                raci.Add("A");
            if (sprite.Property.Consulted.Intersect(posSprites).Count != 0)
                raci.Add("C");
            if (sprite.Property.Informed.Intersect(posSprites).Count != 0)
                raci.Add("I");

            return raci.ToArray();
        }

        protected virtual TemplateFileType GetTemplateFileType(string template)
        {
            string ext = System.IO.Path.GetExtension(template);

            if (ext != null)
                ext.ToLower();

            switch (ext)
            {
                case ".xls":
                case ".xlsx":
                    return TemplateFileType.Excel;
                default:
                    return TemplateFileType.Word;
            }
        }

        protected virtual Image GetImage(JObject jChart)
        {
            int bboxX = (int)jChart["bboxX"];
            int bboxY = (int)jChart["bboxY"];
            int bboxWidth = (int)jChart["bboxWidth"];
            int bboxHeight = (int)jChart["bboxHeight"];
            string imageBase64data = (string)jChart["data"];

            return this.CreateImage(imageBase64data, bboxX, bboxY, bboxWidth, bboxHeight);
        }

        protected virtual Image CreateImage(string imageBase64Data, int bboxX, int bboxY, int bboxWidth, int bboxHeight)
        {
            using (Bitmap image = YZImageHelper.FromBase64String(imageBase64Data))
            {
                return YZImageHelper.ClipImage(image, new Rectangle(bboxX, bboxY, bboxWidth, bboxHeight));
            }
        }

        protected virtual List<int> GetAllReportRootFolders(IYZDbProvider provider, IDbConnection cn, string uid)
        {
            List<int> folderids = new List<int>();
            foreach (Library.Library lib in LibraryManager.GetLibraries(provider, cn, uid, LibraryType.BPAFile.ToString(), null, null))
            {
                if (!lib.Deleted)
                    folderids.Add(lib.FolderID);
            }
            foreach (Group.Group group in GroupManager.GetGroups(provider, cn, null, "BPATeam", null, null))
            {
                if (!group.Deleted)
                    folderids.Add(group.FolderID);
            }

            return folderids;
        }
    }

    public enum TemplateFileType
    {
        Word,
        Excel
    }
}