/*
config:
*/
Ext.define('YZSoft.report.rpt.PropertyPages.ReportLink', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('Report_Link'),
    layout: 'fit',

    constructor: function (config) {
        var me = this;

        me.edtColumns = Ext.create('YZSoft.report.rpt.editor.ReportLinkField', {
            fieldLabel:RS.$('Report_Caption_LinkFields'),
            labelAlign:'top'
        });

        var cfg = {
            items: [me.edtColumns]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        this.edtColumns.setValue(data);
    },

    save: function () {
        return this.edtColumns.getValue();
    }
});