
Ext.define('YZSoft.src.library.base.DetailView', {
    extend: 'Ext.grid.Panel',
    requires: [
        'YZSoft.src.library.base.table.DetailTable'
    ],
    viewType: 'yzdetailtable',
    libPanel: null,
    selModel: {
        mode: 'MULTI'
    },
    viewConfig: {
        markDirty: false,
        stripeRows: true
    },
    emptyText: YZSoft.src.ux.EmptyText.create({
        glyph: 0xeb41,
        text: RS.$('All_EmptyText_EmptyFolder')
    }),

    initComponent: function () {
        var me = this;

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: false
        });

        if (!me.plugins)
            me.plugins = [me.cellEditing];
        else
            me.plugins.push(me.cellEditing);

        me.callParent(arguments);

        //grid也能收到validateedit
        //me.relayEvents(me.cellEditing, ['validateedit']);
    },

    startRename: function (rec, fieldName) {
        this.cellEditing.startEdit(rec, this.columnManager.getHeaderByDataIndex(fieldName));
    }
});