
/*
config
    folderid
    uploader,
    readOnly
*/
Ext.define('YZSoft.src.document.Simple', {
    extend: 'YZSoft.src.document.Abstract',
    requires: [
        'YZSoft.src.model.Document',
        'YZSoft.src.ux.File'
    ],

    constructor: function (config) {
        var me = this,
            folderid = config.folderid,
            readOnly = config.readOnly === true,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            autoLoad: false,
            model: 'YZSoft.src.model.Document',
            pageSize: -1,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                extraParams: {
                    method: 'GetFolderDocuments',
                    folderid: folderid,
                    order: 'ID DESC'
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            border: false,
            hideHeaders: true,
            cls: 'yz-grid-cellalign-vcenter yz-grid-document yz-grid-document-simple yz-grid-actioncol-hidden',
            viewConfig: {
                markDirty: false
            },
            columns: {
                defaults: {
                    sortable: false
                },
                items: [
                    { dataIndex: 'Name', width: 45, scope: me, renderer: me.renderFileType },
                    { dataIndex: 'Name', flex: 1, scope: me, renderer: me.renderFileDesc },
                    {
                        xtype: 'actioncolumn',
                        text: RS.$('All_Delete'),
                        width: 30,
                        hidden: readOnly,
                        align: 'left',
                        items: [{
                            glyph: 0xe62b,
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.deleteDocuments(record);
                            }
                        }]
                    }
                ]
            }
        });

        cfg = {
            layout: 'fit',
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.grid.on({
            scope: me,
            itemclick: 'onItemClick'
        });

        if (folderid)
            me.store.load();
    },

    setFolderID: function (folderid, loadOption, clear) {
        var me = this,
            params = me.store.getProxy().getExtraParams();

        Ext.apply(params, {
            folderid: folderid
        });

        me.folderid = folderid;

        if (clear === true)
            me.store.removeAll();
        else
            me.store.load(loadOption);
    },

    renderFileDesc: function (value, metaData, record) {
        return [
            '<a href="#" class="title">',
                Ext.util.Format.text(value),
            '</a><br/>',
            '<span class="author">',
                Ext.util.Format.text(record.data.CreatorShortName),
            '</span>',
            '<span class="date">',
                Ext.util.Format.date(record.data.LastUpdate, 'Y-m-d'),
            '</span>',
            '<span class="size">',
                Ext.util.Format.fileSize(record.data.Size),
            '</span>'
        ].join('');
    },

    onItemClick: function (grid, record, item, index, e, eOpts) {
        var me = this,
            target = e.getTarget('a') || e.getTarget('img');

        if (target)
            me.download(record);
    }
});