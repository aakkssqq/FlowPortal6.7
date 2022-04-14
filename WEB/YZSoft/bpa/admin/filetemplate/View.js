/*
    path
*/
Ext.syncRequire('YZSoft.src.ux.EmptyText');
Ext.define('YZSoft.bpa.admin.filetemplate.View', {
    extend: 'Ext.view.View',
    requires: [
        'YZSoft.bpa.src.model.TemplateObject'
    ],
    scrollable: true,
    cls: 'yz-dataview-bpafolder',
    tpl: [
        '<tpl for=".">',
            '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-bpafile yz-dataview-item-bpafile-file">',
                '<div class="inner">',
                    '<img class="img" src="{url}">',
                '</div>',
                '<div class="txt">',
                    '{NameNoExt}',
                '</div>',
            '</div>',
        '</tpl>'
    ],
    overItemCls: 'yz-dataview-item-over',
    selectedItemCls: 'yz-dataview-item-selected',
    itemSelector: '.yz-dataview-item-bpafile',
    txtSelector: '.yz-dataview-item-bpafile .txt',
    emptyText: YZSoft.src.ux.EmptyText.normal.apply({
        text: RS.$('BPA_EmptyText_EmptyFolder')
    }),
    root: 'BPAModuleTemplates',
    excludes: '.png',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpa.src.model.TemplateObject',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/OSFileSystem.ashx'),
                extraParams: {
                    Method: 'GetFolderDocuments',
                    root: me.root,
                    excludes: me.excludes
                }
            }
        });

        me.dd = Ext.create('YZSoft.src.view.plugin.DragDrop', {
            dragZone: {
                getDragText: function () {
                    var dragZone = this,
                        data = dragZone.dragData,
                        record = data.records[0];

                    return record.data.NameNoExt;
                }
            }
        });

        cfg = {
            store: me.store,
            plugins: [me.dd]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

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

        me.on({
            scope: me,
            beforedrop: 'onBeforeItemDrop'
        });

        me.showFolder(config.path);
    },

    showFolder: function (path, config) {
        var me = this;

        me.store.load(Ext.apply({
            loadMask: false,
            params: {
                path: path
            },
            callback: function () {
                me.path = path;
            }
        }, config));
    },

    startRename: function (rec, context) {
        var me = this,
            el = Ext.get(me.getNode(rec)).down(me.txtSelector),
            dom = el.dom;

        context = context || {};
        context.record = rec;
        context.value = Ext.String.trim(dom.textContent || dom.innerText || dom.innerHTML);
        me.editor.context = context
        me.editor.startEdit(el);
    },

    onRenameComplete: function (editor, value, startValue, eOpts) {
        var me = this,
            rec = editor.context.record,
            maskTarget = editor.context.maskTarget || me,
            params;

        value = Ext.String.trim(value || '');
        if (value == startValue || !value)
            return;

        var err = $objname(value);
        if (err !== true) {
            YZSoft.alert(err);
            return;
        }

        startValue += rec.data.Ext;
        value += rec.data.Ext;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/OSFileSystem.ashx'),
            params: {
                method: 'RenameFile',
                root: me.root,
                path: me.path,
                name: startValue,
                newname: value
            },
            waitMsg: { msg: RS.$('All_Renaming'), target: maskTarget },
            success: function (action) {
                rec.set(action.result);
            }
        });
    },

    addFile: function (config) {
        var me = this;

        Ext.create('YZSoft.bpa.src.dialogs.SelFileDlg', Ext.apply({
            autoShow: true,
            fn: function (file) {
                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/OSFileSystem.ashx'),
                    params: {
                        method: 'AddFileFromFileSystem',
                        thumbnail: true,
                        root: me.root,
                        path: me.path,
                        fileid: file.FileID
                    },
                    success: function (action) {
                        me.store.reload({
                            callback: function (records, options, success) {
                                var rec = Ext.Array.findBy(records, function (rec) {
                                    return rec.data.Name == action.result.Name;
                                });

                                if (rec)
                                    me.getSelectionModel().select(rec);
                            }
                        });
                    }
                });
            }
        }, config));
    },

    deleteRecords: function (recs, opt) {
        var me = this,
            names = [], displayNames = [];

        Ext.each(recs, function (rec) {
            names.push(rec.data.Name);
            displayNames.push(rec.data.DisplayName);
        });

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: Ext.String.format(RS.$('BPA_Msg_DeleteTemplateCfm'), displayNames.join(';')),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/OSFileSystem.ashx'),
                    params: {
                        method: 'DeleteFiles',
                        root: me.root,
                        path: me.path
                    },
                    jsonData: names,
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

    onBeforeItemDrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
        var me = this,
            record = overModel,
            filenames = [];

        Ext.Array.each(data.records, function (rec) {
            filenames.push(rec.getId());
        });

        dropHandlers.wait = true;
        YZSoft.Ajax.request({
            method: 'POST',
            exception: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/OSFileSystem.ashx'),
            waitMsg: {
                msg: RS.$('All_Moving'),
                target: Ext.getBody()
            },
            params: {
                method: 'MoveFiles',
                root: me.root,
                path: me.path,
                excludes: me.excludes,
                tergetfilename: record.getId(),
                position: dropPosition
            },
            jsonData: filenames,
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