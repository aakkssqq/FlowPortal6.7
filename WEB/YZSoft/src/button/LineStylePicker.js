/*
events:
beforeShowMenu(btn,menu)
picked(color) color-#ff0000
*/
Ext.define('YZSoft.src.button.LineStylePicker', {
    extend: 'Ext.button.Button',
    iconCls: 'yz-glyph yz-glyph-e635',

    constructor: function (config) {
        var me = this;

        me.menuPicker = Ext.create('YZSoft.src.menu.LineStylePicker', {
        });

        var cfg = {
            menu: me.menuPicker
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.menuPicker.on({
            beforeshow: function () {
                if (me.fireEvent('beforeShowMenu', me, me.menuPicker) === false)
                    return false;

                me.menuPicker.setLineStyle(me.lineDash);
            },
            pickerSelect: function (picker, lineDash, record) {
                me.setLineStyle(lineDash);
                me.fireEvent('picked', lineDash, record);
            }
        });
    },

    //lineDash:[12,3,3,4] or null
    setLineStyle: function (lineDash) {
        var me = this;
        me.lineDash = lineDash;
    }
});