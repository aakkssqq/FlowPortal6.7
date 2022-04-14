Ext.define('YZSoft.bpm.src.form.field.ProcessNameComboBox', {
    extend: 'Ext.form.field.ComboBox',
    requires: ['YZSoft.bpm.src.model.ProcessInfo'],
    xtype: 'yz-bpe-processname-cmb',

    constructor: function (config) {
        var store,
            cfg;
        
        store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.ProcessInfo',
            data: [{ ProcessName: config.allText || RS.$('All_SearchAll'), value: ''}],
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Process.ashx'),
                extraParams: {
                    method: 'GetAllProcessNames'
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        store.load({ async: false, addRecords: true });

        cfg = {
            store: store,
            displayField: 'ProcessName',
            valueField: 'value',
            typeAhead: true,
            typeAheadDelay: 0,
            minChars: 1,
            queryMode: 'local',
            emptyText: RS.$('All_SelProcessPromptText'),
            selectOnFocus: true,
            allowBlank: true,
            listConfig: {
                minWidth:180
            }
        };

        Ext.apply(cfg, config);
        cfg.value = cfg.value || '';

        this.callParent([cfg]);
    }
});