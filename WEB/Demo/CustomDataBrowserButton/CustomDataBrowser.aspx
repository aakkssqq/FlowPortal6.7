<%@ Page Language="C#" AutoEventWireup="true" CodeFile="CustomDataBrowser.aspx.cs" Inherits="Demo_CustomDataBrowser" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>演示：自定义开窗查询</title>
    <meta content="IE=EmulateIE8" http-equiv="X-UA-Compatible" />
    <script src="../../YZSoft/Forms/Scripts/XFormCore.js" type="text/javascript"></script>
    
    <script type="text/javascript">

    function OnOK() {
        var rv = {
            Product: document.getElementById('Product').value,
            Price: document.getElementById('Price').value,
            Qty: document.getElementById('Qty').value
        };

        CloseWindow('ok', rv);

        //返回多行代码如下
        /*
        var rv = new Array();
        rv.push({Product:'AAA1',Price:12.34,Qty:3});
        rv.push({Product:'AAA2',Price:23.45,Qty:4});
        CloseWindow('ok', rv);
        */
    }
    
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <table>
        <tr><td style="padding-right:30px;" bgcolor="#FFCCFF">传入参数</td>
            <td bgcolor="#FFCCFF"><asp:TextBox ID="Params" runat="server" BackColor="#FFCCFF" 
                    BorderWidth="0px"></asp:TextBox></td></tr>
        <tr><td>品名</td><td><asp:TextBox ID="Product" runat="server" Text="露华侬"></asp:TextBox></td></tr>
        <tr><td>价格</td><td><asp:TextBox ID="Price" runat="server" Text="12345.67"></asp:TextBox></td></tr>
        <tr><td>数量</td><td><asp:TextBox ID="Qty" runat="server" Text="3"></asp:TextBox></td></tr>
        <tr><td></td><td><input type="button" value="确定" onclick='OnOK()'/></td></tr>
    </table>
    </form>
</body>
</html>
