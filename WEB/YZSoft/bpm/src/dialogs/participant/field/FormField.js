
Ext.define('YZSoft.bpm.src.dialogs.participant.field.FormField', {
    extend: 'Ext.form.field.Text',

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            triggers: {
                formfield: {
                    cls: 'yz-trigger-formfield',
                    hidden: !config.tables,
                    handler: function () {
                        if (!me.dlgFormField) {
                            me.dlgFormField = Ext.create('YZSoft.bpm.src.dialogs.SelFormFieldDlg', {
                                closeAction: 'hide',
                                tables: config.tables,
                                fn: function (field) {
                                    var fmt = me.code === false ? '{0}.{1}':'<%=FormDataSet["{0}.{1}"]%>';
                                    me.setValue(Ext.String.format(fmt,field.TableName, field.ColumnName));
                                }
                            });
                        }

                        me.dlgFormField.show();
                    }
                }
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});