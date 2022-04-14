
Ext.define('YZSoft.src.menu.LangPicker', {
    extend: 'Ext.menu.Menu',
    requires: ['Ext.util.Cookies'],
    bodyBorder: false,
    showSeparator: false,

    constructor: function (config) {
        var me = this,
            cfg;

        me.picker = Ext.create('YZSoft.src.picker.Language', {
        });

        cfg = {
            items: [me.picker]
        };

        me.callParent([cfg]);

        me.relayEvents(me.picker, ['select'], 'picker');
        me.on({
            scope: me,
            pickerSelect: 'onPickerSelect'
        });
    },

    onPickerSelect: function (picker, value, record) {
        Ext.menu.Manager.hideAll();

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
            params: {
                method: 'SetLanguage',
                lcid: value
            },
            success: function () {
                window.location.reload(true);
            }
        });
    }
});