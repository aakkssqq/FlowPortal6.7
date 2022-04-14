/*
config
interfaceStepNames
*/

Ext.define('YZSoft.bpm.src.editor.CallInterfaceTargetField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.bpm.src.model.CallInterfaceTarget'],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this;

        config.buttons = config.buttons || {};

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.CallInterfaceTarget',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            border: true,
            flex: 1,
            selModel: { mode: 'SINGLE' },
            columns: {
                defaults: {
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { text: RS.$('All_CallServer'), dataIndex: 'ElementType', flex: 2, scope: me, renderer: 'renderServer' },
                    { text: RS.$('All_CallInterface'), dataIndex: 'InterfaceName', flex: 1 }
                ]
            },
            listeners: {
                itemdblclick: function (grid, record) {
                    me.edit(record);
                }
            }
        });

        me.btnAdd = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Add'),
            handler: function () {
                Ext.create('YZSoft.bpm.src.dialogs.SelInterfaceDlg', {
                    autoShow: true,
                    title: RS.$('Process_Title_SettingCallTarger'),
                    interfaceStepNames: me.interfaceStepNames,
                    fn: function (data) {
                        me.grid.addRecords(data);
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

        me.panel = Ext.create('Ext.container.Container', {
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
                me.btnEdit,
                me.btnDelete,
                me.btnMoveUp,
                me.btnMoveDown
            ]
        });

        var cfg = {
            bodyStyle: 'background-color:transparent',
            border: false,
            items: [me.grid, me.panel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    edit: function (rec) {
        var me = this;

        Ext.create('YZSoft.bpm.src.dialogs.SelInterfaceDlg', {
            autoShow: true,
            title: RS.$('Process_Title_SettingCallTarger'),
            interfaceStepNames: me.interfaceStepNames,
            value: Ext.apply({}, rec.data),
            fn: function (data) {
                Ext.apply(rec.data, data);
                rec.commit();
            }
        });
    },

    renderServer: function (value, metaData, rec) {
        switch (rec.data.ElementType) {
            case 'ServerName':
                return rec.data.SParam1;
            case 'SameAsStep':
                return Ext.String.format(RS.$('Process_SameAsStep'), rec.data.SParam1);
            case 'TriggerTask':
                return RS.$('Process_ServerTriggerTheTask');
        }
    },

    setValue: function (value) {
        this.grid.addRecords(value, false);
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            rv.push(rec.data);
        });
        return rv;
    }
});