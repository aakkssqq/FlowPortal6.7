using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using YZSoft.Web.Social;
using YZSoft.Web.Notify;

namespace YZSoft.Web.Push
{
    public class MessageBus
    {
        private ReaderWriterLock RWLocker = new ReaderWriterLock();
        private int AcquireReadTimeOut = 30 * 1000;
        private int AcquireWriteTimeOut = 30 * 1000;
        private object ModifyLockObj = new object();

        private static MessageBus _instance = null;
        private Thread _thread;

        static MessageBus()
        {
            MessageBus._instance = new MessageBus();
        }

        public static void Init()
        {
        }

        public MessageBus()
        {
            this._thread = new Thread(this.PullProcess);
            this._thread.IsBackground = true;
            this._thread.Priority = ThreadPriority.Normal;
            this._thread.Start();
        }

        public void PullProcess(object obj)
        {
            BPMConnection cn = null;
            string server;
            string strPort;
            int port;
            string clientid = null;

            server = System.Web.Configuration.WebConfigurationManager.AppSettings["BPMServerName"];
            strPort = System.Web.Configuration.WebConfigurationManager.AppSettings["BPMServerPort"];

            if (!Int32.TryParse(strPort, out port))
                port = BPMConnection.DefaultPort;

            while (true)
            {
                try
                {
                    if (cn == null)
                    {
                        cn = new BPMConnection();
                        cn.OpenAnonymous(server, port);
                        clientid = cn.RegisterClient();
                    }

                    PushMessageCollection messages = cn.GetClientMessages(clientid);
                    this.DispatchMessage(messages);
                    Thread.Sleep(100);
                }
                catch (Exception)
                {
                    if (cn.IsOpen)
                        cn.Close();

                    cn = null;
                    Thread.Sleep(3000);
                }
            }
        }

        #region 公共属性

        public static MessageBus Instance
        {
            get
            {
                return MessageBus._instance;
            }
        }

        #endregion

        #region 锁支持

        private void AcquireReaderLock()
        {
            this.RWLocker.AcquireReaderLock(this.AcquireReadTimeOut);
        }

        private void AcquireWriterLock()
        {
            this.RWLocker.AcquireWriterLock(this.AcquireWriteTimeOut);
        }

        private void UpgradeToWriterLock()
        {
            this.RWLocker.UpgradeToWriterLock(this.AcquireWriteTimeOut);
        }

        private void ReleaseLock()
        {
            this.RWLocker.ReleaseLock();
        }

        private void ReleaseReaderLock()
        {
            this.RWLocker.ReleaseReaderLock();
        }

        private void ReleaseWriterLock()
        {
            this.RWLocker.ReleaseWriterLock();
        }

        #endregion

        #region 对外服务

        private void DispatchMessage(PushMessageCollection messages)
        {
            List<Client> clientsNotified = new List<Client>();

            foreach (PushMessage message in messages)
            {
                IEnumerable<Client> clients = ClientManager.Instance.GetClientsFromUIDs(message.Uids, message.Channel, message.Broadcast);

                foreach (Client client in clients)
                {
                    client.PushMessage(message);

                    if (!clientsNotified.Contains(client))
                        clientsNotified.Add(client);
                }
            }

            foreach (Client client in clientsNotified)
                client.FlushQueue();
        }

        public void PushMessage(string clientid, string[] channels, YZMessage message, bool broadcast)
        {
            BPMObjectNameCollection uids = new BPMObjectNameCollection();
            if (!broadcast)
                uids  = NotifyManager.GetNotifyUsers(message.resType, message.resId);

            this.PushMessage(clientid, uids, channels, message, broadcast);
        }

        public void PushMessage(string clientid, BPMObjectNameCollection uids, string[] channels, YZMessage message, bool broadcast)
        {
            JObject jmessage = JObject.FromObject(message);

            PushMessageCollection pushMessages = new PushMessageCollection();

            foreach (string channel in channels)
            {
                PushMessage pushmessage = new BPM.PushMessage(clientid, uids, channel, jmessage);
                pushmessage.Broadcast = broadcast;
                    pushMessages.Add(pushmessage);
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                cn.Push(pushMessages);
            }
        }

        public void onPostComments(string clientid, YZMessage message)
        {
            switch (message.resType)
            {
                case YZResourceType.Group:
                case YZResourceType.SingleChat:
                case YZResourceType.Task:
                    this.PushMessage(clientid, new string[] { "social", message.Channel }, message, false);
                    break;
                default:
                    this.PushMessage(clientid, new string[] { message.Channel }, message, true);
                    break;
            }
        }

        #endregion
    }
}