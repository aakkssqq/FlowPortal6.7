
Ext.define('YZSoft.esb.instance.InterruptedPanel', {
    extend: 'YZSoft.esb.instance.PanelAbstract',
    requires: [
        'YZSoft.esb.model.Instance'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.esb.model.Instance',
            pageSize: $S.pageSize.BPMAdmin.appLog,
            sorters: {
                property: 'TaskID',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/ESB/Instance/Service.ashx'),
                extraParams: {
                    method: 'GetInterruptedInstance'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                load: function (store, records, successful, operation, eOpts) {
                    if (!successful)
                        return;

                    me.displayItem.setText(Ext.String.format(RS.$('ESB_Interrupted_SummaryInfo'),
                        me.store.getTotalCount()));
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            cls: 'yz-border-t',
            store: me.store,
            region: 'center',
            viewConfig: {
                getRowClass: function (record) {
                    return 'yz-grid-row-warn';
                }
            },
            columns: [
                { text: RS.$('ESB_Instance_ColumnName_TaskID'), dataIndex: 'TaskID', width: 80, align: 'left' },
                { text: RS.$('ESB_Instance_ColumnName_FlowName'), dataIndex: 'FlowName', width: 200, align: 'left', format: 'text' },
                { text: RS.$('ESB_Instance_ColumnName_CreateAt'), dataIndex: 'CreateAt', width: 120, align: 'center', sortable: true, renderer: me.renderTime },
                { text: RS.$('ESB_Instance_ColumnName_CreateBy'), dataIndex: 'CreateBy', width: 180, align: 'center', renderer: me.renderUser },
                { text: RS.$('ESB_Instance_ColumnName_Status'), dataIndex: 'Status', flex: 1, align: 'left', sortable: false, renderer: me.renderStatus },
                { text: RS.$('ESB_Instance_ColumnName_AsyncCall'), dataIndex: 'AsyncCall', width: 100, align: 'center', renderer: me.renderAsync },
                {
                    xtype: 'actioncolumn',
                    text: RS.$('ESB_Instance_ColumnName_Retry'),
                    width: 80,
                    align: 'center',
                    items: [{
                        glyph: 0xeb38,
                        iconCls: 'yz-action-restore',
                        handler: function (view, rowIndex, colIndex, item, e, record) {
                            me.openTaskByRecord(record);
                        }
                    }]
                }
            ],
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                displayInfo: true
            })
        });

        me.btnRetry = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('ESB_Instance_Retry'),
            glyph: 0xeb38,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(me, null, this.sm, null, 1, 1));
            },
            handler: function (item) {
                var recs = me.grid.getSelectionModel().getSelection();

                if (recs.length != 1)
                    return;

                me.openTaskByRecord(recs[0]);
            }
        });

        me.displayItem = Ext.create('Ext.Toolbar.TextItem', {
            text: '...'
        });

        cfg = {
            layout: 'border',
            items: [me.pnlSearch, me.grid],
            tbar: {
                cls: 'yz-tbar-module yz-border-b',
                items: [
                    me.btnRetry,
                    '->',
                    me.displayItem
                ]
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.grid.on({
            scope: me,
            itemdblclick: 'onItemDblClick'
        });
    }
});
