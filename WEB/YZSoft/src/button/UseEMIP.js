/*
events:
beforeShowMenu(btn,menu)
picked(color) color-#ff0000
*/
Ext.define('YZSoft.src.button.UseEMIP', {
    extend: 'Ext.button.Button',
    menuAlign: 'tr-br?',
    arrowVisible: false,
    glyph: 0xeaad,

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnl = Ext.create('Ext.Component', {
            tpl: [
                '<div class="d-flex flex-row align-items-start">',
                    '<tpl for="items">',
                        '<div class="d-flex flex-column align-items-center yz-useemip-wrap yz-useemip-{id}-wrap">',
                            '<img class="yz-useemip-barcode" src="{url}"/>',
                            '<div class="yz-useemip-text">{text}</div>',
                        '</div>',
                    '</tpl>',
                '</div>'
            ],
            data: {
                items: [{
                    id:'android',
                    url: YZSoft.$url('YZSoft/theme/core/ui/emip/android_install.gif'),
                    text:RS.$('All_EMIP_InstallAndroid')
                }, {
                    id: 'ios',
                    url: YZSoft.$url('YZSoft/theme/core/ui/emip/ios_install.gif'),
                    text: RS.$('All_EMIP_InstallIOS')
                }, {
                    id: 'emip',
                    url: YZSoft.$url('YZSoft.Services.REST/Util/Barcode.ashx?method=GetEMIPUrl'),
                    text: RS.$('All_EMIP_Login')
                }]
            }
        });

        cfg = {
            menu: {
                shadow: false,
                bodyPadding: 8,
                items: [me.pnl]
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});