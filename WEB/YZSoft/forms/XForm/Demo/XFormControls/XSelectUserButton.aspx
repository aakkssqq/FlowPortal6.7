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
                    <td height="53" valign="middle" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <strong><font size="4">SelectUserButton</font></strong>
                        <br />
                        <font size="1">xclass:YZSoft.Forms.Field.SelectUserButton</font> 
                    </td>
                </tr>
                <tr>
                    <td width="127" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Dept</td>
                    <td width="423" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox11" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="Purchase.Dept" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Amount</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox12" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="Purchase.Amount" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel5" runat="server" BorderWidth="3px" BorderColor="Turquoise" Height="40px" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="选择部门、带出信息" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td width="124" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Account</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox1" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="account" Min="0" Max="0" width="200px" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                        <aspxform:XSelectUserButton id="XSelectUserButton1" runat="server" Width="21px" DataMap="Account->account;MemberFullName->memberfullname;Birthday->birthday;Mobile->mobile;DisplayName->displayname;LeaderTitle->title;EMail->email;HRID->hrid;NameSpell->ext2;Age->ext1"></aspxform:XSelectUserButton>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        MemberFullName</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox14" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="memberfullname" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Job Title</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox15" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="title" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        DisplayName</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox2" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="displayname" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        HRID</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox6" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="hrid" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Mobile</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox7" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="mobile" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        EMail</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox13" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="email" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Birthday</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker1" runat="server" XDataBind="birthday" BorderWidth="1" BorderColor="#DCDCDC" Width="100%" DisplayOnly="True"></aspxform:XDateTimePicker>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        扩展属性1</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox8" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="ext1" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        扩展属性2</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox9" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="ext2" Min="0" Max="0" width="100%" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel1" runat="server" BorderWidth="3px" BorderColor="Turquoise" Height="40px" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="Disable/Enable(Amount==1)" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td width="124" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Disable</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XSelectUserButton id="XSelectUserButton3" runat="server" Width="21px" DisableExpress="Purchase.Amount==1"></aspxform:XSelectUserButton>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel2" runat="server" BorderWidth="3px" BorderColor="Turquoise" Height="40px" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="Hidden/Show(Disable/Enable(Amount==1)" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td width="124" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: medium none; BORDER-LEFT: black 1px solid">
                        Hidden</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none">
                        <aspxform:XSelectUserButton id="XSelectUserButton4" runat="server" Width="21px" HiddenExpress="Purchase.Amount==1"></aspxform:XSelectUserButton>
                    </td>
                </tr>
            </tbody>
        </table>
        <table width="557" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0" dynamicarea="2,1">
            <tbody>
                <tr>
                    <td align="right" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="5">
                        <aspxform:XSelectUserButton id="XSelectUserButton5" runat="server" Width="160px" DataMap="Account->account1;DisplayName->name1;LeaderTitle->title1;Mobile->PurchaseDetail.ItemName" MultiSelect="True" UseSubmitBehavior="False" Text="批量选择用户(Append)"></aspxform:XSelectUserButton>
                        <aspxform:XSelectUserButton id="XSelectUserButton6" runat="server" Width="160px" DataMap="Account->account1;DisplayName->name1;LeaderTitle->title1;Mobile->PurchaseDetail.ItemName" MultiSelect="True" UseSubmitBehavior="False" Text="批量选择用户(Reset)" AppendMode="ClearAndAppend"></aspxform:XSelectUserButton>
                    </td>
                </tr>
                <tr>
                    <td width="23" height="20" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="beige">
                    </td>
                    <td width="162" align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        Account 
                    </td>
                    <td width="142" align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        Name 
                    </td>
                    <td width="116" align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        Job Title 
                    </td>
                    <td width="99" align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        Mobile 
                    </td>
                </tr>
                <tr>
                    <td height="20" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XGridLineNo id="XGridLineNo1" runat="server" BorderWidth="1" Height="100%" BorderStyle="None" Width="100%" TextAlign="Center">1</aspxform:XGridLineNo>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox3" runat="server" HiddenInput="False" ValueToDisplayText XDataBind="account1" Min="0" Max="0" width="130px" BorderWidth="1px" BorderColor="Gainsboro"></aspxform:XTextBox>
                        <aspxform:XSelectUserButton id="XSelectUserButton2" runat="server" Width="21px" DataMap="Account->account1;DisplayName->name1;LeaderTitle->title1;Mobile->PurchaseDetail.ItemName"></aspxform:XSelectUserButton>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox4" runat="server" XDataBind="name1" width="100%" BorderWidth="1" BorderColor="#DCDCDC"></aspxform:XTextBox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox10" runat="server" XDataBind="title1" width="100%" BorderWidth="1" BorderColor="#DCDCDC"></aspxform:XTextBox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox5" runat="server" XDataBind="PurchaseDetail.ItemName" width="100%" BorderWidth="1" BorderColor="#DCDCDC"></aspxform:XTextBox>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Insert content here -->
    </form>
</body>
</html>
