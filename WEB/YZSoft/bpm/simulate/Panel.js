
Ext.define('YZSoft.bpm.simulate.Panel', {
    extend: 'YZSoft.bpm.src.panel.DraftAbstract',
    requires: [
        'YZSoft.bpm.src.model.Draft',
        'YZSoft.bpm.src.model.ProcessFolder',
        'YZSoft.bpm.src.ux.FormManager'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.treestore = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'YZSoft.bpm.src.model.ProcessFolder',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Process.ashx'),
                extraParams: {
                    method: 'GetTree',
                    perm: 'Read',
                    expand: false,
                    process: true
                }
            },
            listeners: {
                load: function () {
                    me.tree.getRootNode().expand();
                }
            }
        });

        me.btnCollapse = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-collapse',
            tooltip: RS.$('All_Collapse'),
            handler: function () {
                me.tree.collapse();
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            tooltip: RS.$('All_Refresh'),
            handler: function () {
                me.treestore.load({
                    loadMask: true
                });
            }
        });

        me.tree = Ext.create('Ext.tree.Panel', {
            region: 'west',
            width: 314,
            title: RS.$('All_Post_Tree_Title'),
            header: false,
            split: {
                cls: 'yz-spliter',
                size: 5,
                collapseOnDblClick: false,
                collapsible: true
            },
            store: me.treestore,
            useArrows: true,
            hideHeaders: true,
            root: {
                text: RS.$('All_ProcessLib'),
                expanded: false
            },
            listeners: {
                itemclick: function (view, record, item, index, e, eOpts) {
                    e.stopEvent();
                    if (record.data.ProcessName) {
                        var extraParams = me.store.getProxy().getExtraParams();
                        extraParams.ProcessName = record.data.ProcessName;
                        me.store.load();
                    }
                }
            },
            tbar: {
                cls: 'yz-tbar-navigator',
                items: [me.btnCollapse, '->', me.btnRefresh]
            }
        });

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.bpm.src.model.Draft',
            sorters: { property: 'CreateDate', direction: 'desc' },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Simulate.ashx'),
                extraParams: {
                    method: 'GetTestingTemplates'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                load: function () {
                    var extraParams = this.getProxy().getExtraParams(),
                        processName = extraParams.ProcessName,
                        title = RS.$('Simulate_FormInstance');

                    if (processName)
                        title += ' - ' + processName;

                    me.grid.setTitle(title);
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
            header: {
                title: RS.$('Simulate_FormInstance'),
                cls: 'yz-header-flat'
            },
            header:false,
            region: 'center',
            border: false,
            store: me.store,
            selModel: {
                selType: 'checkboxmodel',
                mode: 'MULTI'
            },
            plugins: [me.cellEditing],
            viewConfig: {
                markDirty: false
            },
            columns: [
                { text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', width: 220, align: 'left', sortable: true, scope: me, renderer: me.renderProcessName, listeners: { scope: me, click: me.onClickProcessName } },
                { text: RS.$('All_TaskDesc'), dataIndex: 'Description', align: 'left', sortable: true, flex: 1, cellWrap: true },
                { text: RS.$('All_Comments'), dataIndex: 'Name', width: 320, align: 'left', sortable: false, renderer: me.renderName, editor: { xtype: 'textfield' }, listeners: { scope: me, click: me.onClickDraftName } },
                { text: RS.$('All_Owner'), dataIndex: 'OnwerShortName', width: 120, align: 'center', sortable: true, formatter: 'text' },
                { text: RS.$('All_CreateDate'), dataIndex: 'CreateDate', width: 150, align: 'center', sortable: true, formatter: 'friendlyDate' },
                { text: RS.$('All_ModifyDate'), dataIndex: 'ModifyDate', width: 150, align: 'center', sortable: true, formatter: 'friendlyDate' }
            ],
            listeners: {
                itemdblclick: function (grid, record, item, index, e, eOpts) {
                    if (me.cellEditing.editing)
                        return;

                    me.openForm(record);
                }
            },
            tools: [{
                type: 'refresh',
                handler: function (event, toolEl, panel) {
                    me.store.reload({
                        loadMask:true
                    });
                }
            }]
        });

        me.btnNewTemplate = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-new',
            text: RS.$('Simulate_NewFormInstance'),
            store: me.store,
            updateStatus: function () {
                this.setDisabled(!this.store.getProxy().getExtraParams().ProcessName);
            },
            handler: function () {
                var processName = me.store.getProxy().getExtraParams().ProcessName;

                if (!processName)
                    return;

                me.newForm(processName);
            }
        });

        me.btnEditTemplate = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-edit',
            text: RS.$('Simulate_EditFormInstance'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnableNoPerm(me.grid, 1, 1));
            },
            handler: function () {
                var sm = me.grid.getSelectionModel();
                var recs = sm.getSelection() || [];

                if (recs.length != 1)
                    return;

                me.openForm(recs[0]);
            }
        });

        me.btnDeleteTemplate = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-delete',
            text: RS.$('Simulate_DeleteFormInstance'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnableNoPerm(me.grid, 1, -1));
            },
            handler: function () {
                me.deleteTemplates(me.grid);
            }
        });

        me.btnStartRun = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('Simulate_RunFormInstance'),
            cls:'yz-size-icon-12',
            glyph: 0xea86,
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnableNoPerm(me.grid, 1, 1));
            },
            handler: function () {
                var sm = me.grid.getSelectionModel();
                var recs = sm.getSelection() || [];

                if (recs.length != 1)
                    return;

                me.startRun(recs[0], 'auto');
            }
        });

        me.btnStartRunStep = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('Simulate_RunStepByStep'),
            cls: 'yz-size-icon-12',
            glyph: 0xea2f,
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnableNoPerm(me.grid, 1, 1));
            },
            handler: function () {
                var sm = me.grid.getSelectionModel();
                var recs = sm.getSelection() || [];

                if (recs.length != 1)
                    return;

                me.startRun(recs[0], 'step');
            }
        });

        cfg = {
            layout: 'border',
            tbar: {
                cls: 'yz-tbar-module yz-border-b',
                items: [
                    me.btnNewTemplate,
                    me.btnEditTemplate,
                    me.btnDeleteTemplate,
                    '|',
                    me.btnStartRun,
                    me.btnStartRunStep
                ]
            },
            items: [me.tree, me.grid]
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

    afterRender: function () {
        this.callParent(arguments);
        this.treestore.load({ loadMask: false });
    },

    newForm: function (processName) {
        var me = this;

        YZSoft.bpm.src.ux.FormManager.openPostWindow(processName, {
            sender: this,
            title: processName,
            params: {
                NewTestingTemplate: true
            },
            listeners: {
                scope: me,
                modified: function (name, data) {
                    me.store.reload();
                }
            }
        });
    },

    deleteTemplates: function (grid) {
        var me = this,
            sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function (rec) {
            items.push(rec.getId());
        });

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: RS.$('TaskOpt_DeleteTestTemplates_Confirm'),
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
                        Method: 'DeleteDrafts'
                    },
                    jsonData: {
                        items:items
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_DeleteTestTemplates_LoadMask'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.format(RS.$('TaskOpt_DeleteTestTemplates_Success'), recs.length),
                                msgCls: 'yz-mask-msg-success',
                                target: me,
                                start: 0
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

                        var store = grid.getStore();
                        store.reload({ mbox: mbox });
                    }
                });
            }
        });
    },

    startRun: function (record, mode) {
        var me = this;

        var sm = this.grid.getSelectionModel();
        var recs = sm.getSelection() || [];

        if (recs.length != 1)
            return;

        YZSoft.SelMemberDlg.show({
            fn: function (user) {
                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/Simulate.ashx'),
                    params: {
                        method: 'Start',
                        draftid: record.data.DraftID,
                        memberfullname: user.MemberFullName,
                        uid: user.Account
                    },
                    success: function (action) {
                        YZSoft.ViewManager.addView(me, 'YZSoft.bpm.simulate.Run', {
                            title: Ext.String.format(RS.$('Simulate_Title'), record.data.ProcessName),
                            taskid: action.result.TaskID,
                            runMode: mode,
                            sn: action.result.SN,
                            processName: record.data.ProcessName,
                            closable: true
                        });
                    },
                    failure: function (action) {
                        YZSoft.alert(action.result.errorMessage);
                    }
                });
            }
        });
    }
});
