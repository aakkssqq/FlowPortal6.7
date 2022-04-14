/*
config
fill
{
  "ExtAttributes": {
    "部门属性Int1": "",
    "OrderIndex": 1,
    "部门属性Str1": ""
  },
  "ExtAttrsSchema": [
    {
      "ColumnName": "部门属性Int1",
      "DateType": "Int32"
    },
    {
      "ColumnName": "部门属性Str1",
      "DateType": "String"
    }
  ]
}
*/
Ext.define('YZSoft.bpm.propertypages.ExtAttrs', {
    extend: 'Ext.panel.Panel',
    referenceHolder: true,
    title: RS.$('All_Title_ExtAttrs'),
    layout: 'fit',

    constructor: function (config) {
        var me = this,
            cfg;

        me.grid = Ext.create('Ext.grid.property.Grid', {
            border: true,
            cls: ['yz-grid-property'],
            sortableColumns: false,
            viewConfig: {
                stripeRows: false
            }
        });

        cfg = {
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getJSType: function (column) {
        switch (column.DataType) {
            case 'Decimal':
            case 'Double':
            case 'Single':
            case 'Int16':
            case 'Int32':
            case 'Int64':
            case 'SByte':
            case 'UInt16':
            case 'UInt32':
            case 'UInt64':
            case 'Byte':
                return 'number';
            case 'Boolean':
                return 'boolean';
            case 'DateTime':
                return 'date';
            case 'String':
                return 'string';
            case 'Binary':
                return 'string';
            default:
                return 'string';
        }
    },

    applyStatus: function (readOnly, objectEditable) {
        var me = this,
            disabled = readOnly || !objectEditable;

        if (readOnly)
            disabled = false;

        me.grid.setDisabled(disabled);
    },

    fill: function (data) {
        var me = this,
            source = {},
            sourceCfg = {};

        data.ExtAttributes = data.ExtAttributes || {};

        Ext.each(data.ExtAttrsSchema, function (column) {
            var prop = column.ColumnName,
                value = data.ExtAttributes[prop],
                value = value === undefined ? null : value;

            source[prop] = value;
            sourceCfg[prop] = {
                type: me.getJSType(column)
            }
        });

        me.grid.setSource(source, sourceCfg);
    },

    save: function () {
        var me = this,
            rv = {};

        me.grid.getStore().each(function (rec) {
            rv[rec.data.name] = rec.data.value;
        });

        return rv;
    }
});