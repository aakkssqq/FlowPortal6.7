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
                    <td height="50" valign="middle" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <strong><font size="4">Label</font></strong>
                        <br />
                        <font size="1">xclass:YZSoft.Forms.Field.Label</font> 
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel5" runat="server" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="数据类型（自动关联数据库）" TextAlign="Center" Width="100%" BackColor="#C0FFFF" BorderStyle="Solid" BorderColor="Turquoise" BorderWidth="3px" Height="40px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td width="127" height="9" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Qty</td>
                    <td width="423" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox1" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="Purchase.Qty"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Price</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox2" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="Purchase.Price"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel3" runat="server" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="计算、显示格式、对齐" TextAlign="Center" Width="100%" BackColor="#C0FFFF" BorderStyle="Solid" BorderColor="Turquoise" BorderWidth="3px" Height="40px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Amount(Qty*Price)</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel7" runat="server" text="Label" XDataBind="Purchase.Amount" Express="Purchase.Qty*Purchase.Price"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Currency1</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel4" runat="server" TextAlign="Right" BorderColor="Gainsboro" width="100%" Max="0" Min="0" Express="Purchase.Qty*Purchase.Price" Format="type:currency;.2" HiddenInput="False" ValueToDisplayText></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Currency2</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel6" runat="server" TextAlign="Right" BorderColor="Gainsboro" width="100%" Max="0" Min="0" Express="Purchase.Qty*Purchase.Price" Format="type:currency;pfx:￥;.2" HiddenInput="False" ValueToDisplayText></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Left&nbsp;Align</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel8" runat="server" BorderStyle="None" BorderColor="Gainsboro" BorderWidth="1px" width="100%" Max="0" Min="0" Express="Purchase.Qty*Purchase.Price" Format="type:currency;pfx:￥;.2" HiddenInput="False" ValueToDisplayText></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Center&nbsp;Align</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel9" runat="server" TextAlign="Center" BorderStyle="None" BorderColor="Gainsboro" BorderWidth="1px" width="100%" Max="0" Min="0" Express="Purchase.Qty*Purchase.Price" Format="type:currency;pfx:￥;.2" HiddenInput="False" ValueToDisplayText></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel11" runat="server" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="数据带出" TextAlign="Center" Width="100%" BackColor="#C0FFFF" BorderStyle="Solid" BorderColor="Turquoise" BorderWidth="3px" Height="40px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td width="127" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Account(输入)</td>
                    <td width="423" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox3" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="account"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td width="127" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Name(带出)</td>
                    <td width="423" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel13" runat="server" BorderStyle="None" BorderColor="Gainsboro" BorderWidth="1px" Max="0" Min="0" Express="account" HiddenInput="False" ValueToDisplayText="TableName:BPMSysUsers;FilterColumn:Account;DisplayColumn:DisplayName" DataMap="Mobile->mobile;EMail->email"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td width="127" height="12" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Mobile(带出)</td>
                    <td width="423" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel14" runat="server" BorderStyle="None" BorderColor="Gainsboro" BorderWidth="1px" XDataBind="mobile" Max="0" Min="0" HiddenInput="False" ValueToDisplayText></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td width="127" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Email(带出)</td>
                    <td width="423" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel15" runat="server" BorderStyle="None" BorderColor="Gainsboro" BorderWidth="1px" XDataBind="email" Max="0" Min="0" HiddenInput="False" ValueToDisplayText></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel16" runat="server" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="Disable/Enable(Price==1)" TextAlign="Center" Width="100%" BackColor="#C0FFFF" BorderStyle="Solid" BorderColor="Turquoise" BorderWidth="3px" Height="40px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Disable</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel17" runat="server" BorderStyle="None" BorderColor="Gainsboro" BorderWidth="1px" Max="0" Min="0" Express="Purchase.Qty*Purchase.Price" Format="type:currency;pfx:￥;.2" HiddenInput="False" ValueToDisplayText DisableExpress="Purchase.Price==1"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel21" runat="server" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="Hidden/Show(Price==1)" TextAlign="Center" Width="100%" BackColor="#C0FFFF" BorderStyle="Solid" BorderColor="Turquoise" BorderWidth="3px" Height="40px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Hidden</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel22" runat="server" BorderStyle="None" BorderColor="Gainsboro" BorderWidth="1px" Max="0" Min="0" Express="Purchase.Qty*Purchase.Price" Format="type:currency;pfx:￥;.2" HiddenInput="False" ValueToDisplayText HiddenExpress="Purchase.Price==1"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel24" runat="server" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="大尺寸" TextAlign="Center" Width="100%" BackColor="#C0FFFF" BorderStyle="Solid" BorderColor="Turquoise" BorderWidth="3px" Height="40px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Label1</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel25" runat="server" BackColor="#C0FFC0" BorderStyle="Solid" BorderColor="DarkGray" BorderWidth="3px" Height="60px" width="100%" Max="0" Min="0" Express="Purchase.Qty*Purchase.Price" Format="type:currency;pfx:￥;.2" HiddenInput="False" ValueToDisplayText DisableExpress="Purchase.Price==1"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Label2</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel26" runat="server" TextAlign="Center" BackColor="#FFE0C0" BorderStyle="Solid" BorderColor="Brown" BorderWidth="3px" Height="60px" width="100%" Max="0" Min="0" Express="Purchase.Qty*Purchase.Price" Format="type:currency;pfx:￥;.2" HiddenInput="False" ValueToDisplayText DisableExpress="Purchase.Price==1" TextMode="MultiLine" Rows="6"></aspxform:XLabel>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Insert content here -->
    </form>
</body>
</html>
