/*
config
dashs default:[[],[3,3],[7,7],[12,3,3,3]]
*/
Ext.define('YZSoft.src.picker.LineStyle', {
    extend: 'Ext.view.BoundList',
    cls: ['yz-boundlist-picker', 'yz-size-s', 'yz-boundlist-linestyle'],
    border: false,
    dashs:[[],[3,3],[7,7],[12,3,3,3]],
    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
            '<li role="option" class="x-boundlist-item">',
                '<div class="body" style="background-image:url({value:this.getUrl});">&nbsp;</div>',
            '</li>',
        '</tpl>',
        '</ul>', {
            getUrl: function (value) {
                return YZSoft.$url(Ext.String.format('YZSoft/theme/core/ui/component/linestyle/dash{0}.png', (value || []).join('-')));
            }
        }
    ),

    constructor: function (config) {
        var me = this,
            data = [],
            dashs = config.dashs || me.dashs,
            cfg;

        Ext.each(dashs, function (dash) {
            data.push({ value: dash });
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

    getRecordFromLineDash: function (lineDash) {
        var me = this,
            lineDash = lineDash || [],
            index;

        index = me.store.findBy(function (rec) {
            if (rec.data.value.join(',') == lineDash.join(','))
                return true;
        });

        return index == -1 ? null : me.store.getAt(index);
    }
});