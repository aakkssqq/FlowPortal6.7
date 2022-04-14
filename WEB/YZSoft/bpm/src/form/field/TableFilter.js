/*
config
tables:
[{
"DataSourceName": "Default",
"TableName": "A",
"IsRepeatableTable": true,
},{
"DataSourceName": "Default",
"TableName": "B",
"IsRepeatableTable": true,
}]
tableIdentity:
{
"DataSourceName": "Default",
"TableName": "A",
"IsRepeatableTable": true,
}
value:
{
"Params": [
{
"ParamName": "TaskID",
"Value": 11
},
{
"ParamName": "A1",
"Value": "22"
}
]
}
*/
Ext.define('YZSoft.bpm.src.form.field.TableFilter', {
    extend: 'YZSoft.src.form.FieldContainer',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    height: 120,
    config: {
        value: ''
    },

    constructor: function (config) {
        var me = this;

        me.grid = Ext.create('YZSoft.bpm.src.grid.DataSetSchemaGrid', {
            border: true,
            flex: 1,
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { text: RS.$('All_DataField'), dataIndex: 'ColumnName', width: 118, tdCls: 'yz-grid-cell-static' },
                    { text: RS.$('All_FilterWith'), dataIndex: 'DefaultValue', flex: 1, renderer: YZSoft.Render.renderCode5 }
                ]
            }
        });

        me.btnEdit = Ext.create('Ext.button.Button', {
            text: RS.$('All_Edit'),
            handler: function () {
                Ext.create('YZSoft.bpm.src.dialogs.TableFilterDlg', {
                    title: Ext.String.format('{0} - {1}', RS.$('All_TableFilter'), me.tableIdentity.TableName),
                    autoShow: true,
                    tables: me.tables,
                    tableIdentity: me.tableIdentity,
                    value: me.value,
                    fn: function (value) {
                        me.setValue(value);
                    }
                });
            }
        });

        me.btnEmpty = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_ClearEmpty'),
            store: me.grid.getStore(),
            updateStatus: function () {
                this.setDisabled(me.grid.getStore().getCount() == 0);
            },
            handler: function () {
                Ext.Msg.show({
                    title: RS.$('All_Alert_Title'),
                    msg: RS.$('Process_ClearFilterCfm_Msg'),
                    buttons: Ext.Msg.OKCANCEL,
                    defaultButton: 'cancel',
                    icon: Ext.Msg.INFO,
                    fn: function (btn, text) {
                        if (btn != 'ok')
                            return;

                        me.grid.store.removeAll();
                        me.value.Params = [];
                    }
                });
            }
        });

        var cfg = {
            items: [me.grid, {
                xtype: 'panel',
                padding: '0 0 0 10',
                bodyStyle: 'background-color:transparent',
                layout: 'vbox',
                defaults: {
                    padding: '5 10',
                    margin: '0 0 3 0'
                },
                items: [
                    me.btnEdit,
                    me.btnEmpty
                ]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    setValue: function (value) {
        var me = this,
            params = [];

        me.value = value;

        Ext.each(value.Params, function (param) {
            params.push({
                ColumnName: param.ParamName,
                DefaultValue: param.Value
            });
        });

        me.grid.store.removeAll();
        me.grid.store.add(params);
    },

    getValue: function () {
        return this.value;
    }
});