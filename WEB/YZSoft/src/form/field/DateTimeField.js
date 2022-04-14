/*
*/

Ext.define('YZSoft.src.form.field.DateTimeField', {
    extend: 'YZSoft.src.form.FieldContainer',
    referenceHolder: true,
    layout: 'hbox',
    timeFieldConfig: {
        increment: 30,
        format: 'H:i',
        width: 100
    },

    constructor: function (config) {
        var me = this,
            timeFieldConfig = Ext.apply(Ext.clone(me.timeFieldConfig), config.timeFieldConfig),
            cfg;

        cfg = {
            defaults: {
                submitValue: false,
                listeners: {
                    change: function () {
                        me.fireEvent('change');
                    }
                }
            },
            items: [{
                xtype: 'datefield',
                reference: 'edtDate',
                width: 180,
                margin: '0 3',
                value:config.value
            }, Ext.apply({
                xtype: 'timefield',
                reference: 'edtTime',
                value: config.value
            }, timeFieldConfig)]
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    setValue: function (value) {
        var me = this,
            refs = me.getReferences();

        refs.edtDate.setValue(value);
        refs.edtTime.setValue(value);
    },

    getValue: function () {
        var me = this,
            refs = me.getReferences();

        return YZSoft.Utility.combineDate(refs.edtDate.getValue(), refs.edtTime.getValue());
    }
})