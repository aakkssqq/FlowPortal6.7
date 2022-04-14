using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading;
using System.Data;
using BPM;
using YZSoft.Group;
using YZSoft.Web.DAL;

namespace YZSoft.Web.Push
{
    public class ClientManager
    {
        private ClientCollection Clients;

        private ReaderWriterLock RWLocker = new ReaderWriterLock();
        private int AcquireReadTimeOut = 30 * 1000;
        private int AcquireWriteTimeOut = 30 * 1000;
        private object ModifyLockObj = new object();

        private static ClientManager _instance = null;

        static ClientManager()
        {
            ClientManager._instance = new ClientManager();
        }

        public ClientManager()
        {
            this.Clients = new ClientCollection();
        }

        #region 公共属性

        internal static ClientManager Instance
        {
            get
            {
                return ClientManager._instance;
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

        public Client TryGetByID(string clientID)
        {
            this.AcquireReaderLock();
            try
            {
                return this.Clients.Contains(clientID) ? this.Clients[clientID] : null;
            }
            finally
            {
                this.ReleaseLock();
            }
        }

        public void AddClient(Client client)
        {
            this.AcquireWriterLock();
            try
            {
                this.Clients.Add(client);
            }
            finally
            {
                this.ReleaseLock();
            }
        }

        public void RemoveClient(Client client)
        {
            this.AcquireWriterLock();
            try
            {
                this.Clients.Remove(client);
            }
            finally
            {
                this.ReleaseLock();
            }
        }

        public IEnumerable<Client> GetClientsFromUIDs(BPMObjectNameCollection uids,string channel,bool broadcast)
        {
            this.AcquireReaderLock();
            try
            {
                return Clients.Where(client => (broadcast || uids.Contains(client.UID)) && client.IsSubscribedTo(channel)).ToList();
            }
            finally
            {
                this.ReleaseLock();
            }
        }

        public IEnumerable<Client> GetClientsSubscribedTo(string channel)
        {
            this.AcquireReaderLock();
            try
            {
                return Clients.Where(client => client.IsSubscribedTo(channel)).ToList();
            }
            finally
            {
                this.ReleaseLock();
            }
        }

        #endregion
    }
}