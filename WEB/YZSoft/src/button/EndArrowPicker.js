/*
events:
beforeShowMenu(btn,menu)
picked(color) color-#ff0000
*/
Ext.define('YZSoft.src.button.EndArrowPicker', {
    extend: 'Ext.button.Button',
    cls: 'yz-btn-textbox-style',
    iconCls: '',
    width: 63,
    text: '<div class="yz-btn-arrow-wrap yz-btn-arrow-end" style=""></div>',

    constructor: function (config) {
        var me = this,
            cfg;

        me.menuPicker = Ext.create('YZSoft.src.menu.EndArrowPicker', {
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

                me.menuPicker.setArrow(me.arrow);
            },
            pickerSelect: function (picker, arrow, record) {
                me.setArrow(arrow);
                me.fireEvent('picked', arrow, record);
            }
        });
    },

    setArrow: function (arrow) {
        var me = this,
            url = YZSoft.$url(Ext.String.format('YZSoft/theme/core/ui/component/linearrow/{0}.png', arrow));

        me.arrow = arrow;
        me.el.down('.yz-btn-arrow-wrap').setStyle('backgroundImage', Ext.String.format('url({0})', url));
    }
});