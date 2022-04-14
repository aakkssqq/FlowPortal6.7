
Ext.define('YZSoft.im.contact.navigator.Panel', {
    extend: 'Ext.container.Container',
    cls: ['yz-im-social-navigator'],

    constructor: function (config) {
        var me = this,
            cfg;

        me.search = Ext.create('YZSoft.src.form.field.Text', {
            cls: 'yz-field-im-search',
            margin: '0px 35px',
            clearIcon: true,
            listeners: {
                scope:me,
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER)
                        me.onEnter(e);
                },
                clearclick:'onSearchClearClick'
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

        me.pnlOrgTree = Ext.create('YZSoft.im.contact.navigator.view.Org', {
        });

        me.pnlModule = Ext.create('YZSoft.src.container.ModuleContainer', {
            region: 'center',
            layout: 'card',
            cls: 'yz-identity-modulescontainer',
            items: [me.pnlOrgTree]
        });

        cfg = {
            layout: 'border',
            items: [me.pnlSearch, me.pnlModule]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.pnlOrgTree, ['userclick']);
    },

    onEnter: function () {
        var me = this,
            value = me.search.getValue().trim();

        if (!value)
            return;

        if (me.searchPanel && !me.searchPanel.isDestroyed){
            me.searchPanel.search(value);
            return;
        }

        me.searchPanel = me.pnlModule.showModule({
            xclass: 'YZSoft.im.contact.navigator.view.SearchResult',
            config: {
                kwd: value
            },
            match: function (item) {
                return false;
            },
            callback: function (pnl, exist) {
                if (!exist) {
                    me.relayEvents(pnl, ['userclick']);
                }
            }
        });
    },

    onSearchClearClick: function () {
        var me = this;

        if (me.searchPanel && !me.searchPanel.isDestroyed)
            me.pnlModule.closeModule(me.searchPanel, true);
    }
});