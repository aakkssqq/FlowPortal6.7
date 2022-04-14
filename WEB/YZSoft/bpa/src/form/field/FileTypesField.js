
/*
config
*/
Ext.define('YZSoft.bpa.src.form.field.FileTypesField', {
    extend: 'Ext.form.FieldContainer',
    fileTypes: [
        { ext: '.bpmn', name: RS.$('BPA_FileType_BPMN') },
        { ext: '.evc', name: RS.$('BPA_FileType_EVC') },
        { ext: '.flow', name: RS.$('BPA_FileType_FlowChart') },
        { ext: '.org', name: RS.$('BPA_FileType_ORG') },
        { ext: '.data', name: RS.$('BPA_FileType_Data') },
        { ext: '.it', name: RS.$('BPA_FileType_ITSystem') },
        { ext: '.product', name: RS.$('BPA_FileType_Product') },
        { ext: '.risk', name: RS.$('BPA_FileType_Risk') },
        { ext: '.reg', name: RS.$('BPA_FileType_Regulation') },
        { ext: '.kpi', name: RS.$('BPA_FileType_KPI') },
    ],

    constructor: function (config) {
        var me = this,
            btns = [],
            cfg;


        Ext.each(me.fileTypes, function (fileType) {
            btns.push(Ext.create('Ext.button.Button', {
                text: fileType.name,
                ext: fileType.ext,
                padding: '7 10'
            }));
        });

        me.segBtns = Ext.create('Ext.button.Segmented', {
            items: btns,
            allowMultiple:true
        });

        cfg = {
            items: [me.segBtns]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getValue: function () {
        var me = this,
            rv = [];

        me.segBtns.items.each(function (btn) {
            if (btn.pressed) {
                rv.push(btn.ext);
            }
        });

        return rv;
    }
});