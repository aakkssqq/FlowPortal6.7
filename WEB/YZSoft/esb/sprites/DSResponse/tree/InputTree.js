//copySchemaButton
Ext.define('YZSoft.esb.sprites.DSResponse.tree.InputTree', {
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
                    text: RS.$('ESB_DSFlow_CopyResponseSchema')
                }, copySchemaButton)]
            }];
        }

        me.callParent(arguments);
    },

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
            },
            denyEdit: {
                glyph: me.glyphs.edit,
                text: RS.$('All_Edit'),
                disabled: true
            }
        };

        if (isTagTree) {
            if (record.is('rows')) {
                menu = [
                    menu.edit,
                    '-',
                    menu.clearMap
                ];
            }
            else if (record.isChildOf('rows')) {
                menu = [
                    menu.edit,
                    '-',
                    menu.clearMap,
                    menu.$delete
                ];
            }
            else {
                menu = [
                    menu.clearMap
                ];
            }
        }
        else {
            if (record.is('rows')) {
                menu = [
                    menu.edit
                ];
            }
            else if (record.isChildOf('rows')) {
                menu = [
                    menu.edit,
                    '-',
                    menu.$delete
                ];
            }
            else {
                menu = [
                    menu.denyEdit
                ];
            }
        }

        me.showMenu(e, menu);
    },

    edit: function (record) {
        var me = this,
            propertyName = record.data.propertyName;

        if (record.is('rows'))
            me.editHeader(record, RS.$('ESB_SchameEditDlg_Title_Payload'));
        else
            me.editHeaderChild(record);
    }
});