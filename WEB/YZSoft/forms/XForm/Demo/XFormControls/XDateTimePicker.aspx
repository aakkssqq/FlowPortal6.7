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
                        <strong><font size="4">DateTimePicker</font></strong>
                        <br />
                        <font size="1">xclass:YZSoft.Forms.Field.DateTimePicker</font> 
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
                        <aspxform:XLabel id="XLabel1" runat="server" BorderColor="Turquoise" BorderWidth="3px" BorderStyle="Solid" BackColor="#C0FFFF" Height="40px" Width="100%" TextAlign="Center" text="输入类型/Type" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Date</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker2" runat="server" BorderColor="Gainsboro" BorderWidth="1px" XDataBind="var1" Width="215px"></aspxform:XDateTimePicker>
                        <aspxform:XTextBox id="XTextBox3" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="200px" Express="var1"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Date/Hour</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker3" runat="server" BorderColor="Gainsboro" BorderWidth="1px" XDataBind="var2" Width="215px" Type="TimeHour"></aspxform:XDateTimePicker>
                        <aspxform:XTextBox id="XTextBox4" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="200px" Express="var2"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Date/Minutes30</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker4" runat="server" BorderColor="Gainsboro" BorderWidth="1px" XDataBind="var3" Width="215px" Type="TimeMinutes30"></aspxform:XDateTimePicker>
                        <aspxform:XTextBox id="XTextBox5" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="200px" Express="var3"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Date/Minutes</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker5" runat="server" BorderColor="Gainsboro" BorderWidth="1px" XDataBind="var4" Width="215px" Type="TimeMinutes"></aspxform:XDateTimePicker>
                        <aspxform:XTextBox id="XTextBox6" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="200px" Express="var4"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel5" runat="server" BorderColor="Turquoise" BorderWidth="3px" BorderStyle="Solid" BackColor="#C0FFFF" Height="40px" Width="100%" TextAlign="Center" text="显示类型(依上面最后一个输入项变动)" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Display(日期)</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker1" runat="server" BorderColor="Gainsboro" BorderWidth="1px" Width="100%" Express="var4" DisplayOnly="True"></aspxform:XDateTimePicker>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Display(分钟)</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker8" runat="server" BorderColor="Gainsboro" BorderWidth="1px" Width="100%" Type="TimeMinutes" Express="var4" DisplayOnly="True"></aspxform:XDateTimePicker>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Display(15分钟)</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker9" runat="server" BorderColor="Gainsboro" BorderWidth="1px" Width="100%" Type="TimeMinutes15" Express="var4" DisplayOnly="True"></aspxform:XDateTimePicker>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Display(30分钟)</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker10" runat="server" BorderColor="Gainsboro" BorderWidth="1px" Width="100%" Type="TimeMinutes30" Express="var4" DisplayOnly="True"></aspxform:XDateTimePicker>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Display(小时)</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker11" runat="server" BorderColor="Gainsboro" BorderWidth="1px" Width="100%" Type="TimeHour" Express="var4" DisplayOnly="True"></aspxform:XDateTimePicker>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel2" runat="server" BorderColor="Turquoise" BorderWidth="3px" BorderStyle="Solid" BackColor="#C0FFFF" Height="40px" Width="100%" TextAlign="Center" text="Disable/Enable(Amount==1)" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Date</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker12" runat="server" BorderColor="Gainsboro" BorderWidth="1px" Width="100%" Express="var4" DisableExpress="Purchase.Amount==1"></aspxform:XDateTimePicker>
                    </td>
                </tr>
                <tr>
                    <td height="19" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Date/Hour</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker13" runat="server" BorderColor="Gainsboro" BorderWidth="1px" Width="100%" Type="TimeHour" Express="var4" DisableExpress="Purchase.Amount==1"></aspxform:XDateTimePicker>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Date/Minutes</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker15" runat="server" BorderColor="Gainsboro" BorderWidth="1px" Width="100%" Type="TimeMinutes" Express="var4" DisableExpress="Purchase.Amount==1"></aspxform:XDateTimePicker>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel3" runat="server" BorderColor="Turquoise" BorderWidth="3px" BorderStyle="Solid" BackColor="#C0FFFF" Height="40px" Width="100%" TextAlign="Center" text="Hidden/Show(Amount==1)" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td height="20" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Hidden</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker14" runat="server" BorderColor="Gainsboro" BorderWidth="1px" Width="100%" Type="TimeMinutes" Express="var4" HiddenExpress="Purchase.Amount==1"></aspxform:XDateTimePicker>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel4" runat="server" BorderColor="Turquoise" BorderWidth="3px" BorderStyle="Solid" BackColor="#C0FFFF" Height="40px" Width="100%" TextAlign="Center" text="大尺寸" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Date/Minutes30</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker6" runat="server" BorderColor="DarkGray" BorderWidth="3px" BackColor="#C0FFC0" Height="60px" Width="100%" Type="TimeMinutes30"></aspxform:XDateTimePicker>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Date/Minutes</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker7" runat="server" BorderColor="Brown" BorderWidth="3px" BackColor="#FFE0C0" Height="60px" Width="100%" Type="TimeMinutes"></aspxform:XDateTimePicker>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Insert content here -->
    </form>
</body>
</html>
