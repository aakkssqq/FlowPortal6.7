/*
config
sprite
drawContainer
data
*/
Ext.define('YZSoft.bpa.sprite.Properties.KPI.Property', {
    extend: 'YZSoft.bpa.sprite.Properties.Property',
    dialog: {
        xclass: 'YZSoft.bpa.sprite.Properties.KPI.Dialog',
        dlgName: RS.$('BPA_Title_SpritePrperty_KPI')
    },
    staticData: {
        spriteType: 'KPI',
        reportType: 'KPI'
    }
});