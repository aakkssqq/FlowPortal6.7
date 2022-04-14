/*
config:
fullname
parentou
readOnly
getRootOUsType
srcoupath
*/
Ext.define('YZSoft.bpm.org.admin.RoleDlg', {
    extend: 'Ext.window.Window', //222222
    layout: 'border',
    width: 786,
    height: 533,
    minWidth: 786,
    minHeight: 533,
    modal: true,
    bodyPadding: '0 26 5 26',
    buttonAlign: 'right',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            mode = me.mode = config.fullname ? 'edit' : 'new',
            cfg;

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: config.readOnly,
            handler: function () {
                me.submit(function (resource) {
                    me.closeDialog(resource);
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
            items: [{
                xtype: 'container',
                region: 'north',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: RS.$('All_Object_ParentPosition'),
                    reference: 'edtFullName',
                    margin:0
                }, {
                    xtype: 'textfield',
                    fieldLabel: RS.$('All_RoleName'),
                    cls:'yz-field-required',
                    reference: 'edtName',
                    anchor: '60%',
                    listeners: {
                        change: function () {
                            me.updateStatus();
                        }
                    }
                }]
            }, {
                xclass: 'YZSoft.bpm.src.editor.RoleMemberField',
                fieldLabel: RS.$('All_IncludeMember'),
                region: 'center',
                getRootOUsType: config.getRootOUsType,
                srcoupath: config.srcoupath,
                reference: 'edtMembers',
                labelAlign: 'top'
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        var refs = me.getReferences();
        refs.edtName.focus();

        if (mode == 'edit') {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
                params: { method: 'GetRoleDefine', fullname: config.fullname },
                success: function (action) {
                    me.applyStatus(config.readOnly, action.result.Permision.Edit);
                    me.fill(action.result);
                }
            });
        }
        else {
            me.fill({
            });
        }
    },

    applyStatus: function (readOnly, objectEditable) {
        var me = this,
            refs = me.getReferences(),
            disabled = readOnly || !objectEditable;

        if (readOnly)
            disabled = false;

        refs.edtName.setReadOnly(disabled);
        refs.edtMembers.setReadOnly(disabled);

        me.readOnly = readOnly || !objectEditable;
        me.btnOK.setDisabled(readOnly || !objectEditable);
    },

    fill: function (role) {
        var me = this,
            refs = me.getReferences();

        refs.edtFullName.setValue(role.FullName || me.parentou);
        refs.edtName.setValue(role.Name);
        refs.edtMembers.setValue(role.Members);

        me.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences();

        var role = {
            Role: {
                Name: Ext.String.trim(refs.edtName.getValue())
            },
            Members: refs.edtMembers.getValue()
        };

        return role;
    },

    submit: function (fn, scope) {
        var me = this,
            refs = me.getReferences(),
            role = me.save();

        if (me.validate(role) === false)
            return;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
            params: {
                method: 'SaveRole',
                mode: me.mode,
                fullname: me.fullname,
                parentou: me.parentou
            },
            jsonData: role,
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
                        fn && fn.call(scope, action.result);
                    }
                });
            }
        });
    },

    validate: function (role) {
        var me = this,
            refs = me.getReferences();

        try {
            var err = $objname(role.Name);
            if (err !== true) {
                Ext.Error.raise({
                    msg: err,
                    fn: function () {
                        refs.edtName.focus()
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
            refs = me.getReferences();

        me.btnOK.setDisabled(me.readOnly || !Ext.String.trim(refs.edtName.getValue()));
    }
});