
/*
resType
resId
msgId
*/

Ext.define('YZSoft.im.src.chat.Chat', {
    extend: 'YZSoft.im.src.chat.Abstract',
    style: 'background-color:#fff',
    requires: [
        'YZSoft.src.ux.Push',
        'YZSoft.src.model.Message',
        'YZSoft.im.src.converts.Converter'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.channel = Ext.String.format('{0}/{1}', config.resType, config.resId);

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.Message',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
                extraParams: {
                    method: 'GetSocialMessages',
                    resType: config.resType,
                    resId: config.resId,
                    msgId: 'msgId' in config ? Number(config.msgId) + 1 : undefined,
                    dir: 'prev',
                    rows: 20
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
                }
            }
        });

        me.store.on({
            load: function (store, records, successful, operation, eOpts) {
                if (!successful)
                    return;

                var params = operation.getRequest().getParams() || {};
                if (records.length != 0 && (params.dir == 'next' || !params.msgId)) {
                    me.updateReaded(records[records.length - 1].getId());
                }
            }
        });

        cfg = {
            store: me.store,
            scrollable: true,
            overItemCls: 'yz-item-over',
            selectedItemCls: 'yz-item-select',
            itemSelector: '.yz-list-item-message',
            tpl: [
                '<tpl for=".">',
                '<div class="x-dataview-item yz-list-item-message">',
                '<tpl if="this.isMy(uid)">',
                    '<div class="d-flex flex-row yz-list-item-message-my yz-list-item-message-{message:this.getMessageType}">',
                        '<div class="yz-column-left">',
                        '</div>',
                        '<div class="flex-fill yz-column-center">',
                            '<div class="time">{date:this.renderDate}</div>',
                            '<div class="message-wrap">',
                                '<div class="message-body">',
                                    '<div class="yz-socialmessage-status">',
                                        '<div class="x-loading-spinner">',
                                            '<span class="x-loading-top"></span>',
                                            '<span class="x-loading-right"></span>',
                                            '<span class="x-loading-bottom"></span>',
                                            '<span class="x-loading-left"></span>',
                                        '</div>',
                                    '</div>',
                                    '<div class="duration" orgDur="{duration:this.renderDuration}">{duration:this.renderDuration}</div>',
                                    '<div class="message">',
                                        '<div class="message-inner">{message:this.renderMessage}</div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<div class="yz-column-right">',
                            '<div class="headsort" style="background-image:url({headsort})"></div>',
                        '</div>',
                    '</div>',
                '<tpl else>',
                    '<div class="d-flex flex-row yz-list-item-message-other yz-list-item-message-{message:this.getMessageType}">',
                        '<div class="yz-column-left">',
                            '<div class="headsort" style="background-image:url({headsort})"></div>',
                        '</div>',
                        '<div class="flex-fill yz-column-center">',
                            '<div class="time"><span class="uid">{UserDisplayName:this.renderString}</span>{date:this.renderDate}</div>',
                            '<div class="message-wrap">',
                                '<div class="message-body">',
                                    '<div class="message">',
                                        '<div class="message-inner">{message:this.renderMessage}</div>',
                                    '</div>',
                                    '<div class="duration" orgDur="{duration:this.renderDuration}">{duration:this.renderDuration}</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<div class="yz-column-right">',
                        '</div>',
                    '</div>',
                '</tpl>',
                '</div>',
                '</tpl>', {
                    isMy: function (value) {
                        return (userInfo.Account || '').toLowerCase() == (value || '').toLowerCase();
                    },
                    renderString: function (value) {
                        return YZSoft.Render.renderString(value);
                    },
                    getMessageType: function (value) {
                        var types = me.types = me.types || {},
                            type = me.types[value];

                        if (!type) {
                            type = YZSoft.im.src.converts.Converter.getMessageType(value);
                            types[value] = type;
                        }

                        return type;
                    },
                    renderMessage: function (value) {
                        var messages = me.messages = me.messages || {},
                            message = me.messages[value];

                        if (!message) {
                            message = YZSoft.im.src.converts.Converter.convert(value);
                            messages[value] = message;
                        }

                        return message;
                    },
                    renderDate: function (value) {
                        return Ext.Date.toFriendlyString(value);
                    },
                    renderDuration: function (value) {
                        return value <= 0 ? '' : Ext.util.Format.mediaDurationM(value);
                    }
                }
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            render: function () {
                me.store.load({
                    callback: function () {
                        me.getScrollable().scrollTo(0, -1);

                        if (me.disablepush !== true) {
                            YZSoft.src.ux.Push.subscribe({
                                cmp: me,
                                channel: me.channel,
                                fn: function () {
                                    YZSoft.src.ux.Push.on({
                                        message: 'onNotify',
                                        scope: me
                                    });
                                }
                            });
                            me.on({
                                destroy: function () {
                                    YZSoft.src.ux.Push.unsubscribe({
                                        cmp: me,
                                        channel: me.channel
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });

        me.on({
            scope: me,
            send: 'onSendComments'
        });

        me.on({
            scope: me,
            docFileQueued: 'onDocFileQueued',
            docNextUpload: 'onDocNextUpload',
            docUploadProgress: 'onDocUploadProgress',
            docUploadSuccess: 'onDocUploadSuccess',
            docUploadFailed: 'onDocUploadFailed'
        });
    },

    findDocWrap: function (uploadid) {
        return this.el.down(Ext.String.format('.yz-social-item-doc[uploadid={0}]', uploadid));
    },

    onDocFileQueued: function (file, uploader) {
        var me = this,
            resType = me.resType,
            resId = me.resId,
            el = me.findDocWrap(file.id),
            msg, rec, item;

        if (el) {
        }
        else {
            msg = {
                localDocFile: file.id,
                Ext: file.type,
                Name: file.name,
                Size: file.size,
                uploadid: file.id
            };

            var msg = {
                resType: resType,
                resId: resId,
                date: new Date(),
                uid: YZSoft.LoginUser.Account,
                message: Ext.encode(msg)
            };

            rec = me.store.add(msg)[0];
            rec.phantom = true;

            me.getScrollable().scrollTo(0, -1);
        }

        me.uploaders = me.uploaders || {};
        me.uploaders[file.id] = uploader;
    },

    onDocNextUpload: function () {
        if (this.el.down('.uploading'))
            return;

        var me = this,
            el = this.el.down('.queued'),
            elStatus = el && el.down('.status'),
            uploadid = el && el.getAttribute('uploadid'),
            uploader = me.uploaders && me.uploaders[uploadid];

        if (uploader) {
            el.removeCls('queued');
            el.addCls('uploading');
            elStatus.setHtml(RS.$('All_IM_Uploading'));

            uploader.uploader.startUpload(uploadid);
        }
    },

    onDocUploadProgress: function (file, complete, total) {
        var me = this,
            el = me.findDocWrap(file.id),
            elProgress = el && el.down('.progress');

        if (!elProgress)
            return;

        elProgress.setStyle('width', Ext.String.format('{0}%',complete * 100 / total));
    },

    onDocCancelTap: function (record, item, index, e) {
        var me = this,
            el = Ext.get(e.getTarget('.yz-social-item-doc')),
            elStatus = el && el.down('.status'),
            uploadid = el && el.getAttribute('uploadid'),
            uploader = me.uploaders && me.uploaders[uploadid],
            elProgress = el && el.down('.progress');

        if (el.hasCls('queued')) {
            el.removeCls('queued');
            elStatus.setHtml(RS.$('All_IM_Upload_Canceled'));
            uploader.fireEvent('nextUpload');
        }
        else if (el.hasCls('uploading')) {
            uploader.uploader.cancelUpload(uploadid);
            el.removeCls('uploading');
            elStatus.setHtml(RS.$('All_IM_Upload_Canceled'));
            elProgress.setStyle('width', '0px');
            uploader.fireEvent('nextUpload');
        }
    },

    onDocUploadSuccess: function (file, data) {
        var me = this,
            el = me.findDocWrap(file.id),
            elStatus = el && el.down('.status'),
            uploadid = el && el.getAttribute('uploadid'),
            uploader = me.uploaders && me.uploaders[uploadid],
            folderid = me.folderid;

        if (el) {
            el.removeCls('uploading');
            el.set({
                fileid: data.fileid
            });
            elStatus.setHtml(RS.$('All_IM_Upload_Success'));

            var msg = Ext.String.format('{docFile:{0},{1}}', data.fileid, data.attachment.Name);

            YZSoft.Ajax.request({
                method: 'POST',
                url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
                params: {
                    method: 'PostComments',
                    clientid: YZSoft.src.ux.Push.clientid,
                    resType: me.resType,
                    resId: me.resId
                },
                jsonData: {
                    message: msg
                },
                success: function (action) {
                },
                failure: function (action) {
                    //Ext.Logger.log(action.result.errorMessage);
                }
            });

            if (folderid != -1) {
                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                    params: {
                        method: 'AddAttachmentToFolder',
                        folderid: folderid,
                        fileid: data.fileid,
                        flag: 'Upload'
                    },
                    success: function (action) {
                    }
                });
            }
        }
    },

    onDocUploadFailed: function (file, errorMessage, code, message, uploader) {
        var me = this,
            el = me.findDocWrap(file.id),
            elStatus = el && el.down('.status'),
            uploadid = el && el.getAttribute('uploadid');

        uploader.uploader.cancelUpload(file.id);
        el.removeCls('uploading');
        elStatus.setHtml(RS.$('All_IM_Upload_Failed'));

        YZSoft.alert(errorMessage, function () {
            uploader.fireEvent('nextUpload');
        });

        return false;
    },

    onSendComments: function (msg) {
        var me = this,
            resType = me.resType,
            resId = me.resId,
            rec, item;

        if (!msg)
            return;

        var msg = {
            resType: resType,
            resId: resId,
            date: new Date(),
            uid: YZSoft.LoginUser.Account,
            message: msg
        };

        rec = me.store.add(msg)[0];
        rec.phantom = true;

        item = {};
        item.item = Ext.get(me.getNode(rec));
        item.statusEl = item.item.down('.yz-socialmessage-status');
        item.statusEl.addCls('yz-socialmessage-send-waiting');
        item.beginTime = Ext.Date.now();

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
            params: {
                method: 'PostComments',
                clientid: YZSoft.src.ux.Push.clientid,
                resType: resType,
                resId: resId
            },
            jsonData: {
                message: msg.message
            },
            success: function (action) {
                rec.setId(action.result.id);
                me.getScrollable().scrollTo(0,-1);
            },
            failure: function (action) {
                //Ext.Logger.log(action.result.errorMessage);
            },
            requestend: function () {
                var tick = $S.IM.delay.sendMessage - Ext.Date.getElapsed(item.beginTime);
                Ext.defer(function () {
                    item.statusEl.removeCls('yz-socialmessage-send-waiting');
                }, tick);
            }
        });
    }
});