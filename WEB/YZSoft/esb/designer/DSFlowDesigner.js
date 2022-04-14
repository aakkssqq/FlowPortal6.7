/*
config
designMode, //new,edit
folder,
designMode = edit
flowName
*/

Ext.define('YZSoft.esb.designer.DSFlowDesigner', {
    extend: 'YZSoft.esb.designer.AbstractDesigner',
    bannerHeight: 56,
    serviceUrl: YZSoft.$url('YZSoft.Services.REST/ESB/DSFlow/Admin.ashx'),
    sprites: {
        WebService: RS.$('ESB_SpriteType_WebService'),
        RESTful: RS.$('ESB_SpriteType_RESTful'),
        SAP: {
            text: RS.$('ESB_SpriteType_SAP'),
            sprite: {
                config: {
                    sprites: {
                        icon: {
                            width: 20,
                            height: 10
                        }
                    }
                }
            }
        },
        U8OpenAPI: 'U8 OpenAPI',
        U8EAI: 'U8 EAI',
        K3WISE: RS.$('ESB_SpriteType_K3WISE'),
        KingdeeEAS: RS.$('ESB_SpriteType_KingdeeEAS'),
        SMTP: RS.$('ESB_SpriteType_SMTP'),
        AliSMS: RS.$('ESB_SpriteType_AliSMS'),
        DingTalk: RS.$('ESB_SpriteType_DingTalk'),
        WeChatWork: RS.$('ESB_SpriteType_WeChatWork'),
        WordGenerator: RS.$('ESB_SpriteType_WordGenerator'),
        ExcelGenerator: RS.$('ESB_SpriteType_ExcelGenerator'),
        PdfGenerator: RS.$('ESB_SpriteType_PdfGenerator'),
        SQLServerCommand: RS.$('ESB_SpriteType_SQLServerCommand'),
        SQLServerInsert: RS.$('ESB_SpriteType_SQLServerInsert'),
        SQLServerSelect: RS.$('ESB_SpriteType_SQLServerSelect'),
        SQLServerProcedure: RS.$('ESB_SpriteType_SQLServerProcedure'),
        SQLServerCache: RS.$('ESB_SpriteType_SQLServerCache'),
        OracleCommand: RS.$('ESB_SpriteType_OracleCommand'),
        OracleInsert: RS.$('ESB_SpriteType_OracleInsert'),
        OracleSelect: RS.$('ESB_SpriteType_OracleSelect'),
        OracleProcedure: RS.$('ESB_SpriteType_OracleProcedure'),
        OracleCache: RS.$('ESB_SpriteType_OracleCache'),
        MySQLCommand: RS.$('ESB_SpriteType_MySQLCommand'),
        MySQLInsert: RS.$('ESB_SpriteType_MySQLInsert'),
        MySQLSelect: RS.$('ESB_SpriteType_MySQLSelect'),
        MySQLProcedure: RS.$('ESB_SpriteType_MySQLProcedure'),
        MySQLCache: RS.$('ESB_SpriteType_MySQLCache'),
        Transform: RS.$('ESB_SpriteType_Transform'),
        Each: {
            text: RS.$('ESB_SpriteType_Each'),
            sprite: {
                config: {
                    lineWidth: 0.6,
                    sprites: {
                        icon: {
                            width: 10,
                            height: 10
                        }
                    }
                }
            }
        },
        If: {
            text: RS.$('ESB_SpriteType_If'),
            sprite: {
                config: {
                    lineWidth: 0.6,
                    sprites: {
                        icon: {
                            width: 10,
                            height: 10
                        }
                    }
                }
            }
        },
        EndBlock: {
            text: RS.$('ESB_SpriteType_EndBlock'),
            sprite: {
                config: {
                    lineWidth: 0.6,
                    sprites: {
                        icon: {
                            width: 10,
                            height: 10
                        }
                    }
                }
            }
        }
    },
    newFlowTemplate: {
        Nodes: [{
            Type: 'DSListener',
            Name: 'Listener'
        },{
            Type: 'DSResponse',
            Name: 'Response'
        }]
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            mode = config.designMode,
            flowName = config.flowName || RS.$('ESB_NewFileName'),
            readOnly = config.readOnly,
            sp, cfg;

        me.txtFileName = Ext.create('Ext.toolbar.TextItem', {
            cls: 'yz-esbdesigner-filename',
            text: flowName,
            margin:'0 0 0 10'
        });

        me.btnTesting = Ext.create('Ext.button.Button', {
            text: RS.$('ESB_DSFlow_Testing'),
            glyph: 0xea86,
            //cls: 'yz-btn-submit yz-size-icon-12',
            cls: 'yz-size-icon-12',
            scope: me,
            handler: 'onTestingClick'
        });

        me.btnSave = Ext.create('Ext.button.Button', {
            text: RS.$('All_Save'),
            //glyph: 0xe616,
            margin: '0 8 0 8',
            disabled: readOnly,
            handler: function () {
                if (me.designMode == 'new')
                    me.saveNew(function (flowName) {
                        me.txtFileName.setText(flowName);
                    });
                else
                    me.saveEdit();
            }
        });

        me.btnClose = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            //glyph: 0xe62b,
            handler: function () {
                if (me.btnSave.disabled || !me.isDirty()) {
                    me.close();
                    return;
                }

                Ext.Msg.show({
                    title: RS.$('All_DlgTitle_CloseConfirm'),
                    msg: RS.$('ESB_DirtySavePrompt'),
                    buttons: Ext.Msg.YESNOCANCEL,
                    defaultButton: 'yes',
                    icon: Ext.Msg.INFO,
                    buttonText: {
                        yes: RS.$('All_Save'),
                        no: RS.$('All_NotSave'),
                        cancel: RS.$('All_Cancel')
                    },
                    fn: function (btn, text) {
                        if (btn == 'no') {
                            me.close();
                            return;
                        }

                        if (btn == 'cancel')
                            return;

                        if (me.designMode == 'new') {
                            me.saveNew(function () {
                                me.close();
                            });
                        }
                        else {
                            me.saveEdit(function () {
                                me.close();
                            });
                        }
                    }
                });
            }
        });

        sp = {
            xtype: 'tbseparator',
            cls: 'yz-sp-reportdesigner-tbar'
        };

        me.titlebar = Ext.create('Ext.container.Container', {
            region: 'north',
            height: me.bannerHeight,
            cls: 'yz-border-b',
            style: 'background-color:#fcfcfc;',
            padding: '0 10 0 0',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [me.txtFileName, {
                xtype: 'tbfill'
            }, me.btnTesting, me.btnSave, me.btnClose]
        });

        me.spriteBar = Ext.create('YZSoft.esb.designer.toolbar.SpriteBar', {
            region: 'west',
            width: 225,
            sprites: me.sprites,
            split: {
                size: 5,
                collapseOnDblClick: false,
                collapsible: true
            },
            listeners: {
                dragSprite: function (e, sprite) {
                    me.drawContainer.designPlugin.beginDragDropNewSprite(e, sprite, me.spriteBar, { right: 5 });
                }
            }
        });

        me.drawContainer = Ext.create('YZSoft.esb.designer.DrawContainer', {
            minWidth: 500,
            minHeight: 180
        });

        me.pnlDesignContainer = Ext.create('Ext.container.Container', {
            region: 'north',
            height: 200,
            split: {
                size: 5
            },
            layout: 'fit',
            scrollable: false,
            items: [me.drawContainer]
        });

        me.pnlProperty = Ext.create('YZSoft.esb.designer.property.Panel', {
            region: 'center',
            style: 'background-color:#fff;',
            designer: me
        });

        cfg = {
            layout: 'border',
            items: [
                me.titlebar,
                me.spriteBar,
                {
                    xtype: 'container',
                    region:'center',
                    layout: 'border',
                    items: [
                        me.pnlDesignContainer,
                        me.pnlProperty
                    ]
                }
            ]
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onTestingClick: function () {
        var me = this;

        if (me.designMode == 'new') {
            YZSoft.alert(RS.$('ESB_DSFlow_SaveNewFilePrompt'));
            return;
        }

        if (me.btnSave.disabled || !me.isDirty()) {
            me.doTesting();
            return;
        }

        Ext.Msg.show({
            msg: RS.$('ESB_DirtySavePrompt'),
            buttons: Ext.Msg.YESNOCANCEL,
            defaultButton: 'yes',
            icon: Ext.Msg.INFO,
            buttonText: {
                yes: RS.$('All_Save'),
                no: RS.$('All_NotSave'),
                cancel: RS.$('All_Cancel')
            },
            fn: function (btn, text) {
                if (btn == 'no') {
                    me.doTesting();
                    return;
                }

                if (btn == 'cancel')
                    return;

                me.saveEdit(function () {
                    me.doTesting();
                });
            }
        });
    },

    doTesting: function () {
        var me = this;

        Ext.create('YZSoft.forms.field.dialogs.DataBrowserDlg', {
            autoShow: true,
            ds: {
                DSType: 3,
                ESB: 'ESB:' + me.flowName
            },
            filters: {},
            displayColumns: [],
            mapColumns: [],
            multiSelect: false,
            title: Ext.String.format(RS.$('ESB_DSFlow_Testing_DlgTitle'), me.flowName)
        });
    }
});