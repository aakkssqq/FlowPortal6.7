
Ext.define('2020.src.BPMPortal', {
    extend: '2020.src.Abstract',
    requires: [
        'YZSoft.src.ux.Push',
        'YZSoft.src.ux.Badge',
        'YZSoft.src.component.Headshort',
        'YZSoft.src.tip.UserTip',
        'YZSoft.src.button.UseEMIP',
        'YZSoft.src.button.Language',
        'YZSoft.src.button.SigninUser',
        'YZSoft.frame.tab.Navigator',
        'YZSoft.frame.tab.Base',
        'YZSoft.src.tab.Panel',
        'YZSoft.frame.module.Container',
        'YZSoft.src.container.ModuleContainer',
        'YZSoft.frame.app.Classic',
        'YZSoft.frame.app.Abstract',
        'YZSoft.frame.navigator.Classic',
        'YZSoft.frame.tab.Module',
        'YZSoft.bpm.worklist.Panel',
        'YZSoft.bpm.src.panel.WorklistAbstract',
        'YZSoft.bpm.src.panel.StepAbstract',
        'YZSoft.bpm.src.ux.FormManager',
        'YZSoft.src.ux.WindowManager',
        'YZSoft.bpm.taskoperation.Manager',
        'YZSoft.bpm.src.ux.Render',
        'YZSoft.bpm.src.model.Worklist',
        'YZSoft.src.button.Button',
        'YZSoft.src.menu.Item',
        'YZSoft.src.form.field.Search',
        'YZSoft.src.sts'
    ],

    launch: function () {
        var me = this,
            url = Ext.String.format('{0}/Main.ashx', YZSoft.startApp),
            tab;

        document.title = me.title;
        Ext.getBody().addCls('yz-portal-2020 yz-portal-2020-bpm');
        me.newMessages = userInfo.NewMessages;

        YZSoft.src.ux.Push.init({
        });

        Ext.Ajax.request({
            method: 'GET',
            disableCaching: true,
            url: url,
            params: {
                method: 'GetModuleTree'
            },
            success: function (response) {
                var result = Ext.decode(response.responseText),
                    modules = result;

                if (result.success === false) {
                    result.errorMessage = Ext.String.htmlDecode(result.errorMessage);
                    YZSoft.alert(result.errorMessage);
                    return;
                }

                if (modules.length == 0) {
                    window.location.replace(
                        Ext.String.urlAppend(YZSoft.$url('YZSoft/core/AccessDenied/App.aspx'), Ext.Object.toQueryString({
                            startApp: YZSoft.startApp,
                            appName: me.title
                        }))
                    );
                    return;
                }

                me.cmpLogo = Ext.create('Ext.Component', {
                    cls: 'yz-logo'
                });

                me.btnCollapse = Ext.create('Ext.button.Button', {
                    cls: 'yz-btn-portal-title yz-size-icon-14 yz-btn-navigate-collapse',
                    margin: '0 7 0 0',
                    padding:'3 3 3 0',
                    width: 'auto',
                    height: 'auto',
                    glyph: 0xeaa5,
                    scope: me,
                    handler: 'onToggleClick'
                });

                me.tabBar = bar = Ext.create('Ext.tab.Bar', {
                    cls: 'yz-tab-bar-navigator-maintop',
                    padding: 0
                });

                me.btnTask = Ext.create('Ext.button.Button', {
                    cls: 'yz-btn-portal-title yz-size-icon-22 yz-btn-messageindicator-task',
                    glyph: 0xeaa7,
                    margin: '0 20 0 0',
                    badgeText: userInfo.TaskCount,
                    handler: function () {
                        YZSoft.goto('BPM/Worklist');
                    }
                });

                me.btnMessage = Ext.create('Ext.button.Button', {
                    cls: 'yz-btn-portal-title yz-size-icon-18 yz-btn-messageindicator-message',
                    glyph: 0xeaa6,
                    badgeText: me.getNewMessageCount(userInfo.NewMessages),
                    handler: function () {
                        Ext.require('YZSoft.src.ux.AppSwitch', function () {
                            YZSoft.src.ux.AppSwitch.openApp('2020/IM');
                        });
                    }
                });

                me.btnEMIP = Ext.create('YZSoft.src.button.UseEMIP', {
                    height: '100%',
                    cls: 'yz-btn-portal-title yz-size-icon-18 yz-btn-useemip',
                    margin: '0 0 0 20'
                });

                me.btnLang = Ext.create('YZSoft.src.button.Language', {
                    height: '100%',
                    margin: '0 25 0 20'
                });
                
                me.btnUser = Ext.create('YZSoft.src.button.SigninUser', {
                    height: '100%',
                    margin: 0,
                    outofofficeSetting: userInfo.OutOfOfficeSetting
                });

                me.btnApps = Ext.create('Ext.button.Button', {
                    cls: 'yz-btn-portal-title yz-btn-appswitch',
                    glyph:0xeaa8,
                    height: '100%',
                    scope: me,
                    handler: 'onSwitchAppClick'
                });

                me.titlebar = Ext.create('Ext.container.Container', {
                    region: 'north',
                    cls: 'yz-titlebar-portal',
                    height: me.bannerHeight,
                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    },
                    items: [{
                        xtype: 'container',
                        cls:'yz-cnt-logowrap',
                        width: me.logoSectionWidth,
                        height: '100%',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                            pack: 'center'
                        },
                        items: [
                            me.cmpLogo
                        ]},
                        me.btnCollapse,
                        me.tabBar,
                        { xtype: 'tbfill' },
                        me.btnTask,
                        me.btnMessage,
                        me.btnEMIP,
                        me.btnLang,
                        me.btnUser,
                        me.btnApps
                    ]
                });

                me.tab = Ext.create('YZSoft.frame.tab.Navigator', {
                    region: 'center',
                    activeTab: me.activeTab || 0, //from 0
                    tabBar: me.tabBar,
                    modules: modules
                });

                //流程追踪
                //me.tab = Ext.create('YZSoft.bpm.tasktrace.Panel', {
                //    region: 'center',
                //    title: Ext.String.format('{0} - {1}', RS.$('All_TaskTrace'), 'REQ2018120013'),
                //    backButton: true,
                //    TaskID: 281798,
                //    activeTabIndex: 1
                //});

                //reportx
                //me.tab = Ext.create('YZSoft.report.Panel', {
                //    region: 'center',
                //    path: 'D41.ReportX/年度销售统计'
                //});

                //me.tab = Ext.create('Ext.Container', {
                //    loader: {
                //        url: 'http://localhost/2020/test/Default3.aspx',
                //        scripts: true,
                //        autoLoad: true,
                //        scope: a,
                //        rendererScope: a
                //    }
                //});

                YZSoft.mainTab = me.tab;
                YZSoft.frame = Ext.create('Ext.container.Viewport', {
                    layout: 'card',
                    items: [{
                        xtype: 'container',
                        layout: 'border',
                        items: [
                            me.titlebar,
                            me.tab
                        ]
                    }]
                });

                //YZSoft.alert('message');
                //YZSoft.alert('message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message ','title');

                //Ext.Msg.show({
                //    title: 'aaaaaaaaaaaaa',
                //    msg: 'message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message',
                //    //msg: 'message',
                //    icon: Ext.Msg.INFO,
                //    buttons: Ext.Msg.YESNOCANCEL,
                //    defaultButton: 'no',
                //    fn: function (btn) {
                //    }
                //});

                //Ext.Msg.show({
                //    title: 'aaaaaaaaaaaaa',
                //    msg: 'message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message',
                //    icon: Ext.Msg.QUESTION,
                //    buttons: Ext.Msg.YES,
                //    defaultButton: 'yes'
                //});

                //Ext.Msg.show({
                //    title: '',
                //    msg: 'message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message',
                //    icon: Ext.Msg.WARNING,
                //    buttons: Ext.Msg.YES,
                //    defaultButton: 'yes'
                //});

                //Ext.Msg.show({
                //    title: '',
                //    msg: '这款手机阿卡结束啦拉数据爱丽丝啥时间拉耸了耸肩安静这款手机阿卡结束啦拉数据爱丽丝啥时间拉耸了耸肩安静这款手机阿卡结束啦拉数据爱丽丝啥时间拉耸了耸肩安静这款手机阿卡结束啦拉数据爱丽丝啥时间拉耸了耸肩安静这款手机阿卡结束啦拉数据爱丽丝啥时间拉耸了耸肩安静',
                //    icon: Ext.Msg.ERROR,
                //    buttons: Ext.Msg.OK,
                //    defaultButton: 'ok'
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.ConfirmDlg', {
                //    autoShow: true,
                //    title: RS.$('All_DeleteConfirm_Title'),
                //    info: RS.$('TaskOpt_Delete_Prompt_Desc'),
                //    label: RS.$('TaskOpt_Delete_Comments'),
                //    validateEmpty: true,
                //});

                /***多选***/
                //Ext.create('YZSoft.bpm.src.dialogs.SelUsersDlg', {
                //    autoShow:true
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SelMembersDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SelProcessesDlg', {
                //    autoShow: true
                //});

                //me.dlgWin = Ext.create('YZSoft.bpa.src.dialogs.SelSpritesDlg', {
                //    autoShow: true,
                //    folderType: 'BPAOU',
                //    title: '责任者'
                //});

                /***单选（搜索）***/
                //Ext.create('YZSoft.bpm.src.dialogs.SelUserDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SelMemberDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SelProcessDlg', {
                //    autoShow: true
                //});

                /***选择-树+列表***/
                //Ext.create('YZSoft.bpm.src.dialogs.SelAssemblyDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SelFormDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SelFormServiceDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SelRoleDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.report.rpt.dialogs.SelReportDlg', {
                //    autoShow: true
                //});

                //me.dlgWin = Ext.create('YZSoft.bpa.src.dialogs.SelSpriteDlg', {
                //    autoShow: true,
                //    folderType: 'BPAOU',
                //    title: '责任者'
                //});

                /***选择-树***/
                //Ext.create('YZSoft.bpm.src.dialogs.CodeSuggestDlg', {
                //    autoShow: true,
                //    tables: [{
                //        DataSourceName: 'Default',
                //        IsRepeatableTable: false,
                //        TableName: 'Purchase'
                //    }, {
                //        DataSourceName: 'Default',
                //        IsRepeatableTable: true,
                //        TableName: 'PurchaseDetail'
                //    }]
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SelFormFieldDlg', {
                //    closeAction: 'hide',
                //    autoShow: true,
                //    tables: [{
                //        "DataSourceName": "Default",
                //        "TableName": "Purchase",
                //        "IsRepeatableTable": false
                //    }, {
                //        "DataSourceName": "Default",
                //        "TableName": "PurchaseDetail",
                //        "IsRepeatableTable": true
                //    }]
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SelFSSFolderDlg', {
                //    autoShow: true,
                //    serverName: 'localhost'
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SelOUDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SelStoreFolderDlg', {
                //    autoShow: true,
                //    title: RS.$('All_MoveStoreObjectsTo'),
                //    zone: 'Process',
                //    excludefolder: '',
                //    perm: 'Write'
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SelTableDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.src.dialogs.SelFolderDlg', {
                //    autoShow: true,
                //    title: '移动到',
                //    excludeModel: 'moveFolderExclude',
                //    excludeFolderIds: [128],
                //    storeConfig: {
                //        root: {
                //            "text": "中国电科集团",
                //            "path": 126
                //        }
                //    }
                //});

                //Ext.create('YZSoft.bpa.src.dialogs.SelLibraryFolderDlg', {
                //    autoShow: true,
                //    title: '发布到',
                //    folderType: 'BPAProcess'
                //});

                ///***选择-树+grid***/
                //Ext.create('YZSoft.src.dialogs.SelFileDlg', {
                //    autoShow: true,
                //    title: '引用文档',
                //    libType: "BPADocument"
                //});

                //Ext.create('YZSoft.src.dialogs.SelFileDlg', {
                //    autoShow: true,
                //    title: '选择模型',
                //    libType: "BPAFile"
                //});

                //Ext.create('YZSoft.bpa.src.dialogs.SelFileDlg', {
                //    autoShow: true,
                //    title: RS.$('All_BPM_Title_SelectBPAFile'),
                //    folderType: 'BPAProcess',
                //    groupid: 1,
                //    clearButton: {
                //        text: '清空关联文件'
                //    }
                //});

                ///***选择-grid***/
                //Ext.create('YZSoft.bpm.src.dialogs.SelLeaderTitleDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SelSecurityGroupDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpm.taskoperation.SelJumpTagStepDlg', {
                //    autoShow: true,
                //    title: RS.$('All_Caption_SelJumpTagStep'),
                //    taskid: 281752
                //});

                //Ext.create('YZSoft.bpm.taskoperation.SelJumpSrcStepDlg', {
                //    autoShow: true,
                //    title: RS.$('All_Caption_SelJumpSrcStep'),
                //    taskid: 281752
                //});

                //Ext.create('YZSoft.bpm.taskoperation.SelPickbackStepDlg', {
                //    autoShow: true,
                //    title: RS.$('All_Pickback'),
                //    taskid: 281752
                //});

                //Ext.create('YZSoft.bpm.taskoperation.SelProcessingStepDlg', {
                //    autoShow: true,
                //    title: RS.$('All_ChangeOwner'),
                //    taskid: 281752
                //});

                //Ext.create('YZSoft.bpm.taskoperation.SelReActiveStepDlg', {
                //    autoShow: true,
                //    title: RS.$('All_ReActiveTo'),
                //    taskid: 281752
                //});

                //Ext.create('YZSoft.bpm.taskoperation.SelRecedeBackStepDlg', {
                //    autoShow: true,
                //    title: RS.$('TaskOpt_RecedeBack_Title'),
                //    taskid: 281752
                //});

                ///***选择-grid多选***/
                //Ext.create('YZSoft.bpm.src.dialogs.SelLeaderTitlesDlg', {
                //    autoShow: true,
                //    title: RS.$('All_Caption_InitiatorPosition'),
                //    initSelection: ['总经理', '总监']
                //});

                ///***选择-grid多选特殊***/
                //Ext.create('YZSoft.bpm.src.dialogs.SelRecedeBackGroupDlg', {
                //    title: RS.$('Process_Title_SelRecedeBackGroup'),
                //    groups: ['AAA'],
                //    closeAction: 'hide'
                //}).show({
                //    myGroupName: 'BBB',
                //    value: ['AAA']
                //});

                ///***选择特殊***/
                //Ext.create('YZSoft.bpm.src.dialogs.SelFormFieldsDlg', {
                //    autoShow: true,
                //    tables: [{
                //        "DataSourceName": "Default",
                //        "TableName": "Purchase",
                //        "IsRepeatableTable": false
                //    }, {
                //        "DataSourceName": "Default",
                //        "TableName": "PurchaseDetail",
                //        "IsRepeatableTable": true
                //    }],
                //    value: [{
                //        "tableName": "Purchase",
                //        "columnName": "Attachments"
                //    }]
                //});

                //Ext.create('YZSoft.bpm.xformadmin.XFormDesignerInstallDlg', {
                //    autoShow: true,
                //    version: '3.11'
                //});

                //Ext.create('YZSoft.forms.field.dialogs.DataBrowserDlg', {
                //    autoShow: true,
                //    ds: {
                //        "DSType": 1,
                //        "DataSource": "",
                //        "TableName": "SetProduct",
                //        "OrderBy": null
                //    },
                //    filters: {},
                //    displayColumns: [],
                //    mapColumns: [],
                //    multiSelect: false,
                //    title: Ext.String.format('{0} - {1}', RS.$('All_DataBrowserWindowTitle'), 'SetProduct')
                //});

                //Ext.create('YZSoft.forms.field.dialogs.DataBrowserDlg', {
                //    autoShow: true,
                //    ds: {
                //        "DSType": 3,
                //        "DataSource": "",
                //        "ESB":
                //        "SqlServer:SetProduct",
                //        "OrderBy": null
                //    },
                //    filters: {},
                //    displayColumns: [],
                //    mapColumns: [],
                //    multiSelect: false,
                //    title: Ext.String.format('{0} - {1}', RS.$('All_DataBrowserWindowTitle'), '"SqlServer:SetProduct"')
                //});

                //Ext.create('YZSoft.src.dialogs.ExcelDataImportDlg', {
                //    autoShow: true,
                //    titleRowIndex: 0,
                //    dataRowIndex: 1
                //});

                //Ext.create('YZSoft.bpa.src.dialogs.NewFileDlg', {
                //    autoShow: true,
                //    folderid: 3
                //});

                //Ext.create('YZSoft.src.designer.dialogs.NewSeriesDialog', {
                //    autoShow: true,
                //    series: [{"seriesType":"line","desc":"\u6298\u7ebf\u56fe","xclass":"YZSoft.src.designer.container.chart.CartesianSeries","config":{"style":{"lineWidth":2}},"demo":{"title":"\u6f14\u793a\u6570\u636e","isDemoSeries":true,"xField":"__demo__category__","yField":"__demo__value1__","xAxis":"xAxis","yAxis":"yAxis"}},{"seriesType":"area","desc":"\u9762\u79ef\u56fe","xclass":"YZSoft.src.designer.container.chart.CartesianYFields","config":{"stacked":true,"style":{"opacity":0.8}},"demo":{"title":"\u6f14\u793a\u6570\u636e","xField":"__demo__category__","yField":"__demo__value1__","xAxis":"xAxis","yAxis":"yAxis"}}]
                //});

                //Ext.create('YZSoft.bpa.src.dialogs.SelCategoriesDlg', {
                //    autoShow: true,
                //    categroies: [{"category":"General","text":"\u57fa\u672c\u56fe\u5f62","expandable":false,"expanded":true,"checked":false,"cls":"yz-category-item yz-category-item-level1"},{"category":"FlowChart","text":"FlowChart \u6d41\u7a0b\u56fe","expandable":false,"expanded":true,"checked":false,"cls":"yz-category-item yz-category-item-level1"},{"category":"BPMN","text":"BPMN","expandable":false,"expanded":true,"checked":false,"cls":"yz-category-item yz-category-item-level1"},{"category":"EVC","text":"EVC \u4f01\u4e1a\u4ef7\u503c\u94fe","expandable":false,"expanded":true,"checked":false,"cls":"yz-category-item yz-category-item-level1"},{"category":"EPC","text":"EPC \u4e8b\u4ef6\u8fc7\u7a0b\u94fe","expandable":false,"expanded":true,"checked":false,"cls":"yz-category-item yz-category-item-level1"},{"category":"ORG","text":"\u7ec4\u7ec7\u7ed3\u6784\u56fe","expandable":false,"expanded":true,"checked":false,"cls":"yz-category-item yz-category-item-level1"},{"category":"Product","text":"\u4ea7\u54c1/\u670d\u52a1\u56fe","expandable":false,"expanded":true,"checked":false,"cls":"yz-category-item yz-category-item-level1"},{"category":"Data","text":"\u8868\u5355\u56fe","expandable":false,"expanded":true,"checked":false,"cls":"yz-category-item yz-category-item-level1"},{"category":"ITSystem","text":"IT\u7cfb\u7edf\u56fe","expandable":false,"expanded":true,"checked":false,"cls":"yz-category-item yz-category-item-level1"},{"category":"KPI","text":"\u6d41\u7a0bKPI\u56fe","expandable":false,"expanded":true,"checked":false,"cls":"yz-category-item yz-category-item-level1"},{"category":"Risk","text":"\u98ce\u9669\u63a7\u5236\u56fe","expandable":false,"expanded":true,"checked":false,"cls":"yz-category-item yz-category-item-level1"},{"category":"Regulation","text":"\u5236\u5ea6\u56fe","expandable":false,"expanded":true,"checked":false,"cls":"yz-category-item yz-category-item-level1"},{"category":"Lane","text":"\u6cf3\u6c60/\u6cf3\u9053","expandable":false,"expanded":true,"checked":false,"cls":"yz-category-item yz-category-item-level1"}],
                //    selection: ["FlowChart","Lane"],
                //});

                ///***输入-辅助***/
                //Ext.create('YZSoft.bpm.src.dialogs.SupervisorDlg', {
                //    autoShow: true,
                //    title: Ext.String.format('{0} - {1}', RS.$('All_Supervisor'), "全茂林"),
                //    supervisor: {
                //        "UserAccount": "99199",
                //        "UserFullName": "\u5168\u8302\u6797",
                //        "MemberFullName": "BPMOU://111111111/99199",
                //        "FGYWEnabled": false,
                //        "FGYWs": []
                //    }
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.TableFilterDlg', {
                //    title: Ext.String.format('{0} - {1}', RS.$('All_TableFilter'), "PurchaseDetail"),
                //    autoShow: true,
                //    tables: [{
                //        "DataSourceName": "Default",
                //        "TableName": "Purchase",
                //        "IsRepeatableTable": false
                //    }, {
                //        "DataSourceName": "Default",
                //        "TableName": "PurchaseDetail",
                //        "IsRepeatableTable": true
                //    }],
                //    tableIdentity: {
                //        "DataSourceName": "Default",
                //        "TableName": "PurchaseDetail",
                //        "IsRepeatableTable": true
                //    },
                //    value: { "Params": [] },
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.XSDFromDataSetMapDlg', {
                //    autoShow: true,
                //    tables: [{
                //        "DataSourceName": "Default",
                //        "TableName": "Purchase",
                //        "IsRepeatableTable": false
                //    }, {
                //        "DataSourceName": "Default",
                //        "TableName": "PurchaseDetail",
                //        "IsRepeatableTable": true
                //    }]
                //});

                ///***输入-单页***/
                //Ext.create('YZSoft.extserver.DataSourceServerDlg', {
                //    autoShow: true,
                //    path: ''
                //});

                //Ext.create('YZSoft.extserver.BPMServerDlg', {
                //    autoShow: true,
                //    path: ''
                //});

                //Ext.create('YZSoft.extserver.FTPServerDlg', {
                //    autoShow: true,
                //    path: ''
                //});

                //Ext.create('YZSoft.bpm.org.admin.ResetPwdDlg', {
                //    autoShow: true,
                //    title: Ext.String.format(RS.$('Org_ResetPwd_Title'), '全茂林'),
                //    parentou: '',
                //    uid: '99199',
                //    fn: function (user) {
                //    }
                //});

                //Ext.create('YZSoft.security.accesscontrol.ResourceDlg', {
                //    rsid: "49f6f78b-8706-4ac3-a8de-b3ce0188f08b",
                //    title: Ext.String.format('{0} - {1}', RS.$('Security_Title_ResourceProperty'), '应用门户'),
                //    readOnly: false,
                //    autoShow: true,
                //    autoClose: false
                //});

                //Ext.create('YZSoft.app.group.GroupDlg', {
                //    title: "财务管理小组",
                //    autoShow: true,
                //    autoClose: false,
                //    groupid: 1
                //});

                //Ext.create('YZSoft.bpm.org.admin.RoleDlg', {
                //    autoShow: true,
                //    title: Ext.String.format('{0} - {1}', RS.$('All_RoleProperty'), "出纳"),
                //    readOnly: false,
                //    fullname: "BPMOU://中国电科/出纳",
                //    getRootOUsType: 'SameProvider',
                //    srcoupath: "BPMOU://中国电科"
                //});

                //Ext.create('YZSoft.bpm.process.admin.SaveNewProcessDlg', {
                //    autoShow: true,
                //    processName: '新流程'
                //});

                //Ext.create('YZSoft.bpm.process.admin.SaveProcessDlg', {
                //    autoShow: true,
                //    processName: "采购申请",
                //    version: "3.7"
                //});

                //Ext.create('YZSoft.bpa.src.dialogs.NewFolderDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpa.src.dialogs.SaveNewProcessDlg', {
                //    autoShow: true,
                //    processName: ''
                //});

                //Ext.create('YZSoft.security.RecordAssignPermDlg', {
                //    autoShow: true,
                //    title: Ext.String.format('修改授权 - {0}', "SWHYS-5"),
                //    rsid: "d0ebfcf9-0007-44b3-b218-ef94628de67e",
                //    table: 'iDemoDevice',
                //    datasource: null,
                //    key: 5
                //});

                //Ext.create('YZSoft.security.UserResourceAssignPermDlg', {
                //    rsid: "997d1aef-d5c1-4645-a7ef-b39f1b06e1a4",
                //    title: Ext.String.format('{0} - {1}', RS.$('Security_ResourcePermision'), "流程门户"),
                //    readOnly: false,
                //    autoShow: true
                //});

                //Ext.create('YZSoft.security.WellKnownRSIDAssignPermDlg', {
                //    autoShow: true,
                //    title: RS.$('All_Org_Root'),
                //    rsid: "1CCFE783-7FBF-4582-B2F3-CE11F57917E7",
                //    readOnly: false,
                //    perms: [{
                //        PermName: 'Read',
                //        PermType: 'Module',
                //        PermDisplayName: RS.$('All_Perm_Read')
                //    }, {
                //        PermName: 'Write',
                //        PermType: 'Module',
                //        PermDisplayName: RS.$('All_Perm_Write')
                //    }, {
                //        PermName: 'OnlineMonitor',
                //        PermType: 'Module',
                //        PermDisplayName: RS.$('All_OnlineMonitor')
                //    }, {
                //        PermName: 'ActivityMonitor',
                //        PermType: 'Module',
                //        PermDisplayName: RS.$('All_ActivityMonitor')
                //    }]
                //});

                //Ext.create('YZSoft.security.group.Dialog', {
                //    groupName: "BJAdmin",
                //    title: Ext.String.format('{0} - {1}', RS.$('Security_Title_SecutiryGroup'), "BJAdmin"),
                //    readOnly: false,
                //    autoShow: true,
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.CreateRecordDlg', {
                //    title: Ext.String.format('{0} - {1}', RS.$('All_CreateRecord'), "PurchaseDetail"),
                //    autoShow: true,
                //    tables: [{
                //        "DataSourceName": "Default",
                //        "TableName": "Purchase",
                //        "IsRepeatableTable": false
                //    }, {
                //        "DataSourceName": "Default",
                //        "TableName": "PurchaseDetail",
                //        "IsRepeatableTable": true
                //    }],
                //    tableIdentity: {
                //        "DataSourceName": "Default",
                //        "TableName": "PurchaseDetail",
                //        "IsRepeatableTable": true
                //    },
                //    value: {
                //        CreateRecordType: 'FirstTimeEnterStep',
                //        Columns: []
                //    }
                //});

                ///*xxxxxx*/
                //Ext.create('YZSoft.bpm.src.dialogs.DatasetControlTableDlg', {
                //    tables: [{
                //        "DataSourceName": "Default",
                //        "TableName": "Purchase",
                //        "IsRepeatableTable": false
                //    }, {
                //        "DataSourceName": "Default",
                //        "TableName": "PurchaseDetail",
                //        "IsRepeatableTable": true
                //    }],
                //    title: Ext.String.format(RS.$('Process_Title_DatasetControlTableDlg'), "PurchaseDetail"),
                //    autoShow: true,
                //    value: {
                //        "isTable": true,
                //        "DataSourceName": "Default",
                //        "TableName": "PurchaseDetail",
                //        "IsRepeatableTable": true,
                //        "AllowAddRecord": true,
                //        "Filter": { "Params": [] },
                //        "InitCreateRecordSet": [],
                //        "DefaultValue": null,
                //        "SaveValue": null,
                //        "FilterValue": null
                //    },
                //    isRepeatableTableConfig: {
                //        "disabled": false
                //    },
                //    allowAddRecordConfig: undefined,
                //    filterConfig: undefined,
                //    createRecordConfig: undefined
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.MessagePreviewDlg', {
                //    autoShow: true,
                //    title: Ext.String.format('{0} - {1}', RS.$('All_NotifyContent'), 'Mail'),
                //    contentType: ["Title","MessageOnly","TitleAndMessage","Attachment","TitleMessageAttachment"],
                //    data: {
                //        "ProviderName": "Mail",
                //        "Enabled": true,
                //        "Inheri": false,
                //        "Title": "[\u5de5\u4f5c\u6d41][\u65b0\u4efb\u52a1]\u63d0\u4ea4\u4eba\uff1a<%=Initiator.UserFriendlyName%>\uff0c\u4e1a\u52a1\u540d\uff1a <%=Context.Current.Process.Name %>\uff0c\u6d41\u6c34\u53f7\uff1a <%=Context.Current.Task.SerialNum %>",
                //        "Message": "\u4e1a\u52a1\u540d\uff1a <%=Context.Current.Process.Name %>33\n\u63d0\u4ea4\u4eba\uff1a <%=Initiator.UserFriendlyName %>\n\u63d0\u4ea4\u65e5\u671f\uff1a <%=Context.Current.Task.CreateAt.ToString() %>\n\u6d41\u6c34\u53f7\uff1a <%=Context.Current.Task.SerialNum %>\n\u6765\u81ea\uff1a <%=Context.Current.LoginUser.FriendlyName %>\n\u5185\u5bb9\u6458\u8981\uff1a\n <%=Context.Current.Task.Description %>\n\n <%=Context.Current.CreateProcessLinks() %>\n < a href=\"<%=BPM.Server.Server.WebsiteRootUrl%>/YZSoft/Forms/Process.aspx?tid=<%=Context.Current.Task.TaskID%>&pid=<%=Context.Current.Step.StepID%>\">Open Form</a>",
                //        "AttachmentsCode": ""
                //    }
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.MessageSettingDlg', {
                //    autoShow: true,
                //    title: "新任务通知",
                //    messageItems: [{
                //        "ProviderName": "Mail", "Enabled": true, "Inheri": false, "Title": "[\u5de5\u4f5c\u6d41][\u65b0\u4efb\u52a1]\u63d0\u4ea4\u4eba\uff1a<%=Initiator.UserFriendlyName%>\uff0c\u4e1a\u52a1\u540d\uff1a <%=Context.Current.Process.Name %>\uff0c\u6d41\u6c34\u53f7\uff1a <%=Context.Current.Task.SerialNum %>", "Message": "\u4e1a\u52a1\u540d\uff1a <%=Context.Current.Process.Name %>33\n\u63d0\u4ea4\u4eba\uff1a <%=Initiator.UserFriendlyName %>\n\u63d0\u4ea4\u65e5\u671f\uff1a <%=Context.Current.Task.CreateAt.ToString() %>\n\u6d41\u6c34\u53f7\uff1a <%=Context.Current.Task.SerialNum %>\n\u6765\u81ea\uff1a <%=Context.Current.LoginUser.FriendlyName %>\n\u5185\u5bb9\u6458\u8981\uff1a\n <%=Context.Current.Task.Description %>\n\n <%=Context.Current.CreateProcessLinks() %>\n < a href=\"<%=BPM.Server.Server.WebsiteRootUrl%>/YZSoft/Forms/Process.aspx?tid=<%=Context.Current.Task.TaskID%>&pid=<%=Context.Current.Step.StepID%>\">Open Form</a>", "AttachmentsCode": ""
                //    }, {
                //        "ProviderName": "SMS", "Enabled": true, "Inheri": false, "Title": null, "Message": null, "AttachmentsCode": ""
                //    }, {
                //        "ProviderName": "MSN", "Enabled": true, "Inheri": false, "Title": null, "Message": null, "AttachmentsCode": ""
                //    }, {
                //        "ProviderName": "QQ", "Enabled": true, "Inheri": false, "Title": null, "Message": null, "AttachmentsCode": ""
                //    }, {
                //        "ProviderName": "MobilePushNotification", "Enabled": true, "Inheri": false, "Title": null, "Message": "[<%=Context.Current.Step.NodeName%>]<%=Context.Current.Process.Name%>:<%=Initiator.UserInfo.ShortName%>", "AttachmentsCode": ""
                //    }],
                //    messageCatFieldConfig: {
                //        inheriable: false,
                //        messageFieldConfig: {
                //            messageCat: "NewTaskNormal",
                //            tables: [],
                //            inheriable: false,
                //            inheri: undefined
                //        }
                //    }
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.ParticipantDlg', {
                //    autoShow: true,
                //    title: RS.$('All_SelectParticipant'),
                //    tables: [{
                //        DataSourceName: 'Default',
                //        IsRepeatableTable: false,
                //        TableName: 'Purchase'
                //    }, {
                //        DataSourceName: 'Default',
                //        IsRepeatableTable: true,
                //        TableName: 'PurchaseDetail'
                //    }],
                //    stepNames: ["\u5f00\u59cb","\u4e1a\u52a1\u63a5\u5355","\u90e8\u957f\u5ba1\u6279","\u81ea\u7531\u7b7e\u6838","\u7ecf\u7406\u5ba1\u6279","\u73af\u4fdd\u90e8\u5ba1\u6279","\u5de5\u7a0b\u90e8\u5ba1\u6279","\u90e8\u957f\u5ba1\u62791","\u5c42\u7ea7\u5ba1\u6279\\\u5173\u53611","\u5c42\u7ea7\u5ba1\u6279\\\u5173\u53612","\u81ea\u7531\u7b7e\u68381","\u5f00\u59cb1"]
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SelInterfaceDlg', {
                //    autoShow: true,
                //    title: RS.$('Process_Title_SettingCallTarger'),
                //    interfaceStepNames: ['企业接口']
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SNFormatDlg', {
                //    autoShow: true,
                //    tables: [{
                //        "DataSourceName": "Default",
                //        "TableName": "Purchase",
                //        "IsRepeatableTable": false
                //    }, {
                //        "DataSourceName": "Default",
                //        "TableName": "PurchaseDetail",
                //        "IsRepeatableTable": true
                //    }],
                //    defaultField: "BPMInstTasks.SerialNum",
                //    value: {
                //        "SNTableName": "BPMInstTasks",
                //        "SNColumnName": "SerialNum",
                //        "SNPrefix": "REQ<%=DateTime.Today.ToString(\"yyyyMM\")%>",
                //        "SNColumns": 4,
                //        "SNFrom": 1,
                //        "SNIncrement": 1,
                //        "SNDesc": "REQyyyyMM{0001}"
                //    }
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.TableAndRelationshipDlg', {
                //    autoShow: true,
                //    value: {
                //        "TableIdentitys": [{
                //            "DataSourceName": "Default",
                //            "TableName": "Purchase",
                //            "IsRepeatableTable": false
                //        }],
                //        "DataRelationship": { "FKs": [] }
                //    }
                //});

                //Ext.create('YZSoft.bpm.taskrule.Dialog', {
                //    autoShow: true,
                //    ruleid: 356,
                //    title: RS.$('All_EditTaskRule')
                //});

                //Ext.create('YZSoft.esb.esb5.connect.JoinExcelPanel', {
                //    autoShow:true,
                //    closemethod: 'hide',
                //    plain: false,
                //    modal: true,
                //    formWidth: 600,
                //    title: Ext.String.format(RS.$('ESB_NewConnection'), 'Excel'),
                //    jointype: 'TheAdd'
                //});

                //Ext.create('YZSoft.esb.esb5.connect.JoinOraclePanel', {
                //    autoShow: true,
                //    closemethod: 'hide',
                //    plain: false,
                //    modal: true,
                //    formWidth: 600,
                //    title: Ext.String.format(RS.$('ESB_NewConnection'), 'Oracel'),
                //    jointype: 'TheAdd'
                //});

                //Ext.create('YZSoft.esb.esb5.connect.JoinSapPanel', {
                //    autoShow: true,
                //    closemethod: 'hide',
                //    plain: false,
                //    modal: true,
                //    formWidth: 600,
                //    title: Ext.String.format(RS.$('ESB_NewConnection'), 'SAP'),
                //    jointype: 'TheAdd'
                //});

                //Ext.create('YZSoft.esb.esb5.connect.JoinSqlPanel', {
                //    autoShow: true,
                //    closemethod: 'hide',
                //    plain: false,
                //    modal: true,
                //    formWidth: 600,
                //    title: Ext.String.format(RS.$('ESB_NewConnection'), 'SqlServer'),
                //    jointype: 'TheAdd'
                //});

                //Ext.create('YZSoft.esb.esb5.connect.JoinWebPanel', {
                //    autoShow: true,
                //    closemethod: 'hide',
                //    plain: false,
                //    modal: true,
                //    formWidth: 600,
                //    title: Ext.String.format(RS.$('ESB_NewConnection'), 'WebService'),
                //    jointype: 'TheAdd'
                //});

                //Ext.create('YZSoft.esb.esb5.source.JoinPanel', {
                //    autoShow: true,
                //    width: 500,
                //    closemethod: 'hide',
                //    plain: false,
                //    modal: true,
                //    title: RS.$('All_ConnectToServer'),
                //    sourceType: 3,
                //    sourceId: '',
                //    sourceName: '',
                //    connectId: ''
                //});

                //Ext.create('YZSoft.report.rpt.dialogs.ExcelViewDefineDlg', {
                //    autoShow: true,
                //    title: Ext.String.format(RS.$('Report_ViewProperty_New'), 'Excel'),
                //    columns: [{ "ColumnName": "City", "DataType": { "name": "String", "fullName": "System.String" }, "DisplayName": "\u57ce\u5e02" }, { "ColumnName": "Shop", "DataType": { "name": "String", "fullName": "System.String" }, "DisplayName": "\u95e8\u5e97" }, { "ColumnName": "Employee", "DataType": { "name": "String", "fullName": "System.String" }, "DisplayName": "\u9500\u552e\u5458" }, { "ColumnName": "Sales", "DataType": { "name": "Decimal", "fullName": "System.Decimal" }, "DisplayName": "\u9500\u552e\u989d" }],
                //    value: {
                //        ViewName: "Excel视图1",
                //        PageItems: 20
                //    }
                //});

                //Ext.create('YZSoft.report.rpt.dialogs.GridViewDefineDlg', {
                //    autoShow: true,
                //    title: Ext.String.format(RS.$('Report_ViewProperty_New'), 'Grid'),
                //    columns: [{ "ColumnName": "City", "DataType": { "name": "String", "fullName": "System.String" }, "DisplayName": "\u57ce\u5e02" }, { "ColumnName": "Shop", "DataType": { "name": "String", "fullName": "System.String" }, "DisplayName": "\u95e8\u5e97" }, { "ColumnName": "Employee", "DataType": { "name": "String", "fullName": "System.String" }, "DisplayName": "\u9500\u552e\u5458" }, { "ColumnName": "Sales", "DataType": { "name": "Decimal", "fullName": "System.Decimal" }, "DisplayName": "\u9500\u552e\u989d" }],
                //    value: {
                //        ViewName: "Grid视图1",
                //        PageItems: 20
                //    }
                //});

                //Ext.create('YZSoft.report.rpt.dialogs.MSChartViewDefineDlg', {
                //    autoShow: true,
                //    title: Ext.String.format(RS.$('Report_ViewProperty_New'), 'MSChart'),
                //    columns: [{ "ColumnName": "City", "DataType": { "name": "String", "fullName": "System.String" }, "DisplayName": "\u57ce\u5e02" }, { "ColumnName": "Shop", "DataType": { "name": "String", "fullName": "System.String" }, "DisplayName": "\u95e8\u5e97" }, { "ColumnName": "Employee", "DataType": { "name": "String", "fullName": "System.String" }, "DisplayName": "\u9500\u552e\u5458" }, { "ColumnName": "Sales", "DataType": { "name": "Decimal", "fullName": "System.Decimal" }, "DisplayName": "\u9500\u552e\u989d" }],
                //    value: {
                //        ViewName: "MSChart视图1",
                //        PageItems: 20
                //    }
                //});

                //Ext.create('YZSoft.report.rpt.dialogs.ParamsFillDlg', {
                //    autoShow: true,
                //    params: ["@Date1","@Date2","@ProcessName"],
                //    columns: [{"ColumnName":"ProcessName","DataType":{"name":"String","fullName":"System.String"}},{"ColumnName":"Counts","DataType":{"name":"Int32","fullName":"System.Int32"}},{"ColumnName":"LinkEmployee","DataType":{"name":"String","fullName":"System.String"}}],
                //    srcParams: [{"name":"ProcessName","value":"ProcessName"},{"name":"Counts","value":"Counts"},{"name":"LinkEmployee","value":"LinkEmployee"},{"name":"Params.@Date1","value":"Params.@Date1"},{"name":"Params.@Date2","value":"Params.@Date2"},{"name":"Params.@Counts","value":"Params.@Counts"}],
                //    fill: [{"Name":"@Date1","FillWith":"Params.@Date1"},{"Name":"@Date2","FillWith":"Params.@Date2"},{"Name":"@ProcessName","FillWith":"ProcessName"}]
                //});

                //Ext.create('YZSoft.src.dialogs.HeadshotDlg', {
                //    autoShow: true,
                //    uid: '99199'
                //});

                //Ext.create('YZSoft.src.dialogs.SignDlg', {
                //    autoShow: true,
                //    uid: '99199'
                //});

                //Ext.create('YZSoft.src.dialogs.JsonDlg', {
                //    title: Ext.String.format(RS.$('All_MobileFormSetting_JsonCfg_Title'), 'Reason'),
                //    caption: RS.$('All_MobileFormSetting_JsonCfg_Caption'),
                //    value: '',
                //    autoShow: true
                //});

                //Ext.create('YZSoft.src.dialogs.UrlDlg', {
                //    title: '添加链接',
                //    autoShow: true
                //});

                //Ext.require('YZSoft.src.dialogs.docked.Employee', function () {
                //    YZSoft.src.dialogs.docked.Employee.show('99199');
                //});


                //var dlg = Ext.create('YZSoft.report.testing.Dialog', {
                //    title: '报表测试',
                //    autoShow: true,
                //    dock: 'right',
                //    width:1000
                //    //uid:'99199'
                //});

               //dlg.setUid('99199');
               //dlg.show();

                //Ext.create('YZSoft.bpa.src.dialogs.AddGroupMemberDlg', {
                //    autoShow: true
                //});

                ///***输入-多页-属性***/
                //Ext.create('YZSoft.app.filesystem.FolderDlg', {
                //    title: Ext.String.format('文件夹 - {0}', 'U盘'),
                //    autoShow: true,
                //    folderid: 203
                //});

                //Ext.create('YZSoft.bpm.src.zone.FolderDlg', {
                //    autoShow: true,
                //    title: Ext.String.format('{0} - {1}', RS.$('All_Folder'), '集团总部'),
                //    rsid: "Process://集团总部",
                //    readOnly: false,
                //    path: "集团总部",
                //    securityResType: "ProcessFolder",
                //    perms: [{
                //        "PermName": "Read",
                //        "PermType": "Module", "PermDisplayName": "\u8bfb\u53d6", "Allow": true, "AllowDisabled": true, "Deny": false, "DenyDisabled": true
                //    }, {
                //        "PermName": "Write",
                //        "PermType": "Module", "PermDisplayName": "\u5199\u5165", "Allow": true, "AllowDisabled": true, "Deny": false, "DenyDisabled": true
                //    }, {
                //        "PermName": "Execute",
                //        "PermType": "Module", "PermDisplayName": "\u542f\u52a8\u6d41\u7a0b", "Allow": true, "AllowDisabled": true, "Deny": false, "DenyDisabled": true
                //    }, {
                //        "PermName": "TaskRead",
                //        "PermType": "Record", "PermDisplayName": "\u4efb\u52a1\u67e5\u770b", "Allow": true, "AllowDisabled": true, "Deny": false, "DenyDisabled": true
                //    }, {
                //        "PermName": "TaskAdmin",
                //        "PermType": "Record", "PermDisplayName": "\u4efb\u52a1\u7ba1\u7406", "Allow": true, "AllowDisabled": true, "Deny": false, "DenyDisabled": true
                //    }]
                //});

                //Ext.create('YZSoft.app.formservice.Dialog', {
                //    title: Ext.String.format('{0} - {1}', RS.$('All_FormApplication'), "EnvIssue"),
                //    readOnly: false,
                //    path: "Demo/EnvIssue",
                //    rsid: "FormService://Demo/EnvIssue",
                //    autoShow: true
                //});

                //Ext.create('YZSoft.app.library.LibDlg', {
                //    title: "财务部",
                //    autoShow: true,
                //    autoClose: false,
                //    libid: 12,
                //    perm: {
                //        "Write": true,
                //        "AssignPermision": true
                //    },
                //    logoConfig: {
                //        cls: 'yz-form-field-bpadoclib-logo',
                //        emptySrc: "BPA/Styles/ui/doc_icon.png"
                //    }
                //});

                //Ext.create('YZSoft.bpm.org.admin.OUDlg', {
                //    autoShow: true,
                //    title: Ext.String.format(RS.$('Org_OUProperty_Title'), "中国电科"),
                //    rsid: "c4d48b96-26a3-48d4-ae5b-01927642f4d0",
                //    readOnly: false,
                //    fullname: "BPMOU://中国电科"
                //});

                //Ext.create('YZSoft.bpm.src.flowchart.dialogs.Link', {
                //    autoShow: true,
                //    title: RS.$('All_LinkProperty'),
                //    generalPanelConfig: {
                //        showConfirmPanel: true,
                //        showConditionPanel: undefined,
                //        showDefaultRoutePanel: true,
                //        showVotePanel: undefined
                //    },
                //    data: {
                //        "DisplayString": "\u6838\u51c6",
                //        "ValidationGroup": "",
                //        "ProcessConfirmType": "None",
                //        "PromptMessage": null,
                //        "ConditionType": "True",
                //        "Events": []
                //    }
                //});

                //Ext.create('YZSoft.bpm.process.admin.Dialog', {
                //    autoShow: true,
                //    title: Ext.String.format('{0} - {1}', RS.$('All_ProcessProperty'), "采购申请"),
                //    readOnly: false,
                //    folder: '',
                //    processName: "采购申请",
                //    version: "3.7",
                //    rsid: "Process://采购申请"
                //});

                //Ext.create('YZSoft.bpm.src.flowchart.dialogs.Process', {
                //    autoShow: true,
                //    title: RS.$('All_ProcessProperty'),
                //    tables: [{
                //        "DataSourceName": "Default",
                //        "TableName": "Purchase",
                //        "IsRepeatableTable": false
                //    }, {
                //        "DataSourceName": "Default",
                //        "TableName": "PurchaseDetail",
                //        "IsRepeatableTable": true
                //    }],
                //    data: { "Active": true, "Property": { "TaskDescTemplate": "", "SNTableName": "BPMInstTasks", "SNColumnName": "SerialNum", "SNPrefix": "REQ<%=DateTime.Today.ToString(\"yyyyMM\")%>", "SNColumns": 4, "SNFrom": 1, "SNIncrement": 1, "SNDesc": "REQyyyyMM{0001}", "FormDataRelationshipType": "TaskID", "OrderIndex": 1, "Color": "#76dbb4", "DotNetEnv": { "ReferencedAssemblies": ["System.dll", "System.Transactions.dll", "BPM.dll", "BPM.Server.dll"], "Using": ["using System;", "using System.IO;", "using System.Text;", "using System.Transactions;", "using BPM;", "using BPM.Server;", "using BPM.Server.OAL;"] } }, "MessageGroups": [], "Events": [], "GlobalTableIdentitys": [] }
                //});

                //Ext.create('YZSoft.bpm.timesheet.PropertyDlg', {
                //    title: Ext.String.format('{0} - {1}', RS.$('All_WorkCalendarProperty'), '公司日历'),
                //    readOnly: false,
                //    sheetName: '公司日历',
                //    autoShow: true
                //});

                ///***输入-多页-大***/
                //Ext.create('YZSoft.app.formservice.FormStateDlg', {
                //    autoShow: true,
                //    title: Ext.String.format('{0} - {1}', RS.$('FormService_FormState'), "edit"),
                //    tables: [{
                //        "DataSourceName": "Default",
                //        "TableName": "Purchase",
                //        "IsRepeatableTable": false
                //    }],
                //    value: {
                //        "Name": "edit",
                //        "ShowSaveButton": true,
                //        "ValidationGroup": "",
                //        "ControlDataSet": {
                //            "Tables": []
                //        },
                //        "Events": []
                //    }
                //});

                //Ext.create('YZSoft.report.rpt.Admin.Dialog', {
                //    title: Ext.String.format('{0} - {1}', RS.$('Report_Title_Property'), '区域销售统计'),
                //    readOnly: false,
                //    path: "D11.Grid/区域销售统计",
                //    rsid: "Reports://D11.Grid/区域销售统计",
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpm.org.admin.MemberDlg', {
                //    autoShow: true,
                //    title: Ext.String.format(RS.$('Org_MemberProperty_Title'), '99199'),
                //    fullname: 'BPMOU://111111111/99199',
                //    parentou: 'BPMOU://111111111',
                //    fn: function (data) {
                //    }
                //});

                /*444444*/
                //Ext.create('YZSoft.bpm.org.admin.SelMoveTagOUDlg', {
                //    autoShow: true,
                //    ou: '',
                //    getRootOUsType: 'MoveOUTo',
                //    srcoupath: ''
                //});

                //Ext.create('YZSoft.bpm.taskoperation.AssignOwnerDlg', {
                //    autoShow: true,
                //    taskid: 281752
                //});

                //Ext.create('YZSoft.bpm.taskoperation.HandoverDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpm.taskoperation.InformDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpm.taskoperation.InviteIndicateDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpm.taskoperation.JumpDlg', {
                //    autoShow: true,
                //    title: Ext.String.format(RS.$('TaskOpt_Jump_Title'), 'REQ2008100004'),
                //    taskid: 281752
                //});

                //Ext.create('YZSoft.bpm.taskoperation.PickbackDlg', {
                //    autoShow: true,
                //    taskid: 281752
                //});

                //Ext.create('YZSoft.bpm.taskoperation.ReActiveDlg', {
                //    autoShow: true,
                //    taskid: 281752
                //});

                //Ext.create('YZSoft.bpm.taskoperation.RecedeBackDlg', {
                //    autoShow: true,
                //    stepid: 637846
                //});

                //Ext.create('YZSoft.bpm.taskoperation.RemindDlg', {
                //    autoShow: true,
                //    taskid: 281752
                //});

                //Ext.create('YZSoft.bpm.taskoperation.TaskRecedeBackDlg', {
                //    autoShow: true,
                //    taskid: 281752
                //});

                //Ext.create('YZSoft.bpm.taskoperation.TaskRepairDlg', {
                //    autoShow: true,
                //    title: Ext.String.format('{0} - {1}', RS.$('All_TaskRepair'), 'REQ2008100004'),
                //    taskid: 281752
                //});

                //Ext.create('YZSoft.bpm.taskoperation.TaskTransferDlg', {
                //    autoShow: true,
                //    taskid: 281752
                //});

                //Ext.create('YZSoft.bpm.taskoperation.TransferDlg', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.bpm.src.dialogs.SubmitAuthDlg', {
                //    autoShow: true,
                //    actionName: '核准',
                //});

                //555555
                //Ext.create('Ext.window.Window', {
                //    autoShow: true,
                //    title:'Other Windows',
                //    padding:'40 30',
                //    items: [{
                //        xtype: 'container',
                //        layout: {
                //            type: 'hbox',
                //            align: 'middle'
                //        },
                //        items: [{
                //            xtype: 'displayfield',
                //            value: 'YZSoft.src.ux.colorpick.Button',
                //            margin:'0 20 0 0'
                //        }, {
                //            xclass: 'YZSoft.src.ux.colorpick.Button'
                //        }]
                //    }]
                //});

                ///*666666*/
                //me.pnlIFrame = Ext.create('YZSoft.src.panel.IFramePanel', {
                //    url: 'http://www.baidu.com'
                //});

                //me.dlg = Ext.create('Ext.window.Window', {
                //    title: RS.$('All_DataBrowserWindowTitle'),
                //    autoShow: true,
                //    layout: 'fit',
                //    maximizable: true,
                //    bodyPadding: 5,
                //    width: 800,
                //    height:500,
                //    items: [me.pnlIFrame]
                //});

                /***实际环境测试***/
                //YZSoft.src.dialogs.ExcelExportDlg //打开带分页的报表->导出
                //YZSoft.bpa.sprite.ProcessDialog //打开BPA流程->流程属性

                //Ext.create('YZSoft.report.designer.dialogs.DataSource', {
                //    autoShow: true
                //});

                //Ext.create('YZSoft.report.designer.dialogs.SaveNewReportDlg', {
                //    autoShow: true
                //});

                YZSoft.src.ux.Push.subscribe({
                    cmp: me,
                    channel: ['worklistChanged', 'social', 'readed', 'taskApproved', 'taskRejected', 'processRemind'],
                    fn: function () {
                        YZSoft.src.ux.Push.on({
                            scope: me,
                            worklistChanged: 'onWorkListChanged',
                            social: function (message) {
                                //自己说话推送到自己
                                if (message.clientid != YZSoft.src.ux.Push.clientid)
                                    me.onNotify(message);
                            },
                            readed: function (message) {
                                //自己说话推送到自己
                                if (message.clientid != YZSoft.src.ux.Push.clientid) 
                                    me.onNotify(message);
                            },
                            taskApproved: 'onNotify',
                            taskRejected: 'onNotify',
                            processRemind: 'onNotify'
                        });
                    }
                });

                YZSoft.src.ux.Badge.fireEvent('badgeChange', 'worklistcount', userInfo.WorkListCount);
                YZSoft.src.ux.Badge.fireEvent('badgeChange', 'sharetaskcount', userInfo.ShareTaskCount);
            },
            failure: function (response) {
                YZSoft.alert(Ext.String.format(RS.$('All_LoadModuleFailed_Msg'), url, response.status == 404 ? response.statusText : (response.responseText || '')));
            }
        });
    },

    folder: function () {
        Ext.create('YZSoft.bpm.src.dialogs.SelFSSFolderDlg', {
            autoShow: true,
            serverName: 'localhost'
        });
    }
});