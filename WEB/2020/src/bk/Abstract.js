Ext.define('2020.src.Abstract', {
    extend: 'Ext.app.Application',
    appswitch: YZSoft.$url('2020/Services.REST/AppSwitch.ashx'),
    bannerHeight: 56,
    logoSectionWidth:201,

    constructor: function (config) {
        var me = this;

        Ext.setKeyboardMode(false);

        me.callParent(arguments);

        Ext.defer(function () {
            Ext.require([
                'YZSoft.src.frame.win10.AppSwitch',
                'YZSoft.src.tip.UserTip'
            ], function () {
                me.winSiteSwitch = Ext.create('YZSoft.src.frame.win10.AppSwitch', {
                    url: me.appswitch
                });

                me.fireEvent('appswitchcreated');
            });
        }, 100);

        Ext.defer(function () {
            //var dlg = Ext.create('YZSoft.src.dialogs.docked.Employee', {
            //    title: 'Test Component animation',
            //    modal: false,
            //    dock: 'right',
            //    uid:'99199',
            //    width: 500,
            //    closeAction: 'hide'
            //});
            //dlg.show();
            //Ext.require('YZSoft.src.dialogs.docked.Employee', function () {
            //    YZSoft.src.dialogs.docked.Employee.show('99199');
            //});

            //var dlg = Ext.create('YZSoft.src.dialogs.HeadshotDlg', {
            //    uid:'99199'
            //});
            //dlg.show();

            //var dlg = Ext.create('YZSoft.src.dialogs.SignDlg', {
            //    uid:'99199'
            //});
            //dlg.show();

            //Ext.toast({
            //    html: '密码已修改',
            //    align: 'b',
            //    anchor: Ext.getApplication().titlebar,
            //    animate: false,
            //    frame: false,
            //    shadow: false,
            //    autoClose: false,
            //    cls: 'yz-toast',
            //    bodyPadding: '3 24',
            //    paddingY:5
            //});
        },100);
    },

    onWorkListChanged: function (message) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskList.ashx'),
            params: {
                Method: 'GetTaskCount'
            },
            success: function (action) {
                var result = action.result,
                    total = result.total,
                    worklist = result.worklist,
                    sharetask = result.sharetask;

                me.btnTask.setBadgeText(total || '');

                YZSoft.src.ux.Badge.fireEvent('badgeChange', 'worklistcount', worklist);
                YZSoft.src.ux.Badge.fireEvent('badgeChange', 'sharetaskcount', sharetask);
            },
            failure: function (action) {
            }
        });
    },

    onNotify: function (message) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                Method: 'GetNewMessageCount'
            },
            success: function (action) {
                var items = me.newMessages = action.result,
                    total = me.getNewMessageCount(items);

                me.btnMessage.setBadgeText(total || '');
            },
            failure: function (action) {
            }
        });
    },

    getNewMessageCount: function (items) {
        var total = 0;

        Ext.each(items, function (item) {
            total += item.newmessage;
        });

        return total;
    },

    showMessages: function () {
        alert(Ext.encode(this.newMessages));
    },

    onSwitchAppClick: function (btn) {
        var me = this,
            fn;

        fn = function () {
            me.winSiteSwitch.showBy(btn, 'tr-br?', [0, 16]);
        };

        if (me.winSiteSwitch) {
            fn();
        }
        else{
            me.on({
                appswitchcreated: function () {
                    fn();
                }
            });
        }
    },

    onToggleClick: function () {
        var me = this,
            tab = me.tab,
            activeTab = tab && tab.getActiveTab();

        if (!activeTab)
            return;

        activeTab.fireEvent('togglemenu');
    }
});