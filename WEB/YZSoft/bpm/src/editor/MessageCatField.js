/*
messageCat
providers 可选
value:
[
{
"ProviderName": "Mail",
"Enabled": true,
"Inheri": false,
"Title": "222",
"Message": "",
"AttachmentsCode": "Context.Current.GetAttachments(Convert.ToString(FormDataSet[\"Purchase.RequestDate\"])).ToNotifyAttachments()"
},
{
"ProviderName": "SMS",
"Enabled": true,
"Inheri": true,
"Title": "",
"Message": "",
"AttachmentsCode": ""
}
]
*/

Ext.define('YZSoft.bpm.src.editor.MessageCatField', {
    extend: 'YZSoft.src.form.FieldContainer',
    referenceHolder: true,
    layout: 'fit',
    inheriable: true,

    constructor: function (config) {
        var me = this,
            inheriable = 'inheriable' in config ? config.inheriable : me.inheriable,
            cfg;

        if (config.providers) {
            me.providers = config.providers;
        }
        else {
            YZSoft.Ajax.request({
                async: false,
                url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
                params: { method: 'GetNotifyProviders' },
                success: function (action) {
                    me.providers = action.result;
                }
            });
        }

        me.list = Ext.create('Ext.grid.Panel', {
            border: false,
            hideHeaders: true,
            selModel: { mode: 'SINGLE' },
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            store: {
                fields: ['Name', 'ContentType', 'data'],
                data: me.providers
            },
            columns: {
                items: [
                    { header: '', dataIndex: 'Name', flex: 1 },
                    { header: '', dataIndex: 'data', width: 20, renderer: me.renderMessageFlag, scope: me, tdCls: 'yz-events-hascode' }
                ]
            },
            listeners: {
                selectionchange: function (sm, records, eOpts) {
                    if (records.length == 1) {
                        if (me.edtMessage.record)
                            me.edtMessage.record.set('data', me.edtMessage.getValue());

                        me.edtMessage.setContentType(records[0].data.ContentType);

                        me.edtMessage.suspendEvent('change');
                        me.edtMessage.setValue(records[0].data.data);
                        me.edtMessage.record = records[0];
                        me.edtMessage.resumeEvent('change');
                    }
                }
            }
        });

        me.edtMessage = Ext.create('YZSoft.bpm.src.editor.MessageItemField', Ext.apply({
            listeners: {
                change: function () {
                    if (this.record)
                        this.record.set('data', this.getValue());
                }
            }
        }, config.messageFieldConfig));

        cfg = {
            items: [{
                xtype: 'container',
                layout: 'border',
                cls: 'yz-border',
                items: [{
                    xtype: 'panel',
                    layout: 'fit',
                    title: RS.$('All_NotifyBy'),
                    region: 'west',
                    width: 158,
                    split: {
                        size: 5,
                        collapseOnDblClick: false,
                        collapsible: true
                    },
                    items: [me.list]
                }, {
                    xtype: 'container',
                    padding: 0,
                    region: 'center',
                    layout: 'fit',
                    items: [me.edtMessage]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.edtMessage.relayEvents(me, ['tablesChanged']);
    },

    renderMessageFlag: function (value) {
        var me = this;

        if (me.inheriable)
            return (value && (!value.Enabled || !value.Inheri)) ? '*' : '';
        else
            return (value && value.Enabled && (value.Title || value.Message)) ? '*' : '';
    },

    setValue: function (value) {
        var me = this;

        me.list.getStore().each(function (rec) {
            var msg = Ext.Array.findBy(value, function (msgitem) {
                if (msgitem.ProviderName == rec.data.Name)
                    return true;
            });

            if (!msg) {
                msg = {
                    ProviderName: rec.data.Name,
                    Enabled: true,
                    Inheri: true
                };
            }

            rec.set('data', msg);
        });

        me.list.getSelectionModel().select(0);
    },

    getValue: function () {
        var me = this,
            rv = [];

        if (me.edtMessage.record)
            me.edtMessage.record.set('data', me.edtMessage.getValue());

        me.list.getStore().each(function (rec) {
            var item = Ext.apply({}, rec.data.data);

            Ext.apply(item, {
                ProviderName: rec.data.Name
            });

            rv.push(item);
        });

        return rv;
    }
})