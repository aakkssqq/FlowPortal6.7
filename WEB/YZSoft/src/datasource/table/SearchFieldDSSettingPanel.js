
Ext.define('YZSoft.src.datasource.table.SearchFieldDSSettingPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.datasource.field.DSServerComboBox',
        'YZSoft.src.datasource.field.TableComboBox',
        'YZSoft.src.datasource.filter.searchfield.Table'
    ],
    title:RS.$('Designer_DataSource_Table'),
    layout: {
        type: 'vbox',
        align:'stretch'
    },

    initComponent: function () {
        var me = this,
            ds = me.ds || {},
            datasourceName = ds.datasourceName || 'Default',
            tableName = ds.tableName,
            orderBy = ds.orderBy,
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
                    me.tables.setDatasourceName(newValue);
                }
            }
        });

        me.tables = Ext.create('YZSoft.src.datasource.field.TableComboBox', {
            fieldLabel: RS.$('Designer_DataSource_Table_TableOrView'),
            datasourceName: datasourceName,
            value: tableName,
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
                select: 'notifyTableNameChange',
                blur: 'notifyTableNameChange',
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        me.notifyTableNameChange();
                    }
                }
            }
        });

        me.orderBy = Ext.create('Ext.form.field.Text', {
            width: 160,
            margin: '0 0 0 10',
            emptyText:RS.$('Designer_DataSource_Table_EmptyText_OrderBy'),
            value: orderBy
        });

        me.filter = Ext.create('YZSoft.src.datasource.filter.searchfield.Table', {
            fieldLabel: RS.$('Designer_DataSource_Table_Filter'),
            datasourceName: datasourceName,
            tableName: tableName,
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
            margin:0,
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
            items: [me.tables, me.orderBy,{ xtype: 'tbfill' }, me.dsServer]
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

    notifyTableNameChange: function () {
        var me = this;

        me.filter.setDatasourceName(me.tables.getDatasourceName());
        me.filter.setTableName(me.tables.getValue());
    },

    save: function () {
        var me = this;

        return {
            type: 'table',
            datasourceName: me.dsServer.getValue(),
            tableName: me.tables.getValue(),
            orderBy: me.orderBy.getValue().trim(),
            filter: me.filter.getValue()
        }
    }
});