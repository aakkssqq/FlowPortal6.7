
Ext.define('Demo.YZReport.CustomSearchBar', {
    extend: 'Ext.panel.Panel',
    cls: 'yz-search-panel',
    border: false,
    bodyPadding: '6 6 2 6',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this;

        me.edtProcessName = Ext.create('YZSoft.bpm.src.form.field.ProcessNameField', {
            fieldLabel: '统计流程',
            emptyText: '请选择流程',
            labelWidth:80,
            width: 260
        })
        var cfg = {
            items: [me.edtProcessName]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getParams: function () {
        var me = this;

        return [{
            name: '@ProcessName',
            value: me.edtProcessName.getValue()
        }]
    }
});