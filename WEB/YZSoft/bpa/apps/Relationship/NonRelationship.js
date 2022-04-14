
Ext.define('YZSoft.bpa.apps.Relationship.NonRelationship', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.bpa.src.model.SpriteLink'
    ],
    style: 'background-color:white',
    padding: '0 20',

    constructor: function (config) {
        var me = this,
            cfg;

        me.edtFile = Ext.create('YZSoft.bpa.src.form.field.ReportFileField', {
            fieldLabel: RS.$('BPA__Module'),
            width: 400,
            dlg: {
                title: RS.$('BPA_SelModule'),
                libType: 'BPAFile'
            },
            listeners: {
                change: function (field, file) {
                    me.edtSprites.setFileID(file ? file.FileID : null);
                }
            }
        });

        me.edtDir = Ext.create('Ext.button.Segmented', {
            defaults: {
            },
            items: [{
                text: RS.$('BPA_NonRelatited'),
                value: 'RelationshipAppGetNonRelatited'
            }, {
                text: RS.$('BPA_NonUsedBy'),
                pressed: true,
                value: 'RelationshipAppGetNonUsedBy'
            }]
        });

        me.edtSprites = Ext.create('YZSoft.bpa.src.form.field.FileSpritesField', {
            fieldLabel: RS.$('BPA_SpecialSprite')
        });

        me.edtSpecTarget = Ext.create('YZSoft.bpa.src.form.field.FileTypesField', {
            fieldLabel: RS.$('BPA_SpecialFileType')
        });

        me.store = Ext.create('Ext.data.Store', {
            autoLoad: false,
            model: 'YZSoft.bpa.src.model.SpriteLink',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPA/ProcessReports.ashx'),
                extraParams: {
                }
            },
            listeners: {
                load: function (store, records, successful, operation, eOpts) {
                    if (successful)
                        me.labMsg.update(Ext.String.format(RS.$('BPA__TotalItems'), records.length));
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            region: 'center',
            store: me.store,
            border: false,
            columns: {
                defaults: {
                },
                items: [
                    { xtype: 'rownumberer', text: RS.$('All_Index'), width: 60, align: 'center' },
                    { text: RS.$('BPA__Module'), dataIndex: 'FileName', flex: 1 },
                    { text: RS.$('BPA__SpriteName'), dataIndex: 'SpriteName', flex: 1 },
                    { text: RS.$('BPA__RelatiedFileName'), dataIndex: 'RelatiedFileName', flex: 1 },
                    { text: RS.$('All_BPM_BPAActivityLink_PlaceHolder'), dataIndex: 'RelatiedSpriteName', flex: 1 }
                ]
            }
        });

        me.btnSearch = Ext.create('Ext.button.Button', {
            text: RS.$('All_SearchQuery'),
            padding: '7 10',
            cls: 'yz-btn-submit',
            iconCls: 'yz-glyph yz-glyph-search',
            handler: function () {
                var fileid = me.edtFile.getValue();
                if (!fileid)
                    return false;

                me.store.load({
                    params: {
                        method: me.edtDir.getValue(),
                        fileid: fileid,
                        spriteids: Ext.encode(me.edtSprites.getValue()),
                        tagfiletype: Ext.encode(me.edtSpecTarget.getValue())
                    },
                    loadMask: true
                });
            }
        });

        me.btnExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.grid,
            templateExcel: YZSoft.$url(me, 'NonRelationship.xls'),
            params: {},
            fileName: RS.$('BPA_SearchNonRelationship'),
            defaultRadio: 'all',
            radioDisabled: true,
            btnConfig: {
                margin: '0 0 0 5'
            },
            listeners: {
                beforeload: function (params) {
                    params.ReportDate = new Date()
                }
            }
        });

        me.labMsg = Ext.create('Ext.toolbar.TextItem', {
            html: '&nbsp;',
            padding: 0
        });

        me.pnlSearch = Ext.create('Ext.container.Container', {
            region: 'north',
            padding: '20 0 20 10',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'container'
            },
            items: [{
                layout: {
                    type: 'hbox'
                },
                items: [me.edtFile, {
                    xtype: 'fieldcontainer',
                    fieldLabel: RS.$('BPA_RelationshipType'),
                    border: false,
                    padding: '0 0 0 60',
                    items: [me.edtDir]
                }]
            }, {
                padding: '10 0 0 0',
                items: [me.edtSprites]
            }, {
                padding: '5 0 0 0',
                items: [me.edtSpecTarget]
            }, {
                padding: '4 0 0 105',
                layout: {
                    type: 'hbox',
                    align: 'end'
                },
                items: [
                    me.btnSearch,
                    me.btnExport,
                    { xtype: 'tbfill' },
                    me.labMsg
                ]
            }]
        });

        cfg = {
            layout: 'border',
            items: [
                me.pnlSearch,
                me.grid
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});