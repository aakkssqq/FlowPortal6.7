/*
config:
folderPath
objectName
*/
Ext.define('YZSoft.connection.connections.KingdeeEAS.Dlg', {
    extend: 'YZSoft.connection.connections.DlgAbstract',
    title: RS.$('Connection_KingdeeEASDlg_Title'),
    bodyPadding: 0,
    minHeight: 532,
    default: {
        r: {
            Name: null,
            Cn: {
                baseUrl: null,
                loginOffsetUrl: 'EASLogin',
                userName: null,
                password:null,
                slnName: 'eas',
                dcName: null,
                language: 'L2',
                dbType: '0',
                authPattern: 'BaseDB',
                timeout: 30
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
            items: [me.tabMain],
            viewModel: {
                formulas: {
                    testdisabled: function (get) {
                        return !get('r.Cn.baseUrl') || !get('r.Cn.loginOffsetUrl') || !get('r.Cn.userName') || !get('r.Cn.password') || !get('r.Cn.slnName') || !get('r.Cn.dcName') || !get('r.Cn.language') || !get('r.Cn.dbType') || !get('r.Cn.authPattern');
                    },
                    savedisabled: function (get) {
                        return !get('r.Name');
                    }
                }
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    createPageGeneral: function (config) {
        var me = this;

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
                fieldLabel: RS.$('Connection_KingdeeEAS_baseUrl'),
                emptyText: Ext.String.format(RS.$('Connection_KingdeeEAS_baseUrl_EmptyText'),'http://192.168.1.100:6888/ormrpc/services'),
                bind: '{r.Cn.baseUrl}'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_KingdeeEAS_loginOffsetUrl'),
                bind: '{r.Cn.loginOffsetUrl}'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_Account'),
                bind: '{r.Cn.userName}',
                anchor: '50%'
            }, {
                xtype: 'textfield',
                inputType: 'password',
                fieldLabel: RS.$('All_Pwd'),
                bind: '{r.Cn.password}',
                anchor: '50%'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_KingdeeEAS_slnName'),
                emptyText: '--slnName--',
                bind: '{r.Cn.slnName}',
                anchor: '50%'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_KingdeeEAS_dcName'),
                emptyText: '--dcName--',
                bind: '{r.Cn.dcName}',
                anchor: '50%'
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_Language'),
                margin: 0,
                layout: 'hbox',
                items: [{
                    xtype: 'textfield',
                    emptyText: '--language--',
                    bind: '{r.Cn.language}',
                    width: 206
                }, {
                    xtype: 'displayfield',
                    value: Ext.String.format('L2 - {0}，L3 - {1}', RS.$('All_Languages_2052'), RS.$('All_Languages_1028')),
                    margin: '0 0 0 16'
                }]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('Connection_KingdeeEAS_dbType'),
                margin: 0,
                layout: 'hbox',
                items: [{
                    xtype: 'textfield',
                    emptyText: '--dbType--',
                    bind: '{r.Cn.dbType}',
                    width: 206
                }, {
                    xtype: 'displayfield',
                    value: '0 - SQL Server，1 - Oracle，2 - DB2',
                    margin: '0 0 0 16'
                }]
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_KingdeeEAS_authPattern'),
                emptyText: '--authPattern--',
                bind: '{r.Cn.authPattern}',
                anchor: '50%'
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
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('Connection_RequestTimeout'),
                margin: 0,
                layout: 'hbox',
                items: [{
                    xtype: 'numberfield',
                    bind: '{r.Cn.timeout}',
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
    },

    save: function () {
        var me = this,
            rv = me.callParent();

        return rv;
    }
});