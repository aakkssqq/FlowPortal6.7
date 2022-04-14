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
                    <td width="275" height="53" valign="middle" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: medium none; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <strong><font size="4">PrintButton</font></strong>
                        <br />
                        <font size="1">xclass:YZSoft.Forms.Field.PrintButton</font> 
                    </td>
                    <td width="276" valign="top" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <div align="right">
                            <aspxform:XPrintButton id="XPrintButton1" runat="server" PrintOut="False"></aspxform:XPrintButton>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XLabel id="XLabel1" runat="server" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="以下控件打印" TextAlign="Center" Width="100%" BackColor="#C0FFFF" BorderStyle="Solid" BorderColor="Turquoise" BorderWidth="3px" Height="40px"></aspxform:XLabel>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel2" runat="server" PrintOut="False" Font-Size="12px" Font-Bold="True" ForeColor="Black" text="以下控件不打印" TextAlign="Center" Width="100%" BackColor="#C0FFFF" BorderStyle="Solid" BorderColor="Turquoise" BorderWidth="3px" Height="40px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XLabel id="XLabel3" runat="server" text="Print Column"></aspxform:XLabel>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel4" runat="server" PrintOut="False" text="No Print Column"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XTextBox id="XTextBox1" runat="server" TextAlign="Right" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="var1" Format="type:currency;pfx:￥;.2">￥123.45</aspxform:XTextBox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox2" runat="server" PrintOut="False" TextAlign="Right" BorderColor="#DCDCDC" BorderWidth="1" width="100%" Format="type:currency;pfx:￥;.2" Express="var1"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XDateTimePicker id="XDateTimePicker1" runat="server" Width="100%" BorderColor="#DCDCDC" BorderWidth="1" XDataBind="var2"></aspxform:XDateTimePicker>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDateTimePicker id="XDateTimePicker2" runat="server" PrintOut="False" Width="100%" BorderColor="#DCDCDC" BorderWidth="1" Express="var2"></aspxform:XDateTimePicker>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XCheckBox id="XCheckBox1" runat="server" XDataBind="var3" Text="CheckBox"></aspxform:XCheckBox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XCheckBox id="XCheckBox2" runat="server" PrintOut="False" Express="var3" Text="CheckBox"></aspxform:XCheckBox>
                    </td>
                </tr>
                <tr>
                    <td height="43" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XCheckBoxList id="XCheckBoxList1" runat="server" XDataBind="var4">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                        </aspxform:XCheckBoxList>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XCheckBoxList id="XCheckBoxList2" runat="server" PrintOut="False" Express="var4">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                        </aspxform:XCheckBoxList>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XRadioButton id="XRadioButton1" runat="server" Width="100%" XDataBind="var5" Text="RadioButton" GroupName="AAA" Value="A"></aspxform:XRadioButton>
                        <aspxform:XRadioButton id="XRadioButton3" runat="server" Width="100%" XDataBind="var5" Text="RadioButton" GroupName="AAA" Value="B"></aspxform:XRadioButton>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XRadioButton id="XRadioButton2" runat="server" PrintOut="False" Width="100%" Express="var5" Text="RadioButton" GroupName="BBB" Value="A"></aspxform:XRadioButton>
                        <aspxform:XRadioButton id="XRadioButton4" runat="server" PrintOut="False" Width="100%" Express="var5" Text="RadioButton" GroupName="BBB" Value="B"></aspxform:XRadioButton>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XRadioButtonList id="XRadioButtonList1" runat="server" XDataBind="var6">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                        </aspxform:XRadioButtonList>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XRadioButtonList id="XRadioButtonList2" runat="server" PrintOut="False" Express="var6">
                            <asp:ListItem>AAA</asp:ListItem>
                            <asp:ListItem>BBB</asp:ListItem>
                        </aspxform:XRadioButtonList>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XDropDownList id="XDropDownList2" runat="server" Width="100%" XDataBind="var7" DisplayColumn="OUName" ValueColumn="OUID" XDataSource="TableName:BPMSysOUs" PromptText="--部门--"></aspxform:XDropDownList>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDropDownList id="XDropDownList3" runat="server" PrintOut="False" Width="100%" Express="var7" DisplayColumn="OUName" ValueColumn="OUID" XDataSource="TableName:BPMSysOUs" PromptText="--部门--"></aspxform:XDropDownList>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XListBox id="XListBox1" runat="server" Width="100%" XDataBind="var8" DisplayColumn="OUName" ValueColumn="OUID" XDataSource="TableName:BPMSysOUs" PromptText="--部门--"></aspxform:XListBox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XListBox id="XListBox2" runat="server" PrintOut="False" Width="100%" Express="var8" DisplayColumn="OUName" ValueColumn="OUID" XDataSource="TableName:BPMSysOUs" PromptText="--部门--"></aspxform:XListBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XAttachments id="XAttachments1" runat="server" width="100%" XDataBind="var9" FileTypesDescription="Word,Excel" FileTypes="*.doc;*.docx;*.xls;*.xlsx" RepeatDirection="Horizontal"></aspxform:XAttachments>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XAttachments id="XAttachments2" runat="server" PrintOut="False" width="100%" Express="var9" FileTypesDescription="Word,Excel" FileTypes="*.doc;*.docx;*.xls;*.xlsx" RepeatDirection="Horizontal"></aspxform:XAttachments>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XImageAttachment id="XImageAttachment1" runat="server" Width="112px" BorderStyle="Solid" BorderColor="Gainsboro" BorderWidth="3px" Height="128px" XDataBind="var10"></aspxform:XImageAttachment>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XImageAttachment id="XImageAttachment2" runat="server" PrintOut="False" Width="112px" BorderStyle="Solid" BorderColor="Gainsboro" BorderWidth="3px" Height="128px" Express="var10"></aspxform:XImageAttachment>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: medium none; BORDER-LEFT: black 1px solid">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink1" runat="server"></aspxform:XHistoryFormLink>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink2" runat="server" PrintOut="False">历史表单</aspxform:XHistoryFormLink>
                    </td>
                </tr>
                <tr>
                </tr>
                <tr>
                    <td style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XChildFormLink id="XChildFormLink1" runat="server"></aspxform:XChildFormLink>
                    </td>
                    <td style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XChildFormLink id="XChildFormLink2" runat="server" PrintOut="False">子表单</aspxform:XChildFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XDataBrowserButton id="XDataBrowserButton1" runat="server" Text="开窗查询"></aspxform:XDataBrowserButton>
                        <aspxform:XSelectUserButton id="XSelectUserButton1" runat="server" Text="选择用户"></aspxform:XSelectUserButton>
                        <aspxform:XSelectOUButton id="XSelectOUButton1" runat="server" Text="选择部门"></aspxform:XSelectOUButton>
                        <aspxform:XCustomBrowserButton id="XCustomBrowserButton1" runat="server" XClass="Demo.CustomDataBrowserButton.SelectProcessButton" Text="按钮"></aspxform:XCustomBrowserButton>
                        <aspxform:XExcelDataImportButton id="XExcelDataImportButton1" runat="server" text="Excel导入" Width="60px"></aspxform:XExcelDataImportButton>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDataBrowserButton id="XDataBrowserButton2" runat="server" PrintOut="False" Text="开窗查询"></aspxform:XDataBrowserButton>
                        <aspxform:XSelectUserButton id="XSelectUserButton2" runat="server" PrintOut="False" Text="选择用户"></aspxform:XSelectUserButton>
                        <aspxform:XSelectOUButton id="XSelectOUButton2" runat="server" PrintOut="False" Text="选择部门"></aspxform:XSelectOUButton>
                        <aspxform:XCustomBrowserButton id="XCustomBrowserButton2" runat="server" PrintOut="False" XClass="Demo.CustomDataBrowserButton.SelectProcessButton" Text="按钮"></aspxform:XCustomBrowserButton>
                        <aspxform:XExcelDataImportButton id="XExcelDataImportButton2" runat="server" PrintOut="False" text="Excel导入" Width="60px"></aspxform:XExcelDataImportButton>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: medium none; BORDER-LEFT: black 1px solid">
                        <aspxform:XHyperLink id="XHyperLink1" runat="server" Target="_blank">HyperLink</aspxform:XHyperLink>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none">
                        <aspxform:XHyperLink id="XHyperLink2" runat="server" PrintOut="False" Target="_blank">HyperLink</aspxform:XHyperLink>
                    </td>
                </tr>
            </tbody>
        </table>
        <table width="557" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0" dynamicarea="1,1">
            <tbody>
                <tr>
                    <td width="24" height="20" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="beige">
                    </td>
                    <td width="197" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        物品 
                    </td>
                    <td width="117" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        单价 
                    </td>
                    <td width="104" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        数量 
                    </td>
                    <td width="98" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        合计 
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XGridLineNo id="XGridLineNo1" runat="server" TextAlign="Center" Width="100%" BorderStyle="None" BorderWidth="1" Height="100%">1</aspxform:XGridLineNo>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XDropDownList id="XDropDownList1" runat="server" Width="100%" Height="100%" XDataBind="PurchaseDetail.ItemCode" DisplayColumn="Name" ValueColumn="ProdCode" XDataSource="TableName:iDemoProduct" DataMap="Price->PurchaseDetail.Price"></aspxform:XDropDownList>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox3" runat="server" TextAlign="Right" BorderColor="#DCDCDC" BorderWidth="1" Height="100%" width="100%" XDataBind="PurchaseDetail.Price" Format="type:currency;pfx:￥;.2"></aspxform:XTextBox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox4" runat="server" TextAlign="Right" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="PurchaseDetail.Qty"></aspxform:XTextBox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox5" runat="server" TextAlign="Right" BorderColor="#DCDCDC" BorderWidth="1" width="100%" XDataBind="PurchaseDetail.SubTotal" Format="type:currency;pfx:￥;.2" Express="PurchaseDetail.Price*PurchaseDetail.Qty"></aspxform:XTextBox>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Insert content here -->
    </form>
</body>
</html>
