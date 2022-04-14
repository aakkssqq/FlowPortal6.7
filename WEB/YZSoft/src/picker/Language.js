/*
config
*/
Ext.define('YZSoft.src.picker.Language', {
    extend: 'Ext.view.BoundList',
    cls: ['yz-boundlist-picker', 'yz-picker-fontfamily'],
    border: false,
    langs: RS.$('All_Languages').split(','),
    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain">',
            '<tpl for=".">',
                '<li role="option" class="x-boundlist-item">',
                    '<div class="body">{name}</div>',
                '</li>',
            '</tpl>',
        '</ul>'
    ),

    constructor: function (config) {
        var me = this,
            data = [],
            langs = config.langs || me.langs;

        Ext.each(langs, function (lang) {
            data.push({ value: lang, name: RS.$('All_Languages_'+lang) });
        });

        var cfg = {
            store: {
                fields: ['value', 'name'],
                data: data
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        var sm = me.getSelectionModel(),
            rec;

        rec = me.getRecordFromLangName(RS.$('All_Languages_Cur'));
        if (rec)
            sm.select(rec, false, true);
    },

    getRecordFromLangName: function (name) {
        var me = this;
        var index = me.store.findBy(function (rec) {
            if (String.Equ(rec.data.name,name))
                return true;
        });

        return index == -1 ? null : me.store.getAt(index);
    },

    onItemClick: function (record) {
        var me = this;

        me.getSelectionModel().select(record, false, true);
        me.fireEvent('select', me, record.data.value, record);
    }
});