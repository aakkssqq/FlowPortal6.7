

Ext.define('Demo.CustomDataBrowserButton.SelectProcessesButton', {
    extend: 'YZSoft.forms.field.CustomBrowserButton',
    datasourceColumns: ['ProcessName'], //用与在设计表单，设置DataMap时，显示可map数据列
    datasourceParams: ['Path'],
    multiSelect: true,

    onClick: function (e) {
        var me = this;

        //获得过滤信息
        //var filters = me.getCurrentFilters();
        //alert(Ext.encode(filters));

        Ext.create('YZSoft.bpm.src.dialogs.SelProcessesDlg', {
            autoShow: true,
            fn: function (data) {
                me.mapvalues = data;
                me.agent.onDataAvailable(me);
            }
        });
    }
});