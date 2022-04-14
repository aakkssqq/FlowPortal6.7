/*
relatedFile
method
fill
*/

Ext.define('YZSoft.bpm.propertypages.DecisionSteps', {
    extend: 'Ext.container.Container',
    requires: ['YZSoft.bpm.src.flowchart.property.Defaultes'],
    referenceHolder: true,
    title: RS.$('All_DecisionStepSetting'),
    layout: 'border',
    style: 'background-color:#fff;',

    constructor: function (config) {
        var me = this,
            cfg;

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 3
        });

        me.store = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'condition', 'tag'],
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.editorName = {
            xtype: 'textfield',
            allowBlank: false
        };

        me.grid = Ext.create('Ext.grid.Panel', {
            border: true,
            selModel: { mode: 'SINGLE' },
            plugins: [me.cellEditing],
            viewConfig: {
                stripeRows: false
            },
            store: me.store,
            viewConfig: {
                markDirty: false
            },
            columns: {
                defaults: {
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { text: RS.$('All_DecisionStepName'), dataIndex: 'name', width: 120, editor: { xtype: 'textfield', allowBlank: false} },
                    { text: RS.$('Process_DecisionCondition'), dataIndex: 'condition', flex: 1 }
                ]
            },
            listeners: {
                itemdblclick: function (grid, record, item, index, e, eOpts) {
                    me.edit(record);
                }
            }
        });

        me.btnAdd = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Add'),
            handler: function () {
                var step = YZSoft.bpm.src.flowchart.property.Defaultes.copy({
                    StepName: me.store.getUniName('name', RS.$('All_DecisionStep'), 1),
                    Condition: ''
                }, 'ParticipantDecisionStep,DataControl,Timeout,Rules');

                var rec = me.grid.addRecords({
                    name: step.StepName,
                    condition: step.Condition,
                    tag: step
                })[0];

                me.cellEditing.startEdit(rec, 0);
            }
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Edit'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canEdit());
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1)
                    me.edit(recs[0]);
            }
        });

        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Remove'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canDelete());
            },
            handler: function () {
                me.grid.removeAllSelection();
            }
        });

        me.btnMoveUp = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_MoveUp'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canMoveUp());
            },
            handler: function () {
                me.grid.moveSelectionUp();
            }
        });

        me.btnMoveDown = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_MoveDown'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canMoveDown());
            },
            handler: function () {
                me.grid.moveSelectionDown();
            }
        });

        cfg = {
            items: [{
                xtype: 'panel',
                region: 'center',
                layout: 'fit',
                items: [me.grid]
            }, {
                xtype: 'panel',
                region: 'east',
                layout: {
                    type: 'vbox',
                    pack: 'start',
                    align: 'stretch'
                },
                border: false,
                padding: '0 0 0 10',
                bodyStyle: 'background-color:transparent',
                defaults: {
                    padding: '5 10',
                    margin: '0 0 3 0',
                    minWidth: 76
                },
                items: [
                    me.btnAdd,
                    me.btnEdit,
                    me.btnDelete,
                    me.btnMoveUp,
                    me.btnMoveDown]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    edit: function (rec) {
        var me = this,
            spriteName = me.property.data.Name,
            stepNames = [];

        rec.data.tag = rec.data.tag || {};
        rec.data.tag.StepName = rec.data.name;

        me.store.each(function (tmpRec) {
            if (tmpRec != rec)
                stepNames.push(spriteName + '\\' + tmpRec.data.name);
        });

        Ext.create('YZSoft.bpm.src.flowchart.dialogs.DecisionStep', {
            autoShow: true,
            title: Ext.String.format(RS.$('All_DecisionStepProperty'), rec.data.name),
            data: rec.data.tag,
            property: me.property,
            tables: me.tables,
            relatedFile: me.relatedFile,
            stepNames: stepNames,
            fn: function (data, tables) {
                rec.set('name', data.StepName);
                rec.set('condition', data.Condition);
                Ext.apply(rec.data.tag, data);

                me.tables = tables;
                me.fireEvent('tablesChanged', tables);
            }
        });
    },

    fill: function (steps) {
        var me = this,
            data = [];

        Ext.each(steps, function (step) {
            data.push({
                name: step.StepName,
                condition: step.Condition,
                tag: step
            });
        });

        me.grid.getStore().add(data);
    },

    save: function () {
        var me = this,
            steps = [];

        me.store.each(function (rec) {
            rec.data.tag.StepName = rec.data.name;
            steps.push(rec.data.tag);
        });

        return steps;
    }
});