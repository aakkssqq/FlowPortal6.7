
Ext.define('YZSoft.src.menu.LineWidthPicker', {
    extend: 'Ext.menu.Menu',
    bodyBorder: false,
    width: 168,
    showSeparator: false,

    constructor: function (config) {
        var me = this,
            cfg;

        me.picker = Ext.create('YZSoft.src.picker.LineWidth', {
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

    setLineWidth: function (lineWidth) {
        var me = this,
            picker = me.picker,
            sm = me.picker.getSelectionModel(),
            rec;

        rec = picker.getRecordFromLineWidth(lineWidth);
        if (rec)
            sm.select(rec, false, true);
        else
            sm.deselectAll(true);
    }
});