/*
events:
folderdblclick
objectdblclick
folderclick
objectclick
beforeopenfolder
afteropenfolderbymanual
foldercontextmenu
objectcontextmenu
containercontextmenu
selectionchange
*/
Ext.define('YZSoft.src.library.base.View', {
    extend: 'Ext.container.Container',
    layout: 'card',
    libPanel: null,
    store: null,
    folderId: -1, //变量

    initComponent: function () {
        var me = this,
            libPanel = me.libPanel,
            viewType = libPanel.viewType || 'detail';

        me.views = {};
        me.views[viewType] = me.getView(viewType);
        me.items = [me.views[viewType]];

        me.callParent(arguments);

        me.on({
            scope: me,
            itemdblclick: function(view, record, item, index, e, eOpts) {
                if (record.data.$$$isFolder)
                    me.fireEvent('folderdblclick', record, e);
                else
                    me.fireEvent('objectdblclick', record, e);
            },
            itemclick: function (view, record, item, index, e, eOpts) {
                if (record.data.$$$isFolder)
                    me.fireEvent('folderclick', record, e);
                else
                    me.fireEvent('objectclick', record, e);
            },
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                if (record.data.$$$isFolder)
                    me.fireEvent('foldercontextmenu', record, e);
                else
                    me.fireEvent('objectcontextmenu', record, e);
            },
            folderdblclick: 'onFolderDblClick'
        });

        me.store.on({
            remove: function (store, records, index, isMove, eOpts) {
                var folderRecs = [];

                Ext.each(records, function (rec) {
                    if (rec.data.$$$isFolder) {
                        folderRecs.push(rec);
                    }
                });

                if (folderRecs.length) {
                    me.fireEvent('folderremove', me.folderId, folderRecs);
                }
            }
        });
    },

    relayEventsToActiveView: function (events) {
        var me = this;

        Ext.each(events, function (eventName) {
            me.on(eventName, function () {
                me.getActiveView().fireEventArgs(eventName, arguments);
            });
        });
    },

    onFolderDblClick: function (record) {
        this.openFolderByRecord(record);
    },

    getActiveView: function () {
        return this.getLayout().getActiveItem();
    },

    setActiveView: function (view) {
        return this.getLayout().setActiveItem(view);
    },

    getView: function (type) {
        var me = this,
            libPanel = me.libPanel,
            store = me.store,
            type = type || 'detail',
            createFn = Ext.String.format('create{0}View', Ext.String.capitalize(type)),
            view;

        view = me.views[type];
        if (!view) {
            view = libPanel[createFn].call(libPanel, {
                type: type,
                parentView: me,
                store: store
            });
            me.views[type] = view;

            me.relayEvents(view, [
                'itemdblclick',
                'itemclick',
                'itemcontextmenu',
                'containercontextmenu',
                'validateedit',
                'selectionchange'
            ]);
        }

        return view;
    },

    destroyView: function (view) {
        var me = this.
            type = view.view;

        delete me.views[type];
        activeView.destroy();
    },

    setViewType: function (type) {
        var me = this,
            activeView = me.getActiveView(),
            view;

        if (activeView.type == type)
            return;

        Ext.suspendLayouts();

        view = me.getView(type);
        me.add(view);
        me.setActiveView(view);
        if (activeView) {
            me.remove(activeView);
            delete me.views[activeView.type];
            activeView.destroy();
        }

        Ext.resumeLayouts(true);
    },

    openFolderByRecord: function (record) {
        var me = this,
            libPanel = me.libPanel,
            childFolderId = libPanel.combileChildFolderId(me.folderId, record);

        me.openFolder(childFolderId, function () {
            me.fireEvent('afteropenfolderbymanual', childFolderId);
        });
    },

    openFolder: function (folderId, fn) {
        var me = this,
            store = me.store;

        if (me.folderId == folderId)
            return;

        me.fireEvent('beforeopenfolder', folderId);
        me.setFolderId(folderId);
        store.loadPage(1, {
            loadMask: false,
            callback: function (records, operation, success) {
                if (success) {
                    fn && fn();
                }
            }
        });
    },

    setFolderId: function (folderId) {
        var me = this,
            store = me.store,
            extParams = store.getProxy().getExtraParams();

        me.folderId = folderId;
        Ext.apply(extParams, {
            folderId: folderId
        });
    }
});