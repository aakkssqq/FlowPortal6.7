
Ext.define('YZSoft.esb.sprites.ExcelGenerator.propertypages.InputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityInputMap',
    tagTreeXClass:'YZSoft.esb.sprites.ExcelGenerator.tree.InputTree',
    config: {
        templateName: null
    },

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_TreeTitle_Listener')
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_ExcelGenerator_InputTree_Title'),
            tools: [{
                type: 'refresh',
                handler: function () {
                    me.$refresh({
                        waitMsg: {
                            target: me.tagTree,
                            msg: RS.$('ESB_LoadMask_RefreshSchema'),
                            start: 0
                        }
                    });
                }
            }]
        };

        Ext.apply(config, {
            templateName: properties.templateName
        });

        me.callParent(arguments);
    },

    updateTemplateName: function (newValue) {
        this.dirty = true;
    },

    $refresh: function (cfg) {
        var me = this,
            templateName = me.getTemplateName();

        if (!templateName)
            return;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/DesignTime/ExcelTemplate.ashx'),
            params: {
                method: 'GetInputSchema',
                root: 'ESBTemplates',
                path: 'Excel',
                templateFileName: templateName
            },
            success: function (action) {
                me.setTagSchema(Ext.apply({
                    FileName: {
                        type: 'string'
                    }
                }, action.result));
                cfg && cfg.fn && cfg.fn();
            }
        }, cfg));
    }
});