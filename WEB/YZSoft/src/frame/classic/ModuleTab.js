
Ext.define('YZSoft.src.frame.classic.ModuleTab', {
    extend: 'YZSoft.src.frame.classic.MainTab',
    xtype: 'yz-tab-module',
    tabBar: {
        height: 40,
        cls: ['yz-tab-default', 'yz-tab-module'],
        layout: {
            pack: 'start'
        }
    },
    border: false,
    plain: true,
    cls: 'yz-tab-panel',
    bodyCls: 'yz-tab-body',
    fixpackendbug: false,

    initComponent: function () {
        this.bannerTpl = '<span class="yz-tab-module-title">{caption}</span>';
        this.bannerData = { caption: this.caption };
        this.callParent(arguments);
    },

    setTitle: function (title) {
        var bannerEl = this.getEl().down('.yz-tab-module-title');
        bannerEl.setHtml(title);
    },

    onAdd: function (item, index) {
        if (item.layout.type != 'card' && !item.preventAddCls) {
            item.addCls('yz-func-panel');
            if (item.addBodyCls)
                item.addBodyCls('yz-func-panel-body');
        }

        this.callParent(arguments);
    }
});