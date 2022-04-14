/*
config:
tables
stepNames
*/
Ext.define('YZSoft.bpm.propertypages.InformRecipients', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('Process_Title_InformRecipients'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            defaults: {
                labelAlign: 'top'
            },
            items: [{
                xclass: 'YZSoft.bpm.src.editor.ParticipantField',
                tables: config.tables,
                stepNames: config.stepNames,
                fieldLabel: RS.$('Process_Inform_Recipients'),
                name: 'Recipients',
                flex: 1
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        this.getForm().setValues({
            Recipients: data
        });
        this.updateStatus();
    },

    save: function () {
        return this.getValuesSubmit().Recipients;
    },

    updateStatus: function () {
    }
});