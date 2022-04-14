/*
params:[{
    name:'',
    displayName:'',
    dataType:{
        name,
        fullName
    },
    value
}]
*/

Ext.define('YZSoft.bpm.src.panel.ParamsPanel', {
    extend: 'Ext.panel.Panel',
    cls: 'yz-search-panel',
    bodyPadding: '6 6 2 6',
    itemXClass: 'YZSoft.bpm.src.panel.ParamsItem',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this;

        me.params = config.params;

        var items = [];
        for (var i = 0; i < config.params.length; i++) {
            var param = config.params[i];

            var itemCfg = Ext.apply({
                style: 'padding-bottom:4px',
                param: param,
                searchButtonCfg: {
                    hidden: i != config.params.length-1
                }
            });

            var pnlItem = Ext.create(me.itemXClass, itemCfg);
            me.relayEvents(pnlItem, ['searchClicked'], 'item');

            items.push(pnlItem);
        }

        var cfg = {
            items: items
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            itemSearchClicked: function () {
                var params = me.getParams();
                me.fireEvent('searchClicked', me, params);
            }
        });
    },

    getParams: function () {
        var me = this,
            params = [];

        Ext.each(me.items.items, function (pnlItem) {
            var param = pnlItem.getParam();
            if (param)
                params.push(param);
        });

        return params;
    }
});