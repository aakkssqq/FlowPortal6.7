
Ext.define('YZSoft.bpm.taskrule.Panel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.data.JsonStore',
        'YZSoft.bpm.src.model.TaskRule'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.bpm.src.model.TaskRule',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskRule.ashx'),
                extraParams: {
                    method: 'GetLoginUserTaskRules'
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.dd = Ext.create('Ext.grid.plugin.DragDrop', {
            dragZone: {
                getDragText: function () {
                    var dragZone = this,
                        data = dragZone.dragData,
                        record = data.records[0];

                    return me.renderProcessName(record.data.ProcessDefine, null, record);
                }
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
            viewConfig: {
                markDirty: false,
                plugins: [me.dd],
                getRowClass: function (record) {
                    if (!record.data.Enabled)
                        return 'yz-grid-row-disabled';
                }
            },
            columns: {
                defaults: {
                    sortable: false
                },
                items: [
                    { text: RS.$('All_Type'), dataIndex: 'RuleTypeName', width: 100, align: 'center', renderer: me.renderType },
                    { text: RS.$('All_Process'), dataIndex: 'ProcessDefine', flex: 1, renderer: me.renderProcessName },
                    { text: RS.$('All_Delegator'), dataIndex: 'Delegators', width: 220, renderer: me.renderDelegation },
                    { text: RS.$('All_Status'), dataIndex: 'Enabled', width: 80, align: 'center', renderer: me.renderStatus },
                    {
                        xtype: 'actioncolumn',
                        text: RS.$('All_DragOrder'),
                        width: 80,
                        align: 'center',
                        sortable: false,
                        draggable: false,
                        menuDisabled: true,
                        items: [{
                            glyph: 0xeacb,
                            iconCls: ['yz-action-move yz-action-gray yz-size-icon-13']
                        }]
                    }
                ]
            },
            listeners: {
                itemdblclick: function (grid, rec) {
                    me.edit(rec);
                }
            }
        });

        me.btnNew = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-new',
            text: RS.$('All_New'),
            handler: function () {
                me.addNew();
            }
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-edit',
            text: RS.$('All_Edit'),
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, '', 1, 1));
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1)
                    me.edit(recs[0]);
            }
        });

        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-delete',
            text: RS.$('All_Delete'),
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, '', 1, -1));
            },
            handler: function () {
                me.deleteSelection();
            }
        });

        me.btnRefresh = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            text: RS.$('All_Refresh'),
            handler: function () {
                me.store.reload({
                    loadMask: true
                });
            }
        });

        cfg = {
            title: RS.$('All_TaskRule'),
            closable: true,
            border: false,
            layout: 'border',
            tbar: {
                cls: 'yz-tbar-module',
                items: [
                    me.btnNew,
                    me.btnEdit,
                    '|',
                    me.btnDelete,
                    '->',
                    me.btnRefresh
                ]
            },
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.grid.getView().on({
            scope: me,
            beforedrop: 'onBeforeItemDrop'
        });
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);
    },

    renderType: function (value, metaData, rec) {
        var types = {
            DelegationRule: RS.$('All_DelegationRule'),
            AssistantRule: RS.$('All_AssistantRule')
        };

        return '[' + types[value] + ']';
    },

    renderProcessName: function (value, metaData, rec) {
        var names = [];
        Ext.each(value.ProcessItems, function (item) {
            names.push(item.ProcessName);
        });

        switch (value.ProcessDefineType) {
            case 'All':
                return RS.$('All_AllProcess');
            case 'Include':
                return names.join(';');
            case 'Exclude':
                return Ext.String.format('{0}: {1}', RS.$('All_ExcludeBelowProcesses'), names.join(';'));
            default:
                return RS.$('All_ProcessUnSpecified');
        }
    },

    renderDelegation: function (value, metaData, rec) {
        var names = [];
        Ext.each(value, function (item) {
            names.push(item.RuntimeDisplayString || item.DisplayString);
        });

        return names.join(';');
    },

    renderStatus: function (value, metaData, rec) {
        if (value)
            return RS.$('All_Valid');
        else
            return RS.$('All_Invalid');
    },

    addNew: function () {
        var me = this;
        Ext.create('YZSoft.bpm.taskrule.Dialog', {
            autoShow: true,
            title: RS.$('All_NewTaskRule'),
            account: userInfo.Account,
            fn: function (rule) {
                me.store.reload({
                    loadMask: {
                        msg: RS.$('All_TaskRuleSave_Success')
                    },
                    callback: function () {
                        me.grid.getSelectionModel().select(me.store.getById(rule.RuleID));
                    }
                });
            }
        });
    },

    edit: function (rec) {
        var me = this;

        Ext.create('YZSoft.bpm.taskrule.Dialog', {
            autoShow: true,
            ruleid: rec.getId(),
            title: RS.$('All_EditTaskRule'),
            fn: function (rule) {
                me.store.reload({
                    loadMask: {
                        msg: RS.$('All_TaskRuleSave_Success')
                    }
                });
            }
        });
    },

    deleteSelection: function () {
        var me = this,
            recs = me.grid.getSelectionModel().getSelection();

        if (recs.length == 0)
            return;

        var params = {
            method: 'DeleteTaskRules'
        };

        var ids = [];
        Ext.each(recs, function (rec) {
            ids.push(rec.getId());
        });

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: RS.$('All_TaskRule_DeleteConfirm_Msg'),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskRule.ashx'),
                    params: params,
                    jsonData: ids,
                    waitMsg: {
                        msg: RS.$('All_Deleting'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        me.store.reload({
                            loadMask: {
                                msg: Ext.String.format(RS.$('All_Deleted_Multi'), recs.length),
                                msgCls: 'yz-mask-msg-success',
                                target: me,
                                start:0
                            }
                        });
                    },
                    failure: function (action) {
                        var mbox = Ext.Msg.show({
                            title: RS.$('All_Warning'),
                            msg: action.result.errorMessage,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        me.store.reload({ mbox: mbox });
                    }
                });
            }
        });
    },

    onBeforeItemDrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
        var me = this,
            record = overModel,
            names = [];

        Ext.Array.each(data.records, function (rec) {
            names.push(rec.getId());
        });

        dropHandlers.wait = true;
        YZSoft.Ajax.request({
            method: 'POST',
            exception: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskRule.ashx'),
            params: {
                method: 'MoveRules',
                targetruleid: record.getId(),
                position: dropPosition
            },
            jsonData: names,
            waitMsg: {
                msg: RS.$('All_Moving'),
                target: me
            },
            success: function (action) {
                dropHandlers.processDrop();
                data.view && data.view.refresh();
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
                dropHandlers.cancelDrop();
            }
        });
    }
});