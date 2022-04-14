
/*
stepid
*/

Ext.define('YZSoft.bpm.taskoperation.SelPickbackStepDlg', {
    extend: 'YZSoft.bpm.taskoperation.SelTaskStepDlg',

    constructor: function (config) {
        var me = this;

        config.grid = {
            title: RS.$('All_PickbackTo'),
            singleSelection: true,
            autoSelection: true,
            params: {
                method: 'GetPickbackableSteps',
                taskid: config.taskid
            }
        };

        me.callParent(arguments);
    }
});