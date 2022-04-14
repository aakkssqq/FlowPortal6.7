
//配置数据字段列表
Ext.define('YZSoft.esb.esb5.src.grid.ResultPanel', {
    extend: 'Ext.grid.Panel',
    jointype: '',
    sourceId: '',
    sourceName: '',
    connectId: '',
    caption: '',
    data: '',
    savePath: '',
    defaultSize: 0,
    constructor: function (config) {
        var me = this;
        me.myfields = [];
        me.mycolumns = [];
        var cfg;
        if (config.data != undefined && config.data != '') {
            for (var key in config.data[0]) {
                me.myfields.push(key);
                var c = "{ header: '" + key + "', dataIndex: '" + key + "', flex: 1 }";
                me.mycolumns.push(c);
            }
            var btn;
            if (config.jointype != 'TheTest') {
                btn = Ext.create('Ext.Button', {
                    iconCls: 'yz-glyph yz-glyph-save',
                    text: RS.$('All_SaveDatasource'),
                    scope: this,
                    handler: function () {
                        me.onShowSaveWin();
                    }
                });
            }
            var store = Ext.create('Ext.data.Store', {
                fields: [me.myfields],
                pageSize: config.defaultSize,
                data: config.data,
                proxy: {
                    type: 'memory',
                    enablePaging: true
                }
            });

            var bbar = Ext.create('Ext.toolbar.Paging', {
                xtype: 'pagingtoolbar',
                pageSize: config.defaultSize,
                store: store,
                botder: 1,
                displayInfo: true,
                displayMsg: RS.$('ESB_Result_DisplayMessage')
            });

            cfg = {
                columns: eval('([' + me.mycolumns + '])'),
                store: store,
                buttons: [bbar, '->', btn]
            };
            Ext.apply(cfg, config);

            this.callParent([cfg]);
        }
        else {
            cfg = {};
            Ext.apply(cfg, config);

            this.callParent([cfg]);
        }
    },
    //弹出保存对话框
    onShowSaveWin: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>', win;
        //创建数据源面板
        me.addPanel = Ext.create('Ext.form.Panel', {
            layout: 'anchor',
            bodyPadding: 5,
            layout: 'form',
            defaults: {
                anchor: '100%'
            },
            defaultType: 'textfield',
            items: [{
                fieldLabel: RS.$('ESB_DatasourceNameShort'),
                name: 'sourceName',
                value: me.sourceName,
                emptyText: RS.$('ESB_SpecifyDatasourceName'),
                afterLabelTextTpl: required,
                allowBlank: false
            }, {
                fieldLabel: RS.$('All_Comments'),
                xtype: 'textareafield',
                name: 'caption',
                value: me.caption
            }],
            buttons: [{
                text: RS.$('All_Save'),
                cls: 'yz-btn-default',
                scope: this,
                handler: function () {
                    if (me.addPanel.getForm().isValid()) {
                        //访问服务
                        var sourceName = me.addPanel.getForm().findField('sourceName').getValue();
                        var caption = me.addPanel.getForm().findField('caption').getValue();
                        me.fireEvent('SaveSource', sourceName, caption);
                    }
                    else {
                        Ext.Msg.show({
                            title: RS.$('ESB_ConnectionPrompt'),
                            msg: RS.$('ESB_EnterForm'),
                            buttons: Ext.Msg.OK
                        });
                    }
                }
            }, {
                text: RS.$('All_Cancel'),
                scope: this,
                handler: function () {
                    me.showJoinWin.close();
                }
            }]
        });
        me.showJoinWin = Ext.create('Ext.window.Window', { //------
            title: RS.$('ESB_IsSaveDatasource'),
            width: 500,
            closemethod: 'hide',
            plain: true,
            modal: true
        });

        me.showJoinWin.add(me.addPanel);
        me.showJoinWin.show();
    },
    //关闭保存对话框
    onCloseSaveWin: function () {
        var me = this;
        me.showJoinWin.close();
    }
});