using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;

namespace YZSoft.Services.REST.BPM
{
    public class XFormAdminHandler : YZServiceHandler
    {
        private static JObject _defaultFormFolderVersion = new JObject();

        static XFormAdminHandler()
        {
            _defaultFormFolderVersion["lastUpdateTime"] = DateTime.MinValue;
        }

        public virtual JObject GetDataVersionOfFormsInFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder","");

            return DataVersionManager.FormFolderVersion.GetVersion(folder, null);
        }
    }
}