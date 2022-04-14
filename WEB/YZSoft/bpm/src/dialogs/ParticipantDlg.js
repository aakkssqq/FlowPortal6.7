/*
config
tables,
stepNames,
recp
*/

Ext.define('YZSoft.bpm.src.dialogs.ParticipantDlg', {
    extend: 'Ext.window.Window', //222222
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    width: 580,
    height:635,
    modal: true,
    maximizable: true,
    bodyPadding: '0 20',
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg;

        me.panel = Ext.create('YZSoft.bpm.src.dialogs.participant.MainPanel', {
            dlg: me,
            tables: config.tables,
            stepNames: config.stepNames,
            recp: config.recp,
            height:250
        });

        me.edtDisplayString = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_DisplayString'),
            labelAlign: 'top'
        });

        me.edtExpress = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: RS.$('All_Code'),
            flex:1,
            labelAlign: 'top',
            inputAttrTpl: new Ext.XTemplate([
                'wrap="off"'
            ])
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                me.closeDialog(me.value);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        me.pnlDebug = Ext.create('Ext.form.field.TextArea', {
            height: 80,
            hidden: true
        });

        cfg = {
            buttons: [me.btnCancel, me.btnOK],
            defaults: {
                labelAlign: 'top'
            },
            items: [{
                xtype: 'fieldset',
                title: RS.$('Process_FieldSet_ParticipantInfo'),
                minHeight: 220,
                layout: 'fit',
                items: [me.panel]
            },
            me.pnlDebug,
            me.edtDisplayString,
            me.edtExpress]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.panel.on({
            change: function () {
                me.updateStatusExt();
            }
        });

        me.edtDisplayString.on({
            change: function () {
                var recp = me.save();
                if (recp.data.ParticipantType == 'Custom')
                    me.updateStatusExt();
            }
        });

        me.edtExpress.on({
            change: function () {
                var recp = me.save();
                if (recp.data.ParticipantType == 'Custom')
                    me.updateStatusExt(true);
            }
        });

        me.updateStatus(me.recp ? me.recp.data : {});
    },

    save: function () {
        var rec = this.panel.save();
        if (rec.data.ParticipantType == 'Custom') {
            Ext.apply(rec.data, {
                SParam1: this.edtDisplayString.getValue(),
                Express: this.edtExpress.getValue()
            });
        }

        return rec;
    },

    updateStatusExt: function (prevendUpdateExpress) {
        var me = this,
            recp = Ext.clone(this.save().data);

        delete recp.id;
        me.pnlDebug.setValue(Ext.encode(recp));
        me.btnOK.setDisabled(true);

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Participant.ashx'),
            params: { method: 'CheckParticipant' },
            jsonData: [recp],
            success: function (action) {
                var recp = action.result[0];
                me.updateStatus(recp, prevendUpdateExpress);
            },
            failure: function (action) {
            }
        });
    },

    updateStatus: function (recp, prevendUpdateExpress) {
        var me = this;

        recp = recp || {};

        me.btnOK.setDisabled(!recp.IsValid);
        if (recp.IsValid) {
            me.edtDisplayString.setValue(recp.RuntimeDisplayString || recp.DisplayString);

            if (prevendUpdateExpress !== true)
                me.edtExpress.setValue(recp.Express);
        }
        me.edtDisplayString.setReadOnly(recp.ParticipantType != 'Custom');
        me.edtExpress.setReadOnly(recp.ParticipantType != 'Custom');
        me.value = recp;
    }
});