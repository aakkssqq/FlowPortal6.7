/*
grid :{} config
*/

Ext.define('YZSoft.bpm.taskoperation.SelTaskStepDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpm.src.grid.TaskSteps',
        'YZSoft.src.button.Button'
    ],
    layout: 'fit',
    width: 800,
    height: 500,
    modal: true,
    resizable: false,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg, gridConfig;

        gridConfig = Ext.apply({
            autoSelection: true
        }, config.grid);
        delete config.grid;

        me.grid = Ext.create('YZSoft.bpm.src.grid.TaskSteps', gridConfig);

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: config.btnText || RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            store: me.grid.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnableNoPerm(me.grid, me.grid.allowEmptySelection ? 0:1, -1));
            },
            handler: function () {
                me.closeDialog(me.grid.getSelectedSteps());
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

        //if (gridConfig.singleSelection) {
        me.grid.on({
            itemdblclick: function (grid, record, item, index, e, eOpts) {
                me.closeDialog([record.data]);
            }
        });
        //}
    },

    afterRender: function () {
        this.callParent(arguments);
        this.grid.store.load({ loadMask: false });
    }
});
