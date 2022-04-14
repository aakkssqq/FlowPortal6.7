//视图
Ext.define('YZSoft.esb.esb5.source.SourcePanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.esb.esb5.src.model.Source',
        'YZSoft.esb.esb5.src.model.Connect'
    ],
    constructor: function (config) {
        var me = this;
        //数据仓库
        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.esb.esb5.src.model.Source',
            proxy: {
                type: 'ajax',
                url: 'YZSoft.Services.REST/ESB5/Source.ashx',
                extraParams: {
                    method: 'GetSourceList'
                },
                reader: {
                    type: 'json'
                }
            }
        });
        //创建数据视图
        me.dataview = Ext.create('YZSoft.esb.esb5.source.SourceView', {
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
                text: Ext.String.format(RS.$('ESB_NewDataSource_Fmt'), 'Webservice'),
                iconCls: 'yz-glyph yz-glyph-e618',
                handler: function () {
                    me.addSource(1);
                }
            },
            {
                text: Ext.String.format(RS.$('ESB_NewDataSource_Fmt'), 'SAP'),
                iconCls: 'yz-glyph yz-glyph-e618',
                handler: function () {
                    me.addSource(2);
                }
            },
            {
                text: Ext.String.format(RS.$('ESB_NewDataSource_Fmt'), 'SqlServer'),
                iconCls: 'yz-glyph yz-glyph-e618',
                handler: function () {
                    me.addSource(3);
                }
            },
            {
                text: Ext.String.format(RS.$('ESB_NewDataSource_Fmt'), 'Oracle'),
                iconCls: 'yz-glyph yz-glyph-e618',
                handler: function () {
                    me.addSource(4);
                }
            },
            {
                text: Ext.String.format(RS.$('ESB_NewDataSource_Fmt'), 'Excel'),
                iconCls: 'yz-glyph yz-glyph-e618',
                handler: function () {
                    me.addSource(5);
                }
            }]
        });
        me.btn_update = Ext.create('Ext.Button', {
            iconCls: 'yz-glyph yz-glyph-edit',
            text: RS.$('All_Edit'),
            scope: this,
            handler: function () {
                me.updateSource();

            }
        });
        //测试按钮
        me.btn_test = Ext.create('Ext.Button', {
            iconCls: 'yz-glyph yz-glyph-e997',
            text: RS.$('All_Testing'),
            scope: this,
            handler: function () {
                me.testSource();
            }
        });
        //删除按钮
        me.btn_del = Ext.create('Ext.Button', {
            iconCls: 'yz-glyph yz-glyph-delete',
            text: RS.$('All_Delete'),
            scope: this,
            handler: function () {
                me.delSource();
            }
        });

        var tbar = Ext.create('Ext.toolbar.Toolbar', {
            cls:'yz-tbar-module',
            items: [me.btn_add, me.btn_update, me.btn_test, me.btn_del]
        });
        var cfg = {
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
    //验证源名称是否唯一
    onIsNameOnly: function (sourceType, sourceName, caption) {
        var me = this;
        YZSoft.Ajax.request({
            url: 'YZSoft.Services.REST/ESB5/Source.ashx',
            params: { method: 'IsSourceNameOnly', sourceType: sourceType, sourceName: sourceName },
            success: function (data) {
                me.onGoToAddPanel(sourceType, sourceName, caption);
                me.showJoinWin.close();
            },
            failure: function (data) {
                Ext.Msg.show({
                    title: RS.$('All_AccessPrompt'),
                    msg: data.result.errorMessage,
                    buttons: Ext.Msg.OK
                });
            }
        });
    },
    //跳转到相关页面
    addSource: function (sourceType) {
        var me = this;
        var pnl;
        if (sourceType == 1) {
            pnl = YZSoft.ViewManager.addView(me, 'YZSoft.esb.esb5.webservice.Panel', {
                border: false,
                title: Ext.String.format(RS.$('ESB_NewDataSource_Fmt'), 'Webservice'),
                jointype: 'TheAdd',
                sourceType: sourceType
            });
        }
        else if (sourceType == 2) {
            pnl = YZSoft.ViewManager.addView(me, 'YZSoft.esb.esb5.sap.Panel', {
                region: 'center',
                title: Ext.String.format(RS.$('ESB_NewDataSource_Fmt'), 'SAP'),
                jointype: 'TheAdd',
                sourceType: sourceType
            });
        }
        else if (sourceType == 3) {
            pnl = YZSoft.ViewManager.addView(me, 'YZSoft.esb.esb5.sqlserver.Panel', {
                region: 'center',
                title: Ext.String.format(RS.$('ESB_NewDataSource_Fmt'), 'SqlServer'),
                jointype: 'TheAdd',
                sourceType: sourceType
            });
        }
        else if (sourceType == 4) {
            pnl = YZSoft.ViewManager.addView(me, 'YZSoft.esb.esb5.oracle.Panel', {
                region: 'center',
                title: Ext.String.format(RS.$('ESB_NewDataSource_Fmt'), 'Oracle'),
                jointype: 'TheAdd',
                sourceType: sourceType
            });
        }
        else if (sourceType == 5) {
            pnl = YZSoft.ViewManager.addView(me, 'YZSoft.esb.esb5.excel.Panel', {
                region: 'center',
                title: Ext.String.format(RS.$('ESB_NewDataSource_Fmt'), 'Excel'),
                jointype: 'TheAdd',
                sourceType: sourceType
            });
        }
        else {
            return false;
        }
    },
    updateSource: function () {
        //编辑数据源
        var me = this;

        var items = me.dataview.selModel.getSelection()[0];
        if (items == null) {
            Ext.Msg.show({
                title: RS.$('ESB_EditPrompt'),
                msg: RS.$('ESB_SelectDatasourceFirst_Validation'),
                buttons: Ext.Msg.OK
            });
            return false;
        }
        YZSoft.Ajax.request({
            url: 'YZSoft.Services.REST/ESB5/Source.ashx',
            params: { method: 'GetSourceInfo', sourceId: items.data.sourceId },
            success: function (data) {
                me.onGoToEditPanel(data.result);
            },
            failure: function (data) {
                Ext.Msg.show({
                    title: RS.$('All_AccessPrompt'),
                    msg: data.result.errorMessage,
                    buttons: Ext.Msg.OK
                });
            }
        });
    },
    //跳转到编辑页面
    onGoToEditPanel: function (result) {
        var me = this;
        var pnl;
        if (result.sourceType == 1) {
            pnl = YZSoft.ViewManager.addView(me, 'YZSoft.esb.esb5.webservice.Panel', {
                region: 'center',
                bodyStyle: 'background-color:transparent',
                border: false,
                title: Ext.String.format(RS.$('ESB_EditDataSource_Fmt'), 'WebService'),
                jointype: 'TheEdit',
                sourceId: result.sourceId,
                sourceName: result.sourceName,
                sourceType: result.sourceType,
                connectId: result.connectInfo.connectId,
                functionName: result.sourceStr.query,
                caption: result.caption,
                parameterData: result.sourceStr.parameter,
                schemaData: result.sourceStr.schema
            });
        }
        else if (result.sourceType == 2) {
            pnl = YZSoft.ViewManager.addView(me, 'YZSoft.esb.esb5.sap.Panel', {
                region: 'center',
                bodyStyle: 'background-color:transparent',
                border: false,
                title: Ext.String.format(RS.$('ESB_EditDataSource_Fmt'), 'SAP'),
                jointype: 'TheEdit',
                sourceId: result.sourceId,
                sourceName: result.sourceName,
                sourceType: result.sourceType,
                connectId: result.connectInfo.connectId,
                rfcName: result.sourceStr.query,
                caption: result.caption,
                parameterData: result.sourceStr.parameter,
                schemaData: result.sourceStr.schema
            });
        }
        else if (result.sourceType == 3) {
            pnl = YZSoft.ViewManager.addView(me, 'YZSoft.esb.esb5.sqlserver.Panel', {
                region: 'center',
                bodyStyle: 'background-color:transparent',
                border: false,
                title: Ext.String.format(RS.$('ESB_EditDataSource_Fmt'), 'SqlServer'),
                jointype: 'TheEdit',
                sourceId: result.sourceId,
                sourceName: result.sourceName,
                connectId: result.connectInfo.connectId,
                sourceType: result.sourceType,
                queryStr: result.sourceStr.query,
                caption: result.caption,
                parameterData: result.sourceStr.parameter,
                schemaData: result.sourceStr.schema
            });
        }
        else if (result.sourceType == 4) {
            pnl = YZSoft.ViewManager.addView(me, 'YZSoft.esb.esb5.oracle.Panel', {
                region: 'center',
                bodyStyle: 'background-color:transparent',
                border: false,
                title: Ext.String.format(RS.$('ESB_EditDataSource_Fmt'), 'Oracle'),
                jointype: 'TheEdit',
                sourceId: result.sourceId,
                sourceName: result.sourceName,
                connectId: result.connectInfo.connectId,
                sourceType: result.sourceType,
                queryStr: result.sourceStr.query,
                caption: result.caption,
                parameterData: result.sourceStr.parameter,
                schemaData: result.sourceStr.schema
            });
        }
        else if (result.sourceType == 5) {
            var arr = result.sourceStr.query.split('|');
            pnl = YZSoft.ViewManager.addView(me, 'YZSoft.esb.esb5.excel.Panel', {
                region: 'center',
                bodyStyle: 'background-color:transparent',
                border: false,
                title: Ext.String.format(RS.$('ESB_EditDataSource_Fmt'), 'Excel'),
                jointype: 'TheEdit',
                sourceId: result.sourceId,
                sourceName: result.sourceName,
                connectId: result.connectInfo.connectId,
                sourceType: result.sourceType,
                sheetName: arr[0],
                titleIndex: arr[1],
                caption: result.caption,
                parameterData: result.sourceStr.parameter,
                schemaData: result.sourceStr.schema
            });
        }
        else {
            return false;
        }
    },
    testSource: function () {
        var me = this;
        var items = me.dataview.selModel.getSelection()[0];
        if (items == null) {
            Ext.Msg.show({
                title: RS.$('ESB_TestingPrompt'),
                msg: RS.$('ESB_SelectDatasourceFirst_Validation'),
                buttons: Ext.Msg.OK
            });
            return false;
        }
        YZSoft.Ajax.request({
            url: 'YZSoft.Services.REST/ESB5/Source.ashx',
            params: { method: 'GetSourceInfo', sourceId: items.data.sourceId },
            waitMsg: { msg: RS.$('ESB_Connecting'), target: me, start: 0 },
            success: function (data) {
                //打开测试窗口
                var pnl = YZSoft.ViewManager.addView(me, 'YZSoft.esb.esb5.source.TestSource', {
                    jointype: 'TheTest',
                    sourceId: data.result.sourceId,
                    paramData: data.result.sourceStr.parameter
                });
            },
            failure: function (data) {
                Ext.Msg.show({
                    title: RS.$('ESB_DeletePrompt'),
                    msg: data.result.errorMessage,
                    buttons: Ext.Msg.OK
                });
            }
        });

    },
    delSource: function () {
        //删除数据源
        var me = this;
        var items = me.dataview.selModel.getSelection()[0];
        if (items == null) {
            Ext.Msg.show({
                title: RS.$('ESB_DeletePrompt'),
                msg: RS.$('ESB_SelectDatasourceFirst_Validation'),
                buttons: Ext.Msg.OK
            });
            return false;
        }
        Ext.Msg.show({
            title: RS.$('ESB_DeleteDatasource'),
            msg: RS.$('ESB_DeleteDatasourceCfm_Msg'),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;
                YZSoft.Ajax.request({
                    url: 'YZSoft.Services.REST/ESB5/Source.ashx',
                    params: {
                        method: 'DeleteSource',
                        sourceId: items.data.sourceId
                    },
                    waitMsg: {
                        msg: RS.$('All_Deleting'),
                        target: me,
                        start: 0
                    },
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