
Ext.define('YZSoft.src.menu.LineStylePicker', {
    extend: 'Ext.menu.Menu',
    bodyBorder: false,
    showSeparator: false,

    constructor: function (config) {
        var me = this,
            cfg;

        me.picker = Ext.create('YZSoft.src.picker.LineStyle', {
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

    //lineDash:[12,3,3,4] or null
    setLineStyle: function (lineDash) {
        var me = this,
            picker = me.picker,
            sm = me.picker.getSelectionModel(),
            rec;

        rec = picker.getRecordFromLineDash(lineDash);
        if (rec)
            sm.select(rec, false, true);
        else
            sm.deselectAll(true);
    }
});