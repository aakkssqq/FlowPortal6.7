/*
params: {
    method: GetRecedeBackSteps/
    stepid:
}
singleSelection:default:true
initSelectionStep:stepid
autoSelection:false
TaskID
canSelect(record) function
*/
Ext.define('YZSoft.bpm.src.grid.TaskSteps', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.selection.CheckboxModel',
        'YZSoft.bpm.src.model.Step',
        'YZSoft.bpm.src.ux.Render'
    ],
    border: false,

    constructor: function (config) {
        var me = this,
            cfg;

        config = config || {};
        config.singleSelection = config.singleSelection !== false;

        var storeConfig = {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.Step',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Task.ashx'),
                extraParams: config.params,
                reader: {
                    rootProperty: 'children'
                }
            }
        };

        Ext.apply(storeConfig, config.store);

        me.store = Ext.create('Ext.data.JsonStore', storeConfig);

        cfg = {
            region: 'center',
            store: me.store,
            selModel: Ext.create('Ext.selection.CheckboxModel', { mode: config.singleSelection ? 'SINGLE' : 'SIMPLE' }),
            columns: [
                { text: RS.$('All_StepName'), dataIndex: 'NodeDisplayName', align: 'left', flex: 1 },
                { text: RS.$('All_Owner'), dataIndex: 'OwnerAccount', align: 'left', width: 160, renderer: YZSoft.bpm.src.ux.Render.renderStepOwner },
                { text: RS.$('All_Delegator'), dataIndex: 'AgentAccount', align: 'left', width: 160, renderer: YZSoft.bpm.src.ux.Render.renderStepAgent },
                { text: RS.$('All_ProcessAt'), dataIndex: 'FinishAt', hidden: config.FinishAt === false, align: 'left', width: 160, formatter: 'date("Y-m-d H:i")' },
                { text: RS.$('All_ReceiveAt'), dataIndex: 'ReceiveAt', hidden: config.ReceiveAt !== true, align: 'left', width: 160, formatter: 'date("Y-m-d H:i")' }
            ],
            viewConfig: {
                getRowClass: function (record) {
                    if (!me.canSelect(record))
                        return 'yz-task-row yz-task-row-gray';
                }
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            viewready: function () {
                var sm = me.getSelectionModel();
                if (!Ext.isEmpty(me.initSelectionStep)) {
                    sm.select(me.store.indexOfId(me.initSelectionStep));
                }
                else if (me.autoSelection && me.store.getCount() == 1 && me.canSelect(me.store.getAt(0))) {
                    sm.select(0);
                }
            },
            beforeselect: function (grid, record, index, eOpts) {
                return me.canSelect(record) ? true:false;
            }
        });
    },

    canSelect: function (record) {
        return true;
    },

    getSelectedSteps: function () {
        var me = this,
            sm = me.getSelectionModel(),
            recs = sm.getSelection(),
            rv = [];

        Ext.each(recs, function (v) {
            rv.push(v.data);
        });

        return rv;
    }
});
