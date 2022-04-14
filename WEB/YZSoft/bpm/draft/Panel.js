
Ext.define('YZSoft.bpm.draft.Panel', {
    extend: 'YZSoft.bpm.src.panel.DraftAbstract',
    requires: [
        'YZSoft.bpm.src.model.Draft',
        'YZSoft.bpm.src.ux.FormManager'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: $S.pageSize.BPM.drafts,
            sorters: { property: 'CreateDate', direction: 'DESC' },
            model: 'YZSoft.bpm.src.model.Draft',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskList.ashx'),
                extraParams: {
                    method: 'GetDrafts'
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: false,
            listeners: {
                scope: me,
                validateedit: 'onValidateEdit'
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            cls: 'yz-border-t',
            store: me.store,
            region: 'center',
            selModel: {
                selType: 'checkboxmodel',
                mode: 'MULTI'
            },
            plugins: [me.cellEditing],
            viewConfig: {
                markDirty: false
            },
            columns: [
                { text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', width: 220, align: 'left', sortable: true, scope: me, renderer: me.renderProcessName, listeners: { scope: me, click: me.onClickProcessName} },
                { text: RS.$('All_TaskDesc'), dataIndex: 'Description', align: 'left', sortable: true, flex: 1, cellWrap: true},
                { text: RS.$('All_Comments'), dataIndex: 'Name', width: 320, align: 'left', sortable: false, renderer: me.renderName, editor: { xtype: 'textfield' }, listeners: { scope: me, click: me.onClickDraftName }},
                { text: RS.$('All_CreateDate'), dataIndex: 'CreateDate', width: 150, align: 'center', sortable: true, formatter: 'friendlyDate' },
                { text: RS.$('All_ModifyDate'), dataIndex: 'ModifyDate', width: 150, align: 'center', sortable: true, formatter: 'friendlyDate' }
            ],
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                displayInfo: true
            }),
            listeners: {
                order:'after',
                itemdblclick: function (grid, record, item, index, e, eOpts) {
                    if (me.cellEditing.editing)
                        return;

                    me.openForm(record);
                }
            }
        });

        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-delete',
            text: RS.$('All_Delete'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, null, 1, -1));
            },
            handler: function () {
                me.deleteDrafts();
            }
        });

        cfg = {
            layout: 'border',
            tbar: {
                cls:'yz-tbar-module',
                items:[me.btnDelete]
            },
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);
    },

    deleteDrafts: function () {
        var me = this,
            grid = me.grid,
            sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [],
            items = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function (rec) {
            items.push(rec.getId());
        });

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: RS.$('TaskOpt_DeleteDraft_Confirm'),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        method: 'DeleteDrafts'
                    },
                    jsonData: {
                        items: items
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_DeleteDraft_LoadMask'),
                        target: me.grid
                    },
                    success: function (action) {
                        me.grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.format(RS.$('TaskOpt_DeleteDraft_Success'), recs.length)
                            }
                        });
                    },
                    failure: function (action) {
                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: YZSoft.HttpUtility.htmlEncode(action.result.errorMessage, true),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        me.store.reload({ mbox: mbox });
                    }
                });
            }
        });
    }
});