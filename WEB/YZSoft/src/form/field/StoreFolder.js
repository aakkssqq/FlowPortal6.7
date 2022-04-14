/*
zone
excludefolder
perm
*/
Ext.define('YZSoft.src.form.field.StoreFolder', {
    extend: 'Ext.form.field.Text',
    allowBlank: true,
    editable: false,

    constructor: function (config) {
        var me = this;

        config.triggers = {
            browser: {
                cls: 'yz-form-org-trigger',
                handler: 'onBrowserClick',
                scope: this
            }
        };

        this.callParent([config]);
    },

    onBrowserClick: function () {
        var me = this;

        Ext.create('YZSoft.bpm.src.dialogs.SelStoreFolderDlg', {
            zone: me.zone,
            excludefolder: me.excludefolder,
            perm: me.perm,
            autoShow: true,
            fn: function (rec) {
                if (rec == null)
                    return;

                me.onSelect(rec);
            }
        });
    },

    onSelect: function (rec) {
        this.setValue(rec);
        this.fireEvent('select', rec);
    },

    setValue: function (value) {
        var path = value && value.data.path,
            path = path == 'root' ? RS.$('All_Root') : path;

        this.tagValue = value;
        this.callParent([value ? path:null]);
    },

    getValue: function () {
        return this.tagValue;
    }
});