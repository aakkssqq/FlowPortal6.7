
Ext.define('YZSoft.mobile.device.DevicePanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.mobile.model.Device'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 25,
            model: 'YZSoft.mobile.model.Device',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/Mobile/Device.ashx'),
                extraParams: {
                    method: 'GetDevicesList'
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            cls: 'yz-border-t',
            store: me.store,
            region: 'center',
            viewConfig: {
                markDirty: false,
                getRowClass: function (record) {
                    if (record.data.Disabled)
                        return 'yz-grid-row-disabled';
                }
            },
            columns: {
                defaults: {
                },
                items: [
                    { text: '<div class="yz-column-header-flag fa fa-flag"></div>', tdCls: 'yz-grid-cell-flag', width: 30, align: 'center', sortable: false, draggable: false, locked: false, autoLock: true, resizable: false, menuDisabled: true, renderer: me.renderFlag.bind(me) },
                    { text: RS.$('MobileAdmin_Device_Account'), dataIndex: 'Account', width: 120, align: 'left', sortable: true, renderer: me.renderUserName },
                    { text: RS.$('MobileAdmin_Device_Name'), dataIndex: 'Name', width: 160, align: 'center', sortable: true, formatter: 'text' },
                    { text: RS.$('MobileAdmin_Device_Model'), dataIndex: 'Model', width: 160, align: 'center', sortable: true, formatter: 'text' },
                    { text: RS.$('MobileAdmin_Device_Description'), dataIndex: 'Description', flex: 1, minWidth:260, align: 'left', sortable: true, formatter: 'text' },
                    { text: RS.$('MobileAdmin_Device_RegisterAt'), dataIndex: 'RegisterAt', width: 160, align: 'center', sortable: true, formatter: 'date("Y-m-d H:i")' },
                    { text: RS.$('MobileAdmin_Device_LastLogin'), dataIndex: 'LastLogin', width: 160, align: 'center', sortable: true, formatter: 'date("Y-m-d H:i")' },
                    { text: RS.$('MobileAdmin_Device_Status'), dataIndex: 'Disabled', hidden:true, width: 100, align: 'center', sortable: true, renderer: me.renderStatus },
                    {
                        xtype: 'actioncolumn',
                        text: RS.$('MobileAdmin_Device_ActionColumn'),
                        width: 120,
                        align: 'center',
                        disabledCls: 'yz-display-none',
                        items: [{
                            glyph: 0xe62b,
                            iconCls: 'yz-action-disable',
                            tooltip: RS.$('MobileAdmin_Device_Action_Disable'),
                            isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                                return record.data.Disabled;
                            },
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.disableDevice(record);
                            }
                        }, {
                            glyph: 0xe951,
                            iconCls: 'yz-action-enable',
                            tooltip: RS.$('MobileAdmin_Device_Action_Enable'),
                            isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                                return !record.data.Disabled;
                            },
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.enableDevice(record);
                            }
                        }]
                    }
                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                displayInfo: true
            })
        });

        me.btnSelUser = Ext.create('Ext.button.Button', {
            text: RS.$('All_SelUser'),
            glyph: 0xeae1,
            handler: function () {
                YZSoft.SelUserDlg.show({
                    fn: function (user) {
                        var segment = me.chkSegment,
                            btnUser = segment.getComponent(1),
                            store = me.store,
                            params = store.getProxy().getExtraParams();

                        me.user = user;

                        btnUser.setText(Ext.String.format(RS.$('MobileAdmin_Device_Someone'),user.ShortName));
                        segment.setValue('spec');
                        segment.show();

                        Ext.apply(params, {
                            uid: me.user.Account
                        });

                        store.loadPage(1);
                    }
                });
            }
        });

        me.chkSegment = Ext.create('Ext.button.Segmented', {
            margin: '0 10 0 0',
            hidden: true,
            defaults: {
                padding: '7 10'
            },
            items: [{
                text: RS.$('MobileAdmin_Device_All'),
                value: 'all',
                pressed: true,
                handler: function () {
                    var store = me.store,
                        params = store.getProxy().getExtraParams();

                    delete params.uid;

                    store.loadPage(1);
                }
            }, {
                text: '',
                value: 'spec',
                handler: function () {
                    var store = me.store,
                        params = store.getProxy().getExtraParams();

                    Ext.apply(params, {
                        uid: me.user.Account
                    });

                    store.loadPage(1);
                }
            }]
        });

        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.grid,
            templateExcel: YZSoft.$url(me, Ext.String.format('Devices{0}.xls', RS.$('All_LangPostfix'))),
            params: {},
            fileName: 'Devices',
            allowExportAll: true,
            listeners: {
                beforeload: function (params) {
                    params.ReportDate = new Date()
                }
            }
        });

        me.toolBar = Ext.create('Ext.toolbar.Toolbar', {
            cls: 'yz-tbar-module',
            items: [
                me.chkSegment,
                me.btnSelUser,
                '->',
                me.btnExcelExport
            ]
        });

        cfg = {
            layout: 'border',
            tbar: me.toolBar,
            items: [me.searchPanel, me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);

        delete this.modified;
    },

    renderFlag: function (value, metaData, record) {
        var disabled = record.data.Disabled;

        if (record.data.Disabled)
            return Ext.String.format('<div class="yz-grid-cell-box-flag yz-color-warn yz-glyph yz-glyph-e96d" data-qtip="{0}"></div>',RS.$('MobileAdmin_Device_Disabled'));
    },

    renderUserName: function (value, metaData, record) {
        var account = record.data.Account,
            shortName = record.data.UserShortName,
            align = 'l50-r50';

        if (!account)
            return '';

        return Ext.String.format('<span class="yz-s-uid" uid="{0}" tip-align="{1}">{2}</span>',
            Ext.util.Format.text(account),
            align,
            Ext.util.Format.text(shortName));
    },

    renderStatus: function (value) {
        return RS.$(value ? 'MobileAdmin_Device_Disabled' : '');
    },

    disableDevice: function (rec) {
        var me = this,
            names = [],
            fileids = [],
            folderids = [];

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/Mobile/Device.ashx'),
            params: {
                method: 'DisableDevice',
                uid: rec.data.Account,
                UUID:rec.data.UUID
            },
            waitMsg: { msg: RS.$('MobileAdmin_Device_LoadMask_Disable'), target: me },
            success: function (result) {
                rec.set('Disabled', true);
            }
        });
    },

    enableDevice: function (rec) {
        var me = this,
            names = [],
            fileids = [],
            folderids = [];

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/Mobile/Device.ashx'),
            params: {
                method: 'EnableDevice',
                uid: rec.data.Account,
                UUID: rec.data.UUID
            },
            waitMsg: { msg: RS.$('MobileAdmin_Device_LoadMask_Enable'), target: me },
            success: function (result) {
                rec.set('Disabled', false);
            }
        });
    }
});