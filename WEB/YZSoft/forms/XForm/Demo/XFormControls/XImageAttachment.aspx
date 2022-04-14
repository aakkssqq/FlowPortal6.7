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
        function aaa(dept, amount) {
            var url = Ext.urlAppend(YZSoft.$url('YZSoft/Attachment/Download.ashx'), Ext.urlEncode({
                method:'GetHeadshot',
                account: dept
            }));

            return {
                src:url
            };
        }
    </script>
</head>
<body>
    <form id="Form1" runat="server">
        <table width="557" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td height="50" valign="middle" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <strong><font size="4">ImageAttachment</font></strong> 
                        <br />
                        <font size="1">xclass:YZSoft.Forms.Field.ImageAttachment</font> 
                    </td>
                </tr>
                <tr>
                    <td width="127" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Account</td>
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
                        <aspxform:XLabel id="XLabel1" runat="server" BorderWidth="3px" BorderColor="Turquoise" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="尺寸固定&amp;特定文件类型&amp;文件大小限定/AutoScale" TextAlign="Center" Width="100%" Height="40px" BackColor="#C0FFFF" BorderStyle="Solid"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Image1(&lt;1MB)</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XImageAttachment id="XImageAttachment1" runat="server" XDataBind="var1" BorderWidth="3px" BorderColor="Gainsboro" Width="112px" Height="128px" BorderStyle="Solid" MaximumFileSize="1MB"></aspxform:XImageAttachment>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel2" runat="server" BorderWidth="3px" BorderColor="Turquoise" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="自适应图片大小/NoScale" TextAlign="Center" Width="100%" Height="40px" BackColor="#C0FFFF" BorderStyle="Solid"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Image2</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XImageAttachment id="XImageAttachment2" runat="server" BorderWidth="3px" BorderColor="Gainsboro" Width="112px" Height="128px" BorderStyle="Solid" ImageDisplayStyle="NoScale"></aspxform:XImageAttachment>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel3" runat="server" BorderWidth="3px" BorderColor="Turquoise" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="Disable/Enable(Amount==1)" TextAlign="Center" Width="100%" Height="40px" BackColor="#C0FFFF" BorderStyle="Solid"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Disable</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XImageAttachment id="XImageAttachment3" runat="server" BorderWidth="3px" BorderColor="Gainsboro" Width="112px" Height="128px" BorderStyle="Solid" Express="var1" DisableExpress="Purchase.Amount==1"></aspxform:XImageAttachment>
                        <aspxform:XImageAttachment id="XImageAttachment4" runat="server" BorderWidth="3px" BorderColor="Tomato" Width="112px" Height="128px" BorderStyle="Solid" Express="var1" DisableExpress="Purchase.Amount==1"></aspxform:XImageAttachment>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel4" runat="server" BorderWidth="3px" BorderColor="Turquoise" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="Hidden/Show(Amount==1)" TextAlign="Center" Width="100%" Height="40px" BackColor="#C0FFFF" BorderStyle="Solid"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td height="20" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Hidden</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XImageAttachment id="XImageAttachment5" runat="server" BorderWidth="3px" BorderColor="Gainsboro" Width="112px" Height="128px" BorderStyle="Solid" HiddenExpress="Purchase.Amount==1"></aspxform:XImageAttachment>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel5" runat="server" BorderWidth="3px" BorderColor="Turquoise" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="Express" TextAlign="Center" Width="100%" Height="40px" BackColor="#C0FFFF" BorderStyle="Solid"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Same as Image1</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XImageAttachment id="XImageAttachment6" runat="server" BorderWidth="3px" BorderColor="Gainsboro" Width="112px" Height="128px" BorderStyle="Solid" Express="var1"></aspxform:XImageAttachment>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Profile photo of<br />
                        account 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XImageAttachment id="XImageAttachment7" runat="server" BorderWidth="3px" BorderColor="Gainsboro" Width="250px" Height="300px" BorderStyle="Solid" MaximumFileSize Express="javascript('aaa',Purchase.Dept,Purchase.Amount)" Enabled="False"></aspxform:XImageAttachment>
                        <aspxform:XImageAttachment id="XImageAttachment8" runat="server" BorderWidth="3px" BorderColor="Gainsboro" Width="112px" Height="128px" BorderStyle="Solid" MaximumFileSize Express="javascript('aaa',Purchase.Dept,Purchase.Amount)" Enabled="False"></aspxform:XImageAttachment>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Insert content here -->
    </form>
</body>
</html>
