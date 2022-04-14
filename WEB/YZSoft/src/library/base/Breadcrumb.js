/*
*/

Ext.define('YZSoft.src.library.base.Breadcrumb', {
    extend: 'Ext.Component',
    requires: [
        'YZSoft.src.library.base.NavigatorHistory'
    ],
    layout: {
        type: 'hbox',
        align: 'middle'
    },
    config: {
        displayField: 'text',
        store: null,
        folder: null
    },
    canBackCls: 'yz-breadcrumb-backable',
    canForwardCls: 'yz-breadcrumb-forwardable',
    folderIconCls: 'yz-breadcrumb-icon-folder',
    tpl: new Ext.XTemplate(
        '<div class="yz-breadcrumb-wrap d-flex flex-row justify-content-center align-items-center">',
            '<div class="back"></div>',
            '<div class="forward"></div>',
            '<div class="menus d-flex flex-row justify-content-center align-items-center">',
            '<tpl for="folders">',
                '<div index="{[xindex-1]}" class="menu {[values.leaf ? "leaf":"folder"]} d-flex flex-row justify-content-center align-items-center">',
                    '<div class="name">{text}</div>',
                    '<div class="more"></div>',
                '</div>',
            '</tpl>',
            '</div>',
        '</div>'
    ),
    data: {
        folders: []
    },

    initComponent: function () {
        var me = this;

        me.historyMgr = Ext.create('YZSoft.src.library.base.NavigatorHistory', {
        });

        me.callParent();

        me.store.on({
            scope: me,
            recordrenamed: 'onRecordRename'
        });

        me.historyMgr.on({
            scope: me,
            change: 'onHistoryChange'
        });

        me.on({
            element: 'el',
            delegate: '.back',
            click: 'onBackClick'
        });

        me.on({
            element: 'el',
            delegate: '.forward',
            click: 'onForwardClick'
        });

        me.on({
            element: 'el',
            delegate: '.more',
            click: 'onMoreClick'
        });

        me.on({
            element: 'el',
            delegate: '.name',
            click: 'onFolderNameClick'
        });
    },

    getFolderId: function (record) {
        return record.isRoot() ? null : record.getId();
    },

    getRecordPaths: function (rec, field, root) {
        var field = field || 'text',
            folders = []

        while (rec && (root || !rec.isRoot())) {
            folders.unshift(rec.get(field));
            rec = rec.parentNode;
        }

        return folders;
    },

    getMenuIndex: function (e) {
        var index = Ext.fly(e.getTarget('.menu')).getAttribute('index')
        return Ext.Number.parseInt(index);
    },

    findFolder: function (folders, foldersSearch) {
        var len = foldersSearch.length;

        if (folders.length >= len) {
            for (var i = len - 1; i >= 0; i--) {
                if (folders[i].text != foldersSearch[i])
                    return null;
            }
        }

        return folders[len - 1];
    },

    workto: function (keys, options) {
        options = options || {};

        var args = arguments,
            me = this,
            store = me.store,
            field = options.field || me.store.model.idProperty,
            callback = options.callback,
            scope = options.scope,
            current, index, key, expander;

        current = store.getRoot();
        index = 0;

        expander = function (newChildren) {
            var node = this,
                key, len, i, value;

            if (++index === keys.length) {
                return Ext.callback(callback, scope || me, [
                    true,
                    true,
                    node
                ]);
            }
            else {
                Ext.callback(callback, scope || me, [
                    true,
                    false,
                    node
                ]);
            }

            key = keys[index];
            key = Ext.isObject(key) ? key.text : key;

            for (i = 0, len = newChildren ? newChildren.length : 0; i < len; i++) {
                node = newChildren[i];
                value = node.get(field);

                if (value || value === 0)
                    value = value.toString();

                if (value === key)
                    return node.expand(false, expander);
            }

            node = this;
            Ext.callback(callback, scope || me, [
                false,
                true,
                node,
                key
            ]);
        };

        current.expand(false, expander);
    },

    updateFolder: function (paths) {
        this.updateFolderExt(paths);
    },

    updateFolderExt: function (paths, successFn, failedFn) {
        var me = this,
            store = me.store,
            folders = [];

        if (!Ext.isArray(paths)) {
            paths = !paths ? []:paths.split('/');
            paths.unshift(store.getRoot().get('text'));
        }

        me.workto(paths, {
            field: 'text',
            callback: function (success, last, record, key) {
                if (!success) {
                    failedFn && failedFn(record, key);
                    return;
                }

                folders.push({
                    text: record.get('text'),
                    recId: me.getFolderId(record),
                    leaf: last && Ext.isEmpty(record.childNodes)
                });

                if (last) {
                    me.historyMgr.push(folders);
                    me.showFolder(folders);
                    successFn && successFn(record);
                }
            }
        });
    },

    setCurFolders: function (folders) {
        var me = this,
            paths = [];

        for (var i = 1 ; i < folders.length ; i++)
            paths.push(folders[i].text);

        me.curFolders = folders;
        me.folder = paths.join('/');
    },

    showFolder: function (folders) {
        var me = this;

        me.setCurFolders(folders);
        me.setData({
            folders: folders
        });
    },

    popupChildFolderMenu: function (e, record) {
        var me = this,
            el = Ext.get(e.getTarget('.more')),
            items = [],
            item, glyph, icon, iconCls, menu;

        e.stopEvent();

        if (record.childNodes.length == 0)
            return;

        Ext.each(record.childNodes, function (record) {
            item = {
                iconCls: record.data.iconCls,
                text: record.get('text'),
                recId: me.getFolderId(record),
                recPaths: me.getRecordPaths(record, 'text', true),
                handler: function (item) {
                    me.onChildFolderMenuItemClick(item);
                }
            };

            glyph = record.get('glyph');
            icon = record.get('icon');
            iconCls = record.get('iconCls');

            if (glyph) {
                item.glyph = glyph;
                item.iconCls = iconCls;
            }
            else if (icon) {
                item.icon = icon;
            }
            else if (iconCls) {
                item.iconCls = iconCls;
            }
            else {
                item.iconCls = me.folderIconCls;
            }

            items.push(item);
        });

        menu = Ext.create('Ext.menu.Menu', {
            shadow: false,
            clickHideDelay: 0,
            minWidth: 180,
            bodyPadding: 0,
            defaults: {
                padding: '2 8',
                clickHideDelay: 0
            },
            items: items,
            listeners: {
                order: 'after',
                hide: function (menu) {
                    //menu.destroy();
                }
            }
        });

        menu.showBy(el, 'tl-br?', [-8, 3]);
        menu.focus();
    },

    doBackOrForword: function (folders) {
        var me = this,
            folderId;

        me.workto(folders, {
            field: 'text',
            callback: function (success, last, record, key) {
                if (!success) {
                    YZSoft.alert(Ext.String.format(RS.$('All_FolderNotExist'), key));
                    return;
                }

                if (last) {
                    folderId = me.getFolderId(record);
                    me.showFolder(folders);
                    me.fireEvent('afteropenfolderbyselect', folderId);
                }
            }
        });
    },

    onRecordRename: function (record, oldName) {
        var me = this,
            renamedFolderPaths = me.getRecordPaths(record, 'text', true);

        renamedFolderPaths.pop();
        renamedFolderPaths.push(oldName);

        me.historyMgr.each(function (folders, cur) {
            var renamedFolder = me.findFolder(folders, renamedFolderPaths);

            if (renamedFolder) {
                renamedFolder.text = record.get('text');
                if (cur) {
                    me.showFolder(folders);
                }
            }
        });
    },

    onHistoryChange: function (historyMgr, canBack, canForward) {
        var me = this;

        me[canBack? 'addCls' : 'removeCls'](me.canBackCls);
        me[canForward ? 'addCls' : 'removeCls'](me.canForwardCls);
    },

    onBackClick: function (e, t, eOpts) {
        var me = this,
            folderPaths;

        if (!me.historyMgr.canBack())
            return;

        folderPaths = me.historyMgr.popBack();
        me.doBackOrForword(folderPaths);
    },

    onForwardClick: function (e, t, eOpts) {
        var me = this,
            folderPaths;

        if (!me.historyMgr.canForword())
            return;

        folderPaths = me.historyMgr.popForword();
        me.doBackOrForword(folderPaths);
    },

    onChildFolderMenuItemClick: function (item) {
        var me = this;

        me.updateFolderExt(item.recPaths, function () {
            me.fireEvent('afteropenfolderbyselect', item.recId);
        });
    },

    onMoreClick: function (e, t, eOpts) {
        var me = this,
            index = me.getMenuIndex(e),
            folderPaths = me.curFolders.slice(0, index + 1);

        e.stopEvent();

        me.workto(folderPaths, {
            field: 'text',
            callback: function (success, last, record, key) {
                if (!success) {
                    YZSoft.alert(Ext.String.format(RS.$('All_FolderNotExist'), key));
                    return;
                }

                if (last) {
                    me.popupChildFolderMenu(e, record);
                }
            }
        });
    },

    onFolderNameClick: function (e, t, eOpts) {
        var me = this,
            index = me.getMenuIndex(e),
            folderPaths = me.curFolders.slice(0, index + 1);

        e.stopEvent();

        me.updateFolderExt(folderPaths, function (record) {
            me.fireEvent('afteropenfolderbyselect', me.getFolderId(record));
        }, function (record, key) {
            YZSoft.alert(Ext.String.format(RS.$('All_FolderNotExist'), key));
        });
    },

    doDestroy: function () {
        Ext.destroy(this.historyMgr);
        this.setStore(null);
        this.callParent();
    }
});