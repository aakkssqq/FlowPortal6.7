
Ext.application({
    name: 'FlowPortal',

    launch: function () {
        var me = this;

        //流程执行
//        me.pnl = Ext.create('YZSoft.src.frame.ClassicModule', {
//            dataURL: YZSoft.$url('BPM/EXECUTE.ashx'),
//            activeNode: 'Worklist'
//        });
        
        //组织管理
        //me.pnl = Ext.create('YZSoft.bpm.org.admin.ModulePanel', {
        //});

        //表单管理
        me.pnl = Ext.create('YZSoft.bpm.reports.ProcessUsage', {
        });

        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [me.pnl]
        });
    }
});