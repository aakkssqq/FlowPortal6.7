/*
config:
feature
record
isRepeatableTableConfig
allowAddRecordConfig
filterConfig
createRecordConfig
advBtnConfig
events:
beforePopupDlg
*/
Ext.define('YZSoft.bpm.src.grid.feature.TableRecordPanel', {
    extend: 'Ext.panel.Panel',
    referenceHolder: true,
    editable: true,
    layout: {
        type: 'hbox',
        align: 'middle'
    },
    minHeight:33,

    constructor: function (config) {
        var me = this,
            config = config || {},
            record = config.record,
            editable = 'editable' in config ? config.editable : me.editable,
            cfg;

        record.data.Filter = record.data.Filter || { Params: [] };

        cfg = {
            defaults: {
                margin:'0 0 0 6'
            },
            items: [Ext.apply({
                xtype: 'checkbox',
                padding: '0 5',
                listeners: {
                    change: function (comp, newValue) {
                        me.record.set('selected', newValue);
                        me.feature.grid.fireEvent('tablecheckchanged', record, newValue);
                    }
                }
            }, config.checkboxCOnfig), {
                xtype: 'box',
                tpl: [
                    '<b>{TableName}</b>'
                ],
                data: {
                    TableName: (String.Equ(record.data.DataSourceName, 'Default') || !record.data.DataSourceName) ? record.data.TableName : record.data.TableName + ' [' + record.data.DataSourceName + ']'
                },
                padding: '0 4'
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'box',
                reference: 'labFilterFlag',
                cls: 'yz-table-has-filter',
                hidden: !editable || record.data.Filter.Params.length == 0,
                html: RS.$('All_HasFilter'),
                padding: '0 0 2 0'
            }, Ext.apply({
                xtype: 'combobox',
                reference: 'cmbIsRepeatableTable',
                hidden: !editable,
                store: {
                    fields: ['name', 'value'],
                    data: [
                        { name: RS.$('All_TableType_NoRepeatable'), value: false },
                        { name: RS.$('All_TableType_Repeatable'), value: true }
                    ]
                },
                width: 120,
                value: record.data.IsRepeatableTable,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                editable: false,
                forceSelection: true,
                listeners: {
                    change: function (comp, newValue) {
                        me.record.set('IsRepeatableTable', newValue);
                        if (newValue) {
                            var refs = me.getReferences();
                            refs.cmbAllowAddRecord.setValue(true);
                        } else {
                            var refs = me.getReferences();
                            refs.cmbAllowAddRecord.setValue(false);
                        }
                        me.updateStatus();
                    }
                }
            }, config.isRepeatableTableConfig), Ext.apply({
                xtype: 'combobox',
                reference: 'cmbAllowAddRecord',
                hidden: !editable,
                store: {
                    fields: ['name', 'value'],
                    data: [
                        { name: RS.$('All_RepeatableTable_DenyAddDeleteRow'), value: false },
                        { name: RS.$('All_RepeatableTable_AddDeleteRow'), value: true }
                    ]
                },
                width: 120,
                value: record.data.AllowAddRecord,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                editable: false,
                forceSelection: true,
                listeners: {
                    change: function (comp, newValue) {
                        me.record.set('AllowAddRecord', newValue);
                        me.updateStatus();
                    }
                }
            }, config.allowAddRecordConfig), Ext.apply({
                xtype: 'button',
                text: Ext.String.format('{0}...', RS.$('All_Advanced')),
                ui: 'default-toolbar',
                reference: 'btnAdv',
                hidden: !editable,
                handler: function () {
                    var opt = {};

                    me.fireEvent('beforePopupDlg', opt);
                    if (opt.tables)
                        me.tables = opt.tables;

                    Ext.create('YZSoft.bpm.src.dialogs.DatasetControlTableDlg', {
                        tables: me.tables,
                        title: Ext.String.format(RS.$('Process_Title_DatasetControlTableDlg'), me.record.data.TableName),
                        autoShow: true,
                        value: me.record.data,
                        isRepeatableTableConfig: me.isRepeatableTableConfig,
                        allowAddRecordConfig: me.allowAddRecordConfig,
                        filterConfig: me.filterConfig,
                        createRecordConfig: me.createRecordConfig,
                        fn: function (value) {
                            var refs = me.getReferences();

                            Ext.apply(record.data, value);
                            refs.cmbIsRepeatableTable.setValue(value.IsRepeatableTable);
                            refs.cmbAllowAddRecord.setValue(value.AllowAddRecord);
                            me.updateStatus();
                        }
                    });
                }
            }, config.advBtnConfig), Ext.apply({
                xtype: 'button',
                text: RS.$('All_MoveUp'),
                ui:'default-toolbar',
                reference: 'btnMoveUp',
                hidden: true,
                handler: function () {
                    me.fireEvent('moveUpClick', me.record);
                }
            }, config.moveUpBtnConfig), Ext.apply({
                xtype: 'button',
                text: RS.$('All_MoveDown'),
                ui: 'default-toolbar',
                reference: 'btnMoveDown',
                hidden: true,
                handler: function () {
                    me.fireEvent('moveDownClick', me.record);
                }
            }, config.moveDownBtnConfig)]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.storeListeners = me.feature.grid.getStore().on({
            scope: me,
            destroyable: true,
            datachanged: 'updateStatus'
        });

        me.on({
            scope: me,
            destroy: function () {
                if (me.storeListeners) {
                    Ext.destroy(me.storeListeners);
                    delete me.storeListeners;
                }
            }
        });

        me.updateStatus();

    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);

    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            el = me.getEl();

        if (el == null || el.isDestroyed) {
            if (me.storeListeners) {
                Ext.destroy(me.storeListeners);
                delete me.storeListeners;
            }
            return;
        }

        refs.labFilterFlag.setVisible(me.record.data.IsRepeatableTable && me.record.data.Filter.Params.length != 0);
        refs.cmbAllowAddRecord.setDisabled(!me.record.data.IsRepeatableTable);
        refs.btnAdv.setDisabled(!me.record.data.IsRepeatableTable && refs.cmbIsRepeatableTable.isDisabled());

        me.fireEvent('updateStatus', me.record, me.refs, me);
    }
});