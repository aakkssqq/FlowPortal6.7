
//分割条
Ext.define('YZSoft.bpa.sprite.Lane.Separator', {
    extend: 'YZSoft.bpa.sprite.Lane.Sprite',
    isSeparator: true,
    selectable: true,
    rangeSelect: false,
    inheritableStatics: {
        def: {
            processors: {
                titlesize: 'number'
            },
            defaults: {
                titlesize: 21,
                lineWidth: 1,
                fillStyle: '#fff'
            },
            triggers: {
                ischild: 'path',
                titlesize: 'path,children',
                fillStyle: 'children'
            }
        }
    },
    sprites: {
        rect: {
            xclass: 'YZSoft.bpa.sprite.basic.Rect'
        },
        text: {
            xclass: 'YZSoft.src.flowchart.sprite.BoxText',
            text: '',
            textAlign: 'start',
            textBaseline: 'middle',
            fontFamily: RS.$('All_BPA_FontFamily'),
            fontSize: 13,
            fillStyle: 'black',
            background: {
                fillStyle: 'none'
            },
            editable: true
        }
    },

    constructor: function (config) {
        var me = this;
        me.callParent(arguments);

        me.on({
            scope: me,
            dragnewspriteMouseMove: 'onDragNewSpriteMouseMove',
            dragnewspriteMouseUp: 'onDragNewSpriteMouseUp'
        });
    },

    onDragNewSpriteMouseMove: function (e, opts) {
        var me = this,
            designer = opts.designer,
            context = opts.context,
            bbox = context.bbox,
            cntDrag = opts.cntDrag,
            surfaceDrag = cntDrag.getSurface(),
            cntTag = opts.cntTag,
            surfaceTag = cntTag.getSurface('shape'),
            xyDrag = surfaceDrag.getEventXY(e),
            inclipbox = opts.inclipbox,
            ptDrag, snap;

        ptDrag = {
            x: xyDrag[0],
            y: xyDrag[1]
        };

        snap = context.snapTag = me.getSnapTag(e, opts, { x: 0, y: 0 }, me.snapRadius);

        if (inclipbox)
            cntDrag.setCursor(snap ? 'dragnewsprite' : 'dragnewspritedeny');

        if (snap)
            me.showAnchorPool(cntTag, snap.pool)
        else
            me.hideAnchors(cntTag);

        me.setAttributes({
            translationX: ptDrag.x - bbox.width / 2,
            translationY: ptDrag.y - bbox.height / 2
        });

        return false;
    },

    onDragNewSpriteMouseUp: function (e, opts) {
        var me = this,
            context = opts.context,
            snap = context.snapTag,
            pool = snap.pool,
            sps = pool.getSeparators(),
            designer = opts.designer,
            cntDrag = opts.cntDrag,
            cntTag = opts.cntTag,
            surfaceTag = cntTag.getSurface('shape'),
            attr;


        if (snap) {
            var trans = snap.pool.getTotalTranslation();

            attr = {
                x: 0,
                y: 0,
                width: snap.pos + snap.pool.attr.titlesize,
                height: snap.pos + +snap.pool.attr.titlesize
            };

            if (sps.length != 0) {
                Ext.apply(attr, {
                    titlesize: pool.getMaxSeparatorTitleSize()
                });
            }

            me.setAttributes(attr);

            cntTag.fireEvent('beforeDorpNewSprite', me);
            snap.pool.insertSeparator(me, snap.pos);

            me.hideAnchors(cntTag);
            cntTag.fireEvent('dorpNewSprite', me);
            return false;
        }
        else {
            return false;
        }
    },

    getSnapTag: function (e, opts, offset, radius) {
        var me = this,
            cnt = opts.cntTag,
            xAttr = me.isHoriz ? 'x' : 'y',
            yAttr = me.isHoriz ? 'y' : 'x',
            wAttr = me.isHoriz ? 'width' : 'height',
            hAttr = me.isHoriz ? 'height' : 'width',
            dirAttr = me.isHoriz ? 'isVerti' : 'isHoriz',
            radius = radius || me.snapRadius,
            surfaces = cnt.getItems(),
            i, j, snap;

        for (i = surfaces.length - 1; i >= 0; i--) {
            var surface = surfaces.get(i),
                sprites = surface.getItems(),
                xy = surface.getEventXY(e),
                point = {
                    x: xy[0] + offset.x,
                    y: xy[1] + offset.y
                };

            for (j = sprites.length - 1; j >= 0; j--) {
                var sprite = sprites[j];

                if (!sprite.isPool || !sprite[dirAttr])
                    continue;

                var bbox = Ext.apply({}, sprite.getBBox(false)),
                    lanesize = sprite.getMaxLaneTitleSize();

                bbox[yAttr] += sprite.attr.titlesize + lanesize;
                bbox[hAttr] -= sprite.attr.titlesize + lanesize;

                if (point.x >= bbox.x && point.x <= bbox.x + bbox.width &&
                    point.y >= bbox.y && point.y <= bbox.y + bbox.height) {
                    return {
                        pool: sprite,
                        pos: point[yAttr] - bbox[yAttr] + lanesize
                    };
                }
            }
        }
    },

    showAnchorPool: function (cnt, pool) {
        var me = this;

        cnt.designIndicators = cnt.designIndicators || {};
        var line = cnt.designIndicators['poolanchorpool'];

        if (!line) {
            line = cnt.designIndicators['poolanchorpool'] = Ext.create('YZSoft.bpa.sprite.Lane.PoolIndicator', Ext.apply({}, me.anchorPoolConfig, {
                lineWidth: 4
            }));

            cnt.getSurface('overdrag').add(line);
        }
        else {
            line.show();
        }

        line.setAttributes({
            x: pool.attr.x,
            y: pool.attr.y,
            width: pool.attr.width,
            height: pool.attr.height,
            translationX: pool.attr.translationX,
            translationY: pool.attr.translationY
        });

        line.getSurface().renderFrame();
    },

    hideAnchors: function (cnt) {
        var me = this,
            designIndicators = cnt.designIndicators || {};

        if (designIndicators.poolanchorline)
            designIndicators.poolanchorline.hide();

        if (designIndicators.poolanchorpool)
            designIndicators.poolanchorpool.hide();

        cnt.getSurface('overdrag').renderFrame();
    },

    getBorder: function (snap, withTrans) {
        var me = this,
            attr = me.attr,
            xAttr = me.isHoriz ? 'x' : 'y',
            yAttr = me.isHoriz ? 'y' : 'x',
            hAttr = me.isHoriz ? 'height' : 'width',
            wAttr = me.isHoriz ? 'width' : 'height',
            rv;

        rv = {
            lineWidth: attr.lineWidth
        };

        rv[xAttr] = attr[xAttr];
        rv[wAttr] = attr[wAttr];

        if (snap.border == 'start')
            rv[yAttr] = attr[yAttr];
        else
            rv[yAttr] = attr[yAttr] + attr[hAttr];

        if (withTrans) {
            var trans = me.getTotalTranslation();
            rv.x += trans.x;
            rv.y += trans.y;
        }

        return rv;
    },

    getTitleBorder: function (snap, withTrans) {
        var me = this,
            attr = me.attr,
            titlesize = attr.titlesize,
            xAttr = me.isHoriz ? 'x' : 'y',
            yAttr = me.isHoriz ? 'y' : 'x',
            hAttr = me.isHoriz ? 'height' : 'width',
            wAttr = me.isHoriz ? 'width' : 'height',
            rv;

        rv = {
            lineWidth: attr.lineWidth
        };

        rv[yAttr] = attr[yAttr];
        rv[hAttr] = attr[hAttr];

        if (snap.border == 'start')
            rv[xAttr] = attr[xAttr];
        else
            rv[xAttr] = attr[xAttr] + titlesize;

        if (withTrans) {
            var trans = me.getTotalTranslation();
            rv.x += trans.x;
            rv.y += trans.y;
        }

        return rv;
    }
});
