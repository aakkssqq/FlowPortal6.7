/*
config:
relatedFile
*/
Ext.define('YZSoft.esb.trace.property.action.General', {
    extend: 'Ext.form.Panel',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this,
            designer = me.designer,
            sprite = me.sprite,
            step = sprite.step;

        me.edtStepID = Ext.create('Ext.form.field.Display', {
            fieldLabel: RS.$('All_ESBTrace_StepID'),
            labelAlign: 'top',
            value: step.StepID,
            margin: 0
        });

        me.edtTiks = Ext.create('Ext.form.field.Display', {
            fieldLabel: RS.$('All_Elapsed'),
            labelAlign: 'top',
            value: step.Ticks + RS.$('All_Unit_MS'),
            hidden: step.Status != 'Done',
            margin: 0
        });

        me.edtErrorMessage = Ext.create('Ext.form.field.Display', {
            fieldLabel: RS.$('ESB_PropertyPage_Title_Exception'),
            labelAlign: 'top',
            value: step.ErrorMessage,
            hidden: step.Status == 'Done',
            margin: 0
        });

        me.items = [
            me.edtStepID,
            me.edtTiks,
            me.edtErrorMessage
        ];

        me.callParent();
    }
});