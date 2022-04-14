
Ext.define('YZSoft.src.jschema.tree.FreeSchemaTreeAbstract', {
    extend: 'YZSoft.src.jschema.tree.Abstract',

    edit: function (record) {
        var me = this,
            propertyName = record.data.propertyName;

        if (record.is('header'))
            me.editHeader(record, RS.$('ESB_SchameEditDlg_Title_Header'));
        else if (record.is('queryParams'))
            me.editHeader(record, RS.$('ESB_SchameEditDlg_Title_QueryParams'));
        else if (record.is('form'))
            me.editHeader(record, RS.$('ESB_SchameEditDlg_Title_Form'));
        else if (record.is('payload'))
            me.editPayload(record, RS.$('ESB_SchameEditDlg_Title_Payload'));
        else if (record.is('response'))
            me.editPayload(record, RS.$('ESB_SchameEditDlg_Title_Response'));
        else if (record.isChildOf('payload') || record.isChildOf('response'))
            me.editPayloadChild(record);
        else
            me.editHeaderChild(record);
    },

    editHeader: function (record, title) {
        var me = this;

        me.editComplexField(record, {
            title: title,
            nameField: {
                hidden: true
            },
            typeField: {
                types: ['object']
            },
            typeWrap: {
                hidden: true
            },
            childFieldsEditor: {
                types: ['jschema'],
                arrayColumn: {
                    hidden: true
                },
                margin: '0 0 10 0',
                childFieldColumnName: RS.$('All_ColumnName')
            }
        });
    },

    editPayload: function (record, title) {
        var me = this;

        me.editComplexField(record, {
            title: title,
            nameField: {
                disabled: true
            },
            typeField: {
                types: ['jschema', 'object']
            },
            childFieldsEditor: {
                types: ['jschema', 'object'],
                childFieldColumnName: RS.$('JSchema_ChildFieldColumnName')
            }
        });
    },

    editHeaderChild: function (record) {
        var me = this;

        me.editSimpleField(record, {
            typeField: {
                types: ['jschema']
            },
            isArrayField: {
                hidden: true
            }
        });
    },

    editPayloadChild: function (record) {
        var me = this;

        me.editComplexField(record, {
            typeField: {
                types: ['jschema', 'object']
            },
            childFieldsEditor: {
                types: ['jschema', 'object'],
                childFieldColumnName: RS.$('JSchema_ChildFieldColumnName')
            }
        });
    }
});