/*
应用基础类
应用由左侧导航菜单和右侧功能模块组成
*/
Ext.define('YZSoft.frame.app.Abstract',{
    extend: 'Ext.container.Container',
    onToggleMenu: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        me.on({
            single: true,
            order: 'after',
            boxready: function (to, from, opt) {
                me.on({
                    activate: function () {
                        me.moduleContainer.fireEvent('activate');
                    }
                });
            }
        });

        me.on({
            scope:me,
            togglemenu: 'onToggleMenu'
        });
    }
});