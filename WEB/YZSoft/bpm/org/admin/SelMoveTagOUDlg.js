/*
getRootOUsType
srcoupath
*/
Ext.define('YZSoft.bpm.org.admin.SelMoveTagOUDlg', {
    extend: 'Ext.window.Window', //444444
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],
    title: RS.$('All_MoveOU_Title'),
    cls: 'yz-window-prompt',
    layout: 'anchor',
    width: 500,
    modal: true,
    resizable: false,
    bodyPadding: '26 26 0 26',
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg;

        if (config.objects) {
            me.edtObjects = Ext.create('YZSoft.src.form.field.OUObjects', {
                fieldLabel: RS.$('Org_MoveSrc_Object'),
                value: config.objects,
                listeners: {
                    change: function () {
                        me.updateStatus();
                    }
                }
            });
        }
        else {
            me.edtObjects = Ext.create('Ext.form.field.Text', {
                fieldLabel: RS.$('Org_MoveSrc_OU'),
                value: config.ou,
                editable:false
            });
        }

        me.edtOU = Ext.create('YZSoft.src.form.field.OU', {
            fieldLabel: RS.$('Org_MoveTag'),
            getRootOUsType: config.getRootOUsType,
            srcoupath: config.srcoupath,
            listeners: {
                change: function () {
                    me.updateStatus();
                }
            }
        });

        me.chkCopy = Ext.create('Ext.form.field.Checkbox', {
            fieldLabel: RS.$('Org_Move_CopyModel'),
            boxLabel: RS.$('Org_Move_CopyModel_BoxLabel')
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                var data = {
                    objects: me.edtObjects.getValue(),
                    ou: me.edtOU.getValue(),
                    copy: me.chkCopy.getValue()
                };

                me.closeDialog(data);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        me.informPanel = Ext.create('Ext.Component', {
            cls:'yz-window-info',
            padding: '0 20 20 26',
            tpl: [
                '<div class="text">{info:text}</div>'
            ],
            data: {
                info: RS.$('Org_Move_Prompt_Desc')
            }
        });

        cfg = {
            dockedItems: [me.informPanel],
            defaults: {
                labelSeparator: '',
                anchor: '100%'
            },
            items: [me.edtObjects, me.edtOU, me.chkCopy],
            buttons: [me.btnOK, me.btnCancel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    updateStatus: function () {
        var me = this,
            objects = me.edtObjects.getValue(),
            ou = me.edtOU.getValue();

        me.btnOK.setDisabled(objects.length == 0 || !ou);
    }
});