
Ext.define('YZSoft.src.menu.ColorPicker', {
    extend: 'Ext.menu.Menu',
    bodyBorder: false,
    bodyStyle: 'background:white; padding:10px; background-image:none',
    showSeparator: false,
    pickerConfig: {
        transparent: false
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.picker = Ext.create('YZSoft.src.picker.Color', Ext.apply({
        }, config.pickerConfig, me.pickerConfig));

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

    setColor: function (color) {
        if (Ext.isObject(color))
            return;

        var color = Ext.draw.Color.create(color);
        color.a = 1;
        color = color.toString();

        this.picker.select(color, true);
    }
});