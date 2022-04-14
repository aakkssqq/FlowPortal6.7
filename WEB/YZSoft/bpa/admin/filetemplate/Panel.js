
/*
config
    path,
    moduleName
*/
Ext.define('YZSoft.bpa.admin.filetemplate.Panel', {
    extend: 'Ext.container.Container',
    requires: [
    ],
    layout: 'border',
    style: 'background-color:white',
    pathFolderMap: {
        EVC: 'BPAProcess',
        BPMN: 'BPAProcess',
        FlowChart: 'BPAProcess',
        Org: 'BPAOU',
        Data: 'BPAData',
        ITSystem: 'BPAITSystem',
        Product: 'BPAProduct',
        KPI: 'BPAControl',
        Risk: 'BPAControl',
        Regulation: 'BPAControl'
    },
    extMap: {
        EVC: '.evc',
        BPMN: '.bpmn',
        FlowChart: '.flow',
        Org: '.org',
        Data: '.data',
        ITSystem: '.it',
        Product: '.product',
        KPI: '.kpi',
        Risk: '.risk',
        Regulation: '.reg'
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            path = config.path,
            cfg;

        me.btnNew = Ext.create('Ext.button.Button', {
            text: RS.$('All_AddTemplate'),
            cls: 'bpa-btn-solid-hot',
            margin: '0 10 0 0',
            handler: function () {
                me.addFile();
            }
        });

        me.btnRename = Ext.create('Ext.button.Button', {
            text: RS.$('All_Rename'),
            cls: 'bpa-btn-box-hot',
            margin: '0 10 0 0',
            handler: function () {
                var recs = me.view.getSelectionModel().getSelection();
                if (recs.length == 1) {
                    me.view.startRename(recs[0], {
                        maskTarget: me
                    });
                }
            }
        });

        me.btnDelete = Ext.create('Ext.button.Button', {
            text: RS.$('All_Delete'),
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-recyclebin',
            handler: function () {
                var recs = me.view.getSelectionModel().getSelection();
                if (recs.length != 0) {
                    me.view.deleteRecords(recs, {
                        maskTarget: me
                    });
                }
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            text: RS.$('All_Refresh'),
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-refresh',
            margin: 0,
            style:'padding-right:0px',
            handler: function () {
                me.view.store.reload({
                    loadMask: true
                });
            }
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            height: 64,
            defaults: {
            },
            items: [
                me.btnNew,
                me.btnRename,
                me.btnDelete,
                '->',
                me.btnRefresh
            ]
        });

        me.view = Ext.create('YZSoft.bpa.admin.filetemplate.View', {
            region: 'center',
            path: path
        });

        me.view.on({
            scope: me,
            selectionchange: 'updateStatus',
            itemcontextmenu: 'onItemContextMenu',
            containercontextmenu: 'onContainerContextMenu'
        });

        cfg = {
            padding: '10 40 30 40',
            items: [me.toolbar, me.view]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();

        me.on({
            switchActive: function (config) {
                me.view.showFolder(config.path, {
                    loadMask: true
                });
            }
        });
    },

    addFile: function () {
        var me = this;

        me.view.addFile({
            title: Ext.String.format(RS.$('BPA_Title_AddTemplate'), me.moduleName),
            folderType: me.pathFolderMap[me.path],
            ext: me.extMap[me.path]
        });
    },

    onContainerContextMenu: function (view, e, eOpts) {
        var me = this,
            menu;

        e.stopEvent();

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            items: [{
                iconCls: 'yz-glyph yz-glyph-new',
                text: RS.$('All_AddTemplate'),
                handler: function () {
                    me.addFile();
                }
            }, {
                iconCls: 'yz-glyph yz-glyph-refresh',
                text: RS.$('All_Refresh'),
                handler: function () {
                    me.view.store.reload({
                        loadMask: true
                    });
                }
            }]
        });

        menu.showAt(e.getXY());
        menu.focus();
    },

    onItemContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            sm = view.getSelectionModel(),
            menu;

        e.stopEvent();
        sm.select(record);

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            items: [{
                iconCls: 'yz-glyph yz-glyph-new',
                text: RS.$('All_AddTemplate'),
                handler: function () {
                    me.addFile();
                }
            }, {
                iconCls: 'yz-glyph yz-glyph-rename',
                text: RS.$('All_Rename'),
                handler: function () {
                    me.view.startRename(record, {
                        maskTarget: me
                    });
                }
            }, {
                iconCls: 'yz-glyph yz-glyph-delete',
                text: RS.$('All_Delete'),
                handler: function () {
                    me.view.deleteRecords([record], {
                        maskTarget: me
                    });
                }
            }, '-',{
                iconCls: 'yz-glyph yz-glyph-refresh',
                text: RS.$('All_Refresh'),
                handler: function () {
                    me.view.store.reload({
                        loadMask: true
                    });
                }
            }]
        });

        menu.showAt(e.getXY());
        menu.focus();
    },

    updateStatus: function () {
        var me = this,
            sm = me.view.getSelectionModel(),
            recs = sm.getSelection();

        me.btnDelete.setDisabled(recs.length == 0);
        me.btnRename.setDisabled(recs.length != 1);
    }
});