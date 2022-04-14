/*
bpmServer
dlg: 
*/
Ext.define('YZSoft.bpa.src.form.field.SpecFileField', {
    extend: 'YZSoft.src.form.field.FileField',
    triggers: {
        clear: {
            cls: 'yz-trigger-clear',
            handler: 'onClearClick',
            hidden: true
        },
        browser: {
            cls: 'yz-trigger-bpafile',
            handler: 'onBrowserClick'
        }
    },

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            scope: me,
            change: 'updateClearTrigger'
        });
    },

    afterRender: function () {
        var me = this;

        me.inputEl.on('click', function () {
            if (!me.disabled)
                me.onBrowserClick();
        });

        me.callParent(arguments);
    },

    onBrowserClick: function () {
        var me = this;

        me.fireEvent('beforeShowDlg', me);
        Ext.create('YZSoft.bpa.src.dialogs.SelFileDlg', Ext.apply({
            autoShow: true,
            fn: function (file) {
                me.setValue(file);
            }
        }, me.dlg));
    },

    onClearClick: function () {
        this.setValue('');
    },

    updateClearTrigger: function () {
        var me = this,
            value = me.getValue(),
            clear = me.getTrigger('clear');

        Ext.defer(function () {
            if (value)
                clear.show();
            else
                clear.hide();

            me.updateLayout();
        }, 1);
    }
});