
Ext.define('YZSoft.forms.field.ExcelDataImportButton', {
    extend: 'YZSoft.forms.field.BrowserButtonBase',

    getEleTypeConfig: function () {
        var me = this,
            config = me.callParent(arguments),
            appmodel = me.getAppendModelLow();

        Ext.apply(config, {
            multiSelect: true,
            titleRowIndex: me.getAttributeNumber('TitleRowIndex', 1),
            dataRowIndex: me.getAttributeNumber('DataRowIndex', 2),
            width: me.getAttributeNumber('popupwndwidth', -1),
            height: me.getAttributeNumber('popupwndheight', -1)
        });

        return config;
    },

    onClick: function (e) {
        var me = this,
            et = me.getEleType(),
            config = {};

        if (et.width > 0)
            config.width = config.minWidth = et.width;
        if (et.height > 0)
            config.height = config.minHeight = et.height;

        Ext.create('YZSoft.src.dialogs.ExcelDataImportDlg', Ext.apply({
            autoShow: true,
            titleRowIndex: et.titleRowIndex,
            dataRowIndex: et.dataRowIndex,
            fn: function (rows) {
                me.mapvalues = rows;
                me.agent.onDataAvailable(me);
            }
        }, config));
    }
});