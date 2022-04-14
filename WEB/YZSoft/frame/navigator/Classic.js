/*
经典导航（树形）
dataURL
treeConfig,
leafOnly,
noicon
*/
Ext.define('YZSoft.frame.navigator.Classic', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.ux.Badge'
    ],
    header: false,
    border: false,
    cls: 'yz-cnt-navigator',
    collapsible: false,
    collapsedCls: 'yz-collpase-hideheader',
    layout: 'fit',
    region: 'west',
    width: ($S.navigater || {}).width || 140,
    split: {
        size: 1,
        cls: 'yz-split-navigator'
    },
    minWidth: 100,
    maxWidth: 500,

    constructor: function (config) {
        var me = this,
            cfg;

        config = Ext.apply({}, config, config.classicNavigatorDefaults);
        Ext.apply(this, config);

        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            fields: ['id', 'text', 'caption', 'moduleUrl', 'tabs', 'activeNode', 'activeTab', 'path', 'config', 'ment', 'building', 'xclass', 'badgeId', 'badgeCls'],
            proxy: {
                type: 'ajax',
                url: config.dataURL,
                extraParams: {
                    method: 'GetModuleTree'
                }
            },
            listeners: {
                load: function (store, records, successful, operation, eOpts) {
                    if (!successful)
                        return;

                    if (!config.ignoreActiveNode) {
                        if (!me.activeNode) {
                            var find = store.findNode('leaf', true);
                            me.activeNode = find && find.id;
                        }

                        if (me.activeNode)
                            me.setActiveNode(me.activeNode);
                    }

                    store.each(function (record) {
                        if (record.data.badgeId) {
                            var badge = YZSoft.src.ux.Badge.getBadge(record.data.badgeId);
                            if (badge)
                                me.updateBadge(record, badge.badgeText);
                        }
                    });
                }
            }
        });

        if (Ext.ClassManager.get('YZSoft.src.ux.Badge')) {
            YZSoft.src.ux.Badge.on({
                scope: me,
                badgeChange: 'onBadgeChange'
            });
        }

        //左侧菜单
        me.tree = Ext.create('Ext.tree.Panel', Ext.apply({
            header: false,
            border: false,
            cls:'yz-tree-navigator',
            rootVisible: false,
            store: me.store,
            root: {
                text: 'Root',
                id: 'root',
                expanded: false
            },
            viewConfig: {
                loadMask: false,
                markDirty: false
            },
            listeners: {
                afterrender: function (tree, eOpts) {
                    me.tree.getView().expand(me.tree.getRootNode());
                },
                beforeitemappend: function (parent, node, eOpts) {
                    if (parent.data.ment)
                        return false;

                    node.data.icon = '';
                    if (!node.data.children || node.data.children.length == 0 || node.data.ment)
                        node.data.leaf = true;

                    if (parent.data.depth == 0)
                        node.data.cls = 'yz-level1-menu';
                    else
                        node.data.cls = Ext.String.format('yz-nolevel1-menu yz-level{0}-menu', parent.data.depth + 1);
                },
                selectionchange: function (sm, selected, eOpts) {
                    if (selected.length == 1 && selected[0].isLeaf())
                        me.fireEvent('moduleselectionchange', me, selected[0]);
                },
                beforeselect: function (sm, record, index, eOpts) {
                    if (!record.isLeaf())
                        return false;

                    var nodef = sm.getLastSelected();
                    var v = me.tree.getView();
                    if (nodef && nodef.parentNode) {
                        var dom = v.getNode(nodef.parentNode, true);
                        if (dom) {
                            var el = Ext.get(dom);
                            el.removeCls('yz-tab-folder-active');
                        }
                    }
                    var nodet = record;
                    if (nodet && nodet.parentNode) {
                        var dom = v.getNode(nodet.parentNode, true);
                        if (dom) {
                            var el = Ext.get(dom);
                            el.addCls('yz-tab-folder-active');
                        }
                    }
                },
                beforeitemmousedown: function (tree, record, item, index, e, eOpts) {
                    if (!record.isLeaf())
                        return false;
                },
                beforeitemclick: function (tree, record, item, index, e, eOpts) {
                    if (!record.isLeaf()) {
                        me.tree.getView().toggle(record, e.ctrlKey);
                        return false;
                    }
                }
            }
        }, config.treeConfig));

        if (config.leafOnly)
            me.tree.addCls('yz-tree-navigator-leafonly');

        if (config.noicon)
            me.tree.addCls('yz-tree-navigator-noicon');

        cfg = {
            items: [me.tree]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    setActiveNode: function (nodeid, callback, scope, autoSelectFirst) {
        var me = this,
            autoSelectFirst = autoSelectFirst !== false,
            sm = me.tree.getSelectionModel(),
            selection = sm.getSelection();

        if (me.store.isLoaded()) {
            var record = me.store.getNodeById(nodeid);

            if ((autoSelectFirst || selection.length == 0) && !record)
                record = me.tree.getRootNode() && me.tree.getRootNode().firstChild;

            if (record) {
                sm.select(record);

                if (callback)
                    callback.call(scope || me, record);
            }
        }
        else {
            delete me.activeNode;
            me.store.on({
                single: true,
                load: function () {
                    me.setActiveNode(nodeid, callback, scope, autoSelectFirst);
                }
            });
        }
    },

    onBadgeChange: function (badgeId, badgeText) {
        var me = this,
            badgeText, rec;

        rec = me.store.findRecord('badgeId', badgeId);
        if (rec) {
            me.updateBadge(rec, badgeText ? badgeText : '');
        }
    },

    updateBadge: function (rec, badgeText) {
        badgeText = badgeText ? Ext.String.format("<div class='yz-nav-badge {0} yz-hasbadge'>{1}</div>", rec.data.badgeCls, badgeText) : '';
        rec.textSaved = rec.textSaved || rec.data.text;

        if (badgeText)
            rec.set('text', rec.textSaved + badgeText);
        else
            rec.set('text', rec.textSaved);
    },

    getPlaceholder: function (direction) {
        var me = this,
            collapseDir = direction || me.collapseDirection,
            placeholder = me.placeholder;

        if (!placeholder) {
            me.placeholder = placeholder = Ext.create('Ext.Component', {
                id: me.id + '-placeholder',
                width: 0
            });
        }

        return placeholder;
    }
});
