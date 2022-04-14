/*
taskid
*/

Ext.define('YZSoft.bpm.taskoperation.SelProcessingStepDlg', {
    extend: 'YZSoft.bpm.taskoperation.SelTaskStepDlg',

    constructor: function (config) {
        var me = this;

        config.grid = Ext.apply({
            title: RS.$('All_SelectGate'),
            singleSelection:false,
            autoSelection: true,
            FinishAt: false,
            ReceiveAt:true,
            params: {
                method: 'GetJumpSrcSteps',
                taskid: config.taskid
            }
        }, config.grid);

        me.callParent(arguments);
    }
});
