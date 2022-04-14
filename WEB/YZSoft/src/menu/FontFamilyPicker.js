
Ext.define('YZSoft.src.menu.FontFamilyPicker', {
    extend: 'Ext.menu.Menu',
    bodyBorder: false,
    width: 168,
    showSeparator: false,

    constructor: function (config) {
        var me = this,
            cfg;

        me.picker = Ext.create('YZSoft.src.picker.FontFamily', {
        });
        delete config.items;

        cfg = {
            items: [me.picker]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.picker, ['select'], 'picker');
        me.on({
            scope: me,
            pickerSelect: 'onPickerSelect'
        });
    },

    onPickerSelect: function () {
        Ext.menu.Manager.hideAll();
    },

    getRecordFromFontFamily:function(fontFamily){
        return this.picker.getRecordFromFontFamily(fontFamily);
    },

    setFontFamily: function (fontFamily) {
        var me = this,
            picker = me.picker,
            sm = me.picker.getSelectionModel(),
            rec;

        rec = picker.getRecordFromFontFamily(fontFamily);
        if (rec)
            sm.select(rec, false, true);
        else
            sm.deselectAll(true);
    }
});