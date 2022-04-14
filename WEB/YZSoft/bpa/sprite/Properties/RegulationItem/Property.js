/*
config
sprite
drawContainer
data
*/
Ext.define('YZSoft.bpa.sprite.Properties.RegulationItem.Property', {
    extend: 'YZSoft.bpa.sprite.Properties.Property',
    dialog: {
        xclass: 'YZSoft.bpa.sprite.Properties.RegulationItem.Dialog',
        dlgName: RS.$('BPA_Title_SpritePrperty_RegulationItem')
    },
    staticData: {
        spriteType: 'RegulationItem',
        reportType: 'Regulation'
    }
});