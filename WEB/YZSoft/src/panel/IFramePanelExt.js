
Ext.define('YZSoft.src.panel.IFramePanelExt', {
    extend: 'YZSoft.src.panel.IFramePanel',
    border: false,

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnRefresh = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            text: RS.$('All_Refresh'),
            handler: function () {
                me.reload();
            }
        });

        cfg = {
            tbar: {
                cls: 'yz-tbar-module',
                items: [
                    '->',
                    me.btnRefresh
                ]
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});