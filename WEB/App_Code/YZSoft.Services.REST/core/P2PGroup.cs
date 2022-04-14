using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using YZSoft.Web.DAL;
using YZSoft.P2PGroup;
using BPM;
using BPM.Client;
using YZSoft.FileSystem;

namespace YZSoft.Services.REST.core
{
    public class P2PGroupHandler : YZServiceHandler
    {

        public object GetGroupInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int groupid = request.GetInt32("groupid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return P2PGroupManager.GetGroup(provider, cn, groupid);
                }
            }
        }
        public virtual object OpenOrCreateGroup(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = YZAuthHelper.LoginUserAccount;
            string peeraccount = request.GetString("peeraccount");
            P2PGroup.P2PGroup group;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Folder folder = this.CreateGroupFolder(provider, cn, String.Format("{0}_{1}", uid, peeraccount), "");
                    group = P2PGroupManager.TryGetGroup(provider, cn, uid, peeraccount);
                    if(group == null)
                    {
                        string userName1;
                        string userName2;

                        using (BPMConnection bpmcn = new BPMConnection())
                        {
                            bpmcn.WebOpen();
                            userName1 = User.FromAccount(bpmcn, uid).ShortName;
                            userName2 = User.FromAccount(bpmcn, peeraccount).ShortName;
                        }

                        group = new P2PGroup.P2PGroup() {
                            Account1 = uid,
                            Account2 = peeraccount,
                            UserName1 = userName1,
                            UserName2 = userName2,
                            FolderID = folder.FolderID,
                            CreateBy = uid,
                            CreateAt = DateTime.Now
                        };

                        P2PGroupManager.Insert(provider, cn, group);
                    }
                }
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                return new
                {
                    resName = group.GetGroupName(cn, uid),
                    groupid = group.GroupID,
                    folderid = group.FolderID
                };
            }
        }

        protected virtual Folder CreateGroupFolder(IYZDbProvider provider, IDbConnection cn, string name, string folderType)
        {
            string uid = YZAuthHelper.LoginUserAccount;

            Folder folder = new Folder();
            folder.FolderType = folderType;
            folder.ParentID = -1;
            folder.Name = name;
            folder.Desc = "";
            folder.Owner = uid;
            folder.CreateAt = DateTime.Now;
            folder.OrderIndex = 1;

            DirectoryManager.Insert(provider, cn, folder);
            folder.RootID = folder.FolderID;
            DirectoryManager.Update(provider, cn, folder);

            return folder;
        }
    }
}