
Ext.define('YZSoft.queue.FailedLogPanel', {
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
                    method: 'GetLogFailed'
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
            selModel: {
                selType: 'checkboxmodel',
                mode: 'MULTI'
            },
            viewConfig: {
                markDirty: false,
                getRowClass: function (record) {
                    if (record.data.retrying)
                        return 'yz-grid-row-running yz-grid-row-retrying';
                    else if (record.data.retrySucceed)
                        return '';
                    else
                        return 'yz-grid-row-warn';
                }
            },
            columns: [
                { text: RS.$('All_Queue_ColumnName_MessageID'), dataIndex: 'MessageID', width: 80, align: 'left' },
                { text: RS.$('All_Queue_ColumnName_QueueName'), dataIndex: 'QueueName', width: 180, align: 'left', renderer: me.renderMessageType.bind(me) },
                { text: RS.$('All_Queue_ColumnName_CreateAt'), dataIndex: 'CreateAt', width: 120, align: 'center', sortable: true, renderer: me.renderTime },
                { text: RS.$('All_Queue_ColumnName_RemoveAt'), dataIndex: 'RemoveAt', width: 120, align: 'center', sortable: true, renderer: me.renderTime },
                { text: RS.$('All_Queue_ColumnName_FailCount'), dataIndex: 'FailCount', width: 120, align: 'center', sortable: true, renderer: me.renderRetryCount },
                { text: RS.$('All_Queue_ColumnName_ErrorMessage'), dataIndex: 'ErrorMessage', flex: 1, align: 'left', renderer: me.renderErr },
                { text: RS.$('All_Queue_ColumnName_Ticks'), dataIndex: 'Ticks', width: 120, align: 'center', renderer: me.renderTicks },
                {
                    xtype: 'actioncolumn',
                    text: RS.$('All_Queue_ColumnName_Retry'),
                    width: 120,
                    align: 'center',
                    //disabledCls: 'yz-display-none',
                    items: [{
                        glyph: 0xeb38,
                        iconCls: 'yz-action-restore',
                        isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                            return record.data.retrying || record.data.retrySucceed;
                        },
                        handler: function (view, rowIndex, colIndex, item, e, record) {
                            me.retryFailedQueueMessage(record);
                        }
                    }]
                }
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

        me.btnRetry = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Queue_BatchRetry'),
            glyph: 0xeb38,
            margin: '0 0 0 10',
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(me, null, this.sm, null, 1, -1));
            },
            handler: function (item) {
                var recs = me.grid.getSelectionModel().getSelection();

                if (recs.length == 0)
                    return;

                me.retryFailedQueueMessage(recs);
            }
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
            tbar: {
                padding: '10 6 10 8',
                items: [
                    me.labCaption,
                    me.btnRetry,
                    '->',
                    me.btnPrev,
                    me.edtDate,
                    me.btnNext
                ]
            },
            items: [me.pnlSearch, me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    retryFailedQueueMessage: function (records) {
        var me = this,
            record, node;

        if (Ext.isArray(records)) {
            Ext.each(records, function (record) {
                me.retryFailedQueueMessage(record);
            });
            return;
        }

        record = records;

        if (record.data.retrying) //此项正在重做
            return;

        record.set('retrying', true);
        record.set('ErrorMessage', RS.$('All_Queue_LoadMask_Retrying'));

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/Queue/Service.ashx'),
            params: {
                method: 'RetryFailedMessage',
                messageId: record.getId()
            },
            waitMsg: false,
            success: function (action) {
                Ext.defer(function () {
                    record.set('retrying', false);
                    record.set('retrySucceed', true);
                    record.set('ErrorMessage', RS.$('All_Queue_Retrying_Succeed'));
                }, 500);
            },
            failure: function (action) {
                Ext.defer(function () {
                    record.set('retrying', false);
                    record.set('FailCount', record.data.FailCount+1);
                    record.set('ErrorMessage', action.result.errorMessage);
                }, 500);
            }
        });
    }
});
