using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Web.Configuration;
using BPM;
using BPM.Client;

namespace YZSoft.Web.DAL
{
    public class YZDbProviderManager
    {
        static string _dbproviderName = null;

        public static string DBProviderName
        {
            get
            {
                if (_dbproviderName == null)
                {
                    using (BPMConnection cn = new BPMConnection())
                    {
                        cn.WebOpenAnonymous();
                        _dbproviderName = cn.GetDBProviderName();
                    }
                }

                return _dbproviderName;
            }
        }

        public static IYZDbProvider DefaultProvider
        {
            get
            {
                if (String.Compare(DBProviderName, "Oracle", true) == 0)
                    return new OracleProvider();
                else
                    return new SqlServerProvider();
            }
        }
    }
}
