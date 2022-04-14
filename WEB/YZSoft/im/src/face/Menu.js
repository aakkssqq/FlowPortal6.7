
Ext.define('YZSoft.im.src.face.Menu', {
    extend: 'Ext.menu.Menu',
    bodyBorder: false,
    bodyStyle: 'background:white; padding:10px; background-image:none',
    showSeparator: false,

    constructor: function (config) {
        var me = this;

        me.picker = Ext.create('YZSoft.im.src.face.Picker', {
        });

        var cfg = {
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
    }
});