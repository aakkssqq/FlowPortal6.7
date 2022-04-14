
Ext.define('2020.src.OAPortal', {
    extend: '2020.src.Abstract',
    requires: [
        'YZSoft.src.ux.Push',
        'YZSoft.src.ux.Badge'
    ],

    launch: function () {
        var me = this,
            url = Ext.String.format('{0}/Main.ashx', YZSoft.startApp),
            tab;

        document.title = me.title;
        Ext.getBody().addCls('yz-portal-2020 yz-portal-2020-oa');
        me.newMessages = userInfo.NewMessages;

        YZSoft.src.ux.Push.init({
        });

        Ext.Ajax.request({
            method: 'GET',
            disableCaching: true,
            url: url,
            params: {
                method: 'GetModuleTree'
            },
            success: function (response) {
                var result = Ext.decode(response.responseText),
                    modules = result;

                if (result.success === false) {
                    result.errorMessage = Ext.String.htmlDecode(result.errorMessage);
                    YZSoft.alert(result.errorMessage);
                    return;
                }

                if (modules.length == 0) {
                    window.location.replace(
                        Ext.String.urlAppend(YZSoft.$url('YZSoft/core/AccessDenied/App.aspx'), Ext.Object.toQueryString({
                            startApp: YZSoft.startApp,
                            appName: me.title
                        }))
                    );
                    return;
                }

                me.cmpLogo = Ext.create('Ext.Component', {
                    cls: 'yz-logo'
                });

                me.btnCollapse = Ext.create('Ext.button.Button', {
                    cls: 'yz-btn-portal-title yz-size-icon-14 yz-btn-navigate-collapse',
                    margin: '0 0 0 0',
                    padding: '3 3 3 0',
                    width: 'auto',
                    height: 'auto',
                    glyph: 0xeaa5,
                    scope: me,
                    handler: 'onToggleClick'
                });

                me.tabBar = bar = Ext.create('Ext.tab.Bar', {
                    cls: 'yz-tab-bar-navigator-maintop-column',
                    layout: {
                        type: 'table',
                        columns: 5
                    }
                });

                me.btnTask = Ext.create('Ext.button.Button', {
                    cls: 'yz-btn-portal-title yz-size-icon-22 yz-btn-messageindicator-task',
                    glyph: 0xeaa7,
                    margin: '0 20 0 0',
                    badgeText: userInfo.TaskCount,
                    handler: function () {
                        YZSoft.goto('BPM/Worklist');
                    }
                });

                me.btnMessage = Ext.create('Ext.button.Button', {
                    cls: 'yz-btn-portal-title yz-size-icon-18 yz-btn-messageindicator-message',
                    glyph: 0xeaa6,
                    badgeText: me.getNewMessageCount(userInfo.NewMessages),
                    handler: function () {
                        Ext.require('YZSoft.src.ux.AppSwitch', function () {
                            YZSoft.src.ux.AppSwitch.openApp('2020/IM');
                        });
                    }
                });

                me.btnEMIP = Ext.create('YZSoft.src.button.UseEMIP', {
                    height: '100%',
                    cls: 'yz-btn-portal-title yz-size-icon-18 yz-btn-useemip',
                    margin: '0 0 0 20'
                });

                me.btnLang = Ext.create('YZSoft.src.button.Language', {
                    height: '100%',
                    margin: '0 25 0 20'
                });
                
                me.btnUser = Ext.create('YZSoft.src.button.SigninUser', {
                    height: '100%',
                    margin: 0,
                    outofofficeSetting: userInfo.OutOfOfficeSetting
                });

                me.btnApps = Ext.create('Ext.button.Button', {
                    cls: 'yz-btn-portal-title yz-btn-appswitch',
                    glyph: 0xeaa8,
                    height: '100%',
                    scope: me,
                    handler: 'onSwitchAppClick'
                });

                me.tabBarColumnWrap = Ext.create('YZSoft.src.tab.TabBarColumnWrap', {
                    tabBar: me.tabBar,
                    height: '100%',
                    btnConfig: {
                    }
                });

                me.titlebar = Ext.create('Ext.container.Container', {
                    region: 'north',
                    cls: 'yz-titlebar-portal',
                    height: me.bannerHeight,
                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    },
                    items: [{
                        xtype: 'container',
                        cls:'yz-cnt-logowrap',
                        width: me.logoSectionWidth,
                        height: '100%',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                            pack: 'center'
                        },
                        items: [
                            me.cmpLogo
                        ]},
                        me.btnCollapse,
                        me.tabBarColumnWrap,
                        { xtype: 'tbfill' },
                        me.btnTask,
                        me.btnMessage,
                        me.btnEMIP,
                        me.btnLang,
                        me.btnUser,
                        me.btnApps
                    ]
                });

                me.tab = Ext.create('YZSoft.frame.tab.Navigator', {
                    region: 'center',
                    activeTab: me.activeTab || 0, //from 0
                    tabBar: me.tabBar,
                    modules: modules
                });

                YZSoft.mainTab = me.tab;
                YZSoft.frame = Ext.create('Ext.container.Viewport', {
                    layout: 'card',
                    items: [{
                        xtype: 'container',
                        layout: 'border',
                        items: [
                            me.titlebar,
                            me.tab
                        ]
                    }]
                });

                YZSoft.src.ux.Push.subscribe({
                    cmp: me,
                    channel: ['worklistChanged', 'social', 'readed', 'taskApproved', 'taskRejected', 'processRemind'],
                    fn: function () {
                        YZSoft.src.ux.Push.on({
                            scope: me,
                            worklistChanged: 'onWorkListChanged',
                            social: function (message) {
                                //自己说话推送到自己
                                if (message.clientid != YZSoft.src.ux.Push.clientid)
                                    me.onNotify(message);
                            },
                            readed: function (message) {
                                //自己说话推送到自己
                                if (message.clientid != YZSoft.src.ux.Push.clientid) 
                                    me.onNotify(message);
                            },
                            taskApproved: 'onNotify',
                            taskRejected: 'onNotify',
                            processRemind: 'onNotify'
                        });
                    }
                });

                YZSoft.src.ux.Badge.fireEvent('badgeChange', 'worklistcount', userInfo.WorkListCount);
                YZSoft.src.ux.Badge.fireEvent('badgeChange', 'sharetaskcount', userInfo.ShareTaskCount);
            },
            failure: function (response) {
                YZSoft.alert(Ext.String.format(RS.$('All_LoadModuleFailed_Msg'), url, response.status == 404 ? response.statusText : (response.responseText || '')));
            }
        });
    }
});