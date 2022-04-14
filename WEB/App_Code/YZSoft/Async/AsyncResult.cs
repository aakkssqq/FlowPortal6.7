using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;

namespace YZSoft.Web.Async
{
    public class AsyncResult : IAsyncResult
    {
        private AsyncCallback _callback;

        public AsyncResult(AsyncCallback cb, HttpContext context)
        {
            Context = context;
            _callback = cb;
        }

        public void SetComplete()
        {
            IsCompleted = true;
            if (_callback != null)
            {
                _callback(this);
            }
        }

        public HttpContext Context
        {
            get;
            private set;
        }

        public object AsyncState
        {
            get { return null; }
        }

        //由于ASP.NET不会等待WEB异步方法，所以不使用此对象
        public WaitHandle AsyncWaitHandle
        {
            get { throw new NotImplementedException(); }
        }

        public bool CompletedSynchronously
        {
            get { return false; }
        }

        public bool IsCompleted
        {
            get;
            private set;
        }

        public void SendMessages(object messages)
        {
            HttpResponse response = this.Context.Response;
            response.ContentType = "text/json";

            if (messages is PushMessageCollection)
            {
                response.Write("[");
                int i = 0;
                foreach (PushMessage message in messages as PushMessageCollection)
                {
                    if (i++ != 0)
                        response.Write(",");

                    response.Write("{");
                    response.Write("\r\n");
                    response.Write("\"clientid\":");
                    response.Write("\"" + message.ClientID + "\",");
                    response.Write("\r\n");
                    response.Write("\"channel\":");
                    response.Write("\"" + message.Channel + "\",");
                    response.Write("\r\n");
                    response.Write("\"message\":");
                    response.Write(String.IsNullOrEmpty(message.Message) ? "{}" : message.Message);
                    response.Write("}");
                }
                response.Write("]");
                return;
            }
            else
            {
                JToken jToken;

                if (messages is JToken)
                {
                    jToken = messages as JToken;
                }
                else
                {
                    if (messages is IEnumerable)
                        jToken = JArray.FromObject(messages);
                    else
                        jToken = JObject.FromObject(messages);
                }

                if (jToken is JObject)
                {
                    JArray jArray = new JArray();
                    jArray.Add(jToken);
                    jToken = jArray;
                }

                response.Write(jToken.ToString(Formatting.Indented));
            }
        }
    }
}