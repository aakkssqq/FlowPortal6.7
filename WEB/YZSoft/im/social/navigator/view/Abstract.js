
Ext.define('YZSoft.im.social.navigator.view.Abstract', {
    extend: 'Ext.container.Container',
    style: 'background-color:transparent',
    requires: [
        'YZSoft.src.ux.GlobalStore',
        'YZSoft.im.src.converts.Converter'
    ],
    renders:{
        renderString: function (value) {
            return YZSoft.Render.renderString(value);
        },
        renderTitle: function (value) {
            return YZSoft.Render.renderString(value.resName) || '&nbsp;';
        },
        renderMessage: function (value) {
            return YZSoft.im.src.converts.Converter.convertLastMessage(value);
        },
        renderMessageSearchResult: function (value) {
            if (value.total != 1)
                return Ext.String.format(RS.$('All_Social_Search_MultiMessage_FMT'), value.total);
            else
                return YZSoft.im.src.converts.Converter.convertLastMessage(value.message);
        },
        renderDate: function (value) {
            return Ext.Date.toFriendlyString(value);
        },
        renderBadge: function (value) {
            return value > 100 ? '···' : value || '';
        },
        renderProcessBackgroundColor: function (ext) {
            return ext.Color;
        },
        renderProcessShortName: function (ext) {
            return YZSoft.Render.renderString(ext.ShortName);
        },
        renderGroupImage: function (ext) {
            if (ext.GroupType == 'Chat') {
                var store = YZSoft.src.ux.GlobalStore.getGroupImageStore(),
                    record = store.getById(ext.ImageFileID) || store.getById('Group99');

                return record.data.imageurl;
            }
            else {
                if (ext.ImageFileID) {
                    return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                        Method: 'ImageStreamFromFileID',
                        scale: 'Scale',
                        width: 161,
                        height: 139,
                        fileid: ext.ImageFileID
                    }));
                }
                else
                    return YZSoft.$url('YZSoft/theme/images/group/Group99.png');
            }
        },
        renderUserName: function (value) {
            return YZSoft.Render.renderString(value.ext.UserShortName || value.uid) || '&nbsp;';
        },
        renderSingleChatPeerHeadshot: function (ext) {
            return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                Method: 'GetHeadshot',
                account: ext.P2PPeerAccount,
                thumbnail: 'S'
            }));
        }
    }
});