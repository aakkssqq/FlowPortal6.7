<%@ Page Language="C#" %>
<%@ Register TagPrefix="aspxform" Namespace="XFormDesigner.Framework.Web.UI" Assembly="XFormDesigner.Framework" %>
<script runat="server">

    // Insert page code here
    //

</script>
<html xmlns:xform="xmlns:xform">
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
    <script type='text/javascript'>
    </script>
</head>
<body>
    <form runat="server">
        <table width="557" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td height="50" valign="middle" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <strong><font size="4">RadioButtonList</font></strong> 
                        <br />
                        <font size="1">xclass:YZSoft.Forms.Field.RadioButtonList</font> 
                    </td>
                </tr>
                <tr>
                    <td width="127" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Dept</td>
                    <td width="423" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox1" runat="server" BorderColor="Gainsboro" BorderWidth="1px" width="100%" Max="0" Min="0" XDataBind="Purchase.Dept" ValueToDisplayText HiddenInput="False"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Amount</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox2" runat="server" BorderColor="Gainsboro" BorderWidth="1px" width="100%" Max="0" Min="0" XDataBind="Purchase.Amount" ValueToDisplayText HiddenInput="False"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel1" runat="server" BorderColor="Turquoise" BorderWidth="3px" BorderStyle="Solid" BackColor="#C0FFFF" Height="40px" Width="100%" TextAlign="Center" text="排版、常规操作" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td height="32" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        2列排版</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XRadioButtonList id="XRadioButtonList1" runat="server" XDataBind="var1" Width="200px" RepeatColumns="2" RepeatDirection="Horizontal">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                            <asp:ListItem>CCC</asp:ListItem>
                            <asp:ListItem>DDD</asp:ListItem>
                        </aspxform:XRadioButtonList>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Value</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox3" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" Express="var1"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        横排</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XRadioButtonList id="XRadioButtonList3" runat="server" Width="100%" RepeatDirection="Horizontal" Express="var1">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                            <asp:ListItem>CCC</asp:ListItem>
                            <asp:ListItem>DDD</asp:ListItem>
                        </aspxform:XRadioButtonList>
                    </td>
                </tr>
                <tr>
                    <td height="32" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        竖排</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XRadioButtonList id="XRadioButtonList7" runat="server" Width="100%" Express="var1">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                            <asp:ListItem>CCC</asp:ListItem>
                            <asp:ListItem>DDD</asp:ListItem>
                        </aspxform:XRadioButtonList>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel2" runat="server" BorderColor="Turquoise" BorderWidth="3px" BorderStyle="Solid" BackColor="#C0FFFF" Height="40px" Width="100%" TextAlign="Center" text="Disable/Enable(Amount==1)" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Disable1</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XRadioButtonList id="XRadioButtonList4" runat="server" BorderColor="Red" BorderStyle="None" Width="200px" RepeatColumns="2" RepeatDirection="Horizontal" Express="var1" DisableExpress="Purchase.Amount==1">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                            <asp:ListItem>CCC</asp:ListItem>
                            <asp:ListItem>DDD</asp:ListItem>
                        </aspxform:XRadioButtonList>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Disable2</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XRadioButtonList id="XRadioButtonList6" runat="server" BorderColor="Red" BorderWidth="3px" BorderStyle="Solid" BackColor="#FFFFC0" Width="100%" RepeatColumns="2" RepeatDirection="Horizontal" Express="var1" DisableExpress="Purchase.Amount==1">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                            <asp:ListItem>CCC</asp:ListItem>
                            <asp:ListItem>DDD</asp:ListItem>
                        </aspxform:XRadioButtonList>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel3" runat="server" BorderColor="Turquoise" BorderWidth="3px" BorderStyle="Solid" BackColor="#C0FFFF" Height="40px" Width="100%" TextAlign="Center" text="Hidden/Show(Amount==1)" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Hidden</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XRadioButtonList id="XRadioButtonList5" runat="server" Width="200px" RepeatColumns="2" RepeatDirection="Horizontal" Express="var1" HiddenExpress="Purchase.Amount==1">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                            <asp:ListItem>CCC</asp:ListItem>
                            <asp:ListItem>DDD</asp:ListItem>
                        </aspxform:XRadioButtonList>
                    </td>
                </tr>
            </tbody>
        </table>
        <table width="557" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0" dynamicarea="2,1">
            <tbody>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel4" runat="server" BorderColor="Turquoise" BorderWidth="3px" BorderStyle="Solid" BackColor="#C0FFFF" Height="40px" Width="100%" TextAlign="Center" text="在Grid中" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td width="247" height="22" align="center" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="beige">
                        物品 
                    </td>
                    <td width="303" align="center" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        值 
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XRadioButtonList id="XRadioButtonList2" runat="server" BorderColor="Red" BorderWidth="3px" XDataBind="var11" BorderStyle="Solid" BackColor="#FFFFC0" Width="100%" RepeatColumns="2" RepeatDirection="Horizontal">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                            <asp:ListItem>CCC</asp:ListItem>
                            <asp:ListItem>DDD</asp:ListItem>
                        </aspxform:XRadioButtonList>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox6" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="PurchaseDetail.ItemDesc" TextAlign="Right" Express="var11"></aspxform:XTextBox>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Insert content here -->
    </form>
</body>
</html>
