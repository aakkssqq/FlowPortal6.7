
Ext.Loader.loadScript({ url: YZSoft.$url('YZSoft/src/jQuery/jquery.min.js') });
Ext.Loader.loadScript({ url: YZSoft.$url('YZSoft/src/jQuery/Cropper/cropper.css') });
Ext.Loader.loadScript({ url: YZSoft.$url('YZSoft/src/jQuery/Cropper/cropper.js') });

Ext.define('YZSoft.src.component.Cropper', {
    extend: 'Ext.Component',
    renderTpl: [
        '<div class="yz-cmp-cropper-wrap" style="width:100%;height:100%;">',
            '<div class="empty">{emptyText}</div>',
            '<img style="max-width: 100%;left:-10000px;position:absolute" src="{src}">',
        '</div>'
    ],
    //renderData: {
    //    src:'test/demopic.png'
    //},
    config: {
        src:null
    },

    initRenderData: function () {
        var me = this,
            data;

        data = Ext.apply(me.callParent(), {
            src:me.src,
            emptyText:me.emptyText
        });

        return data;
    },

    constructor: function (config) {
        var me = this;

        var cfg = {
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (me.rendered) {
            me.onAfterRender();
        }
        else {
            me.on({
                scope: me,
                single: true,
                afterrender: 'onAfterRender'
            });
        }
    },

    onAfterRender: function () {
        var me = this,
            elWrap = me.elWrap = me.getEl().down('.yz-cmp-cropper-wrap', false),
            elImg = me.elImg = elWrap.down('img', false);

        elImg.on({
            load: function () {
                me.addCls('yz-cropper-loaded');
                if (me.options.preview) {
                    Ext.each(Ext.dom.Query.select(me.options.preview), function (dom) {
                        Ext.fly(dom).addCls('yz-cropper-loaded');
                    });
                }

                me.fireEvent('imageloaded');
            }
        });

        if (me.src) {
            $(elImg.dom).cropper(Ext.apply({
            }, me.options));
        }
    },

    updateSrc: function (src) {
        var me = this;

        if (me.rendered) {
            $(me.elImg.dom).cropper('destroy').attr('src', src).cropper(me.options);
        }
    },

    zoom: function (ratio) {
        return $(this.elImg.dom).cropper('zoom', ratio);
    },

    rotate: function (degree) {
        return $(this.elImg.dom).cropper('rotate', degree);
    },

    reset: function () {
        return $(this.elImg.dom).cropper('reset');
    },

    setDragMode: function (mode) {
        return $(this.elImg.dom).cropper('setDragMode', mode);
    },

    getData: function () {
        return $(this.elImg.dom).cropper('getData');
    }
});