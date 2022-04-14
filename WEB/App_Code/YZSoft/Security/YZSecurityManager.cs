using System;
using System.Collections.Generic;
using System.Web;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using System.Text;
using System.Reflection;
using System.Dynamic;
using Newtonsoft.Json.Linq;

/// <summary>
///YZSecurityManager 的摘要说明


/// </summary>
public class YZSecurityManager
{
    public static void ApplayPermision(JsonItemCollection items)
    {
        using (BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();
            ApplayPermision(cn, items);
        }
    }

    public static void ApplayPermision(JArray items)
    {
        using (BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();
            ApplayPermision(cn, items,true);
        }
    }

    public static JArray ApplayPermision(object[] objArray)
    {
        return ApplayPermision(objArray, true);
    }

    public static JArray ApplayPermision(object[] objArray, bool userResource)
    {
        JArray items = JArray.FromObject(objArray);

        using (BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();
            ApplayPermision(cn, items, userResource);
        }

        return items;
    }

    public static void ApplayPermision(BPMConnection cn, JArray items, bool userResource)
    {
        for (int moduleIndex = 0; moduleIndex < items.Count; moduleIndex++)
        {
            JObject item = items[moduleIndex] as JObject;
            bool moduleExecute = true;

            JToken token = item["modulePerm"];
            if (token != null)
            {
                YZModulePermision perm = token.ToObject<YZModulePermision>();
                item.Remove("modulePerm");

                //检查模块权限
                if(userResource)
                    moduleExecute = UserResource.CheckPermision(cn, perm.RSID, "Execute");
                else
                    moduleExecute = SecurityManager.CheckPermision(cn, perm.RSID, BPMPermision.Execute);

                if (moduleExecute)
                {
                    //获得模块config配置项
                    JObject config = item["config"] as JObject;
                    if (config == null)
                    {
                        config = new JObject();
                        item["config"] = config;
                    }

                    //在config配置项下建perm配置
                    JObject jsonPerm = new JObject();
                    config["perm"] = jsonPerm;

                    //记录模块rsid
                    jsonPerm["rsid"] = perm.RSID;

                    //生成工具条上的访问权限
                    if (userResource)
                    {
                        if (perm.GenToolbarPermision)
                        {
                            //获得工具条上的模块级权限种类
                            UserResourcePermisionCollection resourcePerms = UserResource.GetPermisions(cn, perm.RSID);
                            BPMObjectNameCollection permNames = new BPMObjectNameCollection();
                            foreach (UserResourcePermision resourcePerm in resourcePerms)
                            {
                                if (resourcePerm.PermType == UserResourcePermisionType.Module)
                                    permNames.Add(resourcePerm.PermName);
                            }

                            //记录工具条上的模块级权限许可情况
                            bool[] rv = UserResource.CheckPermision(cn, perm.RSID, permNames);
                            for (int i = 0; i < permNames.Count; i++)
                                jsonPerm[permNames[i]] = rv[i];
                        }
                    }
                }
                else
                {
                    items.RemoveAt(moduleIndex);
                    moduleIndex--;
                }
            }

            //此模块可见则检查子级
            if (moduleExecute)
            {
                JArray children = item[YZJsonProperty.children] as JArray;
                if (children != null)
                {
                    int allCount = children.Count;
                    ApplayPermision(cn, children, userResource);

                    if (allCount != 0 && children.Count == 0)
                    {
                        //item.Attributes["empty"] = true;
                        items.RemoveAt(moduleIndex);
                        moduleIndex--;
                        continue;
                    }
                }

                JArray tabs = item["tabs"] as JArray;
                if (tabs != null)
                {
                    int allCount = tabs.Count;
                    ApplayPermision(cn, tabs, userResource);

                    if (allCount != 0 && tabs.Count == 0)
                    {
                        //item.Attributes["empty"] = true;
                        items.RemoveAt(moduleIndex);
                        moduleIndex--;
                        continue;
                    }
                }
            }
        }
    }

    public static void ApplayPermision(BPMConnection cn, JsonItemCollection items)
    {
        for(int moduleIndex = 0; moduleIndex < items.Count ; moduleIndex++)
        {
            JsonItem item = items[moduleIndex];
            bool moduleExecute = true;
             
            if (item.Attributes.ContainsKey("modulePerm"))
            {
                YZModulePermision perm = item.Attributes["modulePerm"] as YZModulePermision;
                item.Attributes.Remove("modulePerm");

                //检查模块权限
                moduleExecute = UserResource.CheckPermision(cn, perm.RSID, "Execute");

                if (moduleExecute)
                {
                    //获得模块config配置项
                    JsonItem config = null;
                    if (item.Attributes.ContainsKey("config"))
                        config = item.Attributes["config"] as JsonItem;
                    else
                    {
                        config = new JsonItem();
                        item.Attributes["config"] = config;
                    }

                    //在config配置项下建perm配置
                    JsonItem jsonPerm = new JsonItem();
                    config.Attributes["perm"] = jsonPerm;

                    //记录模块rsid
                    jsonPerm.Attributes["rsid"] = perm.RSID;

                    //生成工具条上的访问权限
                    if (perm.GenToolbarPermision)
                    {
                        //获得工具条上的模块级权限种类
                        UserResourcePermisionCollection resourcePerms = UserResource.GetPermisions(cn, perm.RSID);
                        BPMObjectNameCollection permNames = new BPMObjectNameCollection();
                        foreach (UserResourcePermision resourcePerm in resourcePerms)
                        {
                            if (resourcePerm.PermType == UserResourcePermisionType.Module)
                                permNames.Add(resourcePerm.PermName);
                        }

                        //记录工具条上的模块级权限许可情况
                        bool[] rv = UserResource.CheckPermision(cn, perm.RSID, permNames);
                        for (int i = 0; i < permNames.Count; i++)
                            jsonPerm.Attributes[permNames[i]] = rv[i];
                    }
                }
                else
                {
                    items.RemoveAt(moduleIndex);
                    moduleIndex--;
                }
            }

            //此模块可见则检查子级
            if (moduleExecute)
            {
                if (item.Attributes.ContainsKey(YZJsonProperty.children))
                {
                    JsonItemCollection children = item.Attributes[YZJsonProperty.children] as JsonItemCollection;
                    if (children != null)
                    {
                        int allCount = children.Count;
                        ApplayPermision(cn, children);

                        if (allCount != 0 && children.Count == 0)
                        {
                            //item.Attributes["empty"] = true;
                            items.RemoveAt(moduleIndex);
                            moduleIndex--;
                            continue;
                        }
                    }
                }

                if (item.Attributes.ContainsKey("tabs"))
                {
                    JsonItemCollection tabs = item.Attributes["tabs"] as JsonItemCollection;
                    if (tabs != null)
                    {
                        int allCount = tabs.Count;
                        ApplayPermision(cn, tabs);

                        if (allCount != 0 && tabs.Count == 0)
                        {
                            //item.Attributes["empty"] = true;
                            items.RemoveAt(moduleIndex);
                            moduleIndex--;
                            continue;
                        }
                    }
                }
            }
        }
    }

