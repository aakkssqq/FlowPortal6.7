
Ext.define('YZSoft.src.designer.container.FlowContainer', {
    extend: 'YZSoft.src.designer.container.Abstract',
    cls: ['yz-autolayout-inline','yz-designer-container', 'yz-designer-container-inner'],
    layout: {
        type: 'auto'
    },
    scrollable: {
        x: false,
        y: false
    },
    defaults: {
        padding: '0 10 5 10'
    },
    padding: '8 10 12 10',
    defaultDropIndicatorWidth:160,

    createDropZone: function() {
        var me = this;

        me.dropZone = Ext.create('YZSoft.src.designer.dd.DropZoneFlow', me, {
            ddGroup: me.ddGroup
        });
    },

    createDropIndicator: function(source, data) {
        var me = this,
            dropIndicator = me.callParent(arguments);

        if (me.ddIndicatorCls)
            dropIndicator.addCls(me.ddIndicatorCls);

        if (data.fromToolbar)
            dropIndicator.setWidth(data.width || me.defaultDropIndicatorWidth);

        if (data.isPart)
            dropIndicator.setWidth(data.part.getWidth());

        return dropIndicator;
    },

    archive: function () {
        var me = this;

        return {
        };
    }
});