
Ext.define('YZSoft.bpa.document.view.LibrariesView', {
    extend: 'YZSoft.src.lib.View',
    requires: [
        'YZSoft.src.model.DocLibrary'
    ],
    cls: 'bpa-dataview-doclib',
    tpl: [
        '<tpl for=".">',
            '<div class="yz-dataview-item yz-dataview-item-block bpa-dataview-item-lib bpa-dataview-item-lib-doc">',
                '<div class="inner">',
                    '<img  class="img" src="{ImageUrl}"></img>',
                '</div>',
                '<div class="txt">',
                    '{Name:text}',
                '</div>',
            '</div>',
        '</tpl>'
    ],
    overItemCls: 'yz-dataview-item-over',
    selectedItemCls: 'yz-dataview-item-selected',
    itemSelector: '.bpa-dataview-item-lib',
    txtSelector: '.bpa-dataview-item-lib .txt',
    emptySrc: YZSoft.$url('BPA/Styles/ui/doc_icon.png'),
    libType:'BPADocument',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.src.model.DocLibrary',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/Library.ashx'),
                extraParams: {
                    Method: 'GetUserLibraries',
                    libType: me.libType
                }
            }
        });

        cfg = {
            store: me.store
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.store.load({});
    },

    edit: function (record,config) {
        var me = this;

        Ext.create('YZSoft.app.library.LibDlg', {
            title: record.data.Name,
            autoShow: true,
            autoClose: false,
            libid: record.data.LibID,
            perm: config.perm,
            logoConfig: {
                cls: 'yz-form-field-bpadoclib-logo',
                emptySrc: me.emptySrc
            },
            fn: function (data) {
                var dlg = this;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/Library.ashx'),
                    params: {
                        method: 'UpdateLibrary',
                        property: config.perm.Write,
                        acl: config.perm.AssignPermision,
                        libid: record.data.LibID
                    },
                    jsonData: data,
                    waitMsg: {
                        msg: RS.$('All_LoadMask_Updating'),
                        target: dlg,
                        start: 0
                    },
                    success: function (action) {
                        me.store.reload({
                            loadMask: {
                                msg: RS.$('All_Toast_Updated'),
                                msgCls: 'yz-mask-msg-success',
                                target: dlg,
                                start: 0
                            },
                            callback: function () {
                                dlg.close();
                            }
                        });
                    }
                });
            }
        });
    },

    addnew: function () {
        var me = this,
            loginuserACE;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
            params: { method: 'GetLoginUserACEInfo' },
            success: function (action) {
                loginuserACE = action.result;
            }
        });

        Ext.create('YZSoft.app.library.LibDlg', {
            title: RS.$('BPA_AddLib'),
            autoShow: true,
            autoClose: false,
            logoConfig: {
                cls: 'yz-form-field-bpadoclib-logo',
                emptySrc: me.emptySrc
            },
            acl: {
                aces: [{
                    SIDType: 'GroupSID',
                    SID: 'S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B',
                    AllowPermision: ['FullControl'],
                    DenyPermision: [],
                    Inherited: true,
                    Inheritable: true,
                    DisplayName: 'Administrators'
                }, {
                    SIDType: 'GroupSID',
                    SID: 'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',
                    AllowPermision: ['Read'],
                    DenyPermision: [],
                    Inherited: false,
                    Inheritable: true,
                    DisplayName: 'Everyone'
                }, Ext.apply({
                    SIDType: 'UserSID',
                    AllowPermision: ['Read', 'Write', 'AssignPermision'],
                    DenyPermision: [],
                    Inherited: false,
                    Inheritable: true
                }, loginuserACE)]
            },
            fn: function (data) {
                var dlg = this;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/Library.ashx'),
                    params: {
                        method: 'CreateLibrary',
                        libType: me.libType,
                        FolderID: 'Document'
                    },
                    jsonData: data,
                    waitMsg: {
                        msg: RS.$('All_LoadMask_Creating'),
                        target: dlg,
                        start: 0
                    },
                    success: function (action) {
                        me.store.reload({
                            loadMask: {
                                msg: RS.$('All_Toast_Created'),
                                msgCls: 'yz-mask-msg-success',
                                target: dlg,
                                start: 0
                            },
                            callback: function (records, options, success) {
                                var sm = me.getSelectionModel(),
                                    rec = me.store.getById(action.result.LibID);

                                dlg.close();

                                if (rec)
                                    sm.select(rec);
                            }
                        });
                    }
                });
            }
        });
    }
});