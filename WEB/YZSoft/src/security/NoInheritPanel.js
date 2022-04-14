/*
config:
url  安全服务的url
params  请求权限时的附加参数
rsid
perms 资源支持的权限名
{
    PermName:'Read',
    PermType:'Module',
    PermDisplayName:RS.$('All_Perm_Read')
}
gridConfig
*/
Ext.define('YZSoft.src.security.NoInheritPanel', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.src.model.AssignPermSID'
    ],
    title: RS.$('All_Security'),
    config: {
        rsid: null,
        perms: null
    },
    permColumnDefault: {
        align: 'center',
        width: 80
    },
    objectColumnText: RS.$('All_AssignPerm_Target'),

    constructor: function (config) {
        var me = this,
            cfg;

        config = config || {};

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.src.model.AssignPermSID'
        });

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            store: me.store,
            selModel: { mode: 'SINGLE' },
            border: false,
            rowLines: true,
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    draggable: false
                },
                items: [
                ]
            }
        }, config.gridConfig1));

        cfg = {
            layout: 'fit',
            items: [me.grid]
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

    setPerms: function (perms) {
        var me = this,
            grid = me.grid,
            columns = [], column;

        me.perms = perms;
        columns.push({ text: me.objectColumnText, dataIndex: 'DisplayName', flex: 1, renderer: me.renderSIDName.bind(me) });

        Ext.each(perms, function (perm) {
            column = Ext.apply({}, {
                xtype: 'checkcolumn',
                tdCls: 'yz-grid-cell-checkcolumn-perm',
                text: perm.PermDisplayName || perm.PermName,
                dataIndex: 'Allow' + perm.PermName,
                disableDataIndex: 'Allow' + perm.PermName + 'Disabled'
            }, me.permColumnDefault);

            columns.push(column);
        });

        grid.setColumns(columns);
    },

    setRsid: function (rsid) {
        var me = this;

        if (rsid) {
            YZSoft.Ajax.request({
                url: me.url,
                params: Ext.apply({
                    method: 'GetACL',
                    rsid: rsid
                }, me.params),
                success: function (action) {
                    me.rsid = rsid;
                    me.fill(action.result);
                }
            });
        }
    },

    addUser: function () {
        var me = this;
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
    },

    addGroup: function () {
        var me = this;
        Ext.create('YZSoft.bpm.src.dialogs.SelSecurityGroupDlg', {
            autoShow: true,
            fn: function (group) {
                me.addSid({
                    SIDType: 'GroupSID',
                    SID: group.SID
                });
            }
        });
    },

    addOU: function () {
        var me = this;
        Ext.create('YZSoft.bpm.src.dialogs.SelOUDlg', {
            autoShow: true,
            fn: function (ou) {
                me.addSid({
                    SIDType: 'OUSID',
                    SID: ou.SID
                });
            }
        });
    },

    addRole: function () {
        var me = this;
        Ext.create('YZSoft.bpm.src.dialogs.SelRoleDlg', {
            autoShow: true,
            fn: function (role) {
                me.addSid({
                    SIDType: 'RoleSID',
                    SID: role.SID
                });
            }
        });
    },

    addLeader: function () {
        var me = this;
        Ext.create('YZSoft.bpm.src.dialogs.SelLeaderTitleDlg', {
            autoShow: true,
            fn: function (leaderTitle) {
                me.addSid({
                    SIDType: 'LeaderTitleSID',
                    SID: 'LeaderTitle:' + leaderTitle
                });
            }
        });
    },

    addAdvanced: function () {
        var me = this;
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
    },

    removeSelection: function () {
        this.grid.removeAllSelection();
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

                me.grid.addRecords(datas);
            }
        });
    },

    fill: function (permdef) {
        var me = this,
            refs = me.getReferences();

        me.regularACL(permdef.acl);
        me.store.removeAll();
        me.store.add(permdef.acl.aces);
    },

    save: function () {
        var me = this,
            aces = [];

        me.store.each(function (rec) {
            var ace, allows = [];

            ace = Ext.copyTo({
                Inherited: false,
                Inheritable: false
            }, rec.data, ['SIDType', 'SID', 'ACERoleParam2', 'ACERoleParam3', 'CreateDate', 'CreateBy']);

            Ext.each(me.perms, function (perm) {
                var Allow = 'Allow' + perm.PermName;

                if (rec.data[Allow])
                    allows.push(perm.PermName);
            });

            ace.AllowPermision = allows;
            aces.push(ace);
        });

        var acl = {
            RSID: me.rsid,
            aces: aces
        };

        return acl;
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

        Ext.each(aces, function (ace) {
            Ext.each(me.perms, function (perm) {
                me.processACE(ace, perm);
            });
        });

        acl.aces = aces;
    },

    processACE: function (ace, perm) {
        var me = this,
            hace = ace.Inherited,
            lace = ace.Local,
            Allow = 'Allow' + perm.PermName,
            AllowDisabled = Allow + 'Disabled',
            Deny = 'Deny' + perm.PermName,
            DenyDisabled = Deny + 'Disabled';

        if (ace.SIDType == 'CustomCode' &&
            acea.PermType != 'Record') {
            ace[AllowDisabled] = true;
            ace[Allow] = false;
            ace[DenyDisabled] = true;
            ace[Deny] = false;
        }
        else if (ace.SIDType == 'GroupSID' &&
            ace.SID == YZSoft.WellKnownSID.Administrators) {
            ace[AllowDisabled] = true;
            ace[Allow] = true;
            ace[DenyDisabled] = true;
            ace[Deny] = false;
        }
        else {
            if (hace && me.permContains(hace.AllowPermision, perm.PermName)) //继承的允许
            {
                ace[Allow] = true;
                ace[AllowDisabled] = true;
            }
            else {
                ace[AllowDisabled] = false;
                if (lace && me.permContains(lace.AllowPermision, perm.PermName)) //非继承的允许
                    ace[Allow] = true;
                else
                    ace[Allow] = false;
            }

            if (hace != null && me.permContains(hace.DenyPermision, perm.PermName)) //继承的禁止
            {
                ace[DenyDisabled] = true;
                ace[Deny] = true;
            }
            else {
                ace[DenyDisabled] = false;
                if (lace && me.permContains(lace.DenyPermision, perm.PermName)) //非继承的禁止
                    ace[Deny] = true;
                else
                    ace[Deny] = false;
            }
        }
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