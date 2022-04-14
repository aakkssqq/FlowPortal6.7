
Ext.define('YZSoft.designer.YZSoft.report.search.field.ComboBox', {
    extend: 'YZSoft.designer.YZSoft.report.search.field.Abstract',
    requires: [
        'YZSoft.src.form.field.ListItems'
    ],
    bodyPadding: 20,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this,
            part = me.part,
            formfield = me.tag;

        me.label = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_Label'),
            labelAlign: 'top',
            value: formfield.getFieldLabel(),
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue()) || '&nbsp';

                formfield.setFieldLabel(value);
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.xdatabind = Ext.create('Ext.form.field.Text', {
            labelAlign: 'top',
            value: formfield.xdatabind,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                formfield.setXdatabind(value);
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.cmpPlaceHolder = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_PlaceHolder'),
            labelAlign: 'top',
            value: formfield.getEmptyText(),
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                formfield.setEmptyText(value);
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.edtDefaultValue = Ext.create('YZSoft.src.form.field.CodeField', {
            fieldLabel: RS.$('All_InitValue'),
            labelAlign: 'top',
            value: formfield.defaultValue,
            dlgConfig: {
                stepOwner: false,
                agentUser: false,
                taskInitiator: false,
                dayofweek: false,
                formfields: false
            },
            enableKeyEvents: true,
            applySetting: function () {
                var value = this.getValue();

                formfield.defaultValue = value;
            },
            listeners: {
                keyup: 'applySetting',
                selected: 'applySetting'
            }
        });

        me.chkUseDS = Ext.create('Ext.form.field.Checkbox', {
            cls: 'yz-field-underline',
            boxLabel: RS.$('All_DataSource'),
            checked: formfield.getUse() == 'ds',
            listeners: {
                change: function (chkbox, newValue, oldValue, eOpts) {
                    if (newValue) {
                        me.chkUseOptions.setValue(false);
                        formfield.setUse('ds');
                    }
                }
            }
        });

        me.datasource = Ext.create('YZSoft.src.form.field.DataSource', {
            emptyText: RS.$('Designer_EmptyText_DataSource'),
            margin: '10 0 3 0',
            value: formfield.getDs(),
            listeners: {
                select: function () {
                    var value = this.getValue();

                    formfield.setDs(value);
                    me.displayField.setDs(value);
                    me.valueField.setDs(value);
                }
            }
        });

        me.valueField = Ext.create('YZSoft.src.datasource.field.ColumnComboBox', {
            fieldLabel: RS.$('Designer_ComnoBox_ValueField'),
            labelAlign: 'top',
            margin: '0 0 10 0',
            emptyDSText: RS.$('Designer_EmptyText_SelDataSourceFirst'),
            emptyText: RS.$('Designer_EmptyText_ValueField'),
            ds: formfield.getDs(),
            value: formfield.getDsValueField(),
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {
                    formfield.setDsValueField(newValue);
                }
            }
        });

        me.displayField = Ext.create('YZSoft.src.datasource.field.ColumnComboBox', {
            fieldLabel: RS.$('Designer_ComnoBox_DisplayField'),
            labelAlign: 'top',
            emptyDSText: RS.$('Designer_EmptyText_SelDataSourceFirst'),
            emptyText: RS.$('Designer_EmptyText_DisplayField'),
            ds: formfield.getDs(),
            value: formfield.getDsDisplayField(),
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {
                    formfield.setDsDisplayField(newValue);
                }
            }
        });

        me.segDS = Ext.create('Ext.panel.Panel', {
            header: {
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                itemPosition:0,
                items: [me.chkUseDS]
            },
            cls: 'yz-property-fieldset-chart',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 3 0'
            },
            items: [
                me.datasource,
                me.valueField,
                me.displayField
            ]
        });

        me.chkUseOptions = Ext.create('Ext.form.field.Checkbox', {
            cls: 'yz-field-underline',
            boxLabel: RS.$('Designer_ComnoBox_Options'),
            checked: formfield.getUse() == 'options',
            listeners: {
                change: function (chkbox, newValue, oldValue, eOpts) {
                    if (newValue) {
                        me.chkUseDS.setValue(false);
                        formfield.setUse('options');
                    }
                }
            }
        });

        me.listItems = Ext.create('YZSoft.src.form.field.ListItems', {
            value: formfield.getOptions(),
            listeners: {
                change: function(field, newValue) {
                    formfield.setOptions(newValue);
                }
            }
        });

        me.segListItems = Ext.create('Ext.panel.Panel', {
            header: {
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                itemPosition: 0,
                items: [me.chkUseOptions]
            },
            cls: 'yz-property-fieldset-chart',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 7 0'
            },
            items: [
                me.listItems
            ]
        });

        me.items = [
            me.label,
            me.xdatabind,
            me.cmpPlaceHolder,
            me.edtDefaultValue,
            me.segDS,
            me.segListItems
        ];

        me.callParent();
    }
});