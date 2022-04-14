/*
config
*/
Ext.define('YZSoft.src.picker.Select', {
    extend: 'Ext.view.BoundList',
    border: false,
    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain">',
            '<tpl for=".">',
                '<tpl if="sp">',
                    '<div class="yz-boundlist-picker-sp"></div>',
                '</tpl>',
                '<li role="option" class="x-boundlist-item" style="font-family: {value}">',
                    '<div class="body">{text}</div>',
                '</li>',
            '</tpl>',
        '</ul>'
    ),

    constructor: function (config) {
        var me = this,
            data = [],
            items = config.items,
            checkIndex = -1;

        for (var i = 0; i < items.length; i++){
            var item = items[i];
            if (item.checked)
                checkIndex = i;

            data.push(item);
        }

        var cfg = {
            store: {
                fields: ['value', 'text','sp', 'checked'],
                data: data
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.addCls('yz-boundlist-picker');

        if (checkIndex!=-1)
            me.getSelectionModel().select(checkIndex, false, true);
    },

    onItemClick: function (record) {
        var me = this;

        me.getSelectionModel().select(record, false, true);
        me.fireEvent('select', me, record.data.value, record);
    },

    //打开窗体后mouse over，总是定位在上次选中的item上 
    onFocusEnter: function () {
    },

    getRecordFromValue: function (value) {
        var me = this;
        var index = me.store.findBy(function (rec) {
            if (String.Equ(rec.data.value, value))
                return true;
        });

        return index == -1 ? null : me.store.getAt(index);
    }
});