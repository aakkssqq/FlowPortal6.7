/*
config
tables
*/

Ext.define('YZSoft.src.form.field.CondBaseField', {
    extend: 'Ext.form.FieldContainer',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    createGenCodeButton: function (config) {
        var me = this;

        return Ext.create('YZSoft.src.button.InsertInPosButton', Ext.apply({
            text: RS.$('All_GenerateCode'),
            margin: '0 0 0 3',
            padding: '0 20',
            listeners: {
                click: function () {
                    var field = me.edtCompareField.getField(),
                        op = me.cmbOpt.getValue(),
                        value = me.edtValue.getValue(),
                        code;

                    if (field && op && value) {
                        code = me.genExpress(field.express, op, value, field.type);
                        this.insertAtCaret(code, {
                            nofocus: function () {
                                YZSoft.alert(RS.$('All_MoveCursorToInsertPos'));
                            }
                        });
                    }
                }
            }
        }, config));
    },

    createCompareCombo: function (config) {
        return Ext.create('Ext.form.field.ComboBox', Ext.apply({
            margin: '0 0 0 5',
            width: 80,
            emptyText: RS.$('All_Operator'),
            queryMode: 'local',
            store: {
                fields: ['value'],
                data: [
                    { value: '>' },
                    { value: '>=' },
                    { value: '==' },
                    { value: '<' },
                    { value: '<=' }
                ]
            },
            displayField: 'value',
            valueField: 'value',
            editable: false,
            forceSelection: false
        }, config));
    },

    createValueField: function (config) {
        return Ext.create('Ext.form.field.Text', Ext.apply({
            margin: '0 0 0 5',
            flex: 1,
            emptyText: RS.$('All_Threshold')
        }, config));
    },

    genExpress: function (express, op, value, type) {
        var regularValue = YZSoft.CodeHelper5.changeType(value,type,true,true);
        return Ext.String.format('{1} {2} {3}',
            type,
            express,
            op,
            YZSoft.CodeHelper5.getUIString(regularValue));
    },

    constructor: function (config) {
        var me = this;

        me.btnGen = me.createGenCodeButton(config.button);
        me.cmbOpt = me.createCompareCombo(config.compareOpt);
        me.edtValue = me.createValueField(config.compareValue);
        me.edtCompareField = Ext.create(Ext.apply({},config.compareField,me.compareField));

        var cfg = {
            defaults: {
                submitValue: false
            },
            items: [me.edtCompareField, me.cmbOpt, me.edtValue, me.btnGen]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.edtCompareField.relayEvents(me, ['tablesChanged']);
    },

    attach: function (tags) {
        this.btnGen.attach(tags);
    }
});