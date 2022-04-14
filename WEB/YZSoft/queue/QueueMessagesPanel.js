
Ext.define('YZSoft.queue.QueueMessagesPanel', {
    extend: 'YZSoft.queue.MessagePanelAbstract',
    requires: [
        'YZSoft.queue.model.Queue'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.queue.model.Queue',
            pageSize: $S.pageSize.BPMAdmin.appLog,
            sorters: {
                property: 'MessageID',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/Queue/Service.ashx'),
                extraParams: {
                    method: 'GetQueueMessages'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                load: function (store, records, successful, operation, eOpts) {
                    if (!successful)
                        return;

                    me.displayItem.setText(Ext.String.format(RS.$('All_Queue_QueueMessages_SummaryInfo'),
                        me.store.getTotalCount()));
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            cls: 'yz-border-t',
            store: me.store,
            region: 'center',
            columns: [
                { text: RS.$('All_Queue_ColumnName_MessageID'), dataIndex: 'MessageID', width: 80, align: 'left' },
                { text: RS.$('All_Queue_ColumnName_QueueName'), dataIndex: 'QueueName', width: 180, align: 'left', renderer: me.renderMessageType.bind(me) },
                { text: RS.$('All_Queue_ColumnName_CreateAt'), dataIndex: 'CreateAt', width: 120, align: 'center', sortable: true, renderer: me.renderTime },
                { text: RS.$('All_Queue_ColumnName_LastFailAt'), dataIndex: 'LastFailAt', width: 120, align: 'center', sortable: true, renderer: me.renderTime },
                { text: RS.$('All_Queue_ColumnName_FailCount'), dataIndex: 'FailCount', width: 120, align: 'center', sortable: true, renderer: me.renderRetryCount },
                { text: RS.$('All_Queue_ColumnName_ErrorMessage'), dataIndex: 'ErrorMessage', flex: 1, align: 'left', renderer: me.renderErr },
                { text: RS.$('All_Queue_ColumnName_ProcessSchedule'), dataIndex: 'ProcessSchedule', width: 120, align: 'center', sortable: true, renderer: me.renderTime }
            ],
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                displayInfo: true
            })
        });

        me.displayItem = Ext.create('Ext.Toolbar.TextItem', {
            text: '...'
        });

        cfg = {
            layout: 'border',
            items: [me.pnlSearch, me.grid],
            tbar: {
                padding: '10 6 10 8',
                items: [
                    '->',
                    me.displayItem
                ]
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
