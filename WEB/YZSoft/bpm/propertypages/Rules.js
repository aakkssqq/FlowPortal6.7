/*
config:
tables
rules 支持的事件数组
value
[{
    "RuleType": "FormDataPrepared",
    "CodeText": "int a = 11;"
},{
    "RuleType": "FormSaved",
    "CodeText": "int a=12;"
}]
*/

Ext.define('YZSoft.bpm.propertypages.Rules', {
    extend: 'Ext.panel.Panel',
    referenceHolder: true,
    title: RS.$('All_Rules'),
    layout: 'border',
    border: true,

    constructor: function (config) {
        var me = this,
            config = config || {},
            data = [],
            cfg;

        //转换数据
        Ext.each(config.rules, function (rule) {
            rule = Ext.isString(rule) ? { name: rule, xclass: 'YZSoft.bpm.src.editor.RuleEditor'} : rule;

            data.push({
                name: RS.$('All_Enum_RuleType_' + rule.name, rule.name),
                value: rule.name,
                xclass: rule.xclass
            });
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            border: false,
            hideHeaders: true,
            selModel: { mode: 'SINGLE' },
            cls: 'yz-grid-s',
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            store: {
                fields: ['name', 'value', 'code', 'xclass', 'panel'],
                data: data
            },
            columns: {
                items: [
                    { header: '', dataIndex: 'name', flex: 1 },
                    { header: '', dataIndex: 'code', width: 20, renderer: me.renderCodeFlag, tdCls: 'yz-events-hascode' }
                ]
            },
            listeners: {
                selectionchange: function (sm, records, eOpts) {
                    if (records.length == 1) {
                        var rec = records[0];

                        if (!rec.panel) {
                            rec.panel = Ext.create(rec.data.xclass, {
                                tables: me.tables,
                                ruleName: rec.data.name
                            });

                            rec.panel.edtCode.on({
                                scope: rec.panel,
                                change: function () {
                                    var code = this.edtCode.getValue();
                                    code = Ext.String.trim(code) ? code : '';

                                    if (this.record)
                                        this.record.set('code', code);
                                }
                            });

                            me.pnlCard.add(rec.panel);
                        }

                        me.pnlCard.setActiveItem(rec.panel);

                        rec.panel.suspendEvent('change');
                        rec.panel.edtCode.setValue(records[0].data.code);
                        rec.panel.resumeEvent('change');
                        rec.panel.record = rec
                    }
                }
            }
        });

        me.pnlCard = Ext.create('Ext.container.Container', {
            region: 'center',
            layout: 'card'
        });

        cfg = {
            items: [Ext.apply({
                xtype: 'panel',
                title: RS.$('All_Rules'),
                region: 'west',
                width: 180,
                layout: 'fit',
                split: {
                    size: 5,
                    collapseOnDblClick: false,
                    collapsible: true
                },
                items: [me.grid]
            }, config.navBar), me.pnlCard]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.value)
            me.fill(config.value);
    },

    renderCodeFlag: function (value) {
        return Ext.String.trim(value || '') ? '*' : ''
    },

    fill: function (data) {
        var me = this,
            data = data || [];

        me.grid.getStore().each(function (rec) {
            var value = Ext.Array.findBy(data, function (item) {
                if (String.Equ(item.RuleType, rec.data.value))
                    return true;
            });

            if (value)
                rec.set('code', value.CodeText);
        });

        me.grid.getStore().each(function (rec) {
            if (rec.data.code) {
                me.grid.getSelectionModel().select(rec);
                return false;
            }
        });

        if (me.grid.getSelectionModel().getSelection().length == 0 && me.grid.getStore().getCount() != 0)
            me.grid.getSelectionModel().select(me.grid.getStore().getAt(0));
    },

    save: function () {
        var me = this,
            rules = [];

        me.grid.getStore().each(function (record) {
            if (!record.data.code)
                return;

            rules.push({
                RuleType: record.data.value,
                CodeText: record.data.code
            });
        });

        return rules;
    }
});