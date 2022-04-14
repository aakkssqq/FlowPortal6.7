/*
config:
rsid
params  请求权限时的附加参数
parentRsid 权限继承自资源RSID
advanced
denyColumn
perms 资源支持的权限名
   {
        PermName:'Read',
        PermType:'Module',
        PermDisplayName:RS.$('All_Perm_Read')
   }
url  安全服务的url
permGrid  permGrid Config
*/
Ext.define('YZSoft.bpm.propertypages.Security', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.model.AssignPermSID',
        'YZSoft.src.model.AssignPermPerm'
    ],
    referenceHolder: true,
    title: RS.$('All_Security'),
    header: false,
    bodyStyle: 'background-color:transparent',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.btnAdd = Ext.create('Ext.button.Button', {
            glyph:0xe61d,
            text: RS.$('All_Add'),
            menu: {
                items: [{
                    text: RS.$('All_Account'),
                    glyph:0xeae1,
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
                }, {
                    text: RS.$('All_Advanced'),
                    glyph: 0xeaf6,
                    hidden: config.advanced !== true,
                    handler: function (item) {
                        Ext.create('YZSoft.bpm.src.dialogs.ParticipantDlg', {
                            autoShow: true,
                            title: RS.$('All_SelectSID'),
                            fn: function (recp) {
                                me.addSid({
                                    SIDType: 'CustomCode',
                                    SID: recp.Express,
                                    ACERoleParam2: recp.DisplayString
                                });
                            }
                        });
                    }
                }]
            }
        });

        me.sidStore = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.src.model.AssignPermSID'
        });

        me.sidGrid = Ext.create('Ext.grid.Panel', {
            store: me.sidStore,
            cls: 'yz-border',
            hideHeaders: true,
            selModel: { mode: 'SINGLE' },
            rowLines: true,
            viewConfig: {
                stripeRows: false
            },
            columns: {
                defaults: {
                    sortable: true,
                    hideable: true,
                    menuDisabled: false,
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    //{ text: '<div class="yz-column-header-flag fa fa-flag"></div>', tdCls: 'yz-grid-cell-flag', width: 30, align: 'center', sortable: false, draggable: false, locked: false, autoLock: true, resizable: false, menuDisabled: true, renderer: me.renderSIDFlag.bind(me) },
                    { text: '', dataIndex: 'DisplayName', tdCls: 'yz-grid-cell-pl-6', flex: 1, renderer: me.renderSIDName.bind(me)  }
                ]
            },
            listeners: {
                selectionchange: function (grid, selected, eOpts) {
                    me.onSidSelectionChange(selected[0]);
                }
            }
        });

        me.permStore = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.src.model.AssignPermPerm',
            data: config.perms
        });

        me.permGrid = Ext.create('Ext.grid.Panel', Ext.apply({
            region: 'south',
            height: 202,
            border: true,
            store: me.permStore,
            disableSelection: true,
            viewConfig: {
                markDirty: false,
                stripeRows: false,
                trackOver: false
            },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { text: RS.$('All_Permision'), dataIndex: 'PermDisplayName', flex: 1, renderer: me.renderPermName },
                    { xtype: 'checkcolumn', tdCls: 'yz-grid-cell-checkcolumn-perm', text: RS.$('All_Allow'), dataIndex: 'Allow', disableDataIndex: 'AllowDisabled', align: 'center', width: 80, listeners: { scope: me, checkchange: me.onCheckChange} },
                    { xtype: 'checkcolumn', tdCls: 'yz-grid-cell-checkcolumn-perm', text: RS.$('All_Deny'), dataIndex: 'Deny', hidden: config.denyColumn === false, disableDataIndex: 'DenyDisabled', align: 'center', width: 80, listeners: { scope: me, checkchange: me.onCheckChange} }
                ]
            }
        }, config.permGrid));
        delete config.permGrid;

        me.btnDelete = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-remove',
            text: RS.$('All_Remove'),
            handler: function () {
                me.sidGrid.removeAllSelection();
            }
        });

        cfg = {
            layout: 'border',
            items: [{
                xtype: 'label',
                region: 'north',
                text: RS.$('All_Security_SIDs'),
                style: 'display:block',
                margin: '0 0 6 0'
            }, {
                xtype: 'panel',
                region: 'center',
                layout: 'fit',
                items: [me.sidGrid]
            }, Ext.apply({
                xtype: 'panel',
                region: 'south',
                padding:'6 0',
                layout: {
                    type: 'hbox',
                    pack: 'end'
                },
                border: false,
                bodyStyle: 'background-color:transparent',
                defaults: {
                    margin: '0 0 0 5',
                    minWidth: 75
                },
                items: [me.btnAdd, me.btnDelete]
            },config.btnsPanelConfig),
            me.permGrid
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (me.acl) {
            me.fill({
                acl: me.acl
            });
        }
        else if (me.rsid) {
            YZSoft.Ajax.request({
                url: me.url,
                params: Ext.apply({ method: 'GetACL', rsid: me.rsid }, config.params),
                success: function (action) {
                    me.fill(action.result);
                }
            });
        }
        else if (me.parentRsid) {
            YZSoft.Ajax.request({
                url: me.url,
                params: Ext.apply({ method: 'GenInheriACL', rsid: me.parentRsid }, config.params),
                success: function (action) {
                    me.fill(action.result);
                }
            });
        }
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

    renderPermName: function (value, metaData, record) {
        return Ext.util.Format.text(record.data.PermDisplayName || record.data.PermName);
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

                me.sidGrid.addRecords(datas);
            }
        });
    },

    onCheckChange: function () {
        var me = this,
            sidrec = me.permStore.sidRecord,
            allows = [],
            denys = [];

        if (!sidrec)
            return;


        me.permStore.each(function (rec) {
            if (!rec.data.AllowDisabled && rec.data.Allow)
                allows.push(rec.data.PermName);
        });

        me.permStore.each(function (rec) {
            if (!rec.data.DenyDisabled && rec.data.Deny)
                denys.push(rec.data.PermName);
        });

        var lace = sidrec.data.Local = sidrec.data.Local || {};
        lace.AllowPermision = allows;
        lace.DenyPermision = denys;
    },

    onSidSelectionChange: function (record) {
        var me = this;

        if (!record) {
            me.permStore.sidRecord = null;

            me.btnDelete.setDisabled(true);
            me.permGrid.columns[0].setText(RS.$('All_Permision'));

            me.permStore.each(function (permRec) {
                permRec.set('AllowDisabled', true);
                permRec.set('Allow', false);
                permRec.set('DenyDisabled', true);
                permRec.set('Deny', false);
            });
        }
        else {
            me.permStore.sidRecord = record;

            if (record.data.SIDType == 'GroupSID' &&
                record.data.SID == YZSoft.WellKnownSID.Administrators)
                me.btnDelete.setDisabled(true);
            else
                me.btnDelete.setDisabled(record.data.Inherited);

            me.permGrid.columns[0].setText(Ext.String.format(RS.$('All_Security_PermOwner'), record.data.DisplayName));

            me.permStore.each(function (permRec) {
                if (record.data.SIDType == 'CustomCode' &&
                    permRec.data.PermType != 'Record') {
                    permRec.set('AllowDisabled', true);
                    permRec.set('Allow', false);
                    permRec.set('DenyDisabled', true);
                    permRec.set('Deny', false);
                }
                else if (record.data.SIDType == 'GroupSID' &&
                    record.data.SID == YZSoft.WellKnownSID.Administrators) {
                    permRec.set('AllowDisabled', true);
                    permRec.set('Allow', true);
                    permRec.set('DenyDisabled', true);
                    permRec.set('Deny', false);
                }
                else {
                    var hace = record.data.Inherited,
                        lace = record.data.Local;

                    if (hace && me.permContains(hace.AllowPermision, permRec.data.PermName)) //继承的允许
                    {
                        permRec.set('AllowDisabled', true);
                        permRec.set('Allow', true);
                    }
                    else {
                        permRec.set('AllowDisabled', false);
                        if (lace && me.permContains(lace.AllowPermision, permRec.data.PermName)) //非继承的允许
                            permRec.set('Allow', true);
                        else
                            permRec.set('Allow', false);
                    }

                    if (hace != null && me.permContains(hace.DenyPermision, permRec.data.PermName)) //继承的禁止
                    {
                        permRec.set('DenyDisabled', true);
                        permRec.set('Deny', true);
                    }
                    else {
                        permRec.set('DenyDisabled', false);
                        if (lace && me.permContains(lace.DenyPermision, permRec.data.PermName)) //非继承的禁止
                            permRec.set('Deny', true);
                        else
                            permRec.set('Deny', false);
                    }
                }
            });
        }
    },

    fill: function (permdef) {
        var me = this,
            refs = me.getReferences();

        me.regularACL(permdef.acl);

        if (permdef.perms)
            me.permGrid.addRecords(permdef.perms);

        me.sidGrid.addRecords(permdef.acl.aces);
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            aces = [];

        me.sidStore.each(function (rec) {
            if (rec.data.Inherited) {
                var ace = Ext.clone(rec.data);
                delete ace.id;
                delete ace.Inherited;
                delete ace.Local;
                Ext.apply(ace, rec.data.Inherited);
                ace.Inherited = true;
                aces.push(ace);

                if (rec.data.Local && (
                    (rec.data.Local.AllowPermision && rec.data.Local.AllowPermision.length != 0) ||
                    (rec.data.Local.DenyPermision && rec.data.Local.DenyPermision.length != 0))) {
                    var ace = Ext.clone(rec.data);
                    delete ace.id;
                    delete ace.Inherited;
                    delete ace.Local;
                    Ext.apply(ace, rec.data.Local);
                    aces.push(ace);
                }
            }
            else {
                var ace = Ext.clone(rec.data);
                delete ace.id;
                delete ace.Inherited;
                delete ace.Local;
                Ext.apply(ace, rec.data.Local);
                aces.push(ace);
            }
        });

        var acl = {
            RSID: me.rsid,
            aces: aces
        };

        return acl;
    },

    submit: function (fn, scope) {
        var me = this,
            refs = me.getReferences(),
            acl = me.save();

        YZSoft.Ajax.request({
            method: 'POST',
            url: me.url,
            params: {
                method: 'SaveACL',
                rsid: me.rsid
            },
            jsonData: acl.aces,
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
                        fn && fn.call(scope, acl);
                    }
                });
            }
        });
    },

    regularACL: function (acl) {
        var me = this,
            aces = [];

        Ext.each(acl.aces, function (ace) {
            var acefinal = me.find(aces, ace);

            if (!acefinal) {
                acefinal = Ext.clone(ace);
                delete acefinal.RSID;
                delete acefinal.AllowPermision;
                delete acefinal.DenyPermision;
                delete acefinal.LeadershipTokenPermision;
                delete acefinal.Inherited;
                delete acefinal.Inheritable;
                delete acefinal.CreateDate;
                delete acefinal.CreateBy;
                aces.push(acefinal);
            }

            acefinal[ace.Inherited ? 'Inherited' : 'Local'] = {
                AllowPermision: ace.AllowPermision,
                DenyPermision: ace.DenyPermision,
                LeadershipTokenPermision: ace.LeadershipTokenPermision,
                Inheritable: ace.Inheritable,
                CreateDate: ace.CreateDate,
                CreateBy: ace.CreateBy
            }
        });

        acl.aces = aces;
    },

    find: function (aces, ace) {
        for (var i = 0; i < aces.length; i++) {
            if (this.equalACE(aces[i], ace))
                return aces[i];
        }
    },

    permContains: function (perms, perm) {
        for (var i = 0; i < perms.length; i++) {
            if (String.Equ(perms[i], perm))
                return true;
        }

        return false;
    },

    equalACE: function (ace1, ace2) {
        return YZSoft.src.model.AssignPermSID.equFn(ace1, ace2);
    }
});