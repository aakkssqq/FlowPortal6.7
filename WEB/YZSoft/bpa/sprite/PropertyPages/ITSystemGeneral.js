/*
config:
*/
Ext.define('YZSoft.bpa.sprite.PropertyPages.ITSystemGeneral', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('BPA_Title_BasicProperty'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_Name'),
                name: 'Name'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('BPA__Code'),
                name: 'Code'
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('All_Desc'),
                name: 'Description',
                labelAlign: 'top',
                flex: 1
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('All_Comments'),
                margin: 0,
                name: 'Remark',
                labelAlign: 'top',
                cls: 'yz-textarea-3line'
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