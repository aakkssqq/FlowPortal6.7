
Ext.define('YZSoft.designer.YZSoft.report.search.field.TextArea', {
    extend: 'Ext.panel.Panel',
    bodyPadding: 20,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this,
            formfield = me.tag;

        me.fieldLabel = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_Label'),
            labelAlign: 'top',
            value: formfield.getFieldLabel(),
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                formfield.setFieldLabel(value);
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.items = [
            me.fieldLabel
        ];

        me.callParent();
    }
});