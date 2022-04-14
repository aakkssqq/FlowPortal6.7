
Ext.define('YZSoft.bpm.src.dialogs.SelRoleDlg', {
    extend: 'Ext.window.Window', //111111
    requires: ['YZSoft.bpm.src.model.Role'],
    title: RS.$('All_SelectRole'),
    layout: 'border',
    width: 750,
    height: 500,
    minWidth: 750,
    minHeight: 500,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg;

        me.tree = Ext.create('YZSoft.bpm.src.tree.OrgTree', {
            title: RS.$('All_SelOU'),
            region: 'center',
            margins: '0 0 0 0',
            border: true,
            listeners: {
                selectionchange: function (sm, selected, eOpts) {
                    if (selected.length >= 1) {
                        me.grid.setTitle(selected[0].data.text);
                        me.store.load({
                            loadMask: false,
                            params: {
                                path: selected[0].getId()
                            }
                        });
                    }
                }
            }
        });

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.Role',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                extraParams: { method: 'GetRolesInPath' },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            title: RS.$('All_Role'),
            hideHeaders: true,
            region: 'east',
            width: 270,
            margins: '0 0 0 0',
            store: me.store,
            split: { size: 6 },
            border: true,
            selModel: { mode: 'SINGLE' },
            columns: {
                defaults: {
                    sortable: true,
                    hideable: true,
                    menuDisabled: false
                },
                items: [
                    { text: '', dataIndex: 'Name', align: 'left', flex: 1, renderer: YZSoft.Render.renderString }
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
            items: [me.tree, me.grid],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
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
