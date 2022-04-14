/*
value:
{
  "State": "Period",
  "From": new Date(
    "2014-12-18 20:46:00"
  ),
  "To": new Date(
    "2014-12-17 18:44:00"
  )
}
*/

Ext.define('YZSoft.bpm.src.editor.LeavingField', {
    extend: 'YZSoft.src.form.FieldContainer',
    referenceHolder: true,

    constructor: function (config) {
        var me = this;

        var cfg = {
            defaults: {
                submitValue: false,
                listeners: {
                    change: function () {
                        me.fireEvent('change');
                        me.updateStatus();
                    }
                }
            },
            items: [{
                xtype: 'radiogroup',
                reference: 'type',
                columns: 1,
                defaults: {
                    submitValue: false
                },
                items: [
                    { boxLabel: RS.$('All_InOffice'), name: 'State', inputValue: 'InOffice' },
                    { boxLabel: RS.$('All_OutingOfOffice'), name: 'State', inputValue: 'Out' },
                    { boxLabel: RS.$('All_OutOfOfficePeriod'), name: 'State', inputValue: 'Period' }
                ]
            }, {
                xclass: 'YZSoft.src.form.field.DateTimeField',
                fieldLabel: RS.$('All_StartTime'),
                reference: 'from',
                padding: '0px 0px 0px 20px'
            }, {
                xclass: 'YZSoft.src.form.field.DateTimeField',
                fieldLabel: RS.$('All_EndTime'),
                reference: 'to',
                padding: '0px 0px 0px 20px'
            }]
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    setValue: function (value) {
        var me = this,
            refs = me.getReferences();

        refs.type.setValue({ State: value.State });
        refs.from.setValue(value.From);
        refs.to.setValue(value.To);
    },

    getValue: function () {
        var me = this,
            refs = me.getReferences();

        var rv = {
            State: refs.type.getValue().State,
            From: refs.from.getValue(),
            To: refs.to.getValue()
        };

        if (!rv.From)
            delete rv.From;

        if (!rv.To)
            delete rv.To;

        return rv;
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            data = me.getValue(),
            isPeriodType = data.State == 'Period';

        refs.from.setDisabled(!isPeriodType);
        refs.to.setDisabled(!isPeriodType);
    }
})