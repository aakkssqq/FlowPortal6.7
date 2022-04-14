
Ext.define('YZSoft.src.ux.Badge', {
    extend: 'Ext.Evented',
    singleton: true,
    badges: {},

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            scope: me,
            badgeChange: 'onBadgeChange'
        });
    },

    onBadgeChange: function (badgeId, badgeText) {
        var me = this,
            badges = me.badges;

        badges[badgeId] = {
            badgeId: badgeId,
            badgeText: badgeText
        };
    },

    getBadge:function(badgeId){
        var me = this,
            badges = me.badges;
    
        return badges[badgeId];
    }
});