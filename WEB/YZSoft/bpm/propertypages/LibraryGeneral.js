/*
config
*/
Ext.define('YZSoft.bpm.propertypages.LibraryGeneral', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],
    referenceHolder: true,
    title: RS.$('All_General'),

    constructor: function (config) {
        var me = this;

        me.edtLogo = Ext.create('YZSoft.src.form.field.Image', Ext.apply({
            width: 126,
            height: 126,
            emptySrc: YZSoft.$url('BPA/Styles/ui/lib_icon.png'),
            download: {
                url: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'),
                params: {
                    Method: 'ImageStreamFromFileID',
                    scale: 'Scale',
                    width: 120,
                    height: 120
                }
            }
        }, config.logoConfig));

        me.edtName = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_LibName'),
            labelAlign: 'top'
        });

        me.edtDesc = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: RS.$('All_LibDesc'),
            labelAlign: 'top'
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
                flex: 1,
                layout: 'center',
                items: [me.edtLogo]
            },me.edtName, me.edtDesc]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        var me = this;

        me.edtLogo.setValue(data.ImageFileID);
        me.edtName.setValue(data.Name);
        me.edtDesc.setValue(data.Desc);
    },

    save: function () {
        var me = this,
            rv = {};

        Ext.apply(rv, {
            ImageFileID: me.edtLogo.getValue(),
            Name: me.edtName.getValue(),
            Desc: me.edtDesc.getValue()
        });

        return rv;
    }
});