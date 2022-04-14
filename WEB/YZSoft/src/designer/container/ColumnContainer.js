
Ext.define('YZSoft.src.designer.container.ColumnContainer', {
    extend: 'YZSoft.src.designer.container.Abstract',
    cls: ['yz-designer-container', 'yz-designer-container-inner', 'yz-designer-container-flow'],
    layout: {
        type: 'auto'
    },
    scrollable: {
        x: false,
        y: false
    },
    defaults: {
        padding: 20
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            columns = config.columns;

        Ext.apply(me.defaults, {
            width: Ext.String.format('{0}%', 100.0 / columns)
        });

        me.callParent([config]);
    },

    createDropIndicator: function (source, data) {
        var me = this,
            dropIndicator = me.callParent(arguments);

        dropIndicator.setWidth(me.defaults.width);
        dropIndicator.addCls('yz-dd-part-indicator-trans');

        return dropIndicator;
    },

    createDropZone: function () {
        var me = this;

        me.dropZone = Ext.create('YZSoft.src.designer.dd.DropZoneHBox', me, {
            ddGroup: me.ddGroup
        });
    },

    archive: function () {
        var me = this;

        return {
            columns: me.columns
        };
    }
});