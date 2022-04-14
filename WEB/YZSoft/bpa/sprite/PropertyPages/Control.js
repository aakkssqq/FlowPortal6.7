/*
config:
groupid
*/
Ext.define('YZSoft.bpa.sprite.PropertyPages.Control', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('BPA_Title_SpritePrperty_Control'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            dlgCfg,cfg;

        dlgCfg = {
            groupid: config.groupid,
            folderType: 'BPAControl'
        };

        cfg = {
            defaults:{
            },
            items: [{
                xclass: 'YZSoft.bpa.src.form.field.SpritesField',
                fieldLabel: RS.$('KM_Regulation'),
                name: 'Regulation',
                dlgConfig: dlgCfg
            }, {
                xclass: 'YZSoft.bpa.src.form.field.SpritesField',
                fieldLabel: RS.$('KM_Risk'),
                name: 'Risk',
                dlgConfig: dlgCfg
            }, {
                xclass: 'YZSoft.bpa.src.form.field.SpritesField',
                fieldLabel: RS.$('BPA__ControlPoint'),
                name: 'ControlPoint',
                dlgConfig: dlgCfg
            }, {
                xclass: 'YZSoft.bpa.src.form.field.SpritesField',
                fieldLabel: RS.$('BPA__KPI'),
                name: 'KPI',
                dlgConfig: dlgCfg
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('BPA__ControlPointDesc'),
                name: 'ctlDesc',
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