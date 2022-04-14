/*
config
buttons:{add:{}} - add button config
addtosid - add to group sid,
excludeEveryone
*/

Ext.define('YZSoft.bpm.src.editor.SIDsField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: [
        'YZSoft.bpm.src.model.SID'
    ],
    
    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        config.buttons = config.buttons || {},

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.SID',
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
            columns: {
                defaults: {
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { text: RS.$('All_SIDTypesList'), dataIndex: 'DisplayName', tdCls: 'yz-grid-cell-pl-6', flex: 1, renderer: me.renderSIDName.bind(me) }
                ]
            }
        });

        me.btnAdd = Ext.create('YZSoft.src.button.Button', Ext.apply({
            text: RS.$('All_Add'),
            padding: '5 6 5 6',
            menu: {
                items: [{
                    text: RS.$('All_Account'),
                    glyph: 0xeae1,
                    handler: function (item) {
                        YZSoft.SelUsersDlg.show({
                            fn: function (users) {
                                var sids = [];
                                Ext.each(users, function (user) {
                                    sids.push({
                                        SIDType: 'UserSID',
                                        SID: user.SID
                                    });
                                });
                                me.addSid(sids);
                            }
                        });
                    }
                }, {
                    text: RS.$('All_SecurityGroup'),
                    glyph: 0xeb14,
                    handler: function (item) {
                        Ext.create('YZSoft.bpm.src.dialogs.SelSecurityGroupDlg', {
                            autoShow: true,
                            excludeEveryone: config.excludeEveryone,
                            addtosid: me.addtosid,
                            fn: function (group) {
                                me.addSid({
                                    SIDType: 'GroupSID',
                                    SID: group.SID
                                });
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
                                me.addSid({
                                    SIDType: 'OUSID',
                                    SID: ou.SID
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
                                me.addSid({
                                    SIDType: 'RoleSID',
                                    SID: role.SID
                                });
                            }
                        });
                    }
                }, {
                    text: RS.$('All_LeaderTitle'),
                    glyph: 0xea94,
                    handler: function (item) {
                        Ext.create('YZSoft.bpm.src.dialogs.SelLeaderTitleDlg', {
                            autoShow: true,
                            fn: function (leaderTitle) {
                                me.addSid({
                                    SIDType: 'LeaderTitleSID',
                                    SID: 'LeaderTitle:' + leaderTitle
                                });
                            }
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
                this.setDisabled(me.saSelected() || !me.grid.canDelete());
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

        var cfg = {
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

    renderSIDFlag: function (value, metaData, record) {
        var sidType = record.data.SIDType,
            glyph, tip;

        switch (sidType) {
            case 'UserSID':
                tip = RS.$('All_Account');
                glyph = 'yz-glyph-eae1';
                break;
            case 'GroupSID':
                tip = RS.$('All_SecurityGroup');
                glyph = 'yz-glyph-eb14';
                break;
            case 'OUSID':
                tip = RS.$('All_OU');
                glyph = 'yz-glyph-eb26';
                break;
            case 'RoleSID':
                tip = RS.$('All_Role');
                glyph = 'yz-glyph-ea94';
                break;
            case 'LeaderTitleSID':
                tip = RS.$('All_LeaderTitle');
                glyph = 'yz-glyph-ea94';
                break;
            case 'CustomCode':
                tip = RS.$('All_Advanced');
                glyph = 'yz-glyph-eaf6';
                break;
            default:
                return false;
        }

        return Ext.String.format('<div class="yz-grid-cell-box-flag yz-flag-grayable yz-color-type yz-glyph {0}" style="padding-right:8px;" data-qtip="{1}"></div>', glyph, tip);
    },

    renderSIDName: function (value, metaData, record) {
        var flag = this.renderSIDFlag(value, metaData, record);
        return flag + Ext.util.Format.text(value);
    },

    addSid: function (datas) {
        var me = this,
            nrec,
            datas = Ext.isArray(datas) ? datas : [datas];

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
            params: { method: 'GetACEDisplayName' },
            jsonData: datas,
            success: function (action) {
                for (var i = 0, n = datas.length; i < n; i++)
                    datas[i].DisplayName = action.result[i].DisplayName;

                if (me.fireEvent('beforeAddSid', datas) !== false)
                    me.grid.addRecords(datas);
            }
        });
    },

    saSelected: function () {
        var recs = this.grid.getSelectionModel().getSelection();

        for (var i = 0; i < recs.length; i++) {
            var rec = recs[i];
            if (recs[i].data.SIDType == 'UserSID' &&
                recs[i].data.SID == YZSoft.WellKnownSID.SA)
                return true;
        }
        return false;
    },

    setValue: function (value) {
        this.grid.addRecords(value, false);
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            rv.push(rec.data);
        });
        return rv;
    }
});