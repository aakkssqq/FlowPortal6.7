/*
{
    name:'222',
    displayName:'',
    dataType:{
        name,
        fullName
    },
    value
    op: string/object
    valueField: string/object
}
*/

Ext.define('YZSoft.bpm.src.panel.ParamsItem', {
    extend: 'Ext.container.Container',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    dataTypes: {
        Decimal: { valueField: 'number' },
        Double: { valueField: 'number' },
        Single: { valueField: 'number' },
        Int16: { valueField: 'number' },
        Int32: { valueField: 'number' },
        Int64: { valueField: 'number' },
        UInt16: { valueField: 'number' },
        UInt32: { valueField: 'number' },
        UInt64: { valueField: 'number' },
        SByte: { valueField: 'number' },
        Byte: { valueField: 'number' },
        Char: { valueField: 'string' },
        Boolean: { valueField: 'bool' },
        DateTime: { valueField: 'datetime' },
        String: { valueField: 'string' }
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
            param = config.param,
            cfg;

        param.displayName = param.displayName || param.name;
        param.dataType = param.dataType || {};
        param.dataType.name = param.dataType.name || 'String';
        param.dataType.fullName = param.dataType.fullName || 'System.String';

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
        //    checked: true
        //});

        me.labelName = Ext.create('Ext.form.field.Text', {
            width: 200,
            value: param.displayName || param.name,
            readOnly: true
        });

        me.labelOp = Ext.create('Ext.form.field.Text', {
            margin: '0 5 0 5',
            value: '=',
            readOnly: true,
            cls: 'yz-form-field-text-align-center'
        });

        me.edtValue = me.createValueField(me.getValueFieldConfig(param));

        me.btnSearch = Ext.create('Ext.button.Button', Ext.apply({
            cls: 'yz-btn-classic-solid-hot',
            padding: '7 16',
            margin: '0 0 0 3',
            text: RS.$('All_Search'),
            handler: function () {
                me.fireEvent('searchClicked', me);
            }
        }, config.searchButtonCfg));

        cfg = {
            items: [me.chkSegment, me.labelName, me.labelOp, me.edtValue, me.btnSearch]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            specialkey: 'onSpecialkey'
        });
    },

    onSpecialkey: function (field, e) {
        var me = this;
        if (e.getKey() == e.ENTER) {
            me.fireEvent('searchClicked', me);
        }
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

        fieldConfig.config.value = param.value;
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
            value = me.edtValue.getValue(),
            rv = null;

        if (chk) {
            rv = {
                name: me.param.name,
                dataType: me.param.dataType,
                value: Ext.isEmpty(value) ? null : value
            };
        }

        return rv;
    }
});