
Ext.define('YZSoft.esb.sprites.Response.tree.InputTree', {
    extend: 'YZSoft.src.jschema.tree.FreeSchemaInputTree',

    onItemContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            store = me.getStore(),
            isTagTree = me.isTagTree,
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

        if (isTagTree) {
            if (record.is('payload')) {
                menu = [
                    menu.edit,
                    '-',
                    menu.clearMap
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
        }
        else {
            if (record.is('payload')) {
                menu = [
                    menu.edit
                ];
            }
            else {
                menu = [
                    menu.edit,
                    '-',
                    menu.$delete,
                ];
            }
        }

        me.showMenu(e, menu);
    },

    edit: function (record) {
        var me = this,
            propertyName = record.data.propertyName;

        if (record.is('payload'))
            me.editHeader(record, RS.$('ESB_SchameEditDlg_Title_Payload'));
        else
            me.editPayloadChild(record);
    }
});