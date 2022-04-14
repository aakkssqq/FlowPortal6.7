/*
config
property
    columns
*/

Ext.define('YZSoft.report.rpt.dialogs.GridViewDefineDlg', {
    extend: 'Ext.window.Window', //222222
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    width: 850,
    height: 580,
    minWidth: 850,
    minHeight: 580,
    modal: true,
    maximizable: true,
    bodyPadding: '10 26 0 26',
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.edtName = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_Report_ViewName'),
            width: 400
        });

        me.editor = Ext.create('YZSoft.report.rpt.editor.GridViewDefineField', {
            columns: config.columns,
            flex: 1
        });

        me.btnMoveUp = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_MoveUp'),
            store: me.editor.store,
            sm: me.editor.grid.getSelectionModel(),
            updateStatus: function () {
                var recs = this.sm.getSelection();
                this.setDisabled(!me.editor.grid.canMoveUp() || !recs[0].data.Visible);
            },
            handler: function () {
                me.editor.grid.moveSelectionUp();
            }
        });

        me.btnMoveDown = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_MoveDown'),
            store: me.editor.store,
            sm: me.editor.grid.getSelectionModel(),
            margin:'0 0 0 5',
            updateStatus: function () {
                var recs = this.sm.getSelection();
                this.setDisabled(!me.editor.grid.canMoveDown() || !recs[0].data.Visible || !this.store.getAt(this.store.indexOf(recs[0]) + 1).data.Visible);
            },
            handler: function () {
                me.editor.grid.moveSelectionDown();
            }
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                me.closeDialog(me.save());
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [{
                xtype: 'container',
                margin: '0 0 15 0',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                items: [me.edtName, { xtype:'tbfill' }, me.btnMoveUp, me.btnMoveDown]
            }, me.editor],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.value)
            me.fill(config.value);

        me.relayEvents(me.edtName, ['change'], 'item');

        me.on({
            scope: me,
            itemChange: 'updateStatus'
        });

        me.updateStatus();
    },

    fill: function (value) {
        var me = this;

        me.edtName.setValue(value.ViewName);
        me.editor.setValue(value.ColumnInfos);
    },

    save: function () {
        var me = this;

        return {
            ViewName: me.edtName.getValue(),
            ColumnInfos: me.editor.getValue()
        };
    },

    updateStatus: function () {
        var me = this,
            value = me.save();

        me.btnOK.setDisabled(
            !value.ViewName
        );
    }
});