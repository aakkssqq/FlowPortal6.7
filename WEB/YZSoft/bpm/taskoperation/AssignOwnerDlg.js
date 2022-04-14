/*
*/
Ext.define('YZSoft.bpm.taskoperation.AssignOwnerDlg', {
    extend: 'Ext.window.Window', //444444
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],
    title: RS.$('All_ChangeOwner'),
    cls: 'yz-window-prompt',
    layout: 'anchor',
    width: 500,
    modal: true,
    resizable: false,
    bodyPadding: '26 26 0 26',
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.edtSteps = Ext.create('YZSoft.src.form.field.List', Ext.apply({
            fieldLabel: RS.$('All_DecisionStep'),
            renderItem: function (step) {
                var recp = YZSoft.bpm.src.ux.Render.renderStepRecipientExt(step, true);
                return Ext.String.format('{0}({1})', step.NodeDisplayName || step.NodeName, recp || RS.$('All_StepRecipientEmpty'));
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
                            title: RS.$('All_ChangeOwner'),
                            grid: {
                                title: RS.$('All_Caption_ChangeOwnerSelStep')
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
        },config.stepsConfig));

        me.edtUsers = Ext.create('YZSoft.src.form.field.Members', {
            fieldLabel: RS.$('All_NewOwner'),
            singleSelection:true,
            listeners: {
                change: function () {
                    me.updateStatus();
                }
            }
        });

        me.edtComments = Ext.create('Ext.form.field.TextArea', Ext.apply({
            fieldLabel: RS.$('All_ChangeOwnerReason'),
            grow: true,
            listeners: {
                change: function () {
                    me.updateStatus();
                }
            }
        }, $S.msgTextArea));

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
            handler: function () {
                me.closeDialog(me.edtSteps.getValue(),me.edtUsers.getValue()[0], me.edtComments.getValue());
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        me.informPanel = Ext.create('Ext.Component', {
            cls: 'yz-window-info',
            padding: '0 20 20 26',
            tpl: [
                '<div class="text">{info:text}</div>'
            ],
            data: {
                info: RS.$('All_ChangeOwnerCfm_Msg')
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
        Ext.destroy(this.edtSteps);
        Ext.destroy(this.edtUser);
        this.callParent(arguments);
    },

    updateStatus: function () {
        var steps = this.edtSteps.getValue(),
            users = this.edtUsers.getValue(),
            comments = this.edtComments.getValue();

        this.btnOK.setDisabled(steps.length == 0 || users.length == 0 || !comments);
    }
});