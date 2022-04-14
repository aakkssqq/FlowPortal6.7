using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using YZSoft.Web.Async;
using System.Timers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;

namespace YZSoft.Web.Push
{
    public class Client
    {
        public string ID { get; private set; }
        public string UID { get; private set; }

        private readonly BPMObjectNameCollection _subscriptions = new BPMObjectNameCollection();

        public bool IsConnected { get; private set; }
        public AsyncResult CurrentAsyncResult { get; set; }
        public DateTime LastConnectTime { get; private set; }

        private readonly Queue<PushMessage> messageQueue = new Queue<PushMessage>();

        private readonly Timer _timer = new Timer { AutoReset = true, Enabled = false, Interval = 1000 };
        private const int LongPollDurationInMilliseconds = 10000;
        private const int ClientTimeoutInMilliseconds = 20000;

        object _syncRootSubscriptions = new object();
        object _syncRootMessageQueue = new object();

        public Client(string id,string uid)
        {
            this.ID = id;
            this.UID = uid;
            this._timer.Elapsed += HandleTimerCallback;
        }

        public void ProcessRequest(AsyncResult result)
        {
            this.CurrentAsyncResult = result;
            this.LastConnectTime = DateTime.Now;
            this._timer.Enabled = true;

            PushMessageCollection messages = this.GetMessages();
            if (messages.Count != 0)
                this.FlushQueue();
        }

        private void HandleTimerCallback(object state, ElapsedEventArgs e)
        {
            DateTime now = DateTime.Now;
            if ((now - this.LastConnectTime).TotalMilliseconds > LongPollDurationInMilliseconds)
            {
                this.FlushQueue();
            }
            if ((now - this.LastConnectTime).TotalMilliseconds > ClientTimeoutInMilliseconds)
            {
                this.Disconnect();
            }
        }

        #region 队列服务

        private PushMessageCollection GetMessages()
        {
            lock (this._syncRootMessageQueue)
            {
                PushMessageCollection messages = new PushMessageCollection();
                while (this.messageQueue.Count > 0)
                {
                    messages.Add(this.messageQueue.Dequeue());
                }
                return messages;
            }
        }

        #endregion

        public void PushMessage(PushMessage message) {
            lock (this._syncRootMessageQueue)
            {
                this.messageQueue.Enqueue(message);
            }
        }

        public void FlushQueue()
        {
            if (this.CurrentAsyncResult != null)
            {
                PushMessageCollection messages = this.GetMessages();

                this.CurrentAsyncResult.SendMessages(messages);
                this.CurrentAsyncResult.SetComplete();
                this.CurrentAsyncResult = null;
            }
        }

        public void Disconnect()
        {
            this._timer.Enabled = false;
            this.IsConnected = false;

            if (this.CurrentAsyncResult != null)
            {
                this.CurrentAsyncResult.SetComplete();
                this.CurrentAsyncResult = null;
            }

            ClientManager.Instance.RemoveClient(this);
        }

        public void SubscribeTo(BPMObjectNameCollection channels)
        {
            lock (this._syncRootSubscriptions)
            {
                this._subscriptions.AddRange(channels);
            }
        }

        public void UnSubscribeTo(BPMObjectNameCollection channels)
        {
            lock (this._syncRootSubscriptions)
            {
                this._subscriptions.Remove(channels);
            }
        }

        public bool IsSubscribedTo(string channel)
        {
            lock (this._syncRootSubscriptions)
            {
                return this._subscriptions.Contains(channel);
            }
        }
    }
}