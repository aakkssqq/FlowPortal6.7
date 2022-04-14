using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using BPM.Client.Notify;
using YZSoft.Web.DAL;
using YZSoft.Web.Social;
using YZSoft.Web.Push;

namespace YZSoft.Services.REST.core
{
    public class PushAssistHandler : YZServiceHandler
    {
        public virtual object RegisterClient(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = YZAuthHelper.LoginUserAccount;

            string clientid = ClientIDGenerator.GenerateClientID();
            Client client = new Client(clientid, uid);

            ClientManager.Instance.AddClient(client);

            return new
            {
                clientid = client.ID
            };
        }

        public virtual void UnRegisterClient(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string clientid = request.GetString("clientid");

            Client client = ClientManager.Instance.TryGetByID(clientid);
            if(client != null)
                ClientManager.Instance.RemoveClient(client);
        }

        public virtual void Subscribe(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string clientid = request.GetString("clientid");
            JArray jPost = request.GetPostData<JArray>();
            BPMObjectNameCollection channels = jPost.ToObject<BPMObjectNameCollection>();

            Client client = ClientManager.Instance.TryGetByID(clientid);

            if (client != null)
                client.SubscribeTo(channels);
        }

        public virtual void UnSubscribe(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string clientid = request.GetString("clientid");
            JArray jPost = request.GetPostData<JArray>();
            BPMObjectNameCollection channels = jPost.ToObject<BPMObjectNameCollection>();

            Client client = ClientManager.Instance.TryGetByID(clientid);

            if (client != null)
                client.UnSubscribeTo(channels);
        }
    }
}