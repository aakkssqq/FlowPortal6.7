
Ext.define('YZSoft.bpa.group.libs.GroupsView', {
    extend: 'Ext.view.View',
    requires: [
        'YZSoft.src.model.Group'
    ],
    scrollable: true,
    cls: 'bpa-dataview-group',
    tpl: [
        '<tpl for=".">',
            '<div class="yz-dataview-item yz-dataview-item-block bpa-dataview-item-lib bpa-dataview-item-group">',
                '<div class="inner">',
                    '<img  class="img" src="{ImageUrl}"></img>',
                '</div>',
                '<div class="txt">',
                    '{Name:text}',
                '</div>',
            '</div>',
        '</tpl>'
    ],
    overItemCls: 'yz-dataview-item-over',
    selectedItemCls: 'yz-dataview-item-selected',
    itemSelector: '.bpa-dataview-item-lib',
    txtSelector: '.bpa-dataview-item-lib .txt',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.src.model.Group',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                extraParams: {
                    Method: 'GetUserGroups',
                    groupType: 'BPATeam'
                }
            }
        });

        cfg = {
            store: me.store
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.store.load({});

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
            groupids = [],
            maskTarget = opt.maskTarget || me;

        Ext.each(recs, function (rec) {
            groupids.push(rec.data.GroupID);
            names.push(rec.data.Name);
        });

        Ext.Msg.show({
            title: RS.$('BPA_Title_Disband'),
            msg: Ext.String.format(RS.$('BPA_Msg_Disband'), names.join(';')),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                    params: {
                        method: 'DisbandGroups'
                    },
                    jsonData: {
                        groupids: groupids
                    },
                    waitMsg: {
                        msg: RS.$('BPA_LoadMask_Disbanding'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        me.store.reload({
                            loadMask: {
                                msg: RS.$('BPA_Toast_Disbanded'),
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
            url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
            params: {
                method: 'RenameGroup',
                groupid: rec.data.GroupID,
                newName: value
            },
            waitMsg: {
                msg: RS.$('All_Renaming'),
                target: maskTarget
            },
            success: function (action) {
                rec.set('Name', value);
            }
        });
    },

    edit: function (record) {
        var me = this;

         Ext.create('YZSoft.app.group.GroupDlg', {
            title: record.data.Name,
            autoShow: true,
            autoClose: false,
            groupid: record.data.GroupID,
            fn: function (data) {
                var dlg = this;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                    params: {
                        method: 'UpdateGroup',
                        groupid: record.data.GroupID
                    },
                    jsonData: {
                        data: data
                    },
                    waitMsg: {
                        msg: RS.$('All_LoadMask_Updating'),
                        target: dlg,
                        start: 0
                    },
                    success: function (action) {
                        me.store.reload({
                            loadMask: {
                                msg: RS.$('All_Toast_Updated'),
                                msgCls: 'yz-mask-msg-success',
                                target: dlg,
                                start: 0
                            },
                            callback: function () {
                                dlg.close();
                            }
                        });
                    }
                });
            }
        });
    },

    addnew: function () {
        var me = this;

        Ext.create('YZSoft.app.group.GroupDlg', {
            title: RS.$('BPA_AddGroup'),
            autoShow: true,
            autoClose: false,
            fn: function (data) {
                var dlg = this;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                    waitMsg: {
                        msg: RS.$('All_LoadMask_Creating'),
                        target: dlg,
                        start: 0
                    },
                    params: {
                        method: 'CreateGroup',
                        groupType: 'BPATeam',
                        FolderID: 'BPAGroup',
                        DocumentFolderID: 'BPAGroupFile'
                    },
                    jsonData: {
                        data: data
                    },
                    success: function (action) {
                        me.store.reload({
                            loadMask: {
                                msg: RS.$('All_Toast_Created'),
                                msgCls: 'yz-mask-msg-success',
                                target: dlg,
                                start: 0
                            },
                            callback: function (records, options, success) {
                                var sm = me.getSelectionModel(),
                                    rec = me.store.getById(action.result.GroupID);

                                dlg.close();

                                if (rec)
                                    sm.select(rec);
                            }
                        });
                    }
                });
            }
        });
    }
});