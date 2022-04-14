/*
config
    tables
    stepNames
*/

Ext.define('YZSoft.bpm.src.editor.ParticipantField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.bpm.src.model.Participant'],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    border: false,
    map: {
        Include: 'Exclude',
        Exclude: 'Include'
    },

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.Participant',
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
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            columns: {
                defaults: {
                },
                items: [
                    { text: RS.$('All_Participant'), dataIndex: 'RuntimeDisplayString', width: 200, renderer: YZSoft.Render.renderString },
                    { xtype: 'checkcolumn', text: RS.$('All_Include'), dataIndex: 'Include', width: 60, listeners: { scope: me, checkchange: me.onCheckChange} },
                    { text: RS.$('All_Code'), dataIndex: 'Express', flex: 1, renderer: me.renderCode }
                ]
            },
            listeners: {
                rowdblclick: function (grid, rec) {
                    me.edit(rec);
                }
            }
        });

        me.btnAdd = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Add'),
            handler: function () {
                Ext.create('YZSoft.bpm.src.dialogs.ParticipantDlg', {
                    autoShow: true,
                    title: RS.$('All_SelectParticipant'),
                    tables: me.tables,
                    stepNames: me.stepNames,
                    fn: function (recp) {
                        me.grid.addRecords(recp);
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
                if (recs.length != 1)
                    return;

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
            margin: 0,
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
                margin: '0 0 2 0'
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
            items: [me.grid, me.panel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            tablesChanged: function (tables) {
                me.tables = tables;
            }
        });
    },

    onCheckChange: function (column, rowIndex, checked, eOpts) {
        var me = this,
            rec = me.store.getAt(rowIndex);

        if (checked)
            rec.set(me.map[column.dataIndex], false);

        this.fireEvent('checkchange');
    },

    addRecords: function (datas) {
        var me = this;

        if (!datas)
            return;

        if (!Ext.isArray(datas))
            datas = [datas];

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Participant.ashx'),
            params: { method: 'CheckParticipant' },
            jsonData: datas,
            success: function (action) {
                var recps = action.result,
                    datas = [];

                Ext.each(recps, function (recp) {
                    if (recp.IsValid)
                        datas.push(recp);
                });

                me.grid.addRecords(datas);
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
            }
        });
    },

    edit: function (rec) {
        var me = this;

        Ext.create('YZSoft.bpm.src.dialogs.ParticipantDlg', {
            autoShow: true,
            title: RS.$('All_SelectParticipant'),
            tables: me.tables,
            stepNames: me.stepNames,
            recp: rec,
            fn: function (recp) {
                rec.data = recp;
                rec.commit();
            }
        });
    },

    renderCode: function (value) {
        return YZSoft.HttpUtility.htmlEncode(Ext.String.ellipsis(value, 100), false);
    },

    setValue: function (value) {
        this.addRecords(value);
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            rv.push(rec.data);
        });
        return rv;
    }
});