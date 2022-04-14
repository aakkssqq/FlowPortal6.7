/*
config:
*/
Ext.define('YZSoft.bpm.propertypages.ESBGeneral', {
    extend: 'Ext.form.Panel',
    title: RS.$('All_General'),
    layout: 'anchor',

    constructor: function (config) {
        var me = this,
            cfg;

        me.edtName = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_StepName'),
            name: 'Name'
        });

        me.cmbFlow = Ext.create('YZSoft.src.form.field.ESBFlowCombo', {
            fieldLabel: RS.$('Process_CallESBName'),
            name: 'FlowName'
        })

        me.chkUseQueue = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: RS.$('Process_CallAsyncThrowQueue'),
            //margin: '3 0 1 0',
            name: 'UseQueue',
            listeners: {
                scope: me,
                change: 'updateStatus'
            }
        });

        me.dspQueueName = Ext.create('Ext.form.field.Display', {
            value: RS.$('Process_AsyncCall_QueueName') + ':'
        });

        me.edtQueueName = Ext.create('Ext.form.field.Text', {
            name: 'QueueName',
            width: 160
        });

        cfg = {
            defaults: {
                anchor: '100%'
            },
            items: [
                me.edtName,
                me.cmbFlow, {
                    xtype: 'fieldcontainer',
                    fieldLabel: RS.$('Process_CallESBAsync'),
                    layout: {
                        type: 'hbox'
                    },
                    margin: '10 0 0 0',
                    items: [
                        me.chkUseQueue,
                        { xtype: 'tbspacer', width: 60 },
                        me.dspQueueName,
                        { xtype: 'tbspacer', width: 20 },
                        me.edtQueueName
                    ]
                }   
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.cmbFlow, ['change'], 'flow');
        me.updateStatus();
    },

    fill: function (data) {
        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            rv;

        rv = me.getValuesSubmit();
        return rv;
    },

    updateStatus: function () {
        var me = this,
            data = me.save();

        me.dspQueueName[data.UseQueue ? 'show' : 'hide']();
        me.edtQueueName[data.UseQueue ? 'show' : 'hide']();
    }
});