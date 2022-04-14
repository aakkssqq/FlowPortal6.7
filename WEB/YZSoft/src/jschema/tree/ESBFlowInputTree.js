
Ext.define('YZSoft.src.jschema.tree.ESBFlowInputTree', {
    extend: 'YZSoft.src.jschema.tree.SpecificSchemaInputTree',
    config: {
        flowName:null
    },

    updateFlowName: function (value) {
        this.$refresh();
    },

    $refresh: function (cfg) {
        var me = this,
            flowName = me.getFlowName();

        if (!flowName)
            return;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/ESB/Flow/Service.ashx'),
            params: {
                method: 'GetFlowInputSchema',
                flowName: flowName
            },
            success: function (action) {
                me.setSchema(action.result);
                cfg && cfg.fn && cfg.fn(services, ports);
            }
        }, cfg));
    }
});