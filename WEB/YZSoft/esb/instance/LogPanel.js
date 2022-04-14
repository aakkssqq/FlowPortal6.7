
Ext.define('YZSoft.esb.instance.LogPanel', {
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
                    method: 'GetLog'
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
            viewConfig: {
                getRowClass: function (record) {
                    return me.rowClses[record.data.Status];
                }
            },
            columns: [
                { text: RS.$('ESB_Instance_ColumnName_TaskID'), dataIndex: 'TaskID', width: 80, align: 'left' },
                { text: RS.$('ESB_Instance_ColumnName_FlowName'), dataIndex: 'FlowName', width: 200, align: 'left', format: 'text' },
                { text: RS.$('ESB_Instance_ColumnName_CreateAt'), dataIndex: 'CreateAt', width: 120, align: 'center', sortable: true, renderer: me.renderTime },
                { text: RS.$('ESB_Instance_ColumnName_CreateBy'), dataIndex: 'CreateBy', width: 180, align: 'center', renderer: me.renderUser },
                { text: RS.$('ESB_Instance_ColumnName_Status'), dataIndex: 'Status', flex: 1, align: 'left', sortable: false, renderer: me.renderStatus },
                { text: RS.$('ESB_Instance_ColumnName_FinishedAt'), dataIndex: 'FinishedAt', width: 120, align: 'center', renderer: me.renderTime },
                { text: RS.$('ESB_Instance_ColumnName_AsyncCall'), dataIndex: 'AsyncCall', width: 100, align: 'center', renderer: me.renderAsync },
                {
                    xtype: 'actioncolumn',
                    text: RS.$('ESB_Instance_ColumnName_Trace'),
                    width: 80,
                    align: 'center',
                    items: [{
                        glyph: 0xeb24,
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

        me.grid.on({
            scope: me,
            itemdblclick: 'onItemDblClick'
        });
    }
});
