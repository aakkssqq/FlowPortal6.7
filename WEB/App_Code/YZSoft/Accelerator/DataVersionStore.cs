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
using Newtonsoft.Json.Linq;

/// <summary>
/// MemoryChartStore 的摘要说明

/// </summary>
public class DataVersionStore
{
    private Dictionary<string, JObject> _versions = new Dictionary<string, JObject>();

    private ReaderWriterLock RWLocker = new ReaderWriterLock();
    private int AcquireReadTimeOut = 30 * 1000;
    private int AcquireWriteTimeOut = 30 * 1000;
    private object ModifyLockObj = new object();

    public DataVersionStore()
    {
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

    public void UpdateVersion(string key, JObject version)
    {
        this.AcquireWriterLock();
        try
        {
            this._versions[key] = version;
        }
        finally
        {
            this.ReleaseWriterLock();
        }
    }

    public JObject GetVersion(string key, JObject defaultValue)
    {
        this.AcquireReaderLock();
        try
        {
            JObject version = null;
            if (this._versions.TryGetValue(key, out version))
                return version;
            else
                return defaultValue;
        }
        finally
        {
            this.ReleaseLock();
        }
    }

    public void Delete(string key)
    {
        this.AcquireWriterLock();
        try
        {
            this._versions.Remove(key);
        }
        finally
        {
            this.ReleaseWriterLock();
        }
    }

    #endregion
}
