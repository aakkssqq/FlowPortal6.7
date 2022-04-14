/*
*/

Ext.define('YZSoft.bpa.src.form.field.ReportBrowserField', {
    extend: 'Ext.form.FieldContainer',
    requires: [
        'YZSoft.bpa.src.model.Folder'
    ],
    config: {
        btnConfig: {
            text: '...',
            padding: '2 3'
        }
    },
    hasValueCls: 'yz-form-field-hasvalue',

    constructor: function (config) {
        var me = this,
            folders,
            root = [];

        config = config || {};

        me.display = Ext.create('Ext.form.field.Display', {
            flex: 1,
            cls: 'yz-form-field-report',
            margin: 0,
            afterSubTpl: [
            '<div class="yz-form-field-clear">&#58923</div>', {
                compiled: true,
                disableFormats: true
            }]
        });

        me.btnBrowser = Ext.create('Ext.button.Button', Ext.apply({}, config.btnConfig, me.config.btnConfig));

        var cfg = {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [me.display, me.btnBrowser]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.btnBrowser.on({
            scope: me,
            click: 'onButtonClick'
        });

        me.on({
            single: true,
            afterrender: function () {
                me.display.getEl().down('.yz-form-field-clear').on({
                    scope: me,
                    click: 'onClearClick'
                });
            }
        });
    },

    onClearClick: function () {
        this.setValue(null);
    },

    setValue: function (value) {
        var me = this;

        if (value)
            me.display.addCls(me.hasValueCls);
        else
            me.display.removeCls(me.hasValueCls);
    },

    onButtonClick: function (btn, e, eOpts) {
    }
});