
Ext.define('YZSoft.report.rpt.editor.MSChartViewSeriesField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: [
        'YZSoft.report.rpt.model.MSChartSeries',
        'YZSoft.src.grid.column.Color'
    ],
    colorSeries:[
        '#00ff80',
        '#0080ff',
        '#8000ff',
        '#80ff00',
        '#ff0080',
        '#ff8000'
    ],

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.report.rpt.model.MSChartSeries',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        me.editorColumn = {
            xtype: 'combobox',
            store: {
                fields: ['ColumnName'],
                data: config.columns
            },
            queryMode: 'local',
            displayField: 'ColumnName',
            valueField: 'ColumnName',
            editable: false,
            forceSelection: true
        };

        me.editorColor = {
            xclass: 'Ext.ux.colorpick.Field',
            cls:['x-colorpicker-field','yz-color-picker-field'],
            format: '#HEX6',
            editable: true
        };

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            border: true,
            viewConfig: {
                markDirty: false
            },
            flex: 1,
            height: 238,
            selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'SIMPLE' }),
            plugins: [me.cellEditing],
            defaults: {
                //renderer: YZSoft.Render.renderString
            },
            columns: [
                { text: RS.$('All_SeriesName'), dataIndex: 'Name', width: 80, editor: { allowBlank: false} },
                { text: RS.$('All_Report_DataColumnName'), dataIndex: 'DataColumnName', width: 120, editor: me.editorColumn },
                { xtype: 'yzcolorcolumn', text: RS.$('All_Color'), dataIndex: 'Color', flex: 1, editor: me.editorColor },
                { text: RS.$('All_Unit'), dataIndex: 'Unit', width: 100, editor: { allowBlank: true} }
            ]
        });

        me.btnAdd = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Add'),
            handler: function () {
                var count = me.store.getCount(),
                    rec;
                    
                rec = me.grid.addRecords({
                    Color: me.colorSeries[count] || me.colorSeries[0]
                })[0];
                me.cellEditing.startEdit(rec, 1);
            }
        });

        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Delete'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canDelete());
            },
            handler: function () {
                me.grid.removeAllSelection();
            }
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
                margin: '0 0 3 0'
            },
            items: [
                me.btnAdd,
                me.btnDelete,
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

    setValue: function (value) {
        this.grid.addRecords(value, false);
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            var v = Ext.apply({}, rec.data);
            delete v.id;
            rv.push(v);
        });
        return rv;
    }
});