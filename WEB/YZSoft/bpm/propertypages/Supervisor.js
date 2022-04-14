/*
config

method
fill
{
  "FullName": "BPMOU://公司0",
  "Name": "公司0",
  "OULevel": "公司",
  "Code": "",
  "RSID": "be4ae56e-676a-4087-8a3b-04316079dfcd",
  "SID": "fe2d8c7f-ebfd-4b29-a2be-319561becdb0",
  "Permision": 268435455,
}
*/
Ext.define('YZSoft.bpm.propertypages.Supervisor', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_Title_Supervisor'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            items: [{
                xclass: 'YZSoft.bpm.src.editor.SupervisorField',
                fieldLabel: RS.$('All_DirectSupervisor'),
                reference:'edtSupervisors',
                name: 'Supervisors',
                labelAlign: 'top',
                flex: 1
            }, {
                xclass: 'YZSoft.bpm.src.editor.DirectXSField',
                fieldLabel: RS.$('All_DirectSubordinates'),
                reference: 'edtDirectXSs',
                name: 'DirectXSs',
                labelAlign: 'top',
                flex: 1,
                margin:0
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

        refs.edtSupervisors.setDisabled(disabled);
        refs.edtDirectXSs.setDisabled(disabled);
    },

    fill: function (data) {
        this.getForm().setValues(data);
    },

    save: function () {
        var data = this.getValuesSubmit(data);
        return data.Supervisors;
    }
});