/*
getRootOUsType
srcoupath
*/
Ext.define('YZSoft.src.form.field.OU', {
    extend: 'Ext.form.field.Text',
    xtype: 'YZUserField',
    allowBlank: true,
    triggers: {
        browser: {
            cls: 'yz-trigger-ou',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this;

        Ext.create('YZSoft.bpm.src.dialogs.SelOUDlg', {
            getRootOUsType: me.getRootOUsType,
            srcoupath: me.srcoupath,
            autoShow: true,
            fn: function (ou) {
                if (ou == null)
                    return;

                me.onSelect(ou);
            }
        });
    },

    onSelect: function (ou) {
        this.setValue(ou);
        this.fireEvent('select', ou);
    },

    setValue: function (value) {
        this.tagValue = value;
        this.callParent([value ? value.FullName:null]);
    },

    getValue: function () {
        return this.tagValue;
    }
});