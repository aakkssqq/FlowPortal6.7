Ext.define('YZSoft.bpm.src.editor.RuleEditor', {
    extend: 'YZSoft.src.form.FieldContainer',
    title: RS.$('All_Code_CPlus'),
    layout: 'fit',

    constructor: function (config) {
        var me = this,
            config = config || '',
            cfg;

        me.edtCode = Ext.create('Ext.form.field.TextArea', {
            cls: ['yz-form-field-noborder', 'yz-form-field-code'],
            inputAttrTpl: new Ext.XTemplate([
                'wrap="off"'
            ])
        });

        cfg = {
            items: [{
                xtype: 'panel',
                title: config.ruleName,
                layout: 'fit',
                header: {
                    layout: 'hbox',
                    items: [{
                        xtype: 'component',
                        tpl: [
                            '<span style="font-size:13px;color:#aaa">',
                            RS.$('All_Code_CPlus'),
                            '</span>'
                        ],
                        data: {}
                    }]
                },
                items: [me.edtCode]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});