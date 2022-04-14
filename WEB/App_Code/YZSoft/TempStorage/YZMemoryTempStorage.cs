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
public class YZMemoryTempStorage : YZTempStorageBase
{
    private int _timeoutInMinutes = 10;

    private Dictionary<string, YZTempStorageItem> _storeItems = new Dictionary<string, YZTempStorageItem>();

    private ReaderWriterLock RWLocker = new ReaderWriterLock();
    private int AcquireReadTimeOut = 30 * 1000;
    private int AcquireWriteTimeOut = 30 * 1000;
    private object ModifyLockObj = new object();

    public YZMemoryTempStorage(int timeoutInMinutes)
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

    public override string Save(object data)
    {
        string id = Guid.NewGuid().ToString();

        this.AcquireWriterLock();
        try
        {
            StringCollection keys = new StringCollection();
            foreach(string key in this._storeItems.Keys)
            {
                YZTempStorageItem item1 = this._storeItems[key];
                if (item1.IsExpired(this._timeoutInMinutes))
                    keys.Add(key);
            }

            foreach(string key in keys)
                this._storeItems.Remove(key);

            this._storeItems.Add(id, new YZTempStorageItem(id, data));
        }
        finally
        {
            this.ReleaseWriterLock();
        }

        return id;
    }

    public override object Load(string id)
    {
        this.AcquireReaderLock();
        try
        {
            YZTempStorageItem item = null;
            if (this._storeItems.TryGetValue(id, out item))
            {
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

    private class YZTempStorageItem
    {
        private string _id;
        private DateTime _createAt;
        private object _data;

        public YZTempStorageItem(string id, object data)
        {
            this._id = id;
            this._createAt = DateTime.Now;
            this._data = data;
        }

        public bool IsExpired(int timeoutInMinutes)
        {
            TimeSpan timeSpan = DateTime.Now - this._createAt;
            if (timeSpan.TotalMinutes > timeoutInMinutes)
                return true;
            else
                return false;
        }

        public object Data
        {
            get
            {
                return this._data;
            }
        }
    }
}
