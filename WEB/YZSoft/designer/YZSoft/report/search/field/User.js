
Ext.define('YZSoft.designer.YZSoft.report.search.field.User', {
    extend: 'YZSoft.designer.YZSoft.report.search.field.Abstract',
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

                formfield.xdatabind = value;
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

        me.items = [
            me.label,
            me.xdatabind,
            me.cmpPlaceHolder,
            me.edtDefaultValue
        ];

        me.callParent();
    }
});