/*
* specProcessName - process name
* byYear - true/false
* collapseSearchPanel - true/false
* toolbar - simple/advanced default:simple
*/

Ext.define('YZSoft.bpm.history.AllAccessablePanel', {
    extend: 'YZSoft.bpm.src.panel.TaskAbstract',
    requires: [
        'YZSoft.bpm.taskoperation.Manager',
        'YZSoft.bpm.src.model.HistoryTask'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: $S.pageSize.BPM.historyAllAccessable,
            model: 'YZSoft.bpm.src.model.HistoryTask',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskList.ashx'),
                extraParams: {
                    method:'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    specProcessName: config.specProcessName,
                    byYear: config.byYear === false ? 0 : 1,
                    Year: (new Date()).getFullYear()
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function () {
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
                getRowClass: function(record) {
                    return me.getRowClass(record);
                }
            },
            columns: {
                defaults: {
                    sortable: false
                },
                items: [
                    { text: '<div class="yz-column-header-flag fa fa-flag"></div>', tdCls: 'yz-grid-cell-flag', width: 30, align: 'center', sortable: false, draggable: false, locked: false, autoLock: true, resizable: false, menuDisabled: true, renderer: me.renderFlags.bind(me) },
                    { text: RS.$('All_SN'), dataIndex: 'SerialNum', width: 130, align: 'left', scope: this, renderer: me.renderSN, listeners: { scope: me, click: me.onClickSN } },
                    { text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', width: 130, align: 'left', renderer: me.renderProcessName.bind(me) },
                    { text: RS.$('All_TaskDesc'), dataIndex: 'Description', align: 'left', flex: 1, cellWrap: true },
                    { text: RS.$('All_Version'), hidden: true, dataIndex: 'ProcessVersion', width: 80, align: 'center' },
                    { text: RS.$('All_Owner'), dataIndex: 'OwnerAccount', width: 100, align: 'center', renderer: me.renderTaskOwner.bind(me) },
                    { text: RS.$('All_PostAt'), dataIndex: 'CreateAt', width: 130, align: 'center', formatter: 'friendlyDate' },
                    { text: RS.$('All_Status'), dataIndex: 'State', width: 160, align: 'center', tdCls: 'yz-cell-taskstatus', renderer: me.renderTaskState.bind(me) },
                    {
                        xtype: 'actioncolumn',
                        text: RS.$('All_ActionTip_Trace'),
                        width: 68,
                        align: 'center',
                        sortable: false,
                        draggable: false,
                        menuDisabled: true,
                        disabledCls: 'yz-visibility-hidden',
                        items: [{
                            glyph: 0xeb24,
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.openTrace(record);
                            }
                        }]
                    }
                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                displayInfo: true
            }),
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        });

        me.searchPanel = Ext.create('YZSoft.bpm.src.panel.TaskSearchPanel', {
            hidden: config.collapseSearchPanel === true,
            region: 'north',
            specProcessName: config.specProcessName,
            byYear: config.byYear !== false,
            store: me.store
        });

        me.btnSearch = Ext.create('YZSoft.src.button.PanelExpandButton', {
            text: RS.$('All_Search'),
            expandPanel: me.searchPanel
        });

        me.btnPickback = me.createPickbackButton();
        me.btnInform = me.createInformButton();
        me.btnInviteIndicate = me.createInviteIndicateButton();
        me.btnTrace = me.createTraceButton();

        me.menuPublic = me.createPublicButton(false);
        me.menuAbort = me.createAbortButton(false);
        me.menuDelete = me.createDeleteButton(false);
        me.menuContinue = me.createContinueButton(false);

        me.btnMore = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e602',
            text: RS.$('All_MoreOpt'),
            menu: {
                items: [
                    me.menuPublic,
                    '-',
                    me.menuAbort,
                    me.menuDelete,
                    me.menuContinue
                ]
            }
        });

        me.toolBar = Ext.create('Ext.toolbar.Toolbar', {
            cls: 'yz-tbar-module',
            items: [
                me.btnPickback,
                '|',
                me.btnInform,
                me.btnInviteIndicate,
                '|',
                me.btnTrace,
                '|',
                me.btnMore,
                '->',
                me.btnSearch
            ]
        });

        me.sts = Ext.create('YZSoft.src.sts', {
            tbar: me.toolBar,
            store: me.store,
            sm: me.grid.getSelectionModel(),
            request: {
                params: {
                    Method: 'GetTaskPermision'
                }
            }
        });

        cfg = {
            closable: true,
            border: false,
            layout: 'border',
            items: [me.searchPanel, me.grid],
            tbar: me.toolBar
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.initTimeoutFlagTip(me.grid);
    },

    onActivate: function(times) {
        if (times == 0)
            this.store.load($S.loadMask.first);

        delete this.modified;
    }
});
