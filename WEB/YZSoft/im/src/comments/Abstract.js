/*
convert
*/
Ext.define('YZSoft.im.src.comments.Abstract', {
    extend: 'Ext.form.field.HtmlEditor',
    requires: [
        'YZSoft.im.src.converts.Converter'
    ],
    regxs: [{
        regx: /<img\s[^>]*fileid="([^"]*)"\s[^>]*>/gi,
        replace: '{imageFile:$1}'
    }, {
        regx: /<a\s[^>]*fileid="([^"]*)"\s[^>]*>([^<>]*)<\/a>/gi,
        replace: '{docFile:$1,$2}'
    }, {
        regx: /<img\s[^>]*faceid="([^"]*)"\s[^>]*>/gi,
        replace: '{qqface:$1}'
    }],
    convert: true,

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        me.toolbar.setHidden(true);

        me.on({
            afterrender: function () {
                me.focus(true, true);
                Ext.defer(function () {
                    me.relayCmd('AbsolutePosition', false);
                },100);
            }
        });
    },

    initEditor: function () {
        var me = this,
            doc = me.getDoc(),
            docEl = Ext.get(doc);

        me.callParent(arguments);

        if (docEl) {
            var fn = me.onABC;
            docEl.on({
                scope: me,
                keydown: 'onKeyDown',
                delegated:false
            });
        }
    },

    onKeyDown: function (e) {
        var me = this;

        if (e.getKey() == e.ENTER) {
            e.ctrlKey ? me.onCtrlEnter(e) : me.onEnter(e);
        }
    },

    onEnter: function (e) {
    },

    onCtrlEnter: function (e) {
    },

    html2msg: function (html) {
        var me = this,
            regxs = me.regxs;

        html = html || '';
        Ext.each(regxs, function (regx) {
            html = html.replace(regx.regx, regx.replace);
        });

        return html;
    },

    onFaceClick: function () {
        var me = this;

        if (!me.menuQQFace) {
            me.menuQQFace = Ext.create('YZSoft.im.src.face.Menu', {});

            me.menuQQFace.on({
                pickerSelect: function (faceid) {
                    var url = Ext.String.format(YZSoft.$url('YZSoft/im/resources/faces/{0}.gif'), faceid),
                        html = Ext.String.format('<img class="yz-social-item-qqface" faceid="{0}" src="{1}" />', faceid, url);

                    me.insertAtCursor(html);
                }
            });
        }

        me.menuQQFace.showBy(me.btnQQFace);
    },

    onLinkClick: function () {
        var me = this;

        Ext.create('YZSoft.src.dialogs.UrlDlg', {
            title: RS.$('All_AddHyperlink'),
            autoShow: true,
            fn: function (url) {
                var html = Ext.String.format('<a class="yz-social-item-link" target="_black" href="{0}"/>{0}</a>', url);
                me.insertAtCursor(html);
            }
        });
    },

    onUploadPicSuccess: function (file, data) {
        var me = this,
            fileid = data.fileid,
            url, html;

        url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'ImageStreamFromFileID',
            scale: 'Scale',
            width: 180,
            height: 200,
            fileid: fileid
        }));

        html = Ext.String.format('<img class="yz-social-item-img" fileid="{0}" src="{1}" />', fileid, url);
        me.insertAtCursor(html);
    },

    onUploadDocSuccess: function (file, data) {
        var me = this,
            fileid = data.fileid,
            url, html;

        url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'Download',
            fileid: fileid
        }));

        html = Ext.String.format('<a class="yz-social-item-doc" fileid="{1}" href="{0}"/>{2}</a>', url, fileid, file.name);
        me.insertAtCursor(html);
    }
});