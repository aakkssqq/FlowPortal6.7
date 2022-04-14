/*
config:
tables : table identitys
isRepeatableTableConfig
allowAddRecordConfig
filterConfig
createRecordConfig
value
{
"DataSourceName": "Default",
"TableName": "A",
"IsRepeatableTable": true,
"AllowAddRecord": false,
"Filter": {
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
}
*/
Ext.define('YZSoft.bpm.src.dialogs.DatasetControlTableDlg', {
    extend: 'Ext.window.Window', //222222
    title: RS.$('Process_Title_DatasetControlTableDlg_Empty'),
    layout: {
        type: 'vbox'
    },
    width: 735,
    height: 600,
    minWidth: 735,
    minHeight: 600,
    modal: true,
    maximizable:true,
    bodyPadding: '10 26 0 26',
    buttonAlign:'right',

    constructor: function (config) {
        var me = this,
            tableIdentity = Ext.copyTo({}, config.value, 'DataSourceName,TableName,IsRepeatableTable'),
            cfg;

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                var data = me.save();
                me.closeDialog(data);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        me.cmbIsRepeatableTable = Ext.create('Ext.form.field.ComboBox', Ext.apply({
            fieldLabel: RS.$('Process_TableType'),
            width: 400,
            store: {
                fields: ['name', 'value'],
                data: [
                    { name: RS.$('All_TableType_NoRepeatable'), value: false },
                    { name: RS.$('All_TableType_Repeatable'), value: true }
                ]
            },
            value: config.value.IsRepeatableTable,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            editable: false,
            forceSelection: true,
            listeners: {
                change: function (comp, newValue) {
                    if (newValue) {
                        me.cmbAllowAddRecord.setValue(true);
                    } else {
                        me.cmbAllowAddRecord.setValue(false);
                    }

                    me.updateStatus();
                }
            }
        }, config.isRepeatableTableConfig));

        me.cmbAllowAddRecord = Ext.create('Ext.form.field.ComboBox', Ext.apply({
            fieldLabel: RS.$('All_Permision'),
            width: 400,
            store: {
                fields: ['name', 'value'],
                data: [
                    { name: RS.$('All_RepeatableTable_DenyAddDeleteRow'), value: false },
                    { name: RS.$('All_RepeatableTable_AddDeleteRow'), value: true }
                ]
            },
            value: config.value.AllowAddRecord,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            editable: false,
            forceSelection: true
        }, config.allowAddRecordConfig));

        me.edtFilter = Ext.create('YZSoft.bpm.src.form.field.TableFilter', Ext.apply({
            fieldLabel: RS.$('Process_TableFilter'),
            flex: 2,
            labelAlign: 'top',
            reference: 'edtFilter',
            tables: config.tables,
            tableIdentity: tableIdentity,
            value: config.value.Filter
        }, config.filterConfig));

        me.edtCreateRecord = Ext.create('YZSoft.bpm.src.editor.CreateRecordField', Ext.apply({
            fieldLabel: RS.$('All_CreateRecord_FieldLabel'),
            flex: 2,
            labelAlign: 'top',
            tables: config.tables,
            tableIdentity: tableIdentity,
            value: config.value.InitCreateRecordSet
        }, config.createRecordConfig))

        cfg = {
            buttons: [me.btnCancel, me.btnOK],
            defaults: {
                labelWidth: 100,
                width:'100%'
            },
            items: [
                me.cmbIsRepeatableTable,
                me.cmbAllowAddRecord,
                me.edtFilter,
                me.edtCreateRecord
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    save: function () {
        var me = this,
            value;

        value = {
            IsRepeatableTable: me.cmbIsRepeatableTable.getValue(),
            AllowAddRecord: me.cmbAllowAddRecord.getValue(),
            Filter: me.edtFilter.getValue(),
            InitCreateRecordSet: me.edtCreateRecord.getValue()
        };

        return value;
    },

    updateStatus: function () {
        var me = this,
            value = me.save();

        me.cmbAllowAddRecord.setDisabled(!value.IsRepeatableTable);
        me.edtFilter.setDisabled(!value.IsRepeatableTable);
        me.edtCreateRecord.setDisabled(!value.IsRepeatableTable);
    }
});