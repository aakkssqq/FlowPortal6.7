/*
config:
drawContainer
fileid
spriteid
*/
Ext.define('YZSoft.bpa.property.UsedBy', {
    extend: 'Ext.container.Container',
    requires: ['YZSoft.bpa.src.model.SpriteLink'],
    referenceHolder: true,
    title: RS.$('BPA__UsedBy'),
    layout: 'border',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            autoload: false,
            model: 'YZSoft.bpa.src.model.SpriteLink',
            groupField: 'LinkedSpriteID',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPA/Library.ashx'),
                extraParams: {
                }
            },
            listeners: {
                sort: 'before',
                load: function (store, records, successful, operation, eOpts) {
                    if (!successful)
                        return;

                    var params = operation.getRequest().getParams(),
                        removeRecs = [];

                    if (params.method == 'GetFileUsedByLinks') {
                        store.each(function (rec) {
                            if (rec.data.LinkedSpriteID == 'process')
                                return;

                            var sprite = me.drawContainer.findSpriteById(rec.data.LinkedSpriteID);

                            if (sprite) {
                                rec.set('LinkedSpriteName', sprite.getSpriteName());
                                rec.commit();
                            }
                            else {
                                removeRecs.push(rec);
                            }
                        });

                        Ext.each(removeRecs, function (rec) {
                            store.remove(rec);
                        });

                        me.featureGrouping.enable();
                    }
                    else {
                        me.featureGrouping.disable();
                    }
                }
            }
        });

        me.featureGrouping = Ext.create('Ext.grid.feature.Grouping', {
            enableNoGroups: true,
            groupHeaderTpl: Ext.create('Ext.XTemplate',
                '{rows:this.getGroupName}', {
                    getGroupName: function (rows) {
                        return Ext.util.Format.text(rows[0].data.LinkedSpriteName || rows[0].data.LinkedSpriteID);
                    }
                })
        });

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            region: 'center',
            store: me.store,
            cls: 'bpa-grid-relatedfile bpa-grid-relatedfile-usedby',
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
                    { text: RS.$('All_File'), dataIndex: 'FileName', flex: 1, scope: me, renderer: me.renderFileName, listeners: { scope: me, click: me.onClickFileName} },
                    { text: RS.$('BPA__SpriteName'), dataIndex: 'SpriteName', flex: 1, formatter: 'text' }
                ]
            },
            listeners: {
                scope: me,
                itemdblclick: 'onItemDblClick'
            }
        }, config.gridConfig));

        cfg = {
            style:'background-color:#f5f5f5',
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
        var me = this,
            fileinfo = drawContainer.fileinfo,
            fileid = fileinfo && fileinfo.fileid;

        if (!fileinfo)
            return;

        if (selection.length == 0) {
            me.store.load({
                params: {
                    method: 'GetFileUsedByLinks',
                    fileid: fileid
                },
                loadMask: false
            });
        }
        else if (selection.length == 1) {
            var sprite = selection[0];

            me.store.load({
                params: {
                    method: 'GetSpriteUsedByLinks',
                    fileid: fileid,
                    spriteid: sprite.getSpriteId()
                },
                loadMask: false
            });
        }
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
            fileid: data.FileID,
            fileName: data.FileName,
            spriteid: data.SpriteID
        });
    }
});