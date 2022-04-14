
Ext.define('YZSoft.src.designer.archive.Manager', {
    singleton: true,
    archivers: {},

    getArahiveClass: function (component) {
        return 'YZSoft.designer.' + component.$className + '_Archive';
    },

    archive: function (component, part) {
        var me = this,
            archiveClassName = me.getArahiveClass(component),
            archiver,cfg;

        if (component.isDesignContainer)
            archiver = component;
        else
            archiver = me.archivers[archiveClassName] = me.archivers[archiveClassName] || Ext.create(archiveClassName, {});

        cfg = archiver.archive(component, part) || {};

        cfg = Ext.apply({
            ctype: component.ctype
        }, cfg);

        part.archive && part.archive(cfg);

        return cfg;
    }
});