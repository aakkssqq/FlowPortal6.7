
Ext.define('YZSoft.bpm.post.favorite.Panel', {
    extend: 'Ext.panel.Panel',
    bodyStyle:'z-index:0',
    requires: [
        'YZSoft.bpm.src.model.ProcessInfo',
        'YZSoft.bpm.src.ux.FormManager'
    ],
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">',
        '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-favoriteprocess">',
            '<div class="d-flex flex-row">',
                '<div class="d-flex flex-row justify-content-center align-items-center leftcol">',
                    '<div class="icon" style="background-color:{Color}">{ShortName:text}</div>',
                '</div>',
                '<div class="flex-fill d-flex flex-column align-items-stretch rightcol">',
                    '<div class="flex-fill text-truncate processname">{ProcessName:text}<span class="ver">v{ProcessVersion}</span></div>',
                    '<div class="d-flex flex-row align-items-center optrow">',
                        '<div class="yz-nowrap opt flowchart" data-qtip="' + RS.$('All_ProcessChart') + '"></div>',
                        '<div class="yz-nowrap opt delegate" data-qtip="' + RS.$('All_Post_Delegate') + '"></div>',
                        '<tpl if="YZSoft.modules.BPA !== false && RelatedFile">',
                            '<div class="yz-nowrap opt bpa" data-qtip="' + RS.$('All_SOP')+'"></div>',
                        '</tpl>',
                        '<div class="flex-fill"></div>',
                        '<div class="yz-nowrap opt post">' + RS.$('All_Favorite_PostRequest') + '</div>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="remove"></div>',
        '</div>',
        '</tpl>'
    ),
    editingCls: 'yz-status-editing',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.bpm.src.model.ProcessInfo',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Process.ashx'),
                extraParams: {
                    method: 'GetFavoriteProcesses'
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.dd = Ext.create('YZSoft.src.view.plugin.DragDrop', {
            disabled: true,
            dragZone: {
                getDragText: function () {
                    var dragZone = this,
                        data = dragZone.dragData,
                        record = data.records[0];

                    return record.data.ProcessName;
                }
            }
        });

        me.view = Ext.create('Ext.view.View', {
            padding: 30,
            store: me.store,
            overItemCls: 'yz-dataview-item-over',
            itemSelector: 'div.yz-dataview-item',
            tpl: me.tpl,
            scrollable: true,
            plugins: [me.dd],
            loadMask: {
                target:me
            },
            listeners: {
                itemclick: function (view, record, item, index, e, eOpts) {
                    var target = me.getTarget(e);

                    if (target) {
                        e.stopEvent();
                        me.fireEvent(target + 'click', record, view, e);
                    }
                },
                itemdblclick: function (view, record, item, index, e, eOpts) {
                    var target = me.getTarget(e);

                    if (target)
                        return;

                    me.fireEvent('itemdblclick', view, record, item, index, e, eOpts);
                }
            }
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Edit'),
            iconCls: 'yz-glyph yz-glyph-edit',
            handler: function () {
                if (me.isEditing()) {
                    me.removeCls(me.editingCls);
                    me.btnEdit.setText(RS.$('All_Edit'));
                }
                else {
                    me.addCls(me.editingCls);
                    me.btnEdit.setText(RS.$('All_Done'));
                }
            }
        });

        me.btnNew = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Add'),
            cls:'yz-s-editing-hide',
            iconCls: 'yz-glyph yz-glyph-ead6',
            handler: function () {
                Ext.create('YZSoft.bpm.src.dialogs.SelProcessDlg', {
                    autoShow: true,
                    bpmServer: me.bpmServer,
                    fn: function (process) {
                        YZSoft.Ajax.request({
                            url: YZSoft.$url('YZSoft.Services.REST/core/Favorite.ashx'),
                            waitMsg: {
                                msg: RS.$('All_Adding'),
                                target: me
                            },
                            params: {
                                method: 'AddFavorite',
                                resType: 'Process',
                                resId: process.ProcessName
                            },
                            success: function (action) {
                                me.store.loadPage(1, {
                                    loadMask: {
                                        msg: RS.$('All_LoadMask_Add_Success')
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

        me.btnRefresh = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Refresh'),
            cls: 'yz-s-editing-hide',
            iconCls: 'yz-glyph yz-glyph-refresh',
            handler: function () {
                me.store.reload({
                    loadMask: true
                });
            }
        });

        cfg = {
            layout: 'fit',
            tbar: {
                //cls: 'yz-tbar-module',
                padding: '30 36 0 36',
                items: [
                    me.btnEdit,
                    me.btnNew,
                    '->',
                    me.btnRefresh
                ]
            },
            items: [me.view]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            itemdblclick: function (view, record, item, index, e, eOpts) {
                if (me.isEditing())
                    return;

                me.openForm(record);
            },
            postclick: function (record, view, e) {
                if (me.isEditing())
                    return;

                me.openForm(record);
            },
            flowchartclick: function (record, view, e) {
                if (me.isEditing())
                    return;

                YZSoft.ViewManager.addView(me, 'YZSoft.bpm.process.Panel', {
                    id: 'BPM_FlowChart_' + YZSoft.util.hex.encode(record.data.ProcessName),
                    title: Ext.String.format('{0} - {1}', RS.$('All_ProcessChart'), record.data.ProcessName),
                    processName: record.data.ProcessName,
                    processVersion: record.data.ProcessVersion,
                    closable: true
                });
            },
            delegateclick: function (record, view, e) {
                if (me.isEditing())
                    return;

                YZSoft.bpm.src.ux.FormManager.openDelegationPostWindow(record.data.ProcessName, {
                    sender: this
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
            },
            removeclick: function (record, view, e) {
                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/core/Favorite.ashx'),
                    params: {
                        method: 'CancelFavorite',
                        resType: 'Process',
                        resId: record.data.ProcessName
                    },
                    waitMsg: {
                        msg: RS.$('All_Deleting'),
                        target: me
                    },
                    success: function (action) {
                        me.store.remove(record);
                    }
                });
            }
        });

        me.on({
            scope: me,
            beforedrop: 'onBeforeItemDrop'
        });
    },

    getTarget: function (e) {
        var targets, rv;

        targets = {
            flowchart: e.getTarget('.flowchart'),
            delegate: e.getTarget('.delegate'),
            bpa: e.getTarget('.bpa'),
            post: e.getTarget('.post'),
            remove: e.getTarget('.remove')
        };

        Ext.Object.each(targets, function (name, value) {
            if (value) {
                rv = name;
                return false;
            }
        });

        return rv;
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);
    },

    isEditing: function () {
        return this.hasCls(this.editingCls);
    },

    openForm: function (record) {
        YZSoft.bpm.src.ux.FormManager.openPostWindow(record.data.ProcessName, {
            sender: this
        });
    },

    onBeforeItemDrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
        var me = this,
            record = overModel,
            ids = [];

        Ext.Array.each(data.records, function (rec) {
            ids.push(rec.data.ProcessName);
        });

        dropHandlers.wait = true;
        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/Favorite.ashx'),
            waitMsg: {
                msg: RS.$('All_Moving')
            },
            params: {
                method: 'MoveFavorites',
                resType: 'Process',
                target: record.data.ProcessName,
                position: dropPosition
            },
            jsonData: ids,
            success: function (action) {
                dropHandlers.processDrop();
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
                dropHandlers.cancelDrop();
            }
        });
    }
});
