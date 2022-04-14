
/*
config
    folderid
    uploader
*/
Ext.define('YZSoft.src.document.Normal', {
    extend: 'YZSoft.src.document.Abstract',
    requires: [
        'YZSoft.src.model.Document'
    ],

    constructor: function (config) {
        var me = this,
            folderid = config.folderid,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            autoLoad: false,
            model: 'YZSoft.src.model.Document',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                extraParams: {
                    method: 'GetFolderDocuments',
                    folderid: folderid,
                    order: 'ID DESC'
                }
            },
            listeners: {
                load: function (store, records, successful, operation, eOpts) {
                    if (successful) {
                        me.folderid = operation.getRequest().getParams().folderid;
                        me.fireEvent('folderChanged', me.folderid);
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

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            region: 'center',
            border: false,
            cls: 'yz-grid-cellalign-vcenter yz-grid-document yz-grid-document-normal',
            selModel: {
                mode: 'MULTI'
            },
            plugins: [me.cellEditing],
            viewConfig: {
                markDirty: false
            },
            columns: {
                defaults: {
                    sortable: false
                },
                items: [
                    { text: RS.$('All_Title'), dataIndex: 'Name', flex: 3, scope: me, renderer: me.renderFileName, editor: { xtype: 'textfield'} },
                    { text: RS.$('All_Creator'), dataIndex: 'CreatorShortName', width: 180, renderer: me.renderCreator },
                    { text: RS.$('All_UploadAt'), dataIndex: 'AddAt', width: 180, formatter: 'date("Y-m-d H:i")' },
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
    },

    startRename: function (record) {
        this.cellEditing.startEdit(record, 0);
    },

    $refresh: function () {
        this.store.reload({
            loadMask: true
        });
    }
});