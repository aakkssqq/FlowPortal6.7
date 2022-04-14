
Ext.define('YZSoft.designer.YZSoft.report.search.field.Abstract', {
    extend: 'Ext.panel.Panel',

    initComponent: function () {
        var me = this,
            part = me.part;

        me.callParent();

        part.dsNode.on({
            scope: me,
            textchanged: 'updateFieldLabel'
        });

        me.updateFieldLabel();
    },

    updateFieldLabel: function () {
        var me = this,
            part = me.part;

        me.xdatabind.setFieldLabel(Ext.String.format(RS.$('ReportDesigner_Field_BindParam'), part.dsNode.get('text')));
    }
});