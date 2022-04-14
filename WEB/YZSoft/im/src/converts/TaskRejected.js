
Ext.define('YZSoft.im.src.converts.TaskRejected', {
    singleton: true,

    convert: function (id) {
        var me = this,
            rejectinfo;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                Method: 'GetTaskRejectedInfo',
                stepid: id
            },
            success: function (action) {
                rejectinfo = action.result;
            },
            failure: function () {
            }
        });

        if (!rejectinfo)
            return RS.$('All__MessageConvert_TaskDeleted');

        return Ext.String.format([
            '<div class="taskreject-wrap" taskid="{1}" processName="{0}" sn="{2}">',
            '<div class="taskreject-base">',
            '<div class="processName">{0}</div>',
            '<div class="desc">{3}</div>',
            '<div class="reject"><span class="rejectby">{4}</span>{6}</div>',
            '<div class="comments">{5}</div>',
            '</div>',
            '<div class="notify-more taskreject-more">',
            '<div class="detail">{7}</div>',
            '</div>',
            '</div>'
        ].join(''),
            rejectinfo.processName,
            rejectinfo.taskid,
            rejectinfo.sn,
            rejectinfo.desc || rejectinfo.sn || '',
            rejectinfo.rejectBy,
            rejectinfo.comments || '',
            RS.$('All__MessageConvert_RejectedBy'),
            RS.$('All__ShowDetail'));
    },

    convertLM: function (id) {
        var me = this,
            rejectinfo;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                Method: 'GetTaskRejectedInfo',
                stepid: id
            },
            success: function (action) {
                rejectinfo = action.result;
            },
            failure: function () {
            }
        });

        if (!rejectinfo)
            return RS.$('All__MessageConvert_TaskDeleted');

        return Ext.String.format(RS.$('All__MessageConvert_TaskRejected_FMT'), rejectinfo.processName);
    }
});
