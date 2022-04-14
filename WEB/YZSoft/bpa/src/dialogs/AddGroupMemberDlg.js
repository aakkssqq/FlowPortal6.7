/*
*/
Ext.define('YZSoft.bpa.src.dialogs.AddGroupMemberDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],
    title: RS.$('BPA_Title_AddGroupMember'),
    layout: {
        type:'vbox',
        align:'stretch'
    },
    width: 620,
    modal: true,
    resizable: false,
    bodyPadding: '20 26 5 26',
    buttonAlign: 'right',
    padding:'0 0 10 0',

    constructor: function (config) {
        var me = this,
            cfg;

        me.edtUsers = Ext.create('YZSoft.src.form.field.Users', {
            fieldLabel: RS.$('All_AddGroupMember'),
            labelSeparator: '',
            listeners: {
                change: function () {
                    me.updateStatus();
                }
            }
        });

        var rdoItems = [];
        Ext.each(['Admin', 'Editor', 'Author', 'Guest'], function (roleName) {
            rdoItems.push({
                xtype: 'radio',
                width: 198,
                boxLabel: Ext.String.format('{0}<div class="yz-cmp-addgroupmemberdesc">{1}</div>', RS.$('All_Enum_GroupRole_' + roleName), RS.$('All_Enum_GroupRoleDesc_' + roleName)),
                name: 'RoleType',
                inputValue: roleName,
                checked: roleName == 'Author',
                listeners: {
                    change: function () {
                        me.updateStatus();
                    }
                }
            });
        });

        me.grpRoleType = Ext.create('Ext.form.RadioGroup', {
            fieldLabel: RS.$('BPA__GroupMember'),
            labelSeparator: '',
            layout: 'vbox',
            padding: '10 0 0 0',
            items: [{
                xtype: 'container',
                layout: 'hbox',
                items: [
                    rdoItems[0],
                    Ext.apply(rdoItems[1], {
                        padding: '0 0 0 30'
                    })]
            }, {
                xtype: 'container',
                layout: 'hbox',
                padding: '10 0 0 0',
                items: [
                    rdoItems[2],
                    Ext.apply(rdoItems[3], {
                        padding: '0 0 0 30'
                    })]
            }]
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                me.closeDialog(me.edtUsers.getValue(), me.grpRoleType.getValue().RoleType);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            defaults: {
                labelWidth:100
            },
            items: [me.edtUsers, me.grpRoleType],
            buttons: [me.btnOK, me.btnCancel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    destroy: function () {
        Ext.destroy(this.edtUser);
        this.callParent(arguments);
    },

    updateStatus: function () {
        var me = this,
            users = this.edtUsers.getValue();

        me.btnOK.setDisabled(users.length == 0);
    }
});