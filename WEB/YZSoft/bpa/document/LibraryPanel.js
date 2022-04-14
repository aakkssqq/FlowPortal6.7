﻿
/*
config
    libid
*/
Ext.define('YZSoft.bpa.document.LibraryPanel', {
    extend: 'Ext.container.Container',
    layout: 'border',

    constructor: function (config) {
        var me = this,
            cfg;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Library.ashx'),
            params: {
                method: 'GetLibrary',
                libid: config.libid
            },
            success: function (action) {
                me.libInfo = action.result;
            }
        });

        me.titlebar = Ext.create('YZSoft.bpa.document.toolbar.LibraryTitleBar', {
            region: 'north',
            height: 64
        });

        me.pnlLib = Ext.create('YZSoft.bpa.document.DocumentPanel', {
            title: RS.$('BPA_DocumentLib'),
            libInfo: me.libInfo
        });

        me.tabBar = Ext.create('Ext.tab.Bar', {
            cls: 'bpa-tab-bar-underline'
        });

        me.pnlTabBar = Ext.create('Ext.container.Container', {
            region: 'north',
            layout: 'fit',
            padding: '10 0 0 3',
            style: 'background-color:#f5f5f5',
            items: [me.tabBar]
        });

        me.tab = Ext.create('YZSoft.src.tab.Panel', {
            region: 'center',
            border: false,
            activeTab: 0,
            tabBar: me.tabBar,
            items: [
                me.pnlLib
            ]
        });

        cfg = {
            items: [me.titlebar, me.pnlTabBar, me.tab]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            activate: function () {
                me.tab.getLayout().getActiveItem().fireEvent('activate');
            }
        });
    }
});