<%@ Page Language="C#" %>
<%@ Register TagPrefix="aspxform" Namespace="XFormDesigner.Framework.Web.UI" Assembly="XFormDesigner.Framework" %>
<script runat="server">

    // Insert page code here
    //

</script>
<html xmlns:xform="xmlns:xform">
<head id="Head1" runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
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
                        <strong><font size="4">ExcelDataImportButton</font></strong>
                        <br />
                        <font size="1">xclass:YZSoft.Forms.Field.ExcelDataImportButton</font> 
                    </td>
                </tr>
                <tr>
                    <td width="127" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Dept</td>
                    <td width="423" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox11" runat="server" BorderColor="Gainsboro" BorderWidth="1px" width="100%" Max="0" Min="0" XDataBind="Purchase.Dept" ValueToDisplayText HiddenInput="False"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Amount</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox12" runat="server" BorderColor="Gainsboro" BorderWidth="1px" width="100%" Max="0" Min="0" XDataBind="Purchase.Amount" ValueToDisplayText HiddenInput="False"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel1" runat="server" BorderColor="Turquoise" BorderWidth="3px" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="Disable/Enable(Amount==1)" TextAlign="Center" Width="100%" BackColor="#C0FFFF" BorderStyle="Solid" Height="40px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td width="124" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Disable</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XExcelDataImportButton id="XExcelDataImportButton3" runat="server" text="Import" Width="60px" DisableExpress="Purchase.Amount==1"></aspxform:XExcelDataImportButton>
                        <aspxform:XExcelDataImportButton id="XExcelDataImportButton5" runat="server" text="Import" Width="60px" DisableExpress="Purchase.Amount==1" PopupWndHeight="400" PopupWndWidth="300"></aspxform:XExcelDataImportButton>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel2" runat="server" BorderColor="Turquoise" BorderWidth="3px" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="Hidden/Show(Disable/Enable(Amount==1)" TextAlign="Center" Width="100%" BackColor="#C0FFFF" BorderStyle="Solid" Height="40px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td width="124" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: medium none; BORDER-LEFT: black 1px solid">
                        Hidden</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none">
                        <aspxform:XExcelDataImportButton id="XExcelDataImportButton2" runat="server" text="Import" Width="60px" HiddenExpress="Purchase.Amount==1"></aspxform:XExcelDataImportButton>
                    </td>
                </tr>
            </tbody>
        </table>
        <table width="557" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0" dynamicarea="2,1">
            <tbody>
                <tr>
                    <td align="right" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="6">
                        <aspxform:XExcelDataImportButton id="XExcelDataImportButton1" runat="server" text="从Excel文件导入数据(Append)" Width="200px" DataMap="A->PurchaseDetail.ItemName;B->PurchaseDetail.ShipDate;C->PurchaseDetail.Price;D->PurchaseDetail.Qty"></aspxform:XExcelDataImportButton>
                        <aspxform:XExcelDataImportButton id="XExcelDataImportButton4" runat="server" text="从Excel文件导入数据(Clear)" Width="200px" DataMap="A->PurchaseDetail.ItemName;B->PurchaseDetail.ShipDate;C->PurchaseDetail.Price;D->PurchaseDetail.Qty" AppendMode="ClearAndAppend"></aspxform:XExcelDataImportButton>
                    </td>
                </tr>
                <tr>
                    <td width="23" height="20" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="beige">
                    </td>
                    <td width="105" align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        Product 
                    </td>
                    <td width="124" align="center" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        Date 
                    </td>
                    <td width="102" align="right" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        Price 
                    </td>
                    <td width="84" align="right" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        Qty 
                    </td>
                    <td width="99" align="right" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        SubTotal 
                    </td>
                </tr>
                <tr>
                    <td height="20" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XGridLineNo id="XGridLineNo1" runat="server" BorderWidth="1" TextAlign="Center" Width="100%" BorderStyle="None" Height="100%">1</aspxform:XGridLineNo>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox3" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="PurchaseDetail.ItemName"></aspxform:XTextBox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker2" runat="server" BorderColor="#DCDCDC" BorderWidth="1" XDataBind="PurchaseDetail.ShipDate" Width="100%"></aspxform:XDateTimePicker>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox4" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="PurchaseDetail.Price" TextAlign="Right" Format="type:currency;pfx:￥;.2"></aspxform:XTextBox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox10" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="PurchaseDetail.Qty" TextAlign="Right"></aspxform:XTextBox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox5" runat="server" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="PurchaseDetail.SubTotal" TextAlign="Right" Format="type:currency;pfx:￥;.2" Express="PurchaseDetail.Price*PurchaseDetail.Qty"></aspxform:XTextBox>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Insert content here -->
    </form>
</body>
</html>
