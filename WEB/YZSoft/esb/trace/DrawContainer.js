/*
config
    TaskID
*/

Ext.define('YZSoft.esb.trace.DrawContainer', {
    extend: 'YZSoft.esb.flowchart.Container',
    requires: [
        'YZSoft.esb.trace.plugin.Trace'
    ],
    plugins: ['yzesbtraceevents'],

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            scope: me,
            spritemousedown: 'onSpriteMouseDown',
            containermousedown: 'onContainerMouseDown'
        });
    },

    onSpriteMouseDown: function (sprite, event, eOpts) {
        var me = this;

        if (!sprite.step)
            return;

        me.deselectAll(true);
        me.select(sprite);
        me.renderFrame();
    },

    onContainerMouseDown: function (event, eOpts) {
        var me = this;

        me.deselectAll(false);
        me.renderFrame();
    }
});