/*
config:
relatedFile
*/
Ext.define('YZSoft.esb.sprites.K3WISE.propertypages.General', {
    extend: 'Ext.form.Panel',
    requires: [
        'YZSoft.src.form.field.ConnectionField'
    ],
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },

    initComponent: function () {
        var me = this,
            designer = me.designer,
            sprite = me.sprite,
            properties = sprite.properties,
            dcnt = designer.drawContainer;

        me.edtName = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_NodeName'),
            value: sprite.sprites.text.attr.text,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                sprite.sprites.text.setAttributes({
                    text: value
                });

                dcnt.renderFrame();
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.mon(sprite, {
            rename: function (sprite, newName) {
                me.edtName.setValue(newName);
            }
        });

        me.cmbConnection = Ext.create('YZSoft.src.form.field.ConnectionField', {
            fieldLabel: RS.$('ESB_NodeConnectionName'),
            connectionType: 'K3WISE',
            value: properties.connectionName,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.connectionName = value;
            },
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {
                    this.applySetting();
                }
            }
        });

        me.edtAPI = Ext.create('Ext.form.field.Text', {
            fieldLabel: 'API',
            emptyText: Ext.String.format(RS.$('ESB_EmptyText_Example'), 'Bill1000020'),
            value: properties.api,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.api = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.cmbMethod = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('ESB_K3WISE_method'),
            store: {
                fields: ['name', 'value'],
                data: [
                    //{ name: '获取模板', value: 'GetTemplate' },
                    { name: RS.$('ESB_K3WISE_method_GetList'), value: 'GetList' },
                    { name: RS.$('ESB_K3WISE_method_GetDetail'), value: 'GetDetail' },
                    { name: RS.$('ESB_K3WISE_method_Save'), value: 'Save' },
                    { name: RS.$('ESB_K3WISE_method_Update'), value: 'Update' },
                    { name: RS.$('ESB_K3WISE_method_Delete'), value: 'Delete' },
                    { name: RS.$('ESB_K3WISE_method_CheckBill'), value: 'CheckBill' }
               ]
            },
            displayField: 'name',
            valueField: 'value',
            editable: false,
            forceSelection: true,
            triggerAction: 'all',
            value: properties.method,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.method = value;
            },
            listeners: {
                change: 'applySetting'
            }
        });

        me.chkJsonBugFix = Ext.create('Ext.form.field.Checkbox', {
            fieldLabel: RS.$('ESB_K3WISE_JsonBugFix'),
            value: properties.jsonBugFix,
            boxLabel: RS.$('ESB_K3WISE_JsonBugFix_Desc'),
            applySetting: function () {
                var value = this.getValue();
                properties.jsonBugFix = value;
            },
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {
                    this.applySetting();
                }
            }
        });

        me.items = [me.edtName, me.cmbConnection, me.edtAPI, me.cmbMethod, me.chkJsonBugFix];
        me.callParent();

        me.relayEvents(me.cmbConnection, ['select'], 'cn');
        me.relayEvents(me.edtAPI, ['change'], 'api');
        me.relayEvents(me.cmbMethod, ['select'], 'method');
    }
});