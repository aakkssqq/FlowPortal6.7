/*
config:
root
*/
Ext.define('YZSoft.mobile.form.Navigator', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.model.ProcessFolder'
    ],
    header: false,
    border: false,
    region: 'west',
    width: 295,
    minWidth: 100,
    maxWidth: 500,
    split: {
        size: 5,
        collapseOnDblClick: false,
        collapsible: true
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'YZSoft.bpm.src.model.ProcessFolder',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Process.ashx'),
                extraParams: {
                    method: 'GetTree',
                    perm: 'Write',
                    expand: false,
                    process: true
                }
            }
        });

        me.tree = Ext.create('Ext.tree.Panel', {
            header: false,
            border: false,
            rootVisible: true,
            useArrows: true,
            store: me.store,
            hideHeaders: true,
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1
            }],
            root: {
                text: RS.$('All_ProcessLib'),
                expanded: false
            },
            listeners: {
                scope: me,
                selectionchange: 'onSelectionChange'
            }
        });

        me.btnCollapse = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-collapse',
            tooltip: RS.$('All_Collapse'),
            handler: function () {
                me.collapse();
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            tooltip: RS.$('All_Refresh'),
            handler: function () {
                me.tree.store.load({
                    loadMask: true
                });
            }
        });

        cfg = {
            border: false,
            collapsible: false,
            layout: 'fit',
            tbar: {
                cls: 'yz-tbar-navigator',
                items: [me.btnCollapse, '->', me.btnRefresh]
            },
            items: [me.tree]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            afterrender: 'onAfterRender'
        });
    },

    onAfterRender: function (tree, eOpts) {
        var me = this,
            tree = me.tree,
            root = tree.getRootNode(),
            sm = tree.getSelectionModel();

        root.expand(false, function () {
            me.tree.getView().refresh();
            var firstProcess = root.findChildBy(function (rec) {
                return rec.isLeaf();
            });
            sm.select(firstProcess || root);

            tree.on({
                beforeselect: function (tree, record, index, eOpts) {
                    return record.isLeaf();
                }
            });
        });
    },

    onSelectionChange: function (sm, selected, eOpts) {
        var me = this;

        if (selected.length == 1 && selected[0].isLeaf())
            me.fireEvent('moduleselectionchange', me, selected[0]);
    }
});
