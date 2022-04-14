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
                        <strong><font size="4">CheckBoxList</font></strong> 
                        <br />
                        <font size="1">xclass:YZSoft.Forms.Field.CheckBoxList</font> 
                    </td>
                </tr>
                <tr>
                    <td width="127" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Dept</td>
                    <td width="423" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox1" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="Purchase.Dept" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Amount</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox2" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="Purchase.Amount" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel1" runat="server" BorderWidth="3px" BorderColor="Turquoise" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="排版、常规操作" TextAlign="Center" Width="100%" Height="40px" BackColor="#C0FFFF" BorderStyle="Solid"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td height="32" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        2列排版</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XCheckBoxList id="XCheckBoxList1" runat="server" XDataBind="var1" Width="200px" RepeatDirection="Horizontal" RepeatColumns="2">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                            <asp:ListItem>CCC</asp:ListItem>
                            <asp:ListItem>DDD</asp:ListItem>
                        </aspxform:XCheckBoxList>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Value</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox3" runat="server" width="100%" BorderWidth="1" BorderColor="#DCDCDC" Express="var1"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        横排</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XCheckBoxList id="XCheckBoxList3" runat="server" Width="100%" RepeatDirection="Horizontal" Express="var1">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                            <asp:ListItem>CCC</asp:ListItem>
                            <asp:ListItem>DDD</asp:ListItem>
                        </aspxform:XCheckBoxList>
                    </td>
                </tr>
                <tr>
                    <td height="32" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        竖排</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XCheckBoxList id="XCheckBoxList7" runat="server" Width="100%" Express="var1">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                            <asp:ListItem>CCC</asp:ListItem>
                            <asp:ListItem>DDD</asp:ListItem>
                        </aspxform:XCheckBoxList>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel2" runat="server" BorderWidth="3px" BorderColor="Turquoise" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="Disable/Enable(Amount==1)" TextAlign="Center" Width="100%" Height="40px" BackColor="#C0FFFF" BorderStyle="Solid"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Disable1</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XCheckBoxList id="XCheckBoxList4" runat="server" BorderColor="Red" Width="200px" BorderStyle="None" RepeatDirection="Horizontal" RepeatColumns="2" Express="var1" DisableExpress="Purchase.Amount==1">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                            <asp:ListItem>CCC</asp:ListItem>
                            <asp:ListItem>DDD</asp:ListItem>
                        </aspxform:XCheckBoxList>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Disable2</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XCheckBoxList id="XCheckBoxList6" runat="server" BorderWidth="3px" BorderColor="Red" Width="100%" BackColor="#FFFFC0" BorderStyle="Solid" RepeatDirection="Horizontal" RepeatColumns="2" Express="var1" DisableExpress="Purchase.Amount==1">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                            <asp:ListItem>CCC</asp:ListItem>
                            <asp:ListItem>DDD</asp:ListItem>
                        </aspxform:XCheckBoxList>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel3" runat="server" BorderWidth="3px" BorderColor="Turquoise" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="Hidden/Show(Amount==1)" TextAlign="Center" Width="100%" Height="40px" BackColor="#C0FFFF" BorderStyle="Solid"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Hidden</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XCheckBoxList id="XCheckBoxList5" runat="server" Width="200px" RepeatDirection="Horizontal" RepeatColumns="2" Express="var1" HiddenExpress="Purchase.Amount==1">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                            <asp:ListItem>CCC</asp:ListItem>
                            <asp:ListItem>DDD</asp:ListItem>
                        </aspxform:XCheckBoxList>
                    </td>
                </tr>
            </tbody>
        </table>
        <table width="557" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0" dynamicarea="2,1">
            <tbody>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel4" runat="server" BorderWidth="3px" BorderColor="Turquoise" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="在Grid中" TextAlign="Center" Width="100%" Height="40px" BackColor="#C0FFFF" BorderStyle="Solid"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td width="247" height="22" align="center" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="beige">
                        物品 
                    </td>
                    <td width="303" align="right" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        值 
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XCheckBoxList id="XCheckBoxList2" runat="server" XDataBind="var11" BorderWidth="3px" BorderColor="Red" Width="100%" BackColor="#FFFFC0" BorderStyle="Solid" RepeatDirection="Horizontal" RepeatColumns="2">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                            <asp:ListItem>CCC</asp:ListItem>
                            <asp:ListItem>DDD</asp:ListItem>
                        </aspxform:XCheckBoxList>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox6" runat="server" XDataBind="PurchaseDetail.ItemDesc" width="100%" BorderWidth="1" BorderColor="#DCDCDC" TextAlign="Right" Express="var11"></aspxform:XTextBox>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Insert content here -->
    </form>
</body>
</html>
