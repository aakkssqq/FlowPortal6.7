<%@ Page Language="C#" %>
<%@ Register TagPrefix="aspxform" Namespace="XFormDesigner.Framework.Web.UI" Assembly="XFormDesigner.Framework" %>
<script runat="server">

    // Insert page code here
    //
    
    void Page_Load(object sender, EventArgs e) {
        this.XTextBox1.Text = Request.QueryString["id"];
    }

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
    </style>
</head>
<BODY>
<form runat="server">
<!-- Insert content here -->
<TABLE width=436 
style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" 
border=0 cellSpacing=0 cellPadding=0>
  <TBODY>
  <TR>
    <TD height=22 
    style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" 
    colSpan=2><STRONG>设备维修登记</STRONG></TD></TR>
  <TR>
    <TD width=140 
    style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">设备编号</TD>
    <TD width=293 
    style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none"><aspxform:XTextBox id=XTextBox1 runat="server" DataMap="Name->_deviceName;Standard->_deviceStandard" ValueToDisplayText="TableName:v_iDemoDevice;FilterColumn:ID;DisplayColumn:Number" XDataBind="iDemoDeviceRepair.DeviceID" width="100%" BorderWidth="1" BorderColor="#DCDCDC"></aspxform:XTextBox></TD></TR>
  <TR>
    <TD 
    style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">设备名称</TD>
    <TD 
    style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none"><aspxform:XTextBox id=XTextBox2 runat="server" XDataBind="_deviceName" width="100%" BorderWidth="1" BorderColor="#DCDCDC"></aspxform:XTextBox></TD></TR>
  <TR>
    <TD 
    style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">规格</TD>
    <TD 
    style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none"><aspxform:XTextBox id=XTextBox3 runat="server" XDataBind="_deviceStandard" width="100%" BorderWidth="1" BorderColor="#DCDCDC"></aspxform:XTextBox></TD></TR>
  <TR>
    <TD height=21 
    style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" 
    colSpan=2>维修说明</TD></TR>
  <TR>
    <TD 
    style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" 
    colSpan=2><aspxform:XTextBox id=XTextBox4 runat="server" ValueToDisplayText XDataBind="iDemoDeviceRepair.Note" width="100%" BorderWidth="1px" BorderColor="Gainsboro" Max="0" Min="0" Value HiddenInput="False" Height="105px" TextMode="MultiLine"></aspxform:XTextBox></TD></TR>
  <TR>
    <TD height=20 
    style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" 
    colSpan=2>
      附件</TD></TR>
  <TR>
    <TD vAlign=top 
    style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" 
    colSpan=2><aspxform:XAttachments id=XAttachments1 runat="server" width="434px" FileTypes="*.doc;*.docx;*.xls;*.xlsx" FileTypesDescription="Word,Excel" MaximumFileSize></aspxform:XAttachments></TD></TR></TBODY></TABLE></form>
</BODY></HTML>