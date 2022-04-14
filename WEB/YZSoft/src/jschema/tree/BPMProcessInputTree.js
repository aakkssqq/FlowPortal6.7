
Ext.define('YZSoft.src.jschema.tree.BPMProcessInputTree', {
    extend: 'YZSoft.src.jschema.tree.BPMProcessTreeAbstract',
    schameTemplate: {
        Payload: {
            type: 'object',
            properties: {
            }
        }
    },

    onItemContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            menu;

        e.stopEvent();

        menu = {
            clearMap: {
                glyph: me.glyphs.clearMap,
                text: RS.$('ESB_ClearMap'),
                handler: function () {
                    me.clearMapByToRecord(record);
                }
            }
        };

        menu = [
            menu.clearMap
        ];

        me.showMenu(e, menu);
    }
});