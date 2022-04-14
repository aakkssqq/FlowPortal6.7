/*
config
grid
allowExportAll
maxExportPages
defaultRadio : current/all/range default current
radioDisabled : true/false default false
fileName : export file name
params : 附加参数

btnConfig:
{
}

events:
beforeload
*/

Ext.define('YZSoft.src.button.ExcelExportButton', {
    extend: 'Ext.button.Button',
    glyph: 0xeb2a,
    disabled: true,
    text: RS.$('All_ExportToExcel'),

    constructor: function (config) {
        var me = this;

        config = config || {};
        me.dlgcfg = config;
        config = Ext.apply({
        }, config.btnConfig);

        me.callParent(arguments);

        if (me.dlgcfg.grid)
            me.bindGrid(me.dlgcfg.grid);
    },

    bindGrid: function (grid) {
        var me = this,
            store = grid.getStore();

        me.grid = grid;
        store.on({
            datachanged: function () {
                me.setDisabled(store.getTotalCount() == 0)
            }
        });
    },

    handler: function () {
        var me = this,
            grid = me.grid;

        //导出源不正确
        if (!grid || !grid.getStore() || !grid.getStore().getProxy())
            return;

        //没有可以导出的数据
        if (grid.getStore().getTotalCount() == 0)
            return;

        //执行导出
        Ext.create('YZSoft.src.dialogs.ExcelExportDlg', Ext.apply({
            autoShow: true
        }, me.dlgcfg));
    }
});