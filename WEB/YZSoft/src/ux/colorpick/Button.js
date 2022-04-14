/*
config
*/
Ext.define('YZSoft.src.ux.colorpick.Button', {
    extend: 'Ext.button.Button',
    requires: [
        'Ext.ux.colorpick.ColorUtils'
    ],
    iconCls: 'yz-glyph yz-glyph-e637',

    constructor: function (config) {
        var me = this;
        me.callParent([config]);
    },

    destroy: function () {
        if (this.window) {
            this.window.destroy();
            this.window = this.picker = null;
        }

        this.callParent();
    },

    onClick: function () {
        var me = this;

        if (!me.window) {
            me.picker = Ext.create('Ext.ux.colorpick.Selector', {
                format: '#hex6',
                showPreviousColor: true,
                showOkCancelButtons: true
            });

            //var color = Ext.ux.colorpick.ColorUtils.parseColor('#4677bf');
            //me.picker.setColor(color);
            //me.picker.setPreviousColor(color);

            me.window = Ext.create('Ext.window.Window', { //555555
                referenceHolder: true,
                minWidth: 540,
                minHeight: 200,
                layout: 'fit',
                header: false,
                resizable: true,
                items: [me.picker]
            });

            me.picker.on({
                scope: me,
                ok: 'onColorPickerOK',
                cancel: 'onColorPickerCancel'
            });
        }

        if (me.fireEvent('beforeShowPicker', me, me.picker) === false)
            return;

        me.window.showBy(me, 'tl-br?');
    },

    onColorPickerOK: function (picker) {
        var me = this,
            color = picker.formatColor(picker.getColor());

        me.window.hide();
        me.fireEvent('picked', color);
    },

    onColorPickerCancel: function () {
        this.window.hide();
    }
});