/*
config
    params
    srcParams
    value
*/

Ext.define('YZSoft.report.rpt.editor.ParamsFillField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.report.rpt.model.ParamFill'],
    layout: 'fit',
    border: false,

    constructor: function (config) {
        var me = this,
            datas = [];

        Ext.each(config.params, function (paramName) {
            var data = {
                Name: paramName
            };

            datas.push(data);
        });

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.report.rpt.model.ParamFill',
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
                { text: RS.$('All_Parameter'), dataIndex: 'Name', width: 170 },
                { text: RS.$('All_FillWith'), dataIndex: 'FillWith', flex: 1, editor: {
                    xtype: 'combobox',
                    store: {
                        fields: ['name', 'value'],
                        data: config.srcParams
                    },
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value',
                    editable: true,
                    forceSelection: false
                }
                }
            ]
        });

        var cfg = {
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
            var fillItem = Ext.Array.findBy(value, function (fillItem) {
                return fillItem.Name == rec.data.Name;
            });

            if (fillItem)
                rec.set('FillWith', fillItem.FillWith);
        });
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            var v = Ext.apply({}, rec.data);
            if (v.FillWith)
                rv.push(v);
        });
        return rv;
    }
});