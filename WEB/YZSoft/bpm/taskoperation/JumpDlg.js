/*
taskid:
*/
Ext.define('YZSoft.bpm.taskoperation.JumpDlg', {
    extend: 'Ext.window.Window', //444444
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],
    title: RS.$('TaskOpt_Jump_DlgTitle'),
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

        me.edtFromSteps = Ext.create('YZSoft.src.form.field.List', {
            fieldLabel: RS.$('All_From'),
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
                    if (!me.dlgSrc) {
                        me.dlgSrc = Ext.create('YZSoft.bpm.taskoperation.SelJumpSrcStepDlg', {
                            title: RS.$('All_Caption_SelJumpSrcStep'),
                            taskid: config.taskid,
                            closeAction: 'hide',
                            fn: function (steps) {
                                editor.setValue(steps);
                            }
                        });
                    }
                    me.dlgSrc.show();
                },
                change: function () {
                    me.updateStatus();
                }
            }
        });

        me.edtToNode = Ext.create('YZSoft.src.form.field.List', {
            fieldLabel: RS.$('All_To'),
            renderItem: function (step) {
                return Ext.String.format('{0}', step.NodeName);
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
                        me.dlgTag = Ext.create('YZSoft.bpm.taskoperation.SelJumpTagStepDlg', {
                            title: RS.$('All_Caption_SelJumpTagStep'),
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

        me.edtComments = Ext.create('Ext.form.field.TextArea', Ext.apply({
            fieldLabel: RS.$('All_JumpComments'),
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
                me.closeDialog(me.edtFromSteps.getValue(),me.edtToNode.getValue()[0], me.edtComments.getValue());
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
                info: RS.$('All_JumpCfm_Msg')
            }
        });

        cfg = {
            dockedItems: [me.informPanel],
            defaults: {
                labelSeparator: '',
                anchor: '100%'
            },
            items: [me.edtFromSteps, me.edtToNode, me.edtComments],
            buttons: [me.btnOK, me.btnCancel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    destroy: function () {
        Ext.destroy(this.edtFromSteps);
        Ext.destroy(this.edtToNode);
        this.callParent(arguments);
    },

    updateStatus: function () {
        var fromsteps = this.edtFromSteps.getValue(),
            tosteps = this.edtToNode.getValue(),
            comments = this.edtComments.getValue();

        this.btnOK.setDisabled(fromsteps.length == 0 || tosteps.length == 0 || !comments);
    }
});