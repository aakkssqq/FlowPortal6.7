/*
reportName
reportDefine
*/

Ext.define('YZSoft.report.testing.Dialog', {
    extend: 'Ext.window.Window',
    modal: true,
    scrollable: false,
    bodyPadding: 0, //重要，否则第二次显示右侧会出现空白
    minWidth: 800,

    constructor: function (config) {
        var me = this,
            reportDefine = config.reportDefine,
            cfg;

        me.reportPanel = Ext.create('YZSoft.report.testing.ReportPanel', {
            bodyPadding: 10,
            reportDefine: reportDefine
        });

        cfg = {
            layout: 'fit',
            items: [me.reportPanel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});