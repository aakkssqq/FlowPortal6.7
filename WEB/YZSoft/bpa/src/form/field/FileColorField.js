
/*
config
*/
Ext.define('YZSoft.bpa.src.form.field.FileColorField', {
    extend: 'Ext.form.FieldContainer',
    colors: [
        { value: 'White', name: RS.$('BPA_Color_White') },
        { value: 'Pink', name: RS.$('BPA_Color_Pink') },
        { value: 'Yellow', name: RS.$('BPA_Color_Yellow') },
        { value: 'LightBlue', name: RS.$('BPA_Color_LightBlue') },
        { value: 'LightGray', name: RS.$('BPA_Color_LightGray') },
        { value: 'Gray', name: RS.$('BPA_Color_Gray') }
    ],

    constructor: function (config) {
        var me = this,
            btns = [],
            cfg;

        Ext.each(me.colors, function (color) {
            btns.push(Ext.create('Ext.button.Button', {
                text: color.name,
                value: color.value,
                padding: '7 10'
            }));
        });

        me.segBtns = Ext.create('Ext.button.Segmented', {
            items: btns,
            allowMultiple:true
        });

        cfg = {
            items: [me.segBtns]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getValue: function () {
        var me = this,
            rv = [];

        me.segBtns.items.each(function (btn) {
            if (btn.pressed) {
                rv.push(btn.value);
            }
        });

        return rv;
    }
});