Ext.define('YZSoft.esb.esb5.source.JoinPanel', {
    extend: 'Ext.window.Window', //222222
    requires: [
        'YZSoft.esb.esb5.src.model.Connect'
    ],
    layout: 'anchor',
    bodyBorder: false,
    formTitle: '',
    sourceType:'',
    connectId:'',
    constructor: function (config) {
        var me = this;
        me.store = Ext.create('Ext.data.JsonStore', {
            sorters: { property: 'updateTime', direction: 'DESC' },
            model: 'YZSoft.esb.esb5.src.model.Connect',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/ESB5/Source.ashx'),
                extraParams: {
                    method: 'GetConnectList'
                },
                reader: {
                    type: 'json'
                }
            }
        });
        //填充数据源
        me.store.load({
            params: { sourceType:config.sourceType} ,
            callback:function(records, options, success){
                me.joinPanel.getForm().findField('connectId').setValue(config.connectId);
            }
        });
        //连接面板
        me.joinPanel = Ext.create('Ext.form.Panel', {
            layout: 'form',
            defaults: {
                anchor: '100%'
            },
            defaultType: 'textfield',
            buttonAlign: 'center',
            bodyStyle: 'background-color:transparent',
            border: false,
            items: [{
                xtype: 'fieldset',
                title: config.formTitle,
                defaultType: 'textfield',
                padding: '20',
                defaults: {
                    width: '100%'
                },
                items: [{
                    xtype: 'combobox',
                    margin: 0,
                    name: 'connectId',
                    fieldLabel: RS.$('ESB_Connection'),
                    store: me.store,
                    displayField: 'connectName',
                    valueField: 'connectId',
                    emptyText: RS.$('ESB_SpecifyConnection_EmptyText'),
                    queryMode: 'local',
                    allowBlank: false,
                    editable: false,
                    triggerCls: 'yz-trigger-down',
                    //添加新按钮（点击新增数据源）
                    triggers: {
                        add: {
                            cls: 'yz-trigger-add',
                            handler: function () {
                                me.onShowAddConnect();
                            }
                        }
                    }
                }]
            }]
        });
        Ext.apply(config, {
            items: [me.joinPanel],
            buttons: [{
                text: RS.$('All_Cancel'),
                scope: this,
                handler: function () {
                    me.close();
                }
            },{
                text: RS.$('All_Connection'),
                cls:'yz-btn-default',
                scope: this,
                handler: function () {
                    if (me.joinPanel.getForm().isValid()) {
                        //访问服务
                        me.onJoinForm(me.joinPanel.getForm());
                    }
                    else {
                        Ext.Msg.show({
                            title:RS.$('ESB_ConnectionPrompt'),
                            msg:RS.$('ESB_EnterForm'),
                            buttons: Ext.Msg.OK
                        });
                    }
                }
            }]
        });
        me.callParent([config]);
    },
    onJoinForm:function(form){
        var me = this;
        var connectId = form.findField('connectId').getValue();
        me.fireEvent('opanConnect',connectId);
    },
    //弹出新增连接表单
    onShowAddConnect:function(){
        var me = this;
        var pnl;
        var title;
        var formWidth = 500;
        if (me.sourceType == 1) {
            pnl = Ext.create('YZSoft.esb.esb5.connect.JoinWebPanel', {
                closemethod: 'hide',
                plain: false,
                modal: true,
                formWidth: formWidth,
                title: Ext.String.format(RS.$('ESB_NewConnection'), 'WebService'),
                border: false,
                jointype: 'TheAdd',
                fn:function(str){
                    //回调函数
                    //1.刷新数据连接列表，并将新建的数据源进行赋值
                    me.store.load({
                        params: { method: 'GetConnectList',sourceType:me.sourceType} ,
                        callback:function(records, options, success){
                            me.joinPanel.getForm().findField('connectId').setValue(str);
                        }
                    });
                }
            });
        }
        else if (me.sourceType == 2) {
            pnl = Ext.create('YZSoft.esb.esb5.connect.JoinSapPanel', {
                closemethod: 'hide',
                plain: false,
                modal: true,
                formWidth: formWidth,
                title: Ext.String.format(RS.$('ESB_NewConnection'), 'SAP'),
                border: false,
                jointype: 'TheAdd',
                fn: function (str) {
                    //回调函数
                    //1.刷新数据连接列表，并将新建的数据源进行赋值
                    me.store.load({
                        params: { method: 'GetConnectList', sourceType: me.sourceType },
                        callback: function (records, options, success) {
                            me.joinPanel.getForm().findField('connectId').setValue(str);
                        }
                    });
                }
            });
        }
        else if (me.sourceType == 3) {
            pnl = Ext.create('YZSoft.esb.esb5.connect.JoinSqlPanel', {
                closemethod: 'hide',
                plain: false,
                modal: true,
                formWidth: formWidth,
                title: Ext.String.format(RS.$('ESB_NewConnection'), 'SqlServer'),
                border: false,
                jointype: 'TheAdd',
                fn: function (str) {
                    //回调函数
                    //1.刷新数据连接列表，并将新建的数据源进行赋值
                    me.store.load({
                        params: { method: 'GetConnectList', sourceType: me.sourceType },
                        callback: function (records, options, success) {
                            me.joinPanel.getForm().findField('connectId').setValue(str);
                        }
                    });
                }
            });
        }
        else if (me.sourceType == 4) {
            pnl = Ext.create('YZSoft.esb.esb5.connect.JoinOraclePanel', {
                closemethod: 'hide',
                plain: false,
                modal: true,
                formWidth: formWidth,
                title: Ext.String.format(RS.$('ESB_NewConnection'), 'Oracel'),
                border: false,
                jointype: 'TheAdd',
                fn: function (str) {
                    //回调函数
                    //1.刷新数据连接列表，并将新建的数据源进行赋值
                    me.store.load({
                        params: { method: 'GetConnectList', sourceType: me.sourceType },
                        callback: function (records, options, success) {
                            me.joinPanel.getForm().findField('connectId').setValue(str);
                        }
                    });
                }
            });
        }
        else if (me.sourceType == 5) {
            pnl = Ext.create('YZSoft.esb.esb5.connect.JoinExcelPanel', {
                closemethod: 'hide',
                plain: false,
                modal: true,
                formWidth: formWidth,
                title: Ext.String.format(RS.$('ESB_NewConnection'), 'Excel'),
                border: false,
                jointype: 'TheAdd',
                fn: function (str) {
                    //回调函数
                    //1.刷新数据连接列表，并将新建的数据源进行赋值
                    me.store.load({
                        params: { method: 'GetConnectList', sourceType: me.sourceType },
                        callback: function (records, options, success) {
                            me.joinPanel.getForm().findField('connectId').setValue(str);
                        }
                    });
                }
            });
        }
        else {
            return false;
        }
        //显示弹出窗口
        pnl.show();
    }
});