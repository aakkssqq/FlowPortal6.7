
//泳道
Ext.define('YZSoft.bpa.sprite.Lane.Lane', {
    extend: 'YZSoft.bpa.sprite.Lane.Sprite',
    isLane: true,
    selectable: true,
    rangeSelect: false,
    snapRadius: 8,
    inheritableStatics: {
        def: {
            processors: {
                titlesize: 'number'
            },
            defaults: {
                titlesize: 30,
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
            textAlign: 'center',
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

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x, y);
        path.lineTo(x + w, y);
        path.lineTo(x + w, y + h);
        path.lineTo(x, y + h);
        path.closePath();
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
            ptDrag, snap;

        ptDrag = {
            x: xyDrag[0],
            y: xyDrag[1]
        };

        snap = context.snapTag = me.getSnapTag(e, opts, {x:0,y:0}, me.snapRadius);

        if (snap) {
            if (snap.lane)
                me.showAnchorLine(cntTag, snap.lane.getBorder(snap, true));
            else
                me.showAnchorPool(cntTag, snap.pool)
        }
        else {
            me.hideAnchors(cntTag);
        }

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
            designer = opts.designer,
            cntDrag = opts.cntDrag,
            cntTag = opts.cntTag,
            surfaceTag = cntTag.getSurface('shape');

        if (snap) {
            cntTag.fireEvent('beforeDorpNewSprite', me);
            snap.pool.insertLane(me, snap.lineIndex || 0);

            me.hideAnchors(cntTag);
            cntTag.fireEvent('dorpNewSprite', me);
            return false;
        }
    },

    getSnapTag: function (e, opts, offset, radius) {
        var me = this,
            cnt = opts.cntTag,
            xAttr = me.isVerti ? 'x' : 'y',
            yAttr = me.isVerti ? 'y' : 'x',
            dirAttr = me.isVerti ? 'isVerti' : 'isHoriz',
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

                var anchors = sprite.getLaneAnchors();
                if (anchors.length != 0) {
                    var anchor = Ext.Array.findBy(anchors, function (anchor) {
                        return sprite.hitTestLaneAnchor(anchor, point, radius);
                    });

                    if (anchor)
                        return anchor;
                }
                else {
                    var bbox = sprite.getBBox(false);
                    if (point.x >= bbox.x && point.x <= bbox.x + bbox.width &&
                        point.y >= bbox.y && point.y <= bbox.y + bbox.height) {
                        return {
                            pool: sprite
                        };
                    }
                }
            }
        }
    },

    showAnchorLine: function (cnt, border) {
        var me = this;

        cnt.designIndicators = cnt.designIndicators || {};
        var line = cnt.designIndicators['poolanchorline'];

        if (!line) {
            line = cnt.designIndicators['poolanchorline'] = Ext.create('YZSoft.bpa.sprite.Lane.LaneBorderIndicator', Ext.apply({}, me.anchorLineConfig, {
                lineWidth: 4
            }));

            cnt.getSurface('overdrag').add(line);
        }
        else {
            line.show();
        }

        line.setAttributes({
            x: Math.floor(border.x),
            y: border.y,
            width: border.width,
            height: border.height
        });

        line.getSurface().renderFrame();
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
            xAttr = me.isVerti ? 'x' : 'y',
            yAttr = me.isVerti ? 'y' : 'x',
            hAttr = me.isVerti ? 'height' : 'width',
            wAttr = me.isVerti ? 'width' : 'height',
            rv;

        rv = {
            lineWidth: attr.lineWidth
        };

        rv[yAttr] = attr[yAttr];
        rv[hAttr] = attr[hAttr];

        if (snap.border == 'start')
            rv[xAttr] = attr[xAttr];
        else
            rv[xAttr] = attr[xAttr] + attr[wAttr];

        if (withTrans) {
            var trans = me.getTotalTranslation();
            rv.x += trans.x;
            rv.y += trans.y;
        }

        return rv;
    }
});
