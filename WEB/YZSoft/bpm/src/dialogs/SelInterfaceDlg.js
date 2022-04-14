/*
config
*/

Ext.define('YZSoft.bpm.src.dialogs.SelInterfaceDlg', {
    extend: 'Ext.window.Window', //222222
    requires: [
    ],
    layout: 'fit',
    width: 545,
    modal: true,
    resizable: false,
    bodyPadding: '0 20',
    buttonAlign: 'right',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            config = config || {},
            interfaceStepNameData = [],
            cfg;

        Ext.each(config.interfaceStepNames, function (name) {
            interfaceStepNameData.push({ Name: name });
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                me.closeDialog(me.save());
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            handler: function () {
                me.close();
            }
        });

        me.form = Ext.create('Ext.form.Panel', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'fieldset',
                title: RS.$('All_Server'),
                padding: '5 20 6 20',
                style: 'background-color:transparent;',
                items: [{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [{
                        xtype: 'radio',
                        name: 'ElementType',
                        inputValue: 'ServerName',
                        boxLabel: RS.$('All_SpecServer'),
                        width: 120,
                        value: true,
                        listeners: {
                            scope: me,
                            change: 'updateStatus'
                        }
                    }, {
                        xclass: 'YZSoft.bpm.src.form.field.ExtServerField',
                        flex: 1,
                        serverTypes: ['Local', 'BPMServer'],
                        name: 'SParam11',
                        reference: 'edtServer'
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [{
                        xtype: 'radio',
                        name: 'ElementType',
                        inputValue: 'SameAsStep',
                        boxLabel: RS.$('Process_Interface_SameAsStep'),
                        width: 120,
                        listeners: {
                            scope: me,
                            change: 'updateStatus'
                        }
                    }, {
                        xtype: 'combo',
                        flex: 1,
                        name: 'SParam21',
                        reference: 'edtStep',
                        store: {
                            fields: ['Name'],
                            data: interfaceStepNameData
                        },
                        editable: false,
                        queryMode: 'local',
                        valueField: 'Name',
                        displayField: 'Name'
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [{
                        xtype: 'radio',
                        name: 'ElementType',
                        inputValue: 'TriggerTask',
                        boxLabel: RS.$('Process_Interface_TriggerTask'),
                        listeners: {
                            scope: me,
                            change: 'updateStatus'
                        }
                    }]
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('All_CallInterface'),
                padding: '5 20 13 40',
                style:'background-color:transparent;',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: RS.$('All_Process_InterfaceName'),
                    name: 'InterfaceName',
                    width: '100%'
                }]
            }]
        });

        cfg = {
            items: [me.form],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.value)
            me.fill(config.value);

        me.updateStatus();
    },

    fill: function (data) {
        data = Ext.apply({}, data);

        if (data.ElementType == 'ServerName')
            data.SParam11 = data.SParam1;

        if (data.ElementType == 'SameAsStep')
            data.SParam21 = data.SParam1;

        delete data.SParam1;

        this.form.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var data = this.form.getValuesSubmit();

        if (data.ElementType == 'ServerName')
            data.SParam1 = data.SParam11;

        if (data.ElementType == 'SameAsStep')
            data.SParam1 = data.SParam21;

        delete data.SParam11;
        delete data.SParam21;

        return data;
    },

    show: function (config) {
        config = config || {};

        if (config.title)
            this.setTitle(config.title);

        if (config.fn) {
            this.fn = config.fn;
            this.scope = config.scope;
        }

        this.callParent();
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            data = me.save();

        refs.edtServer.setDisabled(data.ElementType != 'ServerName');
        refs.edtStep.setDisabled(data.ElementType != 'SameAsStep');
    }
});