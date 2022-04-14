//视图
Ext.define('YZSoft.esb.esb5.connect.ConnectPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.esb.esb5.src.model.Connect'
    ],
    constructor: function (config) {
        var me = this;
        me.formWidth = 600;
        //数据仓库
        me.store = Ext.create('Ext.data.JsonStore', {
            sorters: { property: 'updateTime', direction: 'DESC' },
            model: 'YZSoft.esb.esb5.src.model.Connect',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/ESB5/Connect.ashx'),
                extraParams: {
                    method: 'GetConnectList'
                },
                reader: {
                    type: 'json'
                }
            }
        });
        //创建数据视图
        me.dataview = Ext.create('YZSoft.esb.esb5.connect.ConnectView', {
            cls: 'yz-border-t',
            store: me.store
        });
        //新增按钮
        me.btn_add = Ext.create('Ext.Button', {
            iconCls: 'yz-glyph yz-glyph-e618',
            text: RS.$('All_AddNew'),
            disabled: true,
            scope: this,
            menu: [{
                text: Ext.String.format(RS.$('ESB_NewConnection'), 'WebService'),
                iconCls: 'yz-glyph yz-glyph-e618',
                handler: function () {
                    me.onAddConnect(1);
                }
            }, {
                text: Ext.String.format(RS.$('ESB_NewConnection'), 'SAP'),
                iconCls: 'yz-glyph yz-glyph-e618',
                handler: function () {
                    me.onAddConnect(2);
                }
            }, {
                text: Ext.String.format(RS.$('ESB_NewConnection'), 'SqlServer'),
                iconCls: 'yz-glyph yz-glyph-e618',
                handler: function () {
                    me.onAddConnect(3);
                }
            }, {
                text: Ext.String.format(RS.$('ESB_NewConnection'), 'Oracel'),
                iconCls: 'yz-glyph yz-glyph-e618',
                handler: function () {
                    me.onAddConnect(4);
                }
            }, {
                text: Ext.String.format(RS.$('ESB_NewConnection'), 'Excel'),
                iconCls: 'yz-glyph yz-glyph-e618',
                handler: function () {
                    me.onAddConnect(5);
                }
            }]
        });
        //编辑按钮
        me.btn_update = Ext.create('Ext.Button', {
            iconCls: 'yz-glyph yz-glyph-edit',
            text: RS.$('All_Edit'),
            scope: this,
            handler: function () {
                me.onEditConnect();

            }
        });
        //测试按钮
        me.btn_test = Ext.create('Ext.Button', {
            iconCls: 'yz-glyph yz-glyph-e997',
            text: RS.$('All_Testing'),
            scope: this,
            handler: function () {
                me.onTestConnect();
            }
        });
        //删除按钮
        me.btn_del = Ext.create('Ext.Button', {
            iconCls: 'yz-glyph yz-glyph-delete',
            text: RS.$('All_Delete'),
            scope: this,
            handler: function () {
                me.onDelConnect();
            }
        });
        var tbar = Ext.create('Ext.toolbar.Toolbar', {
            cls: 'yz-tbar-module',
            items: [me.btn_add, me.btn_update, me.btn_test, me.btn_del]
        });

        var cfg = {
            closable: true,
            border: false,
            scrollable: true,
            layout: 'border',
            dockedItems: [tbar],
            items: [me.dataview],
            listeners: {
                activate: function () {
                    me.store.load();
                }
            }
        };
        Ext.apply(cfg, config);
        this.callParent([cfg]);
    },
    onAddConnect: function (connectType) {
        var me = this;
        var pnl;
        var title;
        if (connectType == 1) {
            pnl = Ext.create('YZSoft.esb.esb5.connect.JoinWebPanel', {
                closemethod: 'hide',
                plain: false,
                modal: true,
                formWidth: me.formWidth,
                title: Ext.String.format(RS.$('ESB_NewConnection'), 'WebService'),
                border: false,
                jointype: 'TheAdd',
                fn: function (str) {
                    //回调函数
                    //刷新视图
                    me.store.load({ params: { method: 'GetConnectList'} });
                }
            });
        }
        else if (connectType == 2) {
            pnl = Ext.create('YZSoft.esb.esb5.connect.JoinSapPanel', {
                closemethod: 'hide',
                plain: false,
                modal: true,
                formWidth: me.formWidth,
                title:Ext.String.format(RS.$('ESB_NewConnection'), 'SAP'),
                border: false,
                jointype: 'TheAdd',
                fn: function (str) {
                    //回调函数
                    //刷新视图
                    me.store.load({ params: { method: 'GetConnectList'} });
                }
            });
        }
        else if (connectType == 3) {
             pnl = Ext.create('YZSoft.esb.esb5.connect.JoinSqlPanel', {
                closemethod: 'hide',
                plain: false,
                modal: true,
                formWidth: me.formWidth,
                title:Ext.String.format(RS.$('ESB_NewConnection'), 'SqlServer'),
                border: false,
                jointype: 'TheAdd',
                fn: function (str) {
                    //回调函数
                    //刷新视图
                    me.store.load({ params: { method: 'GetConnectList'} });
                }
            });
        }
        else if (connectType == 4) {
            pnl = Ext.create('YZSoft.esb.esb5.connect.JoinOraclePanel', {
                closemethod: 'hide',
                plain: false,
                modal: true,
                formWidth: me.formWidth,
                title:Ext.String.format(RS.$('ESB_NewConnection'), 'Oracel'),
                border: false,
                jointype: 'TheAdd',
                fn: function (str) {
                    //回调函数
                    //刷新视图
                    me.store.load({ params: { method: 'GetConnectList'} });
                }
            });
        }
        else if (connectType == 5) {
            pnl = Ext.create('YZSoft.esb.esb5.connect.JoinExcelPanel', {
                closemethod: 'hide',
                plain: false,
                modal: true,
                formWidth: me.formWidth,
                title:Ext.String.format(RS.$('ESB_NewConnection'), 'Excel'),
                border: false,
                jointype: 'TheAdd',
                fn: function (str) {
                    //回调函数
                    //刷新视图
                    me.store.load({ params: { method: 'GetConnectList'} });
                }
            });
        }
        else {
            return false;
        }
        //显示弹出窗口
        pnl.show();
    },
    onEditConnect: function () {
        var me = this;
        var items = me.dataview.selModel.getSelection()[0];
        if (items == null) {
            Ext.Msg.show({
                title: RS.$('ESB_EditPrompt'),
                msg: RS.$('ESB_PleaseSelConnectionFirst'),
                buttons: Ext.Msg.OK
            });
            return false;
        }
        var connectType = items.data.connectType;
        YZSoft.Ajax.request({
            url: 'YZSoft.Services.REST/ESB5/Connect.ashx',
            params: { method: 'EditConnect', connectId: items.data.connectId },
            success: function (data) {
                var title;
                var pnl;
                if (connectType == 1) {
                    pnl = Ext.create('YZSoft.esb.esb5.connect.JoinWebPanel', {
                        closemethod: 'hide',
                        plain: false,
                        modal: true,
                        formWidth: me.formWidth,
                        title:Ext.String.format(RS.$('ESB_EditConnection'), 'WebService'),
                        border: false,
                        jointype: 'TheEdit',
                        connectId: items.data.connectId,
                        connectName: data.result.connectName,
                        webPath: data.result.connectStr.webPath,
                        caption: data.result.caption,
                        fn: function (str) {
                            //回调函数
                            //刷新视图
                            me.store.load({ params: { method: 'GetConnectList'} });
                        }
                    });
                }
                else if (connectType == 2) {
                    pnl = Ext.create('YZSoft.esb.esb5.connect.JoinSapPanel', {
                        closemethod: 'hide',
                        plain: false,
                        modal: true,
                        formWidth: me.formWidth,
                        title:Ext.String.format(RS.$('ESB_EditConnection'), 'SAP'),
                        border: false,
                        jointype: 'TheEdit',
                        connectId: items.data.connectId,
                        connectName: data.result.connectName,
                        serverHost: data.result.connectStr.serverHost,
                        saprouter: data.result.connectStr.SAPRouter,
                        systemNumber: data.result.connectStr.systemNumber,
                        client: data.result.connectStr.client,
                        user: data.result.connectStr.user,
                        pwd: data.result.connectStr.pwd,
                        systemName: data.result.connectStr.systemName,
                        language: data.result.connectStr.language,
                        caption: data.result.caption,
                        fn: function (str) {
                            //回调函数
                            //刷新视图
                            me.store.load({ params: { method: 'GetConnectList'} });
                        }
                    });
                }
                else if (connectType == 3) {
                    pnl = Ext.create('YZSoft.esb.esb5.connect.JoinSqlPanel', {
                        closemethod: 'hide',
                        plain: false,
                        modal: true,
                        formWidth: me.formWidth,
                        title:Ext.String.format(RS.$('ESB_EditConnection'), 'SqlServer'),
                        border: false,
                        jointype: 'TheEdit',
                        connectId: items.data.connectId,
                        connectName: data.result.connectName,
                        dataSource: data.result.connectStr.dataSource,
                        user: data.result.connectStr.user,
                        pwd: data.result.connectStr.pwd,
                        dataBase: data.result.connectStr.dataBase,
                        caption: data.result.caption,
                        fn: function (str) {
                            //回调函数
                            //刷新视图
                            me.store.load({ params: { method: 'GetConnectList'} });
                        }
                    });
                }
                else if (connectType == 4) {
                    pnl = Ext.create('YZSoft.esb.esb5.connect.JoinOraclePanel', {
                        closemethod: 'hide',
                        plain: false,
                        modal: true,
                        formWidth: me.formWidth,
                         title:Ext.String.format(RS.$('ESB_EditConnection'), 'Oracle'),
                        border: false,
                        jointype: 'TheEdit',
                        connectId: items.data.connectId,
                        connectName: data.result.connectName,
                        systemName: data.result.connectStr.systemName,
                        host: data.result.connectStr.host,
                        port: data.result.connectStr.port,
                        user: data.result.connectStr.user,
                        pwd: data.result.connectStr.pwd,
                        caption: data.result.caption,
                        fn: function (str) {
                            //回调函数
                            //刷新视图
                            me.store.load({ params: { method: 'GetConnectList'} });
                        }
                    });
                }
                else if (connectType == 5) {
                    pnl = Ext.create('YZSoft.esb.esb5.connect.JoinExcelPanel', {
                        closemethod: 'hide',
                        plain: false,
                        modal: true,
                        formWidth: me.formWidth,
                        title:Ext.String.format(RS.$('ESB_EditConnection'), 'Excel'),
                        border: false,
                        jointype: 'TheEdit',
                        connectId: items.data.connectId,
                        connectName: data.result.connectName,
                        excelPath: data.result.connectStr.excelPath,
                        caption: data.result.caption,
                        fn: function (str) {
                            //回调函数
                            //刷新视图
                            me.store.load({ params: { method: 'GetConnectList'} });
                        }
                    });
                }
                else {
                    Ext.Msg.show({
                        title: RS.$('ESB_ConnectionPrompt'),
                        msg: RS.$('ESB_ConnectionFailed'),
                        buttons: Ext.Msg.OK
                    });
                    return false;
                }
                //显示弹出窗口
                pnl.show();
            },
            failure: function (form, o) {
                Ext.Msg.show({
                    title: RS.$('ESB_ConnectionPrompt'),
                    msg: RS.$('ESB_ConnectionFailed'),
                    buttons: Ext.Msg.OK
                });
                return false;
            }
        });
    },
    //测试
    onTestConnect: function () {
        var me = this;
        var items = me.dataview.selModel.getSelection()[0];
        if (items == null) {
            Ext.Msg.show({
                title: RS.$('ESB_TestingPrompt'),
                msg: RS.$('ESB_PleaseSelConnectionFirst'),
                buttons: Ext.Msg.OK
            });
            return false;
        }
        Ext.Msg.show({
            title: RS.$('ESB_TestingConnection'),
            msg: RS.$('ESB_TestingCfm_Msg'),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'ok',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;
                YZSoft.Ajax.request({
                    url: 'YZSoft.Services.REST/ESB5/Connect.ashx',
                    params: { method: 'TestConnect', connectId: items.data.connectId },
                    waitMsg: RS.$('ESB_Connecting'),
                    success: function (data) {
                        Ext.Msg.show({
                            title: RS.$('ESB_TestingPrompt'),
                            msg: data.result.errorMessage,
                            buttons: Ext.Msg.OK
                        });
                    },
                    failure: function (data) {
                        Ext.Msg.show({
                            title: RS.$('ESB_TestingPrompt'),
                            msg: data.result.errorMessage,
                            buttons: Ext.Msg.OK
                        });
                    }
                });

            }
        });
    },
    //删除
    onDelConnect: function () {
        var me = this;
        var items = me.dataview.selModel.getSelection()[0];
        if (items == null) {
            Ext.Msg.show({
                title: RS.$('ESB_DeletePrompt'),
                msg: RS.$('ESB_PleaseSelConnectionFirst'),
                buttons: Ext.Msg.OK
            });
            return false;
        }
        Ext.Msg.show({
            title: RS.$('ESB_DeleteConnectionCfm_Title'),
            msg: RS.$('ESB_DeleteConnectionCfm_Msg'),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;
                YZSoft.Ajax.request({
                    url: 'YZSoft.Services.REST/ESB5/Connect.ashx',
                    params: { method: 'DelConnect', connectId: items.data.connectId },
                    waitMsg: RS.$('All_Deleting'),
                    waitMsgOK: RS.$('All_DeleteSucceed'),
                    success: function (data) {
                        me.store.reload();
                    },
                    failure: function (data) {
                        Ext.Msg.show({
                            title: RS.$('ESB_DeletePrompt'),
                            msg: data.result.errorMessage,
                            buttons: Ext.Msg.OK
                        });
                    }
                });
            }
        });
    }
});