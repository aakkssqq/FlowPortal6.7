
Ext.define('YZSoft.forms.field.Attachments', {
    extend: 'YZSoft.forms.field.Element',
    requires: [
        'YZSoft.src.ux.File'
    ],
    valueEleSelector: '.yz-xform-field-attachments-input',
    itemsEleSelector: '.yz-xform-field-attachments-items',
    optCntEleSelector: '.yz-xform-field-attachments-opt-cnt',
    addEleSelector: '.yz-xform-field-attachments-opt-add',
    uploadingSelector: '.yz-xform-field-attachments-item-uploading',
    waitSelector: '.yz-xform-field-attachments-item-wait',
    itemSelector: '.yz-xform-field-attachments-item',
    itemCls: 'yz-xform-field-attachments-item',
    newaddedItemCls: 'yz-xform-field-attachments-item-newadded',
    historyItemCls: 'yz-xform-field-attachments-item-history',
    waitCls: 'yz-xform-field-attachments-item-wait',
    lastItemCls: 'yz-xform-field-attachments-item-lastitem',
    uploadingCls: 'yz-xform-field-attachments-item-uploading',
    focusCls: 'yz-xform-field-focus',
    downloadCfg: {
        url: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'),
        params: {
            method: 'Download'
        }
    },

    constructor: function (agent, dom) {
        var me = this,
            ctrls = me.controls = {};

        me.callParent(arguments);

        ctrls.dom = {
            input: me.down(me.valueEleSelector, true),
            items: me.down(me.itemsEleSelector, true),
            optCnt: me.down(me.optCntEleSelector, true),
            add: me.down(me.addEleSelector, true)
        };
    },

    onReady: function () {
        var me = this,
            et = me.getEleType(),
            ctrls = me.controls,
            dom = ctrls.dom;

        Ext.apply(ctrls, {
            items: Ext.get(dom.items),
            optCnt: Ext.get(dom.optCnt)
        });

        if (Ext.os.is.iOS || Ext.os.is.Android) { //ios下使用ExtJS事件机制监听会导致开窗被阻止
            ctrls.items.dom.addEventListener('click', function (e) {
                me.clickOnItems(new Ext.event.Event(e));
            }, false);
        }
        else {
            ctrls.items.on({
                scope: me,
                click: 'clickOnItems'
            });
        }

        if (!me.uploader) {
            me.uploader = Ext.create('YZSoft.src.ux.Uploader', {
                autoStart: false,
                fileSizeLimit: et.maximumFileSize,
                fileTypes: et.fileTypes || '*.*',
                typesDesc: et.typesDesc || RS.$('All_FileTypeDesc_All')
            });

            me.uploader.on({
                fileQueued: function (file) {
                    me.addAttachItem({
                        uploadid: file.id,
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        state: 'queued'
                    });
                },
                nextUpload: function () {
                    me.beginUpload();
                },
                uploadSuccess: function (file, data) {
                    var item = me.getItemByUploadId(file.id);
                    if (item) {
                        item.item.removeCls(me.uploadingCls);
                        item.item.dom.setAttribute('uploadid', '');
                        item.item.dom.setAttribute('fileid', data.fileid);
                        item.b.setHtml('');
                        me.updateValue();
                    }
                },
                uploadProgress: function (file, complete, total) {
                    var item = me.getItemByUploadId(file.id);
                    if (item) {
                        item.item.dom.style.backgroundPosition = Math.floor(complete * item.item.getWidth() / total) + 'px 0px';
                        item.b.setHtml(Math.floor(complete / total * 100) + '%');
                    }
                },
                uploadFailed: function (file, errorMessage) {
                    YZSoft.alert(errorMessage, function () {
                        me.deleteUploadingAttachment(file.id);
                        me.uploader.fireEvent('nextUpload');
                    });
                    return false;
                },
                uploadCancled: function (file) {
                    //me.uploadMask.destroy();
                }
            });

            me.uploader.attach(ctrls.dom.add);
        }
    },

    getEleTypeConfig: function () {
        var me = this;

        return {
            sDataBind: me.getDataBind(),
            fileTypes: me.getAttribute('FileTypes'),
            typesDesc: me.getAttribute('FileTypesDescription'),
            maximumFileSize: me.getAttribute('MaximumFileSize'),
            Express: me.getExp(),
            DisableExpress: me.getDisableExp(),
            DisableCssClass: me.getAttribute('DisableCssClass'),
            HiddenExpress: me.getHiddenExp()
        };
    },

    getItemByUploadId: function (id) {
        var me = this,
            ctrls = me.controls,
            item;

        if (!id)
            return null;

        item = ctrls.items.down(Ext.String.format('[uploadid={0}]', id), false);
        return me.getItemInfo(item);
    },

    getItemInfo: function (item) {
        if (!item)
            return null;

        return {
            item: item,
            a: item.down('a', false),
            b: item.down('b', false),
            uploadid: item.dom.getAttribute('uploadid'),
            fileid: item.dom.getAttribute('fileid'),
            filename: item.dom.getAttribute('filename')
        }
    },

    updateLastItemCls: function () {
        var me = this,
            ctrls = me.controls,
            items = ctrls.items.query(me.itemSelector, false);

        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            if (i != items.length - 1)
                item.removeCls(me.lastItemCls);
            else
                item.addCls(me.lastItemCls);
        }
    },

    addAttachItem: function (file) {
        var me = this,
            et = me.getEleType(),
            ctrls = me.controls,
            div, cls;

        var html = '<div uploadid="{0}" fileid="{1}" class="{2}">' +
                    '<a href="javascript:void(0)" class="link" style="background-image: url({3})">' +
                        '<span class="flag"></span>{4}<span class="size">- {5}</span>' +
                    '</a>' +
                    '<b></b>' +
                    '<span class="del yz-xform-field-notprint"></span>' +
                    '<div>';

        switch (file.state) {
            case 'queued':
                cls = me.itemCls + ' ' + me.newaddedItemCls + ' ' + me.waitCls;
                break
            default:
                cls = me.itemCls + ' ' + me.historyItemCls;
                break
        }

        html = Ext.String.format(html,
            file.uploadid,
            file.fileid,
            cls,
            YZSoft.src.ux.File.getIconByExt(file.type),
            file.name,
            file.size.toFileSize());

        var elItem = Ext.dom.Helper.insertBefore(ctrls.optCnt, html, true);
        elItem.dom.setAttribute('filename', file.name);

        me.updateLastItemCls();
        return elItem;
    },

    getDownloadUrl: function (fileid) {
        var me = this;

        return Ext.String.urlAppend(me.downloadCfg.url, Ext.Object.toQueryString(Ext.apply({
            fileid: fileid,
            _dc: +new Date()
        }, me.downloadCfg.params)));
    },

    beginUpload: function () {
        var me = this,
            ctrls = me.controls;

        if (!ctrls.items.down(me.uploadingSelector, true)) {
            var wait = ctrls.items.down(me.waitSelector, false);
            if (wait) {
                wait = me.getItemInfo(wait);
                wait.item.replaceCls(me.waitCls, me.uploadingCls);
                wait.b.setHtml('0%');
                me.uploader.uploader.startUpload(wait.uploadid);
            }
        }
    },

    updateValue: function () {
        var me = this,
            ctrls = me.controls,
            items = ctrls.items.query(me.itemSelector, false),
            fileIds = [];

        Ext.each(items, function (itemEl) {
            var fileid = itemEl.getAttribute('fileid');
            if (fileid)
                fileIds.push(fileid);
        });

        ctrls.dom.input.value = fileIds.join(';');
        me.agent.fireEvent('inputChange', me);
    },

    deleteUploadingAttachment: function (uploadid) {
        var me = this,
            ctrls = me.controls,
            item = me.getItemByUploadId(uploadid);

        if (item) {
            me.uploader.uploader.cancelUpload(uploadid);
            ctrls.items.dom.removeChild(item.item.dom);
            me.updateValue();
        }
    },

    deleteAllAttachments: function () {
        var me = this,
            ctrls = me.controls,
            items = ctrls.items.query(me.itemSelector, false);

        Ext.each(items, function (item) {
            me.deleteAttachment(item, false);
        });
    },

    deleteAttachment: function (item, prompt) {
        var me = this,
            ctrls = me.controls,
            item = me.getItemInfo(item);

        if (prompt !== false && item.fileid) {
            Ext.Msg.confirm(RS.$('All_Warning'), Ext.String.format(RS.$('Form_DeleteAttachmentCfm_Msg'), item.filename), function (button, text) {
                if (button == 'yes')
                    me.deleteAttachment(item.item, false);
            });
            return;
        }

        if (item.uploadid)
            me.uploader.uploader.cancelUpload(item.uploadid);

        ctrls.items.dom.removeChild(item.item.dom);
        me.updateLastItemCls();
        me.updateValue();

        me.beginUpload();
    },

    download: function (item) {
        var me = this,
            itemInfo = me.getItemInfo(item),
            params = Ext.apply({}, (me.downloadCfg || {}).params);

        if (!itemInfo.fileid)
            return;

        Ext.apply(params, {
            fileid: itemInfo.fileid,
            _dc: +new Date()
        });

        YZSoft.src.ux.File.download(me.downloadCfg.url, params);
    },

    getValue: function () {
        var me = this,
            ctrls = me.controls;

        return ctrls.dom.input.value;
    },

    setValue: function (value) {
        var me = this,
            ctrls = me.controls;

        value = value || '';
        ctrls.dom.input.value = value || '';

        YZSoft.Ajax.request({
            method: 'POST', //文件超过70个时，GET方法会报GetAttachment.ashx Not Found错误（URL长度限制引起）
            url: YZSoft.$url('YZSoft.Services.REST/Attachment/Assist.ashx'),
            params: { method: 'GetFileInfoFromFileIDs', fileids: value },
            success: function (action) {
                me.deleteAllAttachments();

                Ext.each(action.result.files, function (file) {
                    me.addAttachItem(file);
                });
                me.updateValue();
            },
            failure: function (action) {
                me.updateValue();
                alert(action.result.errorMessage);
            }
        });
    },

    setDisabled: function (disable) {
        var me = this,
            ctrls = me.controls,
            et = me.getEleType(),
            readForm = me.agent.Params.ReadOnly,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        if (readForm) {
            me.addCls(disableCssCls);
            return;
        }

        if (disable)
            me.addCls(disableCssCls);
        else
            me.removeCls(disableCssCls);
    },

    clickOnItems: function (e) {
        var me = this,
            ctrls = me.controls,
            item = e.getTarget(me.itemSelector, ctrls.items, true),
            target;

        if (!item)
            return;

        target = e.getTarget('.del', item, true)
        if (target)
            me.deleteAttachment(target.up(me.itemSelector));

        target = e.getTarget('.link', item, true)
        if (target)
            me.download(item);
    }
});