    public static void ApplayRecordPermision(BPMConnection cn, JArray items, string rsid, string tableName, string jsonitemKeyAttrName)
    {
        //获得资源上的记录级权限种类
        UserResourcePermisionCollection resourcePerms = UserResource.GetPermisions(cn, rsid);
        BPMObjectNameCollection permNames = new BPMObjectNameCollection();
        foreach (UserResourcePermision resourcePerm in resourcePerms)
        {
            if (resourcePerm.PermType == UserResourcePermisionType.Record)
                permNames.Add(resourcePerm.PermName);
        }

        //应用权限
        foreach (JObject item in items)
        {
            string key = (string)item[jsonitemKeyAttrName];
            bool[] rv = RecordSecurityManager.CheckPermision(cn, tableName, key, permNames);

            JObject jsonPerm = new JObject();
            item["perm"] = jsonPerm;
            for (int i = 0; i < permNames.Count; i++)
                jsonPerm[permNames[i]] = rv[i];
        }
    }

    public static void ApplayRecordPermision(BPMConnection cn, JsonItemCollection items,string rsid, string tableName,string jsonitemKeyAttrName)
    {
        //获得资源上的记录级权限种类
        UserResourcePermisionCollection resourcePerms = UserResource.GetPermisions(cn, rsid);
        BPMObjectNameCollection permNames = new BPMObjectNameCollection();
        foreach (UserResourcePermision resourcePerm in resourcePerms)
        {
            if (resourcePerm.PermType == UserResourcePermisionType.Record)
                permNames.Add(resourcePerm.PermName);
        }

        //应用权限
        foreach(JsonItem item in items)
        {
            string key = Convert.ToString(item.Attributes[jsonitemKeyAttrName]);
            bool[] rv = RecordSecurityManager.CheckPermision(cn, tableName, key, permNames);

            JsonItem jsonPerm = new JsonItem();
            item.Attributes["perm"] = jsonPerm;
            for (int i = 0; i < permNames.Count; i++)
                jsonPerm.Attributes[permNames[i]] = rv[i];
        }
    }

    public static string GetPermisionFilterString(string tableName, string columnName, string permision, SecurityToken token)
    {
        if (token.SIDs.Contains(WellKnownSID.Administrators))
            return null;

        StringBuilder sb = new StringBuilder();
        foreach(string sid in token.SIDs)
        {
            if(sb.Length != 0)
                sb.Append(",");

            sb.Append("'");
            sb.Append(sid);
            sb.Append("'");
        }

        string filter = String.Format("{0} IN(SELECT KeyValue FROM BPMSecurityRecordACL WHERE TableName=N'{1}' AND Permision=N'{2}' AND SID IN({3}))",
        //string filter = String.Format("{0} IN(SELECT KeyValue FROM BPMSecurityRecordACL WHERE TableName=N'{1}' AND Permision=N'{2}' AND (SID IN({3}) OR (LeadershipToken=1 AND SID IN(SELECT SID FROM BPMSecurityExtToken WHERE Account=N'{4}'))))",
            columnName,
            tableName,
            permision,
            sb.ToString(),
            YZAuthHelper.LoginUserAccount);

        return filter;
    }

    public static string GetTaskPermisionFilterString(string columnName,SecurityToken token)
    {
        if (token.SIDs.Contains(WellKnownSID.Administrators))
            return null;

        StringBuilder sb = new StringBuilder();
        foreach(string sid in token.SIDs)
        {
            if(sb.Length != 0)
                sb.Append(",");

            sb.Append("'");
            sb.Append(sid);
            sb.Append("'");
        }

        string filter = String.Format("{0} IN(SELECT TaskID FROM BPMInstProcSteps WHERE OwnerAccount=N'{1}' OR AgentAccount=N'{1}' OR ConsignOwnerAccount=N'{1}') OR {0} IN(SELECT TaskID FROM BPMSecurityTACL WHERE AllowRead=1 AND SID IN({2}))",
            columnName,
            YZAuthHelper.LoginUserAccount,
            sb.ToString());

        return filter;
    }

    public static bool CheckModulePermision(string rsid, string permName)
    {
        using (BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();
            return CheckModulePermision(cn, rsid, permName);
        }
    }

    public static bool CheckModulePermision(BPMConnection cn, string rsid, string permName)
    {
        return UserResource.CheckPermision(cn, rsid, permName);
    }
}
