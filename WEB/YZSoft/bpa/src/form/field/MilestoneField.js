
/*
config
*/
Ext.define('YZSoft.bpa.src.form.field.MilestoneField', {
    extend: 'Ext.form.FieldContainer',
    milestones: [
        { value: 'Planning', name: RS.$('BPA_Milestone_Planning') },
        { value: 'Discover', name: RS.$('BPA_Milestone_Discover') },
        { value: 'Design', name: RS.$('BPA_Milestone_Design') },
        { value: 'Development', name: RS.$('BPA_Milestone_Development') },
        { value: 'Testing', name: RS.$('BPA_Milestone_Testing') },
        { value: 'Launch', name: RS.$('BPA_Milestone_Launch') },
        { value: 'Suspend', name: RS.$('BPA_Milestone_Suspend') }
    ],

    constructor: function (config) {
        var me = this,
            btns = [],
            cfg;


        Ext.each(me.milestones, function (milestone) {
            btns.push(Ext.create('Ext.button.Button', {
                text: milestone.name,
                value: milestone.value,
                padding: '7 10'
            }));
        });

        me.segBtns = Ext.create('Ext.button.Segmented', {
            items: btns,
            allowMultiple:true
        });

        cfg = {
            items: [me.segBtns]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getValue: function () {
        var me = this,
            rv = [];

        me.segBtns.items.each(function (btn) {
            if (btn.pressed) {
                rv.push(btn.value);
            }
        });

        return rv;
    }
});