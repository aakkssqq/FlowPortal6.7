/*
config
arrows
*/
Ext.define('YZSoft.src.picker.StartArrow', {
    extend: 'Ext.view.BoundList',
    cls: ['yz-boundlist-picker', 'yz-size-s', 'yz-boundlist-arrow', 'yz-boundlist-arrow-start'],
    border: false,
    arrows: ['none', 'solidArrow', 'dashedArrow', 'normal', 'solidDiamond', 'dashedDiamond', 'solidCircle', 'dashedCircle', 'cross'],
    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain">',
            '<tpl for=".">',
                '<li role="option" class="x-boundlist-item">',
                    '<div class="body" style="background-image:url({value:this.getUrl});">&nbsp;</div>',
                '</li>',
            '</tpl>',
        '</ul>', {
            getUrl: function (value) {
                return YZSoft.$url(Ext.String.format('YZSoft/theme/core/ui/component/linearrow/{0}.png', value));
            }
        }
    ),

    constructor: function (config) {
        var me = this,
            data = [],
            arrows = config.arrows || me.arrows,
            cfg;

        Ext.each(arrows, function (arrow) {
            data.push({ value: arrow });
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

    getRecordFromArrow: function (arrow) {
        var me = this,
            index;

        index = me.store.findBy(function (rec) {
            if (rec.data.value == arrow)
                return true;
        });

        return index == -1 ? null : me.store.getAt(index);
    }
});