/*
config:
relatedFile
*/
Ext.define('YZSoft.esb.sprites.KingdeeEAS.propertypages.General', {
    extend: 'Ext.form.Panel',
    requires: [
        'YZSoft.src.form.field.ConnectionField',
        'YZSoft.src.form.field.KingdeeEASServiceCombo',
        'YZSoft.src.form.field.KingdeeEASOperationCombo'
    ],
    layout: 'anchor',
    defaults: {
        anchor: '100%'
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
            fieldLabel: RS.$('ESB_KingdeeEAS_connectionName'),
            connectionType: 'KingdeeEAS',
            value: properties.connectionName,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.connectionName = value;
            },
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {
                    this.applySetting();
                    me.edtOffsetUrl.setConnectionName(me.cmbConnection.getValue());
                    me.cmbOperations.setConnectionName(me.cmbConnection.getValue());
                }
            }
        });

        me.edtOffsetUrl = Ext.create('YZSoft.src.form.field.KingdeeEASServiceCombo', {
            fieldLabel: RS.$('ESB_KingdeeEAS_offsetUrl'),
            flex: 1,
            connectionName: properties.connectionName,
            value: properties.offsetUrl,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.offsetUrl = value;
            },
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {
                    this.applySetting();
                },
                select: function (combo, record, eOpts) {
                    me.updateOperations();
                },
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER)
                        me.updateOperations();
                }
            }
        });

        me.cmbOperations = Ext.create('YZSoft.src.form.field.KingdeeEASOperationCombo', {
            fieldLabel: RS.$('ESB_KingdeeEAS_operationName'),
            connectionName: properties.connectionName,
            offsetUrl: properties.offsetUrl,
            value: properties.messageName ? (properties.operationName + ":" + properties.messageName) : properties.operationName,
            applySetting: function (combo, rec, eOpts) {
                properties.operationName = rec.data.name;
                properties.messageName = rec.data.messageName;
            },
            listeners: {
                select:'applySetting',
                loadexception: function (err, operation) {
                    YZSoft.alert(err);
                }
            }
        });

        me.items = [
            me.edtName,
            me.cmbConnection,
            me.edtOffsetUrl,
            me.cmbOperations
        ];
        me.callParent();

        me.relayEvents(me.cmbConnection, ['select'], 'cn');
        me.relayEvents(me.edtOffsetUrl, ['change'], 'offset');
        me.relayEvents(me.cmbOperations, ['select'], 'op');
    },

    updateOperations: function () {
        var me = this;
        me.cmbOperations.setOffsetUrl(me.edtOffsetUrl.getValue());
    }
});