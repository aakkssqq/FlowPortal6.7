
//reportType
//forceSelect
Ext.define('YZSoft.bpa.src.form.field.ReportTemplatesComboBox', {
    extend: 'Ext.form.field.ComboBox',
    emptyText: RS.$('BPA_EmptyText_SelectReportTemplate'),
    editable: false,
    queryMode: 'local',
    forceSelection: true,
    allowBlank: true,

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            fields: ['Name', 'Ext'],
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/OSFileSystem.ashx'),
                extraParams: {
                    Method: 'GetFolderDocuments',
                    root: 'BPAReportTemplates',
                    path: config.reportType
                }
            }
        });

        cfg = {
            store: me.store,
            displayField: 'Name',
            valueField: 'Name'
        };

        Ext.apply(cfg, config);

        me.callParent([cfg]);

        if (config.reportType)
            me.setReportType(config.reportType);

    },

    setReportType: function (reportType) {
        var me = this;

        if (!reportType) {
            me.setValue(null);
            me.store.removeAll();
        }
        else {
            me.store.load({
                params: {
                    path: reportType
                },
                callback: function (records) {
                    if (me.forceSelect) {
                        me.setValue(records[0] && records[0].data.Name);
                    }
                }
            });
        }
    }
});