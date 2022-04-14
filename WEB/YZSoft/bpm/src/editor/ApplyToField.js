/*
config
buttons:{add:{}} - add button config
addtosid - add to group sid,
excludeEveryone
*/

Ext.define('YZSoft.bpm.src.editor.ApplyToField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.bpm.src.model.Participant'],
    map: {
        Include: 'Exclude',
        Exclude: 'Include'
    },
    //height: 137,

    constructor: function (config) {
        var me = this,
            cfg;

        config.buttons = config.buttons || {};

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
            selModel: { mode: 'MULTI' },
            viewConfig: {
                markDirty: false
            },
            columns: {
                defaults: {
                },
                items: [
                    { text: RS.$('All_User'), dataIndex: 'RuntimeDisplayString', flex: 1, renderer: YZSoft.Render.renderString },
                    { xtype: 'checkcolumn', text: RS.$('All_Include'), dataIndex: 'Include', align: 'center', width: 80, listeners: { scope: me, checkchange: me.onCheckChange} },
                    { xtype: 'checkcolumn', text: RS.$('All_Exclude'), dataIndex: 'Exclude', align: 'center', width: 80, listeners: { scope: me, checkchange: me.onCheckChange} }
                ]
            }
        });

        me.btnAdd = Ext.create('YZSoft.src.button.Button', Ext.apply({
            text: RS.$('All_Add'),
            menu: {
                items: [{
                    text: RS.$('All_Account'),
                    glyph: 0xeae1,
                    handler: function (item) {
                        YZSoft.SelUsersDlg.show({
                            fn: function (users) {
                                var recps = [];

                                Ext.each(users, function (user) {
                                    recps.push({
                                        ParticipantType: 'SpecifiedUser',
                                        LParam1: 4,
                                        SParam1: user.MemberFullName,
                                        Include: true
                                    });
                                });

                                me.addRecords(recps);
                            }
                        });
                    }
                }, {
                    text: RS.$('All_OU'),
                    glyph: 0xeb26,
                    handler: function (item) {
                        Ext.create('YZSoft.bpm.src.dialogs.SelOUDlg', {
                            autoShow: true,
                            fn: function (ou) {
                                me.addRecords({
                                    ParticipantType: 'SpecifiedUser',
                                    LParam1: 16,
                                    SParam1: ou.FullName,
                                    Include: true
                                });
                            }
                        });
                    }
                }, {
                    text: RS.$('All_Role'),
                    glyph: 0xea94,
                    handler: function (item) {
                        Ext.create('YZSoft.bpm.src.dialogs.SelRoleDlg', {
                            autoShow: true,
                            fn: function (role) {
                                me.addRecords({
                                    ParticipantType: 'SpecifiedUser',
                                    LParam1: 3,
                                    SParam1: role.FullName,
                                    Include: true
                                });
                            }
                        });
                    }
                }, {
                    text: RS.$('All_AllEmployee'),
                    glyph: 0xeaf6,
                    handler: function (item) {
                        me.addRecords({
                            ParticipantType: 'SpecifiedUser',
                            LParam1: 17,
                            Include: true
                        });
                    }
                }]
            }
        }, config.buttons.add));

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
                me.btnDelete,
                me.btnMoveUp,
                me.btnMoveDown
            ]
        });

        cfg = {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
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

                me.grid.addRecords(datas, false);
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
            }
        });
    },

    onCheckChange: function (column, rowIndex, checked, eOpts) {
        var me = this,
            rec = me.store.getAt(rowIndex);

        if (checked)
            rec.set(me.map[column.dataIndex], false);

        this.fireEvent('checkchange');
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