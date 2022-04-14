/*
groupid
*/
Ext.define('YZSoft.app.group.GroupDlg', {
    extend: 'Ext.window.Window', //222222
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],
    layout: {
        type: 'vbox',
        align:'center'
    },
    width: 540,
    modal: true,
    resizable: false,
    bodyPadding: '15 26 15 26',
    buttonAlign: 'right',
    defaultFocus: 'name',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.edtLogo = Ext.create('YZSoft.src.form.field.Image', {
            emptySrc: YZSoft.$url('BPA/Styles/ui/group_icon.png'),
            width: 167,
            height: 145,
            margin:'0 0 30 0',
            cls: 'yz-form-field-group-logo',
            download: {
                url: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'),
                params: {
                    Method: 'ImageStreamFromFileID',
                    scale: 'Scale',
                    width: 161,
                    height: 139
                }
            }
        });

        me.edtName = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('GroupDlg_Name'),
            labelAlign: 'top',
            cls: 'yz-field-required',
            itemId: 'name',
            listeners: {
                scope: me,
                change: 'updateStatus'
            }
        });

        me.edtDesc = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: RS.$('GroupDlg_Desc'),
            labelAlign: 'top'
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
            handler: function () {
                me.closeDialog(me.save());
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            defaults: {
                width:'100%'
            },
            items: [me.edtLogo,
                me.edtName,
                me.edtDesc
            ],
            buttons: [me.btnOK, me.btnCancel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.groupid) {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                params: {
                    method: 'GetGroup',
                    groupid: config.groupid
                },
                success: function (action) {
                    me.fill(action.result);
                }
            });
        }

        me.updateStatus();
    },

    fill: function (libInfo) {
        var me = this;

        me.libInfo = libInfo;
        me.edtLogo.setValue(libInfo.ImageFileID);
        me.edtName.setValue(libInfo.Name);
        me.edtDesc.setValue(libInfo.Desc);
    },

    save: function (libInfo) {
        var me = this,
            rv = {};

        Ext.apply(rv, {
            ImageFileID: me.edtLogo.getValue(),
            Name: me.edtName.getValue(),
            Desc: me.edtDesc.getValue()
        });

        return rv;
    },

    updateStatus: function () {
        var me = this,
            data = me.save();

        me.btnOK.setDisabled(!data.Name);
    }
});