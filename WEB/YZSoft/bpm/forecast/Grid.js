
Ext.define('YZSoft.bpm.forecast.Grid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],
    disableSelection: true,
    border: false,

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { xtype: 'rownumberer', renderer: null },
                    { header: RS.$('All_StepName'), dataIndex: 'NodeDisplayName', align: 'left', width: 220 },
                    { header: RS.$('All_Owner'), dataIndex: 'OwnerAccount', align: 'left', width: 220, scope: me, renderer: 'renderForecastStepOwner' },
                    { header: RS.$('All_Delegator'), dataIndex: 'AgentAccount', align: 'left', flex: 1, renderer: YZSoft.bpm.src.ux.Render.renderStepAgent }
                ]
            },
            viewConfig: {
                getRowClass: function (record, rowIndex, rowParams, store) {
                    return (record.data['OwnerAccount'] || record.data['Memo'] == 'freeRouting') ? 'yz-task-row yz-task-forecaststep' : 'yz-task-row  yz-task-forecaststep yz-task-forecaststep-warn';
                }
            },
            listeners: {
                rowclick: function (grid, record, tr, rowIndex, e, eOpts) {
                    if (e.getTarget().tagName == 'A') {
                        Ext.Msg.show({
                            title: RS.$('All_Warning'),
                            msg: YZSoft.HttpUtility.htmlEncode(grid.getStore().getAt(rowIndex).data.Memo, true),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.INFO
                        });
                    }
                }
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    renderForecastStepOwner: function (value, metaData, record) {
        if (record.data.OwnerAccount)
            return YZSoft.bpm.src.ux.Render.renderStepOwner(value, metaData, record);
        else if (record.data.Memo == 'freeRouting') {
            var declare = Ext.decode(record.data.Comments);
            return Ext.String.format(RS.$('All_Forecast_Declare'), declare.RecpDeclareSteps.join(','));
        }
        else if (record.data.Memo)
            return Ext.String.format('<a href="#" style="color:red">{0}</a>', RS.$('All_Forecast_StepErr'));
        else
            return Ext.String.format('<span style="color:red">{0}</span>', RS.$('All_Forecast_NoRecipient'));
    }
});
