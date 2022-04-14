/*
export config
store
grid
params 导出时对数据源的附加参数
start,
limit,
templateExcel,
fileName

method
exportServiceUrl
*/

Ext.define('YZSoft.src.ux.Exporter', {
    singleton: true,
    requires: [
        'YZSoft.src.ux.File'
    ],
    method: 'ExportGrid2Excel',
    exportServiceUrl: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'),

    $export: function (config) {
        var me = this,
            grid = config.grid,
            store = config.store || config.grid.getStore(),
            from,
            to,
            all = false,
            method = config.method || me.method,
            exportServiceUrl = config.exportServiceUrl || me.exportServiceUrl,
            request;

        //准备参数 - request
        request = {
            url: store.getProxy().url,
            params: {}
        };

        Ext.apply(request.params, config.params);
        Ext.apply(request.params, store.lastParams);

        request.params.start = config.start;
        request.params.limit = config.limit

        if (config.beforeload)
            config.beforeload(request.params);

        //准备参数 - params
        var params = Ext.apply({},config.exportParams);

        params.method = method;
        params.templateExcel = config.templateExcel;
        params.osfile = config.osfile;
        params.root = config.root;
        params.path = config.path;
        params.templateFileName = config.templateFileName;
        params.fileName = config.fileName;
        params.rootProperty = store.getProxy().getReader().getRootProperty();

        //准备参数 - columns
        if (grid) {
            var cols = [];

            Ext.each(grid.columns, function (column) {

                if (column.isHidden())
                    return;

                var col = {
                    text: column.text,
                    dataIndex: column.dataIndex,
                    width: column.getWidth(),
                    align: column.align
                };

                cols.push(col);
            });

            params.columns = Ext.util.Base64.encode(Ext.encode(cols));
        }

        //导出
        params.request = Ext.util.Base64.encode(Ext.encode(request));
        YZSoft.src.ux.File.download(exportServiceUrl, params);
    }
});