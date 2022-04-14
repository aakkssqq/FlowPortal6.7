/*
convert
*/
Ext.define('YZSoft.im.src.comments.BBS', {
    extend: 'YZSoft.im.src.comments.Abstract',
    cls: 'yz-im-comments yz-im-comments-bbs',

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        me.btnQQFace = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-ea87',
            scope: me,
            handler: 'onFaceClick'
        });

        me.btnLink = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e916',
            scope: me,
            handler: 'onLinkClick'
        });

        me.btnPic = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e915'
        });

        me.uploaderPic = Ext.create('YZSoft.src.ux.Uploader', {
            attachTo: me.btnPic,
            autoStart: true,
            fileSizeLimit: '10 MB',
            fileTypes: RS.$('All_FileType_Image'),
            typesDesc: RS.$('All_FileTypeDesc_Image'),
            listeners: {
                scope: me,
                uploadSuccess: 'onUploadPicSuccess'
            }
        });

        me.btnDoc = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-ea89'
        });

        me.uploaderDoc = Ext.create('YZSoft.src.ux.Uploader', {
            attachTo: me.btnDoc,
            autoStart: true,
            fileSizeLimit: '10 MB',
            fileTypes: '*.*',
            typesDesc: RS.$('All_FileTypeDesc_All'),
            listeners: {
                scope: me,
                uploadSuccess: 'onUploadDocSuccess'
            }
        });

        me.btnTag = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e912'
        });

        me.btnSend = Ext.create('Ext.button.Button', {
            text: RS.$('All_Publish'),
            cls: 'yz-btn-classic-solid-hot  yz-btn-font-14',
            padding:'5 8 5 8',
            margin:0,
            handler: function () {
                var value = me.html2msg(me.getValue());
                
                if (value)
                    me.fireEvent('send', value);
            }
        });

        me.toolBar = Ext.create('Ext.toolbar.Toolbar', {
            cls: 'yz-im-comments-toolbar yz-im-comments-toolbar-bbs',
            height: 35,
            border: false,
            padding:'0 10 0 3',
            defaults: {
                cls:'yz-btn-flat'
            },
            items: [
                me.btnQQFace,
                me.btnLink,
                me.btnPic,
                me.btnDoc,
                me.btnTag,
                '->',
                me.btnSend
            ]
        });

        me.add(me.toolBar);
    }
});