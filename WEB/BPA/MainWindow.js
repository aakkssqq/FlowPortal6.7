
Ext.Loader.loadScriptsSync(YZSoft.$url('ext/build/packages/sencha-charts/build/sencha-charts.js'));

Ext.application({
    name: 'FlowPortal BPA',
    title: RS.$('All_AppName_BPA_Title'),
    requires: [
        'YZSoft.src.ux.Push',
        'YZSoft.bpa.MainPanel',
        'YZSoft.src.container.ModuleContainer',
        'YZSoft.bpa.library.Panel',
        'YZSoft.bpa.ModuleContainer',
        'YZSoft.bpa.library.LibrariesPanel',
        'YZSoft.bpa.library.toolbar.LibrariesTitleBar',
        'YZSoft.bpa.src.toolbar.TitleBar',
        'YZSoft.bpa.src.toolbar.items.Caption',
        'YZSoft.bpa.src.toolbar.items.Headshort',
        'YZSoft.bpa.src.toolbar.items.Account',
        'YZSoft.bpa.library.libs.LibrariesView',
        'YZSoft.src.lib.View',
        'YZSoft.src.model.Library',
        'YZSoft.src.view.plugin.DragDrop',
        'YZSoft.src.view.plugin.DropZone'
    ],
    uses: [
        'YZSoft.src.flowchart.sprite.Path' //实时加载会出现图片未load的情况
    ],

    launch: function () {
        var me = this,
            url = Ext.String.format('{0}/Main.ashx', YZSoft.startApp);

        document.title = me.title;

        Ext.setKeyboardMode(false);

        YZSoft.src.ux.Push.init({
        });

        Ext.Ajax.request({
            method: 'GET',
            disableCaching: true,
            url: url,
            params: {
                method: 'GetModuleTree'
            },
            success: function (response) {
                var result = Ext.decode(response.responseText),
                    modules = result;

                if (result.success === false) {
                    result.errorMessage = Ext.String.htmlDecode(result.errorMessage);
                    YZSoft.alert(result.errorMessage);
                    return;
                }

                YZSoft.pnlMain = Ext.create('YZSoft.bpa.MainPanel', {
                    modules: modules
                });

                //流程图调试
                //YZSoft.pnlMain = Ext.create('YZSoft.bpa.DesignerPanel', {
                //    "border": false,
                //    "closable":
                //    true, "header":
                //    false,
                //    "categories": [],
                //    "allCategories": ["General", "FlowChart", "BPMN", "EVC", "EPC", "ORG", "Product", "Data", "ITSystem", "KPI", "Risk", "Regulation", "Lane"],
                //    process: {
                //        fileid: '201811260001',
                //        fileName: '测试1'
                //    },
                //    process1: {
                //        fileid: '201607220001',
                //        fileName: 'Level0 战略'
                //    }
                //});

                //流程清单
                //YZSoft.pnlMain = Ext.create('YZSoft.bpa.apps.ModuleList.Panel', {
                //    title: '流程清单',
                //    tabConfig: {
                //        frame: false,
                //        focusable: false,
                //        iconCls: 'yz-glyph yz-glyph-e954',
                //        textAlign: 'left'
                //    }
                //});

                //关联查询
                //YZSoft.pnlMain = Ext.create('YZSoft.bpa.apps.Relationship.Panel', {
                //    title: '关联查询'
                //});

                //流程全景
                //YZSoft.pnlMain = Ext.create('YZSoft.bpa.apps.Panoramic.Panel', {
                //    title: '流程全景',
                //    libInfo: {"LibID":1,"LibType":"BPAFile","Name":"\u4e2d\u56fd\u7535\u79d1\u96c6\u56e2","Desc":"222","DocumentFolderID":-1,"FolderID":87,"Owner":null,"CreateAt":null,"ImageFileID":null,"Deleted":false,"DeleteBy":null,"DeleteAt":null,"OrderIndex":2}
                //});

                //流程统计
                //YZSoft.pnlMain = Ext.create('YZSoft.bpa.apps.Dashboard.Panel', {
                //    title: '流程统计',
                //    libInfo: {"LibID":1,"LibType":"BPAFile","Name":"\u4e2d\u56fd\u7535\u79d1\u96c6\u56e2","Desc":"222","DocumentFolderID":-1,"FolderID":87,"Owner":null,"CreateAt":null,"ImageFileID":null,"Deleted":false,"DeleteBy":null,"DeleteAt":null,"OrderIndex":2}
                //});

                YZSoft.frame = Ext.create('Ext.container.Viewport', {
                    layout: 'card',
                    items: [YZSoft.pnlMain]
                });

                Ext.defer(function () {
                    Ext.require([
                        'YZSoft.src.tip.UserTip'
                    ], function () {
                    });
                }, 100);
            },
            failure: function (response) {
                YZSoft.alert(Ext.String.format(RS.$('All_LoadModuleFailed_Msg'), url, response.status == 404 ? response.statusText : (response.responseText || '')));
            }
        });
    }
});