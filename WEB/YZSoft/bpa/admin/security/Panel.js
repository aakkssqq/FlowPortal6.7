
Ext.define('YZSoft.bpa.admin.security.Panel', {
    extend: 'Ext.container.Container',
    style: 'background-color:white;',

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnSave = Ext.create('Ext.button.Button', {
            text: RS.$('All_Save'),
            cls: 'bpa-btn-solid-hot',
            margin: '0 10 0 0',
            handler: function () {
                me.submit();
            }
        });

        me.btnAdd = Ext.create('Ext.button.Button', {
            text: RS.$('All_Add'),
            cls: 'bpa-btn-box-hot',
            iconCls: 'yz-glyph yz-glyph-e61d',
            menu: {
                items: [{
                    text: RS.$('All_Account'),
                    glyph: 0xeae1,
                    handler: function (item) {
                        me.pnlSecurity.addUser();
                    }
                }, {
                    text: RS.$('All_SecurityGroup'),
                    glyph: 0xeb14,
                    handler: function (item) {
                        me.pnlSecurity.addGroup();
                    }
                }, {
                    text: RS.$('All_OU'),
                    glyph: 0xeb26,
                    handler: function (item) {
                        me.pnlSecurity.addOU();
                    }
                }, {
                    text: RS.$('All_Role'),
                    glyph: 0xea94,
                    handler: function (item) {
                        me.pnlSecurity.addRole();
                    }
                }, {
                    text: RS.$('All_LeaderTitle'),
                    glyph: 0xea94,
                    handler: function (item) {
                        me.pnlSecurity.addLeader();
                    }
                }]
            }
        });

        me.btnRemove = Ext.create('Ext.button.Button', {
            text: RS.$('All_Remove'),
            cls: 'bpa-btn-box-hot',
            iconCls: 'yz-glyph yz-glyph-remove',
            margin:0,
            handler: function () {
                me.pnlSecurity.removeSelection();
            }
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            height: 64,
            padding: 0,
            items: [me.btnSave, '->', me.btnAdd, me.btnRemove]
        });

        me.pnlSecurity = Ext.create('YZSoft.src.security.NoInheritPanel', {
            region: 'center',
            border: false,
            bodyStyle: 'background-color:transparent',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            gridConfig: {
                cls: 'yz-flat-grid yz-flat-grid-rowsize-m'
            }
        });

        cfg = {
            layout: 'border',
            items: [me.toolbar, me.pnlSecurity]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.pnlSecurity.grid.on({
            scope: me,
            selectionchange: 'updateStatus'
        });

        me.updateStatus();
    },

    submit: function (fn, scope) {
        var me = this,
            acl = me.pnlSecurity.save();

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            params: {
                method: 'SaveACL',
                securityResType: 'RSID',
                rsid: me.pnlSecurity.rsid
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
                    autoClose: true
                });
            }
        });
    },

    updateStatus: function () {
        var me = this,
            grid = me.pnlSecurity.grid,
            sm = grid.getSelectionModel(),
            recs = sm.getSelection();

        me.btnRemove.setDisabled(recs.length == 0);
    }
});
