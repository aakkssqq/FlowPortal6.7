/*
url
fileid
*/
Ext.define('YZSoft.src.ux.VideoPlayer', {
    extend: 'Ext.container.Container',
    cls:'yz-video-player',
    requires: [
    ],
    floating: true,
    fixed: true,
    shadow: false,
    statics: {
        play: function (config) {
            var win = Ext.create('YZSoft.src.ux.VideoPlayer', config);
            win.showAt(0, 0);
            win.fitContainer(false);
            return win;
        }
    },

    constructor: function (config) {
        var me = this,
            url;


        me.player = Ext.create('YZSoft.src.media.VideoPlayer', config);

        var cfg = {
            layout: 'fit',
            items: [me.player]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
})