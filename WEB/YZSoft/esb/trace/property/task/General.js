/*
config:
*/
Ext.define('YZSoft.esb.trace.property.task.General', {
    extend: 'Ext.form.Panel',
    layout: 'anchor',

    initComponent: function () {
        var me = this,
            designer = me.designer,
            task = designer.task;

        me.edtTaskID = Ext.create('Ext.form.field.Display', {
            fieldLabel:RS.$( 'All_ESBTrace_TaskID'),
            labelAlign: 'top',
            value: task.TaskID,
            margin: 0
        });

        me.edtRunType = Ext.create('Ext.form.field.Display', {
            fieldLabel: RS.$('All_ESBTrace_RunType'),
            labelAlign: 'top',
            value: task.AsyncCall ? RS.$('All_Async') : RS.$('All_Sync'),
            margin: 0
        });

        me.items = [
            me.edtTaskID,
            me.edtRunType
        ];

        me.callParent();
    }
});