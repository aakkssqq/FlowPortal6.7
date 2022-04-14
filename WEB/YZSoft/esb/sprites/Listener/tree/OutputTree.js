
Ext.define('YZSoft.esb.sprites.Listener.tree.OutputTree', {
    extend: 'YZSoft.src.jschema.tree.FreeSchemaInputTree',

    onItemContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            store = me.getStore(),
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
            addMasterTableReference: {
                glyph: me.glyphs.addMasterTableReference,
                text: RS.$('ESB_AddMasterTableReference'),
                handler: function () {
                    Ext.create('YZSoft.bpm.src.dialogs.SelTableDlg', {
                        title: RS.$('ESB_AddTableReference'),
                        autoShow: true,
                        fn: function (value) {
                            me.addMasterTableReference(record, value);
                        }
                    });
                }
            },
            addDetailTableReference: {
                glyph: me.glyphs.addDetailTableReference,
                text: RS.$('ESB_AddDetailTableReference'),
                handler: function () {
                    Ext.create('YZSoft.bpm.src.dialogs.SelTableDlg', {
                        title: RS.$('ESB_AddTableReference'),
                        autoShow: true,
                        fn: function (value) {
                            me.addDetailTableReference(record, value);
                        }
                    });
                }
            },
            $delete: {
                glyph: me.glyphs.$delete,
                text: RS.$('ESB_DeleteField'),
                handler: function() {
                    me.deleteRecord(record);
                }
            }
        };

        if (record.is('queryParams')) {
            menu = [
                menu.edit
            ];
        }
        else if (record.is('payload')) {
            menu = [
                menu.edit,
                menu.import,
                '-',
                menu.addMasterTableReference,
                menu.addDetailTableReference
            ];
        }
        else if (record.isChildOf('payload')) {
            menu = [
                menu.edit,
                menu.import,
                '-',
                menu.$delete
            ];
        }
        else {
            menu = [
                menu.edit,
                '-',
                menu.$delete
            ];
        }

        me.showMenu(e, menu);
    }
});