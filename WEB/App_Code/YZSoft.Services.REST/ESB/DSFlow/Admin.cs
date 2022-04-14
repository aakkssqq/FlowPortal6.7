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
using BPM.Client.ESB;
using YZSoft.Web.Zone;

namespace YZSoft.Services.REST.ESB.DSFlow
{
    public class AdminHandler : LibraryHandler<ESBDSFlow, ESBDSFlowCollection>
    {
        protected override StoreZoneType ZoneType
        {
            get
            {
                return StoreZoneType.ESBDSFlow;
            }
        }

        protected override string RootRSID
        {
            get
            {
                return WellKnownRSID.ESBDSFlowRoot;
            }
        }

        protected override SecurityResType ObjectSecurityResType {
            get
            {
                return SecurityResType.RSID;
            }
        }
    }
}