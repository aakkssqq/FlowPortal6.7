/*
config:
tree
grid
property:
tree
grid
*/

Ext.define('YZSoft.bpm.src.panel.SelUserPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.tree.OrgTree',
        'YZSoft.bpm.src.model.UserExt',
        'YZSoft.bpm.src.ux.Render'
    ],
    layout: 'border',
    border: false,
    grid: {
        width: 270
    },
    member: false,
    model:'YZSoft.bpm.src.model.UserExt',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.tree = Ext.create('YZSoft.bpm.src.tree.SelUserOrgTree', Ext.apply({
            region: 'center',
            header: false,
            margins: '0 0 0 0',
            border: false
        }, config.tree));
        delete config.tree;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            sortInfo: { field: 'Account', direction: 'ASC' },
            model: me.model,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            region: 'east',
            hideHeaders: true,
            margins: '0 0 0 0',
            store: me.store,
            split: { size: 1 },
            border: false,
            selModel: { mode: 'SINGLE' },
            viewConfig: {
                stripeRows: false
            },
            columns: {
                defaults: {
                    sortable: true,
                    hideable: true,
                    menuDisabled: false
                },
                items: [
                    { text: '', dataIndex: 'Account', align: 'left', flex: 1, renderer: me.renderUser }
                ]
            }
        }, config.grid, me.grid));
        delete config.grid;

        me.edtSearch = Ext.create('YZSoft.src.form.field.Search', {
            width: 210,
            emptyText: RS.$('All_Search'),
            listeners: {
                scope: me,
                searchclick: 'onSearchClick'
            }
        });

        cfg = {
            header: {
                items: [me.edtSearch],
                padding: '2 2 3 12'
            },
            items: [me.tree, me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.tree.on({
            selectionchange: function (sm, selected, eOpts) {
                if (selected.length >= 1)
                    me.onTreeSelChanged(selected[0])
            }
        });
    },

    renderUser: function (value, metaData, record) {
        return YZSoft.bpm.src.ux.Render.getUserFriendlyName(record.data.Account, record.data.DisplayName);
    },

    onTreeSelChanged: function (record) {
        var me = this;

        if (!record)
            return;

        if (record.data.id == 'root')
            return;

        if (record.data.nodeType == 'recentlyUser') {
            me.setTitle(record.data.text);

            var extparams = me.store.getProxy().getExtraParams();
            Ext.apply(extparams, {
                method: 'GetUsersInPath',
                path: 'BPMOU://中国电科'
            });
            me.store.load();
        }
        else if (record.data.nodetype == 'searchResult') {
            me.setTitle(record.data.text);

            var extparams = me.store.getProxy().getExtraParams();
            Ext.apply(extparams, {
                method: me.member ? 'SearchMember':'SearchUser',
                kwd: record.kwd
            });
            me.store.load();
        }
        else {
            me.setTitle(me.tree.getPath(record));

            var extparams = me.store.getProxy().getExtraParams();
            Ext.apply(extparams, {
                method: 'GetUsersInPath',
                path: record.data.data.FullName
            });
            me.store.load();
        }
    },

    onSearchClick: function () {
        var me = this,
            sm = me.tree.getSelectionModel(),
            kwd;

        kwd = me.edtSearch.getValue();
        if (Ext.isEmpty(kwd))
            return;

        var text = Ext.String.format(RS.$('All_OrgUserPanel_SearchUserResult'), kwd),
            rootNode = me.tree.getRootNode(),
            resultNode;

        if (rootNode.lastChild && rootNode.lastChild.data.nodetype == 'searchResult') {
            resultNode = rootNode.lastChild;
            resultNode.set('text', text);
        }
        else {
            resultNode = rootNode.appendChild({
                glyph: 0xeada,
                leaf: false,
                expandable: false,
                text: text,
                nodetype:'searchResult'
            });
        }

        resultNode.kwd = kwd;
        if (sm.isSelected(resultNode))
            me.onTreeSelChanged(resultNode);
        else
            sm.select(resultNode);
    }
});
