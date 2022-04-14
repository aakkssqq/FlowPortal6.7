using System;
using System.Web;
using System.Threading;
using System.Collections;
using System.Collections.Generic;
using YZSoft.Web.Async;
using YZSoft.Web.Push;

namespace YZSoft.Services.REST.core
{
    public class PushHandler : IHttpAsyncHandler
    {
        static object syncobj = new object();

        public void ProcessRequest(HttpContext context)
        {
            throw new NotImplementedException();
        }

        public bool IsReusable
        {
            get
            {
                return true;
            }
        }

        public IAsyncResult BeginProcessRequest(HttpContext context, AsyncCallback cb, object extraData)
        {
            YZRequest request = new YZRequest(context);
            string clientid = request.GetString("clientid", null);


            AsyncResult result = new AsyncResult(cb, context);

            if (String.IsNullOrEmpty(clientid))
            {
                result.SendMessages(new {
                    result = "InvalidClientId"
                });
                result.SetComplete();
                return result;
            }

            Client client = ClientManager.Instance.TryGetByID(clientid);
            if (client == null)
            {
                result.SendMessages(new
                {
                    result = "InvalidClientId"
                });
                result.SetComplete();
                return result;
            }

            client.ProcessRequest(result);

            return result;
        }

        //异步结束时，由ASP.NET调用此方法
        public void EndProcessRequest(IAsyncResult result)
        {
        }
    }
}