
Ext.define('YZSoft.esb.flowchart.Container', {
    extend: 'YZSoft.src.flowchart.Container',
    requires: [
        'YZSoft.esb.flowchart.ESBSurface'
    ],
    bodyCls: 'yz-flowchart-bg',
    surfaceZIndexes: {
        background: 0,
        main: 1,
        link: 2,
        drag: 3,
        indicator: 4
    },
    engines: {
        main:'YZSoft.esb.flowchart.ESBSurface'
    },

    initComponent: function () {
        var me = this,
            mainSurface = me.getSurface('main');

        me.callParent();
        mainSurface.updateLinkSurface();
    },

    createSurface: function (id) {
        var me = this,
            id = id || 'main',
            engine = me.engines[id] || me.engine,
            engineSaved,surface;

        engineSaved = me.engine;
        me.engine = engine;
        surface = me.callParent(arguments);
        me.engine = engineSaved;

        if (surface.isESBSurface)
            surface.linkSurface = me.getSurface('link');

        return surface;
    }
});