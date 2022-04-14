/*
config:
*/
Ext.define('YZSoft.bpa.sprite.PropertyPages.ProcessAdditional', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_Other'),
    layout: {
        type:'vbox',
        align:'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            defaults: {
                labelAlign: 'top',
                cls: 'yz-textarea-3line'
            },
            items: [{
                xtype: 'textarea',
                fieldLabel: RS.$('BPA__DispatchScope'),
                name: 'DispatchScope',
                flex: 1
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('BPA__DesignPurpose'),
                name: 'DesignPurpose'
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