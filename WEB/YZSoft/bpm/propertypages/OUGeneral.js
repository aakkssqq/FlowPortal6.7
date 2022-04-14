/*
config
readOnly
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
Ext.define('YZSoft.bpm.propertypages.OUGeneral', {
    extend: 'Ext.panel.Panel',
    referenceHolder: true,
    title: RS.$('All_General'),

    constructor: function (config) {
        var me = this;

        var cfg = {
            layout: 'anchor',
            defaults: {
                xtype: 'textfield',
                anchor: '100%'
            },
            items: [{
                xtype: 'displayfield',
                fieldLabel: RS.$('All_Object_ParentPosition'),
                reference: 'edtFullName'
            }, {
                fieldLabel: RS.$('All_Name'),
                reference: 'edtName'
            }, {
                fieldLabel: RS.$('All_OUCode'),
                reference: 'edtCode',
                anchor: '42%'
            }, {
                xclass: 'YZSoft.bpm.src.form.field.OULevelComboBox',
                fieldLabel: RS.$('All_OULevel'),
                reference: 'edtOULevel',
                anchor: '60%'
            }, {
                xtype: 'numberfield',
                fieldLabel: RS.$('All_DisplayIndex'),
                minValue: 0,
                value: 1,
                reference: 'edtOrderIndex',
                anchor: '60%'
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

        refs.edtName.setReadOnly(disabled);
        refs.edtCode.setReadOnly(disabled);
        refs.edtOULevel.setReadOnly(disabled);
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        refs.edtFullName.setValue(data.FullName);
        refs.edtName.setValue(data.Name);
        refs.edtCode.setValue(data.Code);
        refs.edtOULevel.setValue(data.OULevel);
        refs.edtOrderIndex.setValue(data.OrderIndex);
    },

    save: function () {
        var me = this,
            refs = me.getReferences();

        var value = {
            Name: Ext.String.trim(refs.edtName.getValue()),
            Code: Ext.String.trim(refs.edtCode.getValue()),
            OULevel: Ext.String.trim(refs.edtOULevel.getValue() || ''),
            OrderIndex: refs.edtOrderIndex.getValue()
        };

        return value;
    }
});