
Ext.define('YZSoft.system.server.ServerInfoPanel', {
    extend: 'Ext.form.Panel',
    border: false,
    referenceHolder: true,
    scrollable: true,
    bodyStyle: 'background-color:#f5f5f5',
    licTypes: ['CPUs', 'Users', 'Processes', 'ConcurrentUsers'],
    highlightRemainDays: 30,
    trialHighlightRemainDays: 3,
    highlightCls: 'yz-licremaindays-highlight',
    bodyPadding: 10,
    ui: 'light',
    icon: YZSoft.$url('YZSoft/theme/images/icon/server_info.png'),
    header: {
        cls: 'yz-header-module'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlServer = Ext.create('Ext.container.Container', {
            defaults: {
                xtype: 'displayfield',
                margin: '0 0 0 0',
                labelWidth: 120
            },
            items: [{
                fieldLabel: RS.$('All_Host'),
                name: 'ServerName'
            }, {
                fieldLabel: RS.$('All_OS'),
                name: 'OS'
            }, {
                fieldLabel: RS.$('All_CPUCount'),
                name: 'ProcessorCount'
            }, {
                fieldLabel: RS.$('All_TotalPhyMemory'),
                name: 'MemTotalPhys'
            }, {
                fieldLabel: RS.$('All_TotalAvaliablePhyMemory'),
                name: 'MemAvailPhys'
            }, {
                fieldLabel: RS.$('All_PhyMemoryLoad'),
                name: 'MemLoad'
            }, {
                fieldLabel: RS.$('All_OnlineUserCount'),
                name: 'ActiveUserCount'
            }]
        });

        me.pnlDB = Ext.create('Ext.container.Container', {
            defaults: {
                xtype: 'displayfield',
                margin: '0 0 0 0'
            },
            items: [{
                cls: 'yz-formfield-height-auto',
                name: 'DBHostName'
            }, {
                cls: 'yz-licitem-light',
                name: 'DBVersion'
            }]
        });

        me.pnlProduct = Ext.create('Ext.container.Container', {
            defaults: {
                xtype: 'displayfield',
                margin: '0 0 0 0',
                labelWidth: 120
            },
            items: [{
                fieldLabel: RS.$('All_SysInfo_BPMProduct'),
                name: 'ProductName'
            }, {
                fieldLabel: RS.$('All_SysInfo_BPMVersion'),
                name: 'Version'
            }]
        });

        var licItemFields = [];
        Ext.each(me.licTypes, function (p) {
            licItemFields.push({
                fieldLabel: RS.$('All_Enum_LicItem_' + p),
                reference: 'dsp' + p,
                name: p
            });
        });

        me.pnlLicense = Ext.create('Ext.container.Container', {
            defaults: {
                xtype: 'displayfield',
                hidden: true,
                margin: '0 0 0 0',
                labelWidth: 120
            },
            items: Ext.Array.push([{
                fieldLabel: RS.$('All_BPMLicType'),
                name: 'LicenseTypeDisplayName',
                hidden: false
            }, {
                fieldLabel: RS.$('All_TrialExpiteTime'),
                reference: 'dspTrialExpireTime',
                name: 'TrialExpireTime'
            }, {
                fieldLabel: RS.$('All_TrialRemainDays'),
                reference: 'dspTrialRemainDays',
                name: 'TrialRemainDays',
                cls: 'yz-licremaindays-normal'
            }, {
                fieldLabel: RS.$('All_Lic_FoundationProcesses'),
                reference: 'dspFoundationProcesses',
                name: 'FoundationProcesses'
            }, {
                fieldLabel: RS.$('All_Lic_FoundationConcurrentUsers'),
                reference: 'dspFoundationConcurrentUsers',
                name: 'FoundationConcurrentUsers'
            }, {
                fieldLabel: RS.$('All_Lic_CompanyName'),
                reference: 'dspCompanyName',
                name: 'CompanyName'
            }, {
                fieldLabel: RS.$('All_Lic_MAC'),
                reference: 'dspMAC',
                name: 'MAC'
            }], licItemFields, {
                fieldLabel: RS.$('All_ExpiteTime'),
                reference: 'dspExpireTime',
                name: 'ExpireTime'
            }, {
                fieldLabel: RS.$('All_RemainDays'),
                reference: 'dspRemainDays',
                name: 'RemainDays',
                cls: 'yz-licremaindays-normal'
            })
        });

        cfg = {
            tools: [{
                glyph: 0xe60f,
                handler: function () {
                    me.load({
                        waitMsg: {
                            msg: RS.$('All_Loading'),
                            target: me,
                            start: 0
                        }
                    });
                }
            }],
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'begin'
            },
            defaults: {
                xtype: 'panel',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
                width: 600,
                bodyStyle: 'background-color:transparent',
                defaults: {
                    xtype: 'panel',
                    ui: 'yzplain',
                    layout: 'anchor',
                    padding: 20,
                    margin: 10
                }
            },
            items: [{
                items: [{
                    title: RS.$('All_SysInfo_Title_Server'),
                    items: [
                        me.pnlServer
                    ]
                }, {
                    title: RS.$('All_SysInfo_Title_DB'),
                    items: [
                        me.pnlDB
                    ]
                }]
            }, {
                items: [{
                    title: RS.$('All_SysInfo_Title_BPM'),
                    items: [
                        me.pnlProduct
                    ]
                }, {
                    title: RS.$('All_SysInfo_Title_Lic'),
                    items: [
                        me.pnlLicense
                    ]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function (times) {
        if (times == 0)
            this.load({
                waitMsg: {
                    msg: RS.$('All_Loading'),
                    target: this
                }
            });
        else
            this.load();
    },

    fill: function (data) {
        var me = this,
            ref = me.getReferences(),
            lic = data.LicenseInfo,
            trial = lic.LicenseType == 'Trial',
            foundation = lic.LicenseType == 'FoundationProcesses' || lic.LicenseType == 'FoundationConcurrentUsersUsers';

        if (lic.ExpireTime && lic.ExpireTime.getFullYear() >= 9999)
            delete lic.ExpireTime;

        data.MemTotalPhys = data.MemTotalPhys.toFileSize();
        data.MemAvailPhys = data.MemAvailPhys.toFileSize();
        data.MemLoad = data.MemLoad + '%';

        data.LicenseTypeDisplayName = this.getLicTypeDisplayName(lic);
        ref.dspTrialExpireTime.setVisible(trial);
        ref.dspTrialRemainDays.setVisible(trial);
        ref.dspFoundationProcesses.setVisible(lic.LicenseType == 'FoundationProcesses');
        ref.dspFoundationConcurrentUsers.setVisible(lic.LicenseType == 'FoundationConcurrentUsersUsers');
        ref.dspCompanyName.setVisible(!trial && !foundation);
        ref.dspMAC.setVisible(!trial && !foundation);

        Ext.each(me.licTypes, function (p) {
            ref['dsp' + p].setVisible(!trial && !foundation && lic[p] != -1);
        });

        ref.dspExpireTime.setVisible(!trial && !foundation && lic.ExpireTime);
        ref.dspRemainDays.setVisible(!trial && !foundation && lic.ExpireTime);

        me.getForm().setValues(data);

        if (trial) {
            var remainDays = Ext.Date.diff(Ext.Date.clearTime(data.Now), lic.ExpireTime, Ext.Date.DAY);

            if (remainDays <= me.trialHighlightRemainDays)
                ref.dspTrialRemainDays.addCls(me.highlightCls);
            else
                ref.dspTrialRemainDays.removeCls(me.highlightCls);

            if (remainDays < 0)
                remainDays = RS.$('All_LicExpired');
            else
                remainDays += RS.$('All_UnitDays');

            lic.TrialRemainDays = remainDays;
            lic.TrialExpireTime = Ext.Date.format(lic.ExpireTime, 'Y-m-d');
        }
        else if (foundation){
        }
        else {
            if (lic.ExpireTime) {
                var remainDays = Ext.Date.diff(Ext.Date.clearTime(data.Now), lic.ExpireTime, Ext.Date.DAY);

                if (remainDays <= me.highlightRemainDays)
                    ref.dspRemainDays.addCls(me.highlightCls);
                else
                    ref.dspRemainDays.removeCls(me.highlightCls);

                if (remainDays < 0)
                    remainDays = RS.$('All_LicExpired');
                else
                    remainDays += RS.$('All_UnitDays');

                lic.RemainDays = remainDays;
                lic.ExpireTime = Ext.Date.format(lic.ExpireTime, 'Y-m-d');
            }
        }

        me.getForm().setValues(lic);
    },

    load: function (config) {
        var me = this;
        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
            params: {
                method: 'GetServerInfo'
            },
            success: function (action) {
                me.fill(action.result);
            }
        }, config));
    },

    getLicTypeDisplayName: function (lic) {
        if (lic.LicenseType == 'Trial') {
            return RS.$('All_Lic_Trial');
        }
        if (lic.LicenseType == 'FoundationProcesses' ||
            lic.LicenseType == 'FoundationConcurrentUsersUsers') {
            return RS.$('All_Lic_Foundation');
        }
        else {
            if (lic.ModuleFlag == 8)
                return RS.$('All_Lic_BPA');
            else
                return ~lic.ModuleFlag ? RS.$('All_Lic_Standard'):RS.$('All_Lic_Exterprise');
        }
    }
});