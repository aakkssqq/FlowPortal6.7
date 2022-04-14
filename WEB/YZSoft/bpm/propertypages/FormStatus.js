/*
method
fill
*/

Ext.define('YZSoft.bpm.propertypages.FormStatus', {
    extend: 'Ext.panel.Panel',
    referenceHolder: true,
    title: RS.$('FormService_Title_FormStatus'),
    layout: 'border',
    bodyStyle: 'background-color:transparent',

    constructor: function (config) {
        var me = this,
            cfg;

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 3
        });

        me.store = Ext.create('Ext.data.JsonStore', {
            fields: ['Name'],
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
                    { text: RS.$('All_Name'), dataIndex: 'Name', flex: 1, editor: { xtype: 'textfield', allowBlank: false} }
                ]
            },
            listeners: {
                itemdblclick: function (grid, record, item, index, e, eOpts) {
                    me.edit(record);
                }
            }
        });

        me.btnAdd = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Add'),
            handler: function () {
                Ext.create('YZSoft.app.formservice.FormStateDlg', {
                    autoShow: true,
                    title: RS.$('FormService_Title_NewFormState'),
                    tables: me.commondata.TableIdentitys,
                    value: {
                        ControlDataSet: {
                            Tables: []
                        },
                        Events: []
                    },
                    fn: function (value) {
                        var data, recs, sm;

                        data = Ext.apply(value, {
                            Name: me.store.getUniName('Name', RS.$('FormService_Prefix_FormState'), 1)
                        });

                        rec = me.store.add(value)[0];
                        sm = me.grid.getSelectionModel();

                        sm.select(rec);
                        me.cellEditing.startEdit(rec, 0);
                    }
                });
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
                text: RS.$('FormService_FormState') + ':',
                style: 'display:block',
                margin: '0 0 6 0'
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
                    pack: 'start',
                    align: 'stretch'
                },
                border: false,
                padding: '0 0 0 10',
                bodyStyle: 'background-color:transparent',
                defaults: {
                    padding: '5 10',
                    margin: '0 0 3 0',
                    minWidth: 76
                },
                items: [
                    me.btnAdd,
                    me.btnEdit,
                    me.btnDelete,
                    me.btnMoveUp,
                    me.btnMoveDown]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    edit: function (rec) {
        var me = this;

        Ext.create('YZSoft.app.formservice.FormStateDlg', {
            autoShow: true,
            title: Ext.String.format('{0} - {1}', RS.$('FormService_FormState'), rec.data.Name),
            tables: me.commondata.TableIdentitys,
            value: Ext.apply({}, rec.data),
            fn: function (value) {
                Ext.apply(rec.data, value);
            }
        });
    },

    fill: function (value) {
        var me = this;

        me.grid.getStore().add(value);
    },

    save: function () {
        var me = this,
            value = [];

        me.store.each(function (rec) {
            value.push(Ext.copyTo({}, rec.data, [
                'Name',
                'ShowSaveButton',
                'ValidationGroup',
                'ControlDataSet',
                'Events'
            ]));
        });

        return value;
    }
});