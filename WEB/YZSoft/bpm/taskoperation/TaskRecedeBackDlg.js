/*
stepid:
*/
Ext.define('YZSoft.bpm.taskoperation.TaskRecedeBackDlg', {
    extend: 'Ext.window.Window', //444444
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],
    title: RS.$('All_RecedebackCfm'),
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
                            title: RS.$('All_TaskRecedeback'),
                            grid: {
                                singleSelection: true,
                                title: RS.$('All_SelectRecedebackSrcStep')
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

        me.edtToSteps = Ext.create('YZSoft.src.form.field.List', {
            fieldLabel: RS.$('All_RecedebackTo'),
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
                    var editor = this,
                        fromsteps = me.edtFromSteps.getValue();

                    if (fromsteps.length == 0) {
                        YZSoft.alert(RS.$('All_SelectRecedebackSrcStepFirst'));
                        return;
                    }

                    Ext.create('YZSoft.bpm.taskoperation.SelRecedeBackStepDlg', {
                        autoShow:true,
                        title: RS.$('TaskOpt_RecedeBack_Title'),
                        stepid: fromsteps[0].StepID,
                        fn: function (steps) {
                            editor.setValue(steps);
                        }
                    });
                },
                change: function () {
                    me.updateStatus();
                }
            }
        });

        me.edtComments = Ext.create('Ext.form.field.TextArea', Ext.apply({
            fieldLabel: RS.$('All_RecedebackComments'),
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
                me.closeDialog(me.edtFromSteps.getValue()[0], me.edtToSteps.getValue(), me.edtComments.getValue());
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
                info: RS.$('All_RecedebackCfm_Msg')
            }
        });
        
        cfg = {
            dockedItems: [me.informPanel],
            defaults: {
                labelSeparator: '',
                anchor: '100%'
            },
            items: [me.edtFromSteps, me.edtToSteps, me.edtComments],
            buttons: [me.btnOK, me.btnCancel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    destroy: function () {
        Ext.destroy(this.edtFromSteps);
        Ext.destroy(this.edtToSteps);
        this.callParent(arguments);
    },

    updateStatus: function () {
        var fromSteps = this.edtFromSteps.getValue(),
            toSteps = this.edtToSteps.getValue(),
            comments = this.edtComments.getValue();

        this.btnOK.setDisabled(fromSteps.length != 1 || toSteps.length == 0 || !comments);
    }
});