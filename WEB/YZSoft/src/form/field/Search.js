/*
*  clearBtn
*  searchBtn  'start'/'end'
*  advBtn
*  searchPanel/createSearchPanel,
*/

Ext.define('YZSoft.src.form.field.Search', {
    extend: 'Ext.form.field.Text',
    emptyText: RS.$('All_SearchKeyword'),
    width: 220,
    cls:'yz-field-search',

    constructor: function (config) {
        var me = this,
            config = config || {},
            clearBtn = me.clearBtn = config.clearBtn !== false,
            advBtn = me.advBtn = (config.searchPanel || config.createSearchPanel) ? true : config.advBtn,
            searchBtn = me.searchBtn = config.searchBtn || (advBtn ? 'start':'end');

        config.triggers = {
            clear: {
                cls: 'yz-trigger-clear',
                width:26,
                hidden: true,
                handler: 'onClearClick',
                scope: me
            },
            search: {
                cls: 'yz-trigger-search',
                width: 26,
                handler: 'onSearchClick',
                scope: me
            },
            advsearch: {
                cls: 'yz-trigger-advsearch',
                width: 28,
                handler: 'onAdvSearchClick',
                scope: me,
                preventMouseDown: false
            }
        };

        if (!clearBtn)
            delete config.triggers.clear;

        if (searchBtn == 'start')
            delete config.triggers.search;

        if (!advBtn)
            delete config.triggers.advsearch;

        me.callParent([config]);

        if (searchBtn == 'start')
            me.addCls('yz-field-search-start');

        if (me.store) {
            me.store.on({
                scope:me,
                load: 'onStoreLoad'
            });
        }
    },

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        me.on('specialkey', function (f, e) {
            if (e.getKey() == e.ENTER) {
                me.onSearchClick();
            }
        });
    },

    onClearClick: function () {
        var me = this;

        if (me.store) {
            var params = me.store.getProxy().getExtraParams();
            delete params.searchType;
            delete params.kwd;
            me.store.loadPage(1);
        }

        me.fireEvent('clearclick');
    },

    onSearchClick: function () {
        var me = this,
            kwd = (me.getValue() || '').trim();

        if (me.store) {
            var params = me.store.getProxy().getExtraParams();
            Ext.apply(params, {
                searchType: 'QuickSearch',
                kwd: kwd
            });
            me.store.loadPage(1);
        }

        me.fireEvent('searchclick');
    },

    onStoreLoad: function (store, records, successful, operation, eOpts) {
        var me = this,
            params;

        if (!successful)
            return;

        params = operation.request.getParams();
        if (params.searchType && params.kwd) {
            me.setValue(params.kwd);
            me.getTrigger('clear').show();
        }
        else {
            me.setValue('');
            me.getTrigger('clear').hide();
        }
    },

    onAdvSearchClick: function () {
        var me = this,
            searchPanel = me.searchPanel,
            createFn = me.createSearchPanel;

        if (!searchPanel) {
            searchPanel = me.searchPanel = me.createSearchPanel({
                target:me.target
            });

            searchPanel.on({
                hide: function () {
                    me.updateStatus();
                }
            });
        }
        else {
            me[searchPanel.isHidden() ? 'showSearchPanel' : 'hideSearchPanel'](searchPanel, me);
        }

        me.updateStatus();
    },

    showSearchPanel: function (searchPanel, searchField) {
        searchPanel.show();
    },

    hideSearchPanel: function (searchPanel, searchField) {
        searchPanel.hide();
    },

    updateStatus: function () {
        var me = this,
            searchPanel = me.searchPanel;

        if (searchPanel)
            me[searchPanel.isHidden() ? 'removeCls' : 'addCls']('yz-field-searchpanel-expanded');
    }
});