/*
config:
path
serverName
readOnly
*/
Ext.define('YZSoft.extserver.DataSourceServerDlg', {
    extend: 'Ext.window.Window', //222222
    requires: [
        'YZSoft.bpm.src.model.DataSourceProvider'
    ],
    title: RS.$('ExtServer_DataSourceServer_Add'),
    layout: 'anchor',
    cls: 'yz-window-frame',
    width: 560,
    modal: true,
    resizable: false,
    bodyPadding: '26 26 21 26',
    buttonAlign: 'right',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            mode = me.mode = 'serverName' in config ? 'edit' : 'new',
            cfg;

        me.storeProvider = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.DataSourceProvider',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/ExtServer.ashx'),
                extraParams: { method: 'GetDataSourceProviders' }
            }
        });

        me.storeProvider.load({ async: false });

        me.btnTest = Ext.create('Ext.button.Button', {
            text: RS.$('ExtServer_ConnectionTest'),
            handler: function () {
                var data = me.save();

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/ExtServer.ashx'),
                    params: {
                        method: 'ConnectionTest',
                        serverType: 'DataSourceServer'
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
            cls:'yz-btn-default',
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
                xtype: 'combobox',
                fieldLabel: RS.$('ExtServer_DataSourceType'),
                reference: 'cmbProviderName',
                store: me.storeProvider,
                queryMode: 'local',
                displayField: 'Name',
                valueField: 'Name',
                editable: false,
                forceSelection: true,
                listeners: {
                    change: function (combo, newValue, oldValue, eOpts) {
                        var rec = me.storeProvider.getById(newValue);
                        me.getReferences().dspSample.setValue(rec ? rec.data.SampleOfConnectionString : '');
                    }
                }
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('All_Connection_String'),
                reference: 'edtConnectionString',
                grow: true,
                growMin: 80,
                growMax: 120,
                margin: 0,
                listeners: {
                    change: function () {
                        me.updateStatus();
                    }
                }
            }, {
                xtype: 'displayfield',
                fieldLabel: '&nbsp;',
                labelSeparator: '',
                reference: 'dspSample',
                fieldStyle: 'height:auto;min-height:10px;',
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('ExtServer_CommandTimeout'),
                margin: 0,
                layout: 'hbox',
                items: [{
                    xtype: 'numberfield',
                    reference: 'edtCommandTimeout',
                    width: 80,
                    minValue: -1,
                    allowDecimals: false,
                    listeners: {
                        change: function () {
                            me.updateStatus();
                        }
                    }
                },{
                    xtype: 'displayfield',
                    value: RS.$('ExtServer_CommandTimeoutUnit'),
                    margin: '0 0 0 6'
                }]
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
                    method: 'GetDataSourceServerDefine',
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
                ProviderName: 'Default',
                CommandTimeout:30
            });
        }

        me.updateStatus();
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        refs.edtName.setValue(data.Name);
        refs.cmbProviderName.setValue(data.ProviderName);
        refs.edtConnectionString.setValue(data.ConnectionString);
        refs.edtCommandTimeout.setValue(data.CommandTimeout);
    },

    save: function () {
        var me = this,
            refs = me.getReferences();

        var data = {
            Name: Ext.String.trim(refs.edtName.getValue()),
            ProviderName: refs.cmbProviderName.getValue(),
            ConnectionString: Ext.String.trim(refs.edtConnectionString.getValue()),
            CommandTimeout: refs.edtCommandTimeout.getValue()
        };

        if (!data.CommandTimeout)
            data.CommandTimeout = -1;

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
                method: 'SaveDataSourceServer',
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

            if (data.CommandTimeout < -1) {
                Ext.Error.raise({
                    msg: RS.$('ExtServer_CommandTimeout_LTMinValue'),
                    fn: function () {
                        refs.edtCommandTimeout.focus()
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