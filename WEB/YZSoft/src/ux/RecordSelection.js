
/*
config
srcGrid,
tagGrid,
dragGroup
*/
Ext.define('YZSoft.src.ux.RecordSelection', {
    extend: 'Ext.Evented',
    dragGroup: 'YZGridSelectionDD',

    constructor: function (config) {
        var me = this,
            dragGroup = config.dragGroup || me.dragGroup,
            srcView = config.srcGrid.getView(),
            tagView = config.tagGrid.getView();

        Ext.applyIf(srcView, {
            copy: true
        });

        me.srcPlugin = Ext.create('Ext.grid.plugin.DragDrop', Ext.apply({
            dragGroup: dragGroup,
            dragZone: {
                onInitDrag: function (x, y) {
                    return me.onInitDrag(this, x, y);
                },
                getDragText: function () {
                    return me.getDragTextInner(this);
                },
                afterValidDrop: function (target, e, id) {
                    return me.afterSrcDrop(this, target, e, id);
                }
            }
        }, config.srcPluginConfig));

        me.tagPlugin = Ext.create('Ext.grid.plugin.DragDrop', Ext.apply({
            dragGroup: dragGroup,
            dropGroup: dragGroup,
            dragZone: {
                onInitDrag: function (x, y) {
                    return me.onInitDrag(this, x, y);
                },
                getDragText: function () {
                    return me.getDragTextInner(this);
                }
            }
        }, me.tagPluginConfig));

        srcView.addPlugin(me.srcPlugin);
        tagView.addPlugin(me.tagPlugin);

        Ext.apply(me, config);
        me.callParent(arguments);

        me.srcGrid.on({
            selectionchange: function (grid, selected, eOpts) {
                me.tagGrid.syncRecords(me.srcGrid.getStore(), selected, true);
            }
        });

        me.srcGrid.getStore().on({
            scope: me,
            datachanged: 'syncTag2Src'
        });

        me.tagGrid.getStore().on({
            scope: me,
            datachanged: 'syncTag2Src'
        });
    },

    getDragTextInner: function (dragZone) {
        var me = this,
            data = dragZone.dragData,
            record = data.records[0];

        if (record)
            return me.getDragText(record);
        else
            return dragZone.dragText;
    },

    onInitDrag: function (dragZone, x, y) {
        var me = this,
            data = dragZone.dragData,
            view = data.view,
            selectionModel = view.getSelectionModel(),
            record = data.srcRecord = view.getRecord(data.item);

        data.records = [record];

        Ext.fly(dragZone.ddel).setHtml(dragZone.getDragText());
        dragZone.proxy.update(dragZone.ddel);
        dragZone.onStartDrag(x, y);
        return true;
    },

    afterSrcDrop: function (dragZone, target, e, id) {
        var me = this,
            data = dragZone.dragData,
            record = data.records[0];

        if (record) {
            me.tagGrid.getSelectionModel().select(record, true, true);
            me.srcGrid.getSelectionModel().select(data.srcRecord, true, true);
        }
    },

    syncTag2Src: function () {
        var me = this,
            recs = [],
            srcStore = me.srcGrid.getStore(),
            tagStore = me.tagGrid.getStore();

        srcStore.each(function (rec) {
            if (tagStore.getById(rec.getId()))
                recs.push(rec);
        });

        //最后一个用下面语句删除不了
        if (recs.length == 0)
            me.srcGrid.getSelectionModel().deselectAll();

        me.srcGrid.getSelectionModel().select(recs, false, true);
    }
})