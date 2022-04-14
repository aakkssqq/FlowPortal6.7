/*
config:
*/
Ext.define('YZSoft.bpa.sprite.PropertyPages.ProcessDescription', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('BPA_Title_SpritePrperty_ProcessDesc'),
    layout: {
        type:'vbox',
        align:'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            defaults: {
                margin: '0 0 5 0',
                cls: 'yz-textarea-3line'
                // labelAlign: 'top',
            },
            items: [{
                xtype: 'textarea',
                fieldLabel: RS.$('BPA__Purpose'),
                name: 'Purpose',
                flex: 1
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('BPA__Scope'),
                name: 'Scope'
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('BPA__Definition'),
                name: 'Definition',
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('BPA__Responsibility'),
                name: 'Responsibility',
                margin: 0
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

    updateStatus: function () {
    }
});