/*
config:
*/
Ext.define('YZSoft.bpa.sprite.PropertyPages.ActivityGeneral', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('BPA_Title_BasicProperty'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('BPA__ActivityName'),
                name: 'Name'
            }, {
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: RS.$('BPA__Code'),
                    width: 380,
                    name: 'Code'
                }, {
                    xtype: 'textfield',
                    fieldLabel: RS.$('BPA_OrderCode'),
                    padding: '0 0 0 60',
                    labelWidth: 50,
                    width: 140,
                    name: 'Order'
                }]
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('BPA__JobDescription'),
                name: 'Description',
                labelAlign: 'top',
                flex: 1
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('All_Comments'),
                margin:0,
                name: 'Remark',
                labelAlign: 'top',
                cls: 'yz-textarea-3line'
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();
        return rv;
    },

    updateStatus: function () {
    }
});