/*
taskid:
*/
Ext.define('YZSoft.bpm.taskoperation.TaskRepairDlg', {
    extend: 'Ext.window.Window', //444444
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],
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

        me.edtCloseSteps = Ext.create('YZSoft.src.form.field.List', {
            fieldLabel: RS.$('All_CancelSteps'),
            renderItem: function (step) {
                return Ext.String.format('{0}({1})', step.NodeDisplayName, YZSoft.bpm.src.ux.Render.renderStepRecipientExt(step, true));
            },
            triggers: {
                browser: {
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
                        me.dlgSrc = Ext.create('YZSoft.bpm.taskoperation.SelProcessingStepDlg', {
                            title: RS.$('All_CancelSteps'),
                            taskid: config.taskid,
                            grid: {
                                title:RS.$('All_Caption_SelCancelSteps'),
                                singleSelection: false,
                                allowEmptySelection:true
                            },
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

        me.edtCreateNodes = Ext.create('YZSoft.src.form.field.List', {
            fieldLabel: RS.$('All_CreateSteps'),
            renderItem: function (step) {
                return Ext.String.format('{0}', step.NodeName);
            },
            triggers: {
                browser: {
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
                            title: RS.$('All_CreateSteps'),
                            grid: {
                                title: RS.$('All_Caption_SelCreateSteps'),
                                selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'SIMPLE' }),
                                allowEmptySelection:true
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

        me.edtComments = Ext.create('Ext.form.field.TextArea', Ext.apply({
            fieldLabel: RS.$('All_RepairComments'),
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
                me.closeDialog(me.edtCloseSteps.getValue(),me.edtCreateNodes.getValue(), me.edtComments.getValue());
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
                info: RS.$('All_TaskRepairCfm_Msg')
            }
        });

        cfg = {
            dockedItems: [me.informPanel],
            defaults: {
                labelSeparator: '',
                anchor: '100%'
            },
            items: [me.edtCloseSteps, me.edtCreateNodes, me.edtComments],
            buttons: [me.btnOK, me.btnCancel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    destroy: function () {
        Ext.destroy(this.edtCloseSteps);
        Ext.destroy(this.edtCreateNodes);
        this.callParent(arguments);
    },

    updateStatus: function () {
        var closeSteps = this.edtCloseSteps.getValue(),
            createNodes = this.edtCreateNodes.getValue(),
            comments = this.edtComments.getValue();

        this.btnOK.setDisabled((closeSteps.length == 0 && createNodes.length == 0) || !comments);
    }
});