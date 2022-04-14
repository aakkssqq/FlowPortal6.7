
Ext.define('YZSoft.bpm.src.editor.TaskRuleDelegationField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.bpm.src.model.Participant'],
    //height: 137,

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.Participant',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            border: true,
            flex: 1,
            selModel: { mode: 'SINGLE' },
            columns: {
                defaults: {
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { text: RS.$('All_Delegator_ApplyByOrder'), dataIndex: 'RuntimeDisplayString', flex: 1 }
                ]
            },
            listeners: {
                rowdblclick: function (grid, rec) {
                    me.edit(rec);
                }
            }
        });

        me.btnAdd = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Add'),
            handler: function () {
                YZSoft.SelUsersDlg.show({
                    fn: function (users) {
                        var recps = [];

                        Ext.each(users, function (user) {
                            recps.push({
                                ParticipantType: 'SpecifiedUser',
                                SParam1: user.Account,
                                LParam1: 5
                            });
                        });

                        me.addRecords(recps);
                    }
                });
            }
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Edit'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canEdit());
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length != 1)
                    return;

                me.edit(recs[0]);
            }
        });

        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Remove'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canDelete());
            },
            handler: function () {
                me.grid.removeAllSelection();
            }
        });

        me.btnMoveUp = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_MoveUp'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canMoveUp());
            },
            handler: function () {
                me.grid.moveSelectionUp();
            }
        });

        me.btnMoveDown = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_MoveDown'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canMoveDown());
            },
            handler: function () {
                me.grid.moveSelectionDown();
            }
        });

        me.btnAdv = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Advanced'),
            margin: 0,
            handler: function () {
                Ext.create('YZSoft.bpm.src.dialogs.ParticipantDlg', {
                    autoShow: true,
                    title: RS.$('All_SettingDelegator'),
                    fn: function (recp) {
                        me.grid.addRecords(recp);
                    }
                });
            }
        });

        me.panel = Ext.create('Ext.panel.Panel', {
            width: 'auto',
            bodyStyle: 'background-color:transparent',
            padding: '0 0 0 10',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            border: false,
            defaults: {
                padding: '5 10',
                margin: '0 0 3 0'
            },
            items: [
                me.btnAdd,
                me.btnEdit,
                me.btnDelete,
                me.btnMoveUp,
                me.btnMoveDown,
                me.btnAdv
            ]
        });

        cfg = {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            bodyStyle: 'background-color:transparent',
            border: false,
            items: [me.grid, me.panel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    addRecords: function (datas) {
        var me = this;

        if (!datas)
            return;

        if (!Ext.isArray(datas))
            datas = [datas];

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Participant.ashx'),
            params: { method: 'CheckParticipant' },
            jsonData: datas,
            success: function (action) {
                var recps = action.result,
                    datas = [];

                Ext.each(recps, function (recp) {
                    if (recp.IsValid)
                        datas.push(recp);
                });

                me.grid.addRecords(datas);
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
            }
        });
    },

    edit: function (rec) {
        var me = this;

        Ext.create('YZSoft.bpm.src.dialogs.ParticipantDlg', {
            autoShow: true,
            title: RS.$('All_ChangeDelegator'),
            tables: me.tables,
            stepNames: me.stepNames,
            recp: rec,
            fn: function (recp) {
                rec.data = recp;
                rec.commit();
            }
        });
    },

    setValue: function (value) {
        this.addRecords(value);
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            rv.push(rec.data);
        });
        return rv;
    }
});