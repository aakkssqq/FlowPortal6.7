
Ext.define('YZSoft.esb.trace.property.task.Variables', {
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
            task = designer.task;

        me.edtVariables = Ext.create('YZSoft.src.form.field.JsonEditor', {
            flex: 1,
            value: task.Variables,
            margin: 0
        });

        me.btnSave = Ext.create('Ext.button.Button', {
            text: RS.$('All_ESBTrace_Save'),
            hidden: !(task.Status == 'Interrupted' && task.AsyncCall),
            handler: function () {
                var variables = me.edtVariables.getValue();

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/ESB/Instance/Service.ashx'),
                    params: {
                        method: 'UpdateTaskVariables',
                        taskId: task.TaskID,
                    },
                    jsonData: {
                        variables: variables
                    },
                    waitMsg: {
                        msg: RS.$('All_Loading'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        task.Variables = variables;

                        me.mask({
                            msg: RS.$('All_Save_Succeed'),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: true
                        });
                    }
                });
            }
        });

        me.items = [me.edtVariables, me.btnSave];
        me.callParent();
    }
});