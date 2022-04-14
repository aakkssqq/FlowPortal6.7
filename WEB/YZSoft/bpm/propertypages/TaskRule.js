/*
config

method
fill
{
}
*/
Ext.define('YZSoft.bpm.propertypages.TaskRule', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_TaskRule'),
    layout: 'fit',

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            items: [{
                xclass: 'YZSoft.bpm.src.editor.TaskRulesField',
                name: 'rules',
                fieldLabel: RS.$('All_TaskRule_Title'),
                labelAlign:'top'
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
        this.getForm().setValues({
            rules: data
        });
    },

    save: function () {
        return this.getValuesSubmit().rules;
    }
});