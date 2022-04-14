Ext.define('YZSoft.bpm.src.grid.HistoryTaskGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'YZSoft.bpm.src.ux.Render',
        'YZSoft.bpm.src.ux.FormManager'
    ],

    constructor: function (config) {
        var me = this,
            sortable = config.sortable !== false;

        var cfg = {
            border: false,
            region: 'center',
            selModel: {
                selType: 'checkboxmodel',
                mode: 'MULTI'
            },
            columns: [
                { text: RS.$('All_SN'), dataIndex: 'SerialNum', width: 130, align: 'left', sortable: sortable, scope: this, renderer: this.renderSN, listeners: { scope: me, click: me.onClickSN} },
                { text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', width: 130, align: 'left', sortable: sortable, renderer: YZSoft.Render.renderString },
                { text: RS.$('All_Version'), hidden: true, dataIndex: 'ProcessVersion', width: 80, align: 'center', sortable: sortable, renderer: YZSoft.Render.renderString },
                { text: RS.$('All_Owner'), dataIndex: 'OwnerAccount', width: 100, align: 'center', sortable: sortable, renderer: YZSoft.bpm.src.ux.Render.renderTaskOwner },
                { text: RS.$('All_PostAt'), dataIndex: 'CreateAt', width: 150, align: 'center', sortable: sortable },
                { text: RS.$('All_Status'), dataIndex: 'State', width: 100, align: 'center', sortable: sortable, renderer: YZSoft.bpm.src.ux.Render.renderTaskState },
                { text: RS.$('All_TaskDesc'), dataIndex: 'Description', align: 'left', sortable: sortable, flex: 1, cellWrap:true }
            ],
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: config.store,
                displayInfo: true
            }),
            viewConfig: {
                getRowClass: function (record) {
                    return YZSoft.bpm.src.ux.Render.getRowClass(record);
                }
            }
        };

        Ext.apply(cfg, config);
        this.callParent([cfg]);
    },

    renderSN: function (value, metaData, record) {
        return Ext.String.format("<a href='#'>{0}</a>", YZSoft.HttpUtility.htmlEncode(value));
    },

    onClickSN: function (view, cell, recordIndex, cellIndex, e) {
        if (e.getTarget().tagName == 'A')
            this.openForm(this.store.getAt(recordIndex));
    },

    openForm: function (record, config) {
        YZSoft.bpm.src.ux.FormManager.openTaskForRead(record.data.TaskID, Ext.apply(config || {}, {
            sender: this,
            title: Ext.String.format('{0}-{1}', record.data.ProcessName, record.data.SerialNum)
        }));
    }
});
