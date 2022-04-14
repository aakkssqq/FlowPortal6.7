/*
config
sprite
drawContainer
data
*/
Ext.define('YZSoft.bpa.sprite.Properties.Regulation.Property', {
    extend: 'YZSoft.bpa.sprite.Properties.Property',
    dialog: {
        xclass: 'YZSoft.bpa.sprite.Properties.Regulation.Dialog',
        dlgName: RS.$('BPA_Title_SpritePrperty_Regulation')
    },
    staticData: {
        spriteType: 'Regulation',
        reportType: 'Regulation'
    }
});