
/*
stepid
*/

Ext.define('YZSoft.bpm.taskoperation.SelRecedeBackStepDlg', {
    extend: 'YZSoft.bpm.taskoperation.SelTaskStepDlg',

    constructor: function (config) {
        var me = this;

        config.grid = {
            title: RS.$('TaskOpt_RecedeBack_Caption'),
            singleSelection: false,
            autoSelection: true,
            params: {
                method: 'GetRecedeBackSteps',
                stepid: config.stepid
            }
        };

        me.callParent(arguments);
    }
});