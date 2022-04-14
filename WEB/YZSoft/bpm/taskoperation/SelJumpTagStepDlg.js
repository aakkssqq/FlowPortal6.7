/*
taskid
*/

Ext.define('YZSoft.bpm.taskoperation.SelJumpTagStepDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpm.src.model.JumpToStep'
    ],
    layout: 'fit',
    width: 800,
    height: 500,
    modal: true,
    resizable: false,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.JumpToStep',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Task.ashx'),
                extraParams: { method: 'GetJumpTagSteps', taskid: config.taskid },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            title: RS.$('TaskOpt_Jump_Tag'),
            store: me.store,
            selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'SINGLE' }),
            columns: {
                defaults: {
                    sortable: true,
                    hideable: true,
                    menuDisabled: false
                },
                items: [
                    { text: RS.$('All_StepName'), dataIndex: 'NodeName', align: 'left', flex: 1, renderer: YZSoft.Render.renderString }
                ]
            },
            listeners: {
                itemdblclick: function (grid, record, item, index, e, eOpts) {
                    me.closeDialog([record.data]);
                }
            }
        }, config.grid));
        delete config.grid;

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: config.btnText || RS.$('All_OK'),
            cls:'yz-btn-default',
            disabled: true,
            store: me.grid.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnableNoPerm(me.grid, me.grid.allowEmptySelection ? 0:1, -1));
            },
            handler: function () {
                var sm = me.grid.getSelectionModel(),
                    recs = sm.getSelection(),
                    rv = [];

                Ext.each(recs, function (v) {
                    rv.push(v.data);
                });

                me.closeDialog(rv);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            scope: this,
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.grid],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    afterRender: function () {
        this.callParent(arguments);
        this.store.load({ loadMask: false });
    }
});