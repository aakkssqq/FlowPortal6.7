<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="Default.aspx.cs" Inherits="BPM_Default" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes">
    <title>FlowPortal</title>
    <link rel="shortcut icon" type="image/ico" href="favicon.ico" />
    <style type="text/css">
        html, body {
            margin: 0px;
            height: 100%;
            background-color: #f5f5f5;
        }
    </style>
    <script type="text/javascript" src="bootstrap.js"></script>
    <script type="text/javascript" src="manifest.js"></script>

    <script type="text/javascript">

        var YZSoft = YZSoft || {};

        YZSoft.startApp = '<%=this.StartApp%>';
        YZSoft.jsCache = <%=YZSetting.JSCache.ToString().ToLower()%>;
        YZSoft.jsVersion = '<%=YZSetting.JSVersion%>';
        YZSoft.debug = <%=YZSetting.Debug.ToString().ToLower()%>;
        YZSoft.theme = '<%=YZSetting.Theme%>';
        YZSoft.loginUrl = '<%=FormsAuthentication.LoginUrl%>';

        YZManifest.css = [{
            path: 'ext/build/classic/theme-triton/resources/theme-triton-all.css'
        }, {
            path: 'ext/build/packages/ux/classic/triton/resources/ux-all.css'
        }, {
            path: 'ext/build/packages/charts/classic/triton/resources/charts-all.css'
        }, {
            path: 'YZSoft/theme/core/' + (YZSoft.debug ? 'main-debug.css' : 'main.css')
        }, {
            path: YZSoft.startApp + '/Styles/main.css'
        }];

        YZManifest.js = [{
            path: YZSoft.debug ? 'ext/build/ext-all-debug.js' : 'ext/build/ext-all.js'
        }, {
            path: 'ext/build/classic/theme-triton/theme-triton.js'
        }, {
            path: 'YZSoft/core/Scripts/YZSoftExt.js'
        }, {
            path: YZSoft.startApp + '/MainWindow.js'
        }];

        YZManifest.loader.cache = YZSoft.jsCache ? YZSoft.jsVersion : undefined;

        Ext.manifest = YZManifest;
        Ext.Microloader.run();
    </script>
</head>
<body>
</body>
</html>
