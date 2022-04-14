//SQL源操作面板
Ext.define('YZSoft.esb.esb5.sqlserver.Panel', {
    extend: 'Ext.panel.Panel',
    title: RS.$('ESB_SettingDataSource_Title'),
    layout: 'border',
    defaults: {
        collapsible: true,
        split: true,
        bodyPadding: 15
    },
    jointype: 'TheAdd',
    sourceId: '',
    sourceName: '',
    sourceType: '',
    connectId: '',
    queryStr: '',
    caption: '',
    parameterData: [],
    schemaData: [],
    tableData: [],
    viewData: [],
    requires: [
        'YZSoft.esb.esb5.src.model.Source',
        'YZSoft.esb.esb5.src.model.Connect'
    ],
    constructor: function (config) {
        var me = this;
        //查询输入框
        var queryText = Ext.create('Ext.form.field.Text', {
            xtype: 'textfield',
            name: 'query',
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
            items: [queryText, {
                iconCls: 'yz-glyph yz-glyph-search',
                text: RS.$('All_SearchQuery'),
                scope: this,
                handler: function () {
                    //打开连接
                    me.onJoinConnect(me.jointype, me.sourceId, me.connectId, queryText.getValue());
                }
            }]
        });
        //表
        me.tableStore = Ext.create('Ext.data.Store', {
            sorters: { property: 'name', direction: 'ASC' },
            fields: ['name']
        });
        //视图
        me.viewStore = Ext.create('Ext.data.Store', {
            sorters: { property: 'name', direction: 'ASC' },
            fields: ['name']
        });
        //table列表
        var tableList = Ext.create('Ext.view.View', {
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
            store: me.tableStore,
            scrollable: true,
            listeners: {
                scope: me,
                itemclick: function (view, record, item, index, e, eOpts) {
                    var name = record.data.name;
                    me.onSetValue(name);
                }
            }
        });
        //view列表
        var viewList = Ext.create('Ext.view.View', {
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
            store: me.viewStore,
            scrollable: true,
            listeners: {
                scope: me,
                itemclick: function (view, record, item, index, e, eOpts) {
                    var name = record.data.name;
                    me.onSetValue(name);
                }
            }
        });
        //tab列表
        me.tabList = Ext.create('Ext.tab.Panel', {
            border: false,
            plain: true,
            defaults: {
                bodyPadding: 10,
                scrollable: true
            },
            items: [{
                border: false,
                title: RS.$('All_Table'),
                items: tableList,
                scrollable: true,
                height: 530,
                deferredRender: true
            }, {
                border: false,
                title: RS.$('All_View'),
                items: viewList,
                scrollable: true,
                height: 530,
                deferredRender: true
            }]
        });
        //左侧（显示连接区域）
        me.leftDiv = Ext.create('Ext.panel.Panel', {
            border: false,
            region: 'west',
            width: '20%',
            collapsible: false,
            title: RS.$('All_ConnectToServer'),
            layout: 'fit',
            //items: [me.tabList],
            tbar: {
                xtype: 'container',
                items: [me.connectTbar, me.queryTbar]
            }
        });
        //右上（显示参数配置区域）
        //右键菜单
        var contextmenu = Ext.create('Ext.menu.Menu', {
            items: [{
                text: RS.$('All_AddTable'),
                handler: function (e) {
                    me.onShowTableWin();
                }
            }]
        });
        me.edtCode = Ext.create('Ext.form.field.TextArea', {
            fieldStyle: 'font-size:15px;',
            listeners: {
                render: function (tag) {
                    tag.getEl().on("contextmenu", function (e) {
                        e.preventDefault();
                        contextmenu.showAt(e.getXY());
                    })
                }
            }
        });
        //标题行修改按钮
        me.runTbar = Ext.create('Ext.toolbar.Toolbar', {
            border: false,
            width: '100%',
            items: [{
                iconCls: 'yz-glyph yz-glyph-e982',
                text: RS.$('All_Run'),
                scope: this,
                handler: function () {
                    me.onAnalysisSql();
                }
            }]
        });
        //右上
        me.upDiv = Ext.create('Ext.panel.Panel', {
            border: false,
            region: 'center',
            titleCollapse: true,
            collapsible: false,
            layout: 'fit',
            items: [me.edtCode],
            tbar: [me.runTbar]
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
            me.edtCode.setValue(config.queryStr);
            me.leftDiv.add(me.tabList);
            me.onJoinConnect(config.jointype, config.sourceId, config.connectId, '');
        }
        else {
            me.queryTbar.disable();
            me.runTbar.disable();
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
                    me.runTbar.enable();
                    //关闭面板
                    joinPanel.close();
                    //打开连接
                    me.onJoinConnect(me.jointype, me.sourceId, me.connectId, '');
                }
            }
        });
        joinPanel.show();
    },
    //显示列表
    onShowTableWin: function () {
        var me = this;
        var tableStore = Ext.create('Ext.data.Store', {
            sorters: { property: 'name', direction: 'ASC' },
            fields: ['name'],
            data: me.tableData
        });
        var viewStore = Ext.create('Ext.data.Store', {
            sorters: { property: 'name', direction: 'ASC' },
            fields: ['name'],
            data: me.viewData
        });
        var tableGrid = Ext.create('Ext.grid.Panel', {
            border: false,
            store: tableStore,
            hideHeaders: true,
            scrollable: true,
            columns: [{
                hideable: false,
                sortable: false,
                dataIndex: 'name',
                flex: 1
            }],
            listeners: {
                itemdblclick: function (grid, record, item, rowIndex, e, eOpts) {
                    var name = record.data.name;
                    me.onSetValue(name);
                    showStructWin.close();
                }
            }
        });
        var viewGird = Ext.create('Ext.grid.Panel', {
            border: false,
            store: viewStore,
            width: '100%',
            hideHeaders: true,
            scrollable: true,
            columns: [{
                hideable: false,
                sortable: false,
                dataIndex: 'name',
                flex: 1
            }],
            listeners: {
                itemdblclick: function (grid, record, item, rowIndex, e, eOpts) {
                    var name = record.data.name;
                    me.onSetValue(name);
                    showStructWin.close();
                }
            }
        });
        var structTab = Ext.create('Ext.tab.Panel', {
            region: 'west',
            activeTab: 0,
            border: 1,
            plain: true,
            layout: 'fit',
            items: [{
                title: RS.$('All_Table'),
                items: tableGrid,
                scrollable: true,
                height: 530,
                deferredRender: true
            }, {
                title: RS.$('All_View'),
                items: viewGird,
                scrollable: true,
                height: 530,
                deferredRender: true
            }]
        });
        var showStructWin = Ext.create('Ext.window.Window', { //------
            title: RS.$('All_AddTable'),
            width: 500,
            height: 600,
            closemethod: 'hide',
            plain: true,
            modal: true
        });
        showStructWin.add(structTab);
        showStructWin.show();
    },
    //解析输入参数
    onAnalysisSql: function () {
        var me = this;
        var queryStr = me.edtCode.getValue().trim();
        if (!queryStr)
            return;

        YZSoft.Ajax.request({
            url: 'YZSoft.Services.REST/ESB5/SqlServer.ashx',
            params: { method: 'GetParameter', jointype: me.jointype, queryStr: queryStr },
            success: function (data) {
                me.onShowParameterWin(queryStr, data.result.children);
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
    //解析并显示输入参数
    onShowParameterWin: function (queryStr, paramData) {
        var me = this;
        var paramList = [];
        if (paramData.length > 0) {
            var inputGrid = Ext.create('Ext.grid.Panel', {
                scrollable: true,
                plugins: Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                }),
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'rename', 'value', 'isShow'],
                    data: paramData,
                    proxy: {
                        type: 'memory'
                    }
                }),
                columns: [{
                    hideable: false,
                    sortable: false,
                    text: RS.$('All_ColumnName'),
                    dataIndex: 'name',
                    flex: 2
                }, {
                    hideable: false,
                    sortable: false,
                    text: RS.$('All_Rename'),
                    dataIndex: 'rename',
                    flex: 2,
                    editor: true
                }, {
                    hideable: false,
                    sortable: false,
                    text: RS.$('All_Value'),
                    dataIndex: 'value',
                    flex: 3,
                    editor: true
                }, {
                    hideable: false,
                    sortable: false,
                    xtype: 'checkcolumn',
                    header: RS.$('All_Select'),
                    dataIndex: 'isShow',
                    flex: 1
                }],
                buttons: [{
                    text: RS.$('All_Run'),
                    scope: this,
                    handler: function () {
                        //执行sql语句
                        var paramList = [];
                        var girdRows = inputGrid.getStore().data.items;
                        Ext.each(girdRows, function (item) {
                            paramList.push({
                                columnName: item.data.name,
                                rename: item.data.rename,
                                defaultValue: item.data.value,
                                isShow: item.data.isShow
                            });
                        });
                        me.onRunService(queryStr, paramList);
                        showParamWin.close();
                    }
                }, {
                    text: RS.$('All_Cancel'),
                    scope: this,
                    handler: function () {
                        showParamWin.close();
                    }
                }]
            });
            showParamWin = Ext.create('Ext.window.Window', { //------
                title: RS.$('All_ParamsIn'),
                width: 500,
                closemethod: 'hide',
                plain: true,
                modal: true
            });
            showParamWin.add(inputGrid);
            showParamWin.show();
        }
        else {
            me.onRunService(queryStr, []);
        }
    },
    //插入值
    onSetValue: function (text) {
        var me = this;
        var dom = me.edtCode.inputEl.dom;
        if (dom.selectionStart || dom.selectionStart === 0) {
            var startPos = dom.selectionStart,
            endPos = dom.selectionEnd,
            value = me.edtCode.getValue();
            me.edtCode.setValue(value.substring(0, startPos) + text + value.substring(endPos, value.length));
            dom.selectionStart = startPos + (me.selectInserting ? 0 : text.length);
            dom.selectionEnd = startPos + text.length;
        }
        else if (document.selection) {
            dom.focus();
            var sel = document.selection.createRange();
            sel.text = text;
        } else {
            me.edtCode.setValue(value + text);
        }
    },
    //连接服务
    onJoinConnect: function (jointype, sourceId, connectId, name) {
        var me = this;
        YZSoft.Ajax.request({
            url: 'YZSoft.Services.REST/ESB5/SqlServer.ashx',
            params: { method: 'JoinService', jointype: jointype, sourceId: sourceId, connectId: connectId, name: name },
            success: function (data) {
                me.tableData = data.result.table;
                me.viewData = data.result.view;
                me.tableStore.loadData(data.result.table);
                me.viewStore.loadData(data.result.view);
                me.leftDiv.add(me.tabList);
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
    //返回结果
    onRunService: function (queryStr, paramList) {
        if (!queryStr)
            return;

        var me = this;
        me.parameterData = paramList;
        me.queryStr = queryStr;
        YZSoft.Ajax.request({
            method: 'POST',
            url: 'YZSoft.Services.REST/ESB5/SqlServer.ashx',
            waitMsg: { msg: RS.$('ESB_Accessing'), target: me.rightDiv, start: 0 },
            params: { method: 'RunSql', queryStr: queryStr, connectId: me.connectId },
            jsonData: paramList,
            success: function (data) {
                me.resultGrid = Ext.create('YZSoft.esb.esb5.src.grid.ResultPanel', {
                    data: data.result.children,
                    defaultSize: 20,
                    jointype: me.jointype,
                    sourceId: me.sourceId,
                    sourceName: me.sourceName,
                    caption: me.caption,
                    connectId: me.connectId,
                    savePath: 'YZSoft.Services.REST/ESB5/SqlServer.ashx',
                    scrollable: true,
                    multiSelect: true,
                    sortableColumns: false,
                    height: 300,
                    listeners: {
                        SaveSource: function (sourceName, caption) {
                            me.onSaveSource(sourceName, caption, queryStr);
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
                    title: RS.$('All_Error'),
                    msg: data.result.errorMessage,
                    buttons: Ext.Msg.OK
                });
            }
        });
    },
    //保存数据
    onSaveSource: function (sourceName, caption) {
        var me = this;
        var schemaList = [];
        var resultRows = me.resultGrid.columns;
        Ext.each(resultRows, function (item) {
            schemaList.push({
                columnName: item.text,
                rename: item.text,
                defaultValue: '',
                isShow: true
            });
        });
        var array = {
            parameter: me.parameterData,
            schema: schemaList
        };

        YZSoft.Ajax.request({
            method: 'POST',
            url: 'YZSoft.Services.REST/ESB5/SqlServer.ashx',
            params: { method: 'SaveSource', jointype: me.jointype, connectId: me.connectId, sourceId: me.sourceId, sourceName: sourceName, caption: caption, queryStr: me.queryStr },
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
})