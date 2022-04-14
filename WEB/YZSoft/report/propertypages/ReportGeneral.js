/*
config:
*/
Ext.define('YZSoft.report.propertypages.ReportGeneral', {
    extend: 'Ext.form.Panel',
    title: RS.$('All_General'),
    layout: 'anchor',

    constructor: function (config) {
        var me = this,
            cfg;

        me.edtName = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_ReportName'),
            name: 'name',
        });

        cfg = {
            defaults: {
                anchor: '100%'
            },
            items: [me.edtName, {
                xtype: 'checkbox',
                fieldLabel: RS.$('All_Hidden'),
                boxLabel: RS.$('Report_InvisibleInReportTree'),
                name: 'hidden'
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
            rv;

        rv = me.getValuesSubmit();
        return rv;
    },

    updateStatus: function () {
    }
});