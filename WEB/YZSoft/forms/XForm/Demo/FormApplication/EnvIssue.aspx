<%@ Page Language="C#" %>
<%@ Register TagPrefix="aspxform" Namespace="XFormDesigner.Framework.Web.UI" Assembly="XFormDesigner.Framework" %>
<script runat="server">

    // Insert page code here
    //
    
    void Page_Load(object sender, EventArgs e) {
        //只带入一次
        if (String.IsNullOrEmpty(this.Request.Params["key"]))
        {
            this.XTextBox1.Text = this.Request.Params["企业名称"];
            this.XTextBox2.Text = this.Request.Params["营业执照"];
            this.XTextBox3.Text = this.Request.Params["公司类型"];
            this.XTextBox4.Text = this.Request.Params["法人代表"];
        }
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
</head>
<body>
    <form id="Form1" runat="server">
        <script type="text/javascript">
    //每次带入
    function setValues(){
        //不要使用以下代码，原因：控件dom结构不是单纯的input,XTextBox1不是input的id,而是容器id
        //document.getElementById("XTextBox1").value = '<%=this.Request.Params["企业名称"]%>'

        XFormAgent.setEleValue('XTextBox1','<%=this.Request.Params["企业名称"]%>');
        XFormAgent.setEleValue('XTextBox2','<%=this.Request.Params["营业执照"]%>');
        XFormAgent.setEleValue('XTextBox3','<%=this.Request.Params["公司类型"]%>');
        XFormAgent.setEleValue('XTextBox4','<%=this.Request.Params["法人代表"]%>');

        //其他方法
        //Ext.fly(document.getElementById("XTextBox1")).down('.yz-xform-field-ele-input',true).value = '<%=this.Request.Params["企业名称"]%>';
        //XFormAgent.tryGetChechedEle(document.getElementById("XTextBox1")).setValue('<%=this.Request.Params["企业名称"]%>');
    }

    <%if(this.Request.Params["forceSet"]=="1"){%>
        XFormAgent.on({
            ready:function(){
                setValues();
            }
        });
    <%}%>
    </script>
        <table width="600" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td height="48" align="center" valign="middle" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="4">
                        <strong><font face="微软雅黑" size="5">环保评审单</font></strong>&nbsp; 
                    </td>
                </tr>
                <tr>
                    <td width="117" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        企业名称</td>
                    <td width="177" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox1" runat="server" BorderWidth="1" BorderColor="#DCDCDC" XDataBind="Purchase.Str1" width="100%"></aspxform:XTextBox>
                    </td>
                    <td width="117" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        营业执照</td>
                    <td width="178" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox2" runat="server" BorderWidth="1" BorderColor="#DCDCDC" XDataBind="Purchase.Str2" width="100%"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        公司类型</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox3" runat="server" BorderWidth="1" BorderColor="#DCDCDC" XDataBind="Purchase.Str3" width="100%"></aspxform:XTextBox>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        法人代表</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox4" runat="server" BorderWidth="1" BorderColor="#DCDCDC" XDataBind="Purchase.Str4" width="100%"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        评审结论</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XTextBox id="XTextBox5" runat="server" BorderWidth="1" BorderColor="#DCDCDC" XDataBind="Purchase.Str5" width="100%" TextMode="MultiLine" Rows="6">环环保评审结论，环保评审结论，保评审结论</aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        附件</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" colspan="3">
                        <aspxform:XAttachments id="XAttachments1" runat="server" XDataBind="Purchase.Str6" width="100%" FileTypesDescription="Word,Excel" FileTypes="*.doc;*.docx;*.xls;*.xlsx" RepeatDirection="Horizontal"></aspxform:XAttachments>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Insert content here -->
    </form>
</body>
</html>