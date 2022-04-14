
Ext.define('YZSoft.im.social.navigator.SearchPanel', {
    extend: 'Ext.container.Container',
    isSearchResult:true,
    cls: ['yz-im-social-navigator'],

    constructor: function (config) {
        var me = this,
            cfg;

        me.search = Ext.create('YZSoft.src.form.field.Text', {
            cls: 'yz-field-im-search',
            margin: '0px 35px',
            clearIcon: true,
            showClearAlways:true,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER)
                        me.pnlResult.search(me.search.getValue());
                },
                blur: function (field) {
                    //直接发送消息会导致textfield的onBlur中removeCls失败
                    Ext.defer(function () {
                        me.fireEvent('searchBlur', field);
                    }, 10);
                }
            }
        });

        me.pnlSearch = Ext.create('Ext.container.Container', {
            region: 'north',
            height: 100,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'center'
            },
            items: [me.search]
        });

        me.pnlResult = Ext.create('YZSoft.im.social.navigator.view.SearchResult', {
            region: 'center'
        });

        cfg = {
            layout: 'border',
            items: [me.pnlSearch, me.pnlResult]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.pnlResult, ['searchchannelclick', 'userclick', 'messageclick', 'summarymessageclick']);
        me.relayEvents(me.search, ['clearclick']);
    }
});