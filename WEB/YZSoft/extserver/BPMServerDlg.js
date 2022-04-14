/*
config:
path
serverName
readOnly
*/
Ext.define('YZSoft.extserver.BPMServerDlg', {
    extend: 'Ext.window.Window', //222222
    title: RS.$('ExtServer_BPMServer_Add'),
    layout: 'anchor',
    cls: 'yz-window-frame',
    width: 560,
    modal: true,
    resizable: false,
    border: true,
    bodyPadding: '26 26 26 26',
    buttonAlign:'right',
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
                        serverType: 'BPMServer'
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
                xtype: 'textarea',
                fieldLabel: RS.$('All_Connection_String'),
                grow: true,
                growMin: 80,
                growMax: 120,
                margin: 0,
                reference: 'edtConnectionString',
                listeners: {
                    change: function () {
                        me.updateStatus();
                    }
                }
            }, {
                xtype: 'displayfield',
                fieldLabel: '&nbsp;',
                labelSeparator: '',
                value: 'Server=127.0.0.1;UID=sa;PWD=123456789;Port=1580',
                fieldStyle: 'height:auto;min-height:10px;',
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('ExtServer_BPMServer_FormField_ServerEMail'),
                reference: 'edtMailAddress',
                margin: 0
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
                    method: 'GetBPMServerDefine',
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
        refs.edtConnectionString.setValue(data.ConnectionString);
        refs.edtMailAddress.setValue(data.MailAddress);
    },

    save: function () {
        var me = this,
            refs = me.getReferences();

        var data = {
            Name: Ext.String.trim(refs.edtName.getValue()),
            ConnectionString: Ext.String.trim(refs.edtConnectionString.getValue()),
            MailAddress: Ext.String.trim(refs.edtMailAddress.getValue())
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
                method: 'SaveBPMServer',
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
        me.btnTest.setDisabled(me.readOnly || !data.ConnectionString);
    }
});