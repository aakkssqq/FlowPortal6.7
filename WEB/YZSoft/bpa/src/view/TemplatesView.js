
Ext.define('YZSoft.bpa.src.view.TemplatesView', {
    extend: 'Ext.view.View',
    requires: [
        'YZSoft.bpa.src.model.TemplateObject'
    ],
    scrollable: true,
    cls: 'yz-dataview-bpafolder yz-dataview-bpatemplate',
    tpl: [
        '<tpl for=".">',
            '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-bpafile yz-dataview-item-bpafile-file">',
                '<div class="inner">',
                    '<img class="img" src="{url}">',
                '</div>',
                '<div class="txt">',
                    '{DisplayName}',
                '</div>',
            '</div>',
        '</tpl>'
    ],
    overItemCls: 'yz-dataview-item-over',
    selectedItemCls: 'yz-dataview-item-selected',
    itemSelector: '.yz-dataview-item-bpafile',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpa.src.model.TemplateObject',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/OSFileSystem.ashx'),
                extraParams: {
                    Method: 'GetFolderDocuments',
                    root: 'BPAModuleTemplates',
                    excludes: '.png'
                }
            }
        });

        cfg = {
            store: me.store
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.showFolder(config.category);
    },

    showFolder: function (path, config) {
        var me = this;

        me.store.load(Ext.apply({
            loadMask: false,
            params: {
                path: path
            },
            callback: function () {
                me.path = path;
            }
        }, config));
    }
});