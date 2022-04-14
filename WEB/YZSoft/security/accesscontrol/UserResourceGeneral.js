/*
mode
*/
Ext.define('YZSoft.security.accesscontrol.UserResourceGeneral', {
    extend: 'Ext.panel.Panel',
    title: RS.$('All_General'),
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            mode = config.mode,
            cfg;

        me.btnGenGuid = Ext.create('Ext.button.Button', {
            text: RS.$('All_GenGuid'),
            disabled: mode == 'edit',
            margin: '0 0 0 3',
            handler: function () {
                var refs = me.getReferences();
            
                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
                    params: { method: 'GenGuid' },
                    success: function (action) {
                        refs.edtRSID.setValue(action.result.guid);
                    }
                });
            }
        });

        cfg = {
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: RS.$('Security_FormField_RSGuid'),
                    reference: 'edtRSID',
                    disabled: mode == 'edit',
                    width: 400
                }, me.btnGenGuid, { xtype: 'tbfill' }, {
                    xtype: 'numberfield',
                    fieldLabel: RS.$('All_DisplayIndex'),
                    width: 160,
                    reference: 'edtOrderIndex',
                    labelWidth: 'auto',
                    minValue: 0,
                    value: 0,
                    allowDecimals: false
                }]
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Security_FormField_RSName'),
                reference: 'edtResourceName',
                cls: 'yz-field-required',
                width: 400
            }, {
                xclass: 'YZSoft.bpm.src.editor.ResourcePermField',
                flex: 1,
                fieldLabel: RS.$('Security_FormField_RSPerms'),
                reference: 'edtPerms',
                labelAlign: 'top'
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        refs.edtRSID.setValue(data.resource.RSID);
        refs.edtOrderIndex.setValue(data.resource.OrderIndex);
        refs.edtResourceName.setValue(data.resource.ResourceName);

        refs.edtPerms.setValue(data.perms);
    },

    save: function () {
        var me = this,
            refs = me.getReferences();

        var resource = {
            resource: {
                RSID: refs.edtRSID.getValue(),
                OrderIndex: refs.edtOrderIndex.getValue(),
                ResourceName: refs.edtResourceName.getValue()
            },
            perms: refs.edtPerms.getValue()
        };

        return resource;
    }
});