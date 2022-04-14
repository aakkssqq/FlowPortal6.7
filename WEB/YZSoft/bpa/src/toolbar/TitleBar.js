
Ext.define('YZSoft.bpa.src.toolbar.TitleBar', {
    extend: 'Ext.toolbar.Toolbar',
    cls: 'yz-flat bpa-tbar-title',
    style: 'background-color:white',
    sp1: {
        xtype: 'tbseparator',
        height: 17,
        margin: '0 8 0 2'
    },
    sp: '-',
    logo: {
        xtype: 'component',
        cls: 'bpa-logo',
        margin: '0 8 0 36'
    },
    padding: 0,

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        if (me.btnUser) {
            me.btnUser.on({
                scope: me,
                personalInfoClick: 'onPersonalInfoClick'
            });
        }
    },

    onPersonalInfoClick: function () {
        var me = this,
            cnt = me.up(YZSoft.modulesContainerSelector),
            pnl;

        pnl = cnt.showModule({
            xclass: 'YZSoft.personal.UserInfoPanel',
            config: {
            },
            match: function (item) {
                return false;
            }
        });

        pnl.on({
            saved: function () {
                cnt.closeModule(pnl);
            }
        });
    }
});