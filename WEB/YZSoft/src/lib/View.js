
Ext.define('YZSoft.src.lib.View', {
    extend: 'Ext.view.View',
    requires: [
        'YZSoft.src.model.Library'
    ],
    scrollable: true,
    libType:'',

    constructor: function (config) {
        var me = this,
            cfg;

        me.dd = Ext.create('YZSoft.src.view.plugin.DragDrop', {
            dragZone: {
                getDragText: function () {
                    var dragZone = this,
                        data = dragZone.dragData,
                        record = data.records[0];

                    return record.data.ProcesssName;
                }
            }
        });

        cfg = {
            plugins: [me.dd]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            beforedrop: 'onBeforeItemDrop'
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

    $refresh: function (config) {
        this.store.reload(Ext.apply({
            loadMask: true
        }, config));
    },

    deleteRecords: function (recs, opt) {
        var me = this,
            names = [],
            libids = [],
            maskTarget = opt.maskTarget || me;

        Ext.each(recs, function (rec) {
            libids.push(rec.data.LibID);
            names.push(rec.data.Name);
        });

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: Ext.String.format(RS.$('All_Msg_DeleteConfirm'), names.join(';')),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/Library.ashx'),
                    params: {
                        method: 'DeleteLibraries'
                    },
                    jsonData: {
                        libids: libids
                    },
                    waitMsg: {
                        msg: RS.$('All_Deleting'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        me.store.reload({
                            loadMask: {
                                msg: RS.$('All_Success_Delete'),
                                msgCls: 'yz-mask-msg-success',
                                target: me,
                                start: 0
                            }
                        });
                    }
                });
            }
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

    onRenameComplete: function (editor, value, startValue, eOpts) {
        var me = this,
            rec = editor.context.record,
            maskTarget = editor.context.maskTarget || me,
            params;

        value = Ext.String.trim(value || '');
        if (value == startValue || !value)
            return;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Library.ashx'),
            params: {
                method: 'RenameLibrary',
                libid: rec.data.LibID,
                newName: value
            },
            waitMsg: { msg: RS.$('All_Renaming'), target: maskTarget },
            success: function (action) {
                rec.set('Name', value);
            }
        });
    },

    onBeforeItemDrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
        var me = this,
            record = overModel,
            libids = [];

        Ext.Array.each(data.records, function (rec) {
            libids.push(rec.data.LibID);
        });

        dropHandlers.wait = true;
        YZSoft.Ajax.request({
            method: 'POST',
            exception: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Library.ashx'),
            waitMsg: {
                msg: RS.$('All_Moving'),
                target: me
            },
            params: {
                method: 'MoveLibraries',
                libType: me.libType,
                targetlibid: record.data.LibID,
                position: dropPosition
            },
            jsonData: libids,
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