using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System.IO;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.Zone;

namespace YZSoft.Services.REST.Connections
{
    public class AdminHandler : LibraryHandler<ConnectionInfo, ConnectionInfoCollection>
    {
        protected override StoreZoneType ZoneType
        {
            get
            {
                return StoreZoneType.Connections;
            }
        }

        protected override string RootRSID
        {
            get
            {
                return WellKnownRSID.ConnectionsRoot;
            }
        }

        protected override SecurityResType ObjectSecurityResType {
            get
            {
                return SecurityResType.RSID;
            }
        }

        public virtual object TestConnection(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string folder = request.GetString("folder", "");
            JObject post = request.GetPostData<JObject>();
            ConnectionInfo cnInfo = post.ToObject<ConnectionInfo>();

            string message;
            bool result;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                result = cnInfo.TestConnection(cn, out message);
            }

            return new
            {
                success = true,
                result = result,
                message = result ? "" : message
            };
        }
    }
}