/*
config:
fileid
spriteid
*/
Ext.define('YZSoft.bpa.sprite.PropertyPages.UsedBy', {
    extend: 'Ext.form.Panel',
    requires: ['YZSoft.bpa.src.model.SpriteLink'],
    referenceHolder: true,
    title: RS.$('BPA__UsedBy'),
    layout: 'border',

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            autoload: false,
            model: 'YZSoft.bpa.src.model.SpriteLink',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPA/Library.ashx'),
                extraParams: {
                    method: 'GetSpriteUsedByLinks',
                    fileid: config.fileid,
                    spriteid: config.spriteid
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            region: 'center',
            store: me.store,
            border: true,
            viewConfig: {
                stripeRows: false,
                selectedItemCls: 'yz-grid-item-select-flat'
            },
            columns: {
                items: [
                    { text: RS.$('All_File'), dataIndex: 'FileName', flex: 1, scope: me, renderer: me.renderFileName, listeners: { scope: me, click: me.onClickFileName} },
                    { text: RS.$('BPA__SpriteName'), dataIndex: 'SpriteName', flex: 1, renderer: YZSoft.Render.renderString }
                ]
            },
            listeners: {
                scope: me,
                itemdblclick: 'onItemDblClick'
            }
        });

        var cfg = {
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    afterRender: function () {
        var me = this;

        me.store.load({
            loadMask: false
        });

        me.callParent(arguments);
    },

    renderFileName: function (value, metaData, record) {
        return Ext.String.format("<a href='#'>{0}</a>", YZSoft.HttpUtility.htmlEncode(value));
    },

    onItemDblClick: function (grid, record, item, index, e, eOpts) {
        this.onFileClick(record);
    },

    onClickFileName: function (view, cell, recordIndex, cellIndex, e) {
        if (e.getTarget().tagName == 'A')
            this.onFileClick(this.store.getAt(recordIndex));
    },

    onFileClick: function (rec) {
        var me = this,
            data = rec.data;

        me.fireEvent('fileClick', {
            fileid: data.FileID,
            fileName: data.FileName,
            spriteid: data.SpriteID
        });
    },

    updateStatus: function () {
    }
});