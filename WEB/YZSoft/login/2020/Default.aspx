<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="YZSoft_Login_2020_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="shortcut icon" type="image/ico" href="../../../favicon.ico" />
    <link href="css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="css/jquery.fancybox.min.css" rel="stylesheet" type="text/css" />
    <link href="css/login.css" rel="stylesheet" type="text/css" />
    <asp:literal runat="server" id='_litLoginCss'></asp:literal>
    <script src="js/jquery-3.2.1.min.js" type="text/javascript"></script>
    <script src="js/jquery.browser.min.js" type="text/javascript"></script>
    <script src="js/jquery.cookie.js" type="text/javascript"></script>
    <script src="js/jquery.fancybox.min.js" type="text/javascript"></script>
    <script src="js/jsencrypt.min.js" type="text/javascript"></script>
    <script type="text/javascript">
        function htmlDecode(value) {
            if (value) {
                return $('<div />').html(value).text();
            } else {
                return '';
            }
        }

        application = {
            root: '<%=this.ResolveUrl("~/")%>',
            returnUrl: htmlDecode('<%=HttpUtility.HtmlEncode(YZUtility.EncodeJsString(this.ReturnUrl))%>'),
            logoutType: '<%=YZAuthHelper.BPMLogoutType%>',
            ntOnly: <%=this.NtOnly.ToString().ToLower()%>,
            strings: {
                enterAccount: '<%=YZUtility.EncodeJsString(Resources.YZStrings.Aspx_Login_EnterAccountTip)%>',
                browserWarn: '<%=YZUtility.EncodeJsString(Resources.YZStrings.Aspx_Login_Step0_Msg)%>'
            }
        }
    </script>
    <script src="js/login.js" type="text/javascript"></script>
</head>
<body>
<div class="container-fluid d-flex flex-column h-100 yz-outter-wrap">
    <div class="d-flex flex-row align-items-end yz-banner">
        <div class="yz-logo"></div>
        <div class="flex-fill"></div>
        <div class="yz-langs">
            <%=this.LanguageSwitchHtml%>
        </div>
    </div>
    <div class="row flex-fill yz-body">
        <div class="col-12 d-flex flex-column p-0 yz-right-warp">
            <div class="flex-fill d-flex flex-row justify-content-center align-items-center yz-right-top-wrap">
                <div runat="server" id="_pnlLogin" class="d-flex flex-column align-items-stretch yz-login-body">
                    <div class="head"></div>
                    <div class="tip">&nbsp;</div>
                    <div class="yz-input uid">
                        <input type="text" runat="server" id="_txtUid" autocomplete="off" />
                    </div>
                    <div class="yz-input pwd">
                        <input type="password" runat="server" id="_txtPwd" autocomplete="new-password" />
                    </div>
                    <div runat="server" id="_btnLogin" class="text-center yz-btn login"></div>
                    <div runat="server" id="_btnLoginNT" class="text-center yz-btn loginnt"></div>
                </div>
            </div>
            <div class="text-center yz-copyright">
                <div runat="server" id="_copyright">版权所有 Copyright(C) 2015-2035 上海易正信息技术有限公司<br/>沪ICP备09003909号-1</div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
