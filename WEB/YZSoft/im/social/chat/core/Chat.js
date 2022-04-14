
Ext.define('YZSoft.im.social.chat.core.Chat', {
    extend: 'Ext.container.Container',
    layout: 'border',
    isSocialPanel:true,

    constructor: function (config) {
        var me = this,
            cfg;

        me.view = Ext.create('YZSoft.im.src.chat.Chat', Ext.apply({
            region: 'center',
            resType: config.resType,
            resId: config.resId,
            folderid: config.folderid
        }, config.viewConfig));

        me.comments = Ext.create('YZSoft.im.src.comments.Chat', {
            region: 'south',
            style:'background-color:#fff',
            height: 200,
            border: 5,
            split: {
                size: 1,
                cls: 'yz-im-command-split'
            }
        });

        me.view.relayEvents(me.comments.uploaderDoc, ['fileQueued', 'nextUpload', 'uploadProgress', 'uploadSuccess', 'uploadFailed'], 'doc');

        cfg = {
            items: [me.view, me.comments]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.view.relayEvents(me.comments, ['send']);
        me.view.relayEvents(me, ['activate']);
    }
});