/*
config:
*/
Ext.define('YZSoft.bpm.propertypages.SplitGeneral', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_General'),
    layout: 'anchor',

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_StepName'),
                name: 'Name',
                reference: 'edtName'
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();
        return rv;
    },

    updateStatus: function () {
    }
});