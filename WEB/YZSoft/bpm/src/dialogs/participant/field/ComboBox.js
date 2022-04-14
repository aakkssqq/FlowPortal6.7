
Ext.define('YZSoft.bpm.src.dialogs.participant.field.ComboBox', {
    extend: 'Ext.form.field.ComboBox',

    constructor: function (config) {
        var cfg = {
        };

        Ext.apply(cfg, config);
        this.callParent([cfg]);
    }
});