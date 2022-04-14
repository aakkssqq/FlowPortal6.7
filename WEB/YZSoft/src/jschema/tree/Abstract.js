/*
*/
Ext.define('YZSoft.src.jschema.tree.Abstract', {
    extend: 'Ext.tree.Panel',
    animate: false,
    bufferedRenderer: false,
    border: false,
    rootVisible: false,
    useArrows: true,
    hideHeaders: true,
    width: 300,
    onItemContextMenu: Ext.emptyFn,
    onItemDblClick: Ext.emptyFn,
    config: {
        schema: null
    },
    viewConfig: {
        padding: '10 0'
    },
    designer: null,
    sprite: null,
    variables: false,
    isTagTree: false,
    glyphs: {
        edit: 0xeae8,
        $delete: 0xe64d,
        clearMap: 0xeb39,
        import: 0xeb16,
        addMasterTableReference: 0xeb0d,
        addDetailTableReference: 0xeb0d
    },

    constructor: function (config) {
        this.callParent(arguments);
        this.addCls('yz-tree-jsonschema');
    },

    initComponent: function () {
        var me = this;

        me.store = Ext.create('YZSoft.src.jschema.data.Store', {
            root: me.getSchema()
        });

        me.callParent();

        me.on({
            scope: me,
            itemcontextmenu: 'onItemContextMenuExt',
            containercontextmenu: 'onContainerContextMenu',
            itemdblclick: 'onItemDblClick'
        });

        me.relayEvents(me.store, ['datachanged'], 'store');

        if (me.variables) {
            me.mon(me.designer,{
                variableschanged: function (tree, variables) {
                    if (tree != me)
                        me.onVariablesChanged(variables);
                }
            });
        }

        me.initialized = true;
    },

    getVariablesRecord: function () {
        var me = this,
            index;

        index = me.store.findBy(function (record) {
            return record.is('variables');
        });

        if (index != -1)
            return me.store.getAt(index);
    },

    getLocalVariablesRecord: function () {
        var me = this,
            index;

        index = me.store.findBy(function (record) {
            return record.is('localVariables');
        });

        if (index != -1)
            return me.store.getAt(index);
    },

    onVariablesChanged: function (variables) {
        var me = this,
            record = me.getVariablesRecord();

        record && me.replaceSchema(record, {
            Variables: variables
        }, {
            silence: true
        });
    },

    updateLocalVariables: function () {
        var me = this,
            isTagTree = me.isTagTree,
            record = me.getLocalVariablesRecord(),
            designer = me.designer,
            sprite = me.sprite,
            localVariables = designer && designer.getLocalVariables(sprite, isTagTree);

        record && me.replaceSchema(record, {
            SystemVariables: localVariables
        }, {
            silence: true
        });
    },

    onItemContextMenuExt: function (view, record, item, index, e, eOpts) {
        var me = this;

        if (record.is('variables')) {
            me.onVariablesContextMenu(view, record, item, index, e, eOpts);
            return;
        }
        else if (record.isChildOf('variables')) {
            me.onVariablesChildContextMenu(view, record, item, index, e, eOpts);
            return;
        }
        else if (record.is('localVariables')) {
            me.onLocalVariablesContextMenu(view, record, item, index, e, eOpts);
            return;
        }
        else if (record.isChildOf('localVariables')) {
            me.onLocalVariablesChildContextMenu(view, record, item, index, e, eOpts);
            return;
        }

        me.onItemContextMenu(view, record, item, index, e, eOpts);
    },

    onContainerContextMenu: function (view, e, eOpts) {
        e.stopEvent();
    },

    onVariablesContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            isTagTree = me.isTagTree,
            menu, items;

        e.stopEvent();

        menu = {
            edit: {
                glyph: me.glyphs.edit,
                text: RS.$('All_Edit'),
                handler: function () {
                    me.editVariables(record);
                }
            },
            clearMap: {
                glyph: me.glyphs.clearMap,
                text: RS.$('ESB_ClearMap'),
                handler: function () {
                    me.clearMapByToRecord(record);
                }
            }
        };

        if (isTagTree) {
            items = [
                menu.edit,
                menu.clearMap
            ]
        }
        else {
            items = [
                menu.edit
            ]
        }

        me.showMenu(e, items);
    },

    onVariablesChildContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            isTagTree = me.isTagTree,
            menu, items;

        e.stopEvent();

        menu = {
            edit: {
                glyph: me.glyphs.edit,
                text: RS.$('All_Edit'),
                handler: function () {
                    me.editVariablesChild(record);
                }
            },
            $delete: {
                glyph: me.glyphs.$delete,
                text: RS.$('All_Delete'),
                handler: function () {
                    me.deleteRecord(record);
                }
            },
            clearMap: {
                glyph: me.glyphs.clearMap,
                text: RS.$('ESB_ClearMap'),
                handler: function () {
                    me.clearMapByToRecord(record);
                }
            }
        };

        if (isTagTree) {
            items = [
                menu.edit,
                menu.$delete,
                '-',
                menu.clearMap
            ]
        }
        else {
            items = [
                menu.edit,
                menu.$delete
            ]
        }

        me.showMenu(e, items);
    },

    onLocalVariablesContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            isTagTree = me.isTagTree,
            menu, items;

        e.stopEvent();

        menu = {
            denyEdit: {
                glyph: me.glyphs.edit,
                text: RS.$('All_Edit'),
                disabled: true,
                handler: function () {
                    me.editVariables(record);
                }
            },
            clearMap: {
                glyph: me.glyphs.clearMap,
                text: RS.$('ESB_ClearMap'),
                handler: function () {
                    me.clearMapByToRecord(record);
                }
            }
        };

        if (isTagTree) {
            items = [
                menu.denyEdit,
                menu.clearMap
            ]
        }
        else {
            items = [
                menu.denyEdit
            ]
        }

        me.showMenu(e, items);
    },

    onLocalVariablesChildContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            isTagTree = me.isTagTree,
            menu, items;

        e.stopEvent();

        menu = {
            denyEdit: {
                glyph: me.glyphs.edit,
                text: RS.$('All_Edit'),
                disabled: true,
                handler: function () {
                    me.editVariablesChild(record);
                }
            },
            clearMap: {
                glyph: me.glyphs.clearMap,
                text: RS.$('ESB_ClearMap'),
                handler: function () {
                    me.clearMapByToRecord(record);
                }
            }
        };

        if (isTagTree) {
            items = [
                menu.denyEdit,
                menu.clearMap
            ]
        }
        else {
            items = [
                menu.denyEdit
            ]
        }

        me.showMenu(e, items);
    },

    editVariables: function (record) {
        var me = this;

        me.editComplexField(record, {
            title: RS.$('ESB_SchameEditDlg_Title_Variables'),
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
                types: ['jschema', 'object'],
                margin: '0 0 10 0',
                childFieldColumnName: RS.$('JSchema_ChildFieldColumnName')
            }
        });
    },

    editVariablesChild: function (record) {
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
    },

    findChildProperty: function (record, propertyName) {
        return Ext.Array.findBy(record.childNodes, function (crec) {
            return crec.data.propertyName == propertyName;
        });
    },

    clearMapByToRecord: function (record) {
        this.fireEvent('clearlink', record);
    },

    getMasterTableReferenceJSchame: function (datasourceName, tableName) {
        return {
            type: 'object',
            yzext: {
                reference: {
                    type: 'masterTable',
                    datasourceName: datasourceName,
                    tableName: tableName
                }
            },
            properties: {
            }
        }
    },

    getDetailTableReferenceJSchame: function (datasourceName, tableName) {
        return {
            type: 'array',
            yzext: {
                reference: {
                    type: 'detailTable',
                    datasourceName: datasourceName,
                    tableName: tableName
                }
            },
            items: {
                type: 'object'
            }
        }
    },

    applySchema: function (value) {
        var me = this,
            isTagTree = me.isTagTree,
            designer = me.designer,
            sprite = me.sprite,
            variables = designer && designer.getVariables(),
            localVariables = designer && designer.getLocalVariables(sprite, isTagTree),
            schema = {};

        if (value)
            delete value.Variables;

        if (me.variables) {
            schema = Ext.apply(schema, {
                Variables: variables
            });
        }

        if (value)
            delete value.SystemVariables;

        if (me.localVariables) {
            schema = Ext.apply(schema, {
                SystemVariables: localVariables
            });
        }

        schema = Ext.applyIf(schema, value);

        return {
            propertyName: RS.$('All_Root_Simple'),
            expanded: true,
            type: 'object',
            title: 'schema',
            properties: schema || {}
        };
    },

    updateSchema: function (value) {
        var me = this;

        me.store && me.store.setRoot(value);
        me.fireEvent('updateschema');
        if (me.initialized)
            me.fireEvent('schemachanged', me, me.store);
    },

    deleteRecord: function (record) {
        var me = this;

        //me.getStore().remove(record); //不能删除子项
        record.parentNode.removeChild(record, false);
        me.fireEvent('yzrecordremove', me, record);
        record.destroy();

        me.fireEvent('schemachanged', me, me.store);
    },

    replaceSchema: function (record, newSchema, config) {
        config = config || {};

        var me = this,
            store = me.getStore(),
            silence = config.silence,
            fn =  config.fn,
            result;

        result = store.getProxy().getReader().read({
            type: 'object',
            properties: newSchema
        });

        records = result.getRecords();
        success = result.getSuccess();

        if (success && records.length) {
            record.parentNode.replaceChild(records[0], record);

            if (silence !== true)
                me.fireEvent('schemachanged', me, me.store);

            fn && fn(records[0]);
        }
    },

    appendSchema: function (record, newSchema) {
        var me = this,
            store = me.getStore(),
            result;

        result = store.getProxy().getReader().read({
            type: 'object',
            properties: newSchema
        });

        records = result.getRecords();
        success = result.getSuccess();

        if (success) {
            Ext.each(records, function (r) {
                record.appendChild(r);
            });

            record.expand();
            me.fireEvent('schemachanged', me, me.store);
        }
    },

    addDetailTableReference: function (record, tables, options) {
        var me = this,
            tables = Ext.Array.from(tables),
            schema = {},
            existNames = [];

        Ext.each(tables, function (table) {
            if (me.findChildProperty(record, table.TableName)) {
                existNames.push(table.TableName);
                return;
            }

            schema[table.TableName] = me.getDetailTableReferenceJSchame(table.DataSourceName, table.TableName);
        });

        if (!Ext.Object.isEmpty(schema)) {
            me.appendSchema(record, schema);
            me.fireEvent('schemachanged', me, me.store);
        }

        if (existNames.length)
            YZSoft.alert(Ext.String.format(RS.$('All_JSchema_SamePropertyExist'), existNames.join(RS.$('All_Caesura'))));
    },

    addMasterTableReference: function (record, tables, options) {
        var me = this,
            tables = Ext.Array.from(tables),
            schema = {},
            existNames = [];

        Ext.each(tables, function (table) {
            if (me.findChildProperty(record, table.TableName)) {
                existNames.push(table.TableName);
                return;
            }

            schema[table.TableName] = me.getMasterTableReferenceJSchame(table.DataSourceName, table.TableName);
        });

        if (!Ext.Object.isEmpty(schema)) {
            me.appendSchema(record, schema);
            me.fireEvent('schemachanged', me, me.store);
        }

        if (existNames.length)
            YZSoft.alert(Ext.String.format(RS.$('All_JSchema_SamePropertyExist'), existNames.join(RS.$('All_Caesura'))));
    },

    editSimpleField: function (record, config) {
        var me = this,
            propertyName = record.data.propertyName,
            schema = record.save(),
            before = config && config.before,
            saved = config && config.saved,
            fn = config && config.fn,
            dlg;

        before && before(schema);
        dlg = Ext.create('YZSoft.src.jschema.editdlg.Simple', Ext.apply({
            title: Ext.String.format(RS.$('All_PropertyOf'), record.getMemberPath().join('.')),
            autoShow: true,
            autoClose: false,
            propertyName: propertyName,
            schema: schema
        }, {
        fn: function (schema) {
            Ext.Object.eachValue(schema, function (realSchema) {
                saved && saved(realSchema);
            });

            if (me.replaceSchema(record, schema, {
                fn: function (newrecord) {
                    newrecord.getOwnerTree().getSelectionModel().select(newrecord);
                    fn && fn(newrecord);
                }
            }) !== false) {
                dlg.close();
            }
        }}, config));
    },

    editComplexField: function (record, config) {
        var me = this,
            propertyName = record.data.propertyName,
            schema = record.save(),
            before = config && config.before,
            saved = config && config.saved,
            fn = config && config.fn,
            dlg;

        before && before(schema);

        dlg = Ext.create('YZSoft.src.jschema.editdlg.Complex', Ext.apply({
            title: Ext.String.format(RS.$('All_PropertyOf'), record.getMemberPath().join('.')),
            autoShow: true,
            autoClose: false,
            propertyName: propertyName,
            schema: schema
        }, {
        fn: function (schema) {
            Ext.Object.eachValue(schema, function (realSchema) {
                saved && saved(realSchema);
            });

            if (me.replaceSchema(record, schema, {
                fn: function (newrecord) {
                    newrecord.getOwnerTree().getSelectionModel().select(newrecord);
                    fn && fn(newrecord);
                }
            }) !== false) {
                dlg.close();
            }
        }}, config));
    },

    editDataSet: function (record, title) {
        var me = this;

        me.editComplexField(record, {
            title: title || '数据集',
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
                typeColumn: {
                    hidden: true
                },
                arrayColumn: {
                    hidden: true
                },
                defaultRecord: {
                    type: 'object',
                    isArray: true
                },
                margin: '0 0 10 0',
                childFieldColumnName: '子表'
            },
            saved: function (schema) {
                Ext.Object.each(schema.properties, function(name, value){
                    value.yzext = {
                        isDataTable: true
                    };
                });
            }
        });
    },

    editDataTable: function (record, title) {
        var me = this;

        me.editComplexField(record, {
            title: title || '编辑表',
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
                childFieldColumnName: '字段'
            }
        });
    },

    saveSchema: function () {
        var me = this,
            store = me.getStore(),
            root = store.getRoot(),
            schema = root.save().properties,
            designer = me.designer,
            variables;

        if (me.variables) {
            variables = schema.Variables;
            delete schema.Variables;
            designer.setVariables(me, variables);
        }

        return schema;
    },

    importSchema: function (record) {
        var me = this,
            schema;

        Ext.create('YZSoft.src.jschema.editdlg.Import', {
            autoShow: true,
            fn: function (data) {
                data.yzext = Ext.clone(record.data.yzext);

                schame = {};
                schame[record.data.propertyName] = data;

                me.replaceSchema(record, schame);
            }
        });
    },

    showMenu: function (e, items) {
        var me = this,
            menu;

        if (!items || !items.length)
            return;

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            defaults: {
                clickHideDelay: 0
            },
            items: items,
            listeners: {
                hide: function (menu) {
                    //menu.destroy();
                }
            }
        });

        menu.showAt(e.getXY());
        menu.focus();
    }
});