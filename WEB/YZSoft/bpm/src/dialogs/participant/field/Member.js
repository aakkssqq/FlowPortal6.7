
Ext.define('YZSoft.bpm.src.dialogs.participant.field.Member', {
    extend: 'Ext.form.field.Text',

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            triggers: {
                org: {
                    cls: 'yz-trigger-org',
                    handler: function () {
                        YZSoft.SelMemberDlg.show({
                            fn: function (user) {
                                me.setValue(user.MemberFullName);
                            }
                        });
                    }
                },
                formfield: {
                    cls: 'yz-trigger-form',
                    hidden: !config.tables,
                    handler: function () {
                        if (!me.dlgFormField) {
                            me.dlgFormField = Ext.create('YZSoft.bpm.src.dialogs.SelFormFieldDlg', {
                                closeAction: 'hide',
                                tables: config.tables,
                                fn: function (field) {
                                    me.setValue(Ext.String.format('<%=FormDataSet["{0}.{1}"]%>',
                                        field.TableName, field.ColumnName));
                                }
                            });
                        }

                        me.dlgFormField.show();
                    }
                }
            }
        };

        Ext.apply(cfg, config);
        this.callParent([cfg]);
    }
});