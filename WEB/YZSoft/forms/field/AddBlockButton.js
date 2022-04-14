
Ext.define('YZSoft.forms.field.AddBlockButton', {
    extend: 'YZSoft.forms.field.Button',

    getEleTypeConfig: function () {
        var me = this,
            config = me.callParent(arguments);

        Ext.apply(config, {
            datasourceName: me.getAttribute('DataSource') || 'Default',
            tableName: me.getAttribute('TableName')
        });

        return config;
    },

    onClick: function (e) {
        var me = this,
            et = me.getEleType();

        e.stopEvent();

        if (!et.tableName)
            return;

        me.agent.appendBlock(me.dom, et.tableName);
    }
});