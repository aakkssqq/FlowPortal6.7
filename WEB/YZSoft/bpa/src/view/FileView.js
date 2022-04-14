/*
    
*/
Ext.syncRequire('YZSoft.src.ux.EmptyText');
Ext.define('YZSoft.bpa.src.view.FileView', {
    extend: 'Ext.view.View',
    requires: [
        'YZSoft.bpa.src.model.FolderObject'
    ],
    scrollable: true,
    cls: 'yz-dataview-bpafolder',
    tpl: [
        '<tpl for=".">',
            '<tpl if="isFolder">',
                '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-bpafile yz-dataview-item-bpafile-folder">',
                    '<div class="inner">',
                    '</div>',
                    '<div class="txt">',
                        '{Name}',
                    '</div>',
                '</div>',
            '</tpl>',
            '<tpl if="isFile">',
                '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-bpafile yz-dataview-item-bpafile-file">',
                    '<div class="inner">',
                        '<img class="img" src="{url}">',
                    '</div>',
                    '<div class="txt">',
                        '{Name}',
                    '</div>',
                '</div>',
            '</tpl>',
        '</tpl>'
    ],
    overItemCls: 'yz-dataview-item-over',
    selectedItemCls: 'yz-dataview-item-selected',
    itemSelector: '.yz-dataview-item-bpafile',
    txtSelector: '.yz-dataview-item-bpafile .txt',
    emptyText: YZSoft.src.ux.EmptyText.normal.apply({
        text: RS.$('BPA_EmptyText_EmptyFolder')
    }),
    dblClickOpenFolder: true,

    constructor: function (config) {
        var me = this,
            checkpermision = config.checkpermision,
            securitymodel = config.securitymodel,
            itemdragable = config.itemdragable === false ? false:true,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            autoLoad: false,
            model: 'YZSoft.bpa.src.model.FolderObject',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                extraParams: {
                    Method: 'GetFolderObjects',
                    checkpermision: checkpermision,
                    securitymodel: securitymodel,
                    folder: true,
                    file: true
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                load: function (store, records, successful, operation, eOpts) {
                    if (successful) {
                        me.folderType = operation.getProxy().getReader().metaData.FolderType;
                        me.folderid = operation.getRequest().getParams().folderid;
                        me.fireEvent('folderChanged', me.folderid);
                    }
                }
            }
        });

        me.dd = Ext.create('YZSoft.src.view.plugin.DragDrop', {
            enableDrag: itemdragable,
            enableDrop: itemdragable,
            dragZone: {
                isPreventDrag: function (e, record, item, index) {
                    return !record.data.isFile;
                },
                getDragText: function () {
                    var dragZone = this,
                        data = dragZone.dragData,
                        record = data.records[0];

                    return record.data.Name;
                }
            }
        });

        cfg = {
            store: me.store,
            plugins: [me.dd]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        //if (!Ext.isEmpty(config.folderid))
        //    me.showFolder(config.folderid);

        me.on({
            scope: me,
            nodedragover: 'onNodeDragOver',
            containerdragover: 'onContainerDragOver',
            beforedrop: 'onBeforeItemDrop',
            itemdblclick: function (view, record) {
                if (record.data.isFolder)
                    me.onDblClickFolder(record);
                else
                    me.onDblClickFile(record);
            }
        });

        me.editor = new Ext.Editor({
            updateEl: false,
            shadow: false,
            alignment: 'l-l',
            autoSize: {
                width: 'boundEl'
            },
            field: {
                xtype: 'textfield'
            }
        });

        me.editor.on({
            scope: me,
            complete: 'onRenameComplete'
        });
    },

    startEdit: function (rec, context) {
        var me = this,
            el = Ext.get(me.getNode(rec)).down(me.txtSelector),
            dom = el.dom;

        context = context || {};
        context.record = rec;
        context.value = Ext.String.trim(dom.textContent || dom.innerText || dom.innerHTML);
        me.editor.context = context
        me.editor.startEdit(el);
    },

    showFolder: function (folderid, config) {
        var me = this;

        me.store.load(Ext.apply({
            loadMask: false,
            params: {
                folderid: folderid
            }
        }, config));
    },

    $refresh: function () {
        this.store.reload({
            loadMask: true
        });
    },

    onDblClickFolder: function (record) {
        var me = this;

        if (me.dblClickOpenFolder !== false) {
            me.showFolder(record.data.FolderID, {
                loadMask: false
            });
        }
    },

    onDblClickFile: function (record) {
    },

    onRenameComplete: function (editor, value, startValue, eOpts) {
        var me = this,
            rec = editor.context.record,
            maskTarget = editor.context.maskTarget || me,
            params;

        value = Ext.String.trim(value || '');
        if (value == startValue || !value)
            return;

        if (rec.data.isFile) {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/Attachment/Assist.ashx'),
                params: {
                    method: 'RenameFile',
                    fileid: rec.data.FileID,
                    newName: value
                },
                waitMsg: { msg: RS.$('All_Renaming'), target: maskTarget },
                success: function (action) {
                    rec.set('Name', value);
                }
            });
        }
        else {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                params: {
                    method: 'RenameFolder',
                    folderid: rec.data.FolderID,
                    newName: value
                },
                waitMsg: { msg: RS.$('All_Renaming'), target: maskTarget },
                success: function (action) {
                    rec.set('Name', value);
                }
            });
        }
    },

    newFolder: function () {
        var me = this;

        Ext.create('YZSoft.bpa.src.dialogs.NewFolderDlg', {
            autoShow: true,
            fn: function (name) {
                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                    params: {
                        method: 'CreateFolder',
                        folderid: me.folderid,
                        name: name
                    },
                    waitMsg: { msg: RS.$('All_CreatingFolder'), target: me },
                    success: function (action) {
                        var folderid = action.result.folderid;
                        me.store.reload({
                            loadMask: false,
                            callback: function (records, options, success) {
                                var rec;

                                rec = Ext.Array.findBy(records, function (rec) {
                                    return rec.data.isFolder && rec.data.FolderID == folderid;
                                });

                                if (rec)
                                    me.getSelectionModel().select(rec);
                            }
                        });
                    }
                });
            }
        });
    },

    shareFiles: function (recs, opt) {
        var me = this,
            fileids = [],
            folderid = opt.folderid;

        Ext.each(recs, function (rec) {
            if (rec.data.isFile)
                fileids.push(rec.data.FileID);
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPA/Library.ashx'),
            params: {
                method: 'ShareFiles',
                folderid: folderid
            },
            jsonData: {
                fileids: fileids
            },
            waitMsg: {
                msg: RS.$('All_Publishing'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.mask({
                    msg: RS.$('All_Published'),
                    msgCls: 'yz-mask-msg-success',
                    autoClose: 'xx'
                });
            }
        });
    },

    deleteRecords: function (recs, opt) {
        var me = this,
            names = [],
            fileids = [],
            folderids = [],
            maskTarget = opt.maskTarget || me;

        Ext.each(recs, function (rec) {
            if (rec.data.isFile)
                fileids.push(rec.data.ID);
            else
                folderids.push(rec.data.FolderID);

            names.push(rec.data.Name);
        });

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: Ext.String.format(RS.$('BPA_Msg_DeleteFile'), names.join(';')),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                    params: {
                        method: 'DeleteObjects'
                    },
                    jsonData: {
                        fileids: fileids,
                        folderids: folderids
                    },
                    waitMsg: {
                        msg: RS.$('All_Deleting'),
                        target: me,
                        start:0
                    },
                    success: function (action) {
                        me.store.remove(recs);
                    }
                });
            }
        });
    },

    cloneFile: function (rec) {
        var me = this,
            fileid = rec.data.ID;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
            params: {
                method: 'CloneFile',
                fileid: fileid
            },
            waitMsg: {
                msg: RS.$('All_Cloneing'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.store.reload({
                    loadMask: {
                        msg: RS.$('All_Copyed'),
                        msgCls: 'yz-mask-msg-success',
                        target: me,
                        start: 0
                    },
                    callback:function() {
                        var rec = me.store.getById(action.result.id);
                        if (rec)
                            me.getSelectionModel().select(rec);
                    }
                });
            }
        });
    },

    moveObjectsToFolder: function (moveroot, folderid, recs) {
        var me = this,
            fileids = [],
            folderids = [];

        Ext.each(recs, function (rec) {
            if (rec.data.isFolder)
                folderids.push(rec.data.FolderID);
            else
                fileids.push(rec.data.ID);
        });

        Ext.create('YZSoft.src.dialogs.SelFolderDlg', {
            autoShow: true,
            title: RS.$('All_MoveTo'),
            excludeModel: folderids.length ? 'moveFolderExclude' : 'moveFileExclude',
            excludeFolderIds: [folderid],
            storeConfig: {
                root: moveroot
            },
            fn: function (recTarget) {
                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                    params: {
                        method: 'MoveObjectsToFolder',
                        targetfolderid: recTarget.getId()
                    },
                    jsonData: {
                        fileids: fileids,
                        folderids: folderids
                    },
                    waitMsg: {
                        msg: RS.$('All_Moving'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        me.mask({
                            msg: Ext.String.format(RS.$('All_Copy_Success_Multi'),fileids.length + folderids.length),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: 'xx',
                            fn: function () {
                                me.store.remove(recs);
                            }
                        });
                    }
                });
            }
        });
    },

    editFile: function (record, xclass, config) {
        var me = this,
            xclass = xclass || 'YZSoft.bpa.DesignerPanel',
            panel;

        Ext.syncRequire('YZSoft.bpa.Categories');
        panel = Ext.create(xclass, Ext.apply({
            border: false,
            closable: true,
            header: false,
            categories: [],
            allCategories: YZSoft.bpa.Categories.getCategoriesFromExt(record.data.Ext),
            groupInfo: me.groupInfo,
            process: {
                fileid: record.data.FileID,
                fileName: record.data.Name
            },
            listeners: {
                close: function () {
                    YZSoft.frame.getLayout().prev();
                },
                processsaved: function () {
                    me.store.reload({
                        loadMask: false
                    });
                }
            }
        }, config));

        YZSoft.frame.add(panel);
        YZSoft.frame.setActiveItem(panel);
    },

    viewFile: function (record) {
        this.editFile(record, 'YZSoft.bpa.ViewerPanel');
    },

    newFile: function () {
        var me = this,
            folderid = me.folderid,
            panel;

        Ext.syncRequire('YZSoft.bpa.Categories');
        Ext.create('YZSoft.bpa.src.dialogs.NewFileDlg', {
            autoShow: true,
            folderid: folderid,
            fn: function (rec) {
                var templateDefine;

                YZSoft.Ajax.request({
                    async: false,
                    url: YZSoft.$url('YZSoft.Services.REST/BPA/Templates.ashx'),
                    params: {
                        method: 'GetTemplateDefine',
                        path: rec.data.Path,
                        name: rec.data.Name
                    },
                    success: function (action) {
                        templateDefine = action.result;
                    }
                });

                panel = Ext.create('YZSoft.bpa.DesignerPanel', {
                    border: false,
                    closable: true,
                    header: false,
                    categories: templateDefine.categories,
                    ext: rec.data.Ext,
                    allCategories: YZSoft.bpa.Categories.getCategoriesFromExt(rec.data.Ext),
                    groupInfo: me.groupInfo,
                    designMode: 'new',
                    listeners: {
                        close: function () {
                            YZSoft.frame.getLayout().prev();
                        },
                        processsaved: function (drawContainer, mode, process, result) {
                            me.store.reload({
                                loadMask: false,
                                callback: function (records) {
                                    if (result.fileid) {
                                        var rec;

                                        rec = Ext.Array.findBy(records, function (rec) {
                                            return rec.data.isFile && rec.data.FileID == result.fileid;
                                        });

                                        if (rec)
                                            me.getSelectionModel().select(rec);
                                    }
                                }
                            });
                        }
                    }
                });

                panel.newProcess(folderid, templateDefine);

                YZSoft.frame.add(panel);
                YZSoft.frame.setActiveItem(panel);
            }
        });
    },

    onNodeDragOver: function (targetNode, position, dragData, e, eOpts) {
        return !targetNode.data.isFolder;
    },

    onContainerDragOver: function (dragData, e, eOpts) {
        return false;
    },

    onBeforeItemDrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
        var me = this,
            record = overModel,
            fileids = [];

        Ext.Array.each(data.records, function (rec) {
            fileids.push(rec.data.ID);
        });

        dropHandlers.wait = true;
        YZSoft.Ajax.request({
            method: 'POST',
            exception: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
            waitMsg: {
                msg: RS.$('All_Moving'),
                target: me
            },
            params: {
                method: 'MoveFiles',
                folderid: record.data.FolderID,
                targetfileid: record.data.ID,
                position: dropPosition
            },
            jsonData: fileids,
            success: function (action) {
                dropHandlers.processDrop();
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
                dropHandlers.cancelDrop();
            }
        });
    }
});