using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Threading;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;

/// <summary>
/// MemoryChartStore 的摘要说明

/// </summary>
public class MemoryChartStore : ChartStoreBase
{
    private int _timeoutInMinutes = 10;

    private Dictionary<string, ChartStoreItem> _storeItems = new Dictionary<string, ChartStoreItem>();

    private ReaderWriterLock RWLocker = new ReaderWriterLock();
    private int AcquireReadTimeOut = 30 * 1000;
    private int AcquireWriteTimeOut = 30 * 1000;
    private object ModifyLockObj = new object();

    public MemoryChartStore(int timeoutInMinutes)
    {
        this._timeoutInMinutes = timeoutInMinutes;
    }

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

    public override void Save(string id, byte[] data,string fileName,string blackImageFile)
    {
        this.AcquireWriterLock();
        try
        {
            StringCollection keys = new StringCollection();
            foreach(string key in this._storeItems.Keys)
            {
                ChartStoreItem item1 = this._storeItems[key];
                if (item1.IsExpired(this._timeoutInMinutes))
                    keys.Add(key);
            }

            foreach(string key in keys)
                this._storeItems.Remove(key);


            this._storeItems.Add(id, new ChartStoreItem(id, data, fileName, blackImageFile));
        }
        finally
        {
            this.ReleaseWriterLock();
        }
    }

    public override byte[] Load(string id, out string fileName, out string blackImageFile)
    {
        fileName = null;
        blackImageFile = null;

        this.AcquireReaderLock();
        try
        {
            ChartStoreItem item = null;
            if (this._storeItems.TryGetValue(id, out item))
            {
                fileName = item.FileName;
                blackImageFile = item.BlackImageFile;
                return item.Data;
            }
            else
            {
                return null;
            }
        }
        finally
        {
            this.ReleaseLock();
        }
    }

    public override void Delete(string id)
    {
        this.AcquireWriterLock();
        try
        {
            this._storeItems.Remove(id);
        }
        finally
        {
            this.ReleaseWriterLock();
        }
    }

    #endregion

    private class ChartStoreItem
    {
        private string _id;
        private DateTime _createAt;
        private byte[] _data;
        private string _fileName;
        private string _blackImageFile;

        public ChartStoreItem(string id, byte[] data,string fileName,string blackImageFile)
        {
            this._id = id;
            this._createAt = DateTime.Now;
            this._data = data;
            this._fileName = fileName;
            this._blackImageFile = blackImageFile;
        }

        public bool IsExpired(int timeoutInMinutes)
        {
            TimeSpan timeSpan = DateTime.Now - this._createAt;
            if (timeSpan.TotalMinutes > timeoutInMinutes)
                return true;
            else
                return false;
        }

        public string FileName
        {
            get
            {
                return this._fileName;
            }
        }

        public string BlackImageFile
        {
            get
            {
                return this._blackImageFile;
            }
        }

        public byte[] Data
        {
            get
            {
                return this._data;
            }
        }
    }
}
