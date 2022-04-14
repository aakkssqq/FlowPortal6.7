
Ext.define('YZSoft.bpm.src.panel.KPI', {
    extend: 'Ext.container.Container',
    cls: 'yz-container-kpi',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    height: 65,
    itemTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">',
            '<div class="yz-kpi-name">{title}</div>',
            '<div class="yz-kpi-value">{value}</div>',
        '</tpl>'
    ),
    titleField: 'title',
    valueField: 'value',
    itemCls:'yz-kpi-meta',

    constructor: function (config) {
        var me = this;

        var cfg = {
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.store.on({
            scope: me,
            load: 'onStoreLoad'
        });
    },

    onStoreLoad: function (store, recs) {
        var me = this,
            items = [];

        Ext.each(recs, function (rec) {
            var item = me.createComponent(rec);
            items.push(item);
        });

        me.removeAll();
        me.add(items);
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