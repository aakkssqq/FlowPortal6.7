<%@ Page Language="C#" %>
<%@ Register TagPrefix="aspxform" Namespace="XFormDesigner.Framework.Web.UI" Assembly="XFormDesigner.Framework" %>
<script runat="server">

    // Insert page code here
    //

</script>
<html xmlns:xform= "xmlns:xform">
<head id="Head1" runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <title>设备档案信息</title>
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
        <table class="formTable" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-LEFT: medium none">
            <tbody>
                <tr>
                    <td height="31" style="BORDER-BOTTOM: black 1px solid" colspan="4">
                        <strong><font face="微软雅黑" size="5">设备档案信息</font></strong> 
                    </td>
                </tr>
                <tr class="groupName">
                    <td height="20" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="#fcfcfc" colspan="4">
                        基本信息 
                    </td>
                </tr>
                <tr>
                    <td width="119" height="20" class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        设备名称: 
                    </td>
                    <td width="206" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input input2" id="txtName" runat="server" Width="160px" xdatabind="iDemoDevice.Name" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px"></aspxform:xtextbox>
                    </td>
                    <td align="center" class="muti_row" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" rowspan="8" colspan="2">
                        <aspxform:XImageAttachment id="XImageAttachment1" runat="server" Width="160px" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="3px" XDataBind="iDemoDevice.Picture" Height="160px"></aspxform:XImageAttachment>
                    </td>
                </tr>
                <tr>
                    <td class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        设备分类:</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDropDownList class="select select2" id="XDropDownList1" runat="server" Width="160px" XDataBind="iDemoDevice.TypeID" ValueColumn="ID" DisplayColumn="Name" XDataSource="TableName:iDemoDeviceType" PromptText="请选择">
                            <asp:ListItem>未绑定</asp:ListItem>
                        </aspxform:XDropDownList>
                    </td>
                </tr>
                <tr>
                    <td class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        内部编号: 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input input2" id="txtNumber0" runat="server" Width="160px" xdatabind="iDemoDevice.Number" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled input2"></aspxform:xtextbox>
                    </td>
                </tr>
                <tr>
                    <td class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        出厂编号:</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input input2" id="txtNumber" runat="server" Width="160px" xdatabind="iDemoDevice.FactoryNumber" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled input2"></aspxform:xtextbox>
                    </td>
                </tr>
                <tr>
                    <td class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        型号: 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input input2" id="XTextBox4" runat="server" Width="160px" xdatabind="iDemoDevice.Model" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled input2"></aspxform:xtextbox>
                    </td>
                </tr>
                <tr>
                    <td class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        规格: 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input input2" id="XTextBox14" runat="server" Width="160px" xdatabind="iDemoDevice.Standard" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled input2"></aspxform:xtextbox>
                    </td>
                </tr>
                <tr>
                    <td class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        功率: 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input input3" id="XTextBox7" runat="server" Width="160px" xdatabind="iDemoDevice.Power" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled input2"></aspxform:xtextbox>
                        &nbsp;KW</td>
                </tr>
                <tr>
                    <td class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        生产厂商: 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input input2" id="XTextBox6" runat="server" Width="160px" xdatabind="iDemoDevice.Manufacture" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled input2"></aspxform:xtextbox>
                    </td>
                </tr>
                <tr>
                    <td height="20" class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        出厂日期: 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker class="input input_button input2" id="XDateTimePicker1" runat="server" Width="160px" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" XDataBind="iDemoDevice.DateOfManufacture"></aspxform:XDateTimePicker>
                    </td>
                    <td width="105" class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        启用日期: 
                    </td>
                    <td width="207" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker class="input input_button input2" id="XDateTimePicker2" runat="server" Width="160px" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" XDataBind="iDemoDevice.StartDate"></aspxform:XDateTimePicker>
                    </td>
                </tr>
                <tr>
                    <td height="20" class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        资产原值: 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input input3" id="XTextBox5" runat="server" Width="160px" xdatabind="iDemoDevice.Price" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled input2"></aspxform:xtextbox>
                        &nbsp;元</td>
                    <td class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        安装地点: 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input input2" id="XTextBox11" runat="server" Width="160px" xdatabind="iDemoDevice.Location" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled input2"></aspxform:xtextbox>
                    </td>
                </tr>
                <tr>
                    <td height="20" class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        供应商: 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input input2" id="XTextBox8" runat="server" Width="160px" xdatabind="iDemoDevice.Provider" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled input2"></aspxform:xtextbox>
                    </td>
                    <td class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        设备设龄: 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input input3" id="XTextBox10" runat="server" Width="160px" xdatabind="iDemoDevice.IntendAge" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled input3" hiddeninput="False" max="0" min="0"></aspxform:xtextbox>
                        &nbsp;年 
                    </td>
                </tr>
                <tr>
                    <td height="20" class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        所属系统: 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDropDownList id="XDropDownList2" runat="server" Width="160px" XDataBind="iDemoDevice.SystemID" ValueColumn="ID" DisplayColumn="Name" XDataSource="TableName:iDemoDeviceSystem" onchange="javascript:XFormOnChange(this);" cssclass="select select2">
                            <asp:ListItem Selected="True">未绑定</asp:ListItem>
                        </aspxform:XDropDownList>
                    </td>
                    <td class="header" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        状态: 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDropDownList id="XDropDownList3" runat="server" Width="160px" XDataBind="iDemoDevice.Status" ValueColumn="ID" DisplayColumn="Name" XDataSource="TableName:iDemoDeviceStatus" cssclass="select select2">
                            <asp:ListItem Selected="True">未绑定</asp:ListItem>
                        </aspxform:XDropDownList>
                    </td>
                </tr>
                <tr>
                    <td>
                        &nbsp;</td>
                    <td>
                    </td>
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="grid" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" dynamicarea="2,1">
            <tbody>
                <tr>
                    <td height="20" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="#fcfcfc" colspan="3">
                        随机资料</td>
                </tr>
                <tr class="header">
                    <td width="48" height="18" align="center" class="grid grid_id" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="transparent">
                        序号 
                    </td>
                    <td width="386" class="grid grid_item" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="transparent">
                        资料名称 
                    </td>
                    <td width="206" class="grid grid_desp" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="transparent">
                        说明 
                    </td>
                </tr>
                <tr>
                    <td height="20" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:xgridlineno class="input input_show grid_id" id="XGridLineNo3" runat="server" Width="100%" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" TextAlign="Center" ReadOnly="True">1</aspxform:xgridlineno>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input grid_item" id="XTextBox1" runat="server" Width="100%" xdatabind="iDemoDeviceSpecification.Name" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled grid_name"></aspxform:xtextbox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input grid_desp" id="XTextBox2" runat="server" Width="100%" xdatabind="iDemoDeviceSpecification.Remark" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled grid_desp"></aspxform:xtextbox>
                    </td>
                </tr>
                <tr>
                    <td>
                        &nbsp;</td>
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>
            </tbody>
        </table>
        <table width="650" class="grid" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" dynamicarea="2,1">
            <tbody>
                <tr>
                    <td height="20" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="#fcfcfc" colspan="4">
                        巡检要求</td>
                </tr>
                <tr class="header">
                    <td width="48" height="18" align="center" class="grid grid_id" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="transparent">
                        序号 
                    </td>
                    <td width="195" class="grid grid_item" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="transparent">
                        巡检项目 
                    </td>
                    <td width="190" class="grid grid_check" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="transparent">
                        检查要求 
                    </td>
                    <td width="204" class="grid grid_week" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="transparent">
                        检查周期(天)</td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:xgridlineno class="input input_show grid_id" id="XGridLineNo4" runat="server" Width="100%" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" TextAlign="Center">1</aspxform:xgridlineno>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input grid_item" id="XTextBox16" runat="server" Width="100%" xdatabind="iDemoDeviceRoutineCheckItem.Name" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled grid_item"></aspxform:xtextbox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input grid_check" id="XTextBox17" runat="server" Width="100%" xdatabind="iDemoDeviceRoutineCheckItem.Require" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled grid_check"></aspxform:xtextbox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input grid_week" id="XTextBox18" runat="server" Width="100%" xdatabind="iDemoDeviceRoutineCheckItem.Period" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled grid_week" hiddeninput="False" max="0" min="0" ValueToDisplayText Value></aspxform:xtextbox>
                    </td>
                </tr>
                <tr>
                    <td>
                        &nbsp;</td>
                    <td>
                    </td>
                    <td>
                    </td>
                    <td>
                    </td>
                </tr>
            </tbody>
        </table>
        <table width="650" class="grid" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" dynamicarea="2,1">
            <tbody>
                <tr>
                    <td height="20" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="#fcfcfc" colspan="4">
                        润滑要求</td>
                </tr>
                <tr class="header">
                    <td width="48" height="17" align="center" class="grid grid_id" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="transparent">
                        序号 
                    </td>
                    <td width="195" class="grid grid_item" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="transparent">
                        润滑项目 
                    </td>
                    <td width="190" class="grid grid_check" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="transparent">
                        润滑要求 
                    </td>
                    <td width="204" class="grid grid_week" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="transparent">
                        润滑周期(天)</td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:xgridlineno class="input input_show grid_id" id="XGridLineNo5" runat="server" Width="100%" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" TextAlign="Center">1</aspxform:xgridlineno>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input grid_item" id="XTextBox19" runat="server" Width="100%" xdatabind="iDemoDeviceRoutineLubricateRequire.Name" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled grid_item"></aspxform:xtextbox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input grid_check" id="XTextBox20" runat="server" Width="100%" xdatabind="iDemoDeviceRoutineLubricateRequire.Require" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" disablecssclass="input input_disabled grid_check"></aspxform:xtextbox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:xtextbox class="input grid_week" id="XTextBox22" runat="server" Width="100%" xdatabind="iDemoDeviceRoutineLubricateRequire.Period" BorderColor="Gainsboro" BorderStyle="Solid" BorderWidth="1px" Max="0" Min="0" disablecssclass="input input_disabled grid_week" ValueToDisplayText Value HiddenInput="False"></aspxform:xtextbox>
                    </td>
                </tr>
            </tbody>
        </table>
        <aspxform:xrequiredfieldvalidator id="XRequiredFieldValidator1" runat="server" ForeColor="Red" display="None" errormessage="设备名称不能为空" controltovalidate="txtName"></aspxform:xrequiredfieldvalidator>
        <aspxform:xrequiredfieldvalidator id="XRequiredFieldValidator2" runat="server" ForeColor="Red" display="None" errormessage="设备编号不能为空" controltovalidate="txtNumber0"></aspxform:xrequiredfieldvalidator>
    </form>
</body>
</html>