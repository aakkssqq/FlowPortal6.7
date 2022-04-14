/*
events:
beforeShowMenu(btn,menu)
picked(lineWidth)
*/
Ext.define('YZSoft.src.button.LineWidthPickerExt', {
    extend: 'YZSoft.src.button.LineWidthPicker',
    cls: 'yz-btn-textbox-style',
    iconCls: '',
    width: 119,
    text: '<div class="d-flex d-flex align-items-center yz-btn-linewidth-wrap"><div class="text">1</div><div class="flex-fill line" style=""></div></div>',

    setLineWidth: function (lineWidth) {
        var me = this;

        me.lineWidth = lineWidth;
        me.el.down('.text').setHtml(lineWidth);
        me.el.down('.line').setStyle('height', lineWidth + 'px');
    }
});