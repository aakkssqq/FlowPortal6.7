
Ext.define('YZSoft.src.button.SigninUser', {
    extend: 'Ext.button.Button',
    cls: 'yz-flat yz-btn-signinuser',

    constructor: function (config) {
        var me = this,
            outofofficeSetting = config.outofofficeSetting,
            outffofficeIndicate = me.getOutOfOfficeIndicate(outofofficeSetting),
            cfg, icon, accountMenu, outofofficeMenu, helpMenu, logoutMenu;

        accountMenu = Ext.apply({
            iconCls: 'yz-glyph yz-glyph-e96b',
            text: RS.$('All_SettingAccount'),
            handler: function () {
                YZSoft.goto('Personal/UserInfo');
            }
        }, config.accountMenu);

        outofofficeMenu = Ext.apply({
            iconCls: 'yz-glyph yz-glyph-e96c',
            text: outffofficeIndicate.menuText,
            handler: function () {
                YZSoft.goto('Personal/LeavingSetting');
            }
        }, config.outofofficeMenu);

        helpMenu = Ext.apply({
            iconCls: 'yz-glyph yz-glyph-e969',
            text: RS.$('All_Help'),
            handler: function () {
                window.open("http://developer.flowportal.com");
            }
        }, config.helpMenu);

        logoutMenu = Ext.apply({
            iconCls: 'yz-glyph yz-glyph-e96a',
            text: RS.$('All_Logout'),
            handler: function () {
                YZSoft.logout();
            }
        }, config.logoutMenu);

        me.menuOut = Ext.create('Ext.menu.Item', outofofficeMenu);

        cfg = {
            icon: me.getSrc(userInfo.Account),
            menuAlign: 'tr-br?',
            text: userInfo.ShortName + outffofficeIndicate.indicateText,
            menu: {
                cls: 'yz-menu-signinuser',
                shadow: false,
                bodyPadding: '12 0',
                defaults: {
                    padding: '3 12'
                },
                items: [accountMenu, me.menuOut, helpMenu, logoutMenu]
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        Ext.getDoc().on({
            outofofficeChange: function (setting) {
                me.updateOutOfOfficeIndicate(setting);
            },
            headshotChanged: function () {
                me.setIcon(me.getSrc(userInfo.Account));
            },
            usernameChanged: function (newName) {
                me.setText(newName || userInfo.Account);
            }
        });
    },

    getSrc: function () {
        var me = this,
            url, params;

        url = YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx');
        params = {
            Method: 'GetHeadshot',
            account: userInfo.Account,
            thumbnail: 'S',
            _dc: +new Date()
        };

        return Ext.String.urlAppend(url, Ext.Object.toQueryString(params));

    },

    isOutOfOffice: function (setting) {
        var now = new Date();

        if (setting.State == 'InOffice')
            return false;

        if (setting.State == 'Out')
            return true;

        return (now >= setting.From && now < setting.To);
    },

    willOutOfOffice: function (setting, now) {
        if (setting.State == 'InOffice')
            return false;

        if (setting.State == 'Out')
            return false;

        return setting.From > now;
    },

    getOutOfOfficeIndicate: function (setting) {
        var me = this,
            now = new Date();

        if (!setting) {
            return {
                indicateText: '',
                menuText: RS.$('All_SetOutofOffice')
            }
        }

        if (me.isOutOfOffice(setting, now)) {
            return {
                indicateText: Ext.String.format("<span class='yz-indicator-outofoffice'>({0})</span>", RS.$('All_OutingOfOffice')),
                menuText: Ext.String.format("<span class='yz-menu-canceloutofoffice'>{0}</span>", RS.$('All_GetBack'))
            };
        }
        else if (me.willOutOfOffice(setting, now)) {
            return {
                indicateText: Ext.String.format("<span class='yz-indicator-willoutofoffice'>({0})</span>", RS.$('All_WillOutOfOffice')),
                menuText: Ext.String.format("<span class='yz-menu-canceloutofoffice'>{0}</span>", RS.$('All_GetBack'))
            };
        }
        else {
            return {
                indicateText: '',
                menuText: RS.$('All_SetOutofOffice')
            }
        }
    },

    updateOutOfOfficeIndicate: function (setting) {
        var me = this,
            outffofficeIndicate = me.getOutOfOfficeIndicate(setting);

        me.setText(userInfo.ShortName + outffofficeIndicate.indicateText);
        me.menuOut.setText(outffofficeIndicate.menuText);
    }
});