Ext.define('YZSoft.esb.esb5.sap.Panel', {
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
    rfcName: '',
    caption: '',
    parameterData: [],
    schemaData: [],
    requires: [
        'YZSoft.esb.esb5.src.model.Source',
        'YZSoft.esb.esb5.src.model.Connect'
    ],
    constructor: function (config) {
        var me = this;
        //rfc源
        me.rfcStore = Ext.create('Ext.data.Store', {
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
            store: me.rfcStore,
            scrollable: true,
            height: '600px',
            listeners: {
                scope: me,
                itemclick: function (view, record, item, index, e, eOpts) {
                    me.onGetParameter(record.data.name, me.connectId);
                }
            }
        });
        //查询输入框
        var queryText = Ext.create('Ext.form.field.Text', {
            xtype: 'textfield',
            name: 'query',
            value: config.rfcName,
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
        //右上（显示参数配置区域）
        me.upDiv = Ext.create('Ext.tab.Panel', {
            border: false,
            region: 'center',
            titleCollapse: true,
            collapsible: false,
            layout: 'fit'
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
            me.onShowParamTab(config.parameterData, config.rfcName);
            me.onShowSchemaTab(config.schemaData, config.rfcName);
            me.onJoinConnect(config.jointype, config.sourceId, config.connectId, config.rfcName);
        }
        else {
            me.queryTbar.disable();
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
                }
            }
        });
        joinPanel.show();
    },
    //连接服务
    onJoinConnect: function (jointype, sourceId, connectId, rfcName) {
        var me = this;
        YZSoft.Ajax.request({
            url: 'YZSoft.Services.REST/ESB5/Sap.ashx',
            params: { method: 'JoinService', jointype: jointype, sourceId: sourceId, connectId: connectId, rfcName: rfcName },
            success: function (data) {
                me.rfcStore.loadData(data.result.funcarray);
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
    //返回参数字段
    onGetParameter: function (rfcName, connectId) {
        var me = this;
        YZSoft.Ajax.request({
            method: 'POST',
            url: 'YZSoft.Services.REST/ESB5/Sap.ashx',
            params: { method: 'GetParameter', rfcName: rfcName, connectId: connectId },
            waitMsg: { msg: RS.$('ESB_GettingParams'), target: me, start: 0 },
            success: function (data) {
                me.rfcName = rfcName;
                me.onShowParamTab(data.result.parameter, rfcName);
                me.schemaData = data.result.schema;
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
    //显示输入参数面板
    onShowParamTab: function (data, rfcName) {
        var me = this;
        //输入参数源
        me.parameterStore = Ext.create('Ext.data.TreeStore', {
            fields: ['columnName', 'columnType', 'rename', 'defaultValue', 'isShow'],
            proxy: {
                type: 'memory',
                data: data,
                reader: {
                    type: 'json',
                    rootProperty: 'seedList'
                }
            }
        });
        me.parameterTree = Ext.create('YZSoft.esb.esb5.src.tree.ParameterPanel', {
            border: false,
            store: me.parameterStore
        })
        //填充选项卡
        var newTab = {
            layout: 'fit',
            border: false,
            title: Ext.String.format('{0}-{1}', RS.$('All_InParamsConfig'), rfcName),
            items: [me.parameterTree],
            tbar: [{
                text: RS.$('ESB_ConfigOutParams'),
                scope: this,
                handler: function () {
                    me.onShowSchemaTab(me.schemaData, rfcName);
                }
            }]
        };
        //清空参数面板
        me.upDiv.removeAll();
        //清空结果面板
        me.downDiv.removeAll();
        //收缩结果面板
        me.downDiv.collapse();
        //添加参数面板
        me.upDiv.add(newTab).show();
    },
    //显示输出参数面板
    onShowSchemaTab: function (data, rfcName) {
        var me = this;
        //输出参数源
        me.schemaStore = Ext.create('Ext.data.TreeStore', {
            fields: ['columnName', 'columnType', 'rename', 'isShow'],
            proxy: {
                type: 'memory',
                data: data,
                reader: {
                    type: 'json',
                    rootProperty: 'seedList'
                }
            }
        });
        //输出参数树
        me.schemaTree = Ext.create('YZSoft.esb.esb5.src.tree.SchemaPanel', {
            border: false,
            store: me.schemaStore
        });
        var newTab = {
            layout:'fit',
            title: Ext.String.format('{0}-{1}', RS.$('ESB_OutParamsConfig'), rfcName),
            border: false,
            items: [me.schemaTree],
            tbar: [{
                iconCls: 'yz-glyph yz-glyph-e982',
                text: RS.$('All_Run'),
                scope: this,
                handler: function () {
                    //输出参数
                    me.flag = true;
                    var schemaArray = me.onGetSchemaData();
                    if (me.flag) {
                        Ext.Msg.show({
                            title: RS.$('ESB_RunFailed'),
                            msg: RS.$('ESB_CheckShowColumn'),
                            buttons: Ext.Msg.OK
                        });
                        return false;
                    }
                    //输出参数
                    var parameterArray = me.onGetParamData();
                    me.onRunService(parameterArray, schemaArray);
                }
            }]
        };
        //清空参数面板
        if (me.upDiv.items.length > 1) {
            me.upDiv.remove(1);
        }
        //清空结果面板
        me.downDiv.removeAll();
        //收缩结果面板
        me.downDiv.collapse();
        //添加参数面板
        me.upDiv.add(newTab).show();
    },
    //访问服务
    onRunService: function (parameterArray, schemaArray) {
        var me = this;
        var array = {
            parameter: parameterArray,
            schema: schemaArray
        };
        YZSoft.Ajax.request({
            method: 'POST',
            url: 'YZSoft.Services.REST/ESB5/Sap.ashx',
            params: { method: 'GetResult', rfcName: me.rfcName, connectId: me.connectId },
            jsonData: [array],
            waitMsg: { msg: RS.$('ESB_Accessing'), target: me.rightDiv, start: 0 },
            success: function (data) {
                me.resultGrid = Ext.create('YZSoft.esb.esb5.src.grid.ResultPanel', {
                    data: data.result.children,
                    defaultSize: 10,
                    sourceName: me.sourceName,
                    caption: me.caption,
                    scrollable: true,
                    multiSelect: true,
                    sortableColumns: false,
                    height: 300,
                    listeners: {
                        SaveSource: function (sourceName, caption) {
                            me.onSaveSource(sourceName, caption, me.rfcName);
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
    //获取输入参数配置信息
    onGetParamData: function () {
        var me = this;
        //输出参数
        var parameterItems = me.parameterTree.getRootNode().childNodes;
        var data = [];
        Ext.each(parameterItems, function (item) {
            data.push(me.onRuturnParamJson(item));
        });
        return data;
    },
    //获取输出参数配置信息
    onGetSchemaData: function () {
        var me = this;
        var schemaItems = me.schemaTree.getRootNode().childNodes;
        var data = [];
        Ext.each(schemaItems, function (item) {
            if (item.data.isShow) {
                data.push(me.onReturnSchemaJson(item));
            }
        });
        return data;
    },
    //返回输入参数值
    onRuturnParamJson: function (root) {
        var me = this;
        //获取所有子项
        var paren = {};
        paren.columnName = root.data.columnName;
        paren.rename = root.data.rename;
        paren.value = root.data.defaultValue;
        paren.isShow = root.data.isShow;
        if (root.childNodes != null && root.childNodes.length > 0) {
            paren.children = [];
            Ext.each(root.childNodes, function (item) {
                paren.children.push(me.onRuturnParamJson(item));
            });
        }
        else {
            paren.children = null;
        }
        return paren;
    },
    //返回输出参数配置值
    onReturnSchemaJson: function (root) {
        var me = this;
        //获取所有子项
        var paren = {};
        paren.columnName = root.data.columnName;
        paren.rename = root.data.rename;
        paren.isShow = root.data.isShow;
        if (root.childNodes != null && root.childNodes.length > 0) {
            paren.children = [];
            Ext.each(root.childNodes, function (item) {
                paren.children.push(me.onReturnSchemaJson(item));
            });
        }
        else {
            paren.children = null;
            if (root.data.isShow) {
                me.flag = false;
            }
        }
        return paren;
    },
    //保存数据
    onSaveSource: function (sourceName, caption, rfcName) {
        var me = this;
        var array = {
            parameter: me.onGetParamData(),
            schema: me.onGetSchemaData()
        };
        YZSoft.Ajax.request({
            method: 'POST',
            url: 'YZSoft.Services.REST/ESB5/Sap.ashx',
            params: { method: 'SaveSource', jointype: me.jointype, connectId: me.connectId, sourceId: me.sourceId, sourceName: sourceName, caption: caption, rfcName: rfcName },
            jsonData: [array],
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