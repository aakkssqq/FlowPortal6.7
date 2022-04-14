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
                        <strong><font size="4">RadioButton</font></strong>
                        <br />
                        <font size="1">xclass:YZSoft.Forms.Field.RadioButton</font> 
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
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        组</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XRadioButton id="XRadioButton5" runat="server" XDataBind="var2" GroupName="Group1" Value="AAA" Text="AAA"></aspxform:XRadioButton>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        组</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XRadioButton id="XRadioButton6" runat="server" XDataBind="var2" GroupName="Group1" Value="BBB" Text="BBB"></aspxform:XRadioButton>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        组</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XRadioButton id="XRadioButton7" runat="server" XDataBind="var2" GroupName="Group1" Value="CCC" Text="CCC"></aspxform:XRadioButton>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Value</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox4" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" Express="var2"></aspxform:XTextBox>
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
                        <aspxform:XRadioButton id="XRadioButton8" runat="server" GroupName="Group2" Value="AAA" Text="AAA" Express="var2" DisableExpress="Purchase.Amount==1"></aspxform:XRadioButton>
                        <aspxform:XRadioButton id="XRadioButton4" runat="server" GroupName="Group2" Value="BBB" Text="BBB" Express="var2" DisableExpress="Purchase.Amount==1"></aspxform:XRadioButton>
                        <aspxform:XRadioButton id="XRadioButton14" runat="server" GroupName="Group2" Value="CCC" Text="CCC" Express="var2" DisableExpress="Purchase.Amount==1"></aspxform:XRadioButton>
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
                        <aspxform:XRadioButton id="XRadioButton10" runat="server" GroupName="Group3" Value="AAA" Text="AAA" Express="var2" HiddenExpress="Purchase.Amount==1"></aspxform:XRadioButton>
                        <aspxform:XRadioButton id="XRadioButton1" runat="server" GroupName="Group3" Value="BBB" Text="BBB" Express="var2" HiddenExpress="Purchase.Amount==1"></aspxform:XRadioButton>
                        <aspxform:XRadioButton id="XRadioButton3" runat="server" GroupName="Group3" Value="CCC" Text="CCC" Express="var2" HiddenExpress="Purchase.Amount==1"></aspxform:XRadioButton>
                    </td>
                </tr>
            </tbody>
        </table>
        <table width="557" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0" dynamicarea="2,1">
            <tbody>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="4">
                        <aspxform:XLabel id="XLabel4" runat="server" BorderColor="Turquoise" BorderWidth="3px" BorderStyle="Solid" BackColor="#C0FFFF" Height="40px" Width="100%" TextAlign="Center" text="在Grid中" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td width="95" height="22" align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="beige">
                        选项 
                    </td>
                    <td width="94" align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        选项 
                    </td>
                    <td width="94" align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        选项 
                    </td>
                    <td width="262" align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        值 
                    </td>
                </tr>
                <tr>
                    <td align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XRadioButton id="XRadioButton12" runat="server" XDataBind="var12" GroupName="Group11" Value="AAA" Text="AAA" Express="var2" DisableExpress="Purchase.Amount==1" HiddenExpress="Purchase.Amount==112233"></aspxform:XRadioButton>
                    </td>
                    <td align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XRadioButton id="XRadioButton11" runat="server" XDataBind="var12" GroupName="Group11" Value="BBB" Text="BBB" Express="var2" DisableExpress="Purchase.Amount==1" HiddenExpress="Purchase.Amount==112233"></aspxform:XRadioButton>
                    </td>
                    <td align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XRadioButton id="XRadioButton13" runat="server" XDataBind="var12" GroupName="Group11" Value="CCC" Text="CCC" Express="var2" DisableExpress="Purchase.Amount==1" HiddenExpress="Purchase.Amount==112233"></aspxform:XRadioButton>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox6" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="PurchaseDetail.ItemDesc" TextAlign="Right" Express="var12"></aspxform:XTextBox>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Insert content here -->
    </form>
</body>
</html>