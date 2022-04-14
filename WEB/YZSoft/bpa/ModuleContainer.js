
Ext.define('YZSoft.bpa.ModuleContainer', {
    extend: 'YZSoft.src.container.ModuleContainer',
    cls: 'yz-identity-modulecontainer',

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            clickMainMenuOnPressedState: function () {
                me.setActiveModule(me.home);
            }
        });
    }
});