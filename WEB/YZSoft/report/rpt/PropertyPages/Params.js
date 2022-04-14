/*
config:
*/
Ext.define('YZSoft.report.rpt.PropertyPages.Params', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_QueryParams'),
    layout: 'fit',

    constructor: function (config) {
        var me = this,
            cfg;

        me.edtParams = Ext.create('YZSoft.report.rpt.editor.QueryParamsField', {
            fieldLabel: RS.$('All_QueryParams'),
            name: 'QueryParameters',
            labelAlign: 'top'
        });

        me.edtStartDate = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('All_FinanceMonthStartDate'),
            name: 'MonthOffset',
            width: 238,
            labelWidth: 120,
            store: {
                fields: ['name', 'value'],
                data: [
                    { name: RS.$('All_PrevMonth'), value: -1 },
                    { name: RS.$('All_ThisMonth'), value: 0 }
                ]
            },
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            editable: false,
            forceSelection: true
        });

        me.edtDay = Ext.create('Ext.form.field.Number', {
            name: 'MonthDay',
            width: 80,
            margin: '0 6',
            minValue: 1,
            maxValue: 31,
            allowDecimals: false
        });

        me.chkPaging = Ext.create('Ext.form.field.Checkbox', {
            name: 'Paging',
            boxLabel: RS.$('All_Paging'),
            listeners: {
                change: function (field, checked) {
                    me.edtPageSize.setDisabled(!checked);
                }
            }
        });

        me.edtPageSize = Ext.create('Ext.form.field.Number', {
            fieldLabel: RS.$('Report_PageItems'),
            name: 'PageItems',
            disabled: true,
            labelWidth: 'auto',
            minValue: 1,
            allowDecimals: false
        });

        cfg = {
            dockedItems: [{
                margin: '8 88 0 0',
                xtype: 'container',
                dock: 'bottom',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                items: [me.edtStartDate, me.edtDay, { xtype: 'label', html: RS.$('All_UnitMonthDay') }, { xtype: 'tbfill' }, me.chkPaging, me.edtPageSize]
            }],
            items: [me.edtParams]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        Ext.apply(data, data.FinanceMonth);
        delete data.FinanceMonth;
        this.getForm().setValues(data);
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();
        rv.FinanceMonth = {
            Enabled: true
        };
        Ext.copyTo(rv.FinanceMonth, rv, 'MonthOffset,MonthDay');
        delete rv.MonthOffset;
        delete rv.MonthDay;

        return rv;
    }
});