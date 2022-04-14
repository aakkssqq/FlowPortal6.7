
/*
maskTarget
*/
Ext.define('YZSoft.bpa.admin.group.GroupPanel', {
    extend: 'Ext.container.Container',
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
            groupInfo = config.groupInfo,
            cfg;

        me.pnlMember = Ext.create('YZSoft.bpa.group.MemberPanel', Ext.apply({
            region:'center',
            groupInfo: groupInfo,
            maskTarget: config.maskTarget,
            padding: '10 40 30 40'
        },config.memberPanelConfig));

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
                url: groupInfo.Group.ImageUrl,
                groupid: groupInfo.Group.GroupID,
                name: groupInfo.Group.Name
            }
        });

        me.pnlRight = Ext.create('Ext.container.Container', {
            region: 'east',
            width: 230,
            style: 'border-left:solid 1px #ddd;background-color:white;',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.cmpGroupName]
        });

        cfg = {
            layout: 'border',
            items: [me.pnlMember, me.pnlRight]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getImageUrl: function (data) {
        var me = this;

        if (data.ImageFileID) {
            var params = Ext.apply({
                fileid: data.ImageFileID
            }, me.download.params);

            return Ext.String.urlAppend(me.download.url, Ext.Object.toQueryString(params));
        }
        else
            return me.emptySrc;
    }
});