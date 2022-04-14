
Ext.define('YZSoft.esb.trace.property.action.Output', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.form.field.JsonEditor'
    ],
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this,
            designer = me.designer,
            sprite = me.sprite,
            step = sprite.step;

        me.edtOutput = Ext.create('YZSoft.src.form.field.JsonEditor', {
            flex: 1,
            value: step.Output,
            margin: 0
        });

        me.items = [me.edtOutput];
        me.callParent();
    }
});