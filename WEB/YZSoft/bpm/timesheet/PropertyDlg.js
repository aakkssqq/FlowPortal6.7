/*
config:
sheetName
readOnly
*/
Ext.define('YZSoft.bpm.timesheet.PropertyDlg', {
    extend: 'Ext.window.Window', //333333
    layout: 'fit',
    width: 580,
    height: 628,
    modal: true,
    resizable: false,
    buttonAlign: 'right',
    bodyPadding:0,
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            mode = me.mode = 'sheetName' in config ? 'edit' : 'new',
            cfg;

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: config.readOnly,
            handler: function () {
                me.submit(function (group) {
                    me.closeDialog(group);
                });
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        me.pnlGeneralCfg = {
            title: RS.$('All_General'),
            layout: 'vbox',
            padding: '26 26 0 26',
            defaults: {
                width: '100%'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_WorkCalendarName'),
                reference: 'edtName',
                width:320,
                listeners: {
                    change: function () {
                        me.updateStatus();
                    }
                }
            }, {
                xtype: 'fieldset',
                title: RS.$('All_ValidPeriod'),
                padding: '2 18 10 25',
                layout: 'vbox',
                items: [{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaults: {
                        listeners: {
                            change: function () {
                                me.updateStatus();
                            }
                        }
                    },
                    items: [{
                        xtype: 'checkbox',
                        reference: 'chkFromDate',
                        boxLabel: RS.$('All_PeriodFrom'),
                        width: 89
                    }, {
                        xtype: 'datefield',
                        reference: 'edtFromDate',
                        labelSeparator: false,
                        width: 180
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaults: {
                        listeners: {
                            change: function () {
                                me.updateStatus();
                            }
                        }
                    },
                    items: [{
                        xtype: 'checkbox',
                        reference: 'chkToDate',
                        boxLabel: RS.$('All_PeriodTo'),
                        width: 89
                    }, {
                        xtype: 'datefield',
                        reference: 'edtToDate',
                        labelSeparator: false,
                        width: 180
                    }]
                }]
            }]
        };

        me.pnlApplyToCfg = {
            title: RS.$('All_ApplyToSIDs'),
            padding: '15 26 0 26',
            layout: 'fit',
            items: [{
                xclass: 'YZSoft.bpm.src.editor.ApplyToField',
                reference: 'edtSIDs',
                fieldLabel: RS.$('All_Caption_ApplyToSIDs'),
                labelAlign: 'top',
                height: 260
            }]
        };

        cfg = {
            buttons: [me.btnOK, me.btnCancel],
            items: [{
                xclass: 'Ext.tab.Panel',
                reference: 'tabMain',
                tabBar: {
                    cls: 'yz-tab-bar-window-main'
                },
                defaults: {
                    xtype: 'panel'
                },
                items: [me.pnlGeneralCfg, me.pnlApplyToCfg]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.getReferences().edtName.focus();

        if (mode == 'edit') {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TimeSheet.ashx'),
                params: { method: 'GetTimeSheetDefine', sheetName: config.sheetName },
                success: function (action) {
                    me.fill(action.result);
                }
            });
        }
        else {
            YZSoft.Ajax.request({
                method: 'POST',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Participant.ashx'),
                params: { method: 'CheckParticipant' },
                jsonData: [{
                    ParticipantType: 'SpecifiedUser',
                    LParam1: 17,
                    Include: true
                }],
                success: function (action) {
                    me.fill({
                        ValidatePeriod: {},
                        ApplayTo: action.result
                    });
                },
                failure: function (action) {
                    YZSoft.alert(action.result.errorMessage);
                }
            });
        }

        me.updateStatus();
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        refs.edtName.setValue(data.Name);
        refs.chkFromDate.setValue(data.ValidatePeriod.UseFrom);
        refs.edtFromDate.setValue(data.ValidatePeriod.FromDate);
        refs.chkToDate.setValue(data.ValidatePeriod.UseTo);
        refs.edtToDate.setValue(data.ValidatePeriod.ToDate);

        refs.edtSIDs.setValue(data.ApplayTo);

    },

    save: function () {
        var me = this,
            refs = me.getReferences();

        var data = {
            Name: Ext.String.trim(refs.edtName.getValue()),
            ValidatePeriod: {
                UseFrom: refs.chkFromDate.getValue(),
                FromDate: refs.edtFromDate.getValue(),
                UseTo: refs.chkToDate.getValue(),
                ToDate: refs.edtToDate.getValue()
            },
            ApplayTo: refs.edtSIDs.getValue()
        };

        return data;
    },

    submit: function (fn, scope) {
        var me = this,
            refs = me.getReferences(),
            data = me.save();

        if (me.validate(data) === false)
            return;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/TimeSheet.ashx'),
            params: {
                method: 'SaveTimeSheet',
                mode: me.mode,
                sheetName: me.sheetName
            },
            jsonData: [data],
            waitMsg: {
                msg: RS.$('All_Saving'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.mask({
                    msg: RS.$('All_Save_Succeed'),
                    msgCls: 'yz-mask-msg-success',
                    autoClose: true,
                    fn: function () {
                        fn && fn.call(scope, data);
                    }
                });
            }
        });
    },

    validate: function (data) {
        var me = this,
            refs = me.getReferences(),
            period = data.ValidatePeriod;

        try {
            var err = $objname(data.Name);
            if (err !== true) {
                Ext.Error.raise({
                    msg: err,
                    fn: function () {
                        refs.tabMain.setActiveTab(0);
                        refs.edtName.focus()
                    }
                });
            }

            if (period.UseFrom && !period.FromDate) {
                Ext.Error.raise({
                    msg: RS.$('All_EnterValidPeriodStartDate'),
                    fn: function () {
                        refs.tabMain.setActiveTab(0);
                        refs.edtFromDate.focus()
                    }
                });
            }

            if (period.UseTo && !period.ToDate) {
                Ext.Error.raise({
                    msg: RS.$('All_EnterValidPeriodEndDate'),
                    fn: function () {
                        refs.tabMain.setActiveTab(0);
                        refs.edtToDate.focus()
                    }
                });
            }
        }
        catch (e) {
            YZSoft.alert(e.message, function () {
                if (e.fn)
                    e.fn.call(e.scope || this, e);
            });
            return false;
        }
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            data = me.save();

        me.btnOK.setDisabled(me.readOnly || !data.Name);
    }
});