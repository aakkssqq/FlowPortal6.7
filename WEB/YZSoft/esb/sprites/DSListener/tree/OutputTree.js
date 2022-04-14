
Ext.define('YZSoft.esb.sprites.DSListener.tree.OutputTree', {
    extend: 'YZSoft.src.jschema.tree.FreeSchemaInputTree',

    constructor: function (config) {
        var me = this,
            copySchemaButton = config.copySchemaButton;

        if (copySchemaButton) {
            config.dockedItems = [{
                xtype: 'container',
                dock: 'bottom',
                layout: 'fit',
                padding: '3 12 6 12',
                style: 'background-color:#fff',
                items: [Ext.apply({
                    xtype: 'button',
                    text: RS.$('ESB_DSFlow_CopyListenerSchema')
                }, copySchemaButton)]
            }];
        }

        me.callParent(arguments);
    },

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
            $delete: {
                glyph: me.glyphs.$delete,
                text: RS.$('ESB_DeleteField'),
                handler: function() {
                    me.deleteRecord(record);
                }
            },
            denyEdit: {
                glyph: me.glyphs.edit,
                text: RS.$('All_Edit'),
                disabled: true
            }
        };

        if (record.is('paging')) {
            menu = [
                menu.denyEdit
            ];
        }
        else if (record.is('payload')) {
            menu = [
                menu.edit
            ];
        }
        else if (record.isChildOf('payload')) {
            menu = [
                menu.edit,
                '-',
                menu.$delete,
            ];
        }
        else {
            menu = [
                menu.denyEdit
            ];
        }

        me.showMenu(e, menu);
    },

    edit: function (record) {
        var me = this,
            propertyName = record.data.propertyName;

        if (record.is('payload'))
            me.editHeader(record, RS.$('ESB_SchameEditDlg_Title_Parameters'));
        else
            me.editHeaderChild(record);
    }
});