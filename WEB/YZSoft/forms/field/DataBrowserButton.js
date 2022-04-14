
Ext.define('YZSoft.forms.field.DataBrowserButton', {
    extend: 'YZSoft.forms.field.BrowserButtonBase',

    getEleTypeConfig: function () {
        var me = this,
            config = me.callParent(arguments);

        Ext.apply(config, {
            sDataSource: me.getDataSource(),
            displayColumns: me.parseDisplayColumns(me.getAttribute('displaycolumns')),
            width: me.getAttributeNumber('popupwndwidth', -1),
            height: me.getAttributeNumber('popupwndheight', -1)
        });

        return config;
    },

    parseDisplayColumns: function (str) {
        var me = this,
            rv = [];

        if (!str)
            return rv;

        var segs = str.split(';') || [];
        Ext.each(segs, function (seg) {
            if (!seg)
                return;

            var index = seg.indexOf(':');
            if (index == -1)
                return;

            var columnName = Ext.String.trim(seg.substr(0, index)),
                define = Ext.String.trim(seg.substr(index + 1));

            if (!columnName)
                return;

            var item = {
                columnName: columnName
            };

            var vs = define.split(',');
            for (var i = 0; i < vs.length; i++) {
                var v = Ext.String.trim(vs[i] || '');
                switch (i) {
                    case 0:
                        item.displayName = v;
                        break;
                    case 1:
                        item.width = v;
                        break;
                }
            }

            if (!item.width)
                delete item.width;

            rv.push(item);
        });

        return rv;
    },

    onClick: function (e) {
        var me = this,
            et = me.getEleType(),
            ds = et.DataSource,
            config = {};

        if (!ds)
            return;

        if (et.width > 0)
            config.width = config.minWidth = et.width;

        //高度自适应，随搜索条件增加，自动增加高度
        if (et.height > 0) {
            config.gridConfig = {
                height: et.height - 100
            }
        }

        Ext.create('YZSoft.forms.field.dialogs.DataBrowserDlg', Ext.apply({
            autoShow: true,
            ds: ds.identity,
            filters: me.getCurrentFilters(),
            displayColumns: et.displayColumns,
            mapColumns: et.DataMap ? et.DataMap.columnNames : [],
            multiSelect: et.multiSelect,
            title: Ext.String.format('{0} - {1}', RS.$('All_DataBrowserWindowTitle'), ds.identity.TableName || ds.identity.ProcedureName || ds.identity.ESB),
            fn: function (rows) {
                me.mapvalues = rows;
                me.agent.onDataAvailable(me);
            }
        }, config));
    }
});