﻿/*
uid
thumbnail
*/
Ext.define('YZSoft.src.component.Headshort', {
    extend: 'Ext.Component',
    cls: 'yz-cmp-headshort',
    overCls: 'yz-cmp-headshort-over',
    url: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'),
    thumbnail: 'M',
    config: {
        uid: null,
        editable:false,
    },
    renderTpl: [
        '<div class="headshot {editableCls}" id="{id}-backEl" data-ref="backEl" style="position:relative;overflow: hidden;">',
            '<img class="img" id="{id}-imgEl" data-ref="imgEl" style="width:100%;height:100%;" src="{src}" />',
            '<tpl if="editable">',
                '<div class="y-btn" id="{id}-changeEl" data-ref="changeEl" style="position:absolute;left:0px;right:0px;text-align:center">',
                    '{changeText}',
                '</div>',
            '</tpl>',
        '</div>'
    ],
    childEls: [
        'backEl',
        'imgEl',
        'changeEl'
    ],

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            element: 'changeEl',
            click: function () {
                Ext.create('YZSoft.src.dialogs.HeadshotDlg', {
                    autoShow:true,
                    uid: me.getUid(),
                    fn: function () {
                        me.updateUid(me.getUid());
                        me.fireEvent('headshotChanged')
                    }
                });
            }
        });
    },

    initRenderData: function () {
        var me = this;

        return Ext.apply(this.callParent(), {
            src: me.getSrc(me.uid),
            changeText: RS.$('All_ChangeHeadshort'),
            editable: me.getEditable(),
            editableCls: me.getEditable() ? 'editable':''
        });
    },

    getSrc: function (uid) {
        var me = this;

        return Ext.String.urlAppend(this.url, Ext.Object.toQueryString({
            Method: 'GetHeadshot',
            account: uid,
            thumbnail: me.thumbnail,
            _dc:+new Date()
        }))
    },

    updateUid: function (uid) {
        var me = this;

        if (me.rendered) {
            me.imgEl.dom.setAttribute('src', me.getSrc(uid));
        }
    }
});