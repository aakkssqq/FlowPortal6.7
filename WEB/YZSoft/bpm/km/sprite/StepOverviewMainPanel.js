
/*
config
pnlProperty
*/
Ext.define('YZSoft.bpm.km.sprite.StepOverviewMainPanel', {
    extend: 'YZSoft.bpm.km.sprite.OverviewMainPanel',

    showSprite: function (option) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPA/ProcessReports.ashx'),
            params: {
                method: 'GetStepOverviewInfo',
                stepid: option.stepid
            },
            success: function (action) {
                me.afterLoad(action.result, option);
                me.fillSprite(action.result);
            }
        });
    }
});