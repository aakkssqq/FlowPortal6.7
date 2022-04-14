/*
groupid
*/
Ext.define('YZSoft.bpa.processreport.RiskPanel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this;

        me.pickProcess = Ext.create('YZSoft.bpa.src.form.field.ProcessRange', {
            region: 'center',
            fieldLabel: RS.$('BPA__ProcessScope'),
            labelAlign: 'top',
            groupid: config.groupid,
            folderType: 'BPAProcess'
        });

        var cfg = {
            layout: 'border',
            defaults: {
                labelWidth: config.labelWidth,
                listeners: {
                    change: function () {
                        me.fireEvent('change');
                    }
                }
            },
            items: [me.pickProcess]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    save: function () {
        var me = this;

        return {
            processRange: me.pickProcess.getValue()
        };
    },

    isValid: function (data) {
        return data && (data.fileid || data.folderid);
    }
});