/*
method
fill
property:
columns
*/

Ext.define('YZSoft.report.rpt.PropertyPages.Views', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.report.rpt.model.View'
    ],
    referenceHolder: true,
    title: RS.$('All_View'),
    layout: 'border',
    bodyStyle: 'background-color:transparent',
    views: {
        Grid: {
            xclass: 'YZSoft.report.rpt.dialogs.GridViewDefineDlg',
            edit: {
                title: 'Grid - {0}'
            }
        },
        MSChart: {
            xclass: 'YZSoft.report.rpt.dialogs.MSChartViewDefineDlg',
            edit: {
                title: 'MSChart - {0}'
            }
        },
        Excel: {
            xclass: 'YZSoft.report.rpt.dialogs.ExcelViewDefineDlg',
            edit: {
                title: 'Excel - {0}'
            }
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 3
        });

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.report.rpt.model.View',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            border: true,
            selModel: { mode: 'SINGLE' },
            plugins: [me.cellEditing],
            store: me.store,
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            columns: {
                defaults: {
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { text: RS.$('All_Report_ViewName'), dataIndex: 'ViewName', flex: 1, editor: { xtype: 'textfield', allowBlank: false} },
                    { text: RS.$('All_Report_ViewType'), dataIndex: 'ViewType', width: 100 }
                ]
            },
            listeners: {
                itemdblclick: function (grid, record, item, index, e, eOpts) {
                    me.edit(record);
                }
            }
        });

        var menuItems = [];
        Ext.Object.each(me.views, function (viewType, view) {
            var name = Ext.String.format(RS.$('Report_ViewNameFormat'), viewType);

            menuItems.push({
                text: name,
                handler: function (item) {
                    Ext.create(view.xclass, {
                        autoShow: true,
                        title: Ext.String.format(RS.$('Report_ViewProperty_New'), viewType),
                        columns: me.columns,
                        value: {
                            ViewName: me.store.getUniName('ViewName', name, 1),
                            PageItems: 20
                        },
                        fn: function (value) {
                            var data = Ext.apply(value, { ViewType: viewType }),
                                recs = me.store.add(data),
                                sm = me.grid.getSelectionModel();

                            sm.select(recs);
                        }
                    });
                }
            });
        });

        me.btnAdd = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Add'),
            menuAlign:'tr-br?',
            menu: {
                width: 180,
                items: menuItems
            }
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Edit'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canEdit());
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1)
                    me.edit(recs[0]);
            }
        });

        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Remove'),
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

        cfg = {
            items: [{
                xtype: 'label',
                region: 'north',
                text: RS.$('Report_Caption_Views'),
                style: 'display:block',
                margin: '8 0 5 0'
            }, {
                xtype: 'panel',
                region: 'center',
                layout: 'fit',
                items: [me.grid]
            }, {
                xtype: 'panel',
                region: 'east',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
                padding: '0 0 0 10',
                defaults: {
                    padding: '5 10',
                    margin: '0 0 3 0'
                },
                items: [
                    me.btnAdd,
                    me.btnEdit,
                    me.btnDelete,
                    me.btnMoveUp,
                    me.btnMoveDown
                ]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    edit: function (rec) {
        var me = this,
            cfg = me.views[rec.data.ViewType];

        Ext.create(cfg.xclass, {
            autoShow: true,
            title: Ext.String.format(cfg.edit.title, rec.data.ViewName),
            columns: me.columns,
            value: Ext.apply({}, rec.data),
            fn: function (value) {
                Ext.apply(rec.data, value);
                rec.commit();
            }
        });
    },

    fill: function (value) {
        var me = this;

        me.grid.getStore().setData(value);
    },

    save: function () {
        var me = this,
            rv = [];

        me.store.each(function (rec) {
            var v = Ext.apply({}, rec.data);
            rv.push(v);
        });

        return rv;
    }
});