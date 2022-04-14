
/*
config
pnlProperty
*/
Ext.define('YZSoft.bpm.km.sprite.OverviewMainPanel', {
    extend: 'YZSoft.bpm.km.sprite.Property',
    panelMargin: '30 0 0 0',
    panelCls: 'yz-pnl-bpa-km',

    onSpriteClick: function (view, record, item, index, e, eOpts) {
        var me = this;

        me.pnlProperty.showSprite({
            fileid: record.data.FileID,
            spriteid: record.data.SpriteID,
            title: record.data.SpriteName
        });
    }
});