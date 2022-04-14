
Ext.define('YZSoft.src.form.field.DataSource', {
    extend: 'Ext.form.field.Text',
    requires: [
        'YZSoft.src.datasource.DataSource'
    ],
    allowBlank: true,
    editable : false,
    triggers: {
        browser: {
            cls: 'yz-trigger-datasource',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this;

        Ext.create('YZSoft.src.datasource.dialogs.SearchFieldDataSource', {
            autoShow: true,
            ds: me.getValue(),
            fn: function (ds) {
                me.onSelect(ds);
            }
        });
    },

    setValue: function (value) {
        var me = this,
            ideneity = YZSoft.src.datasource.DataSource.getIdentityText(value);

        me.objValue = value;
        me.callParent([ideneity]);
    },

    getValue: function () {
        return this.objValue || null;
    },

    onSelect: function (ds) {
        this.setValue(ds);
        this.fireEvent('select', ds);
    }
});