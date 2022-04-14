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
using BPM;
using YZSoft.Web.DAL;
using YZSoft.Library;
using YZSoft.Group;
using YZSoft.Web.BPA;

namespace YZSoft.Services.REST.BPA
{
    partial class ProcessReportsHandler
    {
        public virtual object GetDashboardData(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            List<int> rootfolderids = JArray.Parse(request.GetString("rootfolders")).ToObject<List<int>>();
            SpriteIdentity responsible = JObject.Parse(request.GetString("responsible")).ToObject<SpriteIdentity>();
            BPMObjectNameCollection milestones = JArray.Parse(request.GetString("milestones")).ToObject<BPMObjectNameCollection>();
            BPMObjectNameCollection moduletypes = JArray.Parse(request.GetString("moduletypes")).ToObject<BPMObjectNameCollection>();
            BPMObjectNameCollection colors = JArray.Parse(request.GetString("colors")).ToObject<BPMObjectNameCollection>();
            BPMObjectNameCollection executeStatus = JArray.Parse(request.GetString("executeStatus")).ToObject<BPMObjectNameCollection>();
            string uid = YZAuthHelper.LoginUserAccount;

            FileCollection files = new FileCollection();
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    if (rootfolderids.Count == 0)
                        rootfolderids = this.GetAllReportRootFolders(provider, cn, uid);

                    FileSystem.FileCollection allfiles = new FileSystem.FileCollection();
                    foreach (int rootfolderid in rootfolderids)
                    {
                        FileSystem.FolderCollection allfolders = FileSystem.DirectoryManager.GetAllChildFolders(provider, cn, rootfolderid, null, null);
                        FileSystem.FolderCollection rootFolders = allfolders.BuildTree(rootfolderid);
                        allfolders = rootFolders.Expand();

                        FileSystem.FileCollection folderfiles = FileSystem.DirectoryManager.GetFiles(provider, cn, allfolders.IDs, null, null, -1);
                        allfiles.AppendUnique(folderfiles);
                    }

                    foreach(FileSystem.File folderfile in allfiles)
                    {
                        File file = File.TryLoad(provider, cn, folderfile.FileID);
                        if (file == null)
                            continue;

                        //responsible过滤
                        if (!String.IsNullOrEmpty(responsible.FileID))
                        {
                            if (!file.Property.Owner.Contains(responsible))
                                continue;
                        }

                        //milestone过滤
                        if (milestones.Count != 0)
                        {
                            if (!milestones.Contains(file.Property.Milestone.ToString()))
                                continue;
                        }

                        //moduletypes过滤
                        if (moduletypes.Count != 0)
                        {
                            if (!moduletypes.Contains(file.AttachmentInfo.Ext))
                                continue;
                        }

                        //color过滤
                        if (colors.Count != 0)
                        {
                            if (!colors.Contains(file.Property.Color.ToString()))
                                continue;
                        }

                        //executeStatus过滤
                        if (executeStatus.Count != 0)
                        {
                            if (!executeStatus.Contains(file.Property.ExecuteStatus.ToString()))
                                continue;
                        }

                        files.Add(file);
                    }
                }
            }

            JObject rv = new JObject();
            JObject item;

            //Milestone
            item = new JObject();
            rv["Milestone"] = item;
            item["Total"] = files.Count;

            foreach(Milestone milestone in Enum.GetValues(typeof(Milestone)))
                item[milestone.ToString()] = 0;

            foreach (File file in files)
                item[file.Property.Milestone.ToString()] = (int)item[file.Property.Milestone.ToString()] + 1;

            //ExecuteStatus
            item = new JObject();
            rv["ExecuteStatus"] = item;

            foreach (ExecuteStatus executeState in Enum.GetValues(typeof(ExecuteStatus)))
                item[executeState.ToString()] = 0;

            foreach (File file in files)
                item[file.Property.ExecuteStatus.ToString()] = (int)item[file.Property.ExecuteStatus.ToString()] + 1;

            //Color
            item = new JObject();
            rv["Color"] = item;

            foreach (FileColor fileColor in Enum.GetValues(typeof(FileColor)))
                item[fileColor.ToString()] = 0;

            foreach (File file in files)
                item[file.Property.Color.ToString()] = (int)item[file.Property.Color.ToString()] + 1;

            //分类统计
            item = new JObject();
            rv["FileTypes"] = item;
            foreach (string ext in ".evc,.flow,.bpmn,.org,.data,.it,.product,.risk,.reg,.kpi".Split(','))
            {
                JObject jTypeCounts = new JObject();
                item[ext] = jTypeCounts;

                foreach (Milestone milestone in Enum.GetValues(typeof(Milestone)))
                    jTypeCounts[milestone.ToString()] = 0;

            }

            foreach (File file in files)
            {
                string ext = file.AttachmentInfo.Ext;
                if (ext != null)
                    ext = ext.ToLower().Trim();

                JObject jTypeCounts = item[ext] as JObject;
                if (jTypeCounts != null)
                    jTypeCounts[file.Property.Milestone.ToString()] = (int)jTypeCounts[file.Property.Milestone.ToString()] + 1;
            }

            //战略流程数量
            item = new JObject();
            rv["Strategic"] = item;
            item["StrategicProcess"] = 0;
            item["OperationProcess"] = 0;
            item["SupportProcess"] = 0;
            item["Other"] = 0;

            foreach (File file in files)
            {
                string filetype;

                if(file.isStrategicProces)
                    filetype = "StrategicProcess";
                else if(file.isOperationProcess)
                    filetype = "OperationProcess";
                else if(file.isSupportProcess)
                    filetype = "SupportProcess";
                else
                    filetype = "Other";

                item[filetype] = (int)item[filetype] + 1;
            }

            return rv;
        }
    }
}