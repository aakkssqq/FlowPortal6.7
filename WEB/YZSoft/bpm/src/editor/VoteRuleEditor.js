/*
config
tables
*/
Ext.define('YZSoft.bpm.src.editor.VoteRuleEditor', {
    extend: 'YZSoft.src.form.FieldContainer',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    codeTemplates: [
        '//投票字段 : {0}',
        '//有效值 : {1}',
        '//大于几票 : {2}',
        '',
        'int allVoteCount = 0;',
        'int validVoteCount = 0;',
        'Context context = Context.Current;',
        '',
        'foreach (FlowDataRow row in context.FormDataSet.Tables["{3}"].Rows){',
        '    allVoteCount++;',
        '    if (String.Compare(Convert.ToString(row["{4}"]), "{5}",true) == 0)',
        '         validVoteCount++;',
        '}',
        '',
        'if (validVoteCount >= {6})',
        '    return true;',
        'else',
        '    return false;'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.edtCode = Ext.create('Ext.form.field.TextArea', {
            cls: ['yz-form-field-noborder', 'yz-form-field-code'],
            inputAttrTpl: new Ext.XTemplate([
                'wrap="off"'
            ])
        });

        me.edtCompareField = Ext.create('Ext.form.field.Text', {
            flex: 1,
            editable: false,
            emptyText: RS.$('All_VoteField'),
            triggers: {
                browser: {
                    cls: 'yz-trigger-formfield',
                    handler: function (field) {
                        Ext.create('YZSoft.bpm.src.dialogs.SelFormFieldDlg', {
                            autoShow: true,
                            tables: me.tables,
                            fn: function (field) {
                                me.edtCompareField.field = field;
                                me.edtCompareField.setValue(field.FullName);
                                me.fireEvent('selected', field);
                            }
                        });
                    }
                }
            }
        });

        me.edtValue = Ext.create('Ext.form.field.Text', {
            margin: '0 0 0 5',
            width: 110,
            emptyText: RS.$('All_VoteValidValue')
        });

        me.edtCount = Ext.create('Ext.form.field.Number', {
            margin: '0 0 0 5',
            width: 110,
            minValue: 0,
            emptyText: RS.$('All_VoteValidCount')
        });

        me.btnGen = Ext.create('Ext.button.Button', {
            text: RS.$('All_GenerateCode'),
            margin: '0 0 0 3',
            padding: '0 5',
            listeners: {
                click: function () {
                    var field = me.edtCompareField.field,
                        value = me.edtValue.getValue(),
                        count = me.edtCount.getValue(),
                        code;

                    if (field && value && (count || count == 0)) {
                        code = Ext.String.format(me.codeTemplates.join('\r\n'),
                            field.FullName,
                            value,
                            count,
                            field.TableName,
                            field.ColumnName,
                            value,
                            count);

                        me.edtCode.setValue(code);
                    }
                }
            }
        });

        cfg = {
            items: [{
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [me.edtCompareField, me.edtValue, me.edtCount, me.btnGen],
                margin: '2 2 3 2'
            }, {
                xtype: 'panel',
                flex: 1,
                title: RS.$('All_Code_CPlus'),
                layout: 'fit',
                items: [
                    me.edtCode
                ]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});