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
Ext.define('YZSoft.bpm.propertypages.Member', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_Title_Member'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            defaults: {
                xtype: 'textfield',
                anchor: '100%'
            },
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_LeaderTitle'),
                layout: 'hbox',
                items: [{
                    xclass: 'YZSoft.bpm.src.form.field.LeaderTitleComboBox',
                    reference: 'edtLeaderTitle',
                    name: 'LeaderTitle',
                    width: 220
                }, { xtype: 'tbfill' }, {
                    xtype: 'numberfield',
                    fieldLabel: RS.$('All_MemberLevel'),
                    reference: 'edtLevel',
                    name: 'Level',
                    labelAlign: 'right',
                    minValue: 0,
                    value: 0,
                    width: 180,
                    allowDecimals: false
                }]
            }, {
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align:'center'
                },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: RS.$('All_Org_Dept'),
                    reference: 'edtDepartment',
                    name: 'Department',
                    flex: 1
                }, {
                    xtype: 'label',
                    text: RS.$('All_Org_Dept_Desc'),
                    style: 'display:block',
                    margin: '0 60 0 10'
                }]
            }, {
                xtype: 'checkbox',
                boxLabel: RS.$('All_Org_FGOUEnable'),
                reference: 'chkFGOUEnabled',
                name: 'FGOUEnabled',
                margin: 0,
                listeners: {
                    change: function () {
                        me.updateStatus();
                    }
                }
            }, {
                xclass: 'YZSoft.bpm.src.editor.OUFGField',
                reference: 'edtFGOUs',
                name: 'FGOUs',
                flex: 1
            }, {
                xtype: 'checkbox',
                boxLabel: RS.$('All_Org_FGYWEnable'),
                reference: 'chkFGYWEnabled',
                name: 'FGYWEnabled',
                margin: 0,
                listeners: {
                    change: function () {
                        me.updateStatus();
                    }
                }
            }, {
                xclass: 'YZSoft.bpm.src.editor.YWFGField',
                reference: 'edtFGYWs',
                name: 'FGYWs',
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

        refs.edtLeaderTitle.setReadOnly(disabled);
        refs.edtLevel.setReadOnly(disabled);
        refs.edtDepartment.setReadOnly(disabled);

        refs.chkFGOUEnabled.setDisabled(disabled);
        refs.edtFGOUs.setDisabled(disabled);
        refs.chkFGYWEnabled.setDisabled(disabled);
        refs.edtFGYWs.setDisabled(disabled);
    },

    fill: function (data) {
        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        return this.getValuesSubmit();
    },

    updateStatus: function () {
        var me = this,
            data = me.save(),
            refs = me.getReferences();

        refs.edtFGOUs.setDisabled(!data.FGOUEnabled);
        refs.edtFGYWs.setDisabled(!data.FGYWEnabled);
    }
});