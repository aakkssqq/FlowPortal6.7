/*
taskid
*/

Ext.define('YZSoft.bpm.taskoperation.SelReActiveStepDlg', {
    extend: 'YZSoft.bpm.taskoperation.SelTaskStepDlg',
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],

    constructor: function (config) {
        var me = this;

        config.grid = {
            title: RS.$('All_Caption_ReActiveSelTagStep'),
            singleSelection: false,
            autoSelection: true,
            columns: [
                    { text: RS.$('All_StepName'), dataIndex: 'NodeName', align: 'left', flex: 1 },
                    { text: RS.$('All_Owner'), dataIndex: 'OwnerAccount', align: 'left', width: 160, renderer: YZSoft.bpm.src.ux.Render.renderStepOwner },
                    { text: RS.$('All_Operate'), dataIndex: 'SelActionDisplayString', align: 'left', width: 120, renderer: YZSoft.Render.RenderString },
                    { text: RS.$('All_ProcessAt'), dataIndex: 'FinishAt', width: 140, align: 'left', formatter: 'date("Y-m-d H:i")'  },
                    { text: RS.$('All_HandlerFullName'), dataIndex: 'HandlerAccount', width: 120, align: 'left', renderer: YZSoft.bpm.src.ux.Render.renderStepHandler }
            ],
            params: {
                method: 'GetReActiveSteps',
                taskid: config.taskid
            },
            canSelect: function (record) {
                return record.data['OwnerAccount'];
            }
        };

        me.callParent(arguments);
    }
});