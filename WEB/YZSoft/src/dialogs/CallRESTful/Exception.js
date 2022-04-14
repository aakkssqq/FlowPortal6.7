/*
config:
relatedFile
*/
Ext.define('YZSoft.src.dialogs.CallRESTful.Exception', {
    extend: 'Ext.form.Panel',
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },

    initComponent: function () {
        var me = this;

        me.edtErrorExpress = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_exceptionExpress'),
            emptyText: Ext.String.format(RS.$('ESB_exceptionExpress_EmptyText'), "Response.errorCode != '0'"),
            name: 'exceptionExpress'
        });

        me.edtErrorIDField = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_errorCode'),
            emptyText: Ext.String.format(RS.$('ESB_errorCode_EmptyText'), "Response.errorCode"),
            name: 'errorCode'
        });

        me.edtErrorMessageField = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_errorMessage'),
            emptyText: Ext.String.format(RS.$('ESB_errorMessage_EmptyText'), "Response.errorMessage"),
            name: 'errorMessage'
        });

        me.items = [me.edtErrorExpress, me.edtErrorIDField, me.edtErrorMessageField]
        me.callParent();
    },

    fill: function (data) {
        this.getForm().setValues(data);
    },

    save: function () {
        var me = this,
            rv;

        rv = me.getValuesSubmit();
        return rv;
    }
});