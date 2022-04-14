
Ext.define('YZSoft.im.src.chat.Abstract', {
    extend: 'Ext.view.View',
    requires: [
        'YZSoft.src.ux.Push',
        'YZSoft.src.ux.ImageViewer',
        'YZSoft.src.ux.File',
        'YZSoft.src.ux.VideoPlayer',
        'YZSoft.bpm.src.ux.FormManager'
    ],
    onDocCancelTap:Ext.emptyFn,

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);
        me.on({
            scope: me,
            activate: 'onActivate'
        });
    },

    onNotify: function (message) {
        var me = this,
            s = me.getScrollable(),
            r;

        if (message.channel != me.channel || message.clientid == YZSoft.src.ux.Push.clientid)
            return;

        r = me.store.add(message.message)[0];
        r.phantom = true;

        s.scrollTo(0, -1);

        if (me.isVisible(true))
            me.updateReaded(message.message.id);
        else
            me.lastMessage = message;
    },

    onActivate: function () {
        var me = this;

        if (me.lastMessage) {
            me.getScrollable().scrollTo(0, -1);
            me.updateReaded(me.lastMessage.message.id);
            delete me.lastMessage;
        }

        if (!('msgId' in me))
            Ext.getDoc().fireEvent('channelopen', me.resType, me.resId);
    },

    updateReaded: function (msgId) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
            params: {
                method: 'UpdateReaded',
                resType: me.resType,
                resId: me.resId,
                msgId: msgId
            }
        });
    },

    onItemClick: function (record, item, index, e) {
        var me = this,
            targetImg = Ext.get(e.getTarget('.yz-social-item-img')),
            targetVideo = Ext.get(e.getTarget('.yz-social-item-video')),
            targetDoc = Ext.get(e.getTarget('.yz-social-item-doc')),
            targetAudio = Ext.get(e.getTarget('.yz-social-item-audio')),
            targetTaskApproved = Ext.get(e.getTarget('.taskapprove-wrap')),
            targetTaskRejected = Ext.get(e.getTarget('.taskreject-wrap')),
            targetProcessRemind = Ext.get(e.getTarget('.processremind-wrap')),
            targetExceptionStep = Ext.get(e.getTarget('.exceptionstep-wrap'));

        if (e.getTarget('.message') || e.getTarget('.headsort'))
            e.stopEvent();

        if (targetImg)
            me.onImageTap.apply(me, arguments);
        if (targetVideo)
            me.onVideoTap.apply(me, arguments);
        else if (targetDoc) {
            var targetDocCancel = Ext.get(e.getTarget('.yz-social-item-doc .cancel'));

            if (targetDocCancel)
                me.onDocCancelTap.apply(me, arguments);
            else
                me.onDocTap.apply(me, arguments);
        }
        else if (targetAudio)
            me.onAudioTap.apply(me, arguments);
        else if (targetTaskApproved)
            me.onTaskApprovedTap.apply(me, arguments);
        else if (targetTaskRejected)
            me.onTaskRejectedTap.apply(me, arguments);
        else if (targetProcessRemind)
            me.onProcessRemindTap.apply(me, arguments);
        else if (targetExceptionStep)
            me.onExceptionStepTap.apply(me, arguments);
    },

    onImageTap: function (record, item, index, e) {
        var me = this,
            targetImg = Ext.get(e.getTarget('.yz-social-item-img')),
            fileid = targetImg && targetImg.getAttribute('fileid'),
            previews = me.imagePreviews = me.imagePreviews || {},
            pnl = previews[fileid],
            url;

        if (!fileid)
            return;

        url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'ImageStreamFromFileID',
            fileid: fileid
        }));

        if (me.imgViewer && !me.imgViewer.isDestroyed && me.imgViewer.fileid == fileid)
            return;

        if (me.imgViewer && !me.imgViewer.isDestroyed) {
            Ext.destroy(me.imgViewer);
            delete me.imgViewer;
        }

        me.imgViewer = YZSoft.src.ux.ImageViewer.preview({
            fileid: fileid
        });

        me.imgViewer.showAt(-100, -100);
    },

    onVideoTap: function (record, item, index, e) {
        var me = this,
            targetVideo = Ext.get(e.getTarget('.yz-social-item-video')),
            fileid = targetVideo && targetVideo.getAttribute('fileid'),
            url,win;

        if (!fileid)
            return;

        url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'VideoStreamFromFileID',
            fileid: fileid,
            dc: +new Date()
        }));

        win = YZSoft.src.ux.VideoPlayer.play({
            url: url,
            posterImage: targetVideo.dom,
            fn: function () {
                win.destroy();
            }
        });
    },

    onDocTap: function (record, item, index, e) {
        var me = this,
            targetDoc = Ext.get(e.getTarget('.yz-social-item-doc')),
            fileid = targetDoc && targetDoc.getAttribute('fileid');

        if (!fileid)
            return;

        YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
            method: 'Download',
            fileid: fileid
        });
    },

    onAudioTap: function (record, item, index, e) {
        var me = this,
            node = me.getNode(record),
            targetAudio = Ext.get(e.getTarget('.yz-social-item-audio')),
            fileid = targetAudio.getAttribute('fileid');

        if (node.player)
            return;

        var url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'AudioStreamFromFileID',
            fileid: fileid,
            supports: 'mp3,wav',
            dc: (+new Date())
        }));

        node.player = Ext.create('YZSoft.src.component.jPlayer', {
            cls: 'yz-jplayer-onsite',
            jplayerConfig: {
                //solution: 'flash', //使用flash播放
                supplied: 'm4a'
            },
            listeners: {
                ready: function () {
                    this.setMedia({
                        title: 'Bubble',
                        m4a: url //testing url:http://jplayer.org/audio/m4a/Miaow-07-Bubble.m4a
                    });

                    this.play();
                },
                play: function () {
                    this.pauseOthers();
                }
            }
        });

        node.player.render(targetAudio.dom);
    },

    onTaskApprovedTap: function (record, item, index, e) {
        var me = this,
            targetTaskApproved = Ext.get(e.getTarget('.taskapprove-wrap')),
            taskid = Number(targetTaskApproved.getAttribute('taskid')),
            processName = targetTaskApproved.getAttribute('processName'),
            sn = targetTaskApproved.getAttribute('sn');

        YZSoft.bpm.src.ux.FormManager.openTaskForRead(taskid, {
            sender: me,
            title: Ext.String.format('{0}-{1}', processName, sn)
        });
    },

    onTaskRejectedTap: function (record, item, index, e) {
        var me = this,
            targetTaskRejected = Ext.get(e.getTarget('.taskreject-wrap')),
            taskid = Number(targetTaskRejected.getAttribute('taskid')),
            processName = targetTaskRejected.getAttribute('processName'),
            sn = targetTaskRejected.getAttribute('sn');

        YZSoft.bpm.src.ux.FormManager.openTaskForRead(taskid, {
            sender: me,
            title: Ext.String.format('{0}-{1}', processName, sn)
        });
    },

    onProcessRemindTap: function (record, item, index, e) {
        var me = this,
            targetEl = Ext.get(e.getTarget('.processremind-wrap')),
            stepid = Number(targetEl.getAttribute('stepid')),
            taskid = Number(targetEl.getAttribute('taskid')),
            processName = targetEl.getAttribute('processName'),
            stepName = targetEl.getAttribute('stepName'),
            sn = targetEl.getAttribute('sn');

        if (targetEl.hasCls('processremind-finished')) {
            YZSoft.bpm.src.ux.FormManager.openTaskForRead(taskid, {
                sender: me,
                title: Ext.String.format('{0}-{1}', processName, sn)
            });
        }
        else {
            YZSoft.bpm.src.ux.FormManager.openTaskForProcess(stepid, {
                sender: me,
                title: Ext.String.format('{0}-{1}', stepName, sn),
                listeners: {
                    scope: me,
                    modified: function (name, data) {
                        YZSoft.Ajax.request({
                            async: false,
                            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
                            params: {
                                Method: 'GetProcessRemindInfo',
                                stepid: stepid
                            },
                            success: function (action) {
                                if (action.result.finished) {
                                    var items = me.el.query('.processremind-wrap');
                                    Ext.Array.each(items, function (item) {
                                        var itemel = Ext.get(item),
                                            stepidItem = Number(itemel.getAttribute('stepid'));

                                        if (stepidItem == stepid)
                                            itemel.addCls('processremind-finished');
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    },

    onExceptionStepTap: function (record, item, index, e) {
        var me = this,
            targetEl = Ext.get(e.getTarget('.exceptionstep-wrap')),
            stepid = Number(targetEl.getAttribute('stepid')),
            taskid = Number(targetEl.getAttribute('taskid')),
            processName = targetEl.getAttribute('processName'),
            sn = targetEl.getAttribute('sn');

        YZSoft.bpm.src.ux.FormManager.openTaskForRead(taskid, {
            sender: me,
            title: Ext.String.format('{0}-{1}', processName, sn)
        });
    }
});