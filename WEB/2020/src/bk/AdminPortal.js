
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

                me.tab = Ext.create('YZSoft.frame.tab.Navigator', {
                    region: 'center',
                    activeTab: me.activeTab || 0, //from 0
                    tabBar: me.tabBar,
                    modules: modules
                });

                //var dlg = Ext.create('YZSoft.report.designer.ds.query.Dialog', {
                //    autoShow: true,
                //    autoClose: true,
                //    fn: function (ds) {
                //    }
                //});

                //搜索条件数据源设置
                //var dlg = Ext.create('YZSoft.src.datasource.settingdlg.SearchField', {
                //    autoShow: true,
                //    autoClose: true,
                //    ds: {
                //        "datasourceName": "Default",
                //        "tableName": "AD",
                //        "filter": {
                //            "ItemID": { "op": ">", "value": 1 },
                //            "AD1": { "op": "like", "value": "2" },
                //            "AD2": { "op": ">", "value": { "CodeText": "LoginUser.Account" } }
                //            //"AD2": { "op": ">", "value": "LoginUser.Account" }

                //        }
                //    },
                //    fn: function (ds) {
                //    }
                //});

                //公司日历
                //me.tab = Ext.create('YZSoft.bpm.timesheet.monthcanendar.Panel', {
                //    region: 'center',
                //   sheetName:'公司日历'
                //});

                //设计流程
                //me.tab = Ext.create('YZSoft.bpm.process.admin.DesignerPanel', {
                //    region:'center',
                //    title: '采购申请 v3.7',
                //    process: {
                //        path: '采购申请',
                //        version: '3.7'
                //    },
                //    process1: {
                //        path: '测试1',
                //        version: '1.0'
                //    }
                //});

                //me.tab = Ext.create('YZSoft.bpm.tasktrace.Timeline', {
                //    region: 'center',
                //    TaskID: 281798, //基本+加签+知会
                //    //TaskID: 281803, //系统启动 + 共享池
                //    //TaskID: 281817, //终止
                //    //TaskID: 281819, //投票终止
                //    //TaskID: 281820, //撤销
                //    //TaskID: 281816, //退回某步
                //    //TaskID: 281821, //改变处理人
                //    //TaskID: 281822, //归档任务再激活
                //    //TaskID: 281823, //删除与恢复
                //    //TaskID: 281825, //Jump
                //    //TaskID: 281826, //超时跳转
                //    //TaskID: 281827, //提交人取回，中间步骤取回
                //    //TaskID: 281828, //委托
                //    //TaskID: 281829, //直送
                //    //TaskID: 281830, //离职任务移交
                //    //TaskID: 281833, //知会节点
                //    //TaskID: 281835, //知会节点（阅示类型）
                //    //TaskID: 281836, //撤销
                //    //TaskID: 281837, //删除
                //    //TaskID: 281838, //核准
                //    //TaskID: 281839, //拒绝
                //    //TaskID: 281840, //管理员拒绝
                //    //TaskID: 281842, //自动同意和批量审批

                //});

                //me.tab = Ext.create('YZSoft.bpm.simulate.Run', {
                //    region: 'center',
                //    title: Ext.String.format('模拟运行 - {0}', '采购申请'),
                //    taskid: 281879,
                //    processName: '采购申请',
                //    runMode: 'step',
                //    sn: 'REQ2018120074',
                //});

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

                //var pnl = Ext.create('YZSoft.mobile.designer.Panel', {
                //    region: 'center'
                //});

                //var pnl = Ext.create('YZSoft.report.designer.Panel', {
                //    region: 'center',
                //    designMode: 'edit',
                //    path: 'QML测试'
                //});

                //var pnl = Ext.create('test.Chart', {
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