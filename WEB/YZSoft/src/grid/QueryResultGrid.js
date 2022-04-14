
Ext.define('YZSoft.src.grid.QueryResultGrid', {
    extend: 'YZSoft.src.grid.ExcelPanel',
    cls: 'yz-grid-query-result',
    layout: 'fit',
    border: false,
    sortableColumns: true,
    enableColumnMove: false,
    enableColumnHide: true,
    enableColumnResize: true,

    constructor: function (config) {
        var me = this;

        config.columns = {
            defaults: {
                renderer:me.columnRender
            },
            items:config.columns
        };

        me.callParent([config]);

        me.on({
            viewready: function () {
                Ext.each(me.getColumns(), function (column) {
                    column.autoSize();
                });
            }
        });
    },

    numberRender: function (value, metaData, record, rowIndex, colIndex, store) {
        var me = this,
            column = metaData.column,
            dataFormat = column.dataFormat,
            prefix = dataFormat.prefix,
            thousands = dataFormat.thousands,
            scale = dataFormat.scale || 1,
            decimal = dataFormat.decimal,
            formattext = [];

        if (decimal === true)
            decimal = 2;

        if (prefix === true)
            prefix = RS.$('All_DefaultCurrency');

        if (prefix)
            formattext.push(prefix);

        if (thousands)
            formattext.push('0,000');
        else
            formattext.push('0');

        if (decimal)
            formattext.push('.' + Ext.String.repeat('0', decimal));
        else
            formattext.push((decimal === false || decimal === 0)? '':'.########');

        return Ext.util.Format.number(value / scale, formattext.join(''));
    },

    dateRender: function (value, metaData, record, rowIndex, colIndex, store) {
        var me = this,
            column = metaData.column,
            dataFormat = column.dataFormat,
            format = dataFormat.format || 'Y-m-d H:i:s';

        return Ext.Date.format(value, format);
    },

    textRender: function (value, metaData, record, rowIndex, colIndex, store) {
        return Ext.util.Format.text(value);
    },

    booleanRender: function (value, metaData, record, rowIndex, colIndex, store) {
        return value;
    },

    binaryRender: function (value, metaData, record, rowIndex, colIndex, store) {
        return value ? RS.$('All_BinaryData') : '';
    },

    defaultRender: function (value, metaData, record, rowIndex, colIndex, store) {
        return Ext.util.Format.text(value);
    },

    columnRender: function (value, metaData, record, rowIndex, colIndex, store) {
        var me = this,
            column = metaData.column,
            dataFormat = column.dataFormat || {},
            render = me[(dataFormat.type || 'default') + 'Render'],
            text;

        if (value === null)
            return 'NULL';

        return render(value, metaData, record, rowIndex, colIndex, store);
    }
});