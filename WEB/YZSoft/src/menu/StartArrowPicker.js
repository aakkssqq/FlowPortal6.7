
Ext.define('YZSoft.src.menu.StartArrowPicker', {
    extend: 'Ext.menu.Menu',
    pickerXClass: 'YZSoft.src.picker.StartArrow',
    bodyBorder: false,
    minWidth:0,
    showSeparator: false,

    constructor: function (config) {
        var me = this,
            cfg;

        me.picker = Ext.create(me.pickerXClass, {
        });

        cfg = {
            items: [me.picker]
        };

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

    setArrow: function (arrow) {
        var me = this,
            picker = me.picker,
            sm = me.picker.getSelectionModel(),
            rec;

        rec = picker.getRecordFromArrow(arrow);
        if (rec)
            sm.select(rec, false, true);
        else
            sm.deselectAll(true);
    }
});