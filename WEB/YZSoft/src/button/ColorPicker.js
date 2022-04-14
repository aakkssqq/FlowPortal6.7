/*
events:
beforeShowMenu(btn,menu)
picked(color) color-#ff0000
*/
Ext.define('YZSoft.src.button.ColorPicker', {
    extend: 'Ext.button.Button',
    iconCls: 'yz-glyph yz-glyph-e637',

    constructor: function (config) {
        var me = this;

        me.menuPicker = Ext.create('YZSoft.src.menu.ColorPicker', Ext.apply({
        }, config.menuConfig));

        var cfg = {
            menu: me.menuPicker
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.menuPicker.on({
            beforeshow: function () {
                return me.fireEvent('beforeShowMenu', me, me.menuPicker);
            },
            pickerSelect: function (picker, color) {
                me.setColor(color);
                me.fireEvent('picked', color);
            }
        });
    },

    //color:#ff0000
    setColor: function (color) {
        var me = this;

        me.color = color;
        me.menuPicker.setColor(color);
    }
});