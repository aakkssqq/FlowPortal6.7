
Ext.define('YZSoft.src.designer.container.chart.ChartInnerContainerAbstract', {
    extend: 'YZSoft.src.designer.container.Abstract',
    requires: [
        'YZSoft.src.layout.Flex'
    ],
    scrollable:false,
    defaultDropIndicatorHeight: 32,
    defaultDropIndicatorWidth: 80,
    cls: ['yz-designer-container-report-series'],
    minHeight: 56,
    layout: {
        type: 'flex',
        cls:'flex-row align-items-center justify-content-center'
    },
    ddGroup: ['report_ds_resultcolumn'],
    dragLayout: false,

    getChart: function () {
        return this.chartPart.getComp();
    },

    createDropZone: function () {
        var me = this;

        me.dropZone = Ext.create('YZSoft.src.designer.dd.DropZoneHBox', me, {
            ddGroup: me.ddGroup
        });
    },

    createDropIndicator: function (source, data) {
        var me = this,
            body;

        body = me.layout.getRenderTarget();
        me.dropIndicator = body.appendChild({
            role: 'presentation',
            cls: 'yz-dd-part-indicator yz-dd-part-indicator-report-series'
        }, false);

        if (data.fromToolbar) {
            me.dropIndicator.setHeight(data.height || me.defaultDropIndicatorHeight);
            me.dropIndicator.setWidth(data.width || me.defaultDropIndicatorWidth);
        }

        if (data.isPart) {
            me.dropIndicator.setWidth(data.part.getWidth());
            me.dropIndicator.setHeight(data.part.getHeight());
        }

        return me.dropIndicator;
    }
});