/*
value  string/object
       string - fileid
       object - {src:'',value:'',previewSrc:''}
            src - image src
            value - optional, if not specified use src
            previewSrc - optional, if not specified use src
*/
Ext.define('YZSoft.forms.field.ImageAttachment', {
    extend: 'YZSoft.forms.field.Element',
    wrapEleSelector: '.yz-xform-field-wrap',
    optCntEleSelector: '.yz-xform-field-imageattachment-opt-cnt',
    optAddEleSelector: '.yz-xform-field-imageattachment-opt-add',
    optDelEleSelector: '.yz-xform-field-imageattachment-opt-del',
    imageEleSelector: '.yz-xform-field-imageattachment-image',
    emptyImage: Ext.BLANK_IMAGE_URL, //YZSoft.$url('YZSoft/attachment/Img/EmptyImageAttachment.png'),
    download: {
        url: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx')
    },

    constructor: function (agent, dom) {
        var me = this,
            ctrls = me.controls = {};

        me.callParent(arguments);

        ctrls.dom = {
            wrap: me.down(me.wrapEleSelector, true),
            optCnt: me.down(me.optCntEleSelector, true),
            add: me.down(me.optAddEleSelector, true),
            del: me.down(me.optDelEleSelector, true),
            image: me.down(me.imageEleSelector, true)
        };
    },

    onReady: function () {
        var me = this,
            ctrls = me.controls,
            dom = ctrls.dom;

        Ext.apply(ctrls, {
            wrap: Ext.get(dom.wrap),
            optCnt: Ext.get(dom.optCnt),
            del: Ext.get(dom.del),
            image: Ext.get(dom.image)
        });

        ctrls.wrap.on({
            scope: me,
            mouseenter: 'onMouseEnter',
            mouseleave: 'onMouseLeave'
        });

        ctrls.del.on({
            scope: me,
            click: 'onClearClicked'
        });

        if (Ext.os.is.iOS || Ext.os.is.Android) { //ios下使用ExtJS事件机制监听会导致开窗被阻止
            ctrls.image.dom.addEventListener('click', function (e) {
                me.onPreview();
            }, false);
        }
        else {
            ctrls.image.on({
                scope: me,
                click: function (e) {
                    e.stopEvent();
                    me.onPreview();
                }
            });
        }

        me.orgCntSize = {
            width: me.getWidth(),
            height: me.getHeight()
        };

        me.orgImgSize = {
            width: ctrls.wrap.getWidth(true),
            height: ctrls.wrap.getHeight(true)
        };

        if (Ext.supports.Touch) {
            me.onMouseEnter();
        }
    },

    getEleTypeConfig: function () {
        var me = this;

        return {
            sDataBind: me.getDataBind(),
            imageDisplayStyle: me.getAttribute('ImageDisplayStyle'),
            fileTypes: me.getAttribute('FileTypes'),
            typesDesc: me.getAttribute('FileTypesDescription'),
            maximumFileSize: me.getAttribute('MaximumFileSize'),
            Express: me.getExp(),
            DisableExpress: me.getDisableExp(),
            DisableCssClass: me.getAttribute('DisableCssClass'),
            HiddenExpress: me.getHiddenExp()
        };
    },

    getValue: function () {
        return this.value;
    },

    setValue: function (value) {
        var me = this,
            et = me.getEleType(),
            ctrls = me.controls,
            params,
            url,
            previewUrl,
            previewFileId;

        if (!value) {
            url = previewUrl = et.emptyImage || me.emptyImage;
        }
        else if (Ext.isObject(value)) {
            url = value.src || et.emptyImage || me.emptyImage;
            previewUrl = value.previewSrc || url;
            value = value.value || url;
            params = {
                _dc: +new Date()
            };

            url = Ext.String.urlAppend(url, Ext.Object.toQueryString(params));
        }
        else {
            if (et.imageDisplayStyle == 'AutoScale') { //AutoScale 图片缩放，不撑大容器
                params = {
                    Method: 'ImageStreamFromFileID',
                    fileid: value,
                    scale: 'Scale',
                    width: ctrls.wrap.getWidth(true),
                    height: ctrls.wrap.getHeight(true)
                    //_dc: +new Date()
                };

                url = Ext.String.urlAppend(me.download.url, Ext.Object.toQueryString(params));
            }
            else {
                params = {
                    Method: 'ImageStreamFromFileID',
                    fileid: value
                    //_dc: +new Date()
                };

                url = Ext.String.urlAppend(me.download.url, Ext.Object.toQueryString(params));
            }

            previewFileId = value;
        }

        me.value = value;
        me.previewUrl = previewUrl;
        me.previewFileId = previewFileId;

        var img = new Image();
        var imgEl = new Ext.dom.Element(img).on({
            load: function () {
                var size = me.getPicSize(img);
                me.imageSizeChanged(size);
                ctrls.dom.image.src = url;
                delete imgEl;
                delete img;
            },
            error: function () {
                delete imgEl;
                delete img;
                me.setValue('');
            },
            abort: function () {
                delete imgEl;
                delete img;
                me.setValue('');
            }
        });
        img.src = url;
    },

    setDisabled: function (disable) {
        var me = this,
            et = me.getEleType(),
            ctrls = me.controls,
            readForm = me.agent.Params.ReadOnly,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        if (readForm)
            return;

        if (disable)
            me.addCls(disableCssCls);
        else
            me.removeCls(disableCssCls);

        ctrls.dom.image.disabled = disable;
    },

    onUploadSuccess: function (file, data) {
        this.setValue(data.fileid);
        this.agent.fireEvent('inputChange', this);
    },

    getPicSize: function (img) {
        var picsize = img.picsize;
        if (picsize)
            return picsize;

        if (img.natualHeight !== undefined)
            return { width: img.natualWidth, height: img.natualHeight }

        var test = new Image();
        test.src = img.src;
        var width = test.width;
        var height = test.height;
        return { width: width, height: height };
    },

    imageSizeChanged: function (size) {
        var me = this,
            et = me.getEleType(),
            ctrls = me.controls,
            ow = me.orgImgSize.width,
            oh = me.orgImgSize.height;

        if (et.imageDisplayStyle == 'NoScale') {
            if (size.width > ow)
                me.setWidth("auto");
            else
                me.setWidth(me.orgCntSize.width);

            if (size.height > oh)
                me.setHeight("auto");
            else
                me.setHeight(me.orgCntSize.height);
        }
        else {
            var xScale = Math.floor(ow * 100 / size.width),
                yScale = Math.floor(oh * 100 / size.height),
                scale = Math.min(xScale, yScale);

            if (scale >= 100) { //完全包括
                ctrls.image.setWidth('auto');
                ctrls.image.setHeight('auto');
            }
            else { //缩放
                ctrls.image.setWidth(Math.floor(size.width * scale / 100));
                ctrls.image.setHeight(Math.floor(size.height * scale / 100));
            }
        }
    },

    onPreview: function () {
        var me = this,
            value = me.getValue();

        if (!value)
            return;

        Ext.require([
            'YZSoft.src.ux.ImageViewer'
        ], function () {
            YZSoft.src.ux.ImageViewer.preview({
                url: me.previewUrl,
                fileid: me.previewFileId
            });
        });
    },

    onClearClicked: function () {
        this.setValue('');
    },

    onMouseEnter: function () {
        var me = this,
            et = me.getEleType(),
            disableCssCls = et.DisableCssClass || me.defauleDisableCls,
            ctrls = me.controls;

        if (me.hasCls(disableCssCls))
            return;

        Ext.create('Ext.fx.Anim', {
            target: ctrls.optCnt,
            duration: 200,
            from: {
                top: -ctrls.optCnt.getHeight()
            },
            to: {
                top: 0
            },
            callback: function () {
                if (!me.uploader) {
                    me.uploader = Ext.create('YZSoft.src.ux.Uploader', {
                        fileSizeLimit: et.maximumFileSize,
                        fileTypes: et.fileTypes || RS.$('All_FileType_Image'),
                        typesDesc: et.typesDesc || RS.$('All_FileTypeDesc_Image')
                    });

                    me.uploader.on({
                        uploadSuccess: function (file, data) {
                            me.uploadMask.setProgress(100);
                            Ext.defer(function () {
                                me.uploadMask.destroy();
                                me.onUploadSuccess(file, data);
                            }, 120);
                        },
                        fileSelected: function () {
                            me.uploadMask = Ext.create('YZSoft.src.progress.CircleProgressMask', Ext.apply({
                                target: ctrls.wrap,
                                extraCls: 'yz-cic-mask-image',
                                listeners: {
                                    afterrender: function () {
                                        Ext.defer(function () {
                                            me.uploader.uploader.startUpload(me.uploader.lastFile.id);
                                        }, 50);
                                    }
                                }
                            }, me.uploadMaskCfg));

                            me.uploadMask.isElement = false;
                            me.uploadMask.msgWrapEl.center(me.uploadMask);
                            me.uploadMask.show();

                            return false;
                        },
                        uploadFailed: function () {
                            me.uploadMask.destroy();
                        },
                        uploadCancled: function () {
                            me.uploadMask.destroy();
                        },
                        uploadProgress: function (file, complete, total) {
                            me.uploadMask.setProgress(complete * 100 / total);
                        }
                    });

                    me.uploader.attach(ctrls.dom.add);
                }
            }
        });
    },

    onMouseLeave: function (e) {
        var me = this,
            et = me.getEleType(),
            disableCssCls = et.DisableCssClass || me.defauleDisableCls,
            ctrls = me.controls;

        if (me.hasCls(disableCssCls))
            return;

        //slideOut 会最终结果是隐藏，会导致Upload组件失效
        Ext.create('Ext.fx.Anim', {
            target: ctrls.optCnt,
            duration: 200,
            from: {
                top: 0  //starting width 400
            },
            to: {
                top: -ctrls.optCnt.getHeight() // end height 300
            }
        });
    }
});