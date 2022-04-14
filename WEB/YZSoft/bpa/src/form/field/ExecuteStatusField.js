
/*
config
*/
Ext.define('YZSoft.bpa.src.form.field.ExecuteStatusField', {
    extend: 'Ext.form.FieldContainer',
    executeStatus: [
        { value: 'NoExecute', name: RS.$('BPA_Status_NoExecute') },
        { value: 'Regulation', name: RS.$('BPA_Status_Regulation') },
        { value: 'PartialOnlineExecute', name: RS.$('BPA_Status_PartialOnlineExecute') },
        { value: 'CompleteOnlineExecute', name: RS.$('BPA_Status_CompleteOnlineExecute') }
    ],

    constructor: function (config) {
        var me = this,
            btns = [],
            cfg;

        Ext.each(me.executeStatus, function (executeState) {
            btns.push(Ext.create('Ext.button.Button', {
                text: executeState.name,
                value: executeState.value,
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