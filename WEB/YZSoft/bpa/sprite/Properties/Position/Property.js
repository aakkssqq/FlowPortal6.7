/*
config
sprite
drawContainer
data
*/
Ext.define('YZSoft.bpa.sprite.Properties.Position.Property', {
    extend: 'YZSoft.bpa.sprite.Properties.Property',
    dialog: {
        xclass: 'YZSoft.bpa.sprite.Properties.Position.Dialog',
        dlgName: RS.$('BPA_Title_SpritePrperty_Position')
    },
    staticData: {
        spriteType: 'Position',
        reportType: 'ORG'
    }
});