/*
config
*/

Ext.define('YZSoft.report.rpt.field.ParamsFillField', {
    extend: 'Ext.form.field.Text',
    requires: [
        'YZSoft.src.Object'
    ],
    editable: true,
    triggers: {
        browser: {
            cls: 'yz-trigger-reportlinkparamsfill',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this,
            params = [],
            srcParams = [];

        srcParams = [],
        Ext.each(me.columns, function (column) {
            srcParams.push({
                name: column.ColumnName,
                value: column.ColumnName
            });
        });

        if (me.tagType == 'Report') {
            Ext.each(me.srcParams, function (param) {
                if (param.ParameterUIBindType != 'Internal') {
                    var value = 'Params.' + param.Name;
                    srcParams.push({
                        name: value,
                        value: value
                    });
                }
            });
        }

        switch (me.tagType) {
            case 'Task':
                params.push('@TaskID');
                break;
            case 'FormApplication':
                params.push('@Key');
                break;
            case 'Report':
                YZSoft.Ajax.request({
                    async: false,
                    url: YZSoft.$url('YZSoft.Services.REST/Reports/Report.ashx'),
                    params: {
                        method: 'GetQueryParameters',
                        path: me.tagIdentity
                    },
                    success: function (action) {
                        Ext.each(action.result, function (param) {
                            params.push(param.Name);
                        });
                    }
                });
                break;
        }

        Ext.create('YZSoft.report.rpt.dialogs.ParamsFillDlg', {
            autoShow: true,
            params: params,
            columns: me.columns,
            srcParams: srcParams,
            fill: me.getValue(),
            fn: function (value) {
                me.setValue(value);
                me.fireEvent('selected', value);
            }
        });
    },

    setValue: function (value) {
        var object = {};
        Ext.each(value, function (fill) {
            object[fill.Name] = fill.FillWith;
        });

        var text = YZObject.toPropertyString(object);
        this.callParent([text]);
    },

    getValue: function () {
        var me = this,
            text = me.callParent(arguments),
            object,
            rv = [];

        object = YZObject.fromPropertyString(text);
        for (var p in object) {
            rv.push({
                Name: p,
                FillWith: object[p]
            });
        }

        return rv;
    }
});