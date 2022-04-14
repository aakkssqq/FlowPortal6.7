/*
config
sprite
drawContainer
data
*/
Ext.define('YZSoft.bpa.sprite.Properties.Risk.Property', {
    extend: 'YZSoft.bpa.sprite.Properties.Property',
    dialog: {
        xclass: 'YZSoft.bpa.sprite.Properties.Risk.Dialog',
        dlgName: RS.$('BPA_Title_SpritePrperty_Risk')
    },
    staticData: {
        spriteType: 'Risk',
        reportType: 'Risk'
    }
});