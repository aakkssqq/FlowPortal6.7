/*
config:
groupid
*/
Ext.define('YZSoft.bpa.sprite.PropertyPages.Resource', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('BPA_Title_SpritePrperty_Resource'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            defaults:{
            },
            items: [{
                xclass: 'YZSoft.bpa.src.form.field.SpritesField',
                fieldLabel: RS.$('BPA_Form'),
                name: 'Form',
                dlgConfig: {
                    groupid: config.groupid,
                    folderType: 'BPAData'
                }
            }, {
                xclass: 'YZSoft.bpa.src.form.field.SpritesField',
                fieldLabel: RS.$('KM_ITSystem'),
                name: 'ITSystem',
                dlgConfig: {
                    groupid: config.groupid,
                    folderType: 'BPAITSystem'
                }
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('BPA__ResourceDesc'),
                name: 'resDesc',
                labelAlign: 'top',
                flex: 1,
                margin: '3 0 0 0'
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