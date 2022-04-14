
Ext.syncRequire('YZSoft.src.ux.EmptyText');
Ext.define('YZSoft.report.designer.Container', {
    extend: 'YZSoft.src.designer.container.TopContainerAbstract',
    requires: [
        'YZSoft.src.designer.part.ClassManager'
    ],
    cls: ['yz-designer-container', 'yz-designer-container-top', 'yz-designer-container-dashboard','yz-designer-container-report'],
    layout: {
        type: 'auto',
    },
    style: 'background-color:#f5f5f5;',
    scrollable: {
        x: false,
        y: 'scroll'
    },
    defaults: {
        padding: 20
    },
    ddGroup: ['chart', 'layout'],
    emptyText: YZSoft.src.ux.EmptyText.normal.apply({
        text: '<div class="yz-emptytext-report-img"></div><div class="yz-emptytext-report-text">' + RS.$('ReportDesigner_EmptyText_DesignContainer')+'</div>'
    }),

    constructor: function (config) {
        var me = this;

        me.partManager = YZSoft.src.designer.part.ClassManager;
        me.callParent(arguments);

        me.on({
            element: 'el',
            delegate: '.yz-indicator-part',
            click: function (e, t, eOpts) {
                var part = Ext.get(t).component;

                if (part)
                    me.select(part);
            }
        });
    }
});