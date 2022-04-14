/*
config
families  defaults:[1, 2, 3, 4, 5, 6, 8, 10]
localFamilies
*/
Ext.define('YZSoft.src.picker.FontFamily', {
    extend: 'Ext.view.BoundList',
    cls: ['yz-boundlist-picker', 'yz-size-s', 'yz-boundlist-fontfamily'],
    border: false,
    families: ['Sans-Serif', 'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Impact', 'Comic Sans MS', 'Tahoma', 'Garamond', 'Lucida Console'],
    localFamilies: RS.$('All_LocalFontFamily').split(','),
    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain">',
            '<tpl for=".">',
                '<tpl if="sp">',
                    '<div class="sp"></div>',
                '</tpl>',
                '<li role="option" class="x-boundlist-item" style="font-family: {value}">',
                    '<div class="body">{value}</div>',
                '</li>',
            '</tpl>',
        '</ul>'
    ),

    constructor: function (config) {
        var me = this,
            data = [],
            families = config.families || me.families,
            localFamilies = config.localFamilies || me.localFamilies,
            first,cfg;

        Ext.each(families, function (family) {
            data.push({ value: family });
        });

        first = true;
        Ext.each(localFamilies, function (family) {
            data.push({ value: family, sp: first });
            first = false;
        });

        cfg = {
            store: {
                fields: ['value','sp'],
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

    getRecordFromFontFamily: function (fontFamily) {
        var me = this,
            index;

        index = me.store.findBy(function (rec) {
            if (String.Equ(rec.data.value,fontFamily))
                return true;
        });

        return index == -1 ? null : me.store.getAt(index);
    }
});