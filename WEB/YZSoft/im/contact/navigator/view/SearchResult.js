
Ext.define('YZSoft.im.contact.navigator.view.SearchResult', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.bpm.src.model.User'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.User',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                extraParams: {
                    method: 'SearchUser',
                    kwd: config.kwd
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.view = Ext.create('Ext.view.View', {
            store: me.store,
            overItemCls: 'yz-item-over',
            selectedItemCls: 'yz-item-select',
            itemSelector: '.yz-im-list-item-channel',
            deferEmptyText: false,
            emptyText: Ext.String.format('<div class="yz-im-list-emptytext">{0}</div>', RS.$('All_IM_Empty_SearchResult')),
            tpl: [
                '<tpl for=".">',
                '<div class="d-flex flex-row yz-im-list-item-channel yz-im-list-item-channel-singleline yz-im-list-item-user">',
                    '<div class="yz-column-left">',
                        '<div class="type groupimg" style="background-image:url({headsort})"></div>',
                    '</div>',
                    '<div class="flex-fill yz-column-center">',
                        '<div class="title">{ShortName:this.renderString}</div>',
                    '</div>',
                '</div>',
                '</tpl>', {
                    renderString: function (value) {
                        return YZSoft.Render.renderString(value);
                    }
                }
            ],
            listeners: {
                scope: me,
                itemclick: function (view, record, item, index, e, eOpts) {
                    me.fireEvent('userclick', view, record, item, index, e, eOpts);
                }
            }
        });

        cfg = {
            layout: 'fit',
            items: [me.view]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            render: function () {
                me.store.load({
                    loadMask: false
                });
            }
        });
    },

    search: function (kwd) {
        var me = this,
            kwd = (kwd || '').trim();

        if (!kwd)
            return;

        me.store.load({
            params: {
                kwd: kwd
            },
            loadMask: false
        });
    }
});