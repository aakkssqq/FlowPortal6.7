
Ext.define('YZSoft.src.library.base.Tree', {
    extend: 'Ext.tree.Panel',
    header: false,
    rootVisible: true,
    useArrows: true,
    hideHeaders: true,
    columns: [{
        xtype: 'treecolumn',
        dataIndex: 'text',
        flex: 1,
        editor: { xtype: 'textfield' }
    }],

    initComponent: function () {
        var me = this,
            libPanel = me.libPanel;

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: false
        });
        me.plugins = [me.cellEditing];

        me.dd = Ext.create('Ext.tree.plugin.TreeViewDragDrop', {
            dragZone: {
                isPreventDrag: function (e, record, item, index) {
                    return libPanel.treeIsFolderPreventDrag(e, record, item, index);
                }
            },
            dropZone: {
                indicatorCls: 'yz-tree-ddindicator'
            }
        });
        me.viewConfig = me.viewConfig || {};
        me.viewConfig.plugins = me.dd;

        me.callParent(arguments);

        me.on({
            single: true,
            afterrender: function (tree, eOpts) {
                var root = this.getRootNode(),
                    store = this.getStore(),
                    sm = this.getSelectionModel();

                sm.select(root);
                store.load({
                    loadMask: $S.loadMask.first.loadMask,
                    callback: function () {
                        root.expand(true);
                    }
                });
            }
        });
    },

    expandPhyPath: function (path, options) {
        options = options || {};

        var me = this,
            silence = options.silence,
            path = Ext.String.format(path ? '/{0}/{1}' : '/{0}', me.getRootNode().get('text'), path);

        me.expandPath(path, Ext.apply({
            field: 'text'
        }, {
            select: false,
            callback: function (success, record, node) {
                if (success) {
                    if (options.select) {
                        silence && me.suspendEvent('selectionchange');
                        me.getSelectionModel().select(record);
                        silence && me.resumeEvent('selectionchange');
                    }

                    Ext.callback(options.callback, options.scope || me, [
                        success,
                        record,
                        node
                    ]);
                }
            }
        }, options));
    }
});