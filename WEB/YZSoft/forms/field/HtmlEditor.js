
Ext.define('YZSoft.forms.field.HtmlEditor', {
    extend: 'YZSoft.forms.field.ExtJSControl',
    xclass: 'Ext.form.field.HtmlEditor',

    constructor: function (agent, dom) {
        var me = this;

        me.callParent(arguments);
        me.on({
            scope: me,
            change: function (component) {
                me.autoSize(component);
            }
        });
    },

    createComponent: function (config) {
        var me = this;

        Ext.apply(config, {
            getDocMarkup: function () {
                var me = this,
                    h = me.iframeEl.getHeight() - me.iframePad * 2;

                // - IE9+ require a strict doctype otherwise text outside visible area can't be selected.
                // - Opera inserts <P> tags on Return key, so P margins must be removed to avoid double line-height.
                // - On browsers other than IE, the font is not inherited by the IFRAME so it must be specified.
                return Ext.String.format(
                        '<!DOCTYPE html>' +
                        '<html><head><style type="text/css">' +
                        (Ext.isOpera || Ext.isIE ? 'p{margin:0;}' : '') +
                        'body{overflow-y:hidden;border:0;margin:0;padding:{0}px;direction:' + (me.rtl ? 'rtl;' : 'ltr;') +
                        (Ext.isIE8 ? Ext.emptyString : 'min-') +
                        'height:{1}px;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;cursor:text;background-color:white;' +
                        (Ext.isIE ? '' : 'font-size:12px;font-family:{2}') +
                        '}</style></head><body></body></html>',
                    me.iframePad, h, me.defaultFont);
            }
        });

        return me.callParent(arguments);
    },

    setComponentDisabled: function (disable) {
        this.component.setReadOnly(disable);
    },

    onComponentCreated: function (component) {
        var me = this,
            h = me.getHeight(),
            ch = component.inputCmp.getHeight();

        me.callParent(arguments);

        me.info = {
            minHeight: me.getHeight(),
            offset: h - ch
        };

        component.on({
            push: function (component) {
                me.autoSize(component);
            }
        });
    },

    autoSize: function (component) {
        var me = this,
            body = component.getEditorBody();

        component.setHeight(1);

        var bh = body.scrollHeight,
            nh = bh + me.info.offset;

        nh = Math.max(nh, me.info.minHeight);

        if (body.clientWidth != body.scrollWidth)
            nh += 18;

        me.setHeight(nh);
        component.setHeight(nh);
    }
});