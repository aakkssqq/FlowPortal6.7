/*
config
sprite
drawContainer
data
*/
Ext.define('YZSoft.bpa.sprite.Properties.OU.Property', {
    extend: 'YZSoft.bpa.sprite.Properties.Property',
    dialog: {
        xclass: 'YZSoft.bpa.sprite.Properties.OU.Dialog',
        dlgName: RS.$('BPA_ORG_OU')
    },
    staticData: {
        spriteType: 'OU',
        reportType: 'ORG'
    }
});