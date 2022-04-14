/*
config:
*/
Ext.define('YZSoft.report.rpt.PropertyPages.ReportGeneral', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_General'),
    layout: 'anchor',

    constructor: function (config) {
        var me = this;

        var cfg = {
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_ReportName'),
                name: 'Name',
                reference: 'edtName'
            }, {
                xtype:'textfield',
                fieldLabel: RS.$('All_ExcelExportTemplate'),
                name: 'ExportTemplateFile'
            }, {
                xtype: 'checkbox',
                fieldLabel: RS.$('All_Hidden'),
                boxLabel: RS.$('Report_InvisibleInReportTree'),
                name: 'Hidden'
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