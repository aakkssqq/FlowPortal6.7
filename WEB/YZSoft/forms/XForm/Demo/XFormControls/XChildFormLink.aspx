<%@ Page Language="C#" %>
<%@ Register TagPrefix="aspxform" Namespace="XFormDesigner.Framework.Web.UI" Assembly="XFormDesigner.Framework" %>
<script runat="server">

    // Insert page code here
    //

</script>
<html xmlns:xform="xmlns:xform">
<head id="Head1" runat="server">
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
    <script type='text/javascript'>
    </script>
</head>
<body>
    <form id="Form1" runat="server">
        <table width="557" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td height="53" valign="middle" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="4">
                        <strong><font size="4">ChildFormLink</font></strong>&nbsp; 
                        <br />
                        <font size="1">xclass:YZSoft.Forms.Field.ChildFormLink</font> 
                    </td>
                </tr>
                <tr>
                    <td width="127" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Dept</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox11" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="Purchase.Dept" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Amount</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox12" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="Purchase.Amount" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="4">
                        <aspxform:XLabel id="XLabel5" runat="server" BorderWidth="3px" BorderColor="Turquoise" Height="40px" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="父表单基本信息" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        供应商编号</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox1" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="供应商编号" Min="0" Max="0" width="200px" BorderWidth="1px" BorderColor="Gainsboro">021-2015-0010</aspxform:XTextBox>
                        <aspxform:XDataBrowserButton id="XDataBrowserButton1" runat="server" Width="21px" DataMap="供应商编号->供应商编号;企业名称->企业名称;法人代表->法人代表;营业执照号->营业执照;注册资金->注册资金;公司类型->公司类型;供应商类别->供应商类别;经营范围->经营范围" XDataSource="TableName:iDemoSupervisor" DisplayColumns="供应商编号:,120;企业名称:,200;法人代表:,100;营业执照号:,160"></aspxform:XDataBrowserButton>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        企业名称</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox14" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="企业名称" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro">航天八院</aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        法人代表</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox15" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="法人代表" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro">周宏生</aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        营业执照</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox2" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="营业执照" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro">330181000229741</aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        注册资金 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox6" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="注册资金" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro">5000万元</aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        公司类型</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox7" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="公司类型" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro">有限责任公司</aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        供应商类别</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox13" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="供应商类别" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro">制造商/代理商</aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        经营范围</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox16" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="经营范围" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro" Rows="6" TextMode="MultiLine">航天、航空设备研究、开发、生产</aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="4">
                        <aspxform:XLabel id="XLabel1" runat="server" BorderWidth="3px" BorderColor="Turquoise" Height="40px" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="子表单、父->子数据带入、子->父数据带出" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        环保评审单</td>
                    <td width="189" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XChildFormLink id="XChildFormLink1" runat="server" XDataBind="Purchase.Int1" TextAlign="Center" DataMap="Key->key" ParamNames="企业名称,营业执照,公司类型,法人代表" ParamsFill="企业名称->企业名称,营业执照->营业执照,公司类型->公司类型,法人代表->法人代表" FormApplication="Demo/EnvIssue">环保评审单</aspxform:XChildFormLink>
                        <aspxform:XChildFormLink id="XChildFormLink2" runat="server" XDataBind="Purchase.Int1" TextAlign="Center" DataMap="Key->key" ParamNames="企业名称,营业执照,公司类型,法人代表,forceSet" ParamsFill="企业名称->企业名称,营业执照->营业执照,公司类型->公司类型,法人代表->法人代表,forceSet->1" FormApplication="Demo/EnvIssue">环保评审单每次带入</aspxform:XChildFormLink>
                    </td>
                    <td width="88" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        带出-流水号 
                    </td>
                    <td width="140" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox17" runat="server" HiddenInput="False" ValueToDisplayText="TableName:Purchase;FilterColumn:ItemID;DisplayColumn:SN;PreventCache:True" XDataBind="key" width="100%" BorderWidth="1" BorderColor="#DCDCDC" DataMap="Str5->memo;Str6->attachment" ReadOnly="True"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        带出-评审意见</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox8" runat="server" XDataBind="memo" width="100%" BorderWidth="1" BorderColor="#DCDCDC" Rows="6" TextMode="MultiLine" ReadOnly="True"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        带出-附件</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XAttachments id="XAttachments1" runat="server" XDataBind="attachment" width="100%" Enabled="False" RepeatDirection="Horizontal" FileTypes="*.doc;*.docx;*.xls;*.xlsx" FileTypesDescription="Word,Excel"></aspxform:XAttachments>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="4">
                        <aspxform:XLabel id="XLabel2" runat="server" BorderWidth="3px" BorderColor="Turquoise" Height="40px" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="开窗方式：Window、Dialog、Tab" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Window</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XChildFormLink id="XChildFormLink3" runat="server" XDataBind="Purchase.Int1" TextAlign="Center" DataMap="Key->key" ParamNames="企业名称,营业执照,公司类型,法人代表" ParamsFill="企业名称->企业名称,营业执照->营业执照,公司类型->公司类型,法人代表->法人代表" FormApplication="Demo/EnvIssue" WindowModel="Window">环保评审单</aspxform:XChildFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Dialog</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XChildFormLink id="XChildFormLink4" runat="server" XDataBind="Purchase.Int1" TextAlign="Center" DataMap="Key->key" ParamNames="企业名称,营业执照,公司类型,法人代表" ParamsFill="企业名称->企业名称,营业执照->营业执照,公司类型->公司类型,法人代表->法人代表" FormApplication="Demo/EnvIssue" WindowModel="Dialog">环保评审单</aspxform:XChildFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Tab</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XChildFormLink id="XChildFormLink5" runat="server" XDataBind="Purchase.Int1" TextAlign="Center" DataMap="Key->key" ParamNames="企业名称,营业执照,公司类型,法人代表" ParamsFill="企业名称->企业名称,营业执照->营业执照,公司类型->公司类型,法人代表->法人代表" FormApplication="Demo/EnvIssue" WindowModel="Tab">环保评审单</aspxform:XChildFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Default</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XChildFormLink id="XChildFormLink6" runat="server" XDataBind="Purchase.Int1" TextAlign="Center" DataMap="Key->key" ParamNames="企业名称,营业执照,公司类型,法人代表" ParamsFill="企业名称->企业名称,营业执照->营业执照,公司类型->公司类型,法人代表->法人代表" FormApplication="Demo/EnvIssue">环保评审单</aspxform:XChildFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="4">
                        <aspxform:XLabel id="XLabel3" runat="server" BorderWidth="3px" BorderColor="Turquoise" Height="40px" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="Disable/Enable(Amount==1)" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Disable</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XChildFormLink id="XChildFormLink7" runat="server" XDataBind="Purchase.Int1" TextAlign="Center" DataMap="Key->key" ParamNames="企业名称,营业执照,公司类型,法人代表" ParamsFill="企业名称->企业名称,营业执照->营业执照,公司类型->公司类型,法人代表->法人代表" FormApplication="Demo/EnvIssue" DisableExpress="Purchase.Amount==1">环保评审单</aspxform:XChildFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="4">
                        <aspxform:XLabel id="XLabel4" runat="server" BorderWidth="3px" BorderColor="Turquoise" Height="40px" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="Hidden/Show(Amount==1)" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Hidden</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XChildFormLink id="XChildFormLink8" runat="server" XDataBind="Purchase.Int1" TextAlign="Center" DataMap="Key->key" ParamNames="企业名称,营业执照,公司类型,法人代表" ParamsFill="企业名称->企业名称,营业执照->营业执照,公司类型->公司类型,法人代表->法人代表" FormApplication="Demo/EnvIssue" HiddenExpress="Purchase.Amount==1">环保评审单</aspxform:XChildFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="4">
                        <aspxform:XLabel id="XLabel6" runat="server" BorderWidth="3px" BorderColor="Turquoise" Height="40px" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="大尺寸" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        ChildFormLink</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XChildFormLink id="XChildFormLink9" runat="server" XDataBind="Purchase.Int1" BorderWidth="3px" BorderColor="Red" Height="50px" BorderStyle="Solid" BackColor="#FFC0C0" Width="100%" TextAlign="Center" DataMap="Key->key" ParamNames="企业名称,营业执照,公司类型,法人代表" ParamsFill="企业名称->企业名称,营业执照->营业执照,公司类型->公司类型,法人代表->法人代表" FormApplication="Demo/EnvIssue" DisableExpress="Purchase.Amount==1">环保评审单</aspxform:XChildFormLink>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Insert content here -->
    </form>
</body>
</html>