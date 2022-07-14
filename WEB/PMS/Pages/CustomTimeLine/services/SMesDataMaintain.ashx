<%@ WebHandler Language="C#" Class="ErpDataMaintainHandler" %>

using System;
using System.IO;
using System.Web;
using System.Data;
using System.Configuration;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Web.Script.Serialization;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class ErpDataMaintainHandler : IHttpHandler
{
    private string cnStr = ConfigurationManager.ConnectionStrings["sMes_TW"].ConnectionString;
    public virtual void ProcessRequest(HttpContext context)
    {
        JObject rv = new JObject();
        try
        {
            //string deptId = HttpContext.Current.Request.QueryString.ToString().Replace("itemNo", "").Replace("=", "").Trim();
            Dictionary<object, object> dict = new Dictionary<object, object>();
            DataTable dt = new DataTable();
            SqlDataAdapter da;
            string cmd = string.Empty;

            //Add by Xine 處理網址參數 at 20220713
            string urlStr = HttpContext.Current.Request.QueryString.ToString();
            foreach (string str in urlStr.Split('&'))
            {
                if (!dict.ContainsKey(str.Split('=')[0]))
                {
                    dict.Add(str.Split('=')[0], str.Split('=')[1]);
                }
            }
            //Memo by Xine at 20220713 取得Post 參數
            var sr = new StreamReader(HttpContext.Current.Request.InputStream);
            var stream = sr.ReadToEnd();
            if (!string.IsNullOrWhiteSpace(stream))
            {
                var tempDict = JsonConvert.DeserializeObject<Dictionary<object, object>>(stream);
                foreach (var tDict in tempDict)
                {
                    if (!dict.ContainsKey(tDict.Key))
                    {
                        dict.Add(tDict.Key, tDict.Value);
                    }
                }
            }

            if (dict.ContainsKey("method"))
            {
                switch (dict["method"].ToString().ToLower())
                {
                    case "getequits":
                        getData(dict, rv);
                        rv["success"] = true;
                        break;
                    case "getdata":
                        getData(dict, rv);
                        rv["success"] = true;
                        break;
                    case "edit":
                        upDateData(dict);
                        getData(dict, rv);
                        rv["success"] = true;
                        break;
                    default:
                        rv["errorMessage"] = "沒有對應的方法!!!";
                        rv["success"] = false;
                        break;
                }
            }
            context.Response.Write(rv.ToString(Formatting.Indented));
        }
        catch (Exception e)
        {
            rv["success"] = false;
            rv["errorMessage"] = "執行錯誤 : " + e.Message;
            context.Response.Write(rv.ToString(Formatting.Indented));
        }
    }
    private void upDateData(Dictionary<object, object> dict)
    {
        DataTable dt = new DataTable();
        string cmd = string.Empty;

        var targetObject = JsonConvert.DeserializeObject<Dictionary<object, object>>(dict["item"].ToString());
        cmd = string.Format(@"Update INVMB Set UDF04 = '{0}' , UDF05 = '{1}' Where MB001 = '{2}' ", targetObject["UDF04"].ToString().Trim(), targetObject["UDF05"].ToString().Trim(), targetObject["MB001"].ToString().Trim());
        using (SqlConnection cn = new SqlConnection(cnStr))
        {
            try
            {
                cn.Open();
                //Cms.Services.LoggerService.WrriteInfo("[upDateData] " + cmd);
                SqlCommand sc = new SqlCommand(cmd, cn);
                var res = sc.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                cn.Close();
                throw new Exception(e.Message);
            }
            finally
            {
                cn.Close();
            }
        }
    }

    private void getData(Dictionary<object, object> dict, JObject rv)
    {
        DataTable dt = new DataTable();
        SqlDataAdapter da;
        string startTime = "2022/07/01", cmd = string.Empty;

        JArray datas = new JArray();
        rv["eqs"] = datas;

        //Memo : 取得射出設備
        cmd = @" SELECT *
                 FROM [SMES_Production].[dbo].[TBLEQPEQUIPMENTBASIS]
                 where ISSUESTATE = 2 and LEN(EQUIPMENTNO)>4 and EQUIPMENTTYPE like N'%射出%' and LOADPORT > 0 ";

        da = new SqlDataAdapter(string.Format(cmd), cnStr);
        da.Fill(dt);
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow row in dt.Rows)
            {
                JObject item = new JObject();
                datas.Add(item);
                item["id"] = row["EquipmentName"].ToString().Split('-')[0];
                item["content"] = string.Format(@"[{0}]-{1}", row["EQUIPMENTNO"].ToString(), row["EquipmentName"].ToString());
                item["treeLevel"] = 3;
                item["showNested"] = false;
            }
        }
        //Memo : 取得進站時間點
        dt = new DataTable();
        datas = new JArray();
        rv["points"] = datas;
        cmd = string.Format(@"  select 
                                    'In'+ CONVERT(nvarchar,EventTime,120)  as id,
                                	'進站' as DataType, 
                                	LotNo,
                                	LogGroupSerial,
                                	OPNo,EventTime,
                                	UserNo,
                                	AreaNo,
                                	InputQty,
                                	0 as GOODQTY,
                                	0 as SCRAPQTY,
                                	TBLWIPCONT_PARTIALin.EQUIPMENTNO,
                                	EquipmentName,
                                	C_CombineLotSerial
                                 from TBLWIPCONT_PARTIALin 
                                	left join TBLEQPEQUIPMENTBASIS on TBLWIPCONT_PARTIALin.EQUIPMENTNO =TBLEQPEQUIPMENTBASIS.EQUIPMENTNO 
                                 where  EventTime >  '{0}'  and LEN(TBLWIPCONT_PARTIALin.EQUIPMENTNO) > 4   
                     ",
                 startTime);

        da = new SqlDataAdapter(string.Format(cmd), cnStr);
        da.Fill(dt);
        if (dt.Rows.Count > 0)
        {
            foreach (DataRow row in dt.Rows)
            {
                JObject item = new JObject();
                datas.Add(item);
                item["id"] = row["id"].ToString();
                item["group"] = row["EquipmentName"].ToString().IndexOf('-') > -1 ? row["EquipmentName"].ToString().Split('-')[0] : row["EquipmentName"].ToString().Substring(0, 3);//Todo : 工作進度
                item["content"] = string.Format(@"[{0}]-{1}", "<a href=\"http://192.168.0.23/CMS/admin/LoginForm.aspx\" target=\"_blank\">"+row["DataType"].ToString()+"</a>", row["LotNo"].ToString());
                item["start"] = row["EventTime"].ToString();
                item["end"] = "";
                item["className"] = "red";
                item["type"] = "point";
            }
        }

        //Memo : 取得上工資訊
        DataTable dt2 = new DataTable();
        cmd = string.Format(@"  select * from [TBLWIPOPERATORLOG] left join TBLEQPEQUIPMENTBASIS on  LOGINPLACENO=TBLEQPEQUIPMENTBASIS.EQUIPMENTNO where  len(LOGINPLACENO)  > 4 and  LOGINDATE >'{0}' ", startTime);

        da = new SqlDataAdapter(string.Format(cmd), cnStr);
        da.Fill(dt2);
        if (dt2.Rows.Count > 0)
        {
            foreach (DataRow row in dt2.Rows)
            {
                JObject item = new JObject();
                datas.Add(item);
                item["id"] = row["SID"].ToString();
                item["group"] = row["EquipmentName"].ToString().IndexOf('-') > -1 ? row["EquipmentName"].ToString().Split('-')[0] : row["EquipmentName"].ToString().Substring(0, 3);//Todo : 工作進度
                item["content"] = string.Format(@"[上下工] {1} {0}", row["SHIFTNO"].ToString(), row["USERNO"].ToString(), Convert.ToDateTime(row["LOGINDATE"]).ToString("yyyy/MM/dd HH:mm:ss"), Convert.ToDateTime(row["LOGOUTDATE"]).ToString("yyyy/MM/dd HH:mm:ss"));
                item["start"] = Convert.ToDateTime(row["LOGINDATE"]).ToString("yyyy/MM/dd HH:mm:ss");
                item["end"] = Convert.ToDateTime(row["LOGOUTDATE"]).ToString("yyyy/MM/dd HH:mm:ss");
                item["className"] = "steelblue";
                item["type"] = "";
            }
        }

        DataTable dt3 = new DataTable();
        cmd = string.Format(@" select * from [TBLWIPOPERATORSTATE] left join TBLEQPEQUIPMENTBASIS on  LOGINPLACENO=TBLEQPEQUIPMENTBASIS.EQUIPMENTNO where len(LOGINPLACENO)  > 4 and  LOGINDATE >'{0}' ", startTime);

        da = new SqlDataAdapter(string.Format(cmd), cnStr);
        da.Fill(dt3);
        if (dt3.Rows.Count > 0)
        {
            foreach (DataRow row in dt3.Rows)
            {
                JObject item = new JObject();
                datas.Add(item);
                item["id"] = row["SID"].ToString();
                item["group"] = row["EquipmentName"].ToString().IndexOf('-') > -1 ? row["EquipmentName"].ToString().Split('-')[0] : row["EquipmentName"].ToString().Substring(0, 3);//Todo : 工作進度
                item["content"] = string.Format(@"[上工] {1} {0}", row["SHIFTNO"].ToString(), row["USERNO"].ToString());
                item["start"] = Convert.ToDateTime(row["LOGINDATE"]).ToString("yyyy/MM/dd HH:mm:ss");
                item["end"] = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss");
                item["className"] = "deepskyblue";
                item["type"] = "";
            }
        }

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    #region 流程參數
    public virtual string GetProcessParameter(HttpContext context)
    {
        string rv = "123";
        return rv;
    }


    #endregion


}

