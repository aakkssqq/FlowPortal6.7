Ext.define('YZSoft.src.jmap.link.LinkAbstract', {
    extend: 'Ext.draw.sprite.Path',
    requires: [
        'YZSoft.src.flowchart.overrides.Sprite'
    ],
    inheritableStatics: {
        def: {
            updaters: {
                children: function (attr) {
                    this.updateChildren(attr);
                }
            }
        }
    },
    config: {
        fromTree: null,
        fromRecord: null,
        toTree: null,
        toRecord: null
    },

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);
        me.onPositionUpdate();
    },

    updateSurface: function (surface, oldSurface) {
        var me = this;

        me.callParent(arguments);

        if (me.surfeceListener) {
            Ext.destroy(me.surfeceListener);
            delete me.surfeceListener;
        }

        if (surface) {
            me.surfeceListener = surface.renderElement.on({
                scope: me,
                destroyable: true,
                resize: 'onPositionUpdate'
            });

            me.onPositionUpdate();
        }
    },

    bindTree: function (tree, id) {
        var me = this,
            treeScroller = tree.getScrollable();

        me.treeListener = me.treeListener || {};
        if (me.treeListener[id]) {
            Ext.destroy(me.treeListener[id]);
            delete me.treeListener[id];
        }

        me.treeListener[id] = tree.on({
            scope: me,
            destroyable: true,
            viewready: 'onPositionUpdate',
            itemcollapse: 'onPositionUpdate',
            itemexpand: 'onPositionUpdate',
            yzrecordremove: 'onRecordRemove',
            iteminsert: function () {
                Ext.defer(function () {
                    me.onPositionUpdate();
                }, 1);
            }
        });

        me.scrollerListener = me.scrollerListener || {};
        if (me.scrollerListener[id]) {
            Ext.destroy(me.scrollerListener[id]);
            delete me.scrollerListener[id];
        }

        me.scrollerListener[id] = treeScroller.on({
            scope: me,
            destroyable: true,
            scroll: 'onPositionUpdate'
        });

        me.storeListener = me.storeListener || {};
        if (me.storeListener[id]) {
            Ext.destroy(me.storeListener[id]);
            delete me.storeListener[id];
        }

        me.storeListener[id] = tree.getStore().on({
            scope: me,
            destroyable: true
        });
    },

    bindRecord: function (record, id) {
        var me = this;

        me.recordListener = me.recordListener || {};
        if (me.recordListener[id]) {
            Ext.destroy(me.recordListener[id]);
            delete me.recordListener[id];
        }

        me.recordListener[id] = record.on({
            scope: me,
            destroyable: true
        });
    },

    updateFromTree: function (tree, oldtree) {
        var me = this;

        me.onPositionUpdate();
        me.bindTree(tree,'from');
    },

    updateToTree: function (tree, oldtree) {
        var me = this;

        me.onPositionUpdate();
        me.bindTree(tree, 'to');
    },

    updateFromRecord: function (record,oldrecord) {
        var me = this;

        me.onPositionUpdate();
        me.bindRecord(record, 'from');
    },

    updateToRecord: function (record, oldrecord) {
        var me = this;

        me.onPositionUpdate();
        me.bindRecord(record, 'to');
    },

    onRecordRemove: function (tree, record) {
        var me = this,
            surface = me.getSurface(),
            fromRecord = me.getFromRecord(),
            toRecord = me.getToRecord();

        if (record == fromRecord || fromRecord.isAncestor(record) ||
            record == toRecord || toRecord.isAncestor(record)) {
            surface.remove(me, true);
            surface.renderFrame();
        }
        else {
            me.onPositionUpdate();
        }
    },

    lookupVisibleNode: function (tree, record) {
        while (record) {
            if (record.isVisible()) {
                return tree.getView().getNode(record);
            }
            record = record.parentNode;
        }
    },

    render: function (surface, ctx) {
        var me = this,
            mat = me.attr.matrix,
            attr = me.attr;

        me.callParent(arguments);

        mat.toContext(ctx);
        me.renderChildren(surface, ctx);
    },

    destroy: function () {
        var me = this;

        if (me.surfeceListener) {
            Ext.destroy(me.surfeceListener);
            delete me.surfeceListener;
        }

        if (me.treeListener) {
            if (me.treeListener.from) {
                Ext.destroy(me.treeListener.from);
                delete me.treeListener.from;
            }

            if (me.treeListener.to) {
                Ext.destroy(me.treeListener.to);
                delete me.treeListener.to;
            }

            delete me.treeListener;
        }

        if (me.scrollerListener) {
            if (me.scrollerListener.from) {
                Ext.destroy(me.scrollerListener.from);
                delete me.scrollerListener.from;
            }

            if (me.scrollerListener.to) {
                Ext.destroy(me.scrollerListener.to);
                delete me.scrollerListener.to;
            }

            delete me.scrollerListener;
        }

        if (me.storeListener) {
            if (me.storeListener.from) {
                Ext.destroy(me.storeListener.from);
                delete me.storeListener.from;
            }

            if (me.storeListener.to) {
                Ext.destroy(me.storeListener.to);
                delete me.storeListener.to;
            }

            delete me.storeListener;
        }

        if (me.recordListener) {
            if (me.recordListener.from) {
                Ext.destroy(me.recordListener.from);
                delete me.recordListener.from;
            }

            if (me.recordListener.to) {
                Ext.destroy(me.recordListener.to);
                delete me.recordListener.to;
            }

            delete me.recordListener;
        }

        me.callParent();
    }
});