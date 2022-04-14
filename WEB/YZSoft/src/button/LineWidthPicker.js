/*
events:
beforeShowMenu(btn,menu)
picked(lineWidth)
*/
Ext.define('YZSoft.src.button.LineWidthPicker', {
    extend: 'Ext.button.Button',
    iconCls: 'yz-glyph yz-glyph-e635',

    constructor: function (config) {
        var me = this;

        me.menuPicker = Ext.create('YZSoft.src.menu.LineWidthPicker', {
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

                me.menuPicker.setLineWidth(me.lineWidth);
            },
            pickerSelect: function (picker, lineWidth, record) {
                me.setLineWidth(lineWidth);
                me.fireEvent('picked', lineWidth, record);
            }
        });
    },

    setLineWidth: function (lineWidth) {
        var me = this;
        me.lineWidth = lineWidth;
    }
});