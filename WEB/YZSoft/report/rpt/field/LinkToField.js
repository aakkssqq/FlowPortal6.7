/*
config
importdataset
serverName
allowCode true/false default false

method
setTables
setValueType
*/

Ext.define('YZSoft.report.rpt.field.LinkToField', {
    extend: 'Ext.form.field.Text',
    allowCode: true,
    triggers: {
        browser: {
            cls: 'yz-trigger-reportlinkto',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this;

        switch (me.linkType) {
            case 'None':
                YZSoft.alert(RS.$('Report_ValidationErr_LinkTypeNotSpecified'));
                break;
            case 'FormApplication':
                Ext.create('YZSoft.bpm.src.dialogs.SelFormServiceDlg', {
                    autoShow: true,
                    fn: function (value) {
                        me.fireEvent('selected', value.FullName);
                    }
                });
                break;
            case 'Report':
                Ext.create('YZSoft.report.rpt.dialogs.SelReportDlg', {
                    autoShow: true,
                    fn: function (value) {
                        me.fireEvent('selected', value.fullname);
                    }
                });
                break;           
        }
    },

    setLinkType: function (linkType) {
        this.linkType = linkType;
    }
});