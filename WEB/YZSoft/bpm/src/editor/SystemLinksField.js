/*
config
supportedTypes
*/

Ext.define('YZSoft.bpm.src.editor.SystemLinksField', {
    extend: 'YZSoft.src.form.FieldContainer',

    constructor: function (config) {
        var me = this,
            data = [];

        //转换数据
        Ext.each(config.supportedTypes, function (typeName) {
            data.push({
                SystemLinkType: typeName,
                Enabled: false
            });
        });

        me.store = Ext.create('Ext.data.JsonStore', {
            fields: ['SystemLinkType', 'Enabled', 'ValidationGroup'],
            data: data,
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
            cls:'yz-grid-gray',
            border: true,
            trackMouseOver: false,
            disableSelection: true,
            flex: 1,
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            plugins: [me.cellEditing],
            columns: {
                defaults: {
                },
                items: [
                    { text: RS.$('All_SubmitActionName'), dataIndex: 'SystemLinkType', width: 160, renderer: me.renderType },
                    { xtype: 'checkcolumn', text: RS.$('All_Enable'), dataIndex: 'Enabled', width: 60 },
                    { text: RS.$('All_ValidationGroup'), dataIndex: 'ValidationGroup', flex: 1, renderer: YZSoft.Render.renderString, editor: {
                        allowBlank: true
                    }
                    }
                ]
            }
        });

        var cfg = {
            layout: 'fit',
            bodyStyle: 'background-color:transparent',
            border: false,
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    renderType: function (value) {
        return RS.$('All_Enum_SystemLinkType_' + value);
    },

    setValue: function (value) {
        var me = this,
            value = value || [];

        me.store.each(function (rec) {
            var item = Ext.Array.findBy(value, function (item) {
                if (String.Equ(item.SystemLinkType, rec.data.SystemLinkType))
                    return true;
            });

            if (item) {
                rec.set('Enabled', item.Enabled);
                rec.set('ValidationGroup', item.ValidationGroup);
            }
        });
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            var data = Ext.clone(rec.data);
            delete data.id;
            rv.push(data);
        });
        return rv;
    }
});