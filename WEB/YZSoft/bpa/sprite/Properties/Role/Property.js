/*
config
sprite
drawContainer
data
*/
Ext.define('YZSoft.bpa.sprite.Properties.Role.Property', {
    extend: 'YZSoft.bpa.sprite.Properties.Property',
    dialog: {
        xclass: 'YZSoft.bpa.sprite.Properties.Role.Dialog',
        dlgName: RS.$('BPA_Title_SpritePrperty_Role')
    },
    staticData: {
        spriteType: 'Role',
        reportType: 'ORG'
    }
});