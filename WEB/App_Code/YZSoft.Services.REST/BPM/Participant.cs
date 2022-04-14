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

namespace YZSoft.Services.REST.BPM
{
    public class ParticipantHandler : YZServiceHandler
    {
        public virtual ParticipantCollection CheckParticipant(HttpContext context)
        {
            JsonSerializer serializer = new JsonSerializer();
            StreamReader reader = new StreamReader(context.Request.InputStream);
            ParticipantCollection rv = new ParticipantCollection();

            using (JsonTextReader streamReader = new JsonTextReader(reader))
            {
                JArray @params = serializer.Deserialize(streamReader) as JArray;

                foreach (JObject jParti in @params)
                {
                    Participant participant = jParti.ToObject<Participant>(serializer);
                    if (participant.IsValid)
                    {
                        if (participant.ParticipantType != ParticipantType.Custom)
                            participant.Express = participant.GenExpress();
                    }

                    using (BPMConnection cn = new BPMConnection())
                    {
                        cn.WebOpen();
                        participant.RuntimeDisplayString = participant.GetDisplayString(cn);
                    }

                    rv.Add(participant);
                }
            }

            return rv;
        }
    }
}