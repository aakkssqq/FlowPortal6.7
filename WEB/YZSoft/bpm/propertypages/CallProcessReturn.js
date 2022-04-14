/*
config:
data
{
tables
ReturnDataMap
}
*/
Ext.define('YZSoft.bpm.propertypages.CallProcessReturn', {
    extend: 'Ext.panel.Panel',
    referenceHolder: true,
    title: RS.$('Process_Title_Return'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.editorConfig = {
            xclass: 'YZSoft.src.form.field.CodeField5',
            listeners: {
                beforeedit: function (context) {
                    this.context = context;
                    this.serverName = me.ServerName;
                    this.setTables(me.childProcessTables);
                    this.setValueType(context.record.data.DataType);
                },
                selected: function (value) {
                    me.grid.cellEditing.cancelEdit();
                    this.context.record.set(this.context.column.dataIndex, value);
                    me.grid.cellEditing.startEdit(this.context.record, this.context.column);
                }
            }
        };

        me.grid = Ext.create('YZSoft.bpm.src.grid.DataSetSchemaGrid', {
            region: 'center',
            border: true,
            flex: 1,
            tablePanelConfig: {
                editable: false
            },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { dataIndex: '', width: 32, resizable: false, tdCls: 'yz-grid-cell-static' },
                    { text: RS.$('Process_Return_ParentColumn'), dataIndex: 'ColumnName', width: 118 },
                    { text: RS.$('All_Type'), dataIndex: 'DataType', width: 80, formatter: 'dataType' },
                    { text: RS.$('Process_Return_ParamFill'), dataIndex: 'DefaultValue', flex: 1, renderer: YZSoft.Render.renderCode5, editor: me.editorConfig }
                ]
            }
        });

        cfg = {
            items: [{
                xtype: 'label',
                text: RS.$('Process_Return_FillTitle'),
                style: 'display:block',
                margin: '0 0 6 0'
            }, me.grid
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            beforeactivate: 'onPanelShow'
        });

        if (config.data)
            me.fill(config.data);
    },

    onPanelShow: function (panel, eOpts) {
        var me = this,
            call = {};

        me.fireEvent('getCallProcess', call);

        var me = this,
            refs = me.getReferences(),
            serverName = Ext.String.trim(call.ServerName || ''),
            callProcess = Ext.String.trim(call.CallProcess || '');

        if (String.Equ(serverName, me.ServerName) &&
            String.Equ(callProcess, me.CallProcess))
            return;

        if (!callProcess)
            return;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Process.ashx'),
            params: {
                method: 'GetProcessGlobalTableIdentitys',
                ServerName: call.ServerName,
                ProcessName: call.CallProcess
            },
            success: function (action) {
                Ext.copyTo(me, call, 'ServerName,CallProcess');
                me.childProcessTables = action.result;
            }
        });
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        me.grid.addTable({
            tables: data.tables,
            fn: function (item) {
                if (item.isTable) {
                }
                else {
                    var column = me.grid.findColumn(data.ReturnDataMap, item);
                    if (column)
                        Ext.copyTo(item, column, 'DefaultValue');
                    else {
                        Ext.apply(item, {
                            DefaultValue: null
                        });
                    }
                }
            },
            clear:true
        });
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = {
            Tables: me.grid.save([
                'DataSourceName',
                'TableName'
                ], [
                'ColumnName',
                'DefaultValue'
            ], function (table) {
                return true;
            }, function (column) {
                return column.DefaultValue === null;
            }, true)
        }

        return rv;
    }
});