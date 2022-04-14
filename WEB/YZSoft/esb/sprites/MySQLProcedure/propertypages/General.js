/*
config:
relatedFile
*/
Ext.define('YZSoft.esb.sprites.MySQLProcedure.propertypages.General', {
    extend: 'Ext.form.Panel',
    requires: [
        'YZSoft.src.form.field.ConnectionField',
        'YZSoft.src.form.field.MySQLProcedureCombo'
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
            fieldLabel: RS.$('ESB_DB_connectionName'),
            connectionType: 'MySQL',
            value: properties.connectionName,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.connectionName = value;
            },
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {
                    this.applySetting();
                    me.cmbProcedures.setConnectionName(newValue);
                }
            }
        });

        me.cmbProcedures = Ext.create('YZSoft.src.form.field.MySQLProcedureCombo', {
            fieldLabel: RS.$('ESB_DB_procedure'),
            connectionName: properties.connectionName,
            value: properties.procedure,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.procedure = value;
            },
            listeners: {
                change: 'applySetting',
                loadexception: function (err, operation) {
                    YZSoft.alert(err);
                }
            }
        });

        me.items = [me.edtName, me.cmbConnection, me.cmbProcedures];
        me.callParent();

        me.relayEvents(me.cmbConnection, ['select'], 'cn');
        me.relayEvents(me.cmbProcedures, ['change'], 'procedure');
    }
});