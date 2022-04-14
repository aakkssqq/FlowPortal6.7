
Ext.define('YZSoft.src.form.field.Text', {
    extend: 'Ext.form.field.Text',
    clearIcon: false,
    showClearAlways: false,

    constructor: function (config) {
        var me = this,
            showClearAlways = (config && config.showClearAlways) || me.showClearAlways;

        if (config.clearIcon) {
            config.enableKeyEvents = true;
            config.triggers = {
                clear: {
                    cls: 'yz-trigger-clear',
                    hidden: !showClearAlways,
                    handler: me.onClearClick,
                    scope: me
                }
            };
        }

        me.callParent([config]);
    },

    onKeyUp: function () {
        var me = this;

        if (me.clearIcon && !me.showClearAlways) {
            var value = me.getValue().trim(),
                triggerClear = me.getTrigger('clear');

            if (value.length > 0) {
                triggerClear.show();
                me.updateLayout();
            }
            else {
                triggerClear.hide();
                me.updateLayout();
            }
        }

        me.callParent(arguments)
    },

    onClearClick: function () {
        var me = this,
            triggerClear = me.getTrigger('clear');

        me.setValue('');
        if (!me.showClearAlways)
            triggerClear.hide();
        me.updateLayout();

        me.fireEvent('clearclick');
    }
});