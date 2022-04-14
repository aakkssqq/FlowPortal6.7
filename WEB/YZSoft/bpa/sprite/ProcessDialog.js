/*
config
tables
data
*/

Ext.define('YZSoft.bpa.sprite.ProcessDialog', {
    extend: 'Ext.window.Window', //777777
    layout: 'fit',
    width: 816,
    height: 580,
    modal: true,
    maximizable: true,
    bodyPadding: 0,
    buttonAlign: 'right',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            cnt = config.drawContainer,
            fileinfo = cnt.fileinfo,
            groupInfo = cnt.designer.groupInfo,
            ext = cnt.designer.ext,
            groupid = groupInfo && groupInfo.Group.GroupID,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpa.sprite.PropertyPages.ProcessGeneral', {
            padding: '11 26 5 26',
            evcProcessType: config.data.Property.EvcProcessType,
            groupid: groupid
        });

        me.pnlDesc = Ext.create('YZSoft.bpa.sprite.PropertyPages.ProcessDescription', {
            padding: '20 26 5 26',
            ext: ext,
            groupid: groupid
        });

        me.pnlAdd = Ext.create('YZSoft.bpa.sprite.PropertyPages.ProcessAdditional', {
            padding: '10 26 5 26'
        })

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlDesc,
                me.pnlAdd
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
        var me = this,
            cnt = me.drawContainer,
            fileinfo = cnt.fileinfo,
            filename = fileinfo && fileinfo.processName;

        me.pnlGeneral.fill(Ext.apply({
            Name: filename
        }, data.Property));

        me.pnlDesc.fill(Ext.apply({
        }, data.Property));

        me.pnlAdd.fill(Ext.apply({
        }, data.Property));
    },

    save: function () {
        var me = this,
            data = {};

        data.Property = me.pnlGeneral.save();
        data.Property = Ext.apply(data.Property, me.pnlDesc.save());
        data.Property = Ext.apply(data.Property, me.pnlAdd.save());

        return data;
    }
});