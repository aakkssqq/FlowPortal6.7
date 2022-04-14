
Ext.define('YZSoft.queue.SucceedLogPanel', {
    extend: 'YZSoft.queue.MessagePanelAbstract',
    requires: [
        'YZSoft.queue.model.QueueSucceed'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.queue.model.QueueSucceed',
            pageSize: $S.pageSize.BPMAdmin.appLog,
            sorters: {
                property: 'MessageID',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/Queue/Service.ashx'),
                extraParams: {
                    method: 'GetLogSucceed'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function (store, operation, eOpts) {
                    var params = operation.getParams() || {};
                    Ext.apply(params, {
                        date: me.edtDate.getValue()
                    });
                    operation.setParams(params);
                },
                load: function (store, records, successful, operation, eOpts) {
                    if (!successful)
                        return;

                    var params = operation.getParams() || {};

                    me.labCaption.setText(Ext.Date.format(params.date, RS.$('All_BPMLog_Caption')));
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
                { text: RS.$('All_Queue_ColumnName_ProcessedAt'), dataIndex: 'ProcessedAt', width: 120, align: 'center', sortable: true, renderer: me.renderTime },
                { text: RS.$('All_Queue_ColumnName_FailCount'), dataIndex: 'FailCount', width: 120, align: 'center', sortable: true, renderer: me.renderRetryCount },
                { text: RS.$('All_Queue_ColumnName_ErrorMessage'), dataIndex: 'ErrorMessage', flex: 1, align: 'left', renderer: me.renderErr },
                { text: RS.$('All_Queue_ColumnName_Ticks'), dataIndex: 'Ticks', width: 120, align: 'center', renderer: me.renderTicks }
            ],
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                displayInfo: true
            })
        });

        me.labCaption = Ext.create('Ext.toolbar.TextItem', {
            text: '',
            style: 'font-size:22px;font-weight:bold'
        });

        me.btnPrev = Ext.create('Ext.button.Button', {
            text: Ext.String.format('< {0}', RS.$('All_PreviousDay')),
            margin: 0,
            handler: function (item) {
                var date = me.edtDate.getValue(),
                    prev = Ext.Date.add(date, Ext.Date.DAY, -1);

                me.edtDate.setValue(prev);
            }
        });

        me.btnNext = Ext.create('Ext.button.Button', {
            text: Ext.String.format('{0} >', RS.$('All_NextDay')),
            margin: 0,
            handler: function (item) {
                var date = me.edtDate.getValue(),
                    next = Ext.Date.add(date, Ext.Date.DAY, 1);

                me.edtDate.setValue(next);
            }
        });

        me.edtDate = Ext.create('Ext.form.field.Date', {
            margin: '0 6',
            width: 130,
            editable: false,
            value: new Date(),
            allowBlank: false,
            listeners: {
                change: function () {
                    me.store.loadPage(1,{
                        loadMask: true
                    });
                }
            }
        });

        cfg = {
            layout: 'border',
            items: [me.pnlSearch, me.grid],
            tbar: {
                padding: '10 6 10 8',
                items: [
                    me.labCaption,
                    '->',
                    me.btnPrev,
                    me.edtDate,
                    me.btnNext
                ]
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
