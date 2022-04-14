
/*
config
    root,
    path
    uploader
*/
Ext.define('YZSoft.src.document.OSNormal', {
    extend: 'YZSoft.src.document.OSAbstract',
    requires: [
        'YZSoft.src.model.OSDocument'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            autoLoad: false,
            model: 'YZSoft.src.model.OSDocument',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/OSFileSystem.ashx'),
                extraParams: {
                    method: 'GetFolderDocuments',
                    root: config.root,
                    path: config.path
                }
            },
            listeners: {
                load: function (store, records, successful, operation, eOpts) {
                    if (successful) {
                        var params = operation.getRequest().getParams();
                        me.root = params.root;
                        me.path = params.path;
                    }
                }
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', Ext.apply({
            clicksToEdit: false,
            listeners: {
                scope: me,
                validateedit: 'onValidateEdit'
            }
        }, config.cellEditingConfig));

        me.dd = Ext.create('Ext.grid.plugin.DragDrop', {
            dragZone: {
                getDragText: function () {
                    var dragZone = this,
                        data = dragZone.dragData,
                        record = data.records[0];

                    return record.data.Name;
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            region: 'center',
            border: false,
            cls: 'yz-grid-cellalign-vcenter yz-grid-document yz-grid-document-osnormal',
            selModel: {
                mode: 'MULTI'
            },
            plugins: [me.cellEditing],
            viewConfig: {
                markDirty: false,
                plugins: [me.dd]
            },
            columns: {
                defaults: {
                    sortable: false
                },
                items: [
                    { text: RS.$('All_Title'), dataIndex: 'Name', flex: 3, scope: me, renderer: me.renderFileName, editor: { xtype: 'textfield'} },
                    { text: RS.$('All_UpdateDate'), dataIndex: 'LastUpdate', width: 180, formatter: 'date("Y-m-d H:i")' },
                    { text: RS.$('All_FileSize'), dataIndex: 'Size', width: 120, align: 'right', formatter: 'fileSize' },
                    {
                        xtype: 'actioncolumn',
                        text: RS.$('All_Download'),
                        width: 120,
                        align: 'center',
                        items: [{
                            glyph: 0xe923,
                            iconCls: 'yz-action-download',
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.download(record);
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

        me.grid.getView().on({
            scope: me,
            beforedrop: 'onBeforeItemDrop'
        });
    },

    startRename: function (record) {
        this.cellEditing.startEdit(record, 0);
    }
});