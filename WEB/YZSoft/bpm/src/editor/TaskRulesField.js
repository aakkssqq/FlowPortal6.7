/*
config
[
    {
      "RuleTypeName": "DelegationRule",
      "Enabled": true,
      "ProcessDefine": {
        "ProcessDefineType": "Include",
        "ProcessItems": [
          {
            "ProcessName": "A0001",
            "Condition": null
          },
          {
            "ProcessName": "采购申请",
            "Condition": null
          }
        ]
      },
      "Delegators": [
        {
          "ParticipantType": "SpecifiedUser",
          "LParam1": 5,
          "LParam2": 0,
          "LParam3": 0,
          "SParam1": "User5",
          "SParam2": null,
          "SParam3": null,
          "SParam4": null,
          "SParam5": null,
          "Include": true,
          "Exclude": false,
          "IsValid": true,
          "DisplayString": "User5",
          "Express": "Member.FromAccount(\"User5\")"
        }
      ]
    }
}
*/

Ext.define('YZSoft.bpm.src.editor.TaskRulesField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.bpm.src.model.TaskRule'],
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.TaskRule'
        });

        me.grid = Ext.create('YZSoft.bpm.src.grid.TaskRuleGrid', {
            border: true,
            store: me.store,
            flex: 1,
            selModel: { mode: 'MULTI' },
            listeners: {
                itemdblclick: function (grid, record) {
                    me.edit(record);
                }
            }
        });

        me.btnNew = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_New'),
            handler: function () {
                me.addNew();
            }
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Edit'),
            sm: me.grid.getSelectionModel(),
            margin: 0,
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
            text: RS.$('All_Delete'),
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

        me.panel = Ext.create('Ext.panel.Panel', {
            bodyStyle: 'background-color:transparent',
            padding: '3 0 0 0',
            layout: {
                type: 'hbox',
                pack: 'start'
            },
            border: false,
            defaults: {
                padding: '5 20',
                margin: '0 3 0 0'
            },
            items: [
                me.btnMoveUp,
                me.btnMoveDown, {
                    xtype: 'tbfill'
                },
                me.btnDelete,
                me.btnNew,
                me.btnEdit
            ]
        });

        cfg = {
            items: [me.grid, me.panel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    addNew: function () {
        var me = this;
        Ext.create('YZSoft.bpm.taskrule.Dialog', {
            autoShow: true,
            title: RS.$('All_NewTaskRule'),
            dosubmit: false,
            fn: function (rule) {
                me.grid.addRecords(rule,true);
            }
        });
    },

    edit: function (rec) {
        var me = this;
        Ext.create('YZSoft.bpm.taskrule.Dialog', {
            autoShow: true,
            ruleDefine: rec.data,
            dosubmit: false,
            title: RS.$('All_EditTaskRule'),
            fn: function (rule) {
                Ext.apply(rec.data, rule);
                rec.commit(); //*****Record 重绘
            }
        });
    },

    setValue: function (value) {
        this.store.removeAll();
        this.store.add(value);
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            var data1 = Ext.apply({}, rec.data);
            delete data1.RuleID;
            rv.push(data1);
        });
        return rv;
    }
});