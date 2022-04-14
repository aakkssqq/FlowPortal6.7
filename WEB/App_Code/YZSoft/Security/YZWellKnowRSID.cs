using System;
using System.Collections.Generic;
using System.Web;

/// <summary>
///YZWellKnowRSID 的摘要说明


/// </summary>
public class YZWellKnowRSID
{
    // 生产管理->设备管理
    public const string PM = "9ebefe7c-0e95-49ae-b378-76c6f7a97f4a";        //生产管理
    public const string PM_WaterDevice = "b3c3e3ad-bd3c-4790-b155-714ee9bdaa50";        //生产管理->设备管理
    public const string PM_WaterDevice_Device = "5eec72ed-2e08-472e-8906-e715fa38a89f";     //生产管理->设备管理->设备管理
    public const string PM_WaterDevice_Fittings = "dc61da98-b321-4bd7-8020-88561cde13ff";    //备件管理

    public const string PM_Operating = "cb37500f-9cd0-4693-a73c-03656b2e30bc";      //水务运营管理

    public const string PM_Contract = "f276101e-c630-4565-a65e-c14790696897";       //合同管理
    public const string PM_Contract_IContract = "1a3dd150-e2af-4708-be82-9ce15f124b00";     //收入合同管理
    public const string PM_Contract_OContract = "75aac977-2381-4de3-ad87-ca3db1e17cdd";     //外委合同管理
    public const string PM_Contract_PContract = "71c416ea-be83-4cc2-b73f-7d3373fc1df1";     //框架协议管理

    public const string PM_Budget = "62a82e7f-c75d-4b2e-aad9-22df43b78024";     //预算管理
    public const string PM_Budget_IncomeBudget = "b49a7227-37da-49ef-a840-61daf4302fe3";     //收款预算
    public const string PM_Budget_PaymentBudget = "051deba6-d538-4c08-aedb-5a85ee95f78c";     //支出预算

    ///行政管理 
    public const string AM_Assets = "46801fa0-eb59-4e14-95ca-a8e9e9c4691f";        //资产管理
    public const string AM_Assets_FixedAssets = "907c571b-438e-4128-b77c-18dc9fb45246";         //资产管理->固定资产
    public const string AM_Assets_OfficeSupplies = "b7612baa-c037-4977-9a84-6db2e7a87f57";     //资产管理->办公用品
    public const string AM_Assets_GiftsReceived = "bf275c26-59d8-4175-8786-90a88a557d28";      //资产管理->收到的赠品


    public const string AM_Stamp = "4b0287d2-3d09-4e4a-827c-54f879909a81";      //印章管理
    public const string AM_Regulations = "3179da33-86ba-4100-a52e-22d661aeb6ac";        //规章制度

    public const string AM_HumanResource = "84c07779-8ac5-4ebe-932f-b06b7788c050";
    public const string AM_HumanResource_Position = "8a48db01-9447-4f0d-9042-287f66132b69";
    public const string AM_HumanResource_Honour = "a42d2e51-187a-4a22-a1ef-0a6148089522";
    public const string AM_HumanResource_Employee = "22cd19cc-caab-4574-b753-2743e00cf888";

    ///报表管理
    public const string RPT = "57fac4fd-9abd-40b1-a3d9-8effa4d0fec2";
    public const string RPT_MD = "311e8df2-b9c3-4dfe-93d4-891fa73aee1e"; //水务监测数据
    public const string RPT_PM = "9f667844-1ed3-405d-9e32-dd84f14ab274"; //生产报表
    public const string RPT_PM_WaterDevice = "0478c44d-b05f-420b-9aa7-3bc6449be902"; //备品备件消耗


    public const string RPT_PM_WaterDeviceFittings = "c50cd5a2-e700-4c9e-a83c-b847c1d984f9"; //备品备件消耗


    public const string RPT_OM = "bed858fd-e985-468a-8368-a312ea7757a3"; //经营报表
    public const string RPT_OM_Operating = "0dc5669d-ba42-4b52-a5da-8a1093dc3ba7"; //经营汇总


    public const string RPT_OM_IContract = "223f175f-fea9-4bbe-a9a1-b675f6b1b758"; //经营汇总


    public const string RPT_OM_OContract = "36bc0d13-77f6-420e-abb7-0aeadba6622b"; //经营汇总


    public const string RPT_AM = "45b65630-5a6b-48c1-9754-3ede7af620bf"; //行政报表
    public const string RPT_AM_HoumanResource = "30f3e67d-b02c-4e7c-87b6-ae405f5f67f1"; //人力资源报表
    public const string RPT_AM_FixedAssets = "aacf0d05-7db3-4303-a450-fb2dd4ff7f1a";
    public const string RPT_AM_BusinessTrip = "3adf7ba9-acb3-4e46-801f-734c489f1fd7"; //人力资源报表
    public const string RPT_DW = "1b52f92c-a535-431e-a00b-3cde2706bbf8"; //水务报表

    //经营管理
    public const string OM = "1ada2dd6-b8de-4f6b-80fd-0df4af145da6";            //行政管理
    public const string OM_CRM = "30fdda06-11ef-49e4-a7b8-2fd5fcddd7f6";        //行政管理->客户关系管理
    public const string OM_CRM_EM = "5deba035-eb5a-4e77-bbf5-f26fb65f46a2";     //行政管理->客户关系管理->企业信息
    public const string OM_CRM_CM = "4f0c3b9e-7178-4897-83e1-de6b6ba111ba";     //行政管理->客户关系管理->企业联系人信息


    public const string OM_PM = "3068096d-db88-4723-b77d-dba43e3050de";         //行政管理->项目管理

    //生产管理

    //系统管理
    public const string SYS = "efec54e1-bb63-43f8-8635-3b07d1199309"; //系统资料

    //信息管理
    public const string CMS = "5f90b50f-2c20-4f3d-86d7-73c5dacb0770";       //信息管理
    public const string CMS_Article = "ef013b3d-926b-48f6-8fa0-f521ea3dbb0b";       //信息管理->文章管理
    public const string CMS_Article_Self = "d8883835-4d49-474d-94bb-57335e0cccc0";       //信息管理->文章管理->我的文章
    public const string CMS_Article_All = "13ad16ab-d3c4-4816-843d-99814181b78a";       //信息管理->文章管理->全部文章
    public const string CMS_Article_Deleted = "cabc003b-c656-41c2-a7cd-c229fd08c7c7";       //信息管理->文章管理->已删除文章


    public const string CMS_System = "5df4eec8-6008-49a4-ad64-fa63920e6294";        //信息管理->系统参数

}
