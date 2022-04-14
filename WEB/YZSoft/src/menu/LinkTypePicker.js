
Ext.define('YZSoft.src.menu.LinkTypePicker', {
    extend: 'Ext.menu.Menu',
    bodyBorder: false,
    minWidth:0,
    showSeparator: false,

    constructor: function (config) {
        var me = this,
            cfg;

        me.picker = Ext.create('YZSoft.src.picker.LinkType', {
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

    setLinkType: function (linkType) {
        var me = this,
            picker = me.picker,
            sm = me.picker.getSelectionModel(),
            rec;

        rec = picker.getRecordFromLinkType(linkType);
        if (rec)
            sm.select(rec, false, true);
        else
            sm.deselectAll(true);
    }
});