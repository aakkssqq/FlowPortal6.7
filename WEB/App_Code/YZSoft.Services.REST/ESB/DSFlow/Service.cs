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

namespace YZSoft.Services.REST.ESB.DSFlow
{
    public class ServiceHandler : YZServiceHandler
    {
        public virtual ESBDSFlowCollection GetAllFlows(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);
            BPMPermision perm = request.GetEnum<BPMPermision>("perm", BPMPermision.Read);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return cn.GetAllESBDSFlows(path, perm);
            }
        }

        public JObject GetFlowInputSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string flowName = request.GetString("flowName");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                ESBDSFlow flow = ESBDSFlow.OpenByName(cn, flowName);
                return flow.InputSchame;
            }
        }

        public JObject GetFlowOutputSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string flowName = request.GetString("flowName");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                ESBDSFlow flow = ESBDSFlow.OpenByName(cn, flowName);
                return flow.OutputSchame;
            }
        }
    }
}