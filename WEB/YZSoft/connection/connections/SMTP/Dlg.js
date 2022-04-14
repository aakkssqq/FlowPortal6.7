/*
config:
folderPath
objectName
*/
Ext.define('YZSoft.connection.connections.SMTP.Dlg', {
    extend: 'YZSoft.connection.connections.DlgAbstract',
    title: RS.$('Connection_SMTPDlg_Title'),
    bodyPadding: 0,
    minHeight: 478,
    default: {
        r: {
            Name: null,
            Cn: {
                Host: null,
                Port: 25,
                User: null,
                Password: null,
                SenderAddress: null,
                SenderDisplayName: null,
                EnableSsl: false,
                RelayToAddress: null,
                Timeout: 30
            }
        }
    },
    viewModel: {
        formulas: {
            testdisabled: function (get) {
                return !get('r.Cn.Host') || !get('r.Cn.Port') || !get('r.Cn.User') || !get('r.Cn.Password');
            },
            savedisabled: function (get) {
                return !get('r.Name');
            }
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.pageGeneral = me.createPageGeneral({
            title: RS.$('All_General'),
            padding: '25 46 5 46'
        });

        me.pageAdvanced = me.createPageAdvanced({
            title: RS.$('All_Advanced'),
            padding: '25 46 5 46'
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pageGeneral,
                me.pageAdvanced
            ]
        });

        cfg = {
            layout: 'fit',
            items: [me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    createPageGeneral: function (config) {
        return Ext.create('Ext.panel.Panel', Ext.apply({
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                msgTarget: 'under'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_ConnectionName'),
                cls: 'yz-field-required',
                defaultfocusfield:true,
                bind: '{r.Name}',
                vtype: 'objname'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_SMTP_Host'),
                bind: '{r.Cn.Host}'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_Account'),
                bind: '{r.Cn.User}',
                anchor: '60%'
            }, {
                xtype: 'textfield',
                inputType: 'password',
                fieldLabel: RS.$('All_Pwd'),
                bind: '{r.Cn.Password}',
                anchor: '60%'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_SMTP_SenderAddress'),
                bind: '{r.Cn.SenderAddress}'
            }, {
                xtype: 'checkbox',
                fieldLabel: RS.$('Connection_SMTP_EnableSsl'),
                bind: '{r.Cn.EnableSsl}',
                boxLabel: 'EnableSsl'
            }]
        }, config));
    },

    createPageAdvanced: function (config) {
        return Ext.create('Ext.panel.Panel', Ext.apply({
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                msgTarget: 'under'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_SMTP_SenderDisplayName'),
                bind: '{r.Cn.SenderDisplayName}'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_SMTP_RelayToAddress'),
                bind: '{r.Cn.RelayToAddress}'
            }, {
                xtype: 'numberfield',
                fieldLabel: RS.$('All_Port'),
                bind: '{r.Cn.Port}',
                minValue: 0,
                allowDecimals: false,
                hideTrigger: true,
                anchor: '30%'
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('Connection_SMTP_Timeout'),
                margin: 0,
                layout: 'hbox',
                items: [{
                    xtype: 'numberfield',
                    bind: '{r.Cn.Timeout}',
                    width: 80,
                    minValue: -1,
                    allowDecimals: false
                }, {
                    xtype: 'displayfield',
                    value: RS.$('Connection_TimeoutUnit'),
                    margin: '0 0 0 16'
                }]
            }]
        }, config));
    }
});