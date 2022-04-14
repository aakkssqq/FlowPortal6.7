Ext.define('YZSoft.bpm.src.form.field.AssistComboBox', {
    extend: 'Ext.form.field.ComboBox',
    requires: [
        'YZSoft.bpm.src.model.Name'
    ],
    valueField: 'value',
    queryMode: 'local',
    displayField: 'name',
    editable: true,
    typeAhead: true,
    typeAheadDelay: 0,
    minChars: 1,
    allowBlank: true,
    url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
    method:'GetLeaderTitles',

    constructor: function (config) {
        var me = this,
            url = config.url || me.url,
            method = config.method || me.method;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.Name',
            proxy: {
                type: 'ajax',
                url: url,
                extraParams: { method: method }
            }
        });

        me.store.load(/*{ async: false }*/);

        var cfg = {
            store: me.store
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});