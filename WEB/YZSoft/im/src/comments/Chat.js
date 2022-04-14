/*
convert
*/
Ext.define('YZSoft.im.src.comments.Chat', {
    extend: 'YZSoft.im.src.comments.Abstract',
    cls: 'yz-im-comments yz-im-comments-chat',

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        me.btnQQFace = Ext.create('Ext.button.Button', {
            glyph:0xea87,
            scope: me,
            handler: 'onFaceClick'
        });

        me.btnPic = Ext.create('Ext.button.Button', {
            glyph: 0xe915
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
            glyph: 0xea89
        });

        me.uploaderDoc = Ext.create('YZSoft.src.ux.Uploader', {
            attachTo: me.btnDoc,
            autoStart: false,
            fileSizeLimit: '1000 MB',
            fileTypes: '*.*',
            typesDesc: RS.$('All_FileTypeDesc_All')
        });

        me.toolBar = Ext.create('Ext.toolbar.Toolbar', {
            cls: ['yz-im-comments-toolbar yz-im-comments-toolbar-chat'],
            height: 36,
            border: false,
            defaults: {
                cls: 'yz-btn-flat'
            },
            items: [
                me.btnQQFace,
                me.btnPic,
                me.btnDoc
            ]
        });

        me.insert(0, me.toolBar);
    },

    onEnter: function (e) {
        var me = this,
            value = me.html2msg(me.getValue());

        e.stopEvent();
        if (value) {
            me.fireEvent('send', value);
            me.setValue('');
        }
    },

    onCtrlEnter: function (e) {
        this.relayCmd('InsertParagraph', false);
    }
});