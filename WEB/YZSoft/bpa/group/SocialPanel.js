
/*
config
    groupInfo
*/
Ext.define('YZSoft.bpa.group.SocialPanel', {
    extend: 'Ext.container.Container',
    layout: 'border',
    style: 'background-color:white',
    padding: '0 0 0 40',
    emptySrc: YZSoft.$url('BPA/Styles/ui/group_icon.png'),
    download: {
        url: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'),
        params: {
            Method: 'ImageStreamFromFileID',
            scale: 'Scale',
            width: 161,
            height: 139
        }
    },

    constructor: function (config) {
        var me = this,
            groupInfo = me.groupInfo = config.groupInfo,
            groupid = groupInfo.Group.GroupID,
            perm = groupInfo.Perm,
            cfg, url;

        me.btnRefresh = Ext.create('Ext.button.Button', {
            text: RS.$('All_Refresh'),
            cls:'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-refresh',
            margin: '0',
            style: 'padding-right:0px',
            handler: function () {
                me.pnlSocial.view.store.reload({
                    loadMask: true
                });
            }
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            height: 64,
            padding: '0 64 0 0',
            items: [
                '->',
                me.btnRefresh
            ]
        });

        me.pnlSocial = Ext.create('YZSoft.im.social.bbs.core.BBS', {
            region: 'center',
            border: false,
            scrollable: true,
            padding: '0 64 0 0',
            resType: 'Group',
            resId: groupid,
            viewConfig: {
                autoLoad: false
            }
        });

        //获得图片url
        if (groupInfo.Group.ImageFileID) {
            var params = Ext.apply({
                fileid: groupInfo.Group.ImageFileID
            }, me.download.params);

            url = Ext.String.urlAppend(me.download.url, Ext.Object.toQueryString(params));
        }
        else
            url = me.emptySrc;

        me.cmpGroupName = Ext.create('Ext.Component', {
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                    '<div class="bpa-group-identity">',
                        '<img class="img" src="{url:text}"/>',
                        '<div class="name">{name:text}</div>',
                    '</div>',
                '</tpl>'
            ),
            data: {
                url: url,
                groupid: groupInfo.Group.GroupID,
                name: groupInfo.Group.Name
            }
        });

        me.panelDocumentBoard = Ext.create('YZSoft.src.board.DocumentBoard', {
            folderid: groupInfo.Group.DocumentFolderID
        });

        me.pnlRight = Ext.create('Ext.container.Container', {
            region: 'east',
            width: 230,
            style: 'border-left:solid 1px #ddd;',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.cmpGroupName, {
                xtype: 'panel',
                ui: 'light',
                title: RS.$('BPA__LatestAnnouncement'),
                header: {
                    cls: ['yz-header-bpasubmodule']
                },
                flex: 1,
                layout: 'fit',
                border: false,
                items: [me.panelDocumentBoard]
            }]
        });

        cfg = {
            items: [
                me.pnlRight, {
                    xtype: 'container',
                    region: 'center',
                    layout: 'border',
                    style: 'background-color:white',
                    items: [
                        me.pnlSocial,
                        me.toolbar
                    ]
                }
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            activate: function () {
                me.pnlSocial.view.store.load();
            }
        });

        me.pnlSocial.view.relayEvents(me, ['activate']);
    }
});