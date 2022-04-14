<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Post.aspx.cs" Inherits="Forms_Post" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=1"/>

    <title>BPM Form</title>
    <script type="text/javascript" src="../../bootstrap.js"></script>
    <script type="text/javascript" src="../../manifest.js"></script>
    <asp:literal runat="server" id='_litJS'></asp:literal>

    <script type="text/javascript">

        var YZSoft = YZSoft || {};

        YZSoft.jsCache = <%=YZSetting.JSCache.ToString().ToLower()%>;
        YZSoft.jsVersion = '<%=YZSetting.JSVersion%>';
        YZSoft.debug = <%=YZSetting.Debug.ToString().ToLower()%>;

        for (p in YZManifest.paths) {
            if (YZManifest.paths.hasOwnProperty(p))
                YZManifest.paths[p] = '../../' + YZManifest.paths[p];
        }

        YZManifest.css = [{
            path: '../../ext/build/classic/theme-triton/resources/theme-triton-all.css'
        }, {
            path: '../../ext/build/packages/ux/classic/triton/resources/ux-all.css'
        }, {
            path: '../../ext/build/packages/charts/classic/triton/resources/charts-all.css'
        }, {
            path: '../../YZSoft/theme/core/' + (YZSoft.debug ? 'main-debug.css' : 'main.css')
        }];

        YZManifest.js = [{
            path: YZSoft.debug ? '../../ext/build/ext-all-debug.js' : '../../ext/build/ext-all.js'
        }, {
            path: '../../ext/build/classic/theme-triton/theme-triton.js'
        }, {
            path: 'init.js'
        }, {
            path: '../../YZSoft/core/Scripts/YZSoftExt.js'
        }, {
            path: 'Scripts/XFormCore.js'
        }, {
                path: 'Post.js'
        }];

        YZManifest.loader = {
            cache: YZSoft.jsCache ? YZSoft.jsVersion : undefined
        };
                
        Ext.manifest = YZManifest;
        Ext.Microloader.run();
    </script>
</head>
<body>
</body>
</html>