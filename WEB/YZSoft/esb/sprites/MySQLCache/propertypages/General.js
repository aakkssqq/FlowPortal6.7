/*
config:
relatedFile
*/
Ext.define('YZSoft.esb.sprites.MySQLCache.propertypages.General', {
    extend: 'Ext.form.Panel',
    requires: [
        'YZSoft.src.form.field.ConnectionField',
        'YZSoft.src.form.field.MySQLTableCombo'
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
            connectionType: 'MySQL',
            value: properties.connectionName,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.connectionName = value;
            },
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {
                    this.applySetting();
                    me.cmbTables.setConnectionName(newValue);
                }
            }
        });

        me.cmbTables = Ext.create('YZSoft.src.form.field.MySQLTableCombo', {
            fieldLabel: RS.$('ESB_DB_CacheTable'),
            connectionName: properties.connectionName,
            value: properties.table,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.table = value;
            },
            listeners: {
                change: 'applySetting',
                loadexception: function (err, operation) {
                    YZSoft.alert(err);
                }
            }
        });

        me.items = [me.edtName, me.cmbConnection, me.cmbTables];
        me.callParent();

        me.relayEvents(me.cmbConnection, ['select'], 'cn');
        me.relayEvents(me.cmbTables, ['change'], 'table');
    }
});