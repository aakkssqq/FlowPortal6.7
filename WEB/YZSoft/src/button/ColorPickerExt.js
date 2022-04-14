/*
events:
beforeShowMenu(btn,menu)
picked(color) color-#ff0000
*/
Ext.define('YZSoft.src.button.ColorPickerExt', {
    extend: 'YZSoft.src.button.ColorPicker',
    iconAlign: 'top',
    cls:'yz-btn-color',
    text: '<div class="yz-btn-colorpickerext-color"></div>',
    value: 'red',

    constructor: function () {
        this.callParent(arguments);
        this.addCls('yz-btn-colorpickerext');
    },

    onRender: function () {
        this.callParent(arguments);
        this.setColor(this.value);
    },

    //color:#ff0000
    setColor: function (color) {
        var me = this;

        me.color = color;
        me.menuPicker.setColor(color);
        me.el.down('.yz-btn-colorpickerext-color').setStyle('backgroundColor', color);
    }
});