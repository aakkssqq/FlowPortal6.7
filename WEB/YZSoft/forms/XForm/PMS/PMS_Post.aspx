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
    <form runat="server">
        <!-- Insert content here -->
        <table width="800" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td align="center" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        專案申請單</td>
                </tr>
                <tr>
                    <td align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <table width="100%" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td width="66" height="18" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                                        填表人</td>
                                    <td width="191" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XTextBox id="XTextBox4" runat="server" DisableExpress="1" PlaceHolder HiddenInput="False" ValueToDisplayText XDataBind="PMS:InstProjects.FillUser" Min="0" Max="0" width="52px" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                                        -<aspxform:XTextBox id="XTextBox5" runat="server" DisableExpress="1" PlaceHolder HiddenInput="False" ValueToDisplayText XDataBind="PMS:InstProjects.FillName" Min="0" Max="0" width="116px" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                                    </td>
                                    <td width="70" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        申請人</td>
                                    <td width="201" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XTextBox id="XTextBox6" runat="server" DisableExpress="1" PlaceHolder HiddenInput="False" ValueToDisplayText XDataBind="PMS:InstProjects.ApplyUser" Min="0" Max="0" width="58px" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                                        -<aspxform:XTextBox id="XTextBox7" runat="server" DisableExpress="1" PlaceHolder HiddenInput="False" ValueToDisplayText XDataBind="PMS:InstProjects.ApplyName" Min="0" Max="0" width="96px" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                                        <aspxform:XSelectUserButton id="XSelectUserButton1" runat="server" DataMap="Account->PMS:InstProjects.ApplyUser;DisplayName->PMS:InstProjects.ApplyName" Width="21px"></aspxform:XSelectUserButton>
                                    </td>
                                    <td width="84" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        填表日期</td>
                                    <td width="166" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XDateTimePicker id="XDateTimePicker1" runat="server" DisableExpress="1" XDataBind="PMS:InstProjects.FillAt" BorderWidth="1px" BorderColor="Gainsboro" Width="163px"></aspxform:XDateTimePicker>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                                        專案編號</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="5">
                                        <aspxform:XTextBox id="XTextBox1" runat="server" DisableExpress="1" PlaceHolder="系統自動產生" XDataBind="PMS:InstProjects.PID" width="100%" BorderWidth="1" BorderColor="#DCDCDC"></aspxform:XTextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                                        專案名稱</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="5">
                                        <aspxform:XTextBox id="XTextBox2" runat="server" XDataBind="PMS:InstProjects.Name" width="100%" BorderWidth="1" BorderColor="#DCDCDC"></aspxform:XTextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                                        專案說明</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="gainsboro" colspan="5">
                                        <aspxform:XTextBox id="XTextBox3" runat="server" XDataBind="PMS:InstProjects.Desc" width="100%" BorderWidth="1" BorderColor="#DCDCDC" MaxLength="5" Rows="5" TextMode="MultiLine"></aspxform:XTextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                                        專案類型</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XDropDownList id="XDropDownList1" runat="server" XDataBind="PMS:InstProjects.ProjectType" XDataSource='DataSource:PMS;TableName:SysParameter;Filter:Type->"ProjectType"' ValueColumn="Value" DisplayColumn="DisplayName"></aspxform:XDropDownList>
                                    </td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        專案負責人</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XTextBox id="XTextBox8" runat="server" DisableExpress="1" PlaceHolder HiddenInput="False" ValueToDisplayText XDataBind="PMS:InstProjects.ManagerID" Min="0" Max="0" width="50px" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                                        -<aspxform:XTextBox id="XTextBox9" runat="server" DisableExpress="1" PlaceHolder HiddenInput="False" ValueToDisplayText XDataBind="PMS:InstProjects.ManagerName" Min="0" Max="0" width="110px" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                                        <aspxform:XSelectUserButton id="XSelectUserButton2" runat="server" DataMap="Account->PMS:InstProjects.ManagerID;DisplayName->PMS:InstProjects.ManagerName" Width="21px"></aspxform:XSelectUserButton>
                                    </td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        專案狀態</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XDropDownList id="XDropDownList2" runat="server" XDataBind="PMS:InstProjects.ProjectStatus"></aspxform:XDropDownList>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                                        開始日期</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XDateTimePicker id="XDateTimePicker2" runat="server" BorderWidth="1" BorderColor="#DCDCDC"></aspxform:XDateTimePicker>
                                    </td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        結束日期</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XDateTimePicker id="XDateTimePicker3" runat="server" BorderWidth="1" BorderColor="#DCDCDC"></aspxform:XDateTimePicker>
                                    </td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                    </td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td width="729" align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        目標明細</td>
                    <td width="67" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XAddBlockButton id="XAddBlockButton1" runat="server" TableName="InstGoals" Text="增加目標"></aspxform:XAddBlockButton>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <table width="100%" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0" xdatasource="DataSource:PMS;TableName:InstGoals" dynamicarea="0,8">
                            <tbody>
                                <tr>
                                    <td width="27" height="173" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="#ffc0c0" rowspan="5">
                                        <aspxform:XGridLineNo id="XGridLineNo1" runat="server" BorderWidth="1" Width="100%" BackColor="#FFC0C0" TextAlign="Center" BorderStyle="None">1</aspxform:XGridLineNo>
                                    </td>
                                    <td width="107" height="20" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        目標名稱</td>
                                    <td style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="6">
                                        <aspxform:XTextBox id="XTextBox10" runat="server" XDataBind="PMS:InstGoals.Name" width="100%" BorderWidth="1" BorderColor="#DCDCDC"></aspxform:XTextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="79" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        目標說明</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="6">
                                        <aspxform:XTextBox id="XTextBox11" runat="server" XDataBind="PMS:InstGoals.Desc" width="100%" BorderWidth="1" BorderColor="#DCDCDC" Rows="5" TextMode="MultiLine"></aspxform:XTextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        目標類型</td>
                                    <td width="102" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XDropDownList id="XDropDownList3" runat="server" XDataBind="PMS:InstGoals.GoalType"></aspxform:XDropDownList>
                                    </td>
                                    <td width="101" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        目標負責人</td>
                                    <td width="204" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XTextBox id="XTextBox12" runat="server" DisableExpress="1" PlaceHolder HiddenInput="False" ValueToDisplayText XDataBind="PMS:InstGoals.ManagerID" Min="0" Max="0" width="58px" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                                        -<aspxform:XTextBox id="XTextBox13" runat="server" DisableExpress="1" PlaceHolder HiddenInput="False" ValueToDisplayText XDataBind="PMS:InstGoals.ManagerName" Min="0" Max="0" width="109px" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                                        <aspxform:XSelectUserButton id="XSelectUserButton3" runat="server" DataMap="Account->PMS:InstGoals.ManagerID;DisplayName->PMS:InstProjects.ManagerName" Width="21px"></aspxform:XSelectUserButton>
                                    </td>
                                    <td width="90" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        目標狀態</td>
                                    <td width="75" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="2">
                                        <aspxform:XDropDownList id="XDropDownList4" runat="server" XDataBind="PMS:InstGoals.GoalStatus"></aspxform:XDropDownList>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="22" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        開始日期</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XDateTimePicker id="XDateTimePicker4" runat="server" XDataBind="PMS:InstGoals.StartDate" BorderWidth="1" BorderColor="#DCDCDC"></aspxform:XDateTimePicker>
                                    </td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        結束日期</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XDateTimePicker id="XDateTimePicker5" runat="server" XDataBind="PMS:InstGoals.EndDate" BorderWidth="1" BorderColor="#DCDCDC"></aspxform:XDateTimePicker>
                                    </td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                    </td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="2">
                                    </td>
                                </tr>
                                <tr>
                                </tr>
                                <tr>
                                    <td height="14" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="8">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </form>
</body>
</html>
