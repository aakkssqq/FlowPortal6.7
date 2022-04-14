/*
config:
*/
Ext.define('YZSoft.src.dialogs.CallRESTful.General', {
    extend: 'Ext.form.Panel',
    layout: 'anchor',

    constructor: function (config) {
        var me = this,
            cfg;

        me.edtUrl = Ext.create('Ext.form.field.Text', {
            fieldLabel: config.labelUrl,
            name: 'url'
        });

        me.cmbMethod = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('ESB_RESTful_method'),
            name: 'method',
            store: {
                fields: ['name', 'value'],
                data: [
                    { name: 'GET', value: 'GET' },
                    { name: 'POST', value: 'POST' }
                ]
            },
            displayField: 'name',
            valueField: 'value',
            editable: false,
            forceSelection: true,
            triggerAction: 'all'
        });

        me.request = Ext.create('Ext.form.FieldContainer', {
            fieldLabel: RS.$('Connection_RESTful_requestDataFormat'),
            layout: 'hbox',
            margin: 0,
            items: [{
                xtype: 'combobox',
                width: 120,
                name: 'requestDataFormat',
                store: {
                    fields: ['name', 'value'],
                    data: [
                        { value: 'JSON', name: 'JSON' },
                        { value: 'XML', name: 'XML' }
                    ]
                },
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                editable: false,
                forceSelection: true
            }, { xtype: 'tbspacer', width: 30 }, {
                xtype: 'displayfield',
                value: RS.$('Connection_RESTful_Encode') + ':',
            }, { xtype: 'tbspacer', width: 12 },{
                xtype: 'combobox',
                width: 120,
                name: 'requestDataEncoding',
                store: {
                    fields: ['name', 'value'],
                    data: [
                        { value: 20127, name: 'ASCII' },
                        { value: 936, name: 'GB2312' },
                        { value: 950, name: 'BIG5' },
                        { value: 932, name: 'JIS' },
                        { value: 65001, name: 'UTF-8' },
                        { value: 1200, name: 'Unicode' }
                    ]
                },
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                editable: false,
                forceSelection: true
            }]
        });

        me.response = Ext.create('Ext.form.FieldContainer', {
            fieldLabel: RS.$('Connection_RESTful_responseDataFormat'),
            layout: 'hbox',
            margin: 0,
            items: [{
                xtype: 'combobox',
                width: 120,
                name: 'responseDataFormat',
                store: {
                    fields: ['name', 'value'],
                    data: [
                        { value: 'JSON', name: 'JSON' },
                        { value: 'XML', name: 'XML' }
                    ]
                },
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                editable: false,
                forceSelection: true
            }, { xtype: 'tbspacer', width: 30 }, {
                xtype: 'displayfield',
                value: RS.$('Connection_RESTful_Decode') + ':',
            }, { xtype: 'tbspacer', width: 12 }, {
                xtype: 'combobox',
                width: 120,
                name: 'responseDataEncoding',
                store: {
                    fields: ['name', 'value'],
                    data: [
                        { value: 20127, name: 'ASCII' },
                        { value: 936, name: 'GB2312' },
                        { value: 950, name: 'BIG5' },
                        { value: 932, name: 'JIS' },
                        { value: 65001, name: 'UTF-8' },
                        { value: 1200, name: 'Unicode' }
                    ]
                },
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                editable: false,
                forceSelection: true
            }]
        });

        cfg = {
            defaults: {
                anchor: '100%',
                msgTarget: 'under'
            },
            items: [
                me.edtUrl,
                me.cmbMethod,
                me.request,
                me.response
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            rv;

        rv = me.getValuesSubmit();
        return rv;
    },

    updateStatus: function () {
    }
});