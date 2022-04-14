
Ext.define('YZSoft.im.src.converts.ManualRemind', {
    singleton: true,

    convert: function (obj) {
        var me = this,
            remindinfo;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                Method: 'GetProcessRemindInfo',
                stepid: obj.manualRemind
            },
            success: function (action) {
                remindinfo = action.result;
            },
            failure: function () {
            }
        });

        if (!remindinfo)
            return RS.$('All__MessageConvert_TaskDeleted');


        return Ext.String.format([
            '<div class="processremind-wrap {8}" stepid="{0}" taskid="{9}" processName="{3}" sn="{2}" stepName="{10}">',
            '<div class="processremind-base">',
            '<div class="comments">{1}</div>',
            '<div class="processname">{3}</div>',
            '<div class="sn">{5}{2}</div>',
            '<div class="createat">{6}{4}</div>',
            '</div>',
            '<div class="notify-more processremind-more">',
            '<div class="detail">{7}</div>',
            '</div>',
            '</div>'
        ].join(''),
            remindinfo.stepid,
            Ext.String.format('{0} : {1}', obj.senderShortName, obj.comments || RS.$('All__Remind')),
            remindinfo.sn,
            Ext.String.format(RS.$('All__RemindTitle'), remindinfo.ownerDisplayName || remindinfo.ownerAccount, remindinfo.processName),
            Ext.Date.format(remindinfo.createat, 'Y-m-d H:i'),
            RS.$('All__MessageConvert_SN'),
            RS.$('All__MessageConvert_PostAt'),
            remindinfo.finished ? RS.$('All__ShowDetail') : RS.$('All__GoProcess'),
            remindinfo.finished ? 'processremind-finished' : 'processremind-running',
            remindinfo.taskid,
            remindinfo.stepName
        );
    },

    convertLM: function (obj) {
        return Ext.String.format('{0} : {1}', obj.senderShortName, obj.comments || '');
    }
});
