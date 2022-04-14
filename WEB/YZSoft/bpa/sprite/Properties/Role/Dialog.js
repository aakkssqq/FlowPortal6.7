/*
config
*/

Ext.define('YZSoft.bpa.sprite.Properties.Role.Dialog', {
    extend: 'YZSoft.bpa.sprite.Properties.Dialog', //999999

    constructor: function (config) {
        var me = this,
            sprite = config.property.sprite,
            cnt = sprite.drawContainer,
            fileinfo = cnt.fileinfo,
            groupInfo = config.property.sprite.drawContainer.designer.groupInfo,
            groupid = groupInfo && groupInfo.Group.GroupID,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpa.sprite.PropertyPages.RoleGeneral', {
            padding: '20 26 0 26'
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral
            ]
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                var data = me.save();
                me.closeDialog(data);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            buttons: [me.btnOK, me.btnCancel],
            items: [me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.data)
            me.fill(config.data);
    },

    fill: function (data) {
        var me = this;

        me.pnlGeneral.fill(data);
    },

    save: function () {
        var me = this,
            data = {};

        data = Ext.apply(data, me.pnlGeneral.save());

        return data;
    }
});