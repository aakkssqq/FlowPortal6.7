//支持图层 surfaceZIndexes
//选择
Ext.define('YZSoft.src.flowchart.Container', {
    extend: 'Ext.draw.Container',
    requires: [
        'Ext.draw.overrides.hittest.Surface'
    ],
    //linkXClass:'YZSoft.src.flowchart.link.PloyLine',
    linkXClass: 'YZSoft.src.flowchart.link.ZigZag',
    surfaceZIndexes: {
        background: 0,
        snap: 1,
        main: 2,
        runtimeBackGround: 3,
        runtimeText: 4,
        pool: 5,
        lane: 6,
        link: 7,
        shape: 8,
        docker: 9,
        drag: 10,
        overdrag: 11,
        events: 12,
        indicator: 13
    },
    focusable: true,
    tabIndex: 0,

    constructor: function (config) {
        var me = this;

        me.surfaceMap = {};
        me.selection = [];

        var cfg = {
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            afterrender: function () {
                me.relayEvents(me.getTargetEl(), ['keydown', 'keypress', 'keyup']);
            }
        });
    },

    getSurface: function (name, type) {
        name = name || 'main';
        type = type || name;

        var me = this,
            exist = me.getItems().get(name),
            surface = me.callParent([name]),
            zIndexes = me.surfaceZIndexes;

        surface.drawContainer = me;

        if (type in zIndexes && !surface.zIndexSetted) {
            surface.element.setStyle('zIndex', zIndexes[type]);
            surface.zIndexSetted = true;
        }

        if (!me.surfaceMap[type])
            me.surfaceMap[type] = [];

        if (Ext.Array.indexOf(me.surfaceMap[type], (surface)) < 0) {
            surface.type = type;
            me.surfaceMap[type].push(surface);
        }

        if (!exist) {
            me.items.remove(surface);
            var index = me.items.findIndexBy(function (item) {
                if (zIndexes[item.type] > zIndexes[type])
                    return;
            });

            if (index != -1)
                me.items.insert(index, surface);
            else
                me.items.add(surface);
        }

        return surface;
    },

    getSelection: function () {
        return this.selection || [];
    },

    select: function (sprites) {
        var me = this,
            sels = me.selection = me.selection || [],
            sprites = Ext.isArray(sprites) ? sprites : [sprites],
            i;

        Ext.each(sprites, function (sprite) {
            if (!Ext.Array.contains(sels, sprite))
                sels.push(sprite);

            sprite.setAttributes({
                selected: true
            });
        });

        for (i = 0; sels.length >= 2 && i < sels.length; i++) {
            var sprite = sels[i];
            if (sprite.singleSelection) {
                sprite.setAttributes({
                    selected: false
                });
                Ext.Array.removeAt(sels, i);
                i--;
            }
        }

        me.fireEvent('selectionchange', me, me.selection);
    },

    deselect: function (sprite) {
        var me = this;

        Ext.Array.remove(this.selection, sprite);

        if (!sprite.destroyed) {
            sprite.setAttributes({
                selected: false
            });
        }

        me.fireEvent('selectionchange', me, me.selection);
    },

    deselectAll: function (silence) {
        var me = this;

        if (me.selection.length == 0)
            return;

        Ext.each(me.selection, function (sprite) {
            if (!sprite.destroyed) {
                sprite.setAttributes({
                    selected: false
                });
            }
        });

        me.selection = [];

        if (silence !== true)
            me.fireEvent('selectionchange', me, me.selection);
    },

    setHotBox: function (sprite, attrName) {
        var me = this,
            prevSprite;

        attrName = attrName || 'hotbox';
        prevSprite = me[attrName];

        if (prevSprite && prevSprite.isDestroyed) {
            prevSprite = me[attrName] = null;
        }

        if (sprite) {
            if (prevSprite) {
                if (prevSprite != sprite) {
                    prevSprite.setAttributes({
                        display: 'normal'
                    });

                    if (prevSprite.getSurface() != sprite.getSurface())
                        prevSprite.getSurface().renderFrame();
                }
            }

            me[attrName] = sprite;
            sprite.setAttributes({
                display: 'hotbox'
            });

            sprite.getSurface().renderFrame();
        }
        else {
            if (prevSprite) {
                prevSprite.setAttributes({
                    display: 'normal'
                });
                me[attrName] = null;
                prevSprite.getSurface().renderFrame();
            }
        }
    },

    getAllSprites: function (fn) {
        var me = this,
            surfaces = me.getItems(),
            rv = [];

        for (i = 0, it = surfaces.length; i < it; i++) {
            var surface = surfaces.get(i),
                sprites = surface.getItems();

            for (j = 0, jt = sprites.length; j < jt; j++) {
                var spriteTmp = sprites[j];

                if (!fn || fn(spriteTmp) === true)
                    rv.push(spriteTmp);
            }
        }

        return rv;
    },

    /*
    paddingLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    emptyBBox
    */
    saveChart: function (option) {
        option = option || {};

        var me = this,
            shape = me.getSurface('shape'), //getImage前调用此函数确保surface一定存在，否则会报错
            ratio = shape.devicePixelRatio,
            data = me.getImage(),
            sprites, bbox;

        sprites = me.getAllSprites(function (sprite) {
            return sprite.isShape || sprite.isLink
        });

        if (sprites.length != 0) {
            bbox = shape.getBBox(sprites, false);
            bbox.x -= option.paddingLeft || 10;
            bbox.y -= option.paddingTop || 10;
            bbox.width += option.paddingRight || 20;
            bbox.height += option.paddingBottom || 20;
        }
        else {
            bbox = Ext.apply({
                x: 0,
                y: 0,
                width: 100,
                height: 100
            }, option.emptyBBox)
        }

        return Ext.apply({
            bboxX: Math.floor(bbox.x * ratio),
            bboxY: Math.floor(bbox.y * ratio),
            bboxWidth: Math.ceil(bbox.width * ratio),
            bboxHeight: Math.ceil(bbox.height * ratio)
        }, data);
    }
});