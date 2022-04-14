
Ext.define('YZSoft.src.jschema.tree.ESBFlowOutputTree', {
    extend: 'YZSoft.src.jschema.tree.SpecificSchemaOutputTree',
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
                method: 'GetFlowOutputSchema',
                flowName: flowName
            },
            success: function (action) {
                me.setSchema(action.result);
                cfg && cfg.fn && cfg.fn(services, ports);
            }
        }, cfg));
    }
});