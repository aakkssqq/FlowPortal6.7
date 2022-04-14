/*
    模块的tab
*/
Ext.define('YZSoft.frame.tab.Base',{
    extend: 'YZSoft.src.tab.Panel',

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            single:true,
            order:'after',
            boxready: function (to, from, opt) {
                me.on({
                    activate: function () {
                        var pnl = me.getActiveTab();
                        pnl && pnl.fireEvent('activate');
                    }
                });
            }
        });
    }
});