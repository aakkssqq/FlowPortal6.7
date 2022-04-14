/*
config
commondata

method
fill
{
  "Name": "AAA",
  "Description": null,
  "Form": "A01.aspx",
  "SNDefine": {
    "SNTableName": null,
    "SNColumnName": null,
    "SNPrefix": "REQ<%=DateTime.Today.ToString(\"yyyyMM\")%>",
    "SNColumns": 4,
    "SNFrom": 1,
    "SNIncrement": 1,
    "SNDesc": "REQ年年年年月月{0001}111"
  },
  "TableIdentitys": [
    {
      "DataSourceName": "Default",
      "TableName": "A",
      "IsRepeatableTable": false
    },
    {
      "DataSourceName": "BPMSAN",
      "TableName": "AD",
      "IsRepeatableTable": true
    }
  ],
  "DataRelationship": {
    "FKs": [
      {
        "FKName": null,
        "PKTableName": "A",
        "PKColumnName": "TaskID",
        "FKTableName": "AD",
        "FKColumnName": "TaskID"
      }
    ]
  }
}
*/
Ext.define('YZSoft.bpm.propertypages.FormServiceGeneral', {
    extend: 'Ext.panel.Panel',
    referenceHolder: true,
    title: RS.$('All_General'),

    constructor: function (config) {
        var me = this;

        var cfg = {
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_Name'),
                reference: 'edtName'
            }, {
                xclass: 'YZSoft.bpm.src.form.field.SNFormatField',
                fieldLabel: RS.$('All_SNFormat'),
                reference: 'edtSN'
            }, {
                xclass: 'YZSoft.bpm.src.form.field.FormField',
                fieldLabel: RS.$('All_Form'),
                reference: 'edtForm'
            }, {
                xtype: 'button',
                text: RS.$('FormService_SettingDataRelationship'),
                reference: 'btnDataSchema',
                height: 40,
                margin: '10 0 0 0',
                handler: function () {
                    Ext.create('YZSoft.bpm.src.dialogs.TableAndRelationshipDlg', {
                        autoShow: true,
                        value: this.tagValue,
                        scope: this,
                        fn: function (value) {
                            this.tagValue = value;
                            me.commondata.TableIdentitys = value.TableIdentitys;
                            me.getReferences().edtSN.tables = value.TableIdentitys;
                        }
                    });
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        refs.edtSN.tables = data.TableIdentitys;

        refs.edtName.setValue(data.Name);
        refs.edtSN.setValue(data.SNDefine);
        refs.edtForm.setValue(data.Form);
        refs.btnDataSchema.tagValue = {
            TableIdentitys: data.TableIdentitys,
            DataRelationship: data.DataRelationship
        };
    },

    save: function () {
        var me = this,
            refs = me.getReferences();

        var value = {
            Name: refs.edtName.getValue(),
            Form: refs.edtForm.getValue(),
            SNDefine: refs.edtSN.getValue(),
            TableIdentitys: refs.btnDataSchema.tagValue.TableIdentitys,
            DataRelationship: refs.btnDataSchema.tagValue.DataRelationship
        };

        return value;
    }
});