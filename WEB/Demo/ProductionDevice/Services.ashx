<%@ WebHandler Language="C#" Class="YZProductionDeviceServices" %>

using System;
using System.Web;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Collections;
using System.Collections.Generic;
using BPM;
using BPM.Client;
using YZSoft.Web.DAL;
using Newtonsoft.Json.Linq;

public class YZProductionDeviceServices : YZServiceHandler
{
    public void Delete(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JArray jPost = request.GetPostData<JArray>();
        List<int> ids = jPost.ToObject<List<int>>();

        using (SqlConnection cn = new SqlConnection(System.Web.Configuration.WebConfigurationManager.ConnectionStrings["BPMDB"].ConnectionString))
        {
            cn.Open();

            foreach (int id in ids)
            {
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = cn;
                cmd.CommandText = "DELETE FROM iDemoDevice WHERE id=@id";
                cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                cmd.ExecuteNonQuery();
            }
        }
    }

    public JObject GetData(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        SqlServerProvider queryProvider = new SqlServerProvider();

        string searchType = request.GetString("SearchType", null);
        string keyword = request.GetString("kwd", null);

        //获得查询条件
        string filter = null;

        if (searchType == "QuickSearch")
        {
            //应用关键字过滤
            if (!string.IsNullOrEmpty(keyword))
                filter = queryProvider.CombinCond(filter, String.Format("[Name] LIKE N'%{0}%' OR Type LIKE N'%{0}%' OR Standard LIKE N'%{0}%' OR SystemName LIKE N'%{0}%'", queryProvider.EncodeText(keyword)));
        }

        //应用记录权限-只显示有权查看的记录
        using (BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();
            string permFilter = YZSecurityManager.GetPermisionFilterString("iDemoDevice", "ID", "RecordRead", cn.Token);
            if (!String.IsNullOrEmpty(permFilter))
                filter = queryProvider.CombinCond(filter, permFilter);
        }

        if (!String.IsNullOrEmpty(filter))
            filter = " WHERE " + filter;

        //获得排序子句
        string order = request.GetSortString("id");

        //获得Query
        string query = @"
            WITH X AS(
                SELECT ROW_NUMBER() OVER(ORDER BY {0}) AS RowNum,* FROM v_iDemoDevice {1}
            ),
            Y AS(
                SELECT count(*) AS TotalRows FROM X
            ),
            Z AS(
                SELECT Y.TotalRows,X.* FROM Y,X
            )
            SELECT * FROM Z WHERE RowNum BETWEEN {2} AND {3}
        ";

        query = String.Format(query, order, filter, request.RowNumStart, request.RowNumEnd);

        //执行查询
        JObject rv = new JObject();
        using (SqlConnection cn = new SqlConnection())
        {
            cn.ConnectionString = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["BPMDB"].ConnectionString;
            cn.Open();

            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn;
                cmd.CommandText = query;

                using (YZReader reader = new YZReader(cmd.ExecuteReader()))
                {
                    //将数据转化为Json集合
                    JArray children = new JArray();
                    rv["children"] = children;
                    int totalRows = 0;

                    while (reader.Read())
                    {
                        JObject item = new JObject();
                        children.Add(item);

                        if (totalRows == 0)
                            totalRows = reader.ReadInt32("TotalRows");

                        item["id"] = reader.ReadInt32("id");
                        item["RowNum"] = reader.ReadInt32("RowNum");
                        item["Type"] = reader.ReadString("Type");
                        item["StationName"] = reader.ReadString("StationName");
                        item["Name"] = reader.ReadString("Name");
                        item["Number"] = reader.ReadString("Number");
                        item["Model"] = reader.ReadString("Model");
                        item["Standard"] = reader.ReadString("Standard");
                        item["Price"] = reader.IsDBNull("Price") ? "-" : reader.ReadDecimal("Price").ToString("F2");
                        item["Power"] = reader.ReadDecimal("Power");
                        item["Manufacture"] = reader.ReadString("Manufacture");
                        item["Provider"] = reader.ReadString("Provider");
                        item["DateOfManufacture"] = YZStringHelper.DateToString(reader.ReadDateTime("DateOfManufacture"));
                        item["SystemName"] = reader.ReadString("SystemName");
                        item["IntendAge"] = reader.IsDBNull("IntendAge") ? "-" : reader.ReadDecimal("IntendAge").ToString();
                        item["StartDate"] = YZStringHelper.DateToString(reader.ReadDateTime("StartDate"));
                        item["Location"] = reader.ReadString("Location");
                        item["Picture"] = reader.ReadString("Picture");
                        item["Status"] = reader.ReadString("Status");
                    }

                    rv[YZJsonProperty.total] = totalRows;
                }
            }
        }

