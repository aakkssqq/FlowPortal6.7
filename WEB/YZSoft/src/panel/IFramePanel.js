/*
*   @config
*   url : url of iframe
*   params : url params
*   
*   @example
*   Ext.create('YZSoft.src.panel.IFramePanel', {
*       url: config.url || 'YZSoft/Maintenance/Module.aspx',
*       params: { ProdcuteCode: '101' }
*     });
*/

Ext.define('YZSoft.src.panel.IFramePanel', {
    extend: 'Ext.panel.Panel',
    autoReload: false,
    autoWidth: false,
    autoHeight: false,

    constructor: function (config) {
        var me = this,
            scrolling = config.scrolling || 'auto';

        config.id = config.id || Ext.id();
        me.idframe = config.id + '_frm';

        config = config || {};
        config.url = config.url || me.url;

        var params = config.params || {},
            url = config.url ? Ext.String.urlAppend(config.url, Ext.Object.toQueryString(params)) : '',
            cfg;

        cfg = {
            html: url ? '<iframe id="' + me.idframe + '" src="' + url + '" frameborder="0" width="100%" height="100%" scrolling="{0}"></iframe>' : '<iframe id="' + me.idframe + '" frameborder="0" width="100%" height="100%" scrolling="{0}"></iframe>'
        };

        //ios touch
        if (Ext.os.is.iOS)
            cfg.html = '<div class="yz-iframe-touch-cnt" style="width:100%;height:100%">' + cfg.html + '</div>';

        cfg.html = Ext.String.format(cfg.html, scrolling);

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            afterrender: function () {
                me.iframe = document.getElementById(me.idframe);
                me.iframe.containerPanel = me;
                me.iframeEl = Ext.get(me.iframe);
                me.contentWindow = document.frames ? document.frames[me.idframe] : me.iframe.contentWindow;
                //me.contentWindow = Ext.isIE ? me.iframe.contentWindow : window.frames[me.idframe];

                me.fireEvent('yzafterrender');
            },
            activate: function () {
                if (me.autoReload)
                    me.reload();
            },
            beforeclose: function () {
                try {
                    Ext.apply(me, me.contentWindow.YZSoft.window.result);
                }
                catch (exp) {
                }
            }
        });
    },

    initEvents: function () {
        var me = this;
        me.callParent();
        me.iframeEl.on('load', me.onLoad, me);
    },

    getBody: function () {
        var doc = this.getDoc() || {};
        return doc.body || doc.documentElement;
    },

    getDoc: function () {
        try {
            return this.getWin().document;
        } catch (ex) {
            return null;
        }
    },

    getWin: function () {
        return this.contentWindow;
    },

    onLoad: function () {
        var me = this,
            win = me.getWin(),
            body = me.getBody();

        if (me.autoWidth)
            me.setWidth(body.scrollWidth + 20); //autoWidth还是出现滚动条

        if (me.autoHeight)
            me.setHeight(body.scrollHeight + 20);

        me.fireEvent('onload', me);
    },

    load: function (url, params) {
        var me = this;

        me.params = params || me.params;
        me.url = url;
        url = Ext.String.urlAppend(url, Ext.Object.toQueryString(me.params));
        me.iframe.src = url;

        this.fireEvent('load', this);
    },

    reload: function () {
        var me = this,
            params = me.params || {},
            url = Ext.String.urlAppend(me.url, Ext.Object.toQueryString(params));

        me.iframe.src = url;
    },

    print: function () {
        var me = this;

        if (me.contentWindow) {
            if (Ext.browser.is.IE) {
                me.contentWindow.document.execCommand('print', false, null);
            }
            else {
                me.contentWindow.focus();
                me.contentWindow.print();
            }
        }
    },

    destroy: function () {
        var me = this;

        if (Ext.browser.is.IE || Ext.browser.is.Edge) {
            if (me.iframe) {
                delete me.iframe.containerPanel;
                delete me.contentWindow;

                me.iframe.src = 'about:blank'
                me.iframe.contentWindow.document.write('');
                me.iframe.contentWindow.close();
                me.iframe.parentNode.removeChild(me.iframe);
                delete me.iframe;
                Ext.destroy(me.iframeEl);

                if (typeof CollectGarbage == "function") {
                    CollectGarbage();
                }
            }
        }

        me.callParent(arguments);
    }
});
