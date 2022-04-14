/*
config
    params
    value
*/

Ext.define('YZSoft.src.datasource.field.ExecuteParams', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.src.datasource.model.DSParamExecute'],
    layout: 'fit',
    border: false,

    constructor: function (config) {
        var me = this,
            datas = [],
            cfg;

        Ext.each(config.params, function (param) {
            datas.push({
                name: param.name
            });
        });

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.src.datasource.model.DSParamExecute',
            data: datas,
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

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
                { text: RS.$('All_Parameter'), dataIndex: 'name', width: 170 },
                { text: RS.$('All_Value'), dataIndex: 'value', flex: 1, editor: { xtype: 'textfield' }}
            ]
        });

        cfg = {
            bodyStyle: 'background-color:transparent',
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.value)
            me.setValue(config.value);
    },

    setValue: function (value) {
        var me = this;

        me.store.each(function (rec) {
            var paramitem = Ext.Array.findBy(value, function (paramitem) {
                return String.Equ(paramitem.name,rec.data.name);
            });

            if (paramitem) {
                rec.set('value', paramitem.value);
           }
        });
    },

    getValue: function () {
        var me = this,
            rv = [];
      
        me.store.each(function (rec) {
            var v = Ext.apply({}, rec.data);

            v.op = v.op || '=';
            v.value = Ext.isEmpty(v.value) ? null : v.value;
            rv.push(v);
        });

        return rv;
    }
});