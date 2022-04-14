
Ext.define('YZSoft.src.lib.viewcontainer.Single', {
    extend: 'YZSoft.src.lib.viewcontainer.Base',
    layout: 'card',

    addView: function (xclass, config) {
        var me = this,
            panel;

        panel = me.findPanelByXClass(xclass);
        if (!panel) {
            panel = Ext.create(xclass, config);
            me.add(panel);
            me.relayEvents(panel, ['folderChanged']);
        }
        else {
            Ext.apply(panel, config);
            me.setActiveItem(panel);
            panel.fireEvent('switchActive', config);
        }
    },

    findPanelByXClass: function (xclass) {
        return this.items.findBy(function (item) {
            return Ext.getClassName(item) == xclass;
        });
    }
});