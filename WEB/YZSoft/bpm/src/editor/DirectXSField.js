/*
config
storeConfig
gridConfig
*/

Ext.define('YZSoft.bpm.src.editor.DirectXSField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.bpm.src.model.DirectXS'],
    layout: 'fit',

    constructor: function (config) {
        var me = this,
            config = config || {};

        me.store = Ext.create('Ext.data.JsonStore', Ext.apply({
            model: 'YZSoft.bpm.src.model.DirectXS',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        }, config.storeConfig || me.storeConfig));

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            store: me.store,
            border: true,
            flex: 1,
            selModel: { mode: 'MULTI' },
            columns: {
                defaults: {
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { text: RS.$('All_Account'), dataIndex: 'UserAccount', width: 120 },
                    { text: RS.$('All_UserDisplayName'), dataIndex: 'UserFullName', width: 80 },
                    { text: RS.$('All_BelongOU'), dataIndex: 'MemberFullName', flex: 1 },
                    { text: RS.$('All_FGYW'), dataIndex: 'FGYWs', width: 120, renderer: me.renderFGYWs }
                ]
            }
        }, config.gridConfig || me.gridConfig));

        var cfg = {
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    renderFGYWs: function (value, metaData, rec) {
        if (rec.data.FGYWEnabled)
            return YZSoft.Render.renderString(value.join(','));
        else
            return RS.$('All_AllYW');
    },

    setValue: function (value) {
        this.store.removeAll();
        this.store.add(value);
    },

    getValue: function () {
        return [];
    }
});