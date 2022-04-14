
Ext.define('YZSoft.esb.designer.DrawContainer', {
    extend: 'YZSoft.esb.flowchart.Container',
    requires: [
        'YZSoft.esb.designer.plugin.Designer'
    ],
    plugins: ['yzesbdesigner'],

    initComponent: function () {
        var me = this;

        me.callParent();

        me.on({
            scope: me,
            keydown: function (e, t, eOpts) {
                e.stopEvent();

                var key = e.getKey();
                if (e.ctrlKey && key == e.A)
                    me.selectAll();

                if (key == e.DELETE || key == e.BACKSPACE)
                    me.deleteSelection();
            }
        });
    },

    prepareSelectionData: function (selection) {
        var me = this,
            surfaces = me.getItems(),
            selection = selection || me.selection,
            data;

        return {
            sprites: selection
        };
    },

    deleteSelection: function (undoMsg) {
        var me = this,
            data = me.prepareSelectionData(),
            sprites = data.sprites;

        if (sprites.length == 0)
            return;

        me.deselectAll();

        Ext.each(sprites, function (sprite) {
            sprite.getSurface().remove(sprite, true);
        });

        me.renderFrame();
    }
});