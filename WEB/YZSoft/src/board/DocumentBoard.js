/*
folderid
*/
Ext.define('YZSoft.src.board.DocumentBoard', {
    extend: 'Ext.view.View',
    requires: [
        'YZSoft.src.ux.File'
    ],
    scrollable: true,
    padding: '5 14',
    tpl: [
        '<tpl for=".">',
            '<div class="yz-dataview-item-docboard">',
              '<img class="img" src="{src}" />',
              '<div class="body">',
                  '<div class="name"><a class="link" href="#">{Name}</a></div>',
                  '<div class="date">{AddAt}</div>',
              '</div>',
            '</div>',
        '</tpl>'
    ],
    overItemCls: '',
    selectedItemCls: '',
    itemSelector: '.yz-dataview-item-docboard',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'Ext.data.Model',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                extraParams: {
                    method: 'GetFolderDocuments',
                    folderid: config.folderid,
                    top: 6,
                    order: 'ID DESC'
                }
            }
        });

        cfg = {
            store: me.store
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.store.load();
    },

    prepareData: function (data, recordIndex, record) {
        var me = this;
        data.src = YZSoft.src.ux.File.getIconByExt(record.data.Ext, 32);
        return me.callParent(arguments);
    },

    onItemClick: function (record, item, index, e) {
        var me = this,
            targetLike = Ext.get(e.getTarget('.yz-dataview-item-docboard .link'));

        if (targetLike)
            me.onDocClick(record);

        me.callParent(arguments);
    },

    onDocClick: function (record) {
        YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
            method: 'Download',
            fileid: record.data.FileID
        });
    }
});