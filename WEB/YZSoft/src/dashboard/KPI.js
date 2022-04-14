
Ext.define('YZSoft.src.dashboard.KPI', {
    extend: 'Ext.container.Container',
    style:'background-color:#fff',
    layout: 'hbox',
    itemTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">',
            '<div class="value">{value}</div>',
            '<div class="name">{title}</div>',
        '</tpl>'
    ),
    titleField: 'title',
    valueField: 'value',
    itemCls: 'yz-chart-kpi',

    constructor: function (config) {
        var me = this;

        var cfg = {
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.store = Ext.data.StoreManager.lookup(me.store || 'ext-empty-store');

        me.store.on({
            scope: me,
            datachanged: 'doUpdate'
        });

        if (me.store.isLoaded())
            me.doUpdate();
    },

    doUpdate: function () {
        var me = this,
            recs = me.store.getData().items,
            len = recs.length,
            items = [];

        for (var i = 0; i < recs.length; i++) {
            var rec = recs[i],
                item = me.createComponent(rec);

            if (i == 0)
                item.addCls('yz-chart-kpi-first');
            if (i == len - 1)
                item.addCls('yz-chart-kpi-last');

            items.push(item);
        }

        Ext.suspendLayouts();
        me.removeAll();
        me.add(items);
        Ext.resumeLayouts(true);
    },

    createComponent: function (rec) {
        var me = this,
            renderData;

        renderData = Ext.apply({
            title: rec.data[me.titleField],
            value: rec.data[me.valueField]
        });

        return Ext.create('Ext.Component', {
            flex: 1,
            cls: me.itemCls,
            tpl: me.itemTpl,
            data: renderData
        });
    }
});