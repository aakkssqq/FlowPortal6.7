/*
config
columns
*/

Ext.define('YZSoft.report.rpt.editor.GridViewDefineField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.report.rpt.model.GridViewColumn'],
    layout: 'fit',
    border: false,

    constructor: function (config) {
        var me = this,
            datas = [],
            columnIndex = 1;

        Ext.each(config.columns, function (column) {
            var data = {
                ColumnIndex: columnIndex++,
                ColumnName: column.ColumnName,
                DisplayName: column.DisplayName,
                Visible: false
            };

            datas.push(data);
        });

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.report.rpt.model.GridViewColumn',
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

        me.editorWidth = {
            xtype: 'numberfield',
            allowDecimals: false,
            listeners: {
                beforeedit: function (context) {
                    return context.record.data.Visible;
                }
            }
        };

        me.edtAlign = {
            xtype: 'combobox',
            store: {
                fields: ['value'],
                data: [
                    { value: 'left' },
                    { value: 'center' },
                    { value: 'right' }
                ]
            },
            queryMode: 'local',
            displayField: 'value',
            valueField: 'value',
            editable: false,
            forceSelection: true,
            listeners: {
                beforeedit: function (context) {
                    return context.record.data.Visible;
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
            columns: {
                defaults: {
                    sortable: false
                },
                items: [
                    { xtype: 'rownumberer' },
                    { text: RS.$('All_TableColumn'), dataIndex: 'ColumnName', width: 140 },
                    { text: RS.$('All_DisplayName'), dataIndex: 'DisplayName', flex: 1 },
                    { xtype: 'checkcolumn', text: RS.$('All_Display'), dataIndex: 'Visible', width: 80, listeners: { scope: me, checkchange: 'onCheckChange'} },
                    { text: RS.$('All_ColumnWidth'), dataIndex: 'Width', width: 120, align: 'center', editor: me.editorWidth },
                    { text: RS.$('All_Align'), dataIndex: 'Align', width: 120, align: 'center', editor: me.edtAlign },
                    { xtype: 'checkcolumn', text: RS.$('All_Group'), dataIndex: 'Group', width: 80 }
                ]
            }
        });

        var cfg = {
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.value)
            me.setValue(config.value);
    },

    setValue: function (value) {
        var me = this;

        value = value || [];
        for (var i = value.length - 1; i >= 0; i--) {
            var item = value[i],
                rec = me.store.getById(item.ColumnName);

            if (rec) {
                me.store.remove(rec);
                Ext.copyTo(rec.data, item, 'Visible,Width,Group,Align');
                me.store.insert(0, rec);
            }
        };
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            var v = Ext.copyTo({}, rec.data, 'ColumnName,Width,Group,Visible,Align');
            if (v.Visible)
                rv.push(v);
        });
        return rv;
    },

    getVisibleColumnInsertPos: function () {
        var me = this,
            pos = me.store.getCount();

        me.store.each(function (rec) {
            if (!rec.data.Visible) {
                pos = me.store.indexOf(rec);
                return false;
            }
        });

        return pos;
    },

    onCheckChange: function (chk, rowIndex, checked, eOpts) {
        var me = this,
            sm = me.grid.getSelectionModel(),
            rec = me.store.getAt(rowIndex);

        if (checked) {
            me.store.remove(rec);

            var saved = rec.data.saved || {
                Width: 100,
                Align: 'left'
            };
            Ext.apply(rec.data, saved);

            me.store.insert(me.getVisibleColumnInsertPos(), rec);
            sm.select(rec);
        }
        else {
            me.store.remove(rec);

            rec.data.saved = Ext.copyTo({}, rec.data, 'Width,Group,Align');
            delete rec.data.Width;
            delete rec.data.Group;
            delete rec.data.Align;

            me.store.insert(Math.max(rec.data.ColumnIndex - 1, me.getVisibleColumnInsertPos()), rec);
        }
    }
});