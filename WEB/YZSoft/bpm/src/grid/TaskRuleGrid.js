/*
*/
Ext.define('YZSoft.bpm.src.grid.TaskRuleGrid', {
    extend: 'Ext.grid.Panel',

    constructor: function (config) {
        var me = this;

        var cfg = {
            columns: {
                defaults: {
                    sortable: false
                },
                items:[
                    { text: RS.$('All_Type'), dataIndex: 'RuleTypeName', width: 100, align: 'center', renderer: me.renderType },
                    { text: RS.$('All_Process'), dataIndex: 'ProcessDefine', flex: 1, renderer: me.renderProcessName },
                    { text: RS.$('All_Delegator'), dataIndex: 'Delegators', width: 220, renderer: me.renderDelegation },
                    { text: RS.$('All_Status'), dataIndex: 'Enabled', width: 80, align: 'center', renderer: me.renderStatus }
                ]
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    renderType: function (value, metaData, rec) {
        var types = {
            DelegationRule: RS.$('All_DelegationRule'),
            AssistantRule: RS.$('All_AssistantRule')
        };

        return '[' + types[value] + ']';
    },

    renderProcessName: function (value, metaData, rec) {
        var names = [];
        Ext.each(value.ProcessItems, function (item) {
            names.push(item.ProcessName);
        });

        switch (value.ProcessDefineType) {
            case 'All':
                return RS.$('All_AllProcess');
            case 'Include':
                return names.join(';');
            case 'Exclude':
                return Ext.String.format('{0}: {1}', RS.$('All_ExcludeBelowProcesses'), names.join(';'));
            default:
                return RS.$('All_ProcessUnSpecified');
        }
    },

    renderDelegation: function (value, metaData, rec) {
        var names = [];
        Ext.each(value, function (item) {
            names.push(item.RuntimeDisplayString || item.DisplayString);
        });

        return names.join(';');
    },

    renderStatus: function (value, metaData, rec) {
        if (value)
            return RS.$('All_Valid');
        else
            return RS.$('All_Invalid');
    }
});
