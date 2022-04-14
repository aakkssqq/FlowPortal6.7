
/*
config
srcTree,
tagTree,
mapPanel,
dragGroup
*/
Ext.define('YZSoft.src.jmap.link.DragDrop', {
    extend: 'Ext.Evented',
    dragGroup: 'YZNodeLinkDD',

    constructor: function (config) {
        var me = this,
            dragGroup = config.dragGroup || me.dragGroup,
            srcTree = config.srcTree,
            tagTree = config.tagTree,
            srcView = srcTree.getView(),
            tagView = tagTree.getView();

        Ext.applyIf(srcView, {
            copy: true
        });

        me.srcPlugin = Ext.create('Ext.tree.plugin.TreeViewDragDrop', Ext.apply({
            dragGroup: dragGroup,
            dragZone: {
                getDragText: function () {
                    return me.getDragTextInner(this);
                }
            }
        }, config.srcPluginConfig));

        me.tagPlugin = Ext.create('Ext.tree.plugin.TreeViewDragDrop', Ext.apply({
            dropGroup: dragGroup,
            enableDrag:false,
            dropZone: {
                indicatorCls: 'yz-tree-ddindicator-none',
                overClass: 'yz-tree-dragover-maptarget',
                handleNodeDrop: function (data, targetNode, position) {
                    me.fireEvent('linkdrop', data.view.grid, data.records[0], tagTree, targetNode, data.event);
                }
            }
        }, me.tagPluginConfig));

        srcView.addPlugin(me.srcPlugin);
        tagView.addPlugin(me.tagPlugin);

        Ext.apply(me, config);
        me.callParent(arguments);
    },

    getDragTextInner: function (dragZone) {
        var me = this,
            data = dragZone.dragData,
            record = data.records[0];

        if (record) {
            if (me.getDragText)
                return me.getDragText(record);
            else
                return record.data.text;
        }
        else
            return dragZone.dragText;
    }
})