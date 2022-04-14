/*
taskid
*/

Ext.define('YZSoft.bpm.taskoperation.SelJumpSrcStepDlg', {
    extend: 'YZSoft.bpm.taskoperation.SelTaskStepDlg',

    constructor: function (config) {
        var me = this;

        config.grid = {
            title: RS.$('TaskOpt_Jump_SrcDlg_Title'),
            singleSelection:false,
            autoSelection: true,
            FinishAt: false,
            ReceiveAt:true,
            params: {
                method: 'GetJumpSrcSteps',
                taskid: config.taskid
            }
        };

        me.callParent(arguments);
    }
});
