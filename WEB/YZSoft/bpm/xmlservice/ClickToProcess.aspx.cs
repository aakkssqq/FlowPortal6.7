using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using BPM;
using BPM.Client;

public partial class XMLService_ClickToProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (String.Compare(System.Web.Configuration.WebConfigurationManager.AppSettings["ShowMaintenancePage"], "true", true) == 0)
            Response.Redirect("~/YZSoft/core/Maintenance/Default.aspx");

        Guid itemguid = new Guid(Request.QueryString["ItemGuid"]);

        BPMConnection cn = new BPMConnection();
        try
        {
            //连接
            cn.WebOpenAnonymous(this.Page);

            //提交处理请求
            PostResult postResult = BPMTask.ClickToProcess(cn, itemguid);

            //获得处理结果
            string message;

            string customMessage = postResult.CustomMessage;
            if (!String.IsNullOrEmpty(customMessage))
                customMessage = "\n[" + customMessage + "]";

            switch (postResult.PostResultType)
            {
                case PostResultType.HasSentToOtherUsers:
                    message = String.Format(Resources.YZStrings.Aspx_PostResult_HasSentToOtherUsers, postResult.SN, YZStringHelper.GetUserNameListString(postResult.Recipients), customMessage);
                    break;
                case PostResultType.InWaitingOtherUsers:
                    message = String.Format(Resources.YZStrings.Aspx_PostResult_InWaitingOtherUsers, postResult.SN, YZStringHelper.GetUserNameListString(postResult.Recipients), customMessage);
                    break;
                case PostResultType.TaskInWaiting:
                    message = String.Format(Resources.YZStrings.Aspx_PostResult_TaskInWaiting, postResult.SN, customMessage);
                    break;
                case PostResultType.TaskFinishedApproved:
                    message = String.Format(Resources.YZStrings.Aspx_PostResult_TaskFinishedApproved, postResult.SN, customMessage);
                    break;
                case PostResultType.TaskFinishedRejected:
                    message = String.Format(Resources.YZStrings.Aspx_PostResult_TaskFinishedRejected, postResult.SN, customMessage);
                    break;
                case PostResultType.RecedeRestarted:
                    message = String.Format(Resources.YZStrings.Aspx_PostResult_RecedeRestarted, postResult.SN, YZStringHelper.GetUserNameListString(postResult.Recipients), customMessage);
                    break;
                default:
                    message = String.Empty;
                    break;
            }

            //输出处理结果
            Response.Write(YZUtility.HtmlEncode(message));
        }
        catch (Exception exp)
        {
            Response.Write(YZUtility.HtmlEncode(exp.Message));
        }
        finally
        {
            cn.Close();
        }
    }
}
