/*
events:
beforeShowMenu(btn,menu)
picked(color) color-#ff0000
*/
Ext.define('YZSoft.src.button.LinkTypePicker', {
    extend: 'Ext.button.Button',
    cls: 'yz-btn-textbox-style',
    iconCls: '',
    width:53,
    text: '<div class="yz-btn-linktype-wrap" style=""></div>',

    constructor: function (config) {
        var me = this,
            cfg;

        me.menuPicker = Ext.create('YZSoft.src.menu.LinkTypePicker', {
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

                me.menuPicker.setLinkType(me.linkType);
            },
            pickerSelect: function (picker, linkType, record) {
                me.setLinkType(linkType);
                me.fireEvent('picked', linkType, record);
            }
        });
    },

    setLinkType: function (linkType) {
        var me = this,
            url = YZSoft.$url(Ext.String.format('YZSoft/theme/core/ui/component/linktype/{0}.png', linkType));

        me.linkType = linkType;
        me.el.down('.yz-btn-linktype-wrap').setStyle('backgroundImage', Ext.String.format('url({0})', url));
    }
});