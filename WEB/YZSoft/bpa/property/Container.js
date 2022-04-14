/*
config:
drawContainer,
pnlSocialConfig,
pnlReportsConfig,
pnlSpriteFileConfig
*/

Ext.define('YZSoft.bpa.property.Container', {
    extend: 'Ext.container.Container',
    style: 'background-color:#f5f5f5;',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.tabBar = Ext.create('Ext.tab.Bar', {
            border: false,
            cls: 'yz-designer-tab-bar-property'
        });

        me.btnClose = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-close',
            cls: 'yz-designer-header-btn',
            handler: function () {
                me.hide();
            }
        });

        me.headerBar = Ext.create('Ext.container.Container', {
            region: 'north',
            style: 'background-color:#d8d8d8;',
            padding: '3 3 0 10',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [me.tabBar, { xtype: 'tbfill' }, me.btnClose]
        });

        me.pnlSocial = Ext.create('YZSoft.im.social.bbs.core.BBS', Ext.apply({
            title: RS.$('KM_Social'),
            border: false,
            scrollable: true,
            padding: '40 10 10 10',
            style:'background-color:#f5f5f5',
            commentsConfig: {
                height: 128,
                margin: '0 10 40 0'
            },
            viewConfig: {
                cls: 'yz-bbs-simple yz-bbs-gray',
                margin: '0 10 0 0',
                padding: '0 0 30 0'
            }
        },config.pnlSocialConfig));

        me.pnlReports = Ext.create('YZSoft.bpa.property.Report', Ext.apply({
            style: 'background-color:#f5f5f5',
            drawContainer: config.drawContainer
        }, config.pnlReportsConfig));

        me.pnlUsedBy = Ext.create('YZSoft.bpa.property.UsedBy', {
            drawContainer: config.drawContainer,
            padding: '1 0 0 0',
            gridConfig: {
                border: false
            }
        });

        me.pnlLinkedFile = Ext.create('YZSoft.bpa.property.LinkedFile', {
            drawContainer: config.drawContainer,
            padding: '1 0 0 0',
            gridConfig: {
                border: false
            }
        });

        me.pnlSpriteFile = Ext.create('YZSoft.bpa.property.SpriteFile', Ext.apply({
            style: 'background-color:#f5f5f5',
            drawContainer: config.drawContainer
        }, config.pnlSpriteFileConfig));

        me.pages = [me.pnlSocial, me.pnlReports, me.pnlUsedBy, me.pnlLinkedFile, me.pnlSpriteFile];

        me.tabMain = Ext.create('YZSoft.src.tab.Panel', {
            region: 'center',
            bodyStyle: 'background-color:transparent',
            activeTab: 1,
            tabBar: me.tabBar,
            items: [me.pnlSocial, me.pnlReports, me.pnlUsedBy, me.pnlLinkedFile]
        });

        cfg = {
            layout: 'border',
            items: [me.headerBar, me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.pnlUsedBy, ['fileClick']);
        me.relayEvents(me.pnlLinkedFile, ['fileClick']);

        me.drawContainer.on({
            scope: me,
            selectionchange: 'onSelectionChange'
        });

        me.on({
            scope: me,
            beforeshow: 'onBeforeShow',
            activate: function () {
                me.tabMain.getActiveTab().fireEvent('activate');
            }
        });

        me.tabMain.on({
            scope: me,
            beforetabchange: 'onBeforeTabChange'
        });
    },

    setFolderID: function (folderid) {
        var me = this;

        me.pnlReports.setFolderID(folderid, {
            loadMask: false
        });

        me.pnlSpriteFile.setParentFolderID(folderid, {
            loadMask: false
        });
    },

    setReadOnly: function (reanOnly) {
        this.pnlReports.setReadOnly(reanOnly);
        this.pnlSpriteFile.setReadOnly(reanOnly);
    },

    onBeforeShow: function () {
        var me = this,
            tabMain = me.tabMain,
            drawContainer = me.drawContainer,
            selection = drawContainer.getSelection();

        me.updatePages(drawContainer, selection);
        me.updatePage(tabMain.getActiveTab(), drawContainer, selection);
    },

    onBeforeTabChange: function (tabPanel, newCard, oldCard, eOpts) {
        var me = this,
            drawContainer = me.drawContainer,
            selection = drawContainer.getSelection();

        me.updatePage(newCard, drawContainer, selection);
    },

    onSelectionChange: function (drawContainer, selection) {
        var me = this,
            tabMain = me.tabMain;

        Ext.each(me.pages, function (pnl) {
            pnl.fireEvent('drawcontainerselectionchange', drawContainer, selection, me.isHidden(), me.tabMain.getActiveTab() == pnl);
        });

        if (me.isHidden())
            return;

        me.updatePages(drawContainer, selection);
        me.updatePage(tabMain.getActiveTab(), drawContainer, selection);
    },

    updatePage: function (panel, drawContainer, selection) {
        panel.fireEvent('updateContext', drawContainer, selection);
    },

    updatePages: function (drawContainer, selection) {
        var me = this,
            tabMain = me.tabMain,
            index;

        index = 0;
        Ext.each(me.pages, function (pnl) {
            if (pnl.isPageValiable && !pnl.isPageValiable(selection)) {
                if (tabMain.contains(pnl)) {
                    tabMain.remove(pnl, false);
                }
            }
            else {
                if (!tabMain.contains(pnl)) {
                    tabMain.insert(index, pnl);
                }
                index++;
            }
        });
    }
});