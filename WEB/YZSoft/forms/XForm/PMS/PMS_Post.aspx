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
                                        <aspxform:XTextBox id="XTextBox4" runat="server" BorderColor="Gainsboro" BorderWidth="1px" width="52px" Max="0" Min="0" XDataBind="PMS:InstProjects.FillUser" ValueToDisplayText HiddenInput="False" PlaceHolder DisableExpress="1"></aspxform:XTextBox>
                                        -<aspxform:XTextBox id="XTextBox5" runat="server" BorderColor="Gainsboro" BorderWidth="1px" width="116px" Max="0" Min="0" XDataBind="PMS:InstProjects.FillName" ValueToDisplayText HiddenInput="False" PlaceHolder DisableExpress="1"></aspxform:XTextBox>
                                    </td>
                                    <td width="70" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        申請人</td>
                                    <td width="201" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XTextBox id="XTextBox6" runat="server" BorderColor="Gainsboro" BorderWidth="1px" width="58px" Max="0" Min="0" XDataBind="PMS:InstProjects.ApplyUser" ValueToDisplayText HiddenInput="False" PlaceHolder DisableExpress="1"></aspxform:XTextBox>
                                        -<aspxform:XTextBox id="XTextBox7" runat="server" BorderColor="Gainsboro" BorderWidth="1px" width="96px" Max="0" Min="0" XDataBind="PMS:InstProjects.ApplyName" ValueToDisplayText HiddenInput="False" PlaceHolder DisableExpress="1"></aspxform:XTextBox>
                                        <aspxform:XSelectUserButton id="XSelectUserButton1" runat="server" Width="21px" DataMap="Account->PMS:InstProjects.ApplyUser;DisplayName->PMS:InstProjects.ApplyName"></aspxform:XSelectUserButton>
                                    </td>
                                    <td width="84" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        填表日期</td>
                                    <td width="166" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XDateTimePicker id="XDateTimePicker1" runat="server" BorderColor="Gainsboro" BorderWidth="1px" XDataBind="PMS:InstProjects.FillAt" Width="163px" DisableExpress="1"></aspxform:XDateTimePicker>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                                        專案編號</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="5">
                                        <aspxform:XTextBox id="XTextBox1" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="PMS:InstProjects.PID"></aspxform:XTextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                                        專案名稱</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="5">
                                        <aspxform:XTextBox id="XTextBox2" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="PMS:InstProjects.Name"></aspxform:XTextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                                        專案說明</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="gainsboro" colspan="5">
                                        <aspxform:XTextBox id="XTextBox3" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" MaxLength="5" XDataBind="PMS:InstProjects.Desc" TextMode="MultiLine" Rows="5"></aspxform:XTextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                                        專案類型</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XDropDownList id="XDropDownList1" runat="server" XDataBind="PMS:InstProjects.ProjectType"></aspxform:XDropDownList>
                                    </td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        專案負責人</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XTextBox id="XTextBox8" runat="server" BorderColor="Gainsboro" BorderWidth="1px" width="50px" Max="0" Min="0" XDataBind="PMS:InstProjects.ManagerID" ValueToDisplayText HiddenInput="False" PlaceHolder DisableExpress="1"></aspxform:XTextBox>
                                        -<aspxform:XTextBox id="XTextBox9" runat="server" BorderColor="Gainsboro" BorderWidth="1px" width="110px" Max="0" Min="0" XDataBind="PMS:InstProjects.ManagerName" ValueToDisplayText HiddenInput="False" PlaceHolder DisableExpress="1"></aspxform:XTextBox>
                                        <aspxform:XSelectUserButton id="XSelectUserButton2" runat="server" Width="21px" DataMap="Account->PMS:InstProjects.ManagerID;DisplayName->PMS:InstProjects.ManagerName"></aspxform:XSelectUserButton>
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
                                        <aspxform:XDateTimePicker id="XDateTimePicker2" runat="server" BorderColor="#DCDCDC" BorderWidth="1"></aspxform:XDateTimePicker>
                                    </td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        結束日期</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XDateTimePicker id="XDateTimePicker3" runat="server" BorderColor="#DCDCDC" BorderWidth="1"></aspxform:XDateTimePicker>
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
                        <aspxform:XAddBlockButton id="XAddBlockButton1" runat="server" Text="增加目標" TableName="InstGoals"></aspxform:XAddBlockButton>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <table width="100%" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0" dynamicarea="0,8" xdatasource="DataSource:PMS;TableName:InstGoals">
                            <tbody>
                                <tr>
                                    <td width="27" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="#ffc0c0" rowspan="7">
                                        <aspxform:XGridLineNo id="XGridLineNo1" runat="server" BorderWidth="1" Width="100%" BorderStyle="None" TextAlign="Center" BackColor="#FFC0C0">1</aspxform:XGridLineNo>
                                    </td>
                                    <td width="107" height="20" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        目標名稱</td>
                                    <td style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="6">
                                        <aspxform:XTextBox id="XTextBox10" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="PMS:InstGoals.Name"></aspxform:XTextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="79" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        目標說明</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="6">
                                        <aspxform:XTextBox id="XTextBox11" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="PMS:InstGoals.Desc" TextMode="MultiLine" Rows="5"></aspxform:XTextBox>
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
                                        <aspxform:XTextBox id="XTextBox12" runat="server" BorderColor="Gainsboro" BorderWidth="1px" width="58px" Max="0" Min="0" XDataBind="PMS:InstGoals.ManagerID" ValueToDisplayText HiddenInput="False" PlaceHolder DisableExpress="1"></aspxform:XTextBox>
                                        -<aspxform:XTextBox id="XTextBox13" runat="server" BorderColor="Gainsboro" BorderWidth="1px" width="109px" Max="0" Min="0" XDataBind="PMS:InstGoals.ManagerName" ValueToDisplayText HiddenInput="False" PlaceHolder DisableExpress="1"></aspxform:XTextBox>
                                        <aspxform:XSelectUserButton id="XSelectUserButton3" runat="server" Width="21px" DataMap="Account->PMS:InstGoals.ManagerID;DisplayName->PMS:InstProjects.ManagerName"></aspxform:XSelectUserButton>
                                    </td>
                                    <td width="90" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        目標狀態</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="2">
                                        <aspxform:XDropDownList id="XDropDownList4" runat="server" XDataBind="PMS:InstGoals.GoalStatus"></aspxform:XDropDownList>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="22" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        開始日期</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XDateTimePicker id="XDateTimePicker4" runat="server" BorderColor="#DCDCDC" BorderWidth="1" XDataBind="PMS:InstGoals.StartDate"></aspxform:XDateTimePicker>
                                    </td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        結束日期</td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XDateTimePicker id="XDateTimePicker5" runat="server" BorderColor="#DCDCDC" BorderWidth="1" XDataBind="PMS:InstGoals.EndDate"></aspxform:XDateTimePicker>
                                    </td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                    </td>
                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="2">
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="6">
                                        工作明細</td>
                                    <td width="75" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                        <aspxform:XAddBlockButton id="XAddBlockButton2" runat="server" Text="增加工作" TableName="InstWorks"></aspxform:XAddBlockButton>
                                    </td>
                                </tr>
                                <tr>
                                </tr>
                                <tr>
                                    <td height="48" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="7">
                                        <table width="100%" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0" dynamicarea="0,5" xdatasource="DataSource:PMS;TableName:InstWorks">
                                            <tbody>
                                                <tr>
                                                    <td width="21" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="#ffe0c0" rowspan="4">
                                                        <aspxform:XGridLineNo id="XGridLineNo2" runat="server" BorderWidth="1" Width="100%" BorderStyle="None" TextAlign="Center" BackColor="#FFE0C0">1</aspxform:XGridLineNo>
                                                    </td>
                                                    <td width="64" height="14" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                                        工作名稱</td>
                                                    <td style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="5">
                                                        <aspxform:XTextBox id="XTextBox14" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="PMS:InstWorks.Name"></aspxform:XTextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td height="14" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                                        工作說明</td>
                                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="5">
                                                        <aspxform:XTextBox id="XTextBox15" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="PMS:InstWorks.Desc" TextMode="MultiLine" Rows="5"></aspxform:XTextBox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td height="16" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                                        工作類型</td>
                                                    <td width="136" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                                        <aspxform:XDropDownList id="XDropDownList5" runat="server" XDataBind="PMS:InstWorks.WorkType"></aspxform:XDropDownList>
                                                    </td>
                                                    <td width="88" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                                        工作負責人</td>
                                                    <td width="226" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                                        <aspxform:XTextBox id="XTextBox16" runat="server" BorderColor="Gainsboro" BorderWidth="1px" width="61px" Max="0" Min="0" XDataBind="PMS:InstWorks.ManagerID" ValueToDisplayText HiddenInput="False" PlaceHolder DisableExpress="1"></aspxform:XTextBox>
                                                        -<aspxform:XTextBox id="XTextBox17" runat="server" BorderColor="Gainsboro" BorderWidth="1px" width="125px" Max="0" Min="0" XDataBind="PMS:InstWorks.ManagerName" ValueToDisplayText HiddenInput="False" PlaceHolder DisableExpress="1"></aspxform:XTextBox>
                                                        <aspxform:XSelectUserButton id="XSelectUserButton4" runat="server" Width="21px" DataMap="Account->PMS:InstWorks.ManagerID;DisplayName->PMS:InstProjects.ManagerName"></aspxform:XSelectUserButton>
                                                    </td>
                                                    <td width="77" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                                        工作狀態</td>
                                                    <td width="142" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                                        <aspxform:XDropDownList id="XDropDownList6" runat="server" XDataBind="PMS:InstWorks.WorkStatus"></aspxform:XDropDownList>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td height="14" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                                        開始日期</td>
                                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                                        <aspxform:XDateTimePicker id="XDateTimePicker6" runat="server" BorderColor="#DCDCDC" BorderWidth="1" XDataBind="PMS:InstWorks.StartDate"></aspxform:XDateTimePicker>
                                                    </td>
                                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                                        結束日期</td>
                                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                                        <aspxform:XDateTimePicker id="XDateTimePicker7" runat="server" BorderColor="#DCDCDC" BorderWidth="1" XDataBind="PMS:InstWorks.EndDate"></aspxform:XDateTimePicker>
                                                    </td>
                                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                                    </td>
                                                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td height="3" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="7">
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="3" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="8">
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
