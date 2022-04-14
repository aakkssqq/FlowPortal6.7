using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Drawing;
using System.IO;
using System.Data.Common;
using System.Runtime.Serialization;
using BPM;
using YZSoft.ESB.Model;

namespace YZSoft.Web.DAL
{
    partial interface IYZDbProvider
    {
        IDataReader GetESBSourceList(IDbConnection cn);
        IDataReader GetESBSourceList(IDbConnection cn, SourceTypeEnum sourceType);
        IDataReader GetESBSourceInfo(IDbConnection cn, int sourceId);
        IDataReader GetESBSourceInfo(IDbConnection cn, SourceTypeEnum sourceType, string sourceName);
        void ESBAddSource(IDbConnection cn, YZSoft.ESB.Model.SourceInfo entity);
        void ESBEditSource(IDbConnection cn, YZSoft.ESB.Model.SourceInfo entity);
        void ESBDeleteSource(IDbConnection cn, int sourceId);
        bool ESBIsSourceRepeat(IDbConnection cn, string sourceName, SourceTypeEnum sourceType);
        bool ESBIsSourceNameRepeat(IDbConnection cn, string sourceName, SourceTypeEnum sourceType, int sourceId);

        IDataReader GetESBConnectList(IDbConnection cn);
        IDataReader GetESBConnectList(IDbConnection cn, SourceTypeEnum connectType);
        IDataReader GetESBConnectInfo(IDbConnection cn, int connectId);
        IDataReader GetESBConnectInfo(IDbConnection cn, SourceTypeEnum connectType, string connectName);
        void ESBAddConnect(IDbConnection cn, YZSoft.ESB.Model.ConnectInfo entity);
        void ESBEditConnect(IDbConnection cn, YZSoft.ESB.Model.ConnectInfo entity);
        void ESBDeleteConnect(IDbConnection cn, int connectId);
        bool ESBIsConnectRepeat(IDbConnection cn, string connectName, SourceTypeEnum connectType);
    }
}
