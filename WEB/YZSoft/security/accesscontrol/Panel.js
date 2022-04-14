/*
config
rsid
record - 可选配置
*/
Ext.define('YZSoft.security.accesscontrol.Panel', {
    extend: 'Ext.panel.Panel',
    header: false,
    border: false,
    bodyPadding: '20px 5px 30px 30px',
    referenceHolder: true,
    scrollable: true,
    bodyStyle: 'background-color:#f5f5f5',

    constructor: function (config) {
        var me = this,
            editable = config.editable === false ? false : true,
            cfg;

        me.btnEdit = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-property',
            text: RS.$('Security_ResourceProperty'),
            hidden: !editable,
            disabled: true,
            handler: function () {
                me.fireEvent('editclicked');
            }
        });

        me.btnNew = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e610',
            text: RS.$('Security_AddChildResource'),
            hidden: !editable,
            disabled: true,
            handler: function () {
                me.fireEvent('addchildrenclicked');
            }
        });

        me.btnAssignPerm = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e611',
            text: RS.$('All_Permision'),
            disabled: true,
            handler: function () {
                me.fireEvent('assignpermclicked');
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            text: RS.$('All_Refresh'),
            handler: function () {
                me.load({
                    waitMsg: {
                        msg: RS.$('All_Loading'),
                        target: me,
                        start: 0
                    }
                });
            }
        });

        cfg = {
            layout: {
                type: 'vbox',
                align:'stretch'
            },
            tbar: {
                cls: 'yz-tbar-module',
                items: [me.btnEdit, me.btnNew, { xtype: 'tbseparator', hidden: !editable }, me.btnAssignPerm, '->', me.btnRefresh]
            },
            defaults: {
                xtype: 'panel',
                border: false
            },
            items: [{
                reference: 'titlePanel',
                ui: 'yzplain',
                style: 'background-color:transparent;',
                hidden: !config.rsid,
                height: 47,
                tpl: [
                    '<div>',
                        '<tpl for=".">',
                            '<div class="x-title-text-yzplain">{name}</div>',
                            '<div style="color:#999">RSID:{rsid}</div>',
                        '</tpl>',
                    '</div>'
                ],
                data: { name: config.title, rsid: config.rsid }
            }, {
                margin: '20px 0 0 0',
                reference: 'contentPanel',
                bodyStyle: 'background-color:#f5f5f5',
                layout: {
                    type: 'vbox',
                    pack: 'start',
                    align: 'stretch'
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.record) {
            config.record.on({
                itemSaved: function (resource, dlg) {
                    me.load({
                        waitMsg: {
                            msg: RS.$('All_Save_Succeed'),
                            msgCls: 'yz-mask-msg-success',
                            target: dlg,
                            start: 0,
                            fn: function () {
                                dlg.close();
                            }
                        }
                    });
                },
                permSaved: function (acl, dlg) {
                    me.load({
                        waitMsg: {
                            msg: RS.$('All_Save_Succeed'),
                            msgCls: 'yz-mask-msg-success',
                            target: dlg,
                            start: 0,
                            fn: function () {
                                dlg.close();
                            }
                        }
                    });
                }
            });
        }
    },

    afterRender: function () {
        var me = this;

        me.callParent(arguments);

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            params: {
                method: 'CheckPermisions',
                rsid: me.rsid || YZSoft.WellKnownRSID.SecurityResourceRoot,
                perms: 'Write,UserResourceAssignPermision'
            },
            success: function (action) {
                var perm = me.perm = action.result;

                me.btnEdit.setDisabled(!me.rsid);
                me.btnNew.setDisabled(!perm.Write);
                me.btnAssignPerm.setDisabled(!me.rsid);

                if (me.record)
                    me.record.data.perm = action.result;
            }
        });
    },

    onActivate: function (times) {
        if (!this.rsid)
            return;

        if(times == 0){
            this.load({
                waitMsg: {
                    msg: RS.$('All_Loading'),
                    target: this
                }
            });
        }
        else {
            this.load();
        }
    },

    load: function (config) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/core/UserResourceAccessControl.ashx'),
            params: {
                method: 'GetResourcePerms',
                rsid: me.rsid
            },
            success: function (action) {
                me.onLoad(action.result);
            }
        }, config));
    },

    onLoad: function (result) {
        var me = this,
            refs = me.getReferences(),
            items = [],
            panels = [],
            titleEl, mod;

        me.currentData = result;

        titleEl = refs.titlePanel.getEl().down('.x-title-text-yzplain');
        titleEl.setHtml(result.ResourceName);

        Ext.each(result.perms, function (perm) {
            var panel = Ext.create('Ext.panel.Panel', {
                title: Ext.String.format('{1}', perm.PermDisplayName, perm.PermName),
                ui: 'yzplain',
                flex: 1,
                layout: 'anchor',
                padding: 20,
                margin: '0 30 30 0',
                style: 'display:inline-block;vertical-align:top;',
                tpl: [
                    '<div>',
                        '<tpl for=".">',
                            '<span>',
                                '<div>{Name}</div>',
                            '</span>',
                        '</tpl>',
                    '</div>'
                ],
                data: perm.roles
            });

            items.push(panel);
        });

        mod = items.length % 3;
        if (mod != 0) {
            for (var i = 0; i < 3 - mod; i++) {
                items.push({
                    xtype: 'panel',
                    border: false,
                    bodyStyle: 'background-color:transparent;',
                    margin: '0 30px 30px 0',
                    flex: 1
                });
            }
        }

        for (var i = 0; i < items.length / 3; i++) {
            var panel = Ext.create('Ext.panel.Panel', {
                border: false,
                bodyStyle: 'background-color:#f5f5f5',
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items: [items[i * 3], items[i * 3 + 1], items[i * 3 + 2]]
            });

            panels.push(panel);
        }

        refs.contentPanel.removeAll(true);
        refs.contentPanel.add(panels);
    }
});
