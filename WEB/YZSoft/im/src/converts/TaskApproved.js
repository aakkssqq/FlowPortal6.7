
Ext.define('YZSoft.im.src.converts.TaskApproved', {
    singleton: true,

    convert: function (id) {
        var me = this,
            approveinfo;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                Method: 'GetTaskApprovedInfo',
                taskid: id
            },
            success: function (action) {
                approveinfo = action.result;
            },
            failure: function () {
            }
        });

        if (!approveinfo)
            return RS.$('All__MessageConvert_TaskDeleted');

        return Ext.String.format([
            '<div class="taskapprove-wrap" taskid="{1}" processName="{0}" sn="{2}">',
            '<div class="taskapprove-base">',
            '<div class="processname">{0}</div>',
            '<div class="desc">{3}</div>',
            '<div class="sn">{5}{2}</div>',
            '<div class="createat">{6}{4}</div>',
            '</div>',
            '<div class="notify-more taskapprove-more">',
            '<div class="detail">{7}</div>',
            '</div>',
            '</div>'
        ].join(''),
            approveinfo.processName,
            approveinfo.taskid,
            approveinfo.sn,
            approveinfo.desc || approveinfo.sn || '',
            Ext.Date.format(approveinfo.createat, 'Y-m-d H:i'),
            RS.$('All__MessageConvert_SN'),
            RS.$('All__MessageConvert_PostAt'),
            RS.$('All__ShowDetail'));
    },

    convertLM: function (id) {
        var me = this,
            approveinfo;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                Method: 'GetTaskApprovedInfo',
                taskid: id
            },
            success: function (action) {
                approveinfo = action.result;
            },
            failure: function () {
            }
        });

        if (!approveinfo)
            return RS.$('All__MessageConvert_TaskDeleted');

        return Ext.String.format(RS.$('All__MessageConvert_TaskApproved_FMT'), approveinfo.processName);
    }
});
