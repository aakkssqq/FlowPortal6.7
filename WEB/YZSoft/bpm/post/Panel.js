
Ext.define('YZSoft.bpm.post.Panel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.ux.FormManager'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.tree = Ext.create('YZSoft.bpm.post.Tree', {
            activeNode: config.activeNode,
            region: 'center',
            hideHeaders: true,
            ui: 'light',
            header: {
                title: RS.$('All_Post_Tree_Title'),
                cls: 'yz-header-hight-s yz-header-font-size-s',
                padding: '6 8',
                style:'background-color:#f7eee4;'
            },
            listeners: {
                selectionchange: function (selModel, selected, eOpts) {
                    var rec = selected[0];
                    if(rec)
                        me.view.setPath(rec.isRoot() ? '' : rec.data.path);
                }
            }
        });

        me.view = Ext.create('YZSoft.bpm.post.View', {
            region: 'center'
        });

        me.edtSearch = Ext.create('YZSoft.src.form.field.Search', {
            region: 'north',
            store: me.view.store,
            emptyText:RS.$('All_Post_Search_EmptyText'),
            margin:'6 6'
        });

        cfg = {
            layout: 'border',
            items: [
                me.view, {
                    xtype: 'container',
                    region: 'east',
                    style:'background-color:#fff;',
                    width: 350,
                    split: {
                        cls: 'yz-spliter',
                        size: 5,
                        collapseOnDblClick: false,
                        collapsible: true
                    },
                    layout: 'border',
                    items: [me.edtSearch,me.tree]
                }
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.view.on({
            itemdblclick: function (view, record, item, index, e, eOpts) {
                me.openForm(record);
            },
            processnameclick: function (record, view, e) {
                me.openForm(record);
            },
            flowchartclick: function (record, view, e) {
                YZSoft.ViewManager.addView(me, 'YZSoft.bpm.process.Panel', {
                    id: 'BPM_FlowChart_' + YZSoft.util.hex.encode(record.data.ProcessName),
                    title: Ext.String.format('{0} - {1}', RS.$('All_ProcessChart'), record.data.ProcessName),
                    processName: record.data.ProcessName,
                    processVersion: record.data.ProcessVersion,
                    closable: true
                });
            },
            delegateclick: function (record, view, e) {
                YZSoft.bpm.src.ux.FormManager.openDelegationPostWindow(record.data.ProcessName, {
                    sender: this
                });
            },
            favoriteclick: function (record, view, e) {
                var el = e.getTarget('.favorite',null,true),
                    favorited = el.hasCls('favorited');

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/core/Favorite.ashx'),
                    params: {
                        method: favorited ? 'CancelFavorite' : 'AddFavorite',
                        resType: 'Process',
                        resId: record.data.ProcessName
                    },
                    success: function (action) {
                        el[action.result ? 'addCls' : 'removeCls']('favorited');
                        //record.set('Favorited', action.result); 奇偶行显示丢失
                    }
                });
            },
            bpaclick: function (record, view, e) {
                YZSoft.ViewManager.addView(me, 'YZSoft.bpm.km.file.bpm.Panel', {
                    id: 'ProcessKM_' + YZSoft.util.hex.encode(record.data.ProcessName),
                    title: Ext.String.format('{0} - {1}', RS.$('All_BPM_BPAFileLink'), record.data.ProcessName),
                    processName: record.data.ProcessName,
                    version: record.data.ProcessVersion,
                    closable: true
                });
            }
        });
    },

    onActivate: function (times) {
        if (times == 0) {
            this.tree.store.load($S.loadMask.first);
            this.view.store.load($S.loadMask.first);
        }
        else {
            this.view.store.reload($S.loadMask.activate);
        }
    },

    openForm: function (record) {
        YZSoft.bpm.src.ux.FormManager.openPostWindow(record.data.ProcessName, {
            sender: this
        });
    }
});
