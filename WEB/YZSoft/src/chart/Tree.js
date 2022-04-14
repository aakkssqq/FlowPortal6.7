
Ext.define('YZSoft.src.chart.Tree', {
    extend: 'Ext.container.Container',
    style:'background-color:white',
    requires: [
        'YZSoft.src.scroll.DomScroller'
    ],
    innerPadding: {
        x:40,
        y:40
    },
    onMouseDown:Ext.emptyFn,
    onMouseMove: Ext.emptyFn,
    onMouseUp: Ext.emptyFn,
    onMouseLeave: Ext.emptyFn,

    constructor: function (config) {
        var me = this,
            cfg;

        me.drawContainer = Ext.create('YZSoft.src.flowchart.Container', {
            border: false,
            isDragging: false,
            startX: 0,
            startY: 0,
            translationX: 0,
            translationY: 0,
            target: null,
            listeners: {
                element: 'element',
                scope: me,
                mousedown: 'onMouseDown',
                mousemove: 'onMouseMove',
                mouseup: 'onMouseUp',
                mouseleave: 'onMouseLeave'
            }
        });

        cfg = {
            layout: 'auto',
            scrollable: {
                touchScroll: true
            },
            items: [me.drawContainer]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (me.store) {
            me.store.on({
                scope: me,
                load: 'onStoreLoad'
            });
        }
    },

    onStoreLoad: function () {
        var me = this,
            store = me.store,
            root = store.getRoot(),
            cnt = me.drawContainer,
            surface = cnt.getSurface(),
            rootSprite, sprites, bbox;

        surface.removeAll(true);
        rootSprite = me.createSpriteTree(root, me.innerPadding);

        sprites = me.extra(rootSprite);
        surface.add(sprites);
        me.adjustHeight(me.innerPadding.y, sprites)

        surface.renderFrame();

        bbox = me.getBBox();
        Ext.suspendLayouts();
        cnt.setMinWidth(bbox.width);
        cnt.setMinHeight(bbox.height);
        me.fireEvent('load', bbox);
        Ext.resumeLayouts(true);
        me.updateLayout(false, true);
    },

    getMaxDepth: function (sprites) {
        var maxdepth = 0;
        Ext.each(sprites, function (sprite) {
            maxdepth = Math.max(maxdepth, sprite.record.getDepth());
        });
        return maxdepth;
    },

    adjustHeight: function (y, sprites) {
        var me = this,
            maxdepth = me.getMaxDepth(sprites),
            bboxText, bboxSprite, i, h, spriteheight;

        for (i = 0; i <= maxdepth; i++) {
            h = -1;
            Ext.each(sprites, function (sprite) {
                if (sprite.record.getDepth() != i)
                    return;

                bboxText = sprite.sprites.text.getBBox(true);
                bboxSprite = sprite.getBBox(true);

                spriteheight = Math.max(bboxSprite.height, bboxText.height + 20);
                if (h == -1)
                    h = spriteheight;
                else
                    h = Math.max(h, spriteheight);
            });

            Ext.each(sprites, function (sprite) {
                if (sprite.record.getDepth() != i)
                    return;

                sprite.setAttributes({
                    translationY: y,
                    height: h
                });
            });

            y += h;
        }
    },

    getBBox: function () {
        var me = this,
            cnt = me.drawContainer,
            surface = cnt.getSurface(),
            sprites = surface.getItems(),
            bbox;

        if (sprites.length != 0) {
            bbox = surface.getBBox(sprites, false);
            bbox.x -= me.innerPadding.x;
            bbox.y -= me.innerPadding.y;
            bbox.width += me.innerPadding.x*2;
            bbox.height += me.innerPadding.y*2;
        }
        else {
            bbox = {
                x: 0,
                y: 0,
                width: 100,
                height: 100
            };
        }

        return bbox;
    },

    extra: function (sprite, out) {
        var me = this;

        if (!out) {
            out = [];
            me.extra(sprite, out);
            return out;
        }

        out.push(sprite);
        Ext.each(sprite.childSprites, function (childsprite) {
            me.extra(childsprite, out);
        });

        return out;
    },

    createSpriteTree: function (rec, pos) {
        var me = this,
            childPos = Ext.apply({}, pos),
            h = me.getSpriteHeightFromRecord(rec),
            childx = childPos.x,
            childSprites = [], w = 0,
            sprite;

        Ext.each(rec.childNodes, function (childrec) {
            var childSprite = me.createSpriteTree(childrec, {
                x: childx,
                y: pos.y + h
            });

            childx += childSprite.attr.width;
            childSprites.push(childSprite);
        });

        //获得宽度
        if (rec.childNodes.length == 0) {
            w = me.getSpriteWidthFromRecord(rec);
        }
        else {
            Ext.each(childSprites, function (childSprite) {
                w += childSprite.attr.width;
            });
        }

        sprite = me.createSprite(rec, pos, {
            leaf: rec.isLeaf(),
            w: w,
            h: h,
            childSprites: childSprites
        });

        sprite.childSprites = childSprites;
        return sprite;
    },

    getText: function (rec) {
        var text = rec.data.text,
            chs = [];

        if (rec.isLeaf()) {
            for (var i = 0; i < text.length; i++) {
                chs.push(text[i]);
            }
            text = chs.join('\r\n');
        }

        return text;
    },

    createSprite: function (rec, pos, options) {
        var me = this;

        return Ext.create('YZSoft.bpa.sprite.General.Rectangle', Ext.apply({
            record: rec,
            translationX: pos.x,
            translationY: pos.y,
            width: options.w,
            height: options.h,
            fillStyle: 'white',
            strokeStyle: 'black',
            lineWidth: 2,
            sprites: {
                text: {
                    text: me.getText(rec)
                }
            }
        }, me.getSpriteDefaultConfig(rec)));
    },

    getSpriteHeightFromRecord: function (rec) {
        return 80;
    },

    getSpriteWidthFromRecord: function (rec) {
        return 100;
    }
});