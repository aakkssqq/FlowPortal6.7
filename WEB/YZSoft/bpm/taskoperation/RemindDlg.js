/*
    taskid
*/
Ext.define('YZSoft.bpm.taskoperation.RemindDlg', {
    extend: 'Ext.window.Window', //444444
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],
    title: RS.$('All_Remind'),
    cls: 'yz-window-prompt',
    layout: 'anchor',
    width: 500,
    modal: true,
    resizable: false,
    bodyPadding: '26 26 0 26',
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            chkitems=[],
            cfg, steps;

        YZSoft.Ajax.request({
            async:false,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Task.ashx'),
            params: {
                method: 'GetRemindTarget',
                taskid: config.taskid
            },
            success: function (action) {
                steps = action.result;
            }
        });

        Ext.each(steps, function (step) {
            chkitems.push({
                boxLabel: Ext.String.format(RS.$(step.Share ? 'All_RemindTarget_ShareItem' : 'All_RemindTarget_NormalItem'), step.NodeDisplayName, step.ShortName, Ext.util.Format.toElapsedString(step.ElapsedMinutes)),
                stepid: step.StepID,
                uid: step.Account
            });
        });

        me.cntTarget = Ext.create('Ext.form.FieldContainer', {
            fieldLabel: RS.$('All_RemindTarget'),
            cls:'yz-field-conatiner-fullwidth',
            items: [{
                xtype: 'container',
                maxHeight: 160,
                scrollable: true,
                defaults: {
                    xclass: 'Ext.form.field.Checkbox',
                    checked: true,
                    margin:0,
                    listeners: {
                        change: function () {
                            me.updateStatus();
                        }
                    }
                },
                items: chkitems
            }]
        });

        me.edtComments = Ext.create('Ext.form.field.TextArea', Ext.apply({
            fieldLabel: RS.$('All_RemindComments'),
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
                me.closeDialog(me.getTargets(), me.edtComments.getValue());
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
                info: RS.$('All_RemindCfm_Msg')
            }
        });

        cfg = {
            dockedItems: [me.informPanel],
            defaults: {
                labelSeparator: '',
                anchor: '100%'
            },
            items: [me.cntTarget,me.edtComments],
            buttons: [me.btnOK, me.btnCancel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    destroy: function () {
        this.callParent(arguments);
    },

    getTargets: function () {
        var me = this,
            items = this.cntTarget.items.getAt(0).items.items,
            tmp = {},rv = [];

        Ext.each(items, function (chkbox) {
            if (chkbox.checked) {
                var stepid = chkbox.stepid,
                    uid = chkbox.uid;

                tmp[stepid] = tmp[stepid] || [];
                tmp[stepid].push(uid);
            }
        });

        Ext.Object.each(tmp, function (stepid) {
            rv.push({
                stepid: Number(stepid),
                uids: tmp[stepid]
            });
        });

        return rv;
    },

    updateStatus: function () {
        var me = this,
            targets = me.getTargets(),
            comments = me.edtComments.getValue();

        me.btnOK.setDisabled(targets.length == 0);
    }
});