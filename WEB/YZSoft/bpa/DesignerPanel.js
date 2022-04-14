/*
config
readOnly,
designMode,
groupInfo
*/
Ext.define('YZSoft.bpa.DesignerPanel', {
    extend: 'YZSoft.bpa.DesignerPanelBase',
    requires: [
        'YZSoft.src.ux.File',
        'YZSoft.bpa.Categories'
    ],
    layout: 'border',
    increaseStep: {
        x: 10,
        y: 10
    },
    linkCfg: {
        lineWidth: 2,
        strokeStyle: '#323232',
        gaps: {
            ext: 28,
            offset: 28
        }
    },
    categories: [], //General,FlowChart,BPMN,EVC,EPC,ORG,Product,Data,ITSystem,KPI,Risk,Regulation,Lane,UML,Testing
    flag: false,
    border: false,
    referenceHolder: true,
    btnCloseOnMDIHeaderConfig: {
        hidden: true
    },
    CTRLSSave: true,

    constructor: function (config) {
        var me = this,
            config = config || {},
            categories = config.categories || me.categories,
            toolPanelConfig = config.toolPanelConfig || me.toolPanelConfig,
            tabMainConfig = config.tabMainConfig || me.tabMainConfig,
            tabbarMainConfig = config.tabbarMainConfig || me.tabbarMainConfig,
            headerBarConfig = config.headerBarConfig || me.headerBarConfig,
            btnCloseOnMDIHeaderConfig = config.btnCloseOnMDIHeaderConfig || me.btnCloseOnMDIHeaderConfig,
            cfg;

        //顶部panel
        me.btnSave = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-save',
            tooltip: RS.$('All_Save'),
            cls: 'yz-designer-header-btn',
            disabled: config.readOnly,
            handler: function () {
                me.save(me.getActiveDrawContainer());
            }
        });

        me.btnUndo = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e908',
            tooltip: RS.$('All_Undo'),
            cls: 'yz-designer-header-btn',
            disabled: config.readOnly,
            handler: function () {
                me.getActiveDrawContainer().undo();
            }
        });

        me.btnRedo = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e906',
            tooltip: RS.$('All_Redo'),
            cls: 'yz-designer-header-btn',
            disabled: config.readOnly,
            handler: function () {
                me.getActiveDrawContainer().redo();
            }
        });

        me.headshort = Ext.create('YZSoft.bpa.src.toolbar.items.Headshort', {
            margin: '0 0 0 4'
        });

        me.btnUser = Ext.create('YZSoft.bpa.src.toolbar.items.Account', {
            cls: 'yz-designer-header-btn',
            height: 53,
            margin: '0 10 0 10',
            menu: {
                shadow: true
            }
        });

        me.btnClose = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-close',
            tooltip: RS.$('All_Close'),
            cls: 'yz-designer-header-btn',
            handler: function () {
                var dcnt = me.getActiveDrawContainer(),
                    undoManager = dcnt.undoManager;

                if (!dcnt.topContainer.writable || !undoManager.getDirty()) {
                    me.close();
                    return;
                }

                Ext.Msg.show({
                    title: RS.$('All_DlgTitle_CloseConfirm'),
                    msg: RS.$('BPA_ProcessDesigner_Close_Confirm'),
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

                        me.save(dcnt, function () {
                            me.close();
                        });
                    }
                });
            }
        });

        me.caption = Ext.create('Ext.toolbar.TextItem', {
            cls: 'title'
        });

        me.tabbarMain = Ext.create('Ext.tab.Bar', Ext.apply({
            cls: 'yz-designer-tab-bar-main'
        }, tabbarMainConfig));

        me.headerBar = Ext.create('Ext.container.Container', Ext.apply({
            region: 'north',
            cls: 'yz-designer-header',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
                flex: 1,
                layout: 'vbox',
                items: [{
                    xtype: 'container',
                    cls: 'savepanel',
                    layout: {
                        type: 'hbox'
                    },
                    items: [me.btnSave, me.btnUndo, me.btnRedo]
                }, me.tabbarMain]
            }, me.caption, {
                flex: 1,
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'end',
                    align: 'middle'
                },
                items: [me.headshort, me.btnUser, me.btnClose]
            }]
        }, headerBarConfig));

        //MDI header
        me.tabbarMDI = Ext.create('Ext.tab.Bar', {
            border: false,
            cls: 'yz-designer-tab-bar-mdi',
            style: 'background-color:#c9c9ca;',
            padding: '3 0 0 3',
            flex: 1
        });

        me.tabMDI = Ext.create('YZSoft.src.tab.Panel', {
            region: 'center',
            bodyStyle: 'border-width:0px',
            tabBar: me.tabbarMDI,
            items: [],
            listeners: {
                tabchange: function (tabPanel, newCard, oldCard, eOpts) {
                    if (oldCard)
                        oldCard.lastCategories = Ext.Array.clone(me.spriteBar.categories);

                    if (newCard && newCard.lastCategories)
                        me.spriteBar.setCategories(newCard.lastCategories);

                    me.caption.setText(newCard.drawContainer.fileinfo ? newCard.drawContainer.fileinfo.processName : newCard.getTitle());
                    me.applyWriteable(newCard.writable);

                    me.btnShowExtension.setText(newCard.drawContainer.showExtension ? RS.$('BPA_HideProperty') : RS.$('BPA_ShowProperty'));
                    if (newCard.drawContainer.showExtension) { //要显示的属性可能已变
                        var surface = newCard.drawContainer.getSurface('shape');

                        surface.setDirty(true);
                        surface.renderFrame();
                    }

                    me.updateStatus();
                    me.updatePasteStatus();
                }
            }
        });

        me.btnCloseOnMDIHeader = Ext.create('Ext.button.Button', Ext.apply({
            iconCls: 'yz-glyph yz-glyph-close',
            tooltip: RS.$('All_Close'),
            padding: '0 10',
            handler: function () {
                me.close();
            }
        }, btnCloseOnMDIHeaderConfig));

        me.pnlMDIHeader = Ext.create('Ext.container.Container', {
            region: 'north',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [me.tabbarMDI, me.btnCloseOnMDIHeader],
            style: 'background-color:#000'
        });

        me.pnlMDIWrap = Ext.create('Ext.container.Container', {
            region: 'center',
            layout: 'border',
            items: [me.pnlMDIHeader, me.tabMDI]
        });

        me.spriteBar = Ext.create('YZSoft.bpa.src.toolbar.SpriteBar', {
            border: false,
            categories: categories,
            flex: 1,
            listeners: {
                dragSprite: function (e, sprite) {
                    me.getActiveDrawContainer().designPlugin.beginDragDropNewSprite(e, sprite, me.toolPanel, { right: 5 });
                }
            }
        });

        me.btnCategories = Ext.create('Ext.button.Button', {
            text: RS.$('BPA_MoreShape'),
            ui: 'default-toolbar',
            padding: 4,
            handler: function () {
                Ext.create('YZSoft.bpa.src.dialogs.SelCategoriesDlg', {
                    autoShow: true,
                    categroies: YZSoft.bpa.Categories.getCategoriesTree(me.allCategories || YZSoft.bpa.Categories.all),
                    selection: me.spriteBar.categories,
                    fn: function (categories) {
                        me.spriteBar.setCategories(categories);
                    }
                });
            }
        });

        me.toolPanel = Ext.create('Ext.panel.Panel', Ext.apply({
            region: 'west',
            width: 180, //150
            border: false,
            split: {
                size: 5,
                collapseOnDblClick: false,
                collapsible: true
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.spriteBar, {
                xtype: 'container',
                padding: '4 6',
                style: 'background-color:#f5f5f5;border-top:solid 1px #e2e2e2;',
                layout: {
                    type: 'fit'
                },
                items: [me.btnCategories]
            }]
        }, toolPanelConfig));

        me.btnLoadFromFile = Ext.create('Ext.button.Button', {
            text: RS.$('All_Import'),
            cls: ['yz-designer-tbar-btn', 'yz-designer-tbar-btn-2line'],
            padding:'2 6',
            iconCls: 'yz-designer-icon-loadfromfile',
            iconAlign: 'top',
            disabled: config.readOnly
        });

        me.uploaderLoadFromFile = Ext.create('YZSoft.src.ux.Uploader', {
            attachTo: me.btnLoadFromFile,
            fileTypes: '*.evc;*.bpmn;*.flow;*.org;*.data;*.it;*.product;*.kpi;*.risk;*.reg',
            typesDesc: RS.$('BPA_FileTypeDesc_Process'),
            fileSizeLimit: '100 MB',
            params: {
                Method: 'LoadBPAFile'
            },
            loadMask: {
                msg: RS.$('All_Loading'),
                target: me
            },
            listeners: {
                fileQueued: function (file) {
                    var cnt = me.getActiveDrawContainer();
                    me.uploaderLoadFromFile.undoStep = cnt.createUndoStep('Import from file', false);
                },
                uploadSuccess: function (file, data) {
                    var cnt = me.getActiveDrawContainer();

                    me.loadFromFile(cnt, data);
                    cnt.commitUndoStep(me.uploaderLoadFromFile.undoStep);

                    Ext.defer(function () {
                        cnt.focus();
                    }, 10);
                }
            }
        });

        me.segImport = Ext.create('Ext.container.Container', {
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            padding: '0 6',
            defaults: {
                xtype: 'container'
            },
            items: [{
                items: [me.btnLoadFromFile]
            }]
        });

        me.btnSaveAsFile = Ext.create('Ext.button.Button', {
            text: RS.$('All_Download'),
            ui: 'default-toolbar',
            cls: ['yz-designer-tbar-btn', 'yz-designer-tbar-btn-2line'],
            padding: '2 6',
            iconCls: 'yz-designer-icon-saveasfile',
            iconAlign: 'top',
            handler: function () {
                me.saveAsFile(me.getActiveDrawContainer());
            }
        });

        me.btnExportPng = Ext.create('Ext.button.Button', {
            text: 'png',
            ui: 'default-toolbar',
            cls: ['yz-designer-tbar-btn', 'yz-designer-tbar-btn-2line'],
            padding: '2 6',
            iconCls: 'yz-designer-icon-exportpng',
            iconAlign: 'top',
            handler: function () {
                me.exportPng(me.getActiveDrawContainer());
            }
        });

        me.btnExportPdf = Ext.create('Ext.button.Button', {
            text: 'pdf',
            ui: 'default-toolbar',
            cls: ['yz-designer-tbar-btn', 'yz-designer-tbar-btn-2line'],
            padding: '2 6',
            iconCls: 'yz-designer-icon-exportpdf',
            iconAlign: 'top',
            handler: function () {
                me.exportPdf(me.getActiveDrawContainer());
            }
        });

        me.segExport = Ext.create('Ext.container.Container', {
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            padding: '0 6',
            defaults: {
                xtype: 'container'
            },
            items: [{
                items: [me.btnSaveAsFile, me.btnExportPng, me.btnExportPdf]
            }]
        });

        me.tbarFile = Ext.create('Ext.container.Container', {
            title: RS.$('All_File'),
            style: 'background-color:#eff2f2;',
            cls: 'yz-designer-tbar',
            height: 70,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                cls: 'yz-designer-toolbar-seg',
                border: '0 1 0 0'
            },
            items: [me.segImport, me.segExport]
        });

        me.btnPaste = Ext.create('Ext.button.Button', {
            text: RS.$('All_Paste'),
            ui: 'default-toolbar',
            cls: ['yz-designer-tbar-btn','yz-designer-tbar-btn-2line'],
            iconCls: 'yz-designer-icon-paste',
            disabled: true,
            iconAlign: 'top',
            handler: function () {
                me.getActiveDrawContainer().paste();
            }
        });

        me.btnCut = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cut'),
            ui: 'default-toolbar',
            cls: ['yz-designer-tbar-btn','yz-designer-tbar-btn-iconsize-l'],
            padding:'3 2 3 2',
            iconCls: 'yz-designer-icon-cut',
            disabled: config.readOnly,
            handler: function () {
                me.getActiveDrawContainer().cut();
            }
        });

        me.btnCopy = Ext.create('Ext.button.Button', {
            text: RS.$('All_Copy1'),
            ui: 'default-toolbar',
            cls: ['yz-designer-tbar-btn','yz-designer-tbar-btn-iconsize-l'],
            padding: '3 2 3 2',
            iconCls: 'yz-designer-icon-copy',
            disabled: config.readOnly,
            handler: function () {
                me.getActiveDrawContainer().copy();
            }
        });

        me.btnApplyStyle = Ext.create('Ext.button.Button', {
            text: RS.$('All_FormatBrush'),
            ui: 'default-toolbar',
            cls: ['yz-designer-tbar-btn', 'yz-designer-tbar-btn-2line'],
            iconCls: 'yz-designer-icon-applystyle',
            disabled: config.readOnly,
            iconAlign: 'top',
            handler: function () {
                me.getActiveDrawContainer().onApplyStyleClick();
            }
        });

        me.segPaste = Ext.create('Ext.container.Container', {
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            padding: '0 6',
            defaults: {
                xtype: 'container'
            },
            items: [{
                items: [me.btnPaste]
            }, {
                padding:'2 0 0 0',
                layout: {
                    type: 'vbox'
                },
                items: [me.btnCut, me.btnCopy]
            }, {
                items: [me.btnApplyStyle]
            }]
        });

        me.pickerFontFamily = Ext.create('YZSoft.src.button.FontFamilyPicker', {
            ui: 'default-toolbar',
            iconCls: 'yz-glyph yz-glyph-e63a',
            cls: ['yz-size-s', 'yz-btn-textbox-style'],
            textAlign: 'left',
            width: 110,
            tooltip: RS.$('All_Font'),
            listeners: {
                scope: me,
                picked: 'onFontFamilyPicked'
            }
        });

        me.fontsizeStore = Ext.create('Ext.data.Store', {
            fields: ['value'],
            data: [
                { value: 12 },
                { value: 13 },
                { value: 14 },
                { value: 15 },
                { value: 16 },
                { value: 17 },
                { value: 18 },
                { value: 19 },
                { value: 20 },
                { value: 22 },
                { value: 24 },
                { value: 28 },
                { value: 32 },
                { value: 36 },
                { value: 48 },
                { value: 72 },
                { value: 96 }
            ]
        });

        me.edtFontSize = Ext.create('Ext.form.field.ComboBox', {
            store: me.fontsizeStore,
            cls: 'yz-size-s',
            listConfig: {
                cls: ['yz-boundlist-picker', 'yz-boundlist-picker-simple', 'yz-size-s'],
                maxHeight: 600,
                minWidth: 50
            },
            width: 50,
            margin: '0 0 0 3',
            value: 12,
            displayField: 'value',
            valueField: 'value',
            enableKeyEvents: true,
            listeners: {
                scope: me,
                change: 'onFontSizeChange',
                keyup: function () {
                    me.onFontSizeChange(me.edtFontSize, me.edtFontSize.getValue() || 12);
                }
            }
        });

        me.btnBold = Ext.create('Ext.button.Button', {
            ui: 'default-toolbar',
            cls: ['yz-size-s','yz-designer-tbar-btn'],
            iconCls: 'yz-designer-icon-bold',
            tooltip: RS.$('All_Bold'),
            enableToggle: true,
            handler: function () {
                me.onBoldPressed(this, this.pressed);
            }
        });

        me.btnItalic = Ext.create('Ext.button.Button', {
            ui: 'default-toolbar',
            cls: ['yz-size-s','yz-designer-tbar-btn'],
            iconCls: 'yz-designer-icon-italic',
            tooltip: RS.$('All_Italic'),
            enableToggle: true,
            handler: function () {
                me.onItalicPressed(this, this.pressed);
            }
        });

        me.btnUnderline = Ext.create('Ext.button.Button', {
            ui: 'default-toolbar',
            cls: ['yz-size-s','yz-designer-tbar-btn'],
            iconCls: 'yz-designer-icon-underline',
            tooltip: RS.$('All_Underline'),
            enableToggle: true,
            handler: function () {
                me.onUnderlinePressed(this, this.pressed);
            }
        });

        me.btnFontColor = Ext.create('YZSoft.src.button.ColorPickerExt', {
            ui: 'default-toolbar',
            cls: ['yz-size-s','yz-designer-tbar-btn'],
            padding: 2,
            iconCls: 'yz-designer-icon-fontcolor',
            tooltip: RS.$('All_FontColor'),
            value: '#000000',
            listeners: {
                scope: me,
                picked: 'onFontColorPicked'
            }
        });

        me.btnFontBgColor = Ext.create('YZSoft.src.button.ColorPickerExt', {
            ui: 'default-toolbar',
            cls: ['yz-size-s','yz-designer-tbar-btn'],
            padding: 2,
            iconCls: 'yz-designer-icon-fontbgcolor ',
            tooltip: RS.$('All_TextBackground'),
            value: '#ffffff',
            disabled: true,
            menuConfig: {
                pickerConfig: {
                    transparent: true
                }
            },
            listeners: {
                scope: me,
                picked: 'onFontBgColorPicked'
            }
        });

        me.segText = Ext.create('Ext.container.Container', {
            layout: {
                type: 'vbox',
                align: 'start',
                pack: 'middle'
            },
            padding: '0 6 0 6',
            defaults: {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                }
            },
            items: [{
                items: [me.pickerFontFamily, me.edtFontSize]
            }, {
                padding: '4 0 0 0',
                items: [me.btnBold, me.btnItalic, me.btnUnderline, me.btnFontColor, me.btnFontBgColor]
            }]
        });

        me.pickerLineWidth = Ext.create('YZSoft.src.button.LineWidthPickerExt', {
            ui: 'default-toolbar',
            tooltip: RS.$('All_LineWidth'),
            cls: ['yz-size-s', 'yz-btn-textbox-style'],
            width: 129,
            listeners: {
                scope: me,
                picked: 'onLineWidthPicked'
            }
        });

        me.pickerLineStyle = Ext.create('YZSoft.src.button.LineStylePickerExt', {
            ui: 'default-toolbar',
            tooltip: RS.$('All_LineStyle'),
            cls: ['yz-size-s', 'yz-btn-textbox-style'],
            margin: '0 0 0 3',
            listeners: {
                scope: me,
                picked: 'onLineStylePicked'
            }
        });

        me.pickerFillColor = Ext.create('YZSoft.src.button.ColorPickerExt', {
            ui: 'default-toolbar',
            iconCls: 'yz-designer-icon-fill',
            tooltip: RS.$('All_ShapeFill'),
            cls: ['yz-size-s','yz-designer-tbar-btn'],
            padding: 2,
            margin: '0 0 0 3',
            value: '#ffffff',
            listeners: {
                scope: me,
                picked: 'onFillColorPicked'
            }
        });

        me.pickerLinkType = Ext.create('YZSoft.src.button.LinkTypePicker', {
            ui: 'default-toolbar',
            tooltip: RS.$('All_LinkType'),
            cls: ['yz-size-s', 'yz-btn-textbox-style'],
            width: 63,
            listeners: {
                scope: me,
                picked: 'onLinkTypePicked'
            }
        });

        me.pickerStartArrow = Ext.create('YZSoft.src.button.StartArrowPicker', {
            ui: 'default-toolbar',
            tooltip: RS.$('All_LineStartCap'),
            cls: ['yz-size-s', 'yz-btn-textbox-style'],
            margin: '0 0 0 3',
            listeners: {
                scope: me,
                picked: 'onStartArrowPicked'
            }
        });

        me.pickerEndArrow = Ext.create('YZSoft.src.button.EndArrowPicker', {
            ui: 'default-toolbar',
            tooltip: RS.$('All_LineEndCap'),
            cls: ['yz-size-s', 'yz-btn-textbox-style'],
            margin: '0 0 0 3',
            listeners: {
                scope: me,
                picked: 'onEndArrowPicked'
            }
        });

        me.pickerStrokeColor = Ext.create('YZSoft.src.button.ColorPickerExt', {
            ui: 'default-toolbar',
            iconCls: 'yz-designer-icon-stroke',
            tooltip: RS.$('All_ShapeStroke'),
            cls: ['yz-size-s','yz-designer-tbar-btn'],
            padding: 2,
            margin: '0 0 0 3',
            value: '#000000',
            listeners: {
                scope: me,
                picked: 'onStrokeColorPicked'
            }
        });

        me.segShape = Ext.create('Ext.container.Container', {
            layout: {
                type: 'vbox',
                align: 'start',
                pack:'middle'
            },
            padding: '0 6',
            defaults: {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                }
            },
            items: [{
                items: [me.pickerLineWidth, me.pickerLineStyle, me.pickerFillColor]
            }, {
                padding: '4 0 0 0',
                items: [me.pickerLinkType, me.pickerStartArrow, me.pickerEndArrow, me.pickerStrokeColor]
            }]
        });

        me.btnTextAlignLeft = Ext.create('Ext.button.Button', {
            ui: 'default-toolbar',
            cls: 'yz-designer-tbar-btn-textalign',
            iconCls: 'yz-glyph yz-glyph-e930',
            tooltip: RS.$('All_HAlign_Start'),
            enableToggle: true,
            toggleGroup: 'horizAlign',
            handler: function () {
                me.onTextHAlign('start');
            }
        });

        me.btnTextAlignCenter = Ext.create('Ext.button.Button', {
            ui: 'default-toolbar',
            cls: 'yz-designer-tbar-btn-textalign',
            iconCls: 'yz-glyph yz-glyph-e92e',
            tooltip: RS.$('All_HAlign_Middle'),
            enableToggle: true,
            toggleGroup: 'horizAlign',
            handler: function () {
                me.onTextHAlign('center');
            }
        });

        me.btnTextAlignRight = Ext.create('Ext.button.Button', {
            ui: 'default-toolbar',
            cls: 'yz-designer-tbar-btn-textalign',
            iconCls: 'yz-glyph yz-glyph-e92f',
            tooltip: RS.$('All_HAlign_End'),
            enableToggle: true,
            toggleGroup: 'horizAlign',
            handler: function () {
                me.onTextHAlign('end');
            }
        });

        me.btnTextAlignTop = Ext.create('Ext.button.Button', {
            ui: 'default-toolbar',
            cls: 'yz-designer-tbar-btn-textalign',
            iconCls: 'yz-glyph yz-glyph-e932',
            tooltip: RS.$('All_VAlign_Start'),
            enableToggle: true,
            toggleGroup: 'vertAlign',
            handler: function () {
                me.onTextVAlign('top');
            }
        });

        me.btnTextAlignMiddle = Ext.create('Ext.button.Button', {
            ui: 'default-toolbar',
            cls: 'yz-designer-tbar-btn-textalign',
            iconCls: 'yz-glyph yz-glyph-e931',
            tooltip: RS.$('All_VAlign_Middle'),
            enableToggle: true,
            toggleGroup: 'vertAlign',
            handler: function () {
                me.onTextVAlign('middle');
            }
        });

        me.btnTextAlignBottom = Ext.create('Ext.button.Button', {
            ui: 'default-toolbar',
            cls: 'yz-designer-tbar-btn-textalign',
            iconCls: 'yz-glyph yz-glyph-e92d',
            tooltip: RS.$('All_VAlign_End'),
            enableToggle: true,
            toggleGroup: 'vertAlign',
            handler: function () {
                me.onTextVAlign('bottom');
            }
        });

        me.segTextAlign = Ext.create('Ext.container.Container', {
            layout: {
                type: 'vbox',
                align: 'start',
                pack: 'middle'
            },
            padding: '0 6 0 4',
            defaults: {
                xtype: 'container',
                layout: {
                    type: 'hbox'
                },
                defaults: {
                    width: 24,
                    height: 24,
                    margin: '0 0 0 1'
                }
            },
            items: [{
                items: [me.btnTextAlignLeft, me.btnTextAlignCenter, me.btnTextAlignRight]
            }, {
                padding: '6 0 0 0',
                items: [me.btnTextAlignTop, me.btnTextAlignMiddle, me.btnTextAlignBottom]
            }]
        });

        me.spritePattern = Ext.create('YZSoft.src.toolbar.item.SpritePattern', {
            margin: '3 6',
            style: 'border: solid 1px #ddd;',
            listeners: {
                itemClick: function (template) {
                    me.onPatternItemClick(template)
                }
            }
        });

        me.segSpritePattern = Ext.create('Ext.container.Container', {
            items: [me.spritePattern]
        });

        me.menuBringFront = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e937',
            text: RS.$('All_BringToFront'),
            scope: me,
            handler: 'onBringFront'
        });

        me.menuSendBottom = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e936',
            text: RS.$('All_SendToBottom'),
            scope: me,
            handler: 'onSendBottom'
        });

        me.menuZIndex = Ext.create('Ext.menu.Menu', {
            defaults: {
                padding: '0 16 0 3'
            },
            items: [
                me.menuBringFront,
                me.menuSendBottom
            ]
        });

        me.btnZIndex = Ext.create('Ext.button.Button', {
            ui: 'default-toolbar',
            cls: ['yz-designer-tbar-btn', 'yz-designer-tbar-btn-2line'],
            padding:'2 6',
            iconCls: 'yz-designer-icon-zindex',
            text: RS.$('All_SpriteOrder'),
            disabled: config.readOnly,
            iconAlign: 'top',
            arrowAlign: 'bottom',
            menu: me.menuZIndex,
            handler: function () {
            }
        });

        me.menuHAlignStart = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e630',
            text: RS.$('All_HAlign_Start'),
            scope: me,
            handler: 'onHAlignStart'
        });

        me.menuHAlignMiddle = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e62a',
            text: RS.$('All_HAlign_Middle'),
            scope: me,
            handler: 'onHAlignMiddle'
        });

        me.menuHAlignEnd = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e62f',
            text: RS.$('All_HAlign_End'),
            scope: me,
            handler: 'onHAlignEnd'
        });

        me.menuVAlignStart = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e62c',
            text: RS.$('All_VAlign_Start'),
            scope: me,
            handler: 'onVAlignStart'
        });

        me.menuVAlignMiddle = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e62e',
            text: RS.$('All_VAlign_Middle'),
            scope: me,
            handler: 'onVAlignMiddle'
        });

        me.menuVAlignEnd = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e62d',
            text: RS.$('All_VAlign_End'),
            scope: me,
            handler: 'onVAlignEnd'
        });

        me.menuHSpaceAlign = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e645',
            text: RS.$('All_HSpace_Align'),
            scope: me,
            handler: 'onHSpaceAlign'
        });

        me.menuHSpaceIncrease = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e902',
            text: RS.$('All_HSpace_Inc'),
            scope: me,
            handler: 'onHSpaceIncrease'
        });

        me.menuHSpaceDecrease = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e904',
            text: RS.$('All_HSpace_Dec'),
            scope: me,
            handler: 'onHSpaceDecrease'
        });

        me.menuHSpaceRemove = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e640',
            text: RS.$('All_HSpace_Remove'),
            scope: me,
            handler: 'onHSpaceRemove'
        });

        me.menuVSpaceAlign = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e644',
            text: RS.$('All_VSpace_Align'),
            scope: me,
            handler: 'onVSpaceAlign'
        });

        me.menuVSpaceIncrease = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e901',
            text: RS.$('All_VSpace_Inc'),
            scope: me,
            handler: 'onVSpaceIncrease'
        });

        me.menuVSpaceDecrease = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e903',
            text: RS.$('All_VSpace_Dec'),
            scope: me,
            handler: 'onVSpaceDecrease'
        });

        me.menuVSpaceRemove = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e63f',
            text: RS.$('All_VSpace_Remove'),
            scope: me,
            handler: 'onVSpaceRemove'
        });

        me.menuSameWidth = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e648',
            text: RS.$('All_SameWidth'),
            scope: me,
            handler: 'onSameWidth'
        });

        me.menuSameHeight = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e647',
            text: RS.$('All_SameHeight'),
            scope: me,
            handler: 'onSameHeight'
        });

        me.menuSameSize = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e646',
            text: RS.$('All_SameSize'),
            scope: me,
            handler: 'onSameSize'
        });

        me.menuAlign = Ext.create('Ext.menu.Menu', {
            defaults: {
                padding: '0 16 0 3'
            },
            items: [
                me.menuHAlignStart,
                me.menuHAlignMiddle,
                me.menuHAlignEnd,
                '-',
                me.menuVAlignStart,
                me.menuVAlignMiddle,
                me.menuVAlignEnd,
                '-',
                me.menuHSpaceAlign,
                me.menuHSpaceIncrease,
                me.menuHSpaceDecrease,
                me.menuHSpaceRemove,
                '-',
                me.menuVSpaceAlign,
                me.menuVSpaceIncrease,
                me.menuVSpaceDecrease,
                me.menuVSpaceRemove,
                '-',
                me.menuSameWidth,
                me.menuSameHeight,
                me.menuSameSize
            ]
        });

        me.btnAlign = Ext.create('Ext.button.Button', {
            ui: 'default-toolbar',
            cls: ['yz-designer-tbar-btn', 'yz-designer-tbar-btn-2line'],
            padding: '2 6',
            iconCls: 'yz-designer-icon-align',
            text: RS.$('All_Align'),
            disabled: config.readOnly,
            iconAlign: 'top',
            arrowAlign: 'bottom',
            menu: me.menuAlign,
            handler: function () {
            }
        });

        me.segAlign = Ext.create('Ext.container.Container', {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            padding: '3 8',
            items: [me.btnZIndex, me.btnAlign]
        });

        me.btnShowExtension = Ext.create('Ext.button.Split', {
            cls: 'yz-bpa-btn-toolbar',
            text: RS.$('BPA_ShowProperty'),
            ui: 'default-toolbar',
            scope:me,
            handler: 'toggleShowExtension',
            menuAlign: 'tr-br?',
            menu: Ext.create('YZSoft.src.menu.Select', {
                width: 96,
                items: [
                    { value: 'Code', text: RS.$('BPA_ShowCode') },
                    { value: 'Order', text: RS.$('BPA_ShowOrder'), checked: true }
                ],
                listeners: {
                    pickerSelect: function (picker,value,record) {
                        var btn = me.btnShowExtension,
                            dcnt = me.getActiveDrawContainer(),
                            sprites = dcnt.getAllSprites(),
                            surface = dcnt.getSurface('shape');

                        YZSoft.bpaDisplayProperty = [value];

                        dcnt.showExtension = true;
                        btn.setText(RS.$('BPA_HideProperty'));
                        Ext.Array.each(sprites, function (sprite) {
                            sprite.setAttributes({
                                showExtension: true
                            });
                        });

                        surface.setDirty(true);
                        surface.renderFrame();
                    }
                }
            })
        });

        me.tbarEdit = Ext.create('Ext.container.Container', {
            title: RS.$('All_Edit'),
            style: 'background-color:#eff2f2;',
            cls:'yz-designer-tbar',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                cls: 'yz-designer-toolbar-seg',
                border: '0 1 0 0'
            },
            items: [
                me.segPaste,
                me.segText,
                me.segShape,
                me.segTextAlign,
                me.segSpritePattern,
                me.segAlign,{ xtype: 'tbfill', cls: '' }, {
                    xtype: 'container',
                    cls: '',
                    margin:'0 15 0 0',
                    layout: {
                        type: 'hbox',
                        align: 'center'
                    },
                    defaults: {
                        ui: 'default-toolbar'
                    },
                    items: [
                        me.btnShowExtension
                    ]
                }
            ]
        });

        me.tbarPanel3 = Ext.create('Ext.container.Container', {
            title: RS.$('All_Insert')
        });

        me.tbarPanel4 = Ext.create('Ext.container.Container', {
            title: RS.$('BPA__Page')
        });

        me.tbarPanel5 = Ext.create('Ext.container.Container', {
            title: RS.$('All_SpriteOrder')
        });

        me.tabMain = Ext.create('YZSoft.src.tab.Panel', Ext.apply({
            region: 'north',
            border: false,
            activeTab: 1,
            tabBar: me.tabbarMain,
            items: [me.tbarFile, me.tbarEdit, me.tbarPanel3, me.tbarPanel4, me.tbarPanel5]
        }, tabMainConfig));

        cfg = {
            items: [me.headerBar, me.tabMain, me.toolPanel, me.pnlMDIWrap]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        Ext.apply(me, me.getReferences());

        me.on({
            single: true,
            afterLayout: function () {
                if (config.process) {
                    me.openProcess(config.process, {
                        panelConfig: {
                            closable: false
                        }
                    });
                }
            }
        });

        me.updateStatus();
    },

    toggleShowExtension: function () {
        var me = this,
            btn = me.btnShowExtension,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getAllSprites(),
            showExtension,newText;

        if (btn.getText() == RS.$('BPA_ShowProperty')) {
            showExtension = true;
            newText = RS.$('BPA_HideProperty');
        }
        else {
            showExtension = false;
            newText = RS.$('BPA_ShowProperty')
        }

        dcnt.showExtension = showExtension;
        btn.setText(newText);
        Ext.Array.each(sprites, function (sprite) {
            sprite.setAttributes({
                showExtension: showExtension
            });
        });

        dcnt.renderFrame();
    },

    toggleShowExtension: function () {
        var me = this,
            btn = me.btnShowExtension,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getAllSprites(),
            surface = dcnt.getSurface('shape'),
            showExtension, newText;

        if (btn.getText() == RS.$('BPA_ShowProperty')) {
            showExtension = true;
            newText = RS.$('BPA_HideProperty');
        }
        else {
            showExtension = false;
            newText = RS.$('BPA_ShowProperty')
        }

        dcnt.showExtension = showExtension;
        btn.setText(newText);
        Ext.Array.each(sprites, function (sprite) {
            sprite.setAttributes({
                showExtension: showExtension
            });
        });

        surface.renderFrame();
    },

    getActiveWorkPanel: function () {
        return this.tabMDI.getActiveTab();
    },

    getActiveDrawContainer: function () {
        var panel = this.tabMDI.getActiveTab();
        return panel && panel.drawContainer;
    },

    createWorkPanel: function (config) {
        var me = this,
            drawContainer,
            pnlProperty,
            pnlWrap,
            pnlDesignContainer,
            floatingBar;

        config = config || {};

        drawContainer = Ext.create('YZSoft.bpa.DesignContainer', Ext.apply({
            minWidth: 3000,
            minHeight: 1000,
            designer: me,
            groupInfo: me.groupInfo
        }, config.drawContainerConfig));

        pnlProperty = Ext.create('YZSoft.bpa.property.Container', Ext.apply({
            region: 'east',
            width: 340,
            drawContainer: drawContainer,
            split: {
                size: 5,
                collapseOnDblClick: false,
                collapsible: true
            },
            listeners: {
                fileClick: function (option) {
                    me.openProcess(option);
                }
            }
        }, me.propertyPanelConfig));

        pnlWrap = Ext.create('Ext.container.Container', Ext.apply({
            layout: 'fit',
            region: 'center',
            scrollable: true,
            border: false,
            drawContainer: drawContainer,
            items: [drawContainer]
        }));

        pnlDesignContainer = Ext.create('Ext.panel.Panel', Ext.apply({
            layout: 'border',
            scrollable: false,
            border: false,
            drawContainer: drawContainer,
            pnlWrap: pnlWrap,
            pnlProperty: pnlProperty,
            items: [pnlWrap, pnlProperty]
        }, config.panelConfig));

        pnlProperty.splitter.on({
            single: true,
            render: function () {
                this.collapseEl.on({
                    click: function () {
                        pnlProperty.hide();
                    }
                });
            }
        });

        drawContainer.topContainer = pnlDesignContainer;
        drawContainer.wrapContainer = pnlWrap;

        drawContainer.on({
            scope: me,
            selectionchange: 'updateStatus',
            keydown: function (e, t, eOpts) {
                e.stopEvent();

                var key = e.getKey();
                if (e.ctrlKey && key == e.S) {
                    if (me.CTRLSSave && me.getActiveWorkPanel().writable)
                        me.save(me.getActiveDrawContainer());
                }
            },
            clipDataChanged: function () {
                me.updatePasteStatus();
            },
            fileClick: function (option) {
                me.openProcess(option);
            },
            shortcutclick: function (sprite, type) {
                me.openProcess({
                    fileid: sprite.relatiedFile
                });
            }
        });

        drawContainer.undoManager.on({
            scope: me,
            change: 'updateUndoStatus'
        });

        floatingBar = Ext.create('YZSoft.src.floating.Container', {
            container: pnlDesignContainer,
            cls: 'yz-designer-floating-toolcontainer',
            layout: 'vbox',
            hidden: !pnlProperty.isHidden(),
            offset: {
                x: -13,
                y: 5
            },
            defaults: {
                xtype: 'button',
                padding: 6,
                ui: 'default-toolbar'
            },
            items: [{
                glyph: 0xe93d,
                tooltip: {
                    text: RS.$('BPA_Tip_CooperWin'),
                    anchor: true,
                    align: 'r50-l50'
                },
                handler: function () {
                    pnlProperty.tabMain.setActiveTab(0);
                    pnlProperty.show();
                }
            }, {
                glyph: 0xe99c,
                tooltip: {
                    text: RS.$('BPA_Tip_ReportWin'),
                    anchor: true,
                    align: 'r50-l50'
                },
                margin:'3 0 0 0',
                handler: function () {
                    pnlProperty.tabMain.setActiveTab(1);
                    pnlProperty.show();
                }
            }]
        });

        pnlProperty.on({
            show: function () {
                floatingBar.hide();
            },
            hide: function () {
                floatingBar.show();
            }
        });

        pnlProperty.relayEvents(pnlDesignContainer, ['activate']);
        return pnlDesignContainer;
    },

    newProcess: function (folder, data, config) {
        var me = this,
            config = config || {},
            workPanel;

        workPanel = me.createWorkPanel({
            panelConfig: Ext.apply({
                title: 'New File',
                closable: false,
                writable: true,
                listeners: {
                    single: true,
                    afterLayout: function () {
                        YZSoft.Ajax.request(Ext.apply({
                            method: 'GET',
                            url: YZSoft.$url('YZSoft.Services.REST/BPA/Library.ashx'),
                            params: {
                                method: 'GetNewFileInfo'
                            },
                            waitMsg: false,
                            success: function (action) {
                                var drawContainer = workPanel.drawContainer,
                                    fileid = action.result.fileid,
                                    filefolderid = action.result.folderid;

                                drawContainer.newProcess();
                                drawContainer.loadProcess(data);
                                drawContainer.fileinfo = {
                                    folder: folder,
                                    fileid: fileid,
                                    filefolderid: filefolderid
                                };
                                drawContainer.ext = me.ext;

                                drawContainer.folderid = filefolderid;
                                workPanel.pnlProperty.setFolderID(drawContainer.folderid);

                                workPanel.pnlProperty.pnlSocial.setTopic({
                                    resType: 'BPAFile',
                                    resId: fileid
                                }, {
                                    loadMask: false
                                });
                            }
                        }, config));
                    }
                }
            }, config.panelConfig),
            drawContainerConfig: {
                designMode: 'new',
                linkCfg: me.linkCfg
            }
        });

        me.tabMDI.add(workPanel);
        me.tabMDI.setActiveTab(workPanel);
    },

    /*
    process
    {
    fileid,
    fileName
    }
    config
    {
    workPanel
    }
    */
    openProcess: function (process, config) {
        var me = this,
            config = config || {},
            workPanel = config.workPanel;

        if (!workPanel) {
            workPanel = me.tabMDI.items.findBy(function (item) {
                return item.drawContainer.fileinfo.fileid == process.fileid;
            });

            if (!workPanel) {
                workPanel = me.createWorkPanel({
                    panelConfig: Ext.apply({
                        title: process.fileName || 'Loading...',
                        closable: true,
                        writable: true,
                        listeners: {
                            single: true,
                            afterLayout: function () {
                                me.openProcess(process, Ext.apply(config, {
                                    workPanel: workPanel
                                }));
                            }
                        }
                    }, config.panelConfig),
                    drawContainerConfig: {
                        designMode: 'edit',
                        linkCfg: me.linkCfg
                    }
                });

                me.tabMDI.add(workPanel);
                me.tabMDI.setActiveTab(workPanel);
            }
            else {
                me.tabMDI.setActiveTab(workPanel);
            }
        }
        else {
            if (process.fileName)
                workPanel.setTitle(process.fileName);

            YZSoft.Ajax.request(Ext.apply({
                method: 'GET',
                url: YZSoft.$url('YZSoft.Services.REST/BPA/Library.ashx'),
                params: Ext.apply({
                    method: 'GetProcessDefine'
                }, process),
                waitMsg: {
                    msg: RS.$('All_Loading'),
                    target: workPanel.pnlWrap
                },
                success: function (action) {
                    var attachment = action.result.attachment,
                        writable = action.result.writable,
                        processDefine = action.result.processDefine,
                        drawContainer = workPanel.drawContainer;

                    workPanel.writable = writable;
                    me.applyWriteable(writable);
                    workPanel.pnlProperty.setReadOnly(!writable);

                    drawContainer.folderid = attachment.LParam1;
                    workPanel.pnlProperty.setFolderID(drawContainer.folderid);

                    workPanel.pnlProperty.pnlSocial.setTopic({
                        resType: 'BPAFile',
                        resId: attachment.FileID
                    }, {
                        loadMask: false
                    });

                    workPanel.setTitle(attachment.Name);
                    me.caption.setText(attachment.Name);
                    drawContainer.loadProcess(processDefine);
                    me.spriteBar.setCategories(processDefine.categories);

                    drawContainer.designMode = 'edit';
                    drawContainer.fileinfo = {
                        fileid: attachment.FileID,
                        processName: attachment.Name,
                        attachment: attachment
                    };

                    drawContainer.ext = attachment.Ext;

                    Ext.defer(function () {
                        workPanel.drawContainer.focus();
                    }, 10);
                }
            }, config));
        }
    },

    loadFromFile: function (drawContainer, process) {
        var me = this;

        drawContainer.loadProcess(process.processDefine);

        if (drawContainer.designMode == 'new') {
            drawContainer.fileinfo.processName = process.fileName;
            drawContainer.topContainer.setTitle(process.fileName);
            me.caption.setText(process.fileName);
        }

        me.spriteBar.setCategories(process.processDefine.categories);
    },

    saveProcess: function (drawContainer, config) {
        var me = this,
            process;

        config = config || {};
        config.data = config.data || {};
        config.data.categories = [];

        process = drawContainer.saveProcess(config);
        process.categories = me.spriteBar.categories;

        return process;
    },

    save: function (cnt,fn) {
        var me = this,
            chart = cnt.saveChart(),
            undoManager = cnt.undoManager;

        if (cnt.designMode == 'edit') {
            var process = me.saveProcess(cnt);

            YZSoft.Ajax.request({
                method: 'POST',
                url: YZSoft.$url('YZSoft.Services.REST/BPA/Library.ashx'),
                params: {
                    method: 'SaveProcess',
                    fileid: cnt.fileinfo.fileid
                },
                jsonData: {
                    process: process,
                    chart: chart
                },
                waitMsg: {
                    msg: RS.$('All_Saving'),
                    target: me,
                    start: 0
                },
                success: function (action) {
                    me.mask({
                        msg: RS.$('All_Save_Succeed'),
                        msgCls: 'yz-mask-msg-success',
                        autoClose: true,
                        fn: function () {
                            undoManager.clearDirty();
                            me.updateUndoStatus();
                            fn && fn(process, action.result);
                            me.fireEvent('processsaved', cnt, 'edit', process, action.result);
                        }
                    });
                }
            });
        }

        if (cnt.designMode == 'new') {
            var process = me.saveProcess(cnt);

            Ext.create('YZSoft.bpa.src.dialogs.SaveNewProcessDlg', {
                autoShow: true,
                processName: cnt.fileinfo.processName,
                fn: function (processName) {
                    cnt.fileinfo.processName = processName;

                    YZSoft.Ajax.request({
                        method: 'POST',
                        url: YZSoft.$url('YZSoft.Services.REST/BPA/Library.ashx'),
                        params: {
                            method: 'SaveProcessAs',
                            folder: cnt.fileinfo.folder,
                            fileid: cnt.fileinfo.fileid,
                            filefolderid: cnt.fileinfo.filefolderid,
                            processName: processName,
                            ext: cnt.ext
                        },
                        jsonData: {
                            process: process,
                            chart: chart
                        },
                        waitMsg: {
                            msg: RS.$('All_Saving'),
                            target: me,
                            start: 0
                        },
                        success: function (action) {
                            cnt.designMode = 'edit';
                            Ext.copyTo(cnt.fileinfo, action.result, 'fileid');

                            process.Name = processName;

                            me.mask({
                                msg: RS.$('All_Save_Succeed'),
                                msgCls: 'yz-mask-msg-success',
                                autoClose: true,
                                fn: function () {
                                    undoManager.clearDirty();
                                    cnt.topContainer.setTitle(processName);
                                    me.caption.setText(processName);
                                    fn && fn(process, action.result);
                                    me.fireEvent('processsaved', cnt, 'new', process, action.result);
                                }
                            });
                        }
                    });
                }
            });
        }
    },

    saveAsFile: function (cnt) {
        var me = this,
            chart = cnt.saveChart(),
            process = me.saveProcess(cnt);

        YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
            method: 'ExportBPAProcessAsFile',
            fileName: (cnt.fileinfo.processName || 'New File'),
            ext: cnt.ext,
            process: Ext.util.Base64.encode(Ext.encode(process)),
            chart: Ext.util.Base64.encode(Ext.encode(chart))
        });

        return;
    },

    exportPng: function (cnt) {
        var me = this,
            chart = cnt.saveChart(),
            process = me.saveProcess(cnt);

        YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
            method: 'ExportProcessAsPng',
            fileName: (cnt.fileinfo.processName || 'New File'),
            ext: cnt.ext,
            process: Ext.util.Base64.encode(Ext.encode(process)),
            chart: Ext.util.Base64.encode(Ext.encode(chart))
        });

        return;
    },

    exportPdf: function (cnt) {
        var me = this,
            chart = cnt.saveChart(),
            process = me.saveProcess(cnt);

        YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
            method: 'ExportProcessAsPdf',
            fileName: (cnt.fileinfo.processName || 'New File'),
            ext: cnt.ext,
            process: Ext.util.Base64.encode(Ext.encode(process)),
            chart: Ext.util.Base64.encode(Ext.encode(chart))
        });

        return;
    },

    applyWriteable: function (writable) {
        this.btnSave.setVisible(writable);
    },

    updateStatus: function () {
        var me = this,
            dcnt = me.getActiveDrawContainer();

        if (!dcnt)
            return;

        var undoManager = dcnt.undoManager,
            sprites = dcnt.getSelection(),
            links = me.getLinks(sprites),
            shapes = me.getShapes(sprites),
            textSprite, linkSprite, items, sprite, canCopy;

        //copy
        canCopy = dcnt.canCopy();
        me.btnCut.setDisabled(!canCopy);
        me.btnCopy.setDisabled(!canCopy);
        me.btnApplyStyle.setDisabled(!dcnt.canCopyStyle(sprites));

        //字体参照sprite
        textSprite = Ext.Array.findBy(sprites, function (sprite) {
            if (sprite.sprites && sprite.sprites.text)
                return true;
        });

        items = [
            me.pickerFontFamily,
            me.edtFontSize,
            me.btnBold,
            me.btnItalic,
            me.btnUnderline,
            me.btnFontColor,
            me.btnFontBgColor
        ];
        Ext.each(items, function (btn) {
            btn.setDisabled(!textSprite);
        });

        if (textSprite) {
            me.pickerFontFamily.setFontFamily(textSprite.sprites.text.attr.fontFamily);
            me.edtFontSize.suspendEvent('change');
            me.edtFontSize.setValue(parseFloat(String(textSprite.sprites.text.attr.fontSize)) || 12);
            me.edtFontSize.resumeEvent('change');

            me.btnBold.setPressed(String.Equ(textSprite.sprites.text.attr.fontWeight, 'bold'));
            me.btnItalic.setPressed(String.Equ(textSprite.sprites.text.attr.fontStyle, 'italic'));
            me.btnUnderline.setPressed(textSprite.sprites.text.attr.underline);
            me.btnFontColor.setColor(textSprite.sprites.text.attr.fillStyle);
            me.btnFontBgColor.setColor(textSprite.sprites.text.background.fillStyle);
        }
        else {
            me.btnBold.setPressed(false);
            me.btnItalic.setPressed(false);
            me.btnUnderline.setPressed(false);
        }

        //线宽
        me.pickerLineWidth.setDisabled(!me.canChangeLineWidth(sprites));
        sprite = me.getLineWidthRefSprite(sprites);
        if (sprite)
            me.pickerLineWidth.setLineWidth(sprite.attr.lineWidth);

        //线型
        me.pickerLineStyle.setDisabled(!me.canChangeLineStyle(sprites));
        sprite = me.getLineStyleRefSprite(sprites);
        if (sprite)
            me.pickerLineStyle.setLineStyle(sprite.attr.lineDash);

        //填充色
        me.pickerFillColor.setDisabled(!me.canChangeFillStyle(sprites));
        sprite = me.getFillStyleRefSprite(sprites);
        if (sprite)
            me.pickerFillColor.setColor(sprite.attr.fillStyle);

        //stroke色
        me.pickerStrokeColor.setDisabled(!me.canChangeStrokeStyle(sprites));
        sprite = me.getStrokeStyleRefSprite(sprites);
        if (sprite)
            me.pickerStrokeColor.setColor(sprite.attr.strokeStyle);

        //箭头
        me.pickerStartArrow.setDisabled(!me.canChangeStartArrow(sprites));
        me.pickerEndArrow.setDisabled(!me.canChangeEndArrow(sprites));

        sprite = me.getStartArrowRefSprite(sprites);
        if (sprite)
            me.pickerStartArrow.setArrow(sprite.sprites.startArrow.attr.type);

        sprite = me.getEndArrowRefSprite(sprites);
        if (sprite)
            me.pickerEndArrow.setArrow(sprite.sprites.endArrow.attr.type);

        //文本对齐
        var canChangeTextAlign = me.canChangeTextAlign(sprites);

        //水平对齐disable/enable
        items = [
            me.btnTextAlignLeft,
            me.btnTextAlignCenter,
            me.btnTextAlignRight
        ];
        Ext.each(items, function (btn) {
            btn.setDisabled(!canChangeTextAlign);
        });

        //垂直对齐disable/enable
        items = [
            me.btnTextAlignTop,
            me.btnTextAlignMiddle,
            me.btnTextAlignBottom
        ];
        Ext.each(items, function (btn) {
            btn.setDisabled(!canChangeTextAlign);
        });

        //水平对齐
        sprite = me.getTextAlignRefSprite(sprites);
        if (sprite) {
            var map = {
                start: me.btnTextAlignLeft,
                center: me.btnTextAlignCenter,
                end: me.btnTextAlignRight
            }

            var btn = map[sprite.sprites.text.attr.textAlign];
            if (btn)
                btn.setPressed(true);
        }

        //垂直对齐
        sprite = me.getTextVAlignRefSprite(sprites);
        if (sprite) {
            var map = {
                top: me.btnTextAlignTop,
                middle: me.btnTextAlignMiddle,
                bottom: me.btnTextAlignBottom
            }

            var btn = map[sprite.sprites.text.attr.textBaseline];
            if (btn)
                btn.setPressed(true);
        }

        //1个以上sprite
        items = [
            me.menuBringFront,
            me.menuSendBottom
        ];
        Ext.each(items, function (btn) {
            btn.setDisabled(sprites.length == 0);
        });

        //2个以上shape
        items = [
            me.menuHAlignStart,
            me.menuHAlignMiddle,
            me.menuHAlignEnd,
            me.menuVAlignStart,
            me.menuVAlignMiddle,
            me.menuVAlignEnd,
            me.menuHSpaceIncrease,
            me.menuHSpaceDecrease,
            me.menuHSpaceRemove,
            me.menuVSpaceIncrease,
            me.menuVSpaceDecrease,
            me.menuVSpaceRemove,
            me.menuSameWidth,
            me.menuSameHeight,
            me.menuSameSize
        ];
        Ext.each(items, function (btn) {
            btn.setDisabled(shapes.length <= 1);
        });

        //3个以上shape
        items = [
            me.menuHSpaceAlign,
            me.menuVSpaceAlign
        ];
        Ext.each(items, function (btn) {
            btn.setDisabled(shapes.length <= 2);
        });

        me.updateUndoStatus();
    },

    updatePasteStatus: function () {
        var me = this,
            cnt = me.getActiveDrawContainer();

        if (!cnt)
            return;

        me.btnPaste.setDisabled(!cnt.canPaste());
    },

    updateUndoStatus: function () {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            undoManager = dcnt.undoManager,
            dirty = undoManager.getDirty(),
            topContainer = dcnt.topContainer;

        topContainer.markDirty(dirty);
        me.btnUndo.setDisabled(!undoManager.canUndo());
        me.btnRedo.setDisabled(!undoManager.canRedo());
    }
});