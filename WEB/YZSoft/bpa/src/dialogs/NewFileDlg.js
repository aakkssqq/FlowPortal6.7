/*
config
folderid
*/

Ext.define('YZSoft.bpa.src.dialogs.NewFileDlg', {
    extend: 'Ext.window.Window', //111111
    title: RS.$('BPA__NewFile'),
    layout: 'fit',
    width: 869,
    height: 560,
    modal: true,
    resizable: false,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            categories, tabItems = [],
            cfg;

        YZSoft.Ajax.request({
            method: 'GET',
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPA/Templates.ashx'),
            params: {
                method: 'GetTemplateCategories',
                folderid: config.folderid
            },
            success: function (action) {
                categories = action.result;
            }
        });

        Ext.each(categories, function (category) {
            var displayName = category;

            tabItems.push({
                title: RS.$('All_BPA_TemplateCategories_Enum_' + displayName, displayName),
                category: category,
                tabConfig:{
                    minWidth: 100,
                    padding:'10 8'
                },
                listeners: {
                    scope: me,
                    selectionchange: 'updateStatus',
                    itemdblclick: 'onTemplateDblClick'
                }
            });
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            cls: 'yz-border',
            tabPosition: 'left',
            tabRotation: 0,
            tabBar: {
                padding:'4 0 0 0'
            },
            defaults: {
                xclass: 'YZSoft.bpa.src.view.TemplatesView',
                padding: 0
            },
            items: tabItems,
            listeners: {
                scope: me,
                tabchange: 'updateStatus'
            }
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
            disabled: true,
            handler: function () {
                var recs = me.getSelection();

                if (recs.length == 1)
                    me.closeDialog(recs[0]);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.tabMain],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    getSelection: function () {
        var me = this,
            view = me.tabMain.getActiveTab(),
            sm = view && view.getSelectionModel(),
            recs = sm && sm.getSelection();

        return recs || [];
    },

    onTemplateDblClick: function (view, record, item, index, e, eOpts) {
        this.closeDialog(record);
    },

    updateStatus: function () {
        var me = this,
            recs = me.getSelection();

        me.btnOK.setDisabled(recs.length != 1);
    }
});