/*
params:[{
    name:'',
    displayName:'',
    dataType:{
        name,
        fullName
    }
}]
*/

Ext.define('YZSoft.bpm.src.panel.ExtSearchPanel', {
    extend: 'Ext.panel.Panel',
    cls: 'yz-search-panel',
    bodyPadding: '6 0 2 0',
    itemXClass:'YZSoft.bpm.src.panel.ExtSearchItem',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this;

        me.params = config.params;

        var cfg = {
            items: [me.createItem({ selectFirstItem: config.selectFirstItem })]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.notifyIndexChanged();

        me.on({
            scope: me,
            itemAddClicked: function () {
                me.add(me.createItem({}));
                me.notifyIndexChanged();
            },
            itemRemoveClicked: function (pnlItem) {
                if (me.items.items.length == 1 && me.items.items[0] == pnlItem) {
                    pnlItem.reset();
                }
                else {
                    me.remove(pnlItem, true);
                    me.notifyIndexChanged();
                }
            },
            itemSearchClicked: function () {
                var params = me.getParams();
                me.fireEvent('searchClicked', me, params);
            }
        });
    },

    notifyIndexChanged: function () {
        var me = this,
            i = 0,
            len = me.items.items.length;


        Ext.each(me.items.items, function (pnlItem) {
            pnlItem.fireEvent('indexChanged', i, len);
            i++;
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
    },

    createItem: function (config) {
        var me = this;

        config = Ext.apply({
            style: 'padding-bottom:4px',
            params: me.params
        }, config);

        var pnlItem = Ext.create(me.itemXClass, config);
        me.relayEvents(pnlItem, ['addClicked', 'removeClicked', 'searchClicked'], 'item');

        return pnlItem;
    }
});