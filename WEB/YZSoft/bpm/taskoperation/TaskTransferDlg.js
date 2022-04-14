/*
*/
Ext.define('YZSoft.bpm.taskoperation.TaskTransferDlg', {
    extend: 'Ext.window.Window', //444444
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],
    title: RS.$('All_Transfer'),
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

        me.edtSteps = Ext.create('YZSoft.src.form.field.List', {
            fieldLabel: RS.$('All_DecisionStep'),
            renderItem: function (step) {
                return Ext.String.format('{0}({1})', step.NodeDisplayName, YZSoft.bpm.src.ux.Render.renderStepRecipientExt(step, true));
            },
            triggers: {
                search: {
                    cls: 'yz-trigger-step',
                    handler: function () {
                        this.onBrowser();
                    }
                }
            },
            listeners: {
                browserClick: function (values) {
                    var editor = this;
                    if (!me.dlgTag) {
                        me.dlgTag = Ext.create('YZSoft.bpm.taskoperation.SelProcessingStepDlg', {
                            title: RS.$('All_TaskTransfer'),
                            grid: {
                                title:RS.$('All_Caption_SelTransferSrcStep')
                            },
                            taskid: config.taskid,
                            closeAction: 'hide',
                            fn: function (steps) {
                                editor.setValue(steps);
                            }
                        });
                    }
                    me.dlgTag.show();
                },
                change: function () {
                    me.updateStatus();
                }
            }
        });

        me.edtUsers = Ext.create('YZSoft.src.form.field.Members', {
            fieldLabel: RS.$('All_TransferTo'),
            singleSelection:true,
            listeners: {
                change: function () {
                    me.updateStatus();
                }
            }
        });

        me.edtComments = Ext.create('Ext.form.field.TextArea', Ext.apply({
            fieldLabel: RS.$('All_TransferComments'),
            grow: true,
            listeners: {
                change: function () {
                    me.updateStatus();
                }
            }
        }, $S.msgTextArea));

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                me.closeDialog(me.edtSteps.getValue(),me.edtUsers.getValue(), me.edtComments.getValue());
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
                info: RS.$('All_TransferCfm_Msg')
            }
        });
        
        cfg = {
            dockedItems: [me.informPanel],
            defaults: {
                labelSeparator: '',
                anchor: '100%'
            },
            items: [me.edtSteps, me.edtUsers, me.edtComments],
            buttons: [me.btnOK, me.btnCancel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    destroy: function () {
        Ext.destroy(this.edtUser);
        this.callParent(arguments);
    },

    updateStatus: function () {
        var steps = this.edtSteps.getValue(),
            users = this.edtUsers.getValue(),
            comments = this.edtComments.getValue();

        this.btnOK.setDisabled(steps.length == 0 || users.length == 0);
    }
});