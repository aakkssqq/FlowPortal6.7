
Ext.define('YZSoft.im.src.converts.ExceptionStep', {
    singleton: true,

    convert: function (obj) {
        var me = this,
            info;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                Method: 'GetExceptionStepInfo',
                stepid: obj.exceptionStep
            },
            success: function (action) {
                info = action.result;
            },
            failure: function () {
            }
        });

        if (!info)
            return RS.$('All__MessageConvert_TaskDeleted');

        return Ext.String.format([
            '<div class="exceptionstep-wrap" stepid="{0}" taskid="{1}" sn="{2}" processName="{3}">',
            '<div class="exceptionstep-base">',
            '<div class="processname">{4}</div>',
            '<div class="sn">{2}</div>',
            '<div class="createat">{5}{6}</div>',
            '<div class="exception">{7}{8}</div>',
            '</div>',
            '<div class="notify-more exceptionstep-more">',
            '<div class="detail">{9}</div>',
            '</div>',
            '</div>'
        ].join(''),
            info.stepid,
            info.taskid,
            info.sn,
            info.processName,
            Ext.String.format(RS.$('All__MessageConvert_ExceptionStepTitle'), info.ownerDisplayName || info.ownerAccount, info.processName),
            RS.$('All__MessageConvert_PostAt'),
            Ext.Date.format(info.createat, 'Y-m-d H:i'),
            RS.$('All__MessageConvert_ExceptionStep'),
            info.stepName,
            RS.$('All__ShowDetail'));
    },

    convertLM: function (obj) {
        var me = this,
            info;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                Method: 'GetExceptionStepInfo',
                stepid: obj.exceptionStep
            },
            success: function (action) {
                info = action.result;
            },
            failure: function () {
            }
        });

        if (!info)
            return RS.$('All__MessageConvert_TaskDeleted');

        return Ext.String.format(RS.$('All__MessageConvert_ExceptionStep_LMTitle'), info.ownerDisplayName || info.ownerAccount, info.processName, info.sn, info.stepName);
    }
});
