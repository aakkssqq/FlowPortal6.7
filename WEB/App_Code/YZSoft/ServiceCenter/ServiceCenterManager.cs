using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using YZSoft.Web.DAL;
using BPM;
using BPM.Client;

namespace YZSoft.Web.ServiceCenter
{
    public class ServiceCenterManager
    {
        private static ServiceCenterManager _instance = null;

        static ServiceCenterManager()
        {
            ServiceCenterManager._instance = new ServiceCenterManager();
        }

        #region 公共属性

        internal static ServiceCenterManager Instance
        {
            get
            {
                return ServiceCenterManager._instance;
            }
        }

        #endregion

        #region 服务

        public static ServiceContactsCollection GetAllContacts(IYZDbProvider provider, IDbConnection cn, string product)
        {
            ServiceContactsCollection rv = new ServiceContactsCollection();
            try
            {
                using (YZReader reader = new YZReader(provider.GetAllServiceContacts(cn, product)))
                {
                    while (reader.Read())
                        rv.Add(new ServiceContacts(reader));
                }
            }
            catch (Exception e)
            {
                throw new BPMException(BPMExceptionType.DBLoadDataErr, "YZAppServiceContacts", e.Message);
            }

            return rv;
        }

        #endregion
    }
}