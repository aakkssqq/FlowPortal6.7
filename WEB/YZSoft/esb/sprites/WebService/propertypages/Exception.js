/*
config:
relatedFile
*/
Ext.define('YZSoft.esb.sprites.WebService.propertypages.Exception', {
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

        me.edtErrorExpress = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_exceptionExpress'),
            emptyText: Ext.String.format(RS.$('ESB_exceptionExpress_EmptyText'), "Response.returnCode != 'S'"),
            value: properties.exceptionExpress,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.exceptionExpress = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.edtErrorIDField = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_errorCode'),
            emptyText: Ext.String.format(RS.$('ESB_errorCode_EmptyText'), "Response.errorCode"),
            value: properties.errorCode,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.errorCode = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.edtErrorMessageField = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_errorMessage'),
            emptyText: Ext.String.format(RS.$('ESB_errorMessage_EmptyText'), "Response.errorMessage"),
            value: properties.errorMessage,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.errorMessage = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.items = [me.edtErrorExpress, me.edtErrorIDField, me.edtErrorMessageField]
        me.callParent();
    }
});