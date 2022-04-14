/*
    dlgConfig
*/

Ext.define('YZSoft.bpa.src.form.field.ReportSpriteField', {
    extend: 'YZSoft.bpa.src.form.field.ReportBrowserField',
    requires: [
        'YZSoft.bpa.src.model.Folder'
    ],
    config: {
        btnConfig: {
            text: RS.$('BPA__SelectSprite')
        }
    },

    onButtonClick: function (btn, e, eOpts) {
        var me = this;

        Ext.create('YZSoft.bpa.src.dialogs.SelSpriteDlg', Ext.apply({
            autoShow: true,
            fn: function (sprite) {
                me.setValue(sprite);
            }
        }, me.dlgConfig));
    },

    setValue: function (sprite) {
        var me = this;

        me.value = sprite;
        me.display.setValue(sprite ? sprite.SpriteName:'');
        me.fireEvent('change', me, sprite, me.value);

        me.callParent(arguments);
    },

    getValue: function () {
        return Ext.copyTo({}, this.value || {}, ['FileID', 'SpriteID']);
    }
});