/*
config
*/
Ext.define('YZSoft.bpa.FileViewPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.ux.File'
    ],
    bodyStyle:'background-color:white',
    increaseStep: {
        x: 10,
        y: 10
    },
    linkCfg: {
        lineWidth: 2,
        strokeStyle: '#323232',
        gaps: {
            ext: 28,
            offset: 28
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        config = config || {};
        me.drawContainer = Ext.create('YZSoft.bpa.DesignContainer', {
            designer:me
        });

        me.drawContainer.on({
            processLoaded: function (process, nodes, links) {
                var bbox1 = me.drawContainer.getSurface('shape').getBBox(nodes, false),
                    bbox2 = me.drawContainer.getSurface('link').getBBox(links, false),
                    minWidth = Math.max(bbox1.x + bbox1.width + 100, bbox2.x + bbox2.width + 100),
                    minHeight = Math.max(bbox1.y + bbox1.height + 80, bbox2.y + bbox2.height + 40);

                me.drawContainer.setMinWidth(minWidth);
                me.drawContainer.setMinHeight(minHeight);
                me.scrollContainer.updateLayout(false, true);
            }
        });

        me.scrollContainer = Ext.create('Ext.container.Container', {
            layout: 'fit',
            scrollable: true,
            items: [me.drawContainer]
        });

        cfg = {
            layout: 'fit',
            border:false,
            items: [me.scrollContainer]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.fileid)
            me.openProcess(config.fileid);
    },

    openProcess: function (fileid, config) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            method: 'GET',
            url: YZSoft.$url('YZSoft.Services.REST/BPA/Library.ashx'),
            params: {
                method: 'GetProcessDefine',
                fileid: fileid
            },
            success: function (action) {
                me.drawContainer.loadProcess(action.result.processDefine);
            }
        }, config));
    }
});