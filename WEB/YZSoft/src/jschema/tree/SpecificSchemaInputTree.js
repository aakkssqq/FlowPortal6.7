/*
*/
Ext.define('YZSoft.src.jschema.tree.SpecificSchemaInputTree', {
    extend: 'YZSoft.src.jschema.tree.Abstract',
    encodable: false,

    isRecordCanEncode: function (record) {
        var me = this;

        if (record.isEncodeField())
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
            encodable = me.encodable,
            canEncode = me.isRecordCanEncode(record),
            childOfEncode = record.isChildOfEncodeField(),
            type, menu, items;

        e.stopEvent();

        menu = {
            estdChildEncodable: {
                glyph: me.glyphs.edit,
                text: RS.$('All_Edit'),
                handler: function () {
                    me.editChildEncodable(record);
                }
            },
            editChildNotEncodable: {
                glyph: me.glyphs.edit,
                text: RS.$('All_Edit'),
                handler: function () {
                    me.editChild(record);
                }
            },
            editTopEncodable: {
                glyph: me.glyphs.edit,
                text: RS.$('JSchema_EncodeField'),
                handler: function () {
                    me.editTopEncodable(record);
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
            clearMap: {
                glyph: me.glyphs.clearMap,
                text: RS.$('ESB_ClearMap'),
                handler: function () {
                    me.clearMapByToRecord(record);
                }
            }
        };

        if (encodable) {
            if (childOfEncode) {
                if (canEncode) {
                    items = [
                        menu.editChildEncodable,
                        menu.import,
                        menu.clearMap
                    ];
                }
                else {
                    items = [
                        menu.editChildNotEncodable,
                        menu.import,
                        menu.clearMap
                    ];
                }
            }
            else {
                if (canEncode) {
                    var oldSchema = record.save(),
                        oldEncode = oldSchema.yzext && oldSchema.yzext.encode && oldSchema.yzext.encode.enabled;

                    items = [
                        menu.editTopEncodable,
                        oldEncode ? menu.import : menu.importDisabled,
                        menu.clearMap
                    ];
                }
                else {
                    items = [
                        menu.denyEdit,
                        menu.clearMap
                    ];
                }
            }
        }
        else {
            items = [
                menu.clearMap
            ]
        }

        if (!items)
            return;

        me.showMenu(e, items);
    },

    editTopEncodable: function (record, config) {
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
            encodeWrap: {
                hidden: false
            },
            cmbEncodeType: {
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

    editChildEncodable: function (record) {
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
            encodeWrap: {
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
        if (!this.encodable)
            return this.callParent(arguments);

        var me = this,
            canEncode = me.isRecordCanEncode(record),
            childOfEncode = record.isChildOfEncodeField(),
            oldSchema = record.save(),
            newSchemaBody = Ext.Object.getValues(newSchema)[0],
            oldEncode = oldSchema.yzext && oldSchema.yzext.encode && oldSchema.yzext.encode.enabled,
            newEncode = newSchemaBody.yzext && newSchemaBody.yzext.encode && newSchemaBody.yzext.encode.enabled;

        if (childOfEncode) {
            me.callParent(arguments);
        }
        else {
            if (newEncode) {
                me.callParent(arguments);
            }
            else {
                if (oldEncode) {
                    delete record.data.yzext.encode;
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