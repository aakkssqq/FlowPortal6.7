/*
*/
Ext.define('YZSoft.src.jschema.tree.SpecificSchemaOutputTree', {
    extend: 'YZSoft.src.jschema.tree.Abstract',
    decodable: false,

    isRecordCanDecode: function (record) {
        var me = this;

        if (record.isDecodeField())
            return true;

        if (record.isString())
            return true;

        if (record.isStringArray())
            return true;

        if (record.isAnyArray())
            return true;
    },

    onItemContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            decodable = me.decodable,
            canDecode = me.isRecordCanDecode(record),
            childOfDecode = record.isChildOfDecodeField(),
            isDataSet = record.is('DataSet'),
            isDataTable = record.is('DataTable'),
            type, menu, items;

        e.stopEvent();

        menu = {
            editChildDecodable: {
                glyph: me.glyphs.edit,
                text: RS.$('All_Edit'),
                handler: function () {
                    me.editChildDecodable(record);
                }
            },
            editChildNotDecodable: {
                glyph: me.glyphs.edit,
                text: RS.$('All_Edit'),
                handler: function () {
                    me.editChild(record);
                }
            },
            editTopDecodable: {
                glyph: me.glyphs.edit,
                text: RS.$('JSchema_DecodeField'),
                handler: function () {
                    me.editTopDecodable(record);
                }
            },
            import: {
                glyph: me.glyphs.import,
                text: RS.$('JSchame_ImportSchema'),
                handler: function () {
                    me.importSchema(record);
                }
            },
            importDisabled: {
                glyph: me.glyphs.import,
                text: RS.$('JSchame_ImportSchema'),
                disabled: true,
                handler: function () {
                    me.importSchema(record);
                }
            },
            denyEdit: {
                glyph: me.glyphs.edit,
                text: RS.$('All_Edit'),
                disabled: true
            },
            editDataSet: {
                glyph: me.glyphs.edit,
                text: RS.$('All_Edit'),
                handler: function () {
                    me.editDataSet(record);
                }
            },
            editDataTable: {
                glyph: me.glyphs.edit,
                text: RS.$('All_Edit'),
                handler: function () {
                    me.editDataTable(record);
                }
            }
        };

        if (isDataSet) {
            items = [
                menu.editDataSet
            ];
        }
        else if (isDataTable) {
            items = [
                menu.editDataTable
            ];
        }
        else if (decodable) {
            if (childOfDecode) {
                if (canDecode) {
                    items = [
                        menu.editChildDecodable,
                        menu.import
                    ];
                }
                else {
                    items = [
                        menu.editChildNotDecodable,
                        menu.import
                    ];
                }
            }
            else {
                if (canDecode) {
                    var oldSchema = record.save(),
                        oldDecode = oldSchema.yzext && oldSchema.yzext.decode && oldSchema.yzext.decode.enabled;

                    items = [
                        menu.editTopDecodable,
                        oldDecode ? menu.import : menu.importDisabled,
                        menu.clearMap
                    ];
                }
                else {
                    items = [
                        menu.denyEdit
                    ];
                }
            }
        }
        else {
        }

        if (!items)
            return;

        me.showMenu(e, items);
    },

    editTopDecodable: function (record, config) {
        var me = this;

        me.editComplexField(record, Ext.apply({
            nameField: {
                hidden: true
            },
            typeField: {
                types: ['jschema', 'object']
            },
            typeWrap: {
                hidden: true
            },
            decodeWrap: {
                hidden: false
            },
            cmbDecodeType: {
            },
            childFieldsEditor: {
                margin: '0 0 10 0',
                types: ['jschema', 'object'],
                childFieldColumnName: RS.$('JSchema_ChildFieldColumnName')
            },
            before: function (schema) {
            }
        }, config));
    },

    editChildDecodable: function (record) {
        var me = this;

        me.editChild(record);
    },

    editChild: function (record) {
        var me = this;

        me.editComplexField(record, {
            nameField: {
                disabled: true
            },
            typeField: {
                types: ['jschema', 'object']
            },
            decodeWrap: {
                hidden: true
            },
            childFieldsEditor: {
                margin: '0 0 10 0',
                types: ['jschema', 'object'],
                childFieldColumnName: RS.$('JSchema_ChildFieldColumnName')
            },
            before: function (schema) {
            }
        });
    },

    replaceSchema: function (record, newSchema, config) {
        if (!this.decodable)
            return this.callParent(arguments);

        var me = this,
            canDecode = me.isRecordCanDecode(record),
            childOfDecode = record.isChildOfDecodeField(),
            oldSchema = record.save(),
            newSchemaBody = Ext.Object.getValues(newSchema)[0],
            oldDecode = oldSchema.yzext && oldSchema.yzext.decode && oldSchema.yzext.decode.enabled,
            newDecode = newSchemaBody.yzext && newSchemaBody.yzext.decode && newSchemaBody.yzext.decode.enabled,
            isDataSet = record.is('DataSet'),
            isDataTable = record.is('DataTable');


        if (isDataSet || isDataTable || childOfDecode) {
            me.callParent(arguments);
        }
        else {
            if (newDecode) {
                me.callParent(arguments);
            }
            else {
                if (oldDecode) {
                    delete record.data.yzext.decode;
                    me.fireEvent('schemachanged', me, me.store);
                    me.fireEvent('fieldreset', me);
                }
                else {
                    //do nothing
                }
            }
        }
    }
});