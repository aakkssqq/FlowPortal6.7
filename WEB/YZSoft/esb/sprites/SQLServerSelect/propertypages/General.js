/*
config:
relatedFile
*/
Ext.define('YZSoft.esb.sprites.SQLServerSelect.propertypages.General', {
    extend: 'Ext.form.Panel',
    requires: [
        'YZSoft.src.form.field.ConnectionField',
        'YZSoft.src.form.field.SQLServerQueryEditor'
    ],
    layout: {
        type: 'vbox',
        align:'stretch'
    },

    initComponent: function () {
        var me = this,
            designer = me.designer,
            sprite = me.sprite,
            properties = sprite.properties,
            dcnt = designer.drawContainer;

        me.edtName = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_NodeName'),
            value: sprite.sprites.text.attr.text,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                sprite.sprites.text.setAttributes({
                    text: value
                });

                dcnt.renderFrame();
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.mon(sprite, {
            rename: function (sprite, newName) {
                me.edtName.setValue(newName);
            }
        });

        me.cmbConnection = Ext.create('YZSoft.src.form.field.ConnectionField', {
            fieldLabel: RS.$('ESB_NodeConnectionName'),
            connectionType: 'SQLServer',
            value: properties.connectionName,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.connectionName = value;
            },
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {
                    this.applySetting();
                }
            }
        });

        me.edtQuery = Ext.create('YZSoft.src.form.field.SQLServerQueryEditor', {
            fieldLabel: RS.$('ESB_SQLQuery'),
            flex: 1,
            value: properties.query,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.query = value;
            },
            listeners: {
                change: 'applySetting'
            }
        });

        me.edtSort = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_DB_sort'),
            emptyText: 'ItemID desc',
            value: properties.sort,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.sort = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.chkPaging = Ext.create('Ext.form.field.Checkbox', {
            fieldLabel: ' ',
            labelSeparator: '',
            value: properties.paging,
            boxLabel: RS.$('ESB_DB_paging'),
            hidden: true,
            applySetting: function () {
                var value = this.getValue();
                properties.paging = value;
            },
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {
                    this.applySetting();
                }
            }
        });

        me.items = [me.edtName, me.cmbConnection, me.edtQuery, me.edtSort, me.chkPaging];
        me.callParent();

        me.relayEvents(me.cmbConnection, ['select'], 'cn');
        me.relayEvents(me.edtQuery, ['change'], 'query');
        me.relayEvents(me.chkPaging, ['change'], 'paging');
    }
});