/*
config:
*/
Ext.define('YZSoft.report.rpt.PropertyPages.DisplayName', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('Report_Title_ColumnDisplay'),
    layout: 'fit',

    constructor: function (config) {
        var me = this;

        me.edtColumns = Ext.create('YZSoft.report.rpt.editor.ColumnDisplayNameField', {
            fieldLabel:RS.$('All_ColumnDisplayName'),
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