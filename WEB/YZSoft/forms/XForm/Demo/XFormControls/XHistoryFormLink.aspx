<%@ Page Language="C#" %>
<%@ Register TagPrefix="aspxform" Namespace="XFormDesigner.Framework.Web.UI" Assembly="XFormDesigner.Framework" %>
<script runat="server">

    // Insert page code here
    //
    
    void Page_Load(object sender, EventArgs e) {
        this.XHistoryFormLink2.Value = "115";
    }

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
        function aaa(taskid){
            return {
                taskid:taskid,
                text:'点击打开采购申请单...'
            };
        }
    </script>
</head>
<body>
    <form id="Form1" runat="server">
        <table width="557" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td height="53" valign="middle" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="3">
                        <strong><font size="4">XHistoryFormLink</font></strong> 
                        <br />
                        <font size="1">xclass:YZSoft.Forms.Field.XHistoryFormLink</font> 
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="3">
                        <aspxform:XLabel id="XLabel5" runat="server" Height="40px" BorderWidth="3px" BorderColor="Turquoise" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="选择已核准的采购申请单生成采购订单" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td width="125" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Amount</td>
                    <td width="321" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox1" runat="server" BorderWidth="1px" BorderColor="Gainsboro" TextAlign="Right" XDataBind="Purchase.Amount" width="190px" Format="type:currency;pfx:￥;.2" Express="sum(PurchaseDetail.SubTotal)" Max="0" Min="0" ValueToDisplayText HiddenInput="False"></aspxform:XTextBox>
                        <aspxform:XDataBrowserButton id="XDataBrowserButton1" runat="server" Width="120px" XDataSource="TableName:Purchase" DataMap="TaskID->var1;Reason->Purchase.Reason;Amount->Purchase.Amount" Text="选择采购申请单"></aspxform:XDataBrowserButton>
                    </td>
                    <td width="101" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <div align="center">
                            <aspxform:XHistoryFormLink id="XHistoryFormLink1" runat="server" XDataBind="var1">采购申请单</aspxform:XHistoryFormLink>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Reason</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="2">
                        <aspxform:XTextBox id="XTextBox2" runat="server" BorderWidth="1" BorderColor="#DCDCDC" XDataBind="Purchase.Reason" width="100%" TextMode="MultiLine" Rows="6"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="3">
                        <aspxform:XLabel id="XLabel1" runat="server" Height="40px" BorderWidth="3px" BorderColor="Turquoise" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="状态" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        SerialNum</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="2">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink3" runat="server" Express="var1">#SerialNum</aspxform:XHistoryFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        ProcessName</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="2">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink4" runat="server" Express="var1">#ProcessName</aspxform:XHistoryFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        TaskID</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="2">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink5" runat="server" Express="var1">#TaskID</aspxform:XHistoryFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        初始值</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="2">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink2" runat="server">采购申请单</aspxform:XHistoryFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Disable/Enable</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink6" runat="server" Express="var1" DisableExpress="Purchase.Amount==1">采购申请单</aspxform:XHistoryFormLink>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel3" runat="server" text="(Amount=1)"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Show/Hide</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink7" runat="server" Express="var1" HiddenExpress="Purchase.Amount==1">采购申请单</aspxform:XHistoryFormLink>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XLabel id="XLabel4" runat="server" text="(Amount=1)"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Express2</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="2">
                        <aspxform:XTextBox id="XTextBox3" runat="server" BorderWidth="1" BorderColor="#DCDCDC" XDataBind="taskid" width="100%"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Express1</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="2">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink8" runat="server" Express="taskid" PopupWndHeight="600" PopupWndWidth="600">采购申请单</aspxform:XHistoryFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Express2</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="2">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink9" runat="server" Express="javascript('aaa',taskid)">采购申请单</aspxform:XHistoryFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="4">
                        <aspxform:XLabel id="XLabel2" runat="server" Height="40px" BorderWidth="3px" BorderColor="Turquoise" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="开窗方式：Window、Dialog、Tab" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Window</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink11" runat="server" Express="var1" WindowModel="Window">采购申请单</aspxform:XHistoryFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Dialog</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink12" runat="server" Express="var1" WindowModel="Dialog">采购申请单</aspxform:XHistoryFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Tab</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink13" runat="server" Express="var1" WindowModel="Tab">采购申请单</aspxform:XHistoryFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Default</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink14" runat="server" Express="var1">采购申请单</aspxform:XHistoryFormLink>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="3">
                        <aspxform:XLabel id="XLabel6" runat="server" Height="40px" BorderWidth="3px" BorderColor="Turquoise" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="大尺寸" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: medium none; BORDER-LEFT: black 1px solid">
                        SerialNum</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" colspan="2">
                        <aspxform:XHistoryFormLink id="XHistoryFormLink10" runat="server" Height="60px" BorderWidth="3px" BorderColor="Lime" BorderStyle="Solid" BackColor="#C0FFC0" Width="100%" TextAlign="Center" Express="var1">#SerialNum</aspxform:XHistoryFormLink>
                    </td>
                </tr>
            </tbody>
        </table>
        <table width="557" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0" dynamicarea="1,1" xdatasource="TableName:PurchaseDetail;Filter:TaskID->var1">
            <tbody>
                <tr>
                    <td width="24" height="20" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="beige">
                    </td>
                    <td width="200" height="20" align="center" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="beige">
                        物品 
                    </td>
                    <td width="119" align="right" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        单价 
                    </td>
                    <td width="106" align="right" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        数量 
                    </td>
                    <td width="101" align="right" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        合计 
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XGridLineNo id="XGridLineNo1" runat="server" Height="100%" BorderWidth="1" BorderStyle="None" Width="100%" TextAlign="Center">1</aspxform:XGridLineNo>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XDropDownList id="XDropDownList1" runat="server" Height="100%" Width="100%" XDataBind="PurchaseDetail.ItemCode" XDataSource="TableName:iDemoProduct" DataMap="Price->PurchaseDetail.Price" ValueColumn="ProdCode" DisplayColumn="Name"></aspxform:XDropDownList>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox6" runat="server" Height="100%" BorderWidth="1" BorderColor="#DCDCDC" TextAlign="Right" XDataBind="PurchaseDetail.Price" width="100%" Format="type:currency;pfx:￥;.2"></aspxform:XTextBox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox7" runat="server" BorderWidth="1" BorderColor="#DCDCDC" TextAlign="Right" XDataBind="PurchaseDetail.Qty" width="100%"></aspxform:XTextBox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox8" runat="server" BorderWidth="1" BorderColor="#DCDCDC" TextAlign="Right" XDataBind="PurchaseDetail.SubTotal" width="100%" Format="type:currency;pfx:￥;.2" Express="PurchaseDetail.Price*PurchaseDetail.Qty"></aspxform:XTextBox>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Insert content here -->
    </form>
</body>
</html>
