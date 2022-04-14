using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Collections.Generic;
using System.Text;
using BPM;
using BPM.Client;
using BPM.Client.Data.Common;
using System.Globalization;

/// <summary>
/// StringHelper 的摘要说明

/// </summary>
public class YZStringHelper
{
    public static bool EquName(string str1,string str2)
    {
        if (String.Compare(str1, str2, true) == 0)
            return true;
        else
            return false;
    }

    public static string DateToString(DateTime date)
    {
        return YZStringHelper.DateToString(date, null);
    }

    public static string DateToString(DateTime date, string nullString)
    {
        if (date == DateTime.MinValue)
            return nullString;
        else
            return date.ToString("yyyy-MM-dd", new System.Globalization.CultureInfo(1033));
    }

    public static string DateToStringH(DateTime date)
    {
        return YZStringHelper.DateToStringH(date, null);
    }

    public static string DateToStringH(DateTime date, string nullString)
    {
        if (date == DateTime.MinValue)
            return nullString;
        else
            return date.ToString("yyyy-MM-dd HH", new System.Globalization.CultureInfo(1033));
    }

    public static string DateToStringM(DateTime date)
    {
        return YZStringHelper.DateToStringM(date, null);
    }

    public static string DateToStringM(DateTime date, string nullString)
    {
        if (date == DateTime.MinValue)
            return nullString;
        else
            return date.ToString("yyyy-MM-dd HH:mm", new System.Globalization.CultureInfo(1033));
    }

    public static string DateToStringL(DateTime date)
    {
        return YZStringHelper.DateToStringL(date, null);
    }

    public static string DateToStringL(DateTime date,string nullString)
    {
        if (date == DateTime.MinValue)
            return nullString;
        else
            return date.ToString("yyyy-MM-dd HH:mm:ss", new System.Globalization.CultureInfo(1033));
    }

    public static string MinutesToStringDHM(int minutes)
    {
        return YZStringHelper.MinutesToStringDHM(minutes,24);
    }

    public static string MinutesToStringDHM(int minutes,int dayhours)
    {
        if (minutes == -1)
            return Resources.YZStrings.All_HandlingTime_NoCal;

        if (minutes == 0)
            return Resources.YZStrings.All_LTOneMinute;

        int totalhours = minutes / 60;
        minutes = minutes % 60;
        int days = totalhours / dayhours;
        int hours = totalhours % dayhours;

        List<string> ar = new List<string>();
        if (days >= 1)
            ar.Add(days.ToString() + Resources.YZStrings.All_UnitDays);

        if (ar.Count != 0)
            ar.Add(hours.ToString("00") + Resources.YZStrings.All_UnitHour);
        else if(hours >= 1)
            ar.Add(hours.ToString() + Resources.YZStrings.All_UnitHour);

        if (ar.Count != 0)
            ar.Add(minutes.ToString("00") + Resources.YZStrings.All_UnitMinute);
        else
            ar.Add(minutes.ToString() + Resources.YZStrings.All_UnitMinute);

        return String.Join(null,ar.ToArray());
    }

    public static bool IsNumber(string strVar)
    {
        int count = strVar.Length;
        for (int i = 0; i < count; i++)
        {
            char ch = strVar[i];
            if (ch < '0' || ch > '9')
                return false;
        }

        return true;
    }

    public static int[] StringToIntArray(string str)
    {
        string[] strids = str.Split(',');

        List<int> idarray = new List<int>();
        foreach (string strid in strids)
        {
            if (String.IsNullOrEmpty(strid))
                continue;

            int id;
            if (Int32.TryParse(strid, out id))
                idarray.Add(id);
        }

        return idarray.ToArray();
    }

    public static string GetTaskStateDisplayName(TaskState state)
    {
        switch (state)
        {
            case TaskState.Running:
                return Resources.YZStrings.All_Running;
            case TaskState.Approved:
                return Resources.YZStrings.All_Approved;
            case TaskState.Rejected:
                return Resources.YZStrings.All_Rejected;
            case TaskState.Aborted:
                return Resources.YZStrings.All_Aborted;
            case TaskState.Deleted:
                return Resources.YZStrings.All_Deleted;
            default:
                return Resources.YZStrings.All_UnknownStatus;
        }
    }

    public static string GetPostResultDisplayStringShort(PostResult postResult)
    {
        //获得处理结果
        string message;

        string customMessage = postResult.CustomMessage;
        if (!String.IsNullOrEmpty(customMessage))
            customMessage = "[" + customMessage + "]";

        switch (postResult.PostResultType)
        {
            case PostResultType.HasSentToOtherUsers:
                message = String.Format(Resources.YZStrings.Aspx_PostResult_HasSentToOtherUsers1, YZStringHelper.GetUserNameListString(postResult.Recipients), customMessage);
                break;
            case PostResultType.InWaitingOtherUsers:
                message = String.Format(Resources.YZStrings.Aspx_PostResult_InWaitingOtherUsers1, YZStringHelper.GetUserNameListString(postResult.Recipients), customMessage);
                break;
            case PostResultType.TaskInWaiting:
                message = String.Format(Resources.YZStrings.Aspx_PostResult_TaskInWaiting1, customMessage);
                break;
            case PostResultType.TaskFinishedApproved:
                message = String.Format(Resources.YZStrings.Aspx_PostResult_TaskFinishedApproved1, customMessage);
                break;
            case PostResultType.TaskFinishedRejected:
                message = String.Format(Resources.YZStrings.Aspx_PostResult_TaskFinishedRejected1, customMessage);
                break;
            case PostResultType.RecedeRestarted:
                message = String.Format(Resources.YZStrings.Aspx_PostResult_RecedeRestarted1, YZStringHelper.GetUserNameListString(postResult.Recipients), customMessage);
                break;
            default:
                message = String.Empty;
                break;
        }

        return message;
    }

    public static string GetKeyWordString(QueryParameterCollection peramaterDefines, BPMDBParameterCollection currentParamaters)
    {
        StringBuilder sb = new StringBuilder();
        foreach (BPMDBParameter parameter in currentParamaters)
        {
            QueryParameter queryParameter = peramaterDefines.TryGetItem(parameter.Name);
            if (queryParameter == null)
                continue;

            if (queryParameter.ParameterUIBindType != BPM.Data.Common.ParameterUIBindType.Normal)
                continue;

            if (parameter.Value == null)
                continue;

            string keyword = parameter.Value.ToString().Trim();
            if (String.IsNullOrEmpty(keyword))
                continue;

            if (sb.Length != 0)
                sb.Append(";");

            sb.Append(keyword);
        }

        return sb.ToString();
    }

    public static string GetUserFriendlyName(string account, string displayName)
    {
        if (String.IsNullOrEmpty(account)) //共享任务，Account可能为空
            return "";

        if (String.IsNullOrEmpty(displayName))
            return account;
        else
            return displayName + "(" + account + ")";
    }

    public static string GetUserShortName(string account, string displayName)
    {
        if (String.IsNullOrEmpty(displayName))
            return account;
        else
            return displayName;
    }

    public static string GetRecpientDisplayName(StepRecipient recp)
    {
        if (recp.Agent == null)
            return YZStringHelper.GetUserFriendlyName(recp.Owner.Account, recp.Owner.DisplayName);
        else
            return String.Format(Resources.YZStrings.Aspx_RecpDspFmt, YZStringHelper.GetUserFriendlyName(recp.Agent.Account, recp.Agent.DisplayName),
                YZStringHelper.GetUserShortName(recp.Owner.Account, recp.Owner.DisplayName));
    }

    public static string GetUserNameListString(UserCollection users)
    {
        BPMObjectNameCollection names = new BPMObjectNameCollection();
        foreach(User user in users)
            names.Add(YZStringHelper.GetUserFriendlyName(user.Account,user.DisplayName));

        return names.ToStringList(';');
    }

    public static string GetUserShortNameListString(UserCollection users)
    {
        BPMObjectNameCollection names = new BPMObjectNameCollection();
        foreach (User user in users)
            names.Add(YZStringHelper.GetUserShortName(user.Account, user.DisplayName));

        return names.ToStringList(';');
    }

    public static string GetUserNameListString(StepRecipientCollection recps)
    {
        BPMObjectNameCollection names = new BPMObjectNameCollection();
        foreach (StepRecipient recp in recps)
            names.Add(YZStringHelper.GetRecpientDisplayName(recp));

        return names.ToStringList(';');
    }

    public static string GetFileSize(object value)
    {
        int length = (Convert.ToInt32(value) + 1024) / 1024;
        NumberFormatInfo nfi = (System.Threading.Thread.CurrentThread.CurrentCulture.Clone() as CultureInfo).NumberFormat;
        nfi.NumberDecimalDigits = 0;
        return length.ToString("N", nfi) + " KB";
    }

    public static string GetProcessDefaultShortName(string processName)
    {
        if (String.IsNullOrEmpty(processName))
            return "";

        return processName.Substring(0, Math.Min(2, processName.Length));
    }

    public static string ServerSideResourceStringProcess(string value)
    {
        if (String.IsNullOrEmpty(value))
            return value;

        return value.Replace("\\n", "\n");
    }
    public static string TrimString(string str, int length)
    {
        if (String.IsNullOrEmpty(str))
            return String.Empty;

        if (str.Length <= length)
            return str;

        return (str.Substring(0, length - 3) + "...");
    }
}
