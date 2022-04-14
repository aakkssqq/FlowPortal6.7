/*
config:
groupid
*/
Ext.define('YZSoft.bpa.sprite.PropertyPages.Duty', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('BPA_Title_SpritePrperty_Duty'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            dlgCfg,cfg;

        dlgCfg = {
            groupid: config.groupid,
            folderType: 'BPAOU'
        };

        cfg = {
            items: [{
                xclass: 'YZSoft.bpa.src.form.field.SpritesField',
                fieldLabel: RS.$('KM_RACI_Responsible'),
                name: 'Responsible',
                dlgConfig: dlgCfg
            }, {
                xclass: 'YZSoft.bpa.src.form.field.SpritesField',
                fieldLabel: RS.$('KM_RACI_Accountable'),
                name: 'Accountable',
                dlgConfig: dlgCfg
            }, {
                xclass: 'YZSoft.bpa.src.form.field.SpritesField',
                fieldLabel: RS.$('KM_RACI_Consulted'),
                name: 'Consulted',
                dlgConfig: dlgCfg
            }, {
                xclass: 'YZSoft.bpa.src.form.field.SpritesField',
                fieldLabel: RS.$('KM_RACI_Informed'),
                name: 'Informed',
                dlgConfig: dlgCfg
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('KM_DutyDesc'),
                name: 'dutyDesc',
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