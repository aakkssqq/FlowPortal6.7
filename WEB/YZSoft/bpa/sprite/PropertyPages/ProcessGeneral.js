/*
config:
*/
Ext.define('YZSoft.bpa.sprite.PropertyPages.ProcessGeneral', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('BPA_Title_BasicProperty'),

    constructor: function (config) {
        var me = this,
            evcProcessType = config.evcProcessType,
            cfg;

        cfg = {
            items: [{
                xtype: 'displayfield',
                fieldLabel: RS.$('BPA__ProcessName'),
                name: 'Name',
                margin: 0
            }, {
                xtype: 'container',
                margin: '0 0 0 0',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: RS.$('BPA__FileCode'),
                    width: 300,
                    name: 'Code'
                }, {
                    xtype: 'textfield',
                    fieldLabel: RS.$('BPA_OrderCode'),
                    padding: '0 0 0 30',
                    labelWidth: 80,
                    width: 240,
                    name: 'Order'
                }, {
                    xtype: 'textfield',
                    fieldLabel: RS.$('BPA__Version'),
                    padding: '0 0 0 30',
                    labelWidth: 54,
                    width: 160,
                    name: 'Version',
                    reference: 'Version'
                }]
            }, {
                xtype: 'container',
                margin: '31 0 5 0',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xclass: 'YZSoft.bpa.src.form.field.SpritesField',
                    fieldLabel: RS.$('BPA__Owner'),
                    width: 300,
                    name: 'Owner',
                    dlgConfig: {
                        groupid: config.groupid,
                        folderType: 'BPAOU'
                    }
                }, {
                    xtype: 'datefield',
                    fieldLabel: RS.$('BPA__ReleaseDate'),
                    padding: '0 0 0 30',
                    editable: false,
                    labelWidth: 80,
                    width: 240,
                    name: 'ReleaseDate'
                }]
            }, {
                xtype: 'container',
                margin: '0 0 5 0',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xclass: 'YZSoft.bpa.src.form.field.SpritesField',
                    fieldLabel: RS.$('BPA__Auditor'),
                    width: 300,
                    name: 'Auditor',
                    dlgConfig: {
                        groupid: config.groupid,
                        folderType: 'BPAOU'
                    }
                }, {
                    xtype: 'datefield',
                    fieldLabel: RS.$('BPA__AuditDate'),
                    padding: '0 0 0 30',
                    editable: false,
                    labelWidth: 80,
                    width: 240,
                    name: 'AuditDate'
                }]
            }, {
                xtype: 'container',
                margin: '0 0 5 0',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xclass: 'YZSoft.bpa.src.form.field.SpritesField',
                    fieldLabel: RS.$('BPA__Approval'),
                    width: 300,
                    name: 'Approval',
                    dlgConfig: {
                        groupid: config.groupid,
                        folderType: 'BPAOU'
                    }
                }, {
                    xtype: 'datefield',
                    fieldLabel: RS.$('BPA__ApproveDate'),
                    padding: '0 0 0 30',
                    editable: false,
                    labelWidth: 80,
                    width: 240,
                    name: 'ApproveDate'
                }]
            }, {
                xtype: 'container',
                margin: '31 0 5 0',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'combo',
                    fieldLabel: RS.$('BPA__MilestonePeriod'),
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            { value: 'Planning', name: RS.$('BPA_Milestone_Planning') },
                            { value: 'Discover', name: RS.$('BPA_Milestone_Discover') },
                            { value: 'Design', name: RS.$('BPA_Milestone_Design') },
                            { value: 'Development', name: RS.$('BPA_Milestone_Development') },
                            { value: 'Testing', name: RS.$('BPA_Milestone_Testing') },
                            { value: 'Launch', name: RS.$('BPA_Milestone_Launch') },
                            { value: 'Suspend', name: RS.$('BPA_Milestone_Suspend') }
                        ]
                    },
                    width: 300,
                    editable: false,
                    valueField: 'value',
                    displayField: 'name',
                    name: 'Milestone',
                    value: 'Planning'
                }, {
                    xtype: 'datefield',
                    fieldLabel: RS.$('BPA__MilestoneSince'),
                    padding: '0 0 0 30',
                    editable: false,
                    labelWidth: 80,
                    width: 240,
                    name: 'Since'
                }]
            }, {
                xtype: 'combo',
                fieldLabel: RS.$('ReportDesigner_Seg_Color'),
                margin: '31 0 5 0',
                store: {
                    fields: ['name', 'value'],
                    data: [
                        { value: 'White', name: RS.$('BPA_Color_White') },
                        { value: 'Pink', name: RS.$('BPA_Color_Pink') },
                        { value: 'Yellow', name: RS.$('BPA_Color_Yellow') },
                        { value: 'LightBlue', name: RS.$('BPA_Color_LightBlue') },
                        { value: 'LightGray', name: RS.$('BPA_Color_LightGray') },
                        { value: 'Gray', name: RS.$('BPA_Color_Gray') }
                    ]
                },
                width: 300,
                editable: false,
                valueField: 'value',
                displayField: 'name',
                name: 'Color',
                value: 'White'
            }, {
                xtype: 'combo',
                fieldLabel: RS.$('BPA__ExecuteStatus'),
                margin: '0 0 5 0',
                store: {
                    fields: ['name', 'value'],
                    data: [
                        { value: 'NoExecute', name: RS.$('BPA_Status_NoExecute') },
                        { value: 'Regulation', name: RS.$('BPA_Status_Regulation') },
                        { value: 'PartialOnlineExecute', name: RS.$('BPA_Status_PartialOnlineExecute') },
                        { value: 'CompleteOnlineExecute', name: RS.$('BPA_Status_CompleteOnlineExecute') }
                    ]
                },
                width: 300,
                editable: false,
                valueField: 'value',
                displayField: 'name',
                name: 'ExecuteStatus',
                value: 'NoExecute'
            }, {
                xtype: 'combo',
                fieldLabel: RS.$('BPA__EvcProcessType'),
                store: {
                    fields: ['name', 'value'],
                    data: [
                        { value: 'StrategicProcess', name: RS.$('BPA_ProcessType_Strategic') },
                        { value: 'OperationProcess', name: RS.$('BPA_ProcessType_Operation') }
                    ]
                },
                width: 300,
                editable: false,
                hidden: evcProcessType != 'StrategicProcess' && evcProcessType != 'OperationProcess',
                valueField: 'value',
                displayField: 'name',
                name: 'EvcProcessType',
                value: 'StrategicProcess'
            }, {
                xtype: 'displayfield',
                fieldLabel: RS.$('All_UpdateDate'),
                name: 'LastChange',
                margin: 0
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        data.CreateAt = Ext.Date.format(data.CreateAt, 'Y-m-d H:i');
        data.LastChange = Ext.Date.format(data.LastChange, 'Y-m-d H:i');
        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();

        Ext.each(['ReleaseDate', 'AuditDate', 'ApproveDate', 'Since'], function (prop) {
            rv[prop] = Ext.Date.format(rv[prop], 'Y-m-d');
        });

        return rv;
    },

    updateStatus: function () {
    }
});