/*
config:
relatedFile
*/
Ext.define('YZSoft.esb.sprites.WordGenerator.propertypages.General', {
    extend: 'Ext.form.Panel',
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

        me.cmbTemplate = Ext.create('YZSoft.src.form.field.DocTemplateField', {
            fieldLabel: RS.$('ESB_WordGenerator_templateName'),
            root: 'ESBTemplates',
            templateType: 'Word',
            value: properties.templateName,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.templateName = value;
            },
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {
                    this.applySetting();
                }
            }
        });

        me.items = [me.edtName, me.cmbTemplate];
        me.callParent();

        me.relayEvents(me.cmbTemplate, ['select'], 'template');
    }
});