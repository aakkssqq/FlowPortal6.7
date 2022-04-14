Ext.define('YZSoft.esb.esb5.excel.Panel', {
    extend: 'Ext.panel.Panel',
    layout: 'border',
    title: RS.$('ESB_SettingDataSource_Title'),
    defaults: {
        collapsible: true,
        split: true,
        bodyPadding: 15
    },
    jointype: '',
    sourceId: '',
    sourceName: '',
    sourceType: '',
    connectId: '',
    caption: '',
    sheetName: '',
    titleIndex: 1,
    parameterData: [],
    schemaData: [],
    requires: [
        'YZSoft.esb.esb5.src.model.Source',
        'YZSoft.esb.esb5.src.model.Connect'
    ],
    constructor: function (config) {
        var me = this;
        /*************************************************左侧面板*******************************************************/
        //sheet源
        me.sheetStore = Ext.create('Ext.data.Store', {
            fields: ['name'],
            proxy: {
                type: 'memory'
            }
        });
        //创建视图
        var listView = Ext.create('Ext.view.View', {
            type: 'type',
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '<div class="process">',
                        '<ul><li><a href="#" class="yz-process"><strong>{name}</strong></a></li></ul>',
                    '</div><br/>',
                '</tpl>'
            ),
            itemSelector: 'div.process',
            overItemCls: 'process-hover',
            multiSelect: false,
            store: me.sheetStore,
            scrollable: true,
            height: '600px',
            listeners: {
                scope: me,
                itemclick: function (view, record, item, index, e, eOpts) {
                    titleIndexText.setValue(1);
                    me.onGetSchema(record.data.name, 1, me.jointype, me.sourceId, me.connectId);
                    me.titleIndexTbar.enable();
                }
            }
        });
        //查询输入框
        var queryText = Ext.create('Ext.form.field.Text', {
            xtype: 'textfield',
            name: 'query',
            value: config.sheetName,
            width: '80%'
        });
        //连接按钮
        me.connectTbar = Ext.create('Ext.toolbar.Toolbar', {
            border: false,
            items: [{
                iconCls: 'yz-glyph yz-glyph-ea2d',
                text: RS.$('All_Connection'),
                scope: this,
                handler: function () {
                    me.onShowJoinWin();
                }
            }]
        });
        //查询按钮
        me.queryTbar = Ext.create('Ext.toolbar.Toolbar', {
            border: false,
            items: [
                queryText,
                {
                    iconCls: 'yz-glyph yz-glyph-search',
                    text: RS.$('All_SearchQuery'),
                    scope: this,
                    handler: function () {
                        me.onJoinConnect(me.jointype, me.sourceId, me.connectId, queryText.getValue());
                    }
                }
            ]
        });
        //左侧（显示连接区域）
        me.leftDiv = Ext.create('Ext.panel.Panel', {
            border: false,
            region: 'west',
            width: '20%',
            collapsible: false,
            title: RS.$('All_ConnectToServer'),
            layout: 'fit',
            items: [listView],
            tbar: {
                xtype: 'container',
                items: [me.connectTbar, me.queryTbar]
            }
        });
        /*************************************************右上面板*******************************************************/
        //结构
        me.schemaStore = Ext.create('Ext.data.Store', {
            fields: ['columnName', 'columnType', 'inputRename', 'defaultValue', 'inputIsShow', 'outputRename', 'outputIsShow'],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: 'seedList'
                }
            }
        });
        //EXCEL结构
        me.schemaGrid = Ext.create('Ext.grid.Panel', {
            border: false,
            xtype: 'cell-editing',
            scrollable: true,
            plugins: Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            store: me.schemaStore,
            columns: [{
                text: RS.$('All_ColumnName'),
                dataIndex: 'columnName',
                flex: 1
            }, {
                text: RS.$('All_ColumnType'),
                dataIndex: 'columnType',
                flex: 1
            }, {
                text: RS.$('ESB_Excel_Filters'),
                columns: [{
                    text: RS.$('All_Rename'),
                    dataIndex: 'inputRename',
                    editor: true,
                    width: 250
                }, {
                    text: RS.$('ESB_ParameterValue'),
                    dataIndex: 'defaultValue',
                    editor: true,
                    width: 250
                }, {
                    xtype: 'checkcolumn',
                    header: RS.$('ESB_IsSettting'),
                    dataIndex: 'inputIsShow',
                    width: 100
                }]
            }, {
                text: RS.$('ESB_DisplayColumn'),
                columns: [{
                    text: RS.$('All_Rename'),
                    dataIndex: 'outputRename',
                    editor: true,
                    width: 250
                }, {
                    xtype: 'checkcolumn',
                    header: RS.$('ESB_IsShow'),
                    dataIndex: 'outputIsShow',
                    width: 100
                }]
            }]
        });
        //标题行修改
        var titleIndexText = Ext.create('Ext.form.field.Number', {
            xtype: 'numberfield',
            fieldLabel: RS.$('ESB_Excel_TitleIndex'),
            name: 'titleIndex',
            value: me.titleIndex,
            minValue: 1,
            allowBlank: false
        });
        //标题行修改按钮
        me.titleIndexTbar = Ext.create('Ext.toolbar.Toolbar', {
            border: false,
            width: '100%',
            items: [
                titleIndexText,
                {
                    iconCls: 'yz-glyph yz-glyph-e627',
                    text: RS.$('ESB_SettingConfirm'),
                    scope: this,
                    handler: function () {
                        var index = titleIndexText.getValue();
                        if (me.titleIndex != index) {
                            //重新查询
                            me.onGetSchema(me.sheetName, index, me.jointype, me.sourceId, me.connectId);
                        }
                    }
                }, '-', {
                    iconCls: 'yz-glyph yz-glyph-e982',
                    text: RS.$('All_Run'),
                    scope: this,
                    handler: function () {
                        me.onRunService();
                    }
                }]
        });
        //右上（显示参数配置区域）
        me.upDiv = Ext.create('Ext.panel.Panel', {
            border: false,
            region: 'center',
            titleCollapse: true,
            collapsible: false,
            layout: 'fit',
            tbar: [me.titleIndexTbar],
            items: [me.schemaGrid]
        });
        //右下（显示结果区域）
        me.downDiv = Ext.create('Ext.panel.Panel', {
            border: false,
            region: 'south',
            titleCollapse: true,
            collapsed: true,
            collapsible: true,
            split: true,
            bodyPadding: 15,
            title: RS.$('ESB_ResultView'),
            height: '60%',
            layout: 'fit'
        });
        //右侧（显示操作区域）
        me.rightDiv = Ext.create('Ext.panel.Panel', {
            border: false,
            region: 'center',
            title: RS.$('ESB_ParamsConfig'),
            layout: 'border',
            collapsible: false,
            bodyPadding: 0,
            items: [me.upDiv, me.downDiv]
        });
        //编辑模式下的显示逻辑
        if (config.jointype == 'TheEdit') {
            me.onJoinConnect(config.jointype, config.sourceId, config.connectId, config.sheetName);
        }
        else {
            me.queryTbar.disable();
            me.titleIndexTbar.disable();
        }
        //渲染页面
        Ext.apply(config, {
            tbar: [{
                iconCls: 'yz-glyph yz-glyph-e612',
                text: RS.$('ESB_ResultList'),
                scope: this,
                handler: function () {
                    //关闭配置窗口
                    me.destroy();
                }
            }],
            items: [
                me.leftDiv, me.rightDiv
            ]
        });
        this.callParent([config]);
    },
    //显示选择连接窗口
    onShowJoinWin: function () {
        var me = this;
        var joinPanel = Ext.create('YZSoft.esb.esb5.source.JoinPanel', {
            width: 500,
            closemethod: 'hide',
            plain: false,
            modal: true,
            title: RS.$('All_ConnectToServer'),
            sourceType: me.sourceType,
            sourceId: me.sourceId,
            sourceName: me.sourceName,
            connectId: me.connectId,
            //设置监听事件
            listeners: {
                opanConnect: function (connectId) {
                    //连接到数据库
                    me.connectId = connectId;

                    me.queryTbar.enable();
                    //关闭面板
                    joinPanel.close();
                    //连接
                    me.onJoinConnect(me.jointype, me.sourceId, connectId, '');

                    //清除结构
                    me.schemaGrid.getStore().removeAll();
                    //清除结果
                    me.downDiv.removeAll();
                    //折叠结果面板
                    me.downDiv.collapse();
                    //禁用运行按钮
                    me.titleIndexTbar.disable();
                }
            }
        });
        joinPanel.show();
    },
    //连接服务
    onJoinConnect: function (jointype, sourceId, connectId, sheetName) {
        var me = this;
        YZSoft.Ajax.request({
            url: 'YZSoft.Services.REST/ESB5/Excel.ashx',
            params: { method: 'JoinService', jointype: jointype, sourceId: sourceId, connectId: connectId, sheetName: sheetName },
            success: function (data) {
                me.sheetStore.loadData(data.result.sheetArray);
                me.onShowSchema(data.result.schema);
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
    //返回excel结构
    onGetSchema: function (sheetName, titleIndex, jointype, sourceId, connectId) {
        var me = this;
        YZSoft.Ajax.request({
            method: 'POST',
            url: 'YZSoft.Services.REST/ESB5/Excel.ashx',
            params: {
                method: 'GetSchema',
                sheetName: sheetName,
                titleIndex: titleIndex,
                jointype: jointype,
                sourceId: sourceId,
                connectId: connectId
            },
            waitMsg: {
                msg: RS.$('ESB_GettingParams'),
                target: me,
                start: 0
            },
            success: function (data) {
                me.sheetName = sheetName;
                me.titleIndex = titleIndex;
                me.onShowSchema(data.result.schema);
                //清除结果
                me.downDiv.removeAll();
                //折叠结果面板
                me.downDiv.collapse();
            },
            failure: function (data) {
                Ext.Msg.show({
                    title: RS.$('ESB_AccessFailed'),
                    msg: data.result.errorMessage,
                    buttons: Ext.Msg.OK
                });
                return false;
            }
        });
    },
    //显示excel结构
    onShowSchema: function (data) {
        var me = this;
        //输出参数源
        me.schemaStore.loadData(data);
    },
    //返回配置后的数据
    onReturnSchema: function () {
        var me = this;
        var schemaRows = me.schemaGrid.getStore().data.items;
        var array = [];
        me.falg = true;
        Ext.each(schemaRows, function (item) {
            var paren = {};
            if (item.data.outputIsShow) {
                me.falg = false;
            }
            paren.columnName = item.data.columnName;
            paren.columnType = item.data.columnType;
            paren.inputRename = item.data.inputRename;
            paren.defaultValue = item.data.defaultValue;
            paren.inputIsShow = item.data.inputIsShow;
            paren.outputRename = item.data.outputRename;
            paren.outputIsShow = item.data.outputIsShow;
            array.push(paren);
        });
        return array;
    },
    //访问数据
    onRunService: function () {
        var me = this;
        var array = me.onReturnSchema();
        if (me.falg) {
            Ext.Msg.show({
                title: RS.$('ESB_RunFailed'),
                msg: RS.$('ESB_CheckShowColumn'),
                buttons: Ext.Msg.OK
            });
            return false;
        }
        YZSoft.Ajax.request({
            method: 'POST',
            url: 'YZSoft.Services.REST/ESB5/Excel.ashx',
            params: { method: 'GetResult', sheetName: me.sheetName, titleIndex: me.titleIndex,connectId: me.connectId},
            jsonData: array,
            waitMsg: { msg: RS.$('ESB_Accessing'), target: me.rightDiv, start: 0 },
            success: function (data) {
                me.resultGrid = Ext.create('YZSoft.esb.esb5.src.grid.ResultPanel', {
                    data: data.result.children,
                    savePath: 'YZSoft.Services.REST/ESB5/Excel.ashx',
                    defaultSize: 10,
                    jointype: me.jointype,
                    sourceId: me.sourceId,
                    sourceName: me.sourceName,
                    caption: me.caption,
                    connectId: me.connectId,
                    scrollable: true,
                    multiSelect: true,
                    sortableColumns: false,
                    height: 300,
                    listeners: {
                        SaveSource: function (sourceName, caption) {
                            me.onSaveSource(sourceName, caption);
                        }
                    }
                });
                me.downDiv.removeAll();
                me.downDiv.add(me.resultGrid);
                //展开结果面板
                me.downDiv.expand();
            },
            failure: function (data) {
                Ext.Msg.show({
                    title: RS.$('ESB_AccessFailed'),
                    msg: data.result.errorMessage,
                    buttons: Ext.Msg.OK
                });
                return false;
            }
        });
    },
    //保存数据
    onSaveSource: function (sourceName, caption) {
        var me = this;
        var array = me.onReturnSchema();
        YZSoft.Ajax.request({
            method: 'POST',
            url: 'YZSoft.Services.REST/ESB5/Excel.ashx',
            params: { method: 'SaveSource', jointype: me.jointype, connectId: me.connectId, sourceId: me.sourceId, sourceName: sourceName, caption: caption, sheetName: me.sheetName, titleIndex: me.titleIndex },
            jsonData: array,
            waitMsg: { msg: RS.$('All_Saving'), target: me.resultGrid.showJoinWin, start: 0 },
            success: function (data) {
                me.resultGrid.onCloseSaveWin();
                me.destroy();
            },
            failure: function (data) {
                Ext.Msg.show({
                    title: RS.$('All_SaveFailed'),
                    msg: data.result.errorMessage,
                    buttons: Ext.Msg.OK
                });
            }
        });
    }
});