//config
// excludeEveryone: true/false
// addtosid: add to group

Ext.define('YZSoft.bpm.src.dialogs.SelSecurityGroupDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpm.src.model.SecurityGroup'
    ],
    title: RS.$('All_SelectSecurityGroup'),
    layout: 'fit',
    width: 525,
    height: 580,
    minWidth: 525,
    minHeight: 580,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.SecurityGroup',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/SecurityGroup.ashx'),
                extraParams: {
                    method: 'GetGroups',
                    excludeEveryone: config.excludeEveryone,
                    addtosid: config.addtosid
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            border: true,
            store: me.store,
            selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'SINGLE' }),
            viewConfig: {
                stripeRows: false
            },
            columns: {
                defaults: {
                },
                items: [
                    { text: RS.$('All_SecutityGroupName'), dataIndex: 'GroupName', flex: 1, formatter:'text' }
                ]
            },
            listeners: {
                rowdblclick: function (grid, record, tr, rowIndex, e, eOpts) {
                    me.closeDialog(record.data);
                }
            }
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, '', 1, 1));
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1)
                    me.closeDialog(recs[0].data);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
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

        me.store.load({loadMask:false});
    },

    show: function (config) {
        config = config || {};

        if (config.title)
            this.setTitle(config.title);

        if (config.fn) {
            this.fn = config.fn;
            this.scope = config.scope;
        }

        this.callParent();
    }
});
