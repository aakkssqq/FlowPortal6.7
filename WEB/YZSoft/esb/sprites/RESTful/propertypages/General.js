/*
config:
relatedFile
*/
Ext.define('YZSoft.esb.sprites.RESTful.propertypages.General', {
    extend: 'Ext.form.Panel',
    requires: [
        'YZSoft.src.form.field.ConnectionField'
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
            fieldLabel: RS.$('ESB_NodeConnectionName'),
            connectionType: 'RESTful',
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

        me.edtOffsetUrl = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_RESTful_offsetUrl'),
            emptyText: Ext.String.format(RS.$('ESB_RESTful_offsetUrl_EmptyText'), 'api/purchaseorder/add'),
            value: properties.offsetUrl,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.offsetUrl = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.cmbMethod = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('ESB_RESTful_method'),
            store: {
                fields: ['name', 'value'],
                data: [
                    { name: 'GET', value: 'GET' },
                    { name: 'POST', value: 'POST' }
                ]
            },
            displayField: 'name',
            valueField: 'value',
            editable: false,
            forceSelection: true,
            triggerAction: 'all',
            value: properties.method,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.method = value;
            },
            listeners: {
                change: 'applySetting'
            }
        });

        me.items = [me.edtName, me.cmbConnection, me.edtOffsetUrl, me.cmbMethod];
        me.callParent();

        me.relayEvents(me.cmbConnection, ['select'], 'cn');
        me.relayEvents(me.cmbMethod, ['select'], 'method');
    }
});