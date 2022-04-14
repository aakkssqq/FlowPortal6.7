/*
config:
path
serverName
readOnly
*/
Ext.define('YZSoft.extserver.FTPServerDlg', {
    extend: 'Ext.window.Window', //222222
    title: RS.$('ExtServer_FTPServer_Add'),
    layout: 'anchor',
    cls: 'yz-window-frame',
    width: 480,
    modal: true,
    resizable: false,
    bodyPadding: '26 26 26 26',
    buttonAlign: 'right',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            mode = me.mode = 'serverName' in config ? 'edit' : 'new',
            cfg;

        me.btnTest = Ext.create('Ext.button.Button', {
            text: RS.$('ExtServer_ConnectionTest'),
            handler: function () {
                var data = me.save();

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/ExtServer.ashx'),
                    params: {
                        method: 'ConnectionTest',
                        serverType: 'FTPServer'
                    },
                    jsonData: [data],
                    waitMsg: {
                        msg: RS.$('ExtServer_ConnectionTest_LoadMask'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        if (action.result.result)
                            YZSoft.alert(RS.$('ExtServer_ConnectionTest_Success_Msg'));
                        else
                            YZSoft.alert(action.result.message);
                    }
                });
            }
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                me.submit(function (group) {
                    me.closeDialog(group);
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
            buttons: [me.btnTest, me.btnOK, me.btnCancel],
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_Alias'),
                cls: 'yz-field-required',
                reference: 'edtName',
                listeners: {
                    change: function () {
                        me.updateStatus();
                    }
                }
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('ExtServer_FTPHost'),
                reference: 'edtHost',
                listeners: {
                    change: function () {
                        me.updateStatus();
                    }
                }
            }, {
                xtype: 'textfield',
                autocomplete: false,
                fieldLabel: RS.$('ExtServer_FTPUID'),
                reference: 'edtUser',
                listeners: {
                    change: function () {
                        me.updateStatus();
                    }
                }
            }, {
                xtype: 'textfield',
                autocomplete: false,
                fieldLabel: RS.$('ExtServer_FTPPWD'),
                margin: 0,
                inputType: 'password',
                reference: 'edtPassword'
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        var refs = me.getReferences();
        refs.edtName.focus();

        if (mode == 'edit') {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/BPM/ExtServer.ashx'),
                params: {
                    method: 'GetFTPServerDefine',
                    path: config.path,
                    serverName: config.serverName
                },
                success: function (action) {
                    me.fill(action.result);
                }
            });
        }
        else {
            me.fill({
            });
        }

        me.updateStatus();
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        refs.edtName.setValue(data.Name);
        refs.edtHost.setValue(data.Host);
        refs.edtUser.setValue(data.User);
        refs.edtPassword.setValue(data.Password);
    },

    save: function () {
        var me = this,
            refs = me.getReferences();

        var data = {
            Name: Ext.String.trim(refs.edtName.getValue()),
            Host: Ext.String.trim(refs.edtHost.getValue()),
            User: Ext.String.trim(refs.edtUser.getValue()),
            Password: refs.edtPassword.getValue()
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
            url: YZSoft.$url('YZSoft.Services.REST/BPM/ExtServer.ashx'),
            params: {
                method: 'SaveFTPServer',
                path: me.path,
                mode: me.mode,
                serverName: me.serverName
            },
            jsonData: [data],
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
            var err = $objname(data.Name);
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
            refs = me.getReferences(),
            data = me.save();

        me.btnOK.setDisabled(me.readOnly || !data.Name);
        me.btnTest.setDisabled(me.readOnly || !data.Host);
    }
});