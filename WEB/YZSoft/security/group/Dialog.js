/*
config:
groupName
readOnly
*/
Ext.define('YZSoft.security.group.Dialog', {
    extend: 'Ext.window.Window', //222222
    layout: 'border',
    width: 786,
    height: 533,
    minWidth: 786,
    minHeight: 533,
    modal: true,
    maximizable: true,
    bodyPadding: '10 26 5 26',
    buttonAlign: 'right',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            mode = me.mode = 'groupName' in config ? 'edit' : 'new',
            cfg;

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: config.readOnly,
            handler: function () {
                me.submit(function (data) {
                    me.closeDialog(data);
                });
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            buttons: [me.btnOK, me.btnCancel],
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'panel',
                region: 'north',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: RS.$('All_SecurityGroup'),
                    cls: 'yz-field-required',
                    reference: 'edtGroupName',
                    anchor: '60%',
                    listeners: {
                        change: function () {
                            me.updateStatus();
                        }
                    }
                }]
            }, {
                xclass: 'YZSoft.bpm.src.editor.SIDsField',
                fieldLabel: RS.$('All_Member'),
                region: 'center',
                excludeEveryone: true,
                reference: 'edtUsers',
                labelAlign: 'top',
                buttons: {
                    add: {
                        disabled: String.Equ(config.groupName, 'everyone')
                    }
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.getReferences().edtGroupName.focus();

        if (mode == 'edit') {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/BPM/SecurityGroup.ashx'),
                params: { method: 'GetGroupDefine', groupName: config.groupName },
                success: function (action) {
                    me.fill(action.result);
                    me.group = action.result;
                    me.getReferences().edtUsers.addtosid = me.group.group.SID;
                }
            });
        }
        else {
            me.fill({
                group: {},
                sids: []
            });
        }

        me.updateStatus();
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        refs.edtGroupName.setValue(data.group.GroupName);
        refs.edtUsers.setValue(data.sids);

        refs.edtGroupName.setDisabled(data.group.IsSystemGroup);
    },

    save: function () {
        var me = this,
            refs = me.getReferences();

        var data = {
            group: {
                GroupName: Ext.String.trim(refs.edtGroupName.getValue())
            },
            sids: refs.edtUsers.getValue()
        };

        return data;
    },

    submit: function (fn, scope) {
        var me = this,
            refs = me.getReferences(),
            data = me.save();

        if (me.validate(data) === false)
            return;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SecurityGroup.ashx'),
            params: {
                method: 'SaveSecurityGroup',
                mode: me.mode,
                groupName: me.groupName
            },
            jsonData: [
                data.group,
                data.sids
            ],
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
                        fn && fn.call(scope, data);
                    }
                });
            }
        });
    },

    validate: function (data) {
        var me = this,
            refs = me.getReferences(),
            tempPerms = [];

        try {
            var err = $objname(data.group.GroupName);
            if (err !== true) {
                Ext.Error.raise({
                    msg: err,
                    fn: function () {
                        refs.edtGroupName.focus()
                    }
                });
            }
        }
        catch (e) {
            YZSoft.alert(e.message, function () {
                if (e.fn)
                    e.fn.call(e.scope || this, e);
            });
            return false;
        }
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            data = me.save();

        me.btnOK.setDisabled(me.readOnly || !data.group.GroupName);
    }
});