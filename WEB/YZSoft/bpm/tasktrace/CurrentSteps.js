/*
config
    TaskID
    backButton
    activeTabIndex
Events
    backClick
*/
Ext.define('YZSoft.bpm.tasktrace.CurrentSteps', {
    extend: 'Ext.view.View',
    requires: [
        'YZSoft.bpm.src.model.Step'
    ],
    scrollable: true,
    overItemCls: 'yz-item-over',
    selectedItemCls: 'yz-item-select',
    itemSelector: '.yz-dataview-item',
    padding: 0,
    tpl: [
        '<tpl for=".">',
            '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-currentstep">',
                '<div class="d-flex flex-column align-items-center">',
                    '<div class="stepname">{[this.renderStepName(values)]}</div>',
                    '<div class="status"></div>',
                    '<div class="participent">{[this.renderParticipent(values)]}</div>',
                '</div>',
            '</div>',
        '</tpl>', {
            renderStepName: function (step) {
                return Ext.util.Format.text(step.NodeDisplayName);
            },
            renderParticipent: function (step) {
                return Ext.util.Format.text(step.RecipientDisplayName || step.RecipientAccount);
            }
        }
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.Step',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Task.ashx'),
                extraParams: {
                    Method: 'GetTaskProcessingSteps',
                    TaskID: config.TaskID
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        cfg = {
            store: me.store
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
