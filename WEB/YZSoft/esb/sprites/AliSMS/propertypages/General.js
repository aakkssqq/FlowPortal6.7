/*
config:
relatedFile
*/
Ext.define('YZSoft.esb.sprites.AliSMS.propertypages.General', {
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
            connectionType: 'Aliyun',
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

        me.edtTemplateCode = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_AliSMS_TemplateCode'),
            emptyText: '--TemplateCode--',
            value: properties.TemplateCode,
            enableKeyEvents: true,
            applySetting: function() {
                var value = Ext.String.trim(this.getValue());

                properties.TemplateCode = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.edtSignName = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_AliSMS_SignName'),
            emptyText: '--SignName--',
            value: properties.SignName,
            enableKeyEvents: true,
            applySetting: function() {
                var value = Ext.String.trim(this.getValue());

                properties.SignName = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.items = [me.edtName, me.cmbConnection, me.edtTemplateCode, me.edtSignName];
        me.callParent();

        me.relayEvents(me.cmbConnection, ['select'], 'cn');
        me.relayEvents(me.edtTemplateCode, ['change'], 'templatecode');
    }
});