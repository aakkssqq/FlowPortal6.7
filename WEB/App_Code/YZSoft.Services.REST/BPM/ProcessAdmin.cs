using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Notify;
using BPM.Client.Security;

namespace YZSoft.Services.REST.BPM
{
    public class ProcessAdminHandler : YZServiceHandler
    {
        public virtual JArray GetProcessVersions(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string processName = request.GetString("ProcessName");
            bool active = request.GetBool("active",true);
            BPMProcessCollection processes;

            //获得数据
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                string path = cn.GetGlobalObjectFolder(StoreZoneType.Process, processName);
                processes = cn.GetProcessVersions(path, BPMPermision.Read, processName);
            }

            //将数据转化为Json集合
            JArray rv = new JArray();

            BPMProcess activeProcess = null;
            foreach (BPMProcess process in processes)
            {
                if (process.Active)
                {
                    activeProcess = process;
                    continue;
                }

                rv.Insert(0, this.Serialize(process));
            }

            if (activeProcess != null && active)
                rv.Insert(0, this.Serialize(activeProcess));

            return rv;
        }

        public virtual BPMProcess GetProcessDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);
            Version version = request.GetVersion("version",null);
            BPMProcess process = new BPMProcess();

            //获得数据
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                process.Load(cn, path, version);
            }

            return process;
        }

        public virtual object GetProcessProperty(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string processName = request.GetString("processName");
            Version version = request.GetVersion("version");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                return new {
                    GlobalTableIdentitys = BPMProcess.GetProcessGlobalTableIdentitys(cn, processName, version),
                    Property = BPMProcess.GetProcessProperty(cn, processName, version),
                    MessageGroups = BPMProcess.GetMessageGroups(cn, processName, version),
                    Events = BPMProcess.GetEvents(cn, processName, version)
                };
            }
        }

        public virtual object SaveProcess(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");
            Version version = request.GetVersion("version");
            JObject post = request.GetPostData<JObject>();
            BPMProcess process = post.ToObject<BPMProcess>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                process.Save(cn, path, version, true);
            }

            return new
            {
                server = WebConfigurationManager.AppSettings["BPMServerName"],
                version = process.Version.ToString(2)
            };
        }

        public virtual object SaveProcessAsNewVersion(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path");
            JObject post = request.GetPostData<JObject>();
            BPMProcess process = post.ToObject<BPMProcess>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                process.Save(cn, path, null, true);
            }

            return new
            {
                server = WebConfigurationManager.AppSettings["BPMServerName"],
                version = process.Version.ToString(2)
            };
        }

        public virtual object PublishProcess(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder","");
            string processName = request.GetString("processName");
            JObject post = request.GetPostData<JObject>();
            BPMProcess process = post.ToObject<BPMProcess>();
            string path = System.IO.Path.Combine(folder, processName);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                process.Save(cn, path, null, false);
            }

            return new
            {
                server = WebConfigurationManager.AppSettings["BPMServerName"],
                path = path,
                version = process.Version.ToString(2)
            };
        }

        public virtual void SaveProcessProperty(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder","");
            string processName = request.GetString("processName");
            Version version = request.GetVersion("version");
            string path = System.IO.Path.Combine(folder, processName);

            JObject post = request.GetPostData<JObject>();
            ProcessProperty property = post["Property"].ToObject<ProcessProperty>();
            MessageGroupCollection messageGroups = post["MessageGroups"].ToObject<MessageGroupCollection>();
            EventCollection events = post["Events"].ToObject<EventCollection>();
            ACL acl = post["acl"].ToObject<ACL>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMProcess.SetProcessProperty(cn, processName, version, property, messageGroups, events);
                SecurityManager.SaveACL(cn, SecurityResType.Process, path, null, acl);
            }
        }

        protected virtual JObject Serialize(BPMProcess process)
        {
            JObject rv = new JObject();

            rv["ProcessName"] = process.Name;
            rv["Active"] = process.Active;
            rv["ProcessVersion"] = process.Version.ToString(2);
            rv["Description"] = process.Property.Description;

            return rv;
        }
    }
}