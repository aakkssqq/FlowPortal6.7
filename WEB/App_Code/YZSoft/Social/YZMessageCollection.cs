using System;
using System.Collections.Generic;
using System.Web;
using System.Data;
using BPM;
using BPM.Client;

/// <summary>
///YZComunity 的摘要说明
/// </summary>
namespace YZSoft.Web.Social
{
    public class YZMessageCollection : BPMList<YZMessage>
    {
        public YZMessageCollection()
        {
        }

        public YZMessageCollection(IDataReader reader)
        {
            while (reader.Read())
            {
                YZMessage message = new YZMessage(reader);
                this.Add(message);
            }
        }
    }
}