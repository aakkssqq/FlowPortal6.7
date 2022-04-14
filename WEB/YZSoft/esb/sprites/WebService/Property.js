/*
config
designer
sprite
*/
Ext.define('YZSoft.esb.sprites.WebService.Property', {
    extend: 'YZSoft.esb.sprites.PropertyAbstract',

    constructor: function (config) {
        var me = this,
            itemCfg = Ext.copy(config, ['designer', 'sprite']),
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.esb.sprites.WebService.propertypages.General', Ext.apply({
            title: RS.$('All_General'),
            padding: '25 26 5 26',
            listeners: {
                cnselect: function (combo, record, eOpts) {
                    me.pnlInputMap.setConnectionName(combo.getValue());
                    me.pnlOutputMap.setConnectionName(combo.getValue());
                },
                wsdloffseturlchange: function (wsdlOffsetUrl) {
                    me.pnlInputMap.setWsdlOffsetUrl(wsdlOffsetUrl);
                    me.pnlOutputMap.setWsdlOffsetUrl(wsdlOffsetUrl);
                },
                portselect: function (combo, record, eOpts) {
                    me.pnlInputMap.setSoapVersion(record.data.soapVersion);
                    me.pnlOutputMap.setSoapVersion(record.data.soapVersion);
                },
                opselect: function (combo, record, eOpts) {
                    me.pnlInputMap.setOperationName(record.data.name);
                    me.pnlInputMap.setMessageName(record.data.messageName);
                    me.pnlOutputMap.setOperationName(record.data.name);
                    me.pnlOutputMap.setMessageName(record.data.messageName);
                }
            }
        }, itemCfg));

        me.pnlInputMap = Ext.create('YZSoft.esb.sprites.WebService.propertypages.InputMap', Ext.apply({
            title: RS.$('ESB_PropertyPage_Title_Call'),
            padding: '0 0 0 0',
        }, itemCfg));

        me.pnlOutputMap = Ext.create('YZSoft.esb.sprites.WebService.propertypages.OutputMap', Ext.apply({
            title: RS.$('ESB_PropertyPage_Title_Return'),
            padding: '0 0 0 0'
        }, itemCfg));

        me.pnlException = Ext.create('YZSoft.esb.sprites.WebService.propertypages.Exception', Ext.apply({
            title: RS.$('ESB_PropertyPage_Title_Exception'),
            padding: '25 26 5 26'
        }, itemCfg));

        cfg = {
            activeTab: 0,
            items: [
                me.pnlGeneral,
                me.pnlInputMap,
                me.pnlOutputMap,
                me.pnlException
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});