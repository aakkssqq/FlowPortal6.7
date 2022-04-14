/*
params:[{
    name:'',
    displayName:'',
    dataType:{
        name,
        fullName
    },
    op: string/object
    valueField: string/object
}]
*/

Ext.define('YZSoft.bpm.src.panel.ExtSearchItem', {
    extend: 'Ext.container.Container',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
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
        number: ['>', '>=', '=', '<', '<=', '!='],
        string: ['like', '>', '>=', '=', '<', '<=', '!='],
        date: ['>', '>=', '=', '<', '<=', '!='],
        bool: ['='],
        char: ['>', '>=', '=', '<', '<=', '!=']
    },
    opdesc: {
        like: RS.$('All_Include')
    },
    valueFields: {
        number: {
            xclass: 'Ext.form.field.Number',
            config: {
            }
        },
        string: {
            xclass: 'Ext.form.field.Text',
            config: {
            }
        },
        datetime: {
            xclass: 'Ext.form.field.Date',
            config: {
                editable: false
            }
        },
        bool: {
            xclass: 'Ext.button.Segmented',
            config: {
                items: [{
                    text: RS.$('All_Yes'),
                    value: 1,
                    pressed: true
                }, {
                    text: RS.$('All_No'),
                    value: 0
                }]
            }
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        Ext.each(config.params, function (param) {
            param.displayName = param.displayName || param.name;
            param.dataType = param.dataType || {};
            param.dataType.name = param.dataType.name || 'String';
            param.dataType.fullName = param.dataType.fullName || 'System.String';
        });

        me.btnUse = Ext.create('Ext.button.Button', {
            text: RS.$('All_Enable'),
            pressed: true
        });

        me.btnNoUse = Ext.create('Ext.button.Button', {
            text: RS.$('All_Disable')
        });

        me.chkSegment = Ext.create('Ext.button.Segmented', {
            margin: '0 5 0 0',
            items: [me.btnUse, me.btnNoUse]
        });

        //me.chkUsed = Ext.create('Ext.form.field.Checkbox', {
        //    margin: '0 10 0 0',
        //    checked:true
        //});

        me.paramStore = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'displayName'],
            data: config.params
        });

        me.cmbParams = Ext.create('Ext.form.field.ComboBox', {
            width: 200,
            emptyText: RS.$('All_SearchField'),
            queryMode: 'local',
            store: me.paramStore,
            displayField: 'displayName',
            valueField: 'name',
            editable: false,
            forceSelection: true,
            triggerAction: 'all',
            listeners: {
                scope: me,
                select: 'onParamChanged'
            }
        });

        me.opStore = Ext.create('Ext.data.JsonStore', {
            fields: ['op', 'name'],
            data: []
        });

        me.cmbOp = Ext.create('Ext.form.field.ComboBox', {
            margin: '0 5 0 5',
            width: 80,
            emptyText: RS.$('All_Operator'),
            queryMode: 'local',
            store: me.opStore,
            displayField: 'name',
            valueField: 'op',
            editable: false,
            forceSelection: true
        });

        me.edtValue = me.createValueField({
            xclass: 'Ext.form.field.Text',
            config: {}
        });

        me.btnRemove = Ext.create('Ext.button.Button', {
            ui:'default-toolbar',
            margin: '0 0 0 5',
            text: '-',
            handler: function () {
                me.fireEvent('removeClicked', me);
            }
        });

        me.btnAdd = Ext.create('Ext.button.Button', {
            ui: 'default-toolbar',
            margin: '0 0 0 2',
            text: '+',
            handler: function () {
                me.fireEvent('addClicked', me);
            }
        });

        me.btnSearch = Ext.create('Ext.button.Button', {
            cls: 'yz-btn-classic-solid-hot',
            padding:'7 16',
            margin: '0 0 0 3',
            text: RS.$('All_Search'),
            handler: function () {
                me.fireEvent('searchClicked', me);
            }
        });

        cfg = {
            items: [me.chkSegment, me.cmbParams, me.cmbOp, me.edtValue, me.btnRemove, me.btnAdd, me.btnSearch]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            indexChanged: 'onIndexChanged',
            specialkey: 'onSpecialkey'
        });

        if (config.selectFirstItem && me.paramStore.getCount() > 0) {
            var rec = me.paramStore.getAt(0);
            me.cmbParams.setValue(rec.data.name);
            me.onParamChanged(null, rec);
        }
    },

    onIndexChanged: function (index, total) {
        var me = this;

        //最后一项
        //me.btnRemove.setDisabled(index == 0 && total <= 1);
        me.btnAdd.setVisible(index == total - 1);
        me.btnSearch.setVisible(index == total - 1);
    },

    onParamChanged: function (field, rec) {
        this.applyParam(rec.data);
    },

    onSpecialkey: function (field, e) {
        var me = this;
        if (e.getKey() == e.ENTER) {
            me.fireEvent('searchClicked', me);
        }
    },

    applyParam: function (param) {
        var me = this,
            opData = me.getOpData(param),
            opValue = me.cmbOp.getValue(),
            valueFieldCfg = me.getValueFieldConfig(param),
            edtValue;

        me.opStore.removeAll();
        me.opStore.add(opData);

        if (opData.length == 1)
            opValue = opData[0].op;

        me.cmbOp.setValue(opValue);

        edtValue = me.createValueField(valueFieldCfg);
        me.insert(3, edtValue);
        me.remove(me.edtValue, true);
        me.edtValue = edtValue;
    },

    getOpData: function (param) {
        var me = this,
            ops,
            data = [];

        if (!param.op)
            ops = me.ops[me.dataTypes[param.dataType.name].op];
        else if (Ext.isString(param.op))
            ops = me.ops[param.op];
        else
            ops = param.op;

        Ext.each(ops, function (op) {
            data.push({
                op: op,
                name: me.opdesc[op] ? me.opdesc[op] : op
            });
        });
        return data;
    },

    getValueFieldConfig: function (param) {
        var me = this,
            fieldConfig;

        if (!param.valueField)
            fieldConfig = me.valueFields[me.dataTypes[param.dataType.name].valueField];
        else if (Ext.isString(param.valueField))
            fieldConfig = me.valueFields[param.valueField];
        else
            fieldConfig = param.valueField;

        return fieldConfig;
    },

    createValueField: function (config) {
        var me = this,
            xclass = config.xclass,
            edtField;

        config = Ext.apply({
            emptyText: RS.$('All_Value'),
            width: 200
        }, config.config);

        edtField = Ext.create(xclass, config);
        me.relayEvents(edtField, ['specialkey']);
        return edtField;
    },

    getParam: function () {
        var me = this,
            param = {},
            chk = me.btnUse.pressed,
            patamName = me.cmbParams.getValue(),
            paramRec = me.paramStore.findRecord('name', patamName),
            op = me.cmbOp.getValue(),
            value = me.edtValue.getValue(),
            rv = null;

        if (chk && paramRec && op && !Ext.isEmpty(value)) {
            rv = {
                isAll: paramRec.data.isAll === true,
                name: paramRec.data.name,
                dataType: paramRec.data.dataType,
                op: op,
                value: value
            };
        }

        return rv;
    },

    reset: function () {
        var me = this;

        me.cmbParams.setValue(null);
        me.cmbOp.setValue(null);

        edtValue = me.createValueField({
            xclass: 'Ext.form.field.Text',
            config: {}
        });

        me.insert(3, edtValue);
        me.remove(me.edtValue, true);
        me.edtValue = edtValue;
    }
});