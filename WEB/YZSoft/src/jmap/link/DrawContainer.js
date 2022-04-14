
Ext.define('YZSoft.src.jmap.link.DrawContainer', {
    extend: 'YZSoft.src.flowchart.Container',
    //requires: [
    //    'YZSoft.esb.flowchart.ESBSurface'
    //],
    surfaceZIndexes: {
        background: 0,
        main: 1,
        link: 2,
        drag: 3,
        indicator: 4
    },
    //engines: {
    //    main:'YZSoft.esb.flowchart.ESBSurface'
    //},

    //initComponent: function () {
    //    var me = this,
    //        mainSurface = me.getSurface('main');

    //    me.callParent();
    //    mainSurface.linkSurface = me.getSurface('link');
    //    mainSurface.updateLinkSurface();
    //},

    //createSurface: function (id) {
    //    var me = this,
    //        id = id || 'main',
    //        engine = me.engines[id] || me.engine,
    //        engineSaved,surface;

    //    engineSaved = me.engine;
    //    me.engine = engine;
    //    surface = me.callParent(arguments);
    //    me.engine = engineSaved;

    //    return surface;
    //}

    getSpritesBy: function (fn) {
        var me = this,
            surfaces = me.getItems(),
            rv = [];

        surfaces.each(function (surface) {
            if (!surface.isSurface)
                return;

            Ext.Array.each(surface.getItems(), function (sprite) {
                if (fn(sprite) === true)
                    rv.push(sprite);
            });
        });

        return rv;
    }
});