
Ext.define('YZSoft.src.menu.Select', {
    extend: 'Ext.menu.Menu',
    bodyBorder: false,
    width: 168,
    minWidth:0,
    showSeparator: false,

    constructor: function (config) {
        var me = this,
            cfg;

        me.picker = Ext.create('YZSoft.src.picker.Select', {
            items:config.items
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

    getRecordFromValue:function(value){
        return this.picker.getRecordFromValue(value);
    },

    setValue: function (value) {
        var me = this,
            picker = me.picker,
            sm = me.picker.getSelectionModel(),
            rec;

        rec = picker.getRecordFromValue(value);
        if (rec)
            sm.select(rec, false, true);
        else
            sm.deselectAll(true);
    }
});