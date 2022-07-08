
Ext.define('2020.src.AdminPortal', {
    extend: '2020.src.Abstract',
    requires: [
    ],

    launch: function () {
        var me = this,
            url = Ext.String.format('{0}/Main.ashx', YZSoft.startApp),
            tab;

        document.title = me.title;
        Ext.getBody().addCls('yz-portal-2020 yz-portal-2020-admin');

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

                if (modules.length == 0) {
                    window.location.replace(
                        Ext.String.urlAppend(YZSoft.$url('YZSoft/core/AccessDenied/App.aspx'), Ext.Object.toQueryString({
                            startApp: YZSoft.startApp,
                            appName: me.title
                        }))
                    );
                    return;
                }

                me.cmpTitle = Ext.create('Ext.Component', {
                    cls: 'yz-cmp-apptitle',
                    tpl: '{text}',
                    data: {
                        text: me.title
                    }
                });

                me.btnCollapse = Ext.create('Ext.button.Button', {
                    cls: 'yz-btn-portal-title yz-size-icon-14 yz-btn-navigate-collapse',
                    margin: '0 17',
                    padding: 3,
                    width: 'auto',
                    height: 'auto',
                    glyph: 0xeaa5,
                    scope: me,
                    handler: 'onToggleClick'
                });

                me.tabBar = bar = Ext.create('Ext.tab.Bar', {
                    cls: 'yz-tab-bar-navigator-maintop',
                    padding:'0 0 0 0'
                });

                me.btnLang = Ext.create('YZSoft.src.button.Language', {
                    height: '100%',
                    margin: '0 25 0 0'
                });

                me.btnUser = Ext.create('YZSoft.src.button.SigninUser', {
                    height: '100%',
                    margin: 0,
                    accountMenu: {
                        hidden: true
                    },
                    outofofficeMenu: {
                        hidden: true
                    }
                });

                me.btnApps = Ext.create('Ext.button.Button', {
                    cls: 'yz-btn-portal-title yz-btn-appswitch',
                    glyph: 0xeaa8,
                    height: '100%',
                    scope: me,
                    handler: 'onSwitchAppClick'
                });

                me.titlebar = Ext.create('Ext.container.Container', {
                    region: 'north',
                    cls: 'yz-titlebar-portal',
                    height: me.bannerHeight,
                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    },
                    items: [{
                        xtype: 'container',
                        cls: 'yz-cnt-logowrap',
                        width: me.logoSectionWidth,
                        height: '100%',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                            pack: 'center'
                        },
                        items: [
                            me.cmpTitle
                        ]},
                        me.btnCollapse,
                        me.tabBar,
                        { xtype: 'tbfill' },
                        me.btnLang,
                        me.btnUser,
                        me.btnApps
                    ]
                });

                //设计流程
                //me.tab = Ext.create('YZSoft.bpm.process.admin.DesignerPanel', {
                //    region:'center',
                //    title: 'Purchase v1.0',
                //    process: {
                //        path: 'Purchase',
                //        version: '1.0'
                //    }
                //});
                me.tab = Ext.create('YZSoft.frame.tab.Navigator', {
                    region: 'center',
                    activeTab: me.activeTab || 0, //from 0
                    tabBar: me.tabBar,
                    modules: modules
                });

                YZSoft.mainTab = me.tab;
                YZSoft.frame = Ext.create('Ext.container.Viewport', {
                    layout: 'card',
                    items: [{
                        xtype: 'container',
                        layout: 'border',
                        items: [
                            me.titlebar,
                            me.tab
                        ]
                    }]
                });

                //var dlg = Ext.create('YZSoft.connection.connections.Oracle.Dlg', {
                //    autoShow: true,
                //    objectName: 'Oracle',
                //    fn: function (ds) {
                //    }
                //});

                //Ext.create('YZSoft.src.jschema.editdlg.Table', {
                //    title: 'Header 字段',
                //    autoShow: true,
                //    nameField: {
                //        hidden: true
                //    },
                //    typeWrap: {
                //        hidden: true
                //    },
                //    childFieldsEditor: {
                //        margin: '0 0 10 0',
                //        childFieldColumnName:'字段名'

                //    },
                //    fn: function (schema) {
                //    }
                //});

                //var dlg = Ext.create('YZSoft.esb.designer.dialogs.JsonSchemaFieldDlg', {
                //    autoShow: true,
                //    title:'新建字段',
                //    fn: function (ds) {
                //    }
                //});
                //var pnl = Ext.create('YZSoft.esb.sprites.RESTful.propertypages.InputMap', {
                //    region: 'center',
                //    sprite: {
                //        properties: {}
                //    }
                //});

                //var pnl = Ext.create('YZSoft.esb.sprites.WebService.propertypages.General', {
                //    region: 'center'
                //});

                //var pnl = Ext.create('YZSoft.esb.designer.DSFlowDesigner', {
                //    region: 'center',
                //    designMode: 'edit', 
                //    folder: '',
                //    flowName: 'PO1'
                //});

                //var pnl = Ext.create('YZSoft.esb.trace.TracePanel', {
                //    region: 'center',
                //    taskId: 9
                //});

                //YZSoft.frame.add(pnl);
                //YZSoft.frame.setActiveItem(pnl);

                me.tab.el.set({
                    draggable:false
                });
            },
            failure: function (response) {
                YZSoft.alert(Ext.String.format(RS.$('All_LoadModuleFailed_Msg'), url, response.status == 404 ? response.statusText : (response.responseText || '')));
            }
        });
    }
});