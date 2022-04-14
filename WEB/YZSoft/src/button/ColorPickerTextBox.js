/*
events:
beforeShowMenu(btn,menu)
picked(lineWidth)
*/
Ext.define('YZSoft.src.button.ColorPickerTextBox', {
    extend: 'YZSoft.src.button.ColorPicker',
    cls: 'yz-btn-textbox-style',
    iconCls: '',
    text: '<div class="yz-btn-textboxcolor-wrap"><div class="yz-btn-textboxcolor-color" style=""></div></div>',

    setColor: function (color) {
        var me = this;

        me.color = color;
        if (!me.rendered) {
            me.on({
                single: true,
                render: function () {
                    me.el.down('.yz-btn-textboxcolor-color').setStyle('backgroundColor', color);
                }
            });
        }
        else {
            me.el.down('.yz-btn-textboxcolor-color').setStyle('backgroundColor', color);
        }
    }
});