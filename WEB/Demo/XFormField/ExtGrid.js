
Ext.define('Demo.XFormField.ExtGrid', {
    extend: 'YZSoft.forms.field.ExtJSControl',

    createComponent: function (config) {
        var me = this;

        me.store = Ext.create('Demo.Store.Company', {});

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            store: me.store,
            columns: {
                defaults: {
                    sortable: true
                },
                items: [
                    { text: 'Company', locked: true, width: 200, dataIndex: 'name' },
                    { text: 'Price', lockable: true, width: 95, formatter: 'usMoney', dataIndex: 'price' },
                    { text: 'Change', lockable: true, width: 80, dataIndex: 'change', renderer: function (val) {
                        var out = Ext.util.Format.number(val, '0.00');
                        if (val > 0) {
                            return '<span style="color:' + "#73b51e" + ';">' + out + '</span>';
                        } else if (val < 0) {
                            return '<span style="color:' + "#cf4c35" + ';">' + out + '</span>';
                        }
                        return out;
                    }
                    },
                    { text: '% Change', width: 100, dataIndex: 'pctChange', renderer: function (val) {
                        var out = Ext.util.Format.number(val, '0.00%');
                        if (val > 0) {
                            return '<span style="color:' + "#73b51e" + ';">' + out + '</span>';
                        } else if (val < 0) {
                            return '<span style="color:' + "#cf4c35" + ';">' + out + '</span>';
                        }
                        return out;
                    }
                    },
                    { text: 'Last Updated', width: 115, formatter: 'date("m/d/Y")', dataIndex: 'lastChange' }
                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                displayInfo: true
            })
        }, config));

        return me.grid;
    }
});