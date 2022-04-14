/*
config
dlgConfig
*/
Ext.define('YZSoft.bpa.src.form.field.SpritesField', {
    extend: 'YZSoft.src.form.field.List',
    linkType:'SpriteToSprite',
    triggers: {
        browser: {
            cls: 'yz-trigger-bparelatiedsprite',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this;

        if (!me.dlgWin) {
            me.dlgWin = Ext.create('YZSoft.bpa.src.dialogs.SelSpritesDlg', Ext.apply({
                closeAction: 'hide'
            }, me.dlgConfig));
        }

        me.dlgWin.show({
            selection: me.getValue(),
            fn: function (sprites) {
                var values = [];
                Ext.Array.each(sprites, function (sprite) {
                    values.push(Ext.copyTo({
                        isBPAReference: true,
                        LinkType: me.linkType
                    },sprite,['FileID','SpriteID','FileName','SpriteName']));
                });
                me.setValue(values);
            }
        });

        me.callParent(arguments);
    },

    destroy: function () {
        delete this.dlgWin;
        this.callParent(arguments);
    },

    renderItem: function (data) {
        return data.SpriteName || Ext.String.format('{0}/{1}', data.FileID, data.SpriteID);
    }
});