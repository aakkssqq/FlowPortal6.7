
Ext.define('YZSoft.src.datasource.esb.SearchFieldDSSettingPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.datasource.field.ESBDSObjectComboBox',
        'YZSoft.src.datasource.filter.searchfield.ESB'
    ],
    title:RS.$('Designer_DataSource_ESB_Title'),
    layout: {
        type: 'vbox',
        align:'stretch'
    },

    initComponent: function () {
        var me = this,
            ds = me.ds || {},
            esbObjectName = ds.esbObjectName,
            filter = ds.filter;

        me.esbObjectNames = Ext.create('YZSoft.src.datasource.field.ESBDSObjectComboBox', {
            fieldLabel: RS.$('Designer_DataSource_ESB_Object'),
            value: esbObjectName,
            labelSeparator: '',
            labelWidth: 'auto',
            labelPad:30,
            grow: true,
            growMin: 160,
            loadConfig: {
                waitMsg: {
                    msg: RS.$('All_Connecting'),
                    target: me
                }
            },
            listeners: {
                scope:me,
                select: 'notifyESBObjectNameChange',
                blur: 'notifyESBObjectNameChange',
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        me.notifyESBObjectNameChange();
                    }
                }
            }
        });

        me.filter = Ext.create('YZSoft.src.datasource.filter.searchfield.ESB', {
            fieldLabel: RS.$('Designer_DataSource_CallParams'),
            esbObjectName: esbObjectName,
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
            items: [me.esbObjectNames,{ xtype:'tbfill'},me.dsServer]
        }, me.filter, {
            xtype: 'container',
            cls: 'x-toolbar-footer',
            padding: 0,
            layout: {
                type: 'hbox',
                pack: 'end'
            },
            items: [me.btnOK, me.btnCancel]
        }];

        me.callParent(arguments);
    },

    notifyESBObjectNameChange: function () {
        var me = this;

        me.filter.setEsbObjectName(me.esbObjectNames.getValue());
    },

    save: function () {
        var me = this;

        return {
            type: 'esb',
            esbObjectName: me.esbObjectNames.getValue(),
            filter: me.filter.getValue()
        }
    }
});