/*
config:
*/
Ext.define('YZSoft.bpm.propertypages.DllPluginGeneral', {
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

        me.storeTypes = Ext.create('Ext.data.JsonStore', {
            autoLoad: false,
            fields: ['FullName'],
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Assembly.ashx'),
                extraParams: { method: 'GetTypes' }
            }
        });

        me.storeMethods = Ext.create('Ext.data.JsonStore', {
            autoLoad: false,
            fields: ['MethodDefine'],
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Assembly.ashx'),
                extraParams: { method: 'GetMethods' }
            }
        });

        cfg = {
            defaults: {
                margin: '0 0 4 0'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_StepName'),
                name: 'Name',
                reference: 'edtName'
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_Assembly'),
                items: [{
                    xclass: 'YZSoft.bpm.src.form.field.AssemblyField',
                    name: 'DllName',
                    reference: 'edtDllName',
                    editable: false,
                    width: 280,
                    margin: 0,
                    listeners: {
                        scope: me,
                        change: 'onDllChanged'
                    }
                }]
            }, {
                xtype: 'combobox',
                fieldLabel: RS.$('All_Class'),
                name: 'TypeName',
                reference: 'cmbTypeName',
                editable: false,
                queryMode: 'local',
                store: me.storeTypes,
                valueField: 'FullName',
                displayField: 'FullName',
                listeners: {
                    scope: me,
                    change: 'onTypeChanged'
                }
            }, {
                xtype: 'combobox',
                fieldLabel: RS.$('All_Method'),
                name: 'MethodDefine',
                reference: 'cmbMethodDefine',
                editable: false,
                queryMode: 'local',
                store: me.storeMethods,
                valueField: 'MethodDefine',
                displayField: 'MethodDefine',
                listeners: {
                    scope: me,
                    change: 'onMethodChanged'
                }
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('All_FuncPrototype'),
                cls: ['yz-textarea-2line','yz-textarea-codesuggest'],
                reference: 'labMethodDefine'
            }, {
                xclass: 'YZSoft.bpm.src.editor.ParamsField',
                flex: 1,
                fieldLabel: RS.$('All_ParamsIn'),
                labelAlign: 'top',
                labelClsExtra: 'yz-lab-highlight',
                tables: config.tables,
                name: 'Params',
                reference: 'edtParams'
            }]
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
            refs = me.getReferences(),
            methodRec = refs.cmbMethodDefine.getSelection(),
            rv;

        rv = me.getValuesSubmit();
        if (methodRec)
            rv.MethodName = methodRec.data.MethodName;

        return rv;
    },

    onDllChanged: function () {
        var me = this,
            refs = me.getReferences(),
            dllName = Ext.String.trim(refs.edtDllName.getValue() || '');

        me.storeTypes.removeAll();
        refs.cmbTypeName.setValue(null);

        if (!dllName)
            return;

        me.storeTypes.load({ params: { assembly: dllName }, async: false });
    },

    onTypeChanged: function () {
        var me = this,
            refs = me.getReferences(),
            dllName = Ext.String.trim(refs.edtDllName.getValue() || ''),
            typeFullName = Ext.String.trim(refs.cmbTypeName.getValue() || '');

        me.storeMethods.removeAll();
        refs.cmbMethodDefine.setValue(null);

        if (!typeFullName)
            return;

        me.storeMethods.load({ params: { assembly: dllName, typeFullName: typeFullName }, async: false });
    },

    onMethodChanged: function () {
        var me = this,
            refs = me.getReferences(),
            dllName = Ext.String.trim(refs.edtDllName.getValue() || ''),
            typeFullName = Ext.String.trim(refs.cmbTypeName.getValue() || ''),
            methodRec = refs.cmbMethodDefine.getSelection();

        refs.labMethodDefine.setValue('');
        refs.edtParams.clear();

        if (!methodRec)
            return;

        refs.labMethodDefine.setValue(methodRec.data.MethodDefine);
        refs.edtParams.setParams(methodRec.data.Params);
    },

    updateStatus: function () {
    }
});