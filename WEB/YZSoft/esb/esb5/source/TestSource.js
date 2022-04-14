Ext.define('YZSoft.esb.esb5.source.TestSource', {
    extend: 'Ext.panel.Panel',
    //layout: 'border',
    title: RS.$('ESB_DatasourceTesting'),
    jointype:'',
    sourceId:'',
    paramData: [],
    constructor: function (config) {
        var me = this;
        //渲染页面
        Ext.apply(config, {
            tbar: [{
                iconCls: 'yz-glyph yz-glyph-e982',
                text: RS.$('All_Run'),
                scope: this,
                handler: function () {
                    me.onPostBack(me.paramData);
                }
            },{
                iconCls: 'yz-glyph yz-glyph-e612',
                text: RS.$('ESB_ResultList'),
                scope: this,
                handler: function () {
                    //关闭配置窗口
                    me.destroy();
                }
            }],
            listeners: {
                activate: function () {
                    //me.onPostBack(config.paramData);
                }
            }
        });
        this.callParent([config]);
    },
    onPostBack:function(data){
        var me = this;
        if (data.length>0) {
            me.onShowParamWin(data);
        }
        else{
            me.onRunService([]);
        }
    },
    onShowParamWin: function (data) {
        var me = this;
        var inputGrid = Ext.create('Ext.grid.Panel', {
            scrollable: true,
            plugins: Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            store: Ext.create('Ext.data.Store', {
                fields: ['columnName', 'rename', 'columnType', 'defaultValue'],
                data: data,
                proxy: {
                    type: 'memory'
                }
            }),
            columns: [{
                hideable: false,
                sortable: false,
                text: RS.$('All_ParameterName'),
                dataIndex: 'rename',
                flex: 1
            },{
                hideable: false,
                sortable: false,
                text: RS.$('All_PatameterType'),
                dataIndex: 'columnType',
                flex: 1
            },{
                hideable: false,
                sortable: false,
                text: RS.$('ESB_ParameterValue'),
                dataIndex: 'defaultValue',
                flex: 2,
                editor: true
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
                            columnName: item.data.columnName,
                            rename: item.data.rename,
                            defaultValue: item.data.defaultValue
                        });
                    });
                    me.onRunService(paramList);
                    showParamWin.close();
                }
            },{
                text: RS.$('All_Cancel'),
                scope: this,
                handler: function () {
                    showParamWin.close();
                }
            }]
        });
        var showParamWin = Ext.create('Ext.window.Window', { //------
            title: RS.$('All_ParamsIn'),
            width: 500,
            closemethod: 'hide',
            plain: true,
            modal: true
        });
        showParamWin.add(inputGrid);
        showParamWin.show();
    },
    onRunService: function (paramList) {
        var me = this;
        YZSoft.Ajax.request({
            method: 'POST',
            url: 'YZSoft.Services.REST/ESB5/Source.ashx',
            waitMsg: { msg: RS.$('ESB_Accessing'), target: me, start: 0 },
            params: { method: 'TestSource',sourceId:me.sourceId},
            jsonData:paramList,
            success: function (data) {
                 var grid = Ext.create('YZSoft.esb.esb5.src.grid.ResultPanel',{
                    layout:'fit',
                    data:data.result.children,
                    defaultSize:20,
                    jointype:me.jointype,
                    savePath:'YZSoft.Services.REST/ESB5/SqlServer.ashx',
                    scrollable: true,
                    multiSelect: true,
                    sortableColumns: false,
                    height:'100%'
                });
                me.removeAll();
                me.add(grid);
            },
            failure: function (data) {
                Ext.Msg.show({
                    title:RS.$('All_Error'),
                    msg:data.result.errorMessage,
                    buttons: Ext.Msg.OK
                });
            }
        });
    }

});