
Ext.define('YZSoft.personal.UserInfoTab', {
    extend: 'YZSoft.frame.tab.Base',
    header: false,
    margin:'30 0 0 50',
    tabBar: {
        cls: 'yz-tab-bar-undline yz-tab-bar-size-l yz-tab-bar-account',
        padding:'0 0 10 0'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlUserInfo = Ext.create('YZSoft.personal.UserInfoPanel', {
            title: RS.$('All_UserInfo'),
            listeners: {
                headshotChanged: function () {
                    Ext.getDoc().fireEvent('headshotChanged');
                },
                usernameChanged: function (newName) {
                    Ext.getDoc().fireEvent('usernameChanged', newName);
                }
            }
        });

        me.pnlChangePassword = Ext.create('YZSoft.personal.ChangePasswordPanel', {
            title: RS.$('All_ChangePwd'),
            tabConfig: {
                margin: '0 0 0 40'
            }
        });

        cfg = {
            defaults: {
                tabConfig: {
                    padding: '10 3'
                }
            },
            activeTab:0,
            items: [
                me.pnlUserInfo,
                me.pnlChangePassword
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});