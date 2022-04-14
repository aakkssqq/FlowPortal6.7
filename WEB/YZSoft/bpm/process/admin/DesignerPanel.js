/*
config
readOnly
*/
Ext.define('YZSoft.bpm.process.admin.DesignerPanel', {
    extend: 'YZSoft.bpa.DesignerPanelBase',
    requires: [
        'YZSoft.src.ux.File'
    ],
    layout: 'border',
    increaseStep: {
        x: 10,
        y: 10
    },
    shapes: {
        spriteSpace: 'YZSoft.bpm.src.flowchart.sprite',
        propertySpace: 'YZSoft.bpm.src.flowchart.property',
        categroys: [{
            title: RS.$('Process_NodeCat_General'),
            items: {
                Start: RS.$('Process_NodeName_Start'),
                Activity: RS.$('Process_NodeName_Activity'),
                FreeRouting: {
                    sprite: {
                        xclass: 'YZSoft.bpm.src.flowchart.sprite.FreeRouting',
                        text: RS.$('Process_NodeName_FreeRouting'),
                        drag: {
                            sprites: {
                                text: {
                                    text: RS.$('Process_NodeName_FreeRoutingNodeName')
                                }
                            },
                            property: {
                                xclass: 'YZSoft.bpm.src.flowchart.property.FreeRouting',
                                data: {
                                    Name: RS.$('Process_NodeName_FreeRoutingNodeName')
                                }
                            }
                        }
                    }
                },
                Decision: RS.$('Process_NodeName_Decision'),
                Condition: RS.$('Process_NodeName_Condition'),
                Split: RS.$('Process_NodeName_Split'),
                Join: RS.$('Process_NodeName_Join'),
                Inform: RS.$('Process_NodeName_Inform'),
                Notify: RS.$('All_Notify'),
                Snapshot: RS.$('Process_NodeName_Snapshot'),
                CallProcess: RS.$('Process_NodeName_CallProcess'),
                End: RS.$('Process_NodeName_End')
            }
        }, {
            title: RS.$('Process_NodeCat_Adapter'),
            items: {
                ESBAdapter: RS.$('Process_NodeName_ESBAdapter'),
                DBAdapter: RS.$('Process_NodeName_DBAdapter'),
                XMLAdapter: RS.$('Process_NodeName_XMLAdapter'),
                FileAdapter: RS.$('Process_NodeName_FileAdapter')
            }
        }, {
            title: RS.$('Process_NodeCat_Trigger'),
            items: {
                TimeTrigger: RS.$('Process_NodeName_TimeTrigger'),
                FileTrigger: RS.$('Process_NodeName_FileTrigger')
            }
        }, {
            title: RS.$('Process_NodeCat_Enterprise'),
            items: {
                Interface: RS.$('Process_NodeName_Interface'),
                CallInterface: RS.$('Process_NodeName_CallInterface')
            }
        }, {
            title: RS.$('Process_NodeCat_Plugin'),
            items: {
                SQLPlugin: RS.$('Process_NodeName_SQLPlugin'),
                CodePlugin: RS.$('Process_NodeName_CodePlugin'),
                DllPlugin: RS.$('Process_NodeName_DllPlugin')
            }
        }]
    },
    flag: false,
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            shapes = config.shapes || me.shapes,
            cfg;

        me.drawContainer = Ext.create('YZSoft.bpm.process.admin.DesignContainer', {
            minWidth: 3000,
            minHeight: 1000,
        });

        me.pnlDesignContainer = Ext.create('Ext.container.Container', {
            region: 'center',
            layout: 'fit',
            scrollable: true,
            items: [me.drawContainer]
        });

        me.toolPanel = Ext.create('YZSoft.bpm.process.admin.SpriteBar', {
            region: 'west',
            width: 95,
            border: false,
            split: {
                size: 5,
                collapseOnDblClick: false,
                collapsible: true
            },
            shapes: me.shapes,
            listeners: {
                dragSprite: function (e, sprite) {
                    me.drawContainer.designPlugin.beginDragDropNewSprite(e, sprite, me.toolPanel, { right: 5 });
                }
            }
        });

        me.menuSave = Ext.create('Ext.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-save',
            text: RS.$('All_Save'),
            disabled: config.readOnly,
            handler: function () {
                me.save();
            }
        });

        me.menuExportPdf = Ext.create('Ext.menu.Item', {
            glyph: 0xeaeb,
            text: RS.$('All_Draw_Export_Pdf'),
            handler: function () {
                me.exportPdf();
            }
        });

        me.menuExportPng = Ext.create('Ext.menu.Item', {
            glyph: 0xeaea,
            text: RS.$('All_Draw_Export_Png'),
            handler: function () {
                me.exportPng();
            }
        });

        me.menuExportFlo = Ext.create('Ext.menu.Item', {
            glyph: 0xeaec,
            text: RS.$('All_Flow_Export_flo'),
            handler: function () {
                var process = me.drawContainer.saveProcess();
                YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
                    method: 'SaveProcessAsFile',
                    fileName: (me.fileinfo.processName || me.getTitle()) + '.flo',
                    process: Ext.util.Base64.encode(Ext.encode(process))
                });
            }
        });

        me.menuOpenFromFile = Ext.create('YZSoft.src.menu.OpenFile', {
            glyph: 0xeaec,
            text: RS.$('All_Flow_Import_flo'),
            disabled: config.readOnly,
            upload: {
                fileTypes: '*.flo',
                typesDesc: RS.$('All_FileTypeDesc_Flo'),
                fileSizeLimit: '100 MB',
                params: {
                    Method: 'LoadFloFile'
                },
                loadMask: {
                    msg: RS.$('All_Loading'),
                    target: me
                }
            },
            listeners: {
                fileQueued: function (file) {
                    me.menuOpenFromFile.undoStep = me.drawContainer.createUndoStep(Ext.String.format('Load {0}', file.name));
                },
                uploadSuccess: function (file, data) {
                    me.loadFromFile(data);
                    me.drawContainer.commitUndoStep(me.menuOpenFromFile.undoStep);
                }
            }
        });

        me.menuFile = Ext.create('Ext.menu.Menu', {
            defaults: {
                padding: '0 16 0 3'
            },
            items: [
                me.menuSave,
                '-',
                me.menuExportPdf,
                me.menuExportPng,
                me.menuExportFlo,
                '-',
                me.menuOpenFromFile
            ]
        });

        me.btnFile = Ext.create('Ext.button.Button', {
            ui: 'default-toolbar',
            iconCls: 'yz-glyph yz-glyph-e925',
            text: RS.$('All_Menu_File'),
            disabled: false,
            menu: me.menuFile
        });

        me.btnSave = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-save',
            text: RS.$('All_Save'),
            disabled: config.readOnly,
            handler: function () {
                me.save();
            }
        });

        me.btnHAlignStart = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e630 yz-dark',
            tooltip: RS.$('All_HAlign_Start'),
            scope: me,
            handler: 'onHAlignStart'
        });

        me.btnHAlignMiddle = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e62a yz-dark',
            tooltip: RS.$('All_HAlign_Middle'),
            scope: me,
            handler: 'onHAlignMiddle'
        });

        me.btnHAlignEnd = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e62f yz-dark',
            tooltip: RS.$('All_HAlign_End'),
            scope: me,
            handler: 'onHAlignEnd'
        });

        me.btnVAlignStart = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e62c yz-dark',
            tooltip: RS.$('All_VAlign_Start'),
            scope: me,
            handler: 'onVAlignStart'
        });

        me.btnVAlignMiddle = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e62e yz-dark',
            tooltip: RS.$('All_VAlign_Middle'),
            scope: me,
            handler: 'onVAlignMiddle'
        });

        me.btnVAlignEnd = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e62d yz-dark',
            tooltip: RS.$('All_VAlign_End'),
            scope: me,
            handler: 'onVAlignEnd'
        });

        me.btnHSpaceAlign = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e645 yz-dark',
            tooltip: RS.$('All_HSpace_Align'),
            scope: me,
            handler: 'onHSpaceAlign'
        });

        me.btnHSpaceInc = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e902 yz-dark',
            tooltip: RS.$('All_HSpace_Inc'),
            scope: me,
            handler: 'onHSpaceIncrease'
        });

        me.btnHSpaceDec = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e904 yz-dark',
            reference: 'btnHSpaceDec',
            tooltip: RS.$('All_HSpace_Dec'),
            scope: me,
            handler: 'onHSpaceDecrease'
        });

        me.btnHSpaceRemove = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e640 yz-dark',
            tooltip: RS.$('All_HSpace_Remove'),
            scope: me,
            handler: 'onHSpaceRemove'
        });

        me.btnVSpaceAlign = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e644 yz-dark',
            tooltip: RS.$('All_VSpace_Align'),
            scope: me,
            handler: 'onVSpaceAlign'
        });

        me.btnVSpaceInc = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e901 yz-dark',
            tooltip: RS.$('All_VSpace_Inc'),
            scope: me,
            handler: 'onVSpaceIncrease'
        });

        me.btnVSpaceDec = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e903 yz-dark',
            tooltip: RS.$('All_VSpace_Dec'),
            scope: me,
            handler: 'onVSpaceDecrease'
        });

        me.btnVSpaceRemove = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e63f yz-dark',
            tooltip: RS.$('All_VSpace_Remove'),
            scope: me,
            handler: 'onVSpaceRemove'
        });

        me.pickerFontFamily = Ext.create('YZSoft.src.button.FontFamilyPicker', {
            iconCls: 'yz-glyph yz-glyph-e63a',
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
            padding:0,
            listConfig: {
                cls: ['yz-boundlist-picker', 'yz-boundlist-picker-simple', 'yz-size-s'],
                maxHeight: 600,
                minWidth: 50
            },
            width: 50,
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
            iconCls: 'yz-glyph yz-glyph-ea62 yz-dark',
            //iconCls: 'yz-designer-icon-bold',
            tooltip: RS.$('All_Bold'),
            enableToggle: true,
            handler: function () {
                me.onBoldPressed(this, this.pressed);
            }
        });


        me.btnItalic = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e638 yz-dark',
            //iconCls: 'yz-designer-icon-italic',
            tooltip: RS.$('All_Italic'),
            enableToggle: true,
            handler: function () {
                me.onItalicPressed(this, this.pressed);
            }
        });

        me.btnUnderline = Ext.create('Ext.button.Button', {
            iconCls: 'yz-designer-icon-underline yz-designer-icon-light',
            tooltip: RS.$('All_Underline'),
            hidden: true,
            enableToggle: true,
            handler: function () {
                me.onUnderlinePressed(this, this.pressed);
            }
        });

        me.btnFontColor = Ext.create('YZSoft.src.button.ColorPickerExt', {
            iconCls: 'yz-designer-icon-fontcolor yz-designer-icon-light',
            padding:'2 4',
            tooltip: RS.$('All_FontColor'),
            value: '#000000',
            listeners: {
                scope: me,
                picked: 'onFontColorPicked'
            }
        });

        me.btnFontBgColor = Ext.create('YZSoft.src.button.ColorPickerExt', {
            iconCls: 'yz-designer-icon-fontbgcolor yz-designer-icon-light',
            tooltip: RS.$('All_TextBackground'),
            hidden: true,
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

        me.btnLineWidth = Ext.create('YZSoft.src.button.LineWidthPicker', {
            tooltip: RS.$('All_LineWidth'),
            iconCls: 'yz-glyph yz-glyph-e900 yz-dark',
            listeners: {
                scope: me,
                picked: 'onLineWidthPicked'
            }
        });

        me.btnLineStyle = Ext.create('YZSoft.src.button.LineStylePicker', {
            tooltip: RS.$('All_LineStyle'),
            iconCls: 'yz-glyph yz-glyph-e635 yz-dark',
            listeners: {
                scope: me,
                picked: 'onLineStylePicked'
            }
        });

        me.btnLineColor = Ext.create('YZSoft.src.button.ColorPickerExt', {
            tooltip: RS.$('All_LineColor'),
            iconCls: 'yz-glyph yz-glyph-e637 yz-dark',
            value: '#000000',
            listeners: {
                scope: me,
                picked: 'onLineColorPicked'
            }
        });

        me.btnUndo = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e908 yz-dark',
            tooltip: RS.$('All_Undo'),
            handler: function () {
                me.drawContainer.undo();
            }
        });

        me.btnRedo = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e906 yz-dark',
            tooltip: RS.$('All_Redo'),
            handler: function () {
                me.drawContainer.redo();
            }
        });

        me.txtVersion = Ext.create('Ext.toolbar.TextItem', {
            margin: '0 6 0 0'
        });

        me.maxminbtn = Ext.create('Ext.Button', {
            iconCls: 'yz-glyph yz-glyph-e98b',
            tooltip: RS.$('All_Window_Maximize'),
            disabled: false,
            scope: me,
            handler: function () {
                if (me.yzmaximized) {
                    me.maxminbtn.setIconCls('yz-glyph yz-glyph-e98b');
                    me.maxminbtn.setTooltip(RS.$('All_Window_Maximize'));
                    me.yzrestore();
                }
                else {
                    me.maxminbtn.setIconCls('yz-glyph yz-glyph-e98c');
                    me.maxminbtn.setTooltip(RS.$('All_Window_Restore'));
                    me.yzmaximize();
                }
            }
        });

        cfg = {
            tbar: {
                cls: 'yz-tbar-module',
                style: 'border-bottom:solid 1px #eee!important;',
                padding:'3 6',
                defaults: {
                    padding: '4 4',
                    margin: '0 2 0 0',
                    disabled: true
                },
                items: [
                    me.btnFile,
                    me.btnSave,
                    { xtype: 'tbseparator', margin: '0 5 0 0', padding: 0 },
                    me.btnHAlignStart,
                    me.btnHAlignMiddle,
                    me.btnHAlignEnd,
                    { xtype: 'tbseparator', margin: '0 3 0 3', padding: 0 },
                    me.btnVAlignStart,
                    me.btnVAlignMiddle,
                    me.btnVAlignEnd,
                    { xtype: 'tbseparator', margin: '0 3 0 3', padding: 0 },
                    me.btnHSpaceAlign,
                    me.btnHSpaceInc,
                    me.btnHSpaceDec,
                    me.btnHSpaceRemove,
                    { xtype: 'tbseparator', margin: '0 3 0 3', padding: 0 },
                    me.btnVSpaceAlign,
                    me.btnVSpaceInc,
                    me.btnVSpaceDec,
                    me.btnVSpaceRemove,
                    { xtype: 'tbseparator', margin: '0 3 0 3', padding: 0 },
                    me.pickerFontFamily,
                    me.edtFontSize,
                    me.btnBold,
                    me.btnItalic,
                    me.btnUnderline,
                    me.btnFontColor,
                    me.btnFontBgColor,
                    { xtype: 'tbseparator', margin: '0 3 0 3', padding: 0 },
                    me.btnLineWidth,
                    me.btnLineStyle,
                    me.btnLineColor,
                    '-',
                    me.btnUndo,
                    me.btnRedo,
                    '->',
                    me.txtVersion,
                    me.maxminbtn
                ]
            },
            items: [me.toolPanel, me.pnlDesignContainer]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        Ext.apply(me, me.getReferences());

        me.on({
            single: true,
            afterLayout: function () {
                if (config.process)
                    me.openProcess(config.process);
            },
            afterRender: function () {
                Ext.defer(function () {
                    me.drawContainer.focus();
                }, 10);
            }
        });

        me.on({
            scope: me,
            beforeclose: 'onBeforeClose'
        });

        me.drawContainer.on({
            scope: me,
            selectionchange: 'updateStatus',
            keydown: function (e, t, eOpts) {
                e.stopEvent();

                var key = e.getKey();
                if (e.ctrlKey && key == e.S) {
                    if (me.readOnly)
                        return;
                    me.save();
                }
            }
        });

        me.drawContainer.undoManager.on({
            scope: me,
            change: 'updateUndoStatus'
        });
    },

    displayVersion: function (version) {
        this.txtVersion.version = version;
        this.txtVersion.update(version ? Ext.String.format('{0} : {1}', RS.$('All_Version'), version) : '');
    },

    newProcess: function (folder, data) {
        var me = this;

        me.drawContainer.newProcess(data);
        me.designMode = 'new';
        me.fileinfo = {
            folder: folder
        };

        me.displayVersion('1.0');
    },

    /*
    process
    {
    path
    version
    }
    */
    openProcess: function (process, config) {
        var me = this,
            processDefine;

        YZSoft.Ajax.request(Ext.apply({
            method: 'GET',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/ProcessAdmin.ashx'),
            params: Ext.apply({
                method: 'GetProcessDefine'
            }, process),
            waitMsg: {
                msg: RS.$('All_Loading'),
                target: me
            },
            success: function (action) {
                if (me.destroyed)
                    return;

                processDefine = action.result;
                me.drawContainer.loadProcess(processDefine);

                me.designMode = 'edit';
                me.fileinfo = {
                    path: process.path,
                    version: processDefine.Version,
                    processName: processDefine.Name
                };

                me.displayVersion(processDefine.Version);
            }
        }, config));
    },

    loadFromFile: function (process) {
        var me = this;

        me.drawContainer.loadProcess(process);

        if (me.designMode == 'new') {
            me.fileinfo.processName = process.Name;
        }
    },

    save: function (fn) {
        var me = this,
            dcnt = me.drawContainer,
            undoManager = dcnt.undoManager,
            dlg;

        if (me.designMode == 'edit') {
            var process = dcnt.saveProcess();

            Ext.create('YZSoft.bpm.process.admin.SaveProcessDlg', {
                autoShow: true,
                processName: me.fileinfo.processName,
                version: me.fileinfo.version,
                fn: function (action) {

                    YZSoft.Ajax.request({
                        method: 'POST',
                        url: YZSoft.$url('YZSoft.Services.REST/BPM/ProcessAdmin.ashx'),
                        params: {
                            method: action == 'Save' ? 'SaveProcess' : 'SaveProcessAsNewVersion',
                            path: me.fileinfo.path,
                            version: me.fileinfo.version
                        },
                        jsonData: process,
                        waitMsg: {
                            msg: RS.$('All_Saving'),
                            target: me,
                            start: 0,
                            stay: 300
                        },
                        success: function (action) {
                            undoManager.clearDirty();
                            me.updateUndoStatus();

                            Ext.copyTo(me.fileinfo, action.result, 'version');

                            me.displayVersion(action.result.version);

                            me.mask({
                                msg: RS.$('All_Save_Succeed'),
                                msgCls: 'yz-mask-msg-success',
                                autoClose: true,
                                fn: function () {
                                    me.fireEvent('processsaved', 'edit', process, action.result);
                                    fn && fn(process, action.result);
                                }
                            });
                            //YZSoft.alert(Ext.String.format(RS.$('All_PublishSuccess_Msg'),
                            //    action.result.server,
                            //    action.result.version),
                            //    RS.$('All_PublishSuccess'),
                            //    function () {
                            //        me.fireEvent('processsaved', 'edit', process, action.result);
                            //        fn && fn(process, action.result);
                            //    }
                            //);
                        },
                        failure: function (action) {
                            YZSoft.alert(action.result.errorMessage, function () {
                            });
                        }
                    });
                }
            });
        }

        if (me.designMode == 'new') {
            var process = dcnt.saveProcess();

            dlg = Ext.create('YZSoft.bpm.process.admin.SaveNewProcessDlg', {
                autoShow: true,
                autoClose: false,
                processName: me.fileinfo.processName,
                fn: function (processName) {

                    dlg.hide();
                    me.fileinfo.processName = processName;

                    YZSoft.Ajax.request({
                        method: 'POST',
                        url: YZSoft.$url('YZSoft.Services.REST/BPM/ProcessAdmin.ashx'),
                        params: {
                            method: 'PublishProcess',
                            folder: me.fileinfo.folder,
                            processName: processName
                        },
                        jsonData: process,
                        waitMsg: {
                            msg: RS.$('All_Saving'),
                            target: me,
                            start: 0,
                            stay: 300
                        },
                        success: function (action) {
                            Ext.destroy(dlg);

                            undoManager.clearDirty();

                            me.designMode = 'edit';
                            Ext.copyTo(me.fileinfo, action.result, 'path,version');

                            process.Name = processName;

                            me.setTitle(Ext.String.format('{0} - {1}', RS.$('All_ProcessDesign'), process.Name));
                            me.displayVersion(action.result.version);

                            me.mask({
                                msg: RS.$('All_Save_Succeed'),
                                msgCls: 'yz-mask-msg-success',
                                autoClose: true,
                                fn: function () {
                                    me.fireEvent('processsaved', 'new', process, action.result);
                                    fn && fn(process, action.result);
                                }
                            });

                            //YZSoft.alert(Ext.String.format(RS.$('All_PublishSuccess_Msg'),
                            //    action.result.server,
                            //    action.result.version),
                            //    RS.$('All_PublishSuccess'),
                            //    function () {
                            //        me.fireEvent('processsaved', 'new', process, action.result);
                            //        fn && fn(process, action.result);
                            //    }
                            //);
                        },
                        failure: function (action) {
                            YZSoft.alert(action.result.errorMessage, function () {
                                dlg.show();
                            });
                        }
                    });
                }
            });
        }
    },

    exportPdf: function () {
        var me = this,
            dcnt = me.drawContainer,
            processName = me.getTitle(),
            chart,process;

        chart = dcnt.saveChart({
            paddingTop: 30,
            paddingLeft: 30,
            paddingRight: 80,
            paddingBottom: 80
        });
        process = dcnt.saveProcess();

        YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
            method: 'ExportProcessAsPdf',
            fileName: processName,
            ext: '.flo',
            process: Ext.util.Base64.encode(Ext.encode(process)),
            chart: Ext.util.Base64.encode(Ext.encode(chart))
        });
    },

    exportPng: function () {
        var me = this,
            dcnt = me.drawContainer,
            processName = me.getTitle(),
            chart, process;

        chart = dcnt.saveChart({
            paddingTop: 30,
            paddingLeft: 30,
            paddingRight: 80,
            paddingBottom: 80
        });
        process = dcnt.saveProcess();

        YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
            method: 'ExportProcessAsPng',
            fileName: processName,
            ext: '.flo',
            process: Ext.util.Base64.encode(Ext.encode(process)),
            chart: Ext.util.Base64.encode(Ext.encode(chart))
        });
    },

    getShapes: function (sprites) {
        var rv = [];
        Ext.each(sprites, function (sprite) {
            if (sprite.isShape)
                rv.push(sprite);
        });

        return rv;
    },

    getLinks: function (sprites) {
        var rv = [];
        Ext.each(sprites, function (sprite) {
            if (sprite.isLink)
                rv.push(sprite);
        });

        return rv;
    },

    onLineStylePicked: function (lineDash) {
        var me = this,
            dcnt = me.drawContainer,
            sprites = dcnt.getSelection(),
            links = me.getLinks(sprites);

        dcnt.createUndoStep('Change Line Style', true);
        Ext.each(links, function (link) {
            link.setAttributes({
                lineDash: lineDash
            });
        });

        dcnt.renderFrame();
    },

    onLineColorPicked: function (color) {
        var me = this,
            dcnt = me.drawContainer,
            links = me.getLinks(dcnt.getSelection());

        dcnt.createUndoStep('Change Line Color', true);
        Ext.each(links, function (link) {
            link.setAttributes({
                strokeStyle: color
            });
        });

        dcnt.renderFrame();
    },

    updateStatus: function () {
        var me = this,
            dcnt = me.drawContainer,
            undoManager = dcnt.undoManager,
            sprites = dcnt.getSelection(),
            links = me.getLinks(sprites),
            shapes = me.getShapes(sprites),
            textSprite, linkSprite, items;

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

        //线条参照sprite
        linkSprite = links[0];
        items = [
            me.btnLineWidth,
            me.btnLineStyle,
            me.btnLineColor
        ];
        Ext.each(items, function (btn) {
            btn.setDisabled(!linkSprite);
        });

        if (Ext.isIE10m)
            me.btnLineStyle.setDisabled(true);

        if (linkSprite) {
            me.btnLineWidth.setLineWidth(linkSprite.attr.lineWidth);
            me.btnLineStyle.setLineStyle(linkSprite.attr.lineDash);
            me.btnLineColor.setColor(linkSprite.attr.strokeStyle);
        }

        //2个以上shape
        items = [
            me.btnHAlignStart,
            me.btnHAlignMiddle,
            me.btnHAlignEnd,
            me.btnVAlignStart,
            me.btnVAlignMiddle,
            me.btnVAlignEnd,
            me.btnHSpaceInc,
            me.btnHSpaceDec,
            me.btnHSpaceRemove,
            me.btnVSpaceInc,
            me.btnVSpaceDec,
            me.btnVSpaceRemove
        ];
        Ext.each(items, function (btn) {
            btn.setDisabled(shapes.length <= 1);
        });

        //3个以上shape
        items = [
            me.btnHSpaceAlign,
            me.btnVSpaceAlign
        ];
        Ext.each(items, function (btn) {
            btn.setDisabled(shapes.length <= 2);
        });

        me.updateUndoStatus();
    },

    updateUndoStatus: function () {
        var me = this,
            dcnt = me.drawContainer,
            undoManager = dcnt.undoManager,
            dirty = undoManager.getDirty();

        me.markDirty(dirty);
        me.btnUndo.setDisabled(!undoManager.canUndo());
        me.btnRedo.setDisabled(!undoManager.canRedo());
    },

    onBeforeClose: function () {
        var me = this,
            dcnt = me.drawContainer,
            undoManager = dcnt.undoManager,
            dirty = undoManager.getDirty();

        if (me.readOnly || !dirty) {
            return;
        }

        Ext.Msg.show({
            title: RS.$('All_DlgTitle_CloseConfirm'),
            msg: RS.$('All_ProcessDesigner_Close_Confirm'),
            buttons: Ext.Msg.YESNOCANCEL,
            defaultButton: 'yes',
            icon: Ext.Msg.INFO,
            buttonText: {
                yes: RS.$('All_Save'),
                no: RS.$('All_NotSave'),
                cancel: RS.$('All_Cancel')
            },
            fn: function (btn, text) {
                if (btn == 'cancel')
                    return;

                if (btn == 'no') {
                    me.suspendEvent('beforeclose');
                    me.close();
                    return;
                }

                me.save(function () {
                    me.suspendEvent('beforeclose');
                    me.close();
                });
            }
        });

        return false;
    }
});