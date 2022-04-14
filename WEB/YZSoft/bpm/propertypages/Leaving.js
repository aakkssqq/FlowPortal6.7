/*
config

method
fill
{
    "State": "Out",
    "From": new Date(
      "2014-12-18 20:46:00"
    ),
    "To": new Date(
      "2014-12-19 18:44:00"
    )
}
*/
Ext.define('YZSoft.bpm.propertypages.Leaving', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_Title_Leaving'),

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            layout: 'anchor',
            defaults: {
                xtype: 'textfield',
                anchor: '100%'
            },
            items: [{
                name: 'data',
                labelStyle: 'font-weight:bold;font-size:1.2em',
                xclass: 'YZSoft.bpm.src.editor.LeavingField'
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    applyStatus: function (readOnly, objectEditable) {
        var me = this,
            refs = me.getReferences(),
            disabled = readOnly || !objectEditable;

        if (readOnly)
            disabled = false;
    },

    fill: function (data) {
        this.getForm().setValues({ data: data });
    },

    save: function () {
        return this.getValuesSubmit().data;
    }
});