        /********************************************************************************************************
        sts已解决权限问题，无需以下代码
        sts是动态权限管理，数据加载时，不加载权限信息，只有动态选中一行后，才动态加载权限信息，性能比以下方法高
        当使用以下代码，预生成权限，sts会识别以下代码生成的权限
        ********************************************************************************************************/     
        //应用记录权限 - 如记录是否可以编辑，删除
        //using (BPMConnection cn = new BPMConnection())
        //{
        //    cn.WebOpen();
        //    YZSecurityManager.ApplayRecordPermision(cn, rv["children"] as JArray, "d0ebfcf9-0007-44b3-b218-ef94628de67e", "iDemoDevice", "ID");
        //}

        /* 自定义业务规则
        foreach (JsonItem item in (JsonItemCollection)rv.Attributes["children"])
        {
            int RowNum = (int)item.Attributes["RowNum"];
            if (RowNum != 1)
            {
                JsonItem jsonPerm = (JsonItem)item.Attributes["perm"];
                jsonPerm.Attributes["Edit"] = false;
            }
        }*/

        return rv;
    }
 
    public JObject GetDataNoRecordPerm(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        SqlServerProvider queryProvider = new SqlServerProvider();

        string searchType = request.GetString("SearchType", null);
        string keyword = request.GetString("kwd",null);

        //获得查询条件
        string filter = null;

        if (searchType == "QuickSearch")
        {
            //应用关键字过滤
            if (!string.IsNullOrEmpty(keyword))
                filter = queryProvider.CombinCond(filter,String.Format("[Name] LIKE N'%{0}%' OR Type LIKE N'%{0}%' OR Standard LIKE N'%{0}%' OR SystemName LIKE N'%{0}%'", queryProvider.EncodeText(keyword)));
        }

        //应用记录权限-只显示有权查看的记录
        //using (BPMConnection cn = new BPMConnection())
        //{
        //    cn.WebOpen();
        //    string permFilter = YZSecurityManager.GetPermisionFilterString("iDemoDevice","ID","RecordRead",cn.Token);
        //    if (!String.IsNullOrEmpty(permFilter))
        //        filter = queryProvider.CombinCond(filter, permFilter);
        //}

        if (!String.IsNullOrEmpty(filter))
            filter = " WHERE " + filter;

        //获得排序子句
        string order = request.GetSortString("id");

        //获得Query
        string query = @"
            WITH X AS(
                SELECT ROW_NUMBER() OVER(ORDER BY {0}) AS RowNum,* FROM v_iDemoDevice {1}
            ),
            Y AS(
                SELECT count(*) AS TotalRows FROM X
            ),
            Z AS(
                SELECT Y.TotalRows,X.* FROM Y,X
            )
            SELECT * FROM Z WHERE RowNum BETWEEN {2} AND {3}
        ";

        query = String.Format(query, order, filter, request.RowNumStart, request.RowNumEnd);

        //执行查询
        JObject rv = new JObject();
        using (SqlConnection cn = new SqlConnection())
        {
            cn.ConnectionString = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["BPMDB"].ConnectionString;
            cn.Open();

            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn;
                cmd.CommandText = query;

                using (YZReader reader = new YZReader(cmd.ExecuteReader()))
                {
                    //将数据转化为Json集合
                    JArray children = new JArray();
                    rv["children"] = children;
                    int totalRows = 0;

                    while (reader.Read())
                    {
                        JObject item = new JObject();
                        children.Add(item);

                        if (totalRows == 0)
                            totalRows = reader.ReadInt32("TotalRows");

                        item["id"] = reader.ReadInt32("id");
                        item["RowNum"] = reader.ReadInt32("RowNum");
                        item["Type"] = reader.ReadString("Type");
                        item["StationName"] = reader.ReadString("StationName");
                        item["Name"] = reader.ReadString("Name");
                        item["Number"] = reader.ReadString("Number");
                        item["Model"] = reader.ReadString("Model");
                        item["Standard"] = reader.ReadString("Standard");
                        item["Price"] = reader.IsDBNull("Price") ? "-" : reader.ReadDecimal("Price").ToString("F2");
                        item["Power"] = reader.ReadDecimal("Power");
                        item["Manufacture"] = reader.ReadString("Manufacture");
                        item["Provider"] = reader.ReadString("Provider");
                        item["DateOfManufacture"] = YZStringHelper.DateToString(reader.ReadDateTime("DateOfManufacture"));
                        item["SystemName"] = reader.ReadString("SystemName");
                        item["IntendAge"] = reader.IsDBNull("IntendAge") ? "-" : reader.ReadDecimal("IntendAge").ToString();
                        item["StartDate"] = YZStringHelper.DateToString(reader.ReadDateTime("StartDate"));
                        item["Location"] = reader.ReadString("Location");
                        item["Picture"] = reader.ReadString("Picture");
                        item["Status"] = reader.ReadString("Status");
                    }

                    rv[YZJsonProperty.total] = totalRows;
                }
            }
        }

        return rv;
    }
}