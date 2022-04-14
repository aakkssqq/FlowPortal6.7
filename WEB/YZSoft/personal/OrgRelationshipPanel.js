
Ext.define('YZSoft.personal.OrgRelationshipPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
    ],
    scrollable: true,
    bodyPadding: 20,
    bodyStyle: 'background-color:#f5f5f5',
    ui: 'light',
    icon: YZSoft.$url('YZSoft/theme/images/icon/account_info.png'),
    header: {
        cls: 'yz-header-module'
    },

    constructor: function (config) {
        var me = this,
            gridDefaults,cfg;

        me.user = userInfo;

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
                    resizable: false
                },
                items: [
                    { text: RS.$('All_OU'), flex: 1, dataIndex: 'ou', formatter: 'text' },
                    { text: RS.$('All_LeaderTitle'), width: 100, dataIndex: 'LeaderTitle', align: 'center', formatter: 'text' },
                    { text: RS.$('All_MemberLevel'), width: 60, dataIndex: 'Level', align: 'center', formatter: 'text' },
                    {
                        xtype: 'actioncolumn',
                        text: RS.$('All_Default_PositionSM'),
                        width: 80,
                        align: 'center',
                        disabledCls: 'yz-display-none',
                        items: [{
                            glyph: 0xead1,
                            iconCls: 'yz-size-icon-13 yz-action-defaultposition',
                            isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                                return record.data.IsDefaultPosition;
                            },
                            handler: function (grid, rowIndex, colIndex, item, e, record) {
                                me.setDefaultPosition(record);
                            }
                        }, {
                            glyph: 0xead0,
                            iconCls: 'yz-size-icon-13 yz-action-defaultposition-yes',
                            isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                                return !record.data.IsDefaultPosition;
                            }
                        }]
                    }
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
            tools: [{
                glyph: 0xe60f,
                tooltip: RS.$('All_Refresh'),
                handler: function () {
                    me.load({
                        waitMsg: {
                            msg: RS.$('All_Loading'),
                            target: me,
                            start:0
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
                    title: RS.$('All_My_Position'),
                    margin:'0 0 20 0',
                    items: [
                        me.positionGrid
                    ]
                }, {
                    title: RS.$('All_My_Supervisor'),
                    margin: '0 0 20 0',
                    padding: '20 0 20 20',
                    items: [
                        me.supervisorView
                    ]
                }, {
                    title: RS.$('All_My_Subordinates'),
                    padding: '20 0 20 20',
                    items: [
                        me.xsView
                    ]
                }]
            }, {
                padding:'0 0 0 20',
                items: [{
                    title: RS.$('All_My_Roles'),
                    margin: '0 0 20 0',
                    items: [
                        me.roleGrid
                    ]
                }, {
                    title: RS.$('All_My_SecurityGroup'),
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
                    target:this
                }
            });
        //else   //头像闪烁比较大
        //    this.load();
    },

    fill: function (data) {
        var me = this,
            ref = me.getReferences();

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
                account: me.user.Account,
                defaultPosition: true
            },
            success: function (action) {
                me.fill(action.result);
            }
        }, config));
    },

    setDefaultPosition: function (rec) {
        var me = this,
            uid = me.user.Account,
            memberfullname = rec.data.MemberFullName;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
            params: {
                method: 'SetUserDefaultPosition',
                uid: uid,
                memberFullName: memberfullname
            },
            waitMsg: {
                target: me
            },
            success: function (result) {
                rec.store.each(function (rec1) {                  
                    rec1.set('IsDefaultPosition', rec1 == rec);
                });
            }
        });
    }
});