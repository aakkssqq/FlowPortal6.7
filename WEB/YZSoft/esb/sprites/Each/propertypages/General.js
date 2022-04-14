/*
config:
relatedFile
*/
Ext.define('YZSoft.esb.sprites.Each.propertypages.General', {
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

        me.edtEach = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_Each_each'),
            emptyText: Ext.String.format(RS.$('ESB_EmptyText_Example'),'Payload.PurchaseDetail'),
            value: properties.each,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.each = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.edtItemVar = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_Each_itemVar'),
            emptyText: Ext.String.format(RS.$('ESB_EmptyText_Example'), 'purchase'),
            value: properties.itemVar,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.itemVar = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.edtIndexVar = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_Each_indexVar'),
            emptyText: Ext.String.format(RS.$('ESB_EmptyText_Example'), 'indexOfPurchase'),
            value: properties.indexVar,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.indexVar = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.items = [me.edtName, me.edtEach, me.edtItemVar, me.edtIndexVar];
        me.callParent();
    }
});