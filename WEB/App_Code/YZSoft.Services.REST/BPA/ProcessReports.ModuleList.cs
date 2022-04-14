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
using System.Web.UI.WebControls;
using BPM;
using YZSoft.Web.DAL;
using YZSoft.Library;
using YZSoft.Group;
using YZSoft.Web.BPA;

namespace YZSoft.Services.REST.BPA
{
    partial class ProcessReportsHandler
    {
        public virtual DataTable GetModuleList(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            List<int> rootfolderids = JArray.Parse(request.GetString("rootfolders")).ToObject<List<int>>();
            SpriteIdentity responsible = JObject.Parse(request.GetString("responsible")).ToObject<SpriteIdentity>();
            BPMObjectNameCollection milestones = JArray.Parse(request.GetString("milestones")).ToObject<BPMObjectNameCollection>();
            BPMObjectNameCollection moduletypes = JArray.Parse(request.GetString("moduletypes")).ToObject<BPMObjectNameCollection>();
            BPMObjectNameCollection colors = JArray.Parse(request.GetString("colors")).ToObject<BPMObjectNameCollection>();
            BPMObjectNameCollection executeStatus = JArray.Parse(request.GetString("executeStatus")).ToObject<BPMObjectNameCollection>();
            string uid = YZAuthHelper.LoginUserAccount;
            BPMObjectNameCollection indexs = BPMObjectNameCollection.FromStringList(".evc,.flow,.bpmn,.org,.data,.it,.product,.risk,.reg,.kpi",',');

            DataTable table = new DataTable();

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    FileCollection files = new FileCollection();

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

                    foreach (FileSystem.File folderfile in allfiles)
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

                    DataRow row;

                    table.Columns.Add("OrderIndex", typeof(string));
                    table.Columns.Add("SubOrderIndex", typeof(string));
                    table.Columns.Add("Ext", typeof(string));
                    table.Columns.Add("Category", typeof(string));
                    table.Columns.Add("FileOrderFlag", typeof(int));
                    table.Columns.Add("FileOrder", typeof(string));
                    table.Columns.Add("FileCode", typeof(string));
                    table.Columns.Add("FileID", typeof(string));
                    table.Columns.Add("FileName", typeof(string));
                    table.Columns.Add("Responsible", typeof(string));

                    foreach (File file in files)
                    {
                        string ext = file.AttachmentInfo.Ext;
                        if (ext != null)
                            ext = ext.ToLower().Trim();

                        string category;
                        int subOrderIndex = 0;

                        if (file.isStrategicProces)
                        {
                            category = Resources.YZStrings.BPA_StrategicProcess;
                            subOrderIndex = 0;
                        }
                        else if (file.isOperationProcess)
                        {
                            category = Resources.YZStrings.BPA_OperationProcess;
                            subOrderIndex = 1;
                        }
                        else if (file.isSupportProcess)
                        {
                            category = Resources.YZStrings.BPA_SupportProcess;
                        }
                        else
                        {
                            category = File.GetCategoryNameFromExt(ext);
                        }

                        row = table.NewRow();
                        table.Rows.Add(row);

                        int orderIndex = indexs.IndexOf(ext);
                        row["OrderIndex"] = orderIndex == -1 ? Int32.MaxValue : orderIndex;
                        row["SubOrderIndex"] = subOrderIndex;
                        row["Ext"] = ext;
                        row["Category"] = category;
                        row["FileOrderFlag"] = String.IsNullOrEmpty(file.Property.Order) ? 1 : 0;
                        row["FileOrder"] = file.Property.Order;
                        row["FileCode"] = file.Property.Code;
                        row["FileID"] = file.FileID;
                        row["FileName"] = file.AttachmentInfo.Name;
                        row["Responsible"] = String.Join(",", file.Property.Owner.ToString(provider, cn));
                    }
                }
            }

            DataView view = new DataView(table);
            view.Sort = "OrderIndex ASC,SubOrderIndex ASC,FileOrderFlag,FileOrder,FileCode,FileID";
            return view.ToTable(table.TableName);
        }
    }
}