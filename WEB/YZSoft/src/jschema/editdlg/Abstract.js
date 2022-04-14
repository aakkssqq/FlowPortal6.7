/*
config:
*/
Ext.define('YZSoft.src.jschema.editdlg.Abstract', {
    extend: 'Ext.window.Window',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    width: 580,
    minWidth: 580,
    modal: true,
    resizable: true,
    bodyPadding: '10 26',
    types: {
        string: RS.$('All_JSchema_DataType_string'),
        number: RS.$('All_JSchema_DataType_number'),
        integer: RS.$('All_JSchema_DataType_integer'),
        datetime: RS.$('All_JSchema_DataType_datetime'),
        boolean: RS.$('All_JSchema_DataType_boolean'),
        object: RS.$('All_JSchema_DataType_object')
    },
    typeSchemas: {
        jschema: ['string', 'number', 'integer', 'datetime', 'boolean'],
        object: ['object'],
        date: []
    },
    nameField: {
    },
    typeField: {
        types: ['jschema', 'object']
    },
    isArrayField: {
    },
    typeWrap: {
    },
    chkDecode: {
    },
    cmbDecodeType: {
        defaultDecode: 'JSON'
    },
    decodeWrap: {
        hidden: true
    },
    chkEncode: {
    },
    cmbEncodeType: {
        defaultEncode: 'JSON'
    },
    chkEncodeEach: {
    },
    encodeWrap: {
        hidden: true
    },
    childFieldsEditor: {
        margin: '20 0 10 0',
        types: ['jschema']
    },
    propertyName: null,
    schema: null,

    constructor: function (config) {
        config = config || {};
        var me = this;

        Ext.each(['nameField', 'typeField', 'isArrayField', 'typeWrap', 'chkDecode', 'cmbDecodeType', 'decodeWrap', 'chkEncode', 'cmbEncodeType', 'chkEncodeEach', 'encodeWrap', 'childFieldsEditor'], function (fieldName) {
            config[fieldName] = config['init' + Ext.String.capitalize(fieldName)] = Ext.apply({}, config[fieldName], me[fieldName]);
        });

        config.childFieldsEditor.types = me.extraSchemaTypes(config.childFieldsEditor.types);
        config.typeField.types = me.extraSchemaTypes(config.typeField.types);

        me.callParent([config]);
    },

    initComponent: function () {
        var me = this;

        me.nameField = me.createNameField();

        me.typeField = me.createTypeField();
        me.isArrayField = me.createIsArrayField();
        me.typeWrap = me.createTypeWarp();

        me.chkDecode = me.createDecodeField();
        me.cmbDecodeType = me.createDecodeTypeField();
        me.decodeWrap = me.createDecodeWarp();

        me.chkEncode = me.createEncodeField();
        me.cmbEncodeType = me.createEncodeTypeField();
        me.chkEncodeEach = me.createEncodeEachField();
        me.encodeWrap = me.createEncodeWarp();

        me.childFieldsEditor = me.createChildFieldsEditor();

        me.btnOK = me.createOKButton();
        me.btnCancel = me.createCancelButton();

        me.defaultFocus = me.nameField;
        me.buttons = [me.btnOK, me.btnCancel];
        me.items = [
            me.encodeWrap,
            me.decodeWrap,
            me.nameField,
            me.typeWrap,
            me.childFieldsEditor
        ];

        me.callParent(arguments);
        me.updateStatus();
    },

    createNameField: function () {
        var me = this;

        return Ext.create('Ext.form.field.Text', Ext.apply({
            fieldLabel: RS.$('JSchema_Editor_FieldName'),
            value: me.propertyName,
            listeners: {
                scope: me,
                change: 'updateStatus'
            }
        }, me.nameField));
    },

    createTypeField: function () {
        var me = this,
            value = me.schema,
            encode = me.schema.yzext && me.schema.yzext.encode,
            decode = me.schema.yzext && me.schema.yzext.decode,
            label, type;

        label = RS.$('All_Type');
        type = value.type == 'array' ? value.items.type : value.type;

        if (me.isEncodeModel()) {
            label = RS.$('JSchema_Editor_BeforeEncodeType');
            if (!encode || encode.enabled !== true)
                type = 'object'
        }
        else if (me.isDecodeModel()) {
            label = RS.$('JSchema_Editor_AfterDecodeType');
            if (!decode || decode.enabled !== true)
                type = 'object'
        }

        return Ext.create('Ext.form.field.ComboBox', Ext.apply({
            fieldLabel: label,
            width: 260,
            store: {
                fields: ['value', 'name'],
                data: me.typeField.types
            },
            displayField: 'name',
            valueField: 'value',
            value: type,
            editable: false,
            listeners: {
                scope: me,
                change: 'updateStatus'
            }
        }, me.typeField));
    },

    createIsArrayField: function () {
        var me = this;

        return Ext.create('Ext.form.field.Checkbox', Ext.apply({
            boxLabel: RS.$('All_Array'),
            checked: me.schema.type == 'array',
            listeners: {
                scope: me,
                change: 'updateStatus'
            }
        }, me.isArrayField));
    },

    createTypeWarp: function () {
        var me = this;

        return Ext.create('Ext.form.FieldContainer', Ext.apply({
            layout: {
                type: 'hbox',
                pack: 'start'
            },
            items: [me.typeField, {xtype:'tbspacer', width:20}, me.isArrayField]
        }, me.typeWrap));
    },

    createDecodeField: function () {
        var me = this,
            decode = me.schema.yzext && me.schema.yzext.decode;

        return Ext.create('Ext.form.field.Checkbox', Ext.apply({
            boxLabel: RS.$('JSchema_Editor_BoxLabelDecode'),
            checked: decode && decode.enabled,
            listeners: {
                scope: me,
                change: 'updateStatus'
            }
        }, me.chkDecode));
    },

    createDecodeTypeField: function () {
        var me = this,
            decode = me.schema.yzext && me.schema.yzext.decode;

        return Ext.create('Ext.form.field.ComboBox', Ext.apply({
            width: 120,
            store: {
                fields: ['value', 'name'],
                data: [
                    { value: 'JSON', name: RS.$('JSchema_Editor_JsonDecorder') },
                    { value: 'XML', name: RS.$('JSchema_Editor_XMLDecorder') }
                ]
            },
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            value: (decode && decode.type) || me.cmbDecodeType.defaultDecode,
            editable: false,
            forceSelection: true
        }, me.cmbDecodeType));
    },

    createDecodeWarp: function () {
        var me = this;

        me.labDecodeType = Ext.create('Ext.form.Label', {
            text: RS.$('JSchema_Editor_BeforeDecodeType'),
            margin: '0 10 0 0',
            hidden: me.cmbDecodeType.hidden
        });

        me.cmbDecodeType.on({
            show: function () {
                me.labDecodeType.show();
            },
            hide: function () {
                me.labDecodeType.hide();
            }
        });

        if (!me.cmbDecodeType.rendered) {
            me.cmbDecodeType.on({
                single: true,
                afterrender: function () {
                    me.labDecodeType[me.cmbDecodeType.hidden ? 'hide' : 'show']();
                }
            });
        }

        return Ext.create('Ext.form.FieldContainer', Ext.apply({
            fieldLabel: RS.$('JSchema_Editor_LabelDecode'),
            layout: {
                type: 'hbox',
                align: 'center'
            },
            items: [me.chkDecode, { xtype: 'tbfill' }, me.labDecodeType, me.cmbDecodeType]
        }, me.decodeWrap));
    },

    createEncodeField: function () {
        var me = this,
            encode = me.schema.yzext && me.schema.yzext.encode;

        return Ext.create('Ext.form.field.Checkbox', Ext.apply({
            boxLabel: RS.$('JSchema_Editor_BoxLabelEncode'),
            checked: encode && encode.enabled,
            listeners: {
                scope: me,
                change: 'updateStatus'
            }
        }, me.chkEncode));
    },

    createEncodeTypeField: function () {
        var me = this,
            encode = me.schema.yzext && me.schema.yzext.encode;

        return Ext.create('Ext.form.field.ComboBox', Ext.apply({
            width: 180,
            store: {
                fields: ['value', 'name'],
                data: [
                    { value: 'JSON', name: RS.$('JSchema_Editor_JsonEncorder') },
                    { value: 'XMLDocument', name: RS.$('JSchema_Editor_XMLDocumentEncoder') },
                    { value: 'XMLDataOnly', name: RS.$('JSchema_Editor_XMLDataOnlyEncoder') }
                ]
            },
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            value: (encode && encode.type) || me.cmbEncodeType.defaultEncode,
            editable: false,
            forceSelection: true,
            listeners: {
                scope: me,
                change: 'updateStatus'
            }
        }, me.cmbEncodeType));
    },

    createEncodeEachField: function () {
        var me = this,
            encode = me.schema.yzext && me.schema.yzext.encode;

        return Ext.create('Ext.form.field.Checkbox', Ext.apply({
            boxLabel: RS.$('JSchema_Editor_EncodeEachItem'),
            margin: '0 0 0 0',
            checked: encode && encode.each
        }, me.chkEncodeEach));
    },

    createEncodeWarp: function () {
        var me = this;

        me.labEncodeType = Ext.create('Ext.form.Label', {
            text: RS.$('JSchema_Editor_AfterEncodeType'),
            margin: '0 10 0 0',
            hidden: me.cmbEncodeType.hidden
        });

        me.cmbEncodeType.on({
            show: function () {
                me.labEncodeType.show();
            },
            hide: function () {
                me.labEncodeType.hide();
            }
        });

        if (!me.cmbEncodeType.rendered) {
            me.cmbEncodeType.on({
                single: true,
                afterrender: function () {
                    me.labEncodeType[me.cmbEncodeType.hidden ? 'hide' : 'show']();
                }
            });
        }

        return Ext.create('Ext.form.FieldContainer', Ext.apply({
            fieldLabel: RS.$('JSchema_Editor_LabelEncode'),
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                layout: {
                    type: 'hbox',
                    align: 'center'
                },
                items: [
                    me.chkEncode,
                    { xtype: 'tbfill' },
                    me.labEncodeType,
                    me.cmbEncodeType,
                ]
            }, me.chkEncodeEach]
        }, me.encodeWrap));
    },

    createChildFieldsEditor: function () {
        var me = this;

        return Ext.create('YZSoft.src.form.field.JsonSchemaObjectEditor', Ext.apply({
            labelAlign: 'top',
            maxHeight: 336,
            value: me.schema.type == 'array' ? me.schema.items.properties : me.schema.properties
        }, me.childFieldsEditor));
    },

    createOKButton: function () {
        var me = this;

        return Ext.create('Ext.button.Button', {
            text: RS.$('All_Save'),
            cls: 'yz-btn-default',
            handler: function () {
                var fieldName = Ext.String.trim(me.nameField.getValue() || ''),
                    jsonSchema = me.getJsonSchema(),
                    rv = {};

                if (!fieldName)
                    return;

                rv[fieldName] = jsonSchema;
                me.closeDialog(rv);
            }
        });
    },

    createCancelButton: function () {
        var me = this;

        return Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });
    },

    extraSchemaTypes: function (types) {
        var me = this,
            types = Ext.Array.from(types),
            data = [];

        Ext.each(types, function (typeName) {
            var types1 = me.typeSchemas[typeName] ? me.typeSchemas[typeName] : [typeName];
            types = Ext.Array.union(types, types1);
        });

        Ext.Object.each(me.types, function (typeName, displayName) {
            if (Ext.Array.contains(types, typeName)) {
                data.push({
                    value: typeName,
                    name: displayName
                });
            }
        });

        return data;
    },

    getJsonSchema: function () {
        var me = this,
            type = me.typeField.getValue(),
            isArray = me.isArrayField.checked,
            decodeEnabled = me.chkDecode.checked,
            decodeType = me.cmbDecodeType.getValue(),
            encodeEnabled = me.chkEncode.checked,
            encodeType = me.cmbEncodeType.getValue(),
            encodeEach = me.chkEncodeEach.checked,
            rv;

        switch (type) {
            case 'string':
            case 'number':
            case 'integer':
            case 'boolean':
            case 'number':
                rv = {
                    type: type
                };
                break;
            case 'datetime':
                rv = {
                    type: 'string',
                    format: 'date-time'
                };
                break;
            case 'date':
                rv = {
                    type: 'string',
                    format: 'date'
                };
                break;
            case 'object':
                rv = {
                    type: 'object',
                    properties: me.childFieldsEditor.getValue()
                };
                break;
        }

        if (isArray) {
            rv = {
                type: 'array',
                items: rv
            };
        }

        rv.yzext = Ext.clone(me.schema.yzext);

        if (decodeEnabled)
        {
            rv.yzext = rv.yzext || {};
            rv.yzext.decode = {
                enabled: true,
                type: decodeType
            };
        }
        else {
            if (rv.yzext)
                delete rv.yzext.decode;
        }

        if (encodeEnabled) {
            rv.yzext = rv.yzext || {};
            rv.yzext.encode = {
                enabled: true,
                type: encodeType,
                each: isArray && encodeEach
            };
        }
        else {
            if (rv.yzext)
                delete rv.yzext.encode;
        }

        return rv;
    },

    isDecodeModel: function () {
        var me = this;

        return me.initDecodeWrap && me.initDecodeWrap.hidden === false;
    },

    isEncodeModel: function () {
        var me = this;

        return me.initEncodeWrap && me.initEncodeWrap.hidden === false;
    },

    updateStatus: function () {
        var me = this,
            fieldName = Ext.String.trim(me.nameField.getValue() || ''),
            type = me.typeField.getValue(),
            isArray = me.isArrayField.checked,
            decodeEnabled = me.chkDecode.checked,
            encodeEnabled = me.chkEncode.checked,
            encodeType = me.cmbEncodeType.getValue();

        if (me.isDecodeModel()) {
            me.cmbDecodeType[decodeEnabled ? 'show' : 'hide']();
            me.typeWrap[decodeEnabled ? 'show' : 'hide']();
            me.childFieldsEditor[(decodeEnabled && type == 'object') ? 'show' : 'hide']();
        }
        else if (me.isEncodeModel()) {
            me.cmbEncodeType[encodeEnabled ? 'show' : 'hide']();
            me.typeWrap[encodeEnabled ? 'show' : 'hide']();
            me.chkEncodeEach[(encodeEnabled && isArray) ? 'show' : 'hide']();
            me.childFieldsEditor[(encodeEnabled && type == 'object') ? 'show' : 'hide']();
        }
        else {
            me.childFieldsEditor[type == 'object' ? 'show' : 'hide']();
        }

        me.btnOK.setDisabled(!fieldName);
        me.updateLayout();
    }
});