/*
groupid
*/
Ext.define('YZSoft.bpa.processreport.SOPPanel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this;

        me.cmbTemplates = Ext.create('YZSoft.bpa.src.form.field.ReportTemplatesComboBox', {
            fieldLabel: RS.$('BPA_AdminMenu_ReportTemplate_SOP'),
            reportType: 'SOP'
        });

        me.pickProcess = Ext.create('YZSoft.bpa.src.form.field.ProcessRange', {
            flex: 1,
            fieldLabel: RS.$('BPA__ProcessScope'),
            labelAlign: 'top',
            groupid: config.groupid,
            folderType: 'BPAProcess'
        });

        var cfg = {
            layout: {
                type:'vbox',
                align:'stretch'
            },
            defaults: {
                labelWidth: config.labelWidth,
                listeners: {
                    change: function () {
                        me.fireEvent('change');
                    }
                }
            },
            items: [me.cmbTemplates, me.pickProcess]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    save: function () {
        var me = this;

        return {
            type:'SOP',
            template: me.cmbTemplates.getValue(),
            processRange: me.pickProcess.getValue()
        };
    },

    isValid: function (data) {
        return data && (data.fileid || data.folderid);
    }
});