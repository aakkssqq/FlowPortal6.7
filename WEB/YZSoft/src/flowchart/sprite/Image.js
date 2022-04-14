/*
*/
Ext.define('YZSoft.src.flowchart.sprite.Image', {
    extend: 'YZSoft.src.flowchart.sprite.Sprite',
    statics: {
        imageLoaders: {}
    },
    inheritableStatics: {
        def: {
            processors: {
                src: 'string'
            },
            defaults: {
                src: '',
                width: 32,
                height: 32
            }
        }
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        cfg = {
            src: YZSoft.$url(me, me.src)
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    render: function (surface, ctx) {
        var me = this,
            attr = me.attr,
            mat = attr.matrix,
            imat = attr.inverseMatrix,
            src = attr.src,
            x = attr.x,
            y = attr.y,
            width = attr.width,
            height = attr.height,
            loadingStub = Ext.draw.sprite.Image.imageLoaders[src],
            imageLoader,
            image,
            i;

        if (loadingStub && loadingStub.done) {
            mat.toContext(ctx);
            image = loadingStub.image;
            ctx.drawImage(image, x, y,
                    width || (image.naturalWidth || image.width) / surface.devicePixelRatio,
                    height || (image.naturalHeight || image.height) / surface.devicePixelRatio);

            me.renderChildren(surface, ctx);

            if (attr.selected) {
                imat.toContext(ctx);
                me.renderHotPoints(surface, ctx);
            }
        } else if (!loadingStub) {
            imageLoader = new Image();
            loadingStub = Ext.draw.sprite.Image.imageLoaders[src] = {
                image: imageLoader,
                done: false,
                pendingSprites: [me],
                pendingSurfaces: [surface]
            };
            imageLoader.width = width;
            imageLoader.height = height;
            imageLoader.onload = function () {
                if (!loadingStub.done) {
                    loadingStub.done = true;
                    for (i = 0; i < loadingStub.pendingSprites.length; i++) {
                        loadingStub.pendingSprites[i].setDirty(true);
                    }
                    for (i in loadingStub.pendingSurfaces) {
                        loadingStub.pendingSurfaces[i].renderFrame();
                    }
                }
            };
            imageLoader.src = src;
        } else {
            Ext.Array.include(loadingStub.pendingSprites, me);
            Ext.Array.include(loadingStub.pendingSurfaces, surface);
        }
    }
});