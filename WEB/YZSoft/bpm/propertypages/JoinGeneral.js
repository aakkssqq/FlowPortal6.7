/*
config:
*/
Ext.define('YZSoft.bpm.propertypages.JoinGeneral', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_General'),
    layout: 'anchor',

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_StepName'),
                name: 'Name',
                reference: 'edtName'
            }, {
                xtype: 'fieldset',
                title: RS.$('All_Type'),
                margin:'8 0 0 0',
                items: [{
                    xtype: 'radiogroup',
                    padding: '3 6',
                    columns: 1,
                    defaults: {
                        name: 'JoinType'
                    },
                    items: [
                        { boxLabel: RS.$('Process_JoinType_Normal'), inputValue: 'Normal' },
                        { boxLabel: RS.$('Process_JoinType_Vote'), inputValue: 'Vote' }
                    ],
                    listeners: {
                        scope: me,
                        delay: 1, //否则me.save()获得的JoinType数据，是变化之前的
                        change: 'onJoinTypeCheckChange'
                    }
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();
        return rv;
    },

    onJoinTypeCheckChange: function (radio, newValue, oldValue, eOpts) {
        var me = this,
            data = me.save();

        me.fireEvent('joinTypeChanged', data.JoinType);
    },

    updateStatus: function () {
    }
});