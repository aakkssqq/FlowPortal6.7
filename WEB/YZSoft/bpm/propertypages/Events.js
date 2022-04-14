/*
config:
events 支持的事件数组
value
[{
    "EventType": "FormDataPrepared",
    "CodeText": "int a = 11;"
},{
    "EventType": "FormSaved",
    "CodeText": "int a=12;"
}]
*/

Ext.define('YZSoft.bpm.propertypages.Events', {
    extend: 'Ext.panel.Panel',
    referenceHolder: true,
    title: RS.$('All_Events'),
    layout: 'border',
    border: true,

    constructor: function (config) {
        var me = this,
            config = config || {},
            data = [],
            cfg;

        //转换数据
        Ext.each(config.events, function (eventName) {
            data.push({
                value: eventName,
                name: RS.$('All_EventType_' + eventName, eventName)
            });
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            hideHeaders: true,
            selModel: { mode: 'SINGLE' },
            cls: 'yz-grid-s',
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            store: {
                fields: ['name', 'value', 'code'],
                data: data
            },
            columns: {
                items: [
                    { header: '', dataIndex: 'name', flex: 1 },
                    { header: '', dataIndex: 'code', width: 20, renderer: me.renderCodeFlag, tdCls: 'yz-events-hascode' }
                ]
            },
            listeners: {
                selectionchange: function (sm, records, eOpts) {
                    if (records.length == 1) {
                        me.edtCode.suspendEvent('change');
                        me.edtCode.setValue(records[0].data.code);
                        me.edtCode.resumeEvent('change');

                        me.pnlCode.setTitle(records[0].data.name);
                        me.edtCode.record = records[0];
                    }
                }
            }
        });

        me.edtCode = Ext.create('Ext.form.field.TextArea', {
            cls: ['yz-form-field-noborder', 'yz-form-field-code'],
            inputAttrTpl: new Ext.XTemplate([
                'wrap="off"'
            ]),
            listeners: {
                change: function () {
                    if (this.record)
                        this.record.set('code', Ext.String.trim(this.getValue()));
                }
            }
        });

        me.pnlCode = Ext.create('Ext.panel.Panel', {
            region: 'center',
            layout: 'fit',
            header: {
                layout:'hbox',
                items: [{
                    xtype: 'component',
                    tpl: [
                        '<span style="font-size:13px;color:#aaa">',
                        RS.$('All_Code_CPlus'),
                        '</span>'
                    ],
                    data: {}
                }]
            },
            items: [me.edtCode]
        });

        cfg = {
            items: [Ext.apply({
                xtype: 'panel',
                title: RS.$('All_Events'),
                region: 'west',
                width: 180,
                layout: 'fit',
                split: {
                    size: 5,
                    collapseOnDblClick: false,
                    collapsible: true
                },
                items: [me.grid]
            },config.navBar), me.pnlCode]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.value)
            me.fill(config.value);
    },

    renderCodeFlag: function (value) {
        return Ext.String.trim(value || '') ? '*' : ''
    },

    fill: function (data) {
        var me = this,
            data = data || [];

        me.grid.getStore().each(function (rec) {
            var value = Ext.Array.findBy(data, function (item) {
                if (String.Equ(item.EventType, rec.data.value))
                    return true;
            });

            if (value)
                rec.set('code', value.CodeText);
        });

        me.grid.getStore().each(function (rec) {
            if (rec.data.code) {
                me.grid.getSelectionModel().select(rec);
                return false;
            }
        });

        if (me.grid.getSelectionModel().getSelection().length == 0 && me.grid.getStore().getCount() != 0)
            me.grid.getSelectionModel().select(me.grid.getStore().getAt(0));
    },

    save: function () {
        var me = this,
            events = [];

        me.grid.getStore().each(function (record) {
            if (!record.data.code)
                return;

            events.push({
                EventType: record.data.value,
                CodeText: record.data.code
            });
        });

        return events;
    }
});