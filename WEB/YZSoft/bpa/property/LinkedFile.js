/*
config:
dlg
*/
Ext.define('YZSoft.bpa.property.LinkedFile', {
    extend: 'Ext.container.Container',
    requires: ['YZSoft.bpa.src.model.SpriteLink'],
    referenceHolder: true,
    title: RS.$('BPA_LinkedFile'),
    layout: 'border',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpa.src.model.SpriteLink',
            groupField: 'SpriteID',
            data: []
        });

        me.featureGrouping = Ext.create('Ext.grid.feature.Grouping', {
            enableNoGroups: true,
            groupHeaderTpl: Ext.create('Ext.XTemplate',
                '{rows:this.getGroupName}', {
                    getGroupName: function (rows) {
                        return Ext.util.Format.text(rows[0].data.SpriteName || rows[0].data.SpriteID);
                    }
                })
        });

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            region: 'center',
            store: me.store,
            cls: 'bpa-grid-relatedfile bpa-grid-relatedfile-linkedfile',
            features: [me.featureGrouping],
            viewConfig: {
                stripeRows: false
            },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { text: RS.$('All_File'), dataIndex: 'LinkedFileName', flex: 1, scope: me, renderer: me.renderFileName, listeners: { scope: me, click: me.onClickFileName} },
                    { text: RS.$('BPA__SpriteName'), dataIndex: 'LinkedSpriteName', flex: 1, formatter: 'text' }
                ]
            },
            listeners: {
                scope: me,
                itemdblclick: 'onItemDblClick'
            }
        }, config.gridConfig));

        cfg = {
            style: 'background-color:#f5f5f5',
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            updateContext: 'onUpdateContext'
        });
    },

    isPageValiable: function (selection) {
        if (selection.length == 0)
            return true;

        if (selection.length == 1 && selection[0].isShape)
            return true;

        return false;
    },

    onUpdateContext: function (drawContainer, selection) {
        var me = this;

        if (selection.length == 0) {
            var links = [],
                cnt = me.drawContainer,
                sprites = cnt.getAllNodes();

            Ext.each(sprites, function (sprite) {
                links = Ext.Array.push(links, me.getSpriteLinks(sprite));
            });

            me.featureGrouping.enable();
            me.store.setData(links);
        }
        else if (selection.length == 1) {
            var sprite = selection[0],
                links = me.getSpriteLinks(selection[0]),
                fn;

            //未render设置disable导致以后调用enable无法启用分组
            fn = function () {
                me.featureGrouping.disable();
                me.store.setData(links);
            }

            if (me.rendered) {
                fn();
            }
            else {
                me.on({
                    single: true,
                    afterrender: function () {
                        fn();
                    }
                });
            }
        }
    },

    getSpriteLinks: function (sprite) {
        var data = sprite.property.data,
            links = [],
            spriteId = sprite.getSpriteId(),
            spriteName = sprite.getSpriteName(),
            relatiedFile = sprite.relatiedFile,
            relatiedFileName = sprite.relatiedFileName || relatiedFile,
            srcs;

        srcs = Ext.Object.findAll(data, function (obj) {
            return obj.isBPAReference;
        });

        if (relatiedFile) {
            links.push({
                LinkedFileID: relatiedFile,
                LinkedFileName: relatiedFileName,
                SpriteID: spriteId,
                SpriteName: spriteName
            });
        }

        Ext.each(srcs, function (src) {
            var link = {
                LinkedFileID: src.FileID,
                LinkedFileName: src.FileName,
                LinkedSpriteID: src.SpriteID,
                LinkedSpriteName: src.SpriteName,
                SpriteID: spriteId,
                SpriteName: spriteName
            }

            links.push(link);
        });

        return links;
    },

    renderFileName: function (value, metaData, record) {
        return Ext.String.format("<a href='#'>{0}</a>", Ext.util.Format.text(value));
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
            fileid: data.LinkedFileID,
            fileName: data.LinkedFileName,
            spriteid: data.LinkedSpriteID
        });
    }
});