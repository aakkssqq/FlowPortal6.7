/*
config
grid/store
allowExportAll
maxExportPages
defaultRadio : current/all/range default current
radioDisabled : true/false default false
fileName : export file name
params : 附加参数

params
excelExportServiceUrl:

events:
beforeload
*/
Ext.define('YZSoft.src.dialogs.ExcelExportDlg', {
    extend: 'Ext.window.Window', //777777
    requires: [
        'YZSoft.src.ux.Exporter'
    ],
    title: RS.$('All_ExportToExcel'),
    layout: 'form',
    width: 420,
    modal: true,
    resizable: false,
    bodyPadding: '0 26',
    buttonAlign: 'right',
    referenceHolder: true,

    excelExportServiceUrl: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'),
    defaultRadio: 'current',
    radioDisabled: false,

    constructor: function (config) {
        var me = this,
            grid = config.grid,
            store = me.store = grid ? grid.getStore() : config.store,
            defaultRadio = 'defaultRadio' in config ? config.defaultRadio : me.defaultRadio,
            radioDisabled = 'radioDisabled' in config ? config.radioDisabled : me.radioDisabled,
            cfg;

        me.total = store.getTotalCount();
        me.pageSize = store.getPageSize();
        me.pages = me.pageSize ? (me.total < me.pageSize ? 1 : Math.ceil(me.total / me.pageSize)) : 1;
        me.curPage = store.currentPage;

        cfg = {
            labelWidth: 25,
            items: [{
                xtype: 'radio',
                reference: 'rdoCurPage',
                checked: defaultRadio == 'current',
                disabled: radioDisabled,
                fieldLabel: '',
                labelSeparator: '',
                boxLabel: RS.$('All_ExportExcel_CurPage'),
                name: 'exportRange',
                inputValue: 'current',
                listeners: {
                    change: function () {
                        me.rangeTypeChanged();
                    }
                }
            }, {
                xtype: 'radio',
                reference: 'rdoAll',
                checked: defaultRadio == 'all',
                disabled: defaultRadio == 'all' ? false:radioDisabled || config.allowExportAll === false || $S.Excel.allowExportAll,
                fieldLabel: '',
                labelSeparator: '',
                boxLabel: RS.$('All_All'),
                name: 'exportRange',
                inputValue: 'all',
                listeners: {
                    change: function () {
                        me.rangeTypeChanged();
                    }
                }
            }, {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: {
                    margin: '0 10px; 0 0'
                },
                items: [{
                    xtype: 'radio',
                    reference: 'rdoRange',
                    disabled: radioDisabled,
                    checked: defaultRadio == 'range',
                    boxLabel: RS.$('All_ExportExcel_Range'),
                    name: 'exportRange',
                    inputValue: 'range',
                    listeners: {
                        change: function () {
                            me.rangeTypeChanged();
                        }
                    }
                },
                { xtype: 'numberfield', reference: 'from', disabled: true, minValue: 1, maxValue: me.pages, allowDecimals: false, value: me.curPage, width: 100 },
                { xtype: 'displayfield', value: '~' },
                { xtype: 'numberfield', reference: 'to', disabled: true, minValue: 1, maxValue: me.pages, allowDecimals: false, value: me.curPage, width: 100 }
                ]
            }],
            buttons: [{
                text: RS.$('All_ExportToExcel'),
                cls: 'yz-btn-default',
                handler: function () {
                    me.$export();
                }
            }, {
                text: RS.$('All_Close'),
                handler: function () {
                    me.close();
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.rangeTypeChanged();
    },

    rangeTypeChanged: function () {
        var me = this,
            ref = me.getReferences(),
            checked = ref.rdoRange.checked;

        ref.from.setDisabled(!checked);
        ref.to.setDisabled(!checked);
    },

    $export: function () {
        var me = this,
            grid = me.grid,
            store = me.store,
            ref = me.getReferences(),
            from,
            to,
            all = false;

        //获得导出起始终止页
        if (ref.rdoCurPage.checked) {
            from = me.curPage;
            to = me.curPage;
        }
        else if (ref.rdoAll.checked) {
            all = true;
            from = 1;
            to = me.pages;
        }
        else {
            from = ref.from.getValue();
            to = ref.to.getValue();
        }

        //检查页码
        if (from < 1 || to > me.pages || from > to)
            return;

        //最大导出页数检查
        if (!all) {
            var maxExportPages = me.maxExportPages || $S.Excel.maxExportPages;
            if (maxExportPages && (to - from) + 1 > maxExportPages) {
                YZSoft.alert(Ext.String.format(RS.$('All_ExportExcel_PageNumberOverSetting'), maxExportPages));
                return;
            }
        }

        YZSoft.src.ux.Exporter.$export({
            exportServiceUrl: me.excelExportServiceUrl,
            store: store,
            grid: grid,
            params: me.params,
            exportParams: me.exportParams,
            start: (from - 1) * me.pageSize,
            limit: (to - from + 1) * me.pageSize,
            templateExcel: me.templateExcel,
            osfile: me.osfile,
            root: me.root,
            path: me.path,
            templateFileName: me.templateFileName,
            fileName: me.fileName,
            beforeload: function (requestParams) {
                requestParams.ReportDate = new Date()
                me.fireEvent('beforeload', requestParams);
            }
        });

        me.close();
    }
});
