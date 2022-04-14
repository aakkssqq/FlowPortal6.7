/*
config:
bpmServer
tree
grid
property:
tree
grid
treePerm
listPerm
*/

Ext.define('YZSoft.bpm.src.panel.SelProcessPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.model.ProcessInfo'
    ],
    layout: 'border',
    border: false,
    treePerm: 'Read',
    listPerm: 'Read',

    constructor: function (config) {
        var me = this,
            config = config || {},
            treePerm = config.treePerm || me.treePerm,
            listPerm = config.listPerm || me.listPerm,
            cfg;

        me.tree = Ext.create('YZSoft.bpm.src.tree.ProcessTree', Ext.apply({
            region: 'center',
            header: false,
            margins: '0 0 0 0',
            border: false,
            perm: treePerm,
            bpmServer: config.bpmServer
        }, config.tree));
        delete config.tree;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.ProcessInfo',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Process.ashx'),
                extraParams: {
                    method: 'GetProcessesInFolder',
                    bpmServer: config.bpmServer,
                    perm: listPerm
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            region: 'east',
            hideHeaders: true,
            width: 270,
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
                    { text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', flex: 1, formatter:'text' }
                ]
            }
        }, config.grid));
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

    onTreeSelChanged: function (record) {
        var me = this;

        if (!record)
            return;

        if (record.data.nodetype == 'searchResult') {
            me.setTitle(record.data.text);

            var extparams = me.store.getProxy().getExtraParams();
            Ext.apply(extparams, {
                searchType: 'QuickSearch',
                kwd: record.kwd
            });
            me.store.load();
        }
        else {
            me.setTitle(me.tree.getPath(record));

            var extparams = me.store.getProxy().getExtraParams();

            Ext.apply(extparams, {
                searchType: '',
                path: record.isRoot() ? '' : record.data.path
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
                nodetype: 'searchResult'
            });
        }

        resultNode.kwd = kwd;
        if (sm.isSelected(resultNode))
            me.onTreeSelChanged(resultNode);
        else
            sm.select(resultNode);
    }
});
