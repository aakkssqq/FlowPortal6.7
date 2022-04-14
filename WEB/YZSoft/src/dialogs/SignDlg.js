/*
    libType
*/

Ext.define('YZSoft.src.dialogs.SignDlg', {
    extend: 'Ext.window.Window', //222222
    requires: [
        'YZSoft.src.component.Cropper'
    ],
    title: RS.$('All_SignDlg_Title'),
    url: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'),
    bodyPadding: '5 26 26 26',
    modal: true,
    resizable: false,

    constructor: function (config) {
        var me = this,
            previewCls = Ext.id(me, 'yz-cssid-'),
            cfg;

        me.btnUpload = Ext.create('Ext.button.Button', {
            text: RS.$('All_Btn_SelectFile')
        });

        me.uploader = Ext.create('YZSoft.src.ux.Uploader', {
            attachTo: me.btnUpload,
            autoStart: true,
            fileSizeLimit: '5 MB',
            fileTypes: RS.$('All_FileType_Image'),
            typesDesc: RS.$('All_FileTypeDesc_Image'),
            listeners: {
                scope: me,
                uploadSuccess: function (file, data) {
                    var me = this,
                        fileid = me.fileid = data.fileid,
                        url;

                    url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                        Method: 'ImageStreamFromFileID',
                        fileid: fileid
                    }));

                    me.cmpCropper.setSrc(url);
                }
            }
        });

        me.cmpCropper = Ext.create('YZSoft.src.component.Cropper', {
            cls: 'yz-cropper-sign',
            emptyText: RS.$('All_HeadshotDlg_Cropper_EmptyText'),
            width: 620,
            height: 368,
            src: '',
            options: {
                aspectRatio: 360 / 160,
                preview: '.' + previewCls
            }
        });

        me.cmpPreview1 = Ext.create('Ext.Component', {
            cls: ['yz-sign-preview', previewCls],
            width: 180,
            height: 80,
            style: 'overflow: hidden'
        });

        me.cmpPreview2 = Ext.create('Ext.Component', {
            cls: ['yz-sign-preview yz-sign-preview-bg', previewCls],
            width: 180,
            height: 80,
            style: 'overflow: hidden'
        });

        me.cmpPreview3 = Ext.create('Ext.Component', {
            cls: ['yz-sign-preview', previewCls],
            width: 120,
            height: 53,
            margin: '20 0 0 0',
            style: 'overflow: hidden;'
        });

        me.cmpPreview4 = Ext.create('Ext.Component', {
            cls: ['yz-sign-preview yz-sign-preview-bg', previewCls],
            width: 120,
            height: 53,
            margin: '20 0 0 0',
            style: 'overflow: hidden;'
        });

        me.btnRotateLeft = Ext.create('Ext.button.Button', {
            text: RS.$('All_HeadshotDlg_RotateLeft'),
            disabled: true,
            glyph:0xeaca,
            tooltip: RS.$('All_HeadshotDlg_RotateLeft90'),
            handler: function () {
                me.cmpCropper.rotate(-90);
            }
        });

        me.btnRotateRight = Ext.create('Ext.button.Button', {
            text: RS.$('All_HeadshotDlg_RotateRight'),
            disabled: true,
            glyph: 0xeac9,
            margin:'0 0 0 10',
            tooltip: RS.$('All_HeadshotDlg_RotateRight90'),
            handler: function () {
                me.cmpCropper.rotate(90);
            }
        });

        me.btnMove = Ext.create('Ext.button.Button', {
            disabled: true,
            glyph: 0xeacb,
            tooltip: RS.$('All_Move'),
            handler: function () {
                me.cmpCropper.setDragMode('move'); //crop
            }
        });

        me.btnZoomIn = Ext.create('Ext.button.Button', {
            disabled: true,
            glyph: 0xeacd,
            margin: '0 0 0 10',
            tooltip: RS.$('All_ZoomIn_Image'),
            handler: function () {
                me.cmpCropper.zoom(0.1);
            }
        });

        me.btnZoomOut = Ext.create('Ext.button.Button', {
            disabled: true,
            glyph: 0xeacc,
            margin: '0 0 0 10',
            tooltip: RS.$('All_ZoomOut_Image'),
            handler: function () {
                me.cmpCropper.zoom(-0.1);
            }
        });

        me.btnReset = Ext.create('Ext.button.Button', {
            disabled: true,
            glyph: 0xe60f,
            margin: '0 0 0 10',
            tooltip: RS.$('All_ResetZoom_Image'),
            handler: function () {
                me.cmpCropper.reset();
            }
        });

        me.btnSave = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_SaveModify'),
            glyph: 0xe616,
            disabled: true,
            margin:'26 0 0 0',
            width:'100%',
            handler: function () {
                var data = me.cmpCropper.getData();

                YZSoft.Ajax.request({
                    async: false,
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/Employee.ashx'),
                    params: Ext.apply({
                        method: 'SaveSign',
                        fileid: me.fileid
                    }, data),
                    success: function (action) {
                        me.closeDialog(true);
                    }
                });
            }
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align:'stretch'
            },
            items: [{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                padding:'0 0 20 0',
                items: [{
                    xtype: 'component',
                    html: RS.$('All_HeadshotDlg_Label_Upload'),
                    margin:'0 30 0 0',
                    style:'font-size:16px;'
                }, me.btnUpload]
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox'
                },
                items: [{
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        align:'stretch'
                    },
                    items: [
                        me.cmpCropper, {
                            xtype: 'container',
                            padding:'26 0 0 0',
                            layout: 'hbox',
                            items: [
                                me.btnRotateLeft,
                                me.btnRotateRight,
                                {xtype:'tbfill'},
                                me.btnMove,
                                me.btnZoomIn,
                                me.btnZoomOut,
                                me.btnReset
                            ]
                        }
                    ]                    
                }, {
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'container',
                        margin: '0 0 0 26',
                        padding: '0 20 22 20',
                        layout: {
                            type: 'vbox'
                        },
                        items: [
                            me.cmpPreview1,
                            me.cmpPreview3
                        ]
                    }, {
                        xtype: 'container',
                        margin:'0 0 0 26',
                        padding: '20',
                        style:'background-color:#f0f0f0;',
                        layout: {
                            type: 'vbox'
                        },
                        items: [
                            me.cmpPreview2,
                            me.cmpPreview4
                        ]
                    }, {
                        xtype: 'container',
                        padding: '0 0 0 26',
                        layout: {
                            type: 'vbox'
                        },
                        items: [
                            me.btnSave
                        ]
                    }]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.cmpCropper.on({
            imageloaded: function () {
                me.btnRotateLeft.setDisabled(false);
                me.btnRotateRight.setDisabled(false);

                me.btnMove.setDisabled(false);
                me.btnZoomIn.setDisabled(false);
                me.btnZoomOut.setDisabled(false);
                me.btnReset.setDisabled(false);

                me.btnSave.setDisabled(false);
            }
        });

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Employee.ashx'),
            params: {
                method: 'HasSign',
                uid: me.uid
            },
            success: function (action) {
                if (action.result) {
                    me.cmpCropper.setSrc(me.getSrc(me.uid));
                }
            }
        });
    },

    getSrc: function (uid) {
        var me = this;

        return Ext.String.urlAppend(this.url, Ext.Object.toQueryString({
            Method: 'GetSignImage',
            account: uid,
            thumbnail: me.thumbnail
        }))
    }
});