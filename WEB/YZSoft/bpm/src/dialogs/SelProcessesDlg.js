/*
selection - 结果列表初始值
*/

Ext.define('YZSoft.bpm.src.dialogs.SelProcessesDlg', {
    extend: 'Ext.window.Window', //111222
    requires: [
        'YZSoft.bpm.src.model.ProcessInfo'
    ],
    title: RS.$('All_SelProcess'),
    layout: 'border',
    width: 870,
    height: 530,
    minWidth: 870,
    minHeight: 530,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.srcPanel = Ext.create('YZSoft.bpm.src.panel.SelProcessPanel', {
            region: 'center',
            border: true,
            grid: {
                width: 250,
                selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'SIMPLE' }),
                viewConfig: {
                    stripeRows: false,
                    selectedItemCls: 'yz-grid-item-select-flat'
                }
            }
        });

        //me.srcPanelList = Ext.create('YZSoft.bpm.src.panel.ProcessListPanel', {
        //    title: RS.$('All_ProcessList'),
        //    region: 'center',
        //    grid: {
        //        selModel: Ext.create('Ext.selection.TreeModel', { mode: 'SIMPLE' }),
        //        viewConfig: {
        //            stripeRows: false,
        //            selectedItemCls: 'yz-grid-item-select-flat'
        //        }
        //    }
        //});

        me.tagStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.ProcessInfo',
            listeners: {
                datachanged: function () {
                    me.updateStatus();
                }
            }
        });

        me.tagGrid = Ext.create('Ext.grid.Panel', {
            store: me.tagStore,
            cls: 'yz-grid-actioncol-hidden',
            hideHeaders: true,
            border: false,
            selModel: { mode: 'MULTI' },
            viewConfig: {
                stripeRows: false
            },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { text: '', dataIndex: 'ProcessName', align: 'left', flex: 1, formatter: 'text' },
                    {
                        xtype: 'actioncolumn',
                        width: 38,
                        align: 'center',
                        items: [{
                            glyph: 0xe62b,
                            iconCls: 'yz-action-delete-msel',
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.tagGrid.getStore().remove(record);
                            }
                        }]
                    }
                ]
            },
            listeners: {
                rowdblclick: function (grid, record, tr, rowIndex, e, eOpts) {
                    me.tagStore.remove(record);
                },
                selectionchange: function () {
                    me.updateStatus();
                },
                drop: function () {
                    me.btnMoveUp.updateStatus();
                    me.btnMoveDown.updateStatus();
                }
            }
        });

        me.btnMoveUp = Ext.create('YZSoft.src.button.Button', {
            glyph: 0xea4f,
            sm: me.tagGrid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.tagGrid.canMoveUp());
            },
            handler: function () {
                me.tagGrid.moveSelectionUp();
            }
        });

        me.btnMoveDown = Ext.create('YZSoft.src.button.Button', {
            glyph: 0xe601,
            sm: me.tagGrid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.tagGrid.canMoveDown());
            },
            handler: function () {
                me.tagGrid.moveSelectionDown();
            }
        });

        me.tagPanel = Ext.create('Ext.panel.Panel', {
            title: RS.$('All_SelectionPreview_Process'),
            region: 'east',
            layout: 'fit',
            border: true,
            width: 230,
            header: {
                defaults: {
                    cls: ['yz-btn-flat', 'yz-btn-tool-hot'],
                },
                items: [me.btnMoveUp, me.btnMoveDown]
            },
            items: [me.tagGrid]
        });

        me.optBar = Ext.create('YZSoft.src.toolbar.SelectionOptBar', {
            region: 'east'
        });

        me.selectionManager = Ext.create('YZSoft.src.ux.RecordSelection', {
            srcGrid: me.srcPanel.grid,
            tagGrid: me.tagGrid,
            dragGroup: 'Member',
            getDragText: function (record) {
                return Ext.util.Format.text(record.data.DisplayName || record.data.Account);
            }
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            handler: function () {
                var rv = [],
                    recs = me.tagStore.getRange();

                Ext.each(recs, function (rec) {
                    rv.push({ ProcessName: rec.data.ProcessName });
                });

                me.closeDialog(rv);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.srcPanel, me.optBar, me.tagPanel],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    show: function (config) {
        var me = this,
            config = config || {},
            title = config.title,
            fn = config.fn,
            scope = config.scope

        if (title)
            me.setTitle(title);

        if (fn) {
            me.fn = fn;
            me.scope = scope;
        }

        me.srcPanel.grid.getSelectionModel().deselectAll();

        if (config.selection) {
            me.tagStore.removeAll();
            me.tagGrid.addRecords(config.selection, false);
        }

        me.callParent();
    },

    updateStatus: function () {
        var me = this;

        me.btnOK.setDisabled(me.tagStore.getCount() == 0);
    }
});