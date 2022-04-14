
Ext.define('YZSoft.bpm.maintenance.OrgRelationshipHandoverSummaryPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
    ],
    scrollable: true,
    bodyPadding: 20,
    bodyStyle: 'background-color:#f5f5f5',
    header: false,

    constructor: function (config) {
        var me = this,
            user = me.user = userInfo,
            gridDefaults,cfg;

        me.headshot = Ext.create('YZSoft.src.component.Headshort', {
            margin: '0 0 0 0',
            width: 60,
            height: 60,
            margin: '10 10 10 15',
            style: 'border-radius:40px',
            uid: userInfo.Account
        });

        me.cmpUserName = Ext.create('Ext.Component', {
            style: 'font-size:18px;color#000;color:#606060;',
            html: Ext.String.format(RS.$('All_UserRelationship_Caption'), user.DisplayName || user.Account)
        });

        me.btnSelUser = Ext.create('Ext.button.Button', {
            cls: 'yz-btn-round3 yz-btn-submit',
            text: RS.$('All_SelUser'),
            margin: '0 0 0 10',
            padding: '4 6',
            handler: function () {
                YZSoft.SelUserDlg.show({
                    fn: function (user) {
                        me.user = user;
                        me.load({
                            waitMsg: {
                                msg: RS.$('All_Loading'),
                                target: me
                            }
                        });
                    }
                });
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            glyph: 0xe60f,
            cls: 'yz-btn-titlebar-light',
            tooltip:RS.$('All_Refresh'),
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

        me.titlebar = Ext.create('Ext.container.Container', {
            dock: 'top',
            padding:'0 8 0 0',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [
                me.headshot,
                me.cmpUserName,
                me.btnSelUser,
                { xtype: 'tbfill' },
                me.btnRefresh
            ]
        });

        gridDefaults = {
            border: false,
            rowLines: false,
            viewConfig: {
                stripeRows: false
            }
        };

        me.positionGrid = Ext.create('Ext.grid.Panel', Ext.apply({
            cls: ['yz-grid-size-m', 'yz-grid-header-fontweight-normal', 'yz-grid-employee-pos'],
            store: Ext.create('Ext.data.Store', {
                model: 'Ext.data.Model'
            }),
            columns: {
                defaults: {
                    sortable: false,
                    draggable: false,
                    menuDisabled: true,
                    resizable: false,
                    formatter:'text'
                },
                items: [
                    { text: RS.$('All_OU'), flex: 1, dataIndex: 'ou' },
                    { text: RS.$('All_LeaderTitle'), width: 100, dataIndex: 'LeaderTitle', align: 'center' },
                    { text: RS.$('All_MemberLevel'), width: 100, dataIndex: 'Level', align: 'center' }
                ]
            }
        }, gridDefaults));

        me.supervisorView = Ext.create('YZSoft.src.view.SupervisorView', {
        });

        me.xsView = Ext.create('YZSoft.src.view.SupervisorView', {
        });

        me.roleGrid = Ext.create('Ext.grid.Panel', Ext.apply({
            cls: ['yz-grid-size-m', 'yz-grid-header-fontweight-normal', 'yz-grid-employee-role'],
            store: Ext.create('Ext.data.Store', {
                model: 'Ext.data.Model'
            }),
            columns: {
                defaults: {
                    sortable: false,
                    draggable: false,
                    menuDisabled: true,
                    resizable: false,
                    formatter: 'text'
                },
                items: [
                    { text: RS.$('All_OU'), flex: 1, dataIndex: 'ou' },
                    { text: RS.$('All_Role'), width: 180, dataIndex: 'RoleName' }
                ]
            }
        }, gridDefaults));

        me.groupGrid = Ext.create('Ext.grid.Panel', Ext.apply({
            cls: ['yz-grid-size-m', 'yz-grid-header-fontweight-normal', 'yz-grid-employee-group'],
            store: Ext.create('Ext.data.Store', {
                model: 'Ext.data.Model'
            }),
            emptyText: RS.$('All_None'),
            columns: {
                defaults: {
                    sortable: false,
                    draggable: false,
                    menuDisabled: true,
                    resizable: false,
                    formatter: 'text'
                },
                items: [
                    { text: RS.$('All_SecurityGroup'), flex: 1, dataIndex: 'GroupName' }
                ]
            }
        }, gridDefaults));

        cfg = {
            dockedItems: [me.titlebar],
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'begin'
            },
            defaults: {
                xtype: 'container',
                width: 600,
                defaults: {
                    xtype: 'panel',
                    style:'background-color:#fff;border-radius:0px;',
                    padding: 20,
                    ui: 'light',
                    header: {
                        cls: 'yz-header-simple'
                    }
                }
            },
            items: [{
                items: [{
                    title: RS.$('All_Employee_Position'),
                    margin:'0 0 20 0',
                    items: [
                        me.positionGrid
                    ]
                }, {
                    title: RS.$('All_Employee_Supervisor'),
                    margin: '0 0 20 0',
                    padding:'20 0 20 20',
                    items: [
                        me.supervisorView
                    ]
                }, {
                    title: RS.$('All_Employee_Subordinates'),
                    padding: '20 0 20 20',
                    items: [
                        me.xsView
                    ]
                }]
            }, {
                padding:'0 0 0 20',
                items: [{
                    title: RS.$('All_Employee_Roles'),
                    margin: '0 0 20 0',
                    items: [
                        me.roleGrid
                    ]
                }, {
                    title: RS.$('All_Employee_SecurityGroup'),
                    items: [
                        me.groupGrid
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
        //else   //头像闪烁比较大
        //    this.load();
    },

    fill: function (data) {
        var me = this,
            user = data.user,
            account = user.Account,
            userName = user.DisplayName || account;

        me.setTitle(Ext.String.format(RS.$('All_UserRelationship_Title'), userName));
        me.headshot.setUid(account);
        me.cmpUserName.update(Ext.String.format(RS.$('All_UserRelationship_Caption'), user.DisplayName || user.Account));

        if (data.roles.length == 0)
            data.roles = [{ ou: RS.$('All_None')}];

        if (data.groups.length == 0)
            data.groups = [{ GroupName: RS.$('All_None')}];

        me.positionGrid.getStore().setData(data.positions);
        me.roleGrid.getStore().setData(data.roles);
        me.groupGrid.getStore().setData(data.groups);
        me.supervisorView.getStore().setData(data.supervisors);
        me.xsView.getStore().setData(data.directxss);
    },

    load: function (config) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Employee.ashx'),
            params: {
                method: 'GetEmployeeInfo',
                account: me.user.Account
            },
            success: function (action) {
                me.fill(action.result);
            }
        }, config));
    }
});