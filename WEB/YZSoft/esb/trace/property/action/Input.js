
Ext.define('YZSoft.esb.trace.property.action.Input', {
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

        me.edtInput = Ext.create('YZSoft.src.form.field.JsonEditor', {
            flex: 1,
            value: step.Input,
            style: 'border-top:solid 0px red;',
            margin: 0
        });

        me.btnSave = Ext.create('Ext.button.Button', {
            text: RS.$('All_ESBTrace_Save'),
            hidden: !(task.Status == 'Interrupted' && task.AsyncCall && step.Status != 'Done'),
            handler: function () {
                var input = me.edtInput.getValue();

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/ESB/Instance/Service.ashx'),
                    params: {
                        method: 'UpdateStepInput',
                        stepId: step.StepID
                    },
                    jsonData: {
                        input: input
                    },
                    waitMsg: {
                        msg: RS.$('All_Loading'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        step.Input = input;
                        me.mask({
                            msg: RS.$('All_Save_Succeed'),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: true
                        });
                    }
                });
            }
        });

        me.items = [me.edtInput, me.btnSave];
        me.callParent();
    }
});