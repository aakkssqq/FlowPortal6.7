/*
config
    TaskID
*/

Ext.define('YZSoft.bpm.simulate.FlowChart', {
    extend: 'YZSoft.bpm.tasktrace.FlowChart',
    autoLoad: false,

    constructor: function (config) {
        var me = this;

        var cfg = {
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    updateTaskInfo: function (taskid) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/FlowChart.ashx'),
            params: { Method: 'GetTaskLastSteps', TaskID: taskid, LastStepID: -1 },
            success: function (action) {
                var rv = action.result;

                me.steps = rv.Steps;
                me.drawContainer.applyTaskInfo(rv.Steps);
            }
        });
    }
});