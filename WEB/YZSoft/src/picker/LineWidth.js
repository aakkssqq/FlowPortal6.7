/*
config
widths  defaults:[1, 2, 3, 4, 5, 6, 8, 10]
*/
Ext.define('YZSoft.src.picker.LineWidth', {
    extend: 'Ext.view.BoundList',
    cls: ['yz-boundlist-picker', 'yz-size-s', 'yz-boundlist-linewidth'],
    border: false,
    widths: [1, 2, 3, 4, 5, 6, 8, 10],
    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain">',
            '<tpl for=".">',
                '<li role="option" class="x-boundlist-item">',
                    '<div class="body">',
                        '<div class="text">{value}px</div>',
                        '<div class="line" style="height:{value}px"></div>',
                    '</div>',
                '</li>',
            '</tpl>',
        '</ul>'
    ),

    constructor: function (config) {
        var me = this,
            data = [],
            widths = config.widths || me.widths,
            cfg;

        Ext.each(widths, function (width) {
            data.push({ value: width });
        });

        cfg = {
            store: {
                fields: ['value'],
                data: data
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onItemClick: function (record) {
        var me = this;

        me.getSelectionModel().select(record, false, true);
        me.fireEvent('select', me, record.data.value, record);
    },

    //打开窗体后mouse over，总是定位在上次选中的item上 
    onFocusEnter: function () {
    },

    getRecordFromLineWidth: function (lineWidth) {
        var me = this;
        var index = me.store.findBy(function (rec) {
            if (rec.data.value == lineWidth)
                return true;
        });

        return index == -1 ? null : me.store.getAt(index);
    }
});