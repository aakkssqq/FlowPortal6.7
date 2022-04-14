/*
config
sprite
drawContainer
data
*/
Ext.define('YZSoft.bpa.sprite.Properties.Employee.Property', {
    extend: 'YZSoft.bpa.sprite.Properties.Property',
    dialog: {
        xclass: 'YZSoft.bpa.sprite.Properties.Employee.Dialog',
        dlgName: RS.$('BPA_Title_SpritePrperty_Employee')
    },
    staticData: {
        spriteType: 'Employee',
        reportType: 'ORG'
    }
});