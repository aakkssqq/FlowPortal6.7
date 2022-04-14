//config
// connectionName

Ext.define('YZSoft.src.dialogs.SelBAPIDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.src.ux.EmptyText'
    ],
    title: RS.$('All_SelectBAPIDlg_Title'),
    width: 525,
    height: 580,
    minWidth: 525,
    minHeight: 580,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            connectionName = config.connectionName,
            cfg;

        me.edtSearch = Ext.create('YZSoft.src.form.field.Search', {
            margin: 0,
            emptyText: RS.$('All_BAPI_Search_EmptyText'),
            listeners: {
                scope: me,
                searchclick: 'onSearchClick'
            }
        });

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/DesignTime/SAP.ashx'),
                extraParams: {
                    method: 'GetBAPIs',
                    connectionName: connectionName
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            flex: 1,
            border: true,
            hideHeaders: true,
            store: me.store,
            deferEmptyText: false,
            emptyText: YZSoft.src.ux.EmptyText.normal.apply({
                text: RS.$('All_BAPI_Search_ResultGrid_EmptyText')
            }),
            selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'SINGLE' }),
            viewConfig: {
                stripeRows: false,
                deferEmptyText: false
            },
            columns: {
                defaults: {
                },
                items: [
                    { text: RS.$('All_SecutityGroupName'), dataIndex: 'name', flex: 1, formatter:'text' }
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
            defaultFocus: me.edtSearch,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.edtSearch, me.grid],
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
    },

    onSearchClick: function () {
        var me = this,
            kwd = me.edtSearch.getValue().trim();

        me.store.getProxy().getExtraParams().filter = kwd;
        me.store.load({
            loadMask: true
        });
    }
});
