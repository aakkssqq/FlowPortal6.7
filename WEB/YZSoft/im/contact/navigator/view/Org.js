
/*
resType
resId
msgId
*/

Ext.define('YZSoft.im.contact.navigator.view.Org', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.im.src.model.OUObject'
    ],
    cls: ['yz-im-social-navigator'],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.im.src.model.OUObject',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
                extraParams: {
                    method: 'GetOUObjects',
                    path: '',
                    role: false
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.store.on({
            load: function (view, records, successful, operation, eOpts) {
                if (!successful)
                    return;

                var metaData = me.store.getProxy().getReader().metaData;
                me.cmpTitle.setData({
                    parents: metaData.parents
                });
            }
        });

        me.cmpTitle = Ext.create('Ext.Component', {
            region: 'north',
            cls:'yz-im-cmp-parentou-navigator',
            tpl: [
                '<div class="">',
                    '<tpl for="parents">',
                        '<tpl if="this.isRender(xcount, xindex)">',
                            '<span class="yz-im-ou {[xindex < xcount ? "yz-im-ou-parent" : "yz-im-ou-cur"]}" index="{[xindex]}">{Name:this.renderString}<span class="yz-sp">&gt;</span></span>',
                        '</tpl>',
                    '</tpl>',
                '</div>', {
                    isRender: function (count, index) {
                        return count - index < 2;
                    },
                    renderString: function (value) {
                        return YZSoft.Render.renderString(value);;
                    }
                }
            ],
            data: {
                parents: [],
            },
            listeners: {
                afterrender: function () {
                    me.cmpTitle.el.on({
                        click: function (e, t, eOpts) {
                            var elParent = Ext.get(e.getTarget('.yz-im-ou-parent')),
                                parents = me.cmpTitle.data.parents,
                                index = elParent && Number(elParent.getAttribute('index')) - 1;

                            if (elParent) {
                                var params = me.store.getProxy().getExtraParams();

                                Ext.apply(params, {
                                    path: parents[index].FullName
                                });

                                me.store.load({
                                    params: {
                                        start: 0
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });

        me.view = Ext.create('Ext.view.View', {
            region:'center',
            store: me.store,
            scrollable: true,
            overItemCls: 'yz-item-over',
            selectedItemCls: 'yz-item-select',
            itemSelector: '.yz-im-list-item-channel',
            deferEmptyText: false,
            emptyText: Ext.String.format('<div class="yz-im-list-emptytext">{0}</div>', RS.$('All_Empty_OU')),
            tpl: [
                '<tpl for=".">',
                '<div class="d-flex flex-row yz-im-list-item-channel yz-im-list-item-channel-singleline yz-im-list-item-{Type}">',
                    '<tpl switch="Type">',
                        '<tpl case="OU">',
                            '<div class="flex-fill yz-column-ouname">',
                                '<div class="title">{data:this.renderOUName}</div>',
                            '</div>',
                        '<tpl case="Member">',
                            '<div class="yz-column-left">',
                                '<div class="type groupimg" style="background-image:url({data:this.renderUserHeadshot})"></div>',
                            '</div>',
                            '<div class="flex-fill yz-column-center">',
                                '<div class="title">{data:this.renderUserName}</div>',
                            '</div>',
                        '<tpl default>',
                            '<div class="type">{Type}</div>',
                    '</tpl>',
                '</div>',
                '</tpl>', {
                    renderOUName: function (data) {
                        return YZSoft.Render.renderString(data.Name);
                    },
                    renderUserName: function (data) {
                        return YZSoft.Render.renderString(data.user.ShortName);
                    },
                    renderUserHeadshot: function (data) {
                        return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                            Method: 'GetHeadshot',
                            account: data.user.Account,
                            thumbnail: 'S'
                        }));
                    }
                }
            ],
            listeners: {
                scope: me,
                itemclick: function (view, record, item, index, e, eOpts) {
                    switch (record.data.Type) {
                        case 'ParentOU':
                            var params = me.store.getProxy().getExtraParams();

                            Ext.apply(params, {
                                path: record.data.data.FullName
                            });

                            me.store.load({
                                params: {
                                    start: 0
                                }
                            });
                            break;
                        case 'OU':
                            var params = me.store.getProxy().getExtraParams();

                            Ext.apply(params, {
                                path: record.data.data.FullName
                            });

                            me.store.load({
                                params: {
                                    start: 0
                                }
                            });
                            break;
                        case 'Member':
                            me.fireEvent('userclick', view, record, item, index, e, eOpts);
                            break;
                    }
                }
            }
        });

        cfg = {
            layout: 'border',
            items: [me.cmpTitle, me.view]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            afterrender: function () {
                me.store.load();
            }
        });
    }
});