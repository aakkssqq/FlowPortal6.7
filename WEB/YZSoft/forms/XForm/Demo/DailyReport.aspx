<%@ Page Language="C#" %>
<%@ Register TagPrefix="aspxform" Namespace="XFormDesigner.Framework.Web.UI" Assembly="XFormDesigner.Framework" %>
<script runat="server">

    // Insert page code here
    //

</script>
<html xmlns:XForm="xmlns:xform">
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <title>BPM Form</title>
    <style>
    BODY {FONT-SIZE: 12px; FONT-FAMILY: verdana}
    TABLE {border-collapse: collapse; FONT-SIZE: 12px; FONT-FAMILY: verdana}
    P {PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; FONT-SIZE: 12px; FONT-FAMILY: verdana}
    TD {padding:1px}
    TD.NoPadding {PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; PADDING-TOP: 0px}
    /*INPUT {height: 15px}*/
    INPUT.UL {BORDER-RIGHT: medium none; BORDER-TOP: medium none; BORDER-LEFT: medium none; BORDER-BOTTOM: #33ff33 1px solid}
    TEXTAREA {FONT-SIZE:12px}
    input {vertical-align:middle;/*margin-right:-3px*/}
    </style>
</head>
<body>
    <form id="Form1" runat="server">
        <table width="590" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td height="40" align="center" valign="middle" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="4">
                        <strong><font size="5">日报</font></strong></td>
                </tr>
                <tr>
                    <td height="20" align="right" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="3">
                        流水号</td>
                    <td width="160" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox6" runat="server" XDataBind="iDailyReport.SN" width="100%" BorderWidth="1" BorderColor="#DCDCDC"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td width="135" height="20" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        提交人</td>
                    <td width="190" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox1" runat="server" XDataBind="iDailyReport.Account" width="146px" BorderWidth="1px" BorderColor="Gainsboro" Max="0" Min="0" ValueToDisplayText HiddenInput="False"></aspxform:XTextBox>
                        <aspxform:XSelectUserButton id="XSelectUserButton1" runat="server" Width="21px" DataMap="Account->iDailyReport.Account"></aspxform:XSelectUserButton>
                    </td>
                    <td width="93" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        日期</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker1" runat="server" XDataBind="iDailyReport.Date" BorderWidth="1" BorderColor="#DCDCDC" Width="100%"></aspxform:XDateTimePicker>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        今日完成工作</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox2" runat="server" XDataBind="iDailyReport.Done" width="100%" BorderWidth="1" BorderColor="#DCDCDC" TextMode="MultiLine" Rows="5"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        未完成工作</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox3" runat="server" XDataBind="iDailyReport.Undone" width="100%" BorderWidth="1" BorderColor="#DCDCDC" TextMode="MultiLine" Rows="5"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        需协调工作</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox4" runat="server" XDataBind="iDailyReport.Coordinate" width="100%" BorderWidth="1" BorderColor="#DCDCDC" TextMode="MultiLine" Rows="5"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        备注</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox5" runat="server" XDataBind="iDailyReport.Comments" width="100%" BorderWidth="1" BorderColor="#DCDCDC" TextMode="MultiLine" Rows="5"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        附件</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XAttachments id="XAttachments1" runat="server" XDataBind="iDailyReport.Attachments" width="100%" FileTypesDescription="Word,Excel" FileTypes="*.doc;*.docx;*.xls;*.xlsx"></aspxform:XAttachments>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Insert content here -->
    </form>
</body>
</html>
