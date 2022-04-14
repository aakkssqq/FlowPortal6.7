/*
reportPanel
*/

Ext.define('YZSoft.report.search.Panel', {
    extend: 'YZSoft.src.designer.layout.Flow',
    defaults: {
        padding: '0 10 5 10'
    },
    style: 'background-color:#eee',

    privates: {
        prepareItems: function (items, applyDefaults) {
            var me = this,
                items = Ext.isArray(items) ? items : [items],
                rv = [], part;

            Ext.each(items, function (item) {
                if (!item.isActionWrap) {
                    item = Ext.create('Ext.container.Container', {
                        layout: 'fit',
                        items: [item]
                    });
                }

                rv.push(item);
            });

            return me.callParent([rv, applyDefaults]);
        }
    },

    initComponent: function () {
        var me = this;

        me.btnSearch = Ext.create('Ext.button.Button', {
            text: RS.$('All_Search'),
            cls: 'yz-btn-submit yz-btn-round3',
            glyph: 0xeada,
            padding: '6 20 6 16',
            handler: function () {
                me.doSearch();
            }
        });

        me.btnReset = Ext.create('Ext.button.Button', {
            text: RS.$('All_Reset'),
            cls: 'yz-btn-round3',
            margin: '0 0 0 6',
            handler: function () {
                me.doReset();
            }
        });

        me.wrap = Ext.create('Ext.container.Container', {
            isActionWrap: true,
            liquidLayout: true,
            height: 62,
            defaults: {
                padding: '6 20'
            },
            padding: '26 10 0 10',
            items: [me.btnSearch, me.btnReset]
        });

        me.items.push(me.wrap);

        me.padding = '8 10 12 10';
        me.callParent(arguments);

        me.reportPanel.searchPanels = me.reportPanel.searchPanels || [];
        me.reportPanel.searchPanels.push(me);
    },

    getFieldBindDSs: function (searchfield) {
        var me = this,
            paramNames = searchfield.getParamNames(),
            allds = me.reportPanel.ds,
            rv = [];

        Ext.each(paramNames, function (paramName) {
            paramName = Ext.String.trim(paramName);

            Ext.Object.each(allds, function (dsid, ds) {
                if (Ext.Array.contains(ds.define.paramNames, paramName))
                    rv.push(ds);
            });
        });

        return rv;
    },

    getFieldBindStores: function (searchfield) {
        var me = this,
            dss = me.getFieldBindDSs(searchfield),
            rv = [];

        Ext.each(dss, function (ds) {
            rv.push(ds.store);
        });

        return rv;
    },

    getFiltersByNames: function (filters, names) {
        var me = this,
            rv = [];

        Ext.each(filters, function (filter) {
            if (Ext.Array.contains(names, filter.name))
                rv.push(filter);
        });

        return rv;
    },

    eachField: function (fn) {
        var me = this,
            reportPanel = me.reportPanel,
            searchfield;

        me.items.each(function (fidlecontainer) {
            if (fidlecontainer.isActionWrap)
                return;

            searchfield = fidlecontainer.items.getAt(0);
            return fn(searchfield);
        });
    },

    getUpdatedStore: function () {
        var me = this,
            rv = [],
            stores;

        me.eachField(function (searchfield) {
            stores = me.getFieldBindStores(searchfield);
            rv = Ext.Array.union(rv, stores);
        });

        return rv;
    },

    doSearch: function () {
        var me = this,
            updatedStores = me.getUpdatedStore(),
            filters,dss;

        Ext.each(updatedStores, function (store) {
            store.bindSearch = true;
            store.resetDsFilters();
        });

        me.eachField(function (searchField) {
            dss = me.getFieldBindDSs(searchField);
            Ext.each(dss, function (ds) {
                filters = searchField.getDSFilters();
                filters = me.getFiltersByNames(filters, ds.define.paramNames);
                ds.store.mergeDsFilters(filters);
            });
        });

        Ext.Array.each(updatedStores, function (store) {
            store.loadPage(1, {
                loadMask: {
                    msg: RS.$('All_Report_Loading'),
                    target: me.reportPanel,
                    start: 0,
                    stay: 300
                }
            });
        });
    },

    doReset: function () {
        var me = this;

        me.eachField(function (searchField) {
            searchField.setValue(searchField.defaultValue || null);
        });

        me.doSearch();
    }
});