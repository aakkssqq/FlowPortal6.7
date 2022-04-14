/*
config:
*/
Ext.define('YZSoft.esb.sprites.If.propertypages.General', {
    extend: 'Ext.form.Panel',
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

        me.edtCond = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_If_express'),
            emptyText: Ext.String.format(RS.$('ESB_If_express_EmptyText'),"Variables.Item.Sex == 'Female'"),
            value: properties.express,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.express = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.items = [me.edtName, me.edtCond];
        me.callParent();
    }
});