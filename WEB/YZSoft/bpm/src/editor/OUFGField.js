
Ext.define('YZSoft.bpm.src.editor.OUFGField', {
    extend: 'YZSoft.src.form.field.CheckListField',
    gridConfig: {
        columns: {
            defaults: {
                sortable: false,
                menuDisabled: true
            },
            items: [
                { xtype: 'checkcolumn', dataIndex: 'checked', align: 'center', width: 30 },
                { text: RS.$('All_OU'), dataIndex: 'Name', flex: 1, renderer: YZSoft.Render.renderString }
            ]
        }
    },

    isEqu: function (list, value) {
        return String.Equ(list.Name, value);
    },

    getValue: function () {
        var value = this.callParent(arguments),
            rv = [];

        Ext.each(value, function (item) {
            rv.push(item.FullName);
        });

        return rv;
    }
});