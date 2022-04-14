
Ext.define('YZSoft.src.datasource.util.OP', {
    singleton: true,

    dataTypes: {
        Decimal: { op: 'number', valueField: 'number' },
        Double: { op: 'number', valueField: 'number' },
        Single: { op: 'number', valueField: 'number' },
        Int16: { op: 'number', valueField: 'number' },
        Int32: { op: 'number', valueField: 'number' },
        Int64: { op: 'number', valueField: 'number' },
        UInt16: { op: 'number', valueField: 'number' },
        UInt32: { op: 'number', valueField: 'number' },
        UInt64: { op: 'number', valueField: 'number' },
        SByte: { op: 'number', valueField: 'number' },
        Byte: { op: 'number', valueField: 'number' },
        Char: { op: 'char', valueField: 'string' },
        Boolean: { op: 'bool', valueField: 'bool' },
        DateTime: { op: 'date', valueField: 'datetime' },
        String: { op: 'string', valueField: 'string' }
    },
    ops: {
        number: ['>', '>=', '=', '<', '<='],
        string: ['like', '>', '>=', '=', '<', '<='],
        date: ['>', '>=', '=', '<', '<='],
        bool: ['='],
        char: ['>', '>=', '=', '<', '<=']
    },
    desc: {
        like: RS.$('All_Include')
    },

    getOPs: function (dataType) {
        var me = this,
            ops = me.ops[me.dataTypes[dataType].op],
            data = [];

        Ext.each(ops, function (op) {
            data.push({
                op: op,
                name: me.desc[op] ? me.desc[op] : op
            });
        });

        return data;
    },

    innerRenderOp: function (value) {
        return this.desc[value] || value;
    }
}, function () {
    this.renderOp = this.innerRenderOp.bind(this);
});