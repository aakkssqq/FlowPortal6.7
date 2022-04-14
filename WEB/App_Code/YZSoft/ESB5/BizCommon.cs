using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;
using YZSoft.ESB.Model;


namespace YZSoft.ESB5
{
    /// <summary>
    ///BizCommon 的摘要说明
    /// </summary>
    public class BizCommon
    {
        /// <summary>
        /// 序列化一个字段
        /// </summary>
        /// <param name="column"></param>
        /// <returns></returns>
        public static JObject GetColumnJson(ColumnInfo column)
        {
            JObject obj = new JObject();
            obj["expanded"] = true;
            obj["columnIndex"] = column.columnIndex;
            obj["columnName"] = column.columnName;
            obj["columnType"] = column.columnType;
            obj["rename"] = column.rename;
            obj["defaultValue"] = (string)column.defaultValue ?? "";
            obj["documentation"] = column.documentation;
            obj["isShow"] = column.isShow == 1 ? true : false;
            if (column.seedList == null)
            {
                //obj["ischeck"] = true;
                obj["leaf"] = true;
                obj["seedList"] = null;
            }
            else
            {
                //obj["ischeck"] = false;
                JArray jc = new JArray();
                obj["seedList"] = jc;
                foreach (var seed in column.seedList)
                {
                    jc.Add(GetColumnJson(seed));
                }
            }
            return obj;
            
        }

        /// <summary>
        /// 序列化一个源描述对象
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        public static JObject GetQueryDepictInfoJson(QueryDepictInfo info)
        {
            JObject obj = new JObject();
            obj["query"] = info.query;
            JArray parameter = new JArray();
            JArray schema = new JArray();
            if (info.parameter!=null&&info.parameter.Count>0)
            {
                foreach (var item in info.parameter)
                {
                    parameter.Add(GetColumnJson(item));
                }
            }
            if (info.schema!=null&&info.schema.Count>0)
            {
                foreach (var item in info.schema)
                {
                    schema.Add(GetColumnJson(item));
                }
            }
            
            obj["parameter"] = parameter;
            obj["schema"] = schema;
            return obj;
        }
    }
}