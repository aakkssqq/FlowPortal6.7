/*
singleSelection default:false
*/
Ext.define('YZSoft.bpm.src.form.field.TableSort', {
    extend: 'YZSoft.src.form.FieldContainer',
    layout: {
        type:'hbox',
        align:'stretch'
    },
    height: 120,

    constructor:function(config){
        var me = this;

        var cfg = {
            items: [{
                xtype:'textarea',
                flex:1,
                editable:false
            },{
                xtype: 'panel',
                bodyPadding:'0 0 0 3',
                bodyStyle:'background-color:transparent',
                border:false,
                layout:'vbox',
                defaults:{
                    margin:'0 0 3 0'
                },
                items: [{
                    xtype: 'button',
                    text: RS.$('All_Edit')
                },{
                    xtype: 'button',
                    text: RS.$('All_ClearEmpty')
                }]
            }]
        };

        Ext.apply(cfg,config);
        me.callParent([cfg]);
    }
});