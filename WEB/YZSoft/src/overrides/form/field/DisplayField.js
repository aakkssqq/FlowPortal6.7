
Ext.define('YZSoft.src.overrides.form.field.DisplayField', {
    override: 'Ext.form.field.Display',
    triggerCls: ['yz-glyph', 'yz-glyph-e61c'],
    triggerQtip:RS.$('All_Edit'),
    config: {
        editable:null
    },

    getDisplayValue: function () {
        var me = this,
            rv = me.callParent(arguments),
            editable = me.getEditable(),
            triggerCls = Ext.isArray(me.triggerCls) ? me.triggerCls.join(' ') : me.triggerCls,
            triggerQtip = me.triggerQtip;

        if (editable)
            rv += Ext.String.format('<div class="yz-trigger-field-editor {0}" yz-edit-field="{1}" data-qtip="{2}"></div>', triggerCls, editable, triggerQtip);

        return rv;
    }
});