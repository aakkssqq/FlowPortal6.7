
Ext.define('YZSoft.esb.trace.property.response.Output', {
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
            step = sprite.step,
            task = designer.task;

        me.edtOutput = Ext.create('YZSoft.src.form.field.JsonEditor', {
            flex: 1,
            value: step.Output,
            margin: 0
        });

        me.btnSave = Ext.create('Ext.button.Button', {
            text: RS.$('All_ESBTrace_Save'),
            hidden: !(task.Status == 'Interrupted' && task.AsyncCall && step.Status != 'Done'),
            handler: function () {
                var output = me.edtOutput.getValue();

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/ESB/Instance/Service.ashx'),
                    params: {
                        method: 'UpdateTaskResponse',
                        stepId: step.StepID,
                        taskId: step.TaskID
                    },
                    jsonData: {
                        output: output
                    },
                    waitMsg: {
                        msg: RS.$('All_Loading'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        step.Output = output;
                        designer.task.Response = output;

                        me.mask({
                            msg: RS.$('All_Save_Succeed'),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: true
                        });
                    }
                });
            }
        });

        me.items = [me.edtOutput, me.btnSave];
        me.callParent();
    }
});