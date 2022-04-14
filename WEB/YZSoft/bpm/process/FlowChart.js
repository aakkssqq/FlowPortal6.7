/*
config
    processName
    processVersion

    tbar
*/

Ext.define('YZSoft.bpm.process.FlowChart', {
    extend: 'Ext.panel.Panel',
    title: RS.$('All_ProcessChart'),
    border: false,
    scrollable: true,
    containerConfig: {},
    constructor: function (config) {
        var me = this;

        me.drawContainer = Ext.create('YZSoft.bpm.src.flowchart.ProcessContainer', Ext.apply({
        }, config.containerConfig, me.containerConfig));

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

        var cfg = {
            layout: 'fit',
            items: [me.scrollContainer]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    openProcess: function (processName, version, config) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            method: 'GET',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/FlowChart.ashx'),
            params: {
                method: 'GetProcessDefine',
                processName: processName,
                version: version
            },
            success: function (action) {
                me.drawContainer.loadProcess(action.result);
            }
        },config));
    },

    getVersionDisplayString: function (processVersion) {
        return Ext.String.format('{0} - {1}', RS.$('All_Version'), processVersion);
    }
});