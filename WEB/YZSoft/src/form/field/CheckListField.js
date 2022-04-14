/*
config:
columnText
value
{
list array
value array
}
*/
Ext.define('YZSoft.src.form.field.CheckListField', {
    extend: 'YZSoft.src.form.FieldContainer',
    layout: 'fit',
    columnText: '',

    constructor: function (config) {
        var me = this,
            config = config || {},
            columnText = config.columnText || me.columnText;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'Ext.data.Model'
        });

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            store: me.store,
            border: true,
            selModel: { mode: 'SINGLE' },
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            columns: {
                defaults: {
                    sortable: false,
                    menuDisabled: true
                },
                items: [
                    { xtype: 'checkcolumn', dataIndex: 'checked', align: 'center', width: 22 },
                    { text: columnText, dataIndex: 'name', flex: 1, renderer: YZSoft.Render.renderString }
                ]
            }
        }, config.gridConfig || me.gridConfig));

        var cfg = {
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    isEqu: function (list, value) {
        if (String.Equ(list, value))
            return true;
    },

    setValue: function (value) {
        var me = this,
            data = [],
            value = value || { list: [], value: [] };
        
        value.value = value.value || [];

        Ext.each(value.list, function (item) {
            var vitem = Ext.Array.findBy(value.value, function (vitem) {
                if (me.isEqu(item, vitem))
                    return true;
            });

            if (Ext.isString(item))
                item = { value: item };

            data.push(Ext.apply({}, item, {
                checked: vitem ? true : false
            }));
        });

        me.store.removeAll();
        me.store.add(data);
    },

    getValue: function () {
        var me = this,
            data = [];

        me.store.each(function (rec) {
            if (rec.data.checked)
                data.push(rec.data);
        });

        return data;
    }
});