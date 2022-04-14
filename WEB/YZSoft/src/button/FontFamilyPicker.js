/*
events:
beforeShowMenu(btn,menu)
picked(fontFamily)
*/
Ext.define('YZSoft.src.button.FontFamilyPicker', {
    extend: 'Ext.button.Button',
    iconCls: 'yz-glyph yz-glyph-e63a',

    constructor: function (config) {
        var me = this,
            cfg;

        me.menuPicker = Ext.create('YZSoft.src.menu.FontFamilyPicker', {
        });

        cfg = {
            menu: me.menuPicker
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.menuPicker.on({
            beforeshow: function () {
                if (me.fireEvent('beforeShowMenu', me, me.menuPicker) === false)
                    return false;

                me.menuPicker.setFontFamily(me.fontFamily);
            },
            pickerSelect: function (picker, fontFamily, record) {
                me.setFontFamily(fontFamily);
                me.fireEvent('picked', fontFamily, record);
            }
        });
    },

    afterRender: function () {
        this.setFontFamily('Sans-Serif');
        this.callParent(arguments);
    },

    setFontFamily: function (fontFamily) {
        var me = this,
            rec = me.menuPicker.getRecordFromFontFamily(fontFamily);

        if (rec)
            fontFamily = rec.data.value;

        if (fontFamily && me.fontFamily != fontFamily) {
            me.fontFamily = fontFamily;
            me.el.down('.x-btn-inner').setStyle('fontFamily', fontFamily)
            me.setText(fontFamily);
        }
    }
});