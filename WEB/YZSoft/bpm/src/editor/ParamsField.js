
Ext.define('YZSoft.bpm.src.editor.ParamsField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.bpm.src.model.Parameter'],
    layout: 'fit',

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.Parameter',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', Ext.apply({
            clicksToEdit: 1
        }, config.editPlugin));

        me.editorConfig = {
            xclass: 'YZSoft.src.form.field.CodeField5',
            tables: config.tables,
            listeners: {
                beforeedit: function (context) {
                    this.context = context;
                    this.setValueType(context.record.data.DataTypeName);
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
            plugins: [me.cellEditing],
            disableSelection: true,
            trackMouseOver: false,
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
                    resizable: true
                },
                items: [
                    { text: RS.$('All_Parameter'), dataIndex: 'ParamName', width: 160, renderer: YZSoft.Render.renderString },
                    { text: RS.$('All_Type'), dataIndex: 'DataTypeName', width: 120, renderer: YZSoft.Render.renderString },
                    { text: RS.$('All_FillWith'), dataIndex: 'ValueExpress', flex: 1, renderer: YZSoft.Render.renderCode5, editor: me.editorConfig }
                ]
            }
        });

        var cfg = {
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onCheckChange: function (column, rowIndex, checked, eOpts) {
        var me = this,
            rec = me.store.getAt(rowIndex);

        if (checked)
            rec.set(me.map[column.dataIndex], false);

        this.fireEvent('checkchange');
    },

    clear:function(){
        this.store.removeAll();
    },

    setParams: function (params) {
        var me = this,
            data = [];

        me.store.removeAll();
        Ext.each(params, function (param) {
            data.push(Ext.copyTo({ tag: param }, param, 'ParamName,DataTypeName,ValueExpress'));
        });
        me.store.add(data);
    },

    setValue: function (params) {
        var me = this;

        for (var i = 0; i < params.length && i < me.store.getCount(); i++) {
            var param = params[i];
            me.store.getAt(i).set('ValueExpress', param.ValueExpress);
        }
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            Ext.apply(rec.data.tag, {
                ValueExpress: rec.data.ValueExpress
            });

            rv.push(rec.data.tag);
        });
        return rv;
    }
});