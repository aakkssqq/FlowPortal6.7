
Ext.define('YZSoft.src.dialogs.docked.Employee', {
    extend: 'Ext.window.Window', //111111
    cls:'yz-dlg-employee-info',
    config: {
        uid: null
    },
    header: false,
    floatingClose: true,
    width: 500,
    statics: {
        show: function (uid) {
            var me = this;

            if (!me.dlg) {
                me.dlg = Ext.create('YZSoft.src.dialogs.docked.Employee', {
                    dock: 'right',
                    modal: false,
                    closeAction: 'hide'
                });
            }

            me.dlg.setUid(uid);
            me.dlg.show();
        }
    },
    viewModel: {
        data: {
            Account: '99199',
            ShortName: 'Steve',
            OfficePhone: '1111',
            Mobile: '18603059133',
            EMail: '1040561068@qq.com',
            Sex: 'Female',
            DateHired: new Date(2015, 7, 13, 0, 0, 0),
            Birthday: new Date(2013, 3, 18, 0, 0, 0),
            Description: 'A person\'s success lies in pursuit and grasp',
            HRID: '031608106',
            Office: null,
            CostCenter: "555-555-5555",
            OfficePhone: "021-63808761",
            HomePhone: null,
            WWWHomePage: "www.flowportal.com",
            oufullName: 'Development Department',
            LeaderTitle: 'Manager',
            supervisors:'<a class="yz-s-uid" uid="88188" href="#">Ikovin</a>'
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',  //头部
                style: 'background-color:#39a773',
                padding: '30 20 40 60',
                layout: {
                    type: 'vbox'
                },
                items: [{
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        pack:'start'
                    },
                    items: [{
                        xclass: 'YZSoft.src.component.Headshort',
                        margin: '0 0 0 0',
                        width: 120,
                        height: 120,
                        style: 'border: 4px solid #7fb5e4;border-radius:60px',
                        bind: {
                            uid: '{Account}'
                        }
                    }, {
                        xtype: 'container',
                        margin: '12 0 0 40',
                        layout: 'vbox',
                        items: [{
                            xtype: 'component',
                            cls: 'dspname',
                            bind: '{ShortName:text}'
                        },{
                            xtype: 'component',
                            cls: 'ou',
                            margin: '12 0 3 0',
                            bind: '{oufullName:text}'
                        }, {
                            xtype: 'component',
                            cls: 'leadertitle',
                            margin: '0 0 3 0',
                            bind: '{LeaderTitle:text}'
                        }]
                    }]
                }, {
                    xtype: 'component',
                    cls: 'box yz-glyph yz-glyph-eaad',
                    margin: '30 0 12 10',
                    bind: '{Mobile:text}'
                }, {
                    xtype: 'component',
                    cls: 'box yz-glyph yz-glyph-eaaf',
                    margin: '0 0 3 10',
                    bind: '{EMail:text}'
                }]
            }, {
                xtype: 'container',
                flex:1,
                scrollable:'y',
                layout: {
                    type: 'vbox',
                    align:'stretch'
                },
                items: [{
                    xtype: 'container',
                    padding: '36 30 20 70',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'displayfield',
                        fieldLabel: RS.$('All_BirthdaySimple'),
                        bind: '{Birthday}'
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: RS.$('All_DateHired'),
                        bind: '{DateHired}'
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: RS.$('All_OfficePhone'),
                        bind: '{OfficePhone:text}'
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: RS.$('All_UserDesc'),
                        bind: '{Description:text}'
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: RS.$('All_Supervisor'),
                        bind: '{supervisors}'
                    }]
                }, {
                    xtype: 'container',
                    padding: '70 30 40 30',
                    layout: {
                        type: 'hbox',
                        pack: 'middle'
                    },
                    defaults: {
                        xtype: 'button',
                        overCls: '',
                        margin: '0 10 0 10',
                        scale: 'medium'
                    },
                    items: [{
                        cls: 'yz-btn-facebook',
                        disabled: true,
                        iconCls: 'x-fa fa-facebook'
                    }, {
                        cls: 'yz-btn-twitter',
                        disabled: true,
                        iconCls: 'x-fa fa-twitter'
                    }, {
                        cls: 'yz-btn-email',
                        iconCls: 'x-fa fa-envelope'
                    }, {
                        cls: 'yz-btn-google',
                        iconCls: 'x-fa fa-commenting'
                    }]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    updateUid: function (uid) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Employee.ashx'),
            params: {
                method: 'GetContactInfo',
                account: uid
            },
            success: function (action) {
                var userInfo = action.result.user,
                    position = action.result.position,
                    supervisors = action.result.supervisors,
                    spvs = [];

                me.uid = uid;

                if (position)
                    position.LeaderTitle = position.LeaderTitle || RS.$('All_Employee');

                Ext.each(supervisors, function (supervisor) {
                    spvs.push(Ext.String.format('<span class="yz-s-uid yz-link-user" uid="{0}" tip-align="br-tr?">{1}</span>',
                        Ext.util.Format.text(supervisor.Account),
                        Ext.util.Format.text(supervisor.UserName || supervisor.Account)));
                });

                me.getViewModel().set(Ext.apply({
                    supervisors: spvs.join(' ; ')
                }, position, userInfo));
            }
        });
    }
});