/*
config:
tables
defaultField
value
{
    "SNTableName": null,
    "SNColumnName": null,
    "SNPrefix": "REQ<%=DateTime.Today.ToString(\"yyyyMM\")%>",
    "SNColumns": 4,
    "SNFrom": 1,
    "SNIncrement": 1,
    "SNDesc": "REQ年年年年月月{0001}111"
}
*/
Ext.define('YZSoft.bpm.src.dialogs.SNFormatDlg', {
    extend: 'Ext.window.Window', //222222
    title: RS.$('All_SNFormatSetting'),
    layout: {
        type:'vbox'
    },
    cls:'yz-window-frame',
    width: 540,
    modal: true,
    resizable: false,
    bodyPadding: '26 26 26 26',
    buttonAlign:'right',
    referenceHolder: true,
    typeData: [{
        name: 'REQ' + RS.$('All_yyyyMM') + '{0001} - REQ2008030001',
        data: {
            desc: 'REQ' + RS.$('All_yyyyMM') + '{0001}',
            prefix: 'REQ<%=DateTime.Today.ToString("yyyyMM")%>',
            columns: 4,
            from: 1,
            inc: 1
        }
    }, {
        name: 'REQ' + RS.$('All_yyMM') + '{0001} - REQ08030001',
        data: {
            desc: 'REQ' + RS.$('All_yyMM') + '{0001}',
            prefix: 'REQ<%=DateTime.Today.ToString("yyMM")%>',
            columns: 4,
            from: 1,
            inc: 1
        }
    }, {
        name: RS.$('All_Custom')
    }],

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                var data = me.save();
                me.closeDialog(data);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            buttons: [me.btnCancel, me.btnOK],
            defaults: {
                width: '100%',
                labelWidth: 100
            },
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('Process_SNSaveToFiels'),
                layout: 'hbox',
                border: true,
                items: [{
                    xclass: 'YZSoft.bpm.src.form.field.FormFieldField',
                    reference: 'edtFieldName',
                    tables: config.tables,
                    flex: 1,
                    listeners: {
                        change: function () {
                            me.updateStatus();
                        }
                    }
                }, {
                    xtype: 'button',
                    text: RS.$('All_RestoreDefaultValue'),
                    margin: '0 0 0 3',
                    handler: function () {
                        var refs = me.getReferences();
                        refs.edtFieldName.setValue(me.defaultField);
                    }
                }]
            }, {
                xtype: 'combobox',
                fieldLabel: RS.$('Process_SNDefinedFormat'),
                reference: 'cmbFormat',
                store: {
                    fields: ['name', 'data'],
                    data: me.typeData
                },
                displayField: 'name',
                valueField: 'name',
                editable: false,
                forceSelection: true,
                listeners: {
                    select: function (combo, record, eOpts) {
                        var data = record.data.data;
                        if (data) {
                            var refs = me.getReferences();
                            refs.edtPrefix.setValue(data.prefix);
                            refs.edtColumns.setValue(data.columns);
                            refs.edtFrom.setValue(data.from);
                            refs.edtIncrement.setValue(data.inc);
                            refs.edtDesc.setValue(data.desc);
                        }
                    },
                    change: function () {
                        me.updateStatus();
                    }
                }
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('All_Prefix'),
                grow: true,
                growMin: 80,
                growMax: 120,
                reference: 'edtPrefix',
                listeners: {
                    change: function () {
                        me.updateStatus();
                    }
                }
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('Process_PostfixColumns'),
                layout: 'hbox',
                padding: 0,
                margin:0,
                items: [{
                    xtype: 'numberfield',
                    reference: 'edtColumns',
                    width: 160,
                    editable: false,
                    minValue: 1,
                    maxValue: 20,
                    listeners: {
                        change: function () {
                            me.updateStatus();
                        }
                    }
                }, {
                    xtype: 'displayfield',
                    reference: 'edtExample',
                    margin: '0 0 0 6',
                    value: '',
                    fieldStyle: 'height:auto'
                }]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_Seed'),
                layout: 'hbox',
                items: [{
                    xtype: 'numberfield',
                    reference: 'edtFrom',
                    width: 160,
                    editable: false,
                    minValue: 0,
                    listeners: {
                        change: function () {
                            me.updateStatus();
                        }
                    }
                }]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_Increment'),
                layout: 'hbox',
                items: [{
                    xtype: 'numberfield',
                    reference: 'edtIncrement',
                    width: 160,
                    editable: false,
                    minValue: 1,
                    listeners: {
                        change: function () {
                            me.updateStatus();
                        }
                    }
                }]
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_DisplayAs'),
                reference: 'edtDesc',
                margin: 0,
                listeners: {
                    change: function () {
                        me.updateStatus();
                    }
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        var refs = me.getReferences();
        refs.edtFieldName.focus();

        var data = me.value;

        if (!data) {
            var fieldNames = (config.defaultField || '').split('.');
            data = {
                SNTableName: fieldNames.length == 2 ? Ext.String.trim(fieldNames[1]) : '',
                SNColumnName: fieldNames.length == 2 ? Ext.String.trim(fieldNames[0]) : '',
                SNPrefix: me.typeData[0].data.prefix,
                SNColumns: me.typeData[0].data.columns,
                SNFrom: me.typeData[0].data.from,
                SNIncrement: me.typeData[0].data.inc,
                SNDesc: me.typeData[0].data.desc
            };
        }

        me.fill(data);

        me.updateStatus();
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        refs.edtFieldName.setValue((data.SNTableName && data.SNColumnName) ? data.SNTableName + '.' + data.SNColumnName : '');
        refs.edtDesc.setValue(data.SNDesc);
        refs.edtPrefix.setValue(data.SNPrefix);
        refs.edtColumns.setValue(data.SNColumns);
        refs.edtFrom.setValue(data.SNFrom);
        refs.edtIncrement.setValue(data.SNIncrement);
        refs.edtDesc.setValue(data.SNDesc);

        var type;
        Ext.each(me.typeData, function (item) {
            if (item.data && data.SNDesc == item.data.desc) {
                type = item.name;
                return false;
            }
        });

        if (!type)
            type = me.typeData[me.typeData.length - 1].name;

        refs.cmbFormat.setValue(type);
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            fieldName = Ext.String.trim(refs.edtFieldName.getValue()),
            fieldNames = fieldName.split('.');
        
        var data = {
            SNTableName: fieldNames.length >= 2 ? Ext.String.trim(fieldNames[0]) : '',
            SNColumnName: fieldNames.length >= 2 ? Ext.String.trim(fieldNames[1]) : '',
            SNPrefix: Ext.String.trim(refs.edtPrefix.getValue()),
            SNColumns: refs.edtColumns.getValue(),
            SNFrom: refs.edtFrom.getValue(),
            SNIncrement: refs.edtIncrement.getValue(),
            SNDesc: Ext.String.trim(refs.edtDesc.getValue())
        };

        return data;
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            data = me.save();

        refs.edtExample.setValue(Ext.String.format('{0}: {1}', RS.$('All_Example'), Ext.String.leftPad(data.SNFrom, data.SNColumns, '0')));
        //me.btnOK.setDisabled(!data.Name);
    }
});