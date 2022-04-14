
Ext.define('YZSoft.report.rpt.editor.QueryParamsField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.report.rpt.model.QueryParameter'],

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.report.rpt.model.QueryParameter',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        me.editorDefaultValue = {
            xclass: 'YZSoft.src.form.field.CodeField5',
            dlgConfig: {
                stepOwner: false,
                agentUser: false,
                taskInitiator: false,
                dayofweek: false,
                formfields: false
            },
            listeners: {
                beforeedit: function (context) {
                    this.context = context;
                    this.setValueType(context.record.data.DataType);
                },
                selected: function (value) {
                    me.cellEditing.cancelEdit();
                    this.context.record.set(this.context.column.dataIndex, value);
                    me.cellEditing.startEdit(this.context.record, this.context.column);
                }
            }
        };

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            border: true,
            viewConfig: {
                markDirty: false
            },
            flex: 1,
            height: 238,
            plugins: [me.cellEditing],
            defaults: {
                renderer: YZSoft.Render.renderString
            },
            columns: [
                { xtype: 'rownumberer' },
                { text: RS.$('All_Parameter'), dataIndex: 'Name', width: 120 },
                { text: RS.$('All_Type'), dataIndex: 'DataType', width: 80, formatter: 'dataType', editor: {
                    xtype: 'combobox',
                    store: Ext.create('YZSoft.src.store.DataTypeSimpleStore'),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value',
                    editable: false,
                    forceSelection: true,
                    value2Record: function (cmb, value) {
                        var rv = null;

                        value = value || { name:'String', fullName:'System.String' };
                        cmb.getStore().each(function (rec) {
                            if (rec.data.value.fullName == value.fullName) {
                                rv = rec;
                                return false;
                            }
                        });

                        return rv;
                    }
                }
                },
                { text: RS.$('All_DisplayName'), dataIndex: 'DisplayName', flex: 1, editor: { allowBlank: true} },
                { text: RS.$('All_InitValue'), dataIndex: 'DefaultValue', flex: 1, renderer: YZSoft.Render.renderCode5, editor: me.editorDefaultValue },
                { text: RS.$('All_Desc'), dataIndex: 'Description', hidden: true, flex: 1, editor: { allowBlank: true} },
                { text: RS.$('Report_ParamInputType'), dataIndex: 'ParameterUIBindType', width: 100, editor: {
                    xtype: 'combobox',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            { name: 'Normal', value: 'Normal' },
                            { name: 'StartDate', value: 'StartDate' },
                            { name: 'EndDate', value: 'EndDate' },
                            { name: 'Internal', value: 'Internal' },
                            { name: 'Hidden', value: 'Hidden' }
                        ]
                    },
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value',
                    editable: false,
                    forceSelection: true
                }
                }
            ]
        });

        me.btnMoveUp = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_MoveUp'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canMoveUp());
            },
            handler: function () {
                me.grid.moveSelectionUp();
            }
        });

        me.btnMoveDown = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_MoveDown'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canMoveDown());
            },
            handler: function () {
                me.grid.moveSelectionDown();
            }
        });

        me.panel = Ext.create('Ext.panel.Panel', {
            width: 'auto',
            bodyStyle: 'background-color:transparent',
            padding: '0 0 0 10',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            border: false,
            defaults: { 
                padding: '5 10',
                margin: '0 0 3 0',
                minWidth: 78
            },
            items: [
                me.btnMoveUp,
                me.btnMoveDown
            ]
        });

        var cfg = {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            bodyStyle: 'background-color:transparent',
            border: false,
            items: [me.grid, me.panel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    setParams: function (paramNames) {
        var me = this;

        //remove
        var rms = []
        me.store.each(function (rec) {
            if (!Ext.Array.contains(paramNames, rec.data.Name))
                rms.push(rec);
        });
        me.store.remove(rms);

        //add
        Ext.each(paramNames, function (paramName) {
            if (!me.store.getById(paramName)) {
                me.store.add({
                    Name: paramName,
                    DataType: null,
                    DisplayName: null,
                    Description: null,
                    ParameterUIBindType: 'Normal'
                });
            }
        });
    },

    setValue: function (value) {
        this.grid.addRecords(value, false);
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            var v = Ext.apply({}, rec.data);
            rv.push(v);
        });
        return rv;
    }
});