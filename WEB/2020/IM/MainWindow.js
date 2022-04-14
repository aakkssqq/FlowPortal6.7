
Ext.application({
    name: 'FlowPortal IM',
    title: RS.$('All_AppName_IM'),
    requires: [
        'YZSoft.src.ux.Push'
    ],

    launch: function () {
        var me = this;

        document.title = me.title;

        Ext.setKeyboardMode(false);

        YZSoft.src.ux.Push.init({
        });

        YZSoft.pnlMain = Ext.create('YZSoft.im.Panel', {
        });

        YZSoft.frame = Ext.create('Ext.container.Viewport', {
            layout: 'card',
            items: [YZSoft.pnlMain]
        });
    }
});