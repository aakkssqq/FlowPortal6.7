/*
config:
tables
*/
Ext.define('YZSoft.bpm.propertypages.CallProcessGeneral', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_General'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            defaults: {
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_StepName'),
                name: 'Name',
                reference: 'edtName'
            }, {
                xtype: 'fieldcontainer',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                fieldLabel: RS.$('Process_CallProcess_CrossServer'),
                margin: 0,
                items: [{
                    xtype: 'checkbox',
                    boxLabel: RS.$('Process_CallProcess_CrossServer_BoxLabel'),
                    name: 'CrossServer',
                    reference: 'chkCrossServer',
                    listeners: {
                        scope: me,
                        change: 'updateStatus'
                    }
                }, {
                    xclass: 'YZSoft.bpm.src.form.field.ExtServerField',
                    fieldLabel: '',
                    serverTypes: 'BPMServer',
                    name: 'ServerName',
                    reference: 'edtServerName'
                }]
            }, {
                xclass: 'YZSoft.bpm.src.form.field.ProcessNameField',
                fieldLabel: RS.$('Process_ChildProcessName'),
                name: 'CallProcess',
                listeners: {
                    beforeShowDlg: function () {
                        var data = me.save();
                        this.bpmServer = data.ServerName;
                    }
                }
            }, {
                xclass: 'YZSoft.bpm.src.form.field.FormFieldField',
                fieldLabel: RS.$('Process_CallProcess_SaveTaskID'),
                name: 'ChildTaskIDSaveField',
                tables: config.tables
            }, {
                xtype: 'checkbox',
                fieldLabel: RS.$('Process_CallProcess_SyncCall'),
                boxLabel: RS.$('Process_CallProcess_SyncCall_BoxLabel'),
                margin: '3 0 1 0',
                name: 'WaitingChildProcessReturn'
            }, {
                xtype: 'checkbox',
                fieldLabel: RS.$('Process_CallProcess_StartActivity'),
                boxLabel: RS.$('Process_CallProcess_StartActivity_BoxLabel'),
                name: 'ApporveStartStep'
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            getCallProcess: function (call) {
                var rv = me.save();
                return Ext.copyTo(call, rv, 'ServerName,CallProcess');
            }
        });
    },

    fill: function (data) {
        if (data.ServerName)
            data.CrossServer = true;

        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();

        if (!rv.CrossServer)
            rv.ServerName = '';

        delete rv.CrossServer;
        return rv;
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences();

        refs.edtServerName.setDisabled(!refs.chkCrossServer.getValue());
    }
});