/*
config
path full name of form service
folder 新建的时候传入

rsid
parentRsid
readOnly

property:
orgName
*/

Ext.define('YZSoft.report.rpt.admin.Dialog', {
    extend: 'Ext.window.Window', //333333
    layout: 'fit',
    width: 990,
    height: 650,
    minWidth: 990,
    minHeight: 650,
    modal: true,
    maximizable: true,
    bodyPadding: 0,
    buttonAlign: 'right',
    referenceHolder: true,
    defaultData: {
        DataSourceName: 'Default',
        ClientCursor: false,
        Paging: false,
        PageItems: 20,
        FinanceMonth: {
            MonthDay: 1,
            MonthOffset: 0
        }
    },

    constructor: function (config) {
        var me = this,
            mode = me.mode = 'path' in config ? 'edit' : 'new',
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.report.rpt.PropertyPages.ReportGeneral', {
            padding: '26 26 0 26'
        });

        me.pnlDataSource = Ext.create('YZSoft.report.rpt.PropertyPages.DataSource', {
            padding: '15 15 0 15'
        });

        me.pnlParams = Ext.create('YZSoft.report.rpt.PropertyPages.Params', {
            padding: '15 26 5 26'
        });

        me.pnlDisplayName = Ext.create('YZSoft.report.rpt.PropertyPages.DisplayName', {
            padding: '15 26 5 26'
        });

        me.pnlViews = Ext.create('YZSoft.report.rpt.PropertyPages.Views', {
            padding: '15 26 5 26'
        });

        me.pnlReportLink = Ext.create('YZSoft.report.rpt.PropertyPages.ReportLink', {
            padding: '15 26 5 26'
        });

        me.pnlSecurity = Ext.create('YZSoft.bpm.propertypages.Security', {
            padding: '15 26 5 26',
            rsid: config.rsid,
            parentRsid: config.parentRsid,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            perms: [{
                PermName: 'Read',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Perm_Read')
            }, {
                PermName: 'Write',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Perm_Write')
            }, {
                PermName: 'Execute',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Report_Perm_Execute')
            }]
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlDataSource,
                me.pnlParams,
                me.pnlDisplayName,
                me.pnlViews,
                me.pnlReportLink,
                me.pnlSecurity
            ]
        });

        me.pnlParams.on({
            scope: me,
            beforeactivate: 'beforeItemActive',
            activate: function () {
                var ds = me.pnlDataSource.save();
                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/Reports/ReportAdmin.ashx'),
                    params: {
                        method: 'ParseCommandText',
                        Query: ds.Query,
                        DataSourceName: ds.DataSourceName
                    },
                    success: function (action) {
                        me.pnlParams.edtParams.setParams(action.result);
                    }
                });
            }
        });

        me.pnlDisplayName.on({
            scope: me,
            beforeactivate: 'beforeItemActive',
            activate: function () {
                var ds = me.pnlDataSource.save(),
                    queryParams = me.pnlParams.save().QueryParameters;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/DataSource.ashx'),
                    params: {
                        method: 'GetDataSourceSchema',
                        dataSource: ds.DataSourceName,
                        query: ds.Query,
                        queryParams: Ext.encode(queryParams)
                    },
                    success: function (action) {
                        me.pnlDisplayName.edtColumns.setColumns(action.result.Tables[0].Columns);
                    }
                });
            }
        });

        me.pnlViews.on({
            scope: me,
            beforeactivate: 'beforeItemActive',
            activate: function () {
                var ds = me.pnlDataSource.save(),
                    queryParams = me.pnlParams.save().QueryParameters;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/DataSource.ashx'),
                    params: {
                        method: 'GetDataSourceSchema',
                        dataSource: ds.DataSourceName,
                        query: ds.Query,
                        queryParams: Ext.encode(queryParams)
                    },
                    success: function (action) {
                        me.pnlViews.columns = me.mergeColumnInfo(action.result.Tables[0].Columns, me.pnlDisplayName.save());
                    }
                });
            }
        });

        me.pnlReportLink.on({
            scope: me,
            beforeactivate: 'beforeItemActive',
            activate: function () {
                var ds = me.pnlDataSource.save(),
                    queryParams = me.pnlParams.save().QueryParameters;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/DataSource.ashx'),
                    params: {
                        method: 'GetDataSourceSchema',
                        dataSource: ds.DataSourceName,
                        query: ds.Query,
                        queryParams: Ext.encode(queryParams)
                    },
                    success: function (action) {
                        me.pnlReportLink.edtColumns.setColumns(action.result.Tables[0].Columns, queryParams);
                    }
                });
            }
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: config.readOnly,
            handler: function () {
                me.submit(function (data) {
                    me.closeDialog(data);
                });
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            buttons: [me.btnOK, me.btnCancel],
            items: [me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        var refs = me.pnlGeneral.getReferences();
        refs.edtName.focus();
        refs.edtName.on({
            change: function () {
                me.updateStatus();
            }
        })

        if (mode == 'edit') {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/Reports/ReportAdmin.ashx'),
                params: { method: 'GetReportDefine', path: config.path },
                success: function (action) {
                    me.fill(action.result);
                }
            });
        }
        else {
            me.fill(Ext.clone(me.defaultData));
        }
    },

    fill: function (data) {
        var me = this;

        me.orgName = data.Name;
        me.pnlGeneral.fill(Ext.copyTo({}, data, 'Name,ExportTemplateFile,Hidden'));
        me.pnlDataSource.fill(Ext.copyTo({}, data, 'DataSourceName,Query,ClientCursor'));
        me.pnlParams.fill(Ext.copyTo({
            QueryParameters: data.QueryParameters,
            FinanceMonth: data.FinanceMonth
        }, data, 'Paging,PageItems'));
        me.pnlDisplayName.fill(data.ReportColumnInfos);
        me.pnlViews.fill(data.Views);
        me.pnlReportLink.fill(data.ReportColumnInfos);

        me.updateStatus();
    },

    save: function () {
        var me = this,
            value;

        value = me.pnlGeneral.save();
        Ext.apply(value, me.pnlDataSource.save());
        Ext.apply(value, me.pnlParams.save());
        value.ReportColumnInfos = me.pnlDisplayName.save();
        value.Views = me.pnlViews.save();
        me.mixDisplayAndLinkInfo(value.ReportColumnInfos, me.pnlReportLink.save());

        return value;
    },

    submit: function (fn, scope) {
        var me = this,
            refs = me.getReferences(),
            data = me.save(),
            acl = me.pnlSecurity.save();

        if (me.validate(data) === false)
            return;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/Reports/ReportAdmin.ashx'),
            params: {
                method: 'SaveReport',
                mode: me.mode,
                path: me.path,
                name: me.orgName,
                folder: me.folder
            },
            jsonData: {
                data: data,
                acl: acl
            },
            waitMsg: {
                msg: RS.$('All_Saving'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.mask({
                    msg: RS.$('All_Save_Succeed'),
                    msgCls: 'yz-mask-msg-success',
                    autoClose: true,
                    fn: function () {
                        fn && fn.call(scope, data);
                    }
                });
            }
        });
    },

    validate: function (value) {
        var me = this,
            refs = me.pnlGeneral.getReferences();

        try {
            var err = $objname(value.Name);
            if (err !== true) {
                Ext.Error.raise({
                    msg: err,
                    before: function () {
                        me.tabMain.setActiveItem(me.pnlGeneral);
                    },
                    fn: function () {
                        refs.edtName.focus();
                    }
                });
            }

            if (!value.Query) {
                Ext.Error.raise({
                    msg: RS.$('Report_PleaseSetDataSourceFirst'),
                    before: function () {
                        me.tabMain.setActiveItem(me.pnlDataSource);
                    },
                    fn: function () {
                        me.pnlDataSource.getReferences().edtQuery.focus();
                    }
                });
            }

            if (value.Views.length == 0) {
                Ext.Error.raise({
                    msg: RS.$('Report_ValidationErr_DefineViewAtLeastOne'),
                    before: function () {
                        me.tabMain.setActiveItem(me.pnlViews);
                    }
                });
            }
        }
        catch (e) {
            if (e.before)
                e.before.call(e.scope || this, e);

            YZSoft.alert(e.message, function () {
                if (e.fn)
                    e.fn.call(e.scope || this, e);
            });
            return false;
        }
    },

    mergeColumnInfo: function (columns, columnInfos) {
        Ext.each(columns, function (column) {
            var columnInfo = Ext.Array.findBy(columnInfos, function (columnInfo) {
                return columnInfo.ColumnName == column.ColumnName;
            });

            if (columnInfo)
                Ext.copyTo(column, columnInfo, 'DisplayName');
        });

        return columns;
    },

    mixDisplayAndLinkInfo: function (dspColumns, lnkColumns) {
        Ext.each(lnkColumns, function (lnkColumn) {
            var dspColumn = Ext.Array.findBy(dspColumns, function (dspColumn) {
                return lnkColumn.ColumnName == dspColumn.ColumnName;
            });

            if (dspColumn)
                Ext.copyTo(dspColumn, lnkColumn, 'LinkType,LinkTo,ParametersFill');
            else
                dspColumns.push(lnkColumn);
        });

        return dspColumns;
    },

    beforeItemActive:function () {
        var me = this,
            ds = me.pnlDataSource.save();

        if (!ds.Query) {
            me.tabMain.setActiveItem(me.pnlDataSource);
            YZSoft.alert(RS.$('Report_PleaseSetDataSourceFirst'), function () {
                me.pnlDataSource.getReferences().edtQuery.focus();
            });
            return false;
        }
    },

    updateStatus: function () {
        var me = this,
            refs = me.pnlGeneral.getReferences();

        me.btnOK.setDisabled(me.readOnly || !Ext.String.trim(refs.edtName.getValue()));
    }
});