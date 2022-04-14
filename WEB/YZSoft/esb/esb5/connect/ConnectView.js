//视图
Ext.syncRequire('YZSoft.src.ux.EmptyText');
Ext.define('YZSoft.esb.esb5.connect.ConnectView', {
    extend: 'Ext.view.View',
    scrollable: true,
    multiSelect: false,
    cls: 'yz-dataview-esb',
    style:'background-color:#fff',
    tpl: [
        '<tpl for=".">',
            '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-esb yz-dataview-item-esb-object">',
                '<div class="inner">',
                    '<img class="img" src="YZSoft/esb/esb5/src/image/source/{connectType}.png">',
                '</div>',
                '<div class="txt">',
                    '{connectName}',
                '</div>',
            '</div>',
        '</tpl>'
    ],
    overItemCls: 'yz-dataview-item-over',
    selectedItemCls: 'yz-dataview-item-selected',
    itemSelector: '.yz-dataview-item-esb',
    txtSelector: '.yz-dataview-item-esb .txt',
    emptyText: YZSoft.src.ux.EmptyText.normal.apply({
        text: RS.$('ESB_EmptyText_ConnectionView')
    }),
    padding: 8
})