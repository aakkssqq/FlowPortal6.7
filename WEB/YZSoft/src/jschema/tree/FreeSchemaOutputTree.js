
Ext.define('YZSoft.src.jschema.tree.FreeSchemaOutputTree', {
    extend: 'YZSoft.src.jschema.tree.FreeSchemaTreeAbstract',

    onItemContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            tree = view.ownerCt,
            menu;

        e.stopEvent();

        menu = {
            edit: {
                glyph: me.glyphs.edit,
                text: RS.$('All_Edit'),
                handler: function () {
                    me.edit(record);
                }
            },
            import: {
                glyph: me.glyphs.import,
                text: RS.$('JSchame_ImportSchema'),
                handler: function () {
                    me.importSchema(record);
                }
            },
            $delete: {
                glyph: me.glyphs.$delete,
                text: RS.$('ESB_DeleteField'),
                handler: function () {
                    me.deleteRecord(record);
                }
            }
        };

        if (record.is('payload') ||
            record.is('response')) {
            menu = [
                menu.edit,
                menu.import
            ];
        }
        else {
            menu = [
                menu.edit
                //menu.import,
                //'-',
                //menu.$delete
            ]
        }

        me.showMenu(e, menu);
    }
});