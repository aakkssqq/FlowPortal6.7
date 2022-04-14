
Ext.define('YZSoft.forms.field.BrowserButtonBase', {
    extend: 'YZSoft.forms.field.Button',

    getEleTypeConfig: function () {
        var me = this,
            config = me.callParent(arguments),
            appmodel = me.getAppendModelLow();

        Ext.apply(config, {
            filterNoAffect: true,
            multiSelect: me.getMultiSelect(),
            appendModel: appmodel == 'append' ? me.AppendModel.Append : (appmodel == 'clearandappend' ? me.AppendModel.ClearAndAppend : me.AppendModel.RemoveEmptyRow),
            sDataMap: me.getMap()
        });

        return config;
    },

    doMap: function (rows, options) {
        var me = this,
            et = me.getEleType();

        if (!et || !et.DataMap)
            return;

        rows = rows || [];
        if (!et.multiSelect) {
            var row = rows[0] || {};
            me.doMapSingline(row, et.DataMap.kvs);
        }
        else {
            me.doMapMultiLine(rows, et.DataMap.kvs, et.appendModel, options);
        }
    }
});