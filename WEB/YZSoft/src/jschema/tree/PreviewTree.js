
Ext.define('YZSoft.src.jschema.tree.PreviewTree', {
    extend: 'YZSoft.src.jschema.tree.Abstract',
    bufferedRenderer: true,
    viewConfig: {
        padding: '2 0'
    },

    onItemContextMenu: function (view, record, item, index, e, eOpts) {
        e.stopEvent();
    }
});