/*
events:
beforeShowMenu(btn,menu)
picked(color) color-#ff0000
*/
Ext.define('YZSoft.src.button.LineStylePickerExt', {
    extend: 'YZSoft.src.button.LineStylePicker',
    cls: 'yz-btn-textbox-style',
    iconCls: '',
    width: 113,
    text: '<div class="yz-btn-linestyle-wrap" style=""></div>',

    //lineDash:[12,3,3,4] or null
    setLineStyle: function (lineDash) {
        var me = this,
            url = YZSoft.$url(Ext.String.format('YZSoft/theme/core/ui/component/linestyle/dash{0}.png', (lineDash || []).join('-')));

        me.lineDash = lineDash;
        me.el.down('.yz-btn-linestyle-wrap').setStyle('backgroundImage',Ext.String.format('url({0})',url));
    }
});