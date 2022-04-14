
Ext.define('Demo.ProductionDevice.AccessControlPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.ux.FormManager'
    ],
    title: '设备档案信息',
    layout: 'fit',
    dlgCfg: {
        dlgModel: 'Dialog', //Tab,Window,Dialog
        width: 700,
        height: 650
    },

    constructor: function (config) {
        var me = this,
            cfg;

        //调试时显示模块的权限
        //alert(Ext.encode(config.perm));
        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: YZSoft.EnvSetting.pageSize.defaultSize,
            model: 'Ext.data.Model',
            sorters: {
                property: 'id', direction: 'ASC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, 'Services.ashx'),
                extraParams: {
                    method: 'GetData'
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            cls: 'yz-border-t',
            store: me.store,
            selModel: {
                selType: 'checkboxmodel',
                mode: 'MULTI'
            },
            columns: {
                defaults: {
                },
                items: [
                    { header: '编号', dataIndex: 'id', width: 30, hidden: true },
                    { header: '设备编号', dataIndex: 'Number', width: 100, align: 'left', sortable: true },
                    { header: '设备名称', dataIndex: 'Name', width: 150, align: 'left', sortable: true },
                    { header: '设备类别', dataIndex: 'Type', width: 100, align: 'left', sortable: true },
                    { header: '型号', dataIndex: 'Model', width: 100, align: 'left', hidden: true },
                    { header: '规格', dataIndex: 'Standard', flex: 1, align: 'left', sortable: true },
                    { header: '原值', dataIndex: 'Price', width: 100, align: 'left', sortable: true },
                    { header: 'KW', dataIndex: 'Power', width: 50, align: 'left', sortable: true },
                    { header: '厂商名称', dataIndex: 'Manufacture', width: 150, align: 'left', hidden: true },
                    { header: '供应商', dataIndex: 'Provider', width: 150, align: 'left', hidden: true },
                    { header: '所属系统', dataIndex: 'SystemName', width: 100, align: 'left', sortable: true },
                    { header: '设龄', dataIndex: 'IntendAge', width: 50, align: 'left', sortable: true },
                    { header: '安装地点', dataIndex: 'Location', width: 100, align: 'left', hidden: true },
                    { header: '状态', dataIndex: 'Status', width: 100, align: 'left', sortable: true }
                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                displayInfo: true
            }),
            listeners: {
                rowdblclick: function (grid, record, tr, rowIndex, e, eOpts) {
                    me.read(record);
                }
            }
        });

        me.btnNew = Ext.create('Ext.button.Button', {
            text: '添加',
            glyph: 0xe61d,
            /*---------新增按钮权限（模块权限）-------------*/
            disabled: !config.perm['New'],
            /*----------------------------------------------*/
            handler: function () {
                me.addNew();
            }
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            text: '编辑',
            glyph: 0xe61c,
            /*---------编辑按钮权限（记录权限）-------------*/
            perm: 'Edit',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, 1));
            },
            /*----------------------------------------------*/
            handler: function () {
                var sm = me.grid.getSelectionModel(),
                    recs = sm.getSelection() || [];

                if (recs.length != 1)
                    return;

                me.edit(recs[0]);
            }
        });

        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
            text: '删除',
            glyph: 0xe64d,
            /*---------删除按钮权限（记录权限）-------------*/
            perm: 'Delete',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            /*----------------------------------------------*/
            handler: function () {
                me.deleteSelection();
            }
        });

        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.grid,
            templateExcel: YZSoft.$url(me, '设备清单模板.xls'), //导出模板，不设置则按缺省方式导出
            params: {},
            fileName: '设备清单',
            allowExportAll: true, //可选项，缺省使用YZSoft.EnvSetting.Excel.AllowExportAll中的设置，默认值false
            //maxExportPages: 10, //可选项，缺省使用YZSoft.EnvSetting.Excel.MaxExportPages中的设置，默认值100
            listeners: {
                beforeload: function (params) {
                    params.ReportDate = new Date()
                }
            }
        });

        /*------------------记录权限管理器-------------------*/
        me.sts = Ext.create('YZSoft.src.sts', {
            items: [me.btnEdit, me.btnDelete],
            store: me.store,
            sm: me.grid.getSelectionModel(),
            request: {
                params: {
                    method: 'GetRecordPermision',
                    rsid: 'iDemoDevice' //通常用TableName作为rsid
                }
            }
        });
        /*----------------------------------------------------*/

        cfg = {
            tbar: {
                cls: 'yz-tbar-module',
                items: [
                    me.btnNew,
                    me.btnEdit,
                    me.btnDelete,
                    '|',
                    me.btnExcelExport,
                    '->',
                    '搜索条件',{
                    xclass: 'YZSoft.src.form.field.Search',
                    store: me.store,
                    width: 220
                }]
            },
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);
    },

    addNew: function () {
        var me = this;

        YZSoft.bpm.src.ux.FormManager.openFormApplication('Demo/ProductionDevice/ProductionDevice', '', 'New', Ext.apply({
            sender: me,
            title: '添加设备',
            listeners: {
                submit: function (action, data) {
                    me.store.reload({
                        loadMask: {
                            msg: '保存已成功',
                            start: 0,
                            stay: 300
                        },
                        callback: function () {
                            var rec = me.store.getById(data.Key);
                            if (rec)
                                me.grid.getSelectionModel().select(rec);
                        }
                    });
                }
            }
        }, me.dlgCfg));
    },

    edit: function (rec) {
        var me = this;

        YZSoft.bpm.src.ux.FormManager.openFormApplication('Demo/ProductionDevice/ProductionDevice', rec.data.id, 'Edit', Ext.apply({
            sender: me,
            title: Ext.String.format('设备属性 - {0}', rec.data.Name),
            listeners: {
                submit: function (action, data) {
                    me.store.reload({
                        loadMask: {
                            msg: '保存已成功',
                            start: 0,
                            stay: 300
                        }
                    });
                }
            }
        }, me.dlgCfg));
    },

    read: function (rec) {
        var me = this;

        YZSoft.bpm.src.ux.FormManager.openFormApplication('Demo/ProductionDevice/ProductionDevice', rec.data.id, 'Read', Ext.apply({
            sender: me,
            title: Ext.String.format('设备属性 - {0}', rec.data.Name)
        }, me.dlgCfg));
    },

    deleteSelection: function () {
        var me = this,
            recs = me.grid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function (rec) {
            ids.push(rec.getId());
        });

        Ext.Msg.show({
            title: '删除确认',
            msg: '您确定要删除选中项吗？',
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.MessageBox.INFO,

            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    url: YZSoft.$url(me, 'Services.ashx'),
                    method: 'POST',
                    params: {
                        method: 'Delete'
                    },
                    jsonData: ids,
                    waitMsg: {
                        msg: '正在删除...',
                        target: me.grid
                    },
                    success: function (action) {
                        me.store.reload({
                            loadMask: {
                                msg: Ext.String.format('{0}个对象已删除！', recs.length),
                                start: 0,
                                stay: 300
                            }
                        });
                    },
                    failure: function (action) {
                        var mbox = Ext.Msg.show({
                            title: '错误提示',
                            msg: Ext.util.Format.text(action.result.errorMessage),
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });

                        me.store.reload({ mbox: mbox });
                    }
                });
            }
        });
    }
});