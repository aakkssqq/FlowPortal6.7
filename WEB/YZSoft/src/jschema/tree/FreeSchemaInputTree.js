
Ext.define('YZSoft.src.jschema.tree.FreeSchemaInputTree', {
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
            clearMap: {
                glyph: me.glyphs.clearMap,
                text: RS.$('ESB_ClearMap'),
                handler: function () {
                    me.clearMapByToRecord(record);
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

        if (record.is('header') ||
            record.is('queryParams') ||
            record.is('form')) {
            menu = [
                menu.edit,
                '-',
                menu.clearMap
            ];
        }
        else if (record.is('payload') ||
            record.is('response')) {
            menu = [
                menu.edit,
                menu.import,
                '-',
                menu.clearMap
            ];
        }
        else if (record.isChildOf('payload') ||
            record.isChildOf('response')){
            menu = [
                menu.edit,
                menu.import,
                '-',
                menu.clearMap,
                menu.$delete
            ];
        }
        else {
            menu = [
                menu.edit,
                '-',
                menu.clearMap,
                menu.$delete
            ];
        }

        me.showMenu(e, menu);
    }
});