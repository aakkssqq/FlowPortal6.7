
Ext.define('YZSoft.src.datasource.procedure.SearchFieldDSSettingPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.datasource.field.DSServerComboBox',
        'YZSoft.src.datasource.field.ProcedureComboBox',
        'YZSoft.src.datasource.filter.searchfield.Procedure'

    ],
    title:RS.$('Designer_DataSource_Procedure'),
    layout: {
        type: 'vbox',
        align:'stretch'
    },

    initComponent: function () {
        var me = this,
            ds = me.ds || {},
            datasourceName = ds.datasourceName || 'Default',
            procedureName = ds.procedureName,
            filter = ds.filter;

        me.dsServer = Ext.create('YZSoft.src.datasource.field.DSServerComboBox', {
            fieldLabel: RS.$('All_DataSource'),
            value: datasourceName,
            labelSeparator: '',
            labelWidth: 'auto',
            labelPad: 10,
            grow: true,
            growMin: 120,
            listeners: {
                change: function (field, newValue) {
                    me.procedures.setDatasourceName(newValue);
                }
            }
        });

        me.procedures = Ext.create('YZSoft.src.datasource.field.ProcedureComboBox', {
            fieldLabel: RS.$('Designer_DataSource_Procedure'),
            datasourceName: datasourceName,
            value: procedureName,
            labelSeparator: '',
            labelWidth: 'auto',
            labelPad:30,
            grow: true,
            growMin: 160,
            loadConfig: {
                waitMsg: {
                    msg: RS.$('All_Connecting_DataSource'),
                    target: me
                }
            },
            listeners: {
                scope:me,
                select: 'notifyProcedureNameChange',
                blur: 'notifyProcedureNameChange',
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        me.notifyProcedureNameChange();
                    }
                }
            }
        });

        me.filter = Ext.create('YZSoft.src.datasource.filter.searchfield.Procedure', {
            fieldLabel: RS.$('Designer_DataSource_CallParams'),
            datasourceName: datasourceName,
            procedureName: procedureName,
            value: filter,
            labelAlign:'top',
            flex: 1,
            margin:'10 0 20 0'
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: me.readOnly,
            handler: function () {
                me.fireEvent('okClick');
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            margin: 0,
            handler: function () {
                me.fireEvent('cancelClick');
            }
        });

        me.items = [{
            xtype: 'container',
            layout: {
                type: 'hbox',
                align:'stretch'
            },
            items: [me.procedures,{ xtype:'tbfill'},me.dsServer]
        }, me.filter, {
            xtype: 'container',
            cls: 'x-toolbar-footer',
            padding: 0,
            layout: {
                type: 'hbox',
                pack:'end'
            },
            items: [me.btnOK, me.btnCancel]
        }];

        me.callParent(arguments);
    },

    notifyProcedureNameChange: function () {
        var me = this;

        me.filter.setDatasourceName(me.procedures.getDatasourceName());
        me.filter.setProcedureName(me.procedures.getValue());
    },

    save: function () {
        var me = this;

        return {
            type: 'procedure',
            datasourceName: me.dsServer.getValue(),
            procedureName: me.procedures.getValue(),
            filter: me.filter.getValue()
        }
    }
});