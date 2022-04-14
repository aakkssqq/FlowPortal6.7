/*
config:
tables
data
{
ServerName
CallProcess
CallDataMap
}
*/
Ext.define('YZSoft.bpm.propertypages.CallProcessCall', {
    extend: 'Ext.panel.Panel',
    referenceHolder: true,
    title: RS.$('Process_Title_ParamsIn'),
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
                    this.setTables(me.tables);
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
                    { text: RS.$('Process_CallProcess_ChildColumn'), dataIndex: 'ColumnName', width: 118 },
                    { text: RS.$('All_Type'), dataIndex: 'DataType', width: 80, formatter: 'dataType' },
                    { text: RS.$('Process_CallProcess_ParamFill'), dataIndex: 'DefaultValue', flex: 1, renderer: YZSoft.Render.renderCode5, editor: me.editorConfig }
                ]
            }
        });

        cfg = {
            items: [{
                xtype: 'label',
                text: RS.$('Process_CallProcess_FillTitle'),
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
            call = {},
            data = me.save();

        me.fireEvent('getCallProcess', call);

        me.fill({
            ServerName: call.ServerName,
            CallProcess: call.CallProcess,
            CallDataMap: data.CallDataMap
        });
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences(),
            serverName = Ext.String.trim(data.ServerName || ''),
            callProcess = Ext.String.trim(data.CallProcess || '');

        if (String.Equ(serverName, me.ServerName) &&
            String.Equ(callProcess, me.CallProcess))
            return;

        if (!callProcess)
            return;

        Ext.copyTo(me, data, 'ServerName,CallProcess');

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Process.ashx'),
            params: {
                method: 'GetProcessGlobalTableIdentitys',
                ServerName: data.ServerName,
                ProcessName: data.CallProcess
            },
            success: function (action) {
                me.grid.addTable({
                    tables: action.result,
                    fn: function (item) {
                        if (item.isTable) {
                        }
                        else {
                            var column = me.grid.findColumn(data.CallDataMap, item);
                            if (column)
                                Ext.copyTo(item, column, 'DefaultValue');
                            else {
                                Ext.apply(item, {
                                    DefaultValue: null
                                });
                            }
                        }
                    },
                    serverName: data.ServerName,
                    clear: true
                });
            }
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