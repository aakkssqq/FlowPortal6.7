Ext.define('YZSoft.src.flowchart.link.Link', {
    extend: 'Ext.draw.sprite.Path',
    requires: [
        'YZSoft.src.flowchart.overrides.Sprite',
        'Ext.util.Point',
        'Ext.util.Region',
        'YZSoft.src.flowchart.point.link.FromPoint',
        'YZSoft.src.flowchart.point.link.MiddlePoint',
        'YZSoft.src.flowchart.point.link.ToPoint',
        'YZSoft.src.flowchart.point.link.CornerPoint'
    ],
    isLink: true,
    applyStyleZone: 'link',
    canChangeFillStyle: false,
    supportFillStyle: false,
    inheritableStatics: {
        def: {
            processors: {
                points: 'data',
                selected: 'bool',
                dockIndex: 'number',
                startArrowType: 'string',
                endArrowType: 'string'
            },
            defaults: {
                points: [],
                selected: false,
                lineWidth: 1,
                strokeOpacity: 1,
                strokeStyle: '#4677bf',
                dockIndex: 1,
                lineJoin: 'round'
            },
            triggers: {
                points: 'path,hotpoints',
                selected: 'selected',
                dockIndex: 'dock',
                translationX: 'transform,snap',
                translationY: 'transform,snap',
                strokeStyle: 'children,canvas',
                lineWidth: 'children,path,canvas',
                startArrowType: 'path',
                endArrowType: 'path'
            },
            updaters: {
                children: function (attr) {
                    this.updateChildren(attr);
                },
                hotpoints: function (attr) {
                    this.updateHotPoints(attr);
                },
                dock: function (attr) {
                    this.updateDockIndex(attr);
                },
                selected: function (attr) {
                    this.updateSelected(attr);
                },
                snap: function (attr) {
                    this.updateAlignSnaps();
                }
            }
        }
    },
    archiveProperties: ['translationX', 'translationY', 'lineWidth', 'lineDash', 'strokeStyle', 'dockIndex', 'points', 'startArrowType', 'endArrowType'],
    applyProperties: ['lineWidth', 'lineDash', 'strokeStyle'],
    sprites: {
        text: {
            xclass: 'YZSoft.src.flowchart.sprite.Text',
            x: 0.5,
            y: 0.5,
            translationX: 0,
            translationY: 0,
            textAlign: 'center',
            textBaseline: 'center',
            text: '',
            fontSize: 12,
            fillStyle: 'black',
            debug: {
                bbox: false
            }
        },
        startArrow: {
            xclass: 'YZSoft.src.flowchart.link.Arrow',
            archiveProperties: ['type'],
            type: 'none'
        },
        endArrow: {
            xclass: 'YZSoft.src.flowchart.link.Arrow',
            archiveProperties: ['type'],
            type: 'solidArrow'
        }
    },
    hitRadius: {
        hotpoint: 4,
        line: 4,
        bound: 8,
        snap: 6,
        text: 1,
        snaptext: 20
    },
    listeners: {
        mousedown: 'onMouseDown',
        mousemove: 'onMouseMove',
        dragtopointmousemove: 'onDragToPointMouseMove',
        dragtopointmouseup: 'onDragToPointMouseUp',
        dragtopointmouseout: 'onDragToPointMouseOut',
        dragfrompointmousemove: 'onDragFromPointMouseMove',
        dragfrompointmouseup: 'onDragFromPointMouseUp',
        dragfrompointmouseout: 'onDragFromPointMouseOut',
        draglinehvmousemove: 'onDragLineHVMouseMove',
        draglinehvmouseup: 'onDragLineHVMouseUp',
        draglinehvmouseout: 'onDragLineHVMouseOut',
        draglinktextmousemove: 'onDragTextMouseMove',
        draglinktextmouseup: 'onDragTextMouseUp',
        draglinktextmouseout: 'onDragTextMouseOut'
    },

    hvSnapExceptFn: function (sprite, axis, context) {
        if (sprite)
            return sprite.isShape;

        if (axis && axis.tag.isLink)
            return context.link == axis.tag && context.line.index == axis.line.index;
    },

    hotPoint: {
        maxRadius: 6,
        hitRadius: 8
    },
    line: {
        hitRadius: 3
    },
    onMouseMove: Ext.emptyFn,
    onDragToPointMouseOut: Ext.emptyFn,
    onDragFromPointMouseOut: Ext.emptyFn,
    onDragLineHVMouseOut: Ext.emptyFn,
    onDragLineHVMouseUp: Ext.emptyFn,
    updateAlignSnaps: Ext.emptyFn,

    constructor: function (config) {
        var me = this;

        me.data = Ext.apply(me.data || {}, {
            ProcessConfirmType: 'None',
            ConditionType: 'True'
        });

        me.callParent(arguments);
        me.updateDockIndex(me.attr);

        me.on({
            arrowTypeChanged: function (arrow, newtype) {
                var attr = {};

                if (arrow == me.sprites.startArrow)
                    attr.startArrowType = newtype;
                else
                    attr.endArrowType = newtype;

                me.setAttributes(attr);
            }
        });
    },

    setText: function (newText) {
        var me = this,
            surface = me.getSurface();

        me.sprites.text.setAttributes({
            text: newText
        });

        if (surface)
            surface.renderFrame();
    },

    updateChildStartArrow: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            strokeStyle: attr.strokeStyle,
            lineWidth: attr.lineWidth
        });
    },

    updateChildEndArrow: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            strokeStyle: attr.strokeStyle,
            lineWidth: attr.lineWidth
        });
    },

    updateSelected: function (attr) {
        if (this.sprites && this.sprites.text && this.sprites.text.setAttributes) {
            this.sprites.text.setBackground({
                fillStyle: attr.selected ? '#33ff33' : 'white'
            });
        }
    },

    regularPoint: function (pt, attr) {
        var me = this;

        if (attr.lineWidth % 2 == 0) {
            return {
                x: Math.round(pt.x),
                y: Math.round(pt.y)
            };
        }
        else {
            return {
                x: Math.floor(pt.x) + 0.5,
                y: Math.floor(pt.y) + 0.5
            };
        }
    },

    updatePath: function (path, attr) {
        var me = this,
            pts = attr.points || [],
            c = pts.length,
            p1, p2, mpStart, mpEnd;

        if (c >= 2) {
            p1 = me.regularPoint(pts[1], attr);
            p2 = me.regularPoint(pts[0], attr);
            me.sprites.startArrow.setAttributes({
                x1: p1.x,
                y1: p1.y,
                x2: p2.x,
                y2: p2.y
            });
            mpStart = me.sprites.startArrow.getMiddlePoint();

            p1 = me.regularPoint(pts[c - 2], attr);
            p2 = me.regularPoint(pts[c - 1], attr);
            me.sprites.endArrow.setAttributes({
                x1: p1.x,
                y1: p1.y,
                x2: p2.x,
                y2: p2.y
            });
            mpEnd = me.sprites.endArrow.getMiddlePoint();
        }

        for (var i = 0; i < c; i++) {
            var p = me.regularPoint(pts[i], attr),
                x = p.x,
                y = p.y;

            p1 = p2;
            p2 = {
                x: x,
                y: y
            };

            if (i == 0) {
                if (mpStart) {
                    path.moveTo(x, y);
                    path.moveTo(mpStart.x, mpStart.y);
                }
                else {
                    path.moveTo(x, y);
                }
            }
            else {
                if (i != c - 1) {
                    path.lineTo(x, y);
                }
                else {
                    if (mpEnd) {
                        path.lineTo(mpEnd.x, mpEnd.y);
                        path.moveTo(p2.x, p2.y); //getBBox算法，如果没最终点，bbox会减小
                    }
                    else {
                        path.lineTo(x, y);
                    }
                }
            }
        }
    },

    updateHotPoints: function (attr) {
        var me = this,
            pts = attr.points || [],
            hps = me.hotpoints = [],
            links = YZSoft.src.flowchart.point.link;

        if (pts.length < 2)
            return;

        hps.push(new links.FromPoint({
            x: pts[0].x,
            y: pts[0].y
        }));

        for (var i = 1, cnt = pts.length; i < cnt; i++) {
            var pt1 = pts[i - 1],
                pt2 = pts[i],
                mpt = me.getMiddlePoint(pt1, pt2);

            hps.push(new links.MiddlePoint({
                x: mpt.x,
                y: mpt.y
            }));

            if (i == cnt - 1)
                hps.push(new links.ToPoint({
                    x: pt2.x,
                    y: pt2.y
                }));
            else {
                hps.push(new links.CornerPoint({
                    x: pt2.x,
                    y: pt2.y
                }));
            }
        }

        me.updateDockIndex(attr);
    },

    updateDockIndex: function (attr) {
        var me = this,
            point = me.hotpoints[attr.dockIndex],
            text = me.sprites.text,
            cfg;

        if (text) {
            if (me.hotpoints.length == 0) {
                if (text.hide)
                    text.hide();
            }
            else if (point && text.setAttributes) {
                text.show();

                text.setAttributes({
                    translationX: point.x,
                    translationY: point.y
                });
            }
        }
    },

    getMiddlePoint: function (pt1, pt2) {
        return new Ext.util.Point(Math.floor((pt1.x + pt2.x) / 2), Math.floor((pt1.y + pt2.y) / 2));
    },

    render: function (surface, ctx) {
        var me = this,
            mat = me.attr.matrix,
            attr = me.attr;

        me.callParent(arguments);

        mat.toContext(ctx);
        me.renderChildren(surface, ctx);

        if (attr.selected)
            me.renderHotPoints(surface, ctx);
    },

    renderHotPoints: function (surface, ctx) {
        var me = this,
            attr = me.attr,
            pts = me.hotpoints = me.hotpoints || [];

        Ext.each(pts, function (pt) {
            pt.draw(ctx);
        });
    },

    hitTest: function (point, options) {
        var me = this,
            point = {
                x: point[0],
                y: point[1]
            };

        if (me.hitTestText(point, me.hitRadius.text)) {
            return {
                sprite: me
            };
        }

        if (me.hitTestBound(point, me.hitRadius.bound)) {
            if (me.hitTestHotPoint(point, me.hitRadius.hotpoint) ||
                me.hitTestLine(point, me.hitRadius.line)) {
                return {
                    sprite: me
                };
            }
        }

        return null;
    },

    hitTestBound: function (point, radius) {
        var me = this,
            bbox = me.getBBox(false),
            r = radius || me.hitRadius.bound,
            hitbbox = {
                left: bbox.x - r,
                right: bbox.x + bbox.width + r,
                top: bbox.y - r,
                bottom: bbox.y + bbox.height + r
            };

        if (point.x >= hitbbox.left && point.x <= hitbbox.right && point.y >= hitbbox.top && point.y <= hitbbox.bottom)
            return true;
    },

    hitTestHotPoint: function (point, radius) {
        var me = this,
            point = me.inverseTranslationPoint(point),
            hpts = me.hotpoints || [],
            radius = radius || me.hitRadius.hotpoint;

        for (var i = hpts.length - 1; i >= 0; i--) {
            var hpt = hpts[i];
            if (hpt.hitTest(point, radius))
                return hpt;
        };
    },

    hitTestLine: function (point, radius) {
        var me = this,
            point = me.inverseTranslationPoint(point),
            radius = radius || me.hitRadius.line,
            pts = me.attr.points || [];

        for (var i = pts.length - 1; i >= 1; i--) {
            var p1 = pts[i - 1],
                p2 = pts[i];

            if (me.pointOnLine(p1.x, p1.y, p2.x, p2.y, point.x, point.y, radius))
                return me.getLine(pts, i - 1);
        }
    },

    hitTestText: function (point, radius) {
        var me = this,
            point = me.inverseTranslationPoint(point),
            radius = radius || me.hitRadius.text,
            text = me.sprites.text,
            bbox = text.getBBox(false),
            r = radius || me.hitRadius.text,
            hitbbox = {
                left: bbox.x - r,
                right: bbox.x + bbox.width + r,
                top: bbox.y - r,
                bottom: bbox.y + bbox.height + r
            };

        if (point.x >= hitbbox.left && point.x <= hitbbox.right && point.y >= hitbbox.top && point.y <= hitbbox.bottom)
            return text;
    },

    getLine: function (points, index) {
        var me = this,
            pts = points || [],
            p1 = pts[index],
            p2 = pts[index + 1];

        return {
            from: {
                index: index,
                point: p1
            },
            to: {
                index: index + 1,
                point: p2
            },
            index: index,
            isHorz: p1.y == p2.y,
            isVert: p1.x == p2.x
        };
    },

    pointOnLine: function (x1, y1, x2, y2, x, y, radius) {
        var t, _;
        if (Math.abs(x2 - x1) < Math.abs(y2 - y1)) {
            _ = x1;
            x1 = y1;
            y1 = _;
            _ = x2;
            x2 = y2;
            y2 = _;
            _ = x;
            x = y;
            y = _;
        }
        t = (x - x1) / (x2 - x1);
        if (t < 0 || t > 1) {
            return false;
        }
        return Math.abs(y1 + t * (y2 - y1) - y) < radius;
    },

    onMouseMove: function (e, context) {
        var me = this,
            cnt = context.drawContainer,
            plugin = context.plugin;

        if (me.isSelected())
            return;

        plugin.setCursor('clickselectlink', function () {
            cnt.deselectAll(true);
            cnt.select(me);
            cnt.renderFrame();
        });
    },

    onDragToPointMouseMove: function (e, context) {
        var me = this,
            plugin = context.plugin,
            surface = me.getSurface(),
            xy = surface.getEventXY(e),
            point = {
                x: xy[0],
                y: xy[1]
            };

        var excepts = [me.from];
        var snap = plugin.getSnapCnnPoint(e, excepts);

        if (snap)
            me.dragPathTPToCnnPoint(snap, context);
        else
            me.dragPathTPToPoint(point, context);

        surface.renderFrame();
    },

    onDragToPointMouseUp: function (e, context) {
        var me = this,
            plugin = context.plugin,
            cnt = context.drawContainer,
            surface = me.getSurface();

        var excepts = [me.from];
        var snap = plugin.getSnapCnnPoint(e, excepts);

        if (snap) {
            if (me.to == snap) {
                me.restore();
            }
            else if (!me.processDuplicationLink(cnt, me.from, snap, me, context.mode)) {
                me.dragPathTPToCnnPoint(snap, context);
                me.to = snap;
                cnt.deselectAll(true);
                cnt.select(me);
                cnt.commitUndoStep();
            }
        }
        else {
            if (context.mode == 'newlink') {
                cnt.deselectAll();
                surface.remove(me, true);
            }
            if (context.mode == 'existlink')
                me.restore();
        }

        cnt.renderFrame();
        plugin.releaseCapture();
    },

    onDragFromPointMouseMove: function (e, context) {
        var me = this,
            plugin = context.plugin,
            surface = me.getSurface(),
            xy = surface.getEventXY(e),
            point = {
                x: xy[0],
                y: xy[1]
            };

        var excepts = [me.to];
        var snap = plugin.getSnapCnnPoint(e, excepts);

        if (snap)
            me.dragPathFPToCnnPoint(snap, context);
        else
            me.dragPathFPToPoint(point, context);

        surface.renderFrame();
    },

    onDragFromPointMouseUp: function (e, context) {
        var me = this,
            plugin = context.plugin,
            cnt = context.drawContainer,
            surface = me.getSurface();

        var excepts = [me.from];
        var snap = plugin.getSnapCnnPoint(e, excepts);

        if (snap) {
            if (me.from == snap) {
                me.restore();
            }
            else if (!me.processDuplicationLink(cnt, snap, me.to, me, 'existlink')) {
                me.dragPathFPToCnnPoint(snap, context);
                me.from = snap;
                cnt.deselectAll(true);
                cnt.select(me);
                cnt.commitUndoStep();
            }
        }
        else {
            me.restore();
        }

        cnt.renderFrame();
        plugin.releaseCapture();
    },

    onDragLineHVMouseMove: function (e, context) {
        var me = this,
            plugin = context.plugin,
            surface = me.getSurface(),
            xy = surface.getEventXY(e),
            point = {
                x: xy[0],
                y: xy[1]
            },
            excepts = [],
            snapy, snapx;

        if (context.line.isHorz)
            snapy = plugin.snapHLine(e, plugin.snapRadius.hvline, excepts, me.hvSnapExceptFn, 0, { m: 0 }, context);
        if (context.line.isVert)
            snapx = plugin.snapVLine(e, plugin.snapRadius.hvline, excepts, me.hvSnapExceptFn, 0, { m: 0 }, context);

        if (snapy)
            point.y = snapy.value;
        if (snapx)
            point.x = snapx.value;

        me.dragLineHVTo(point, context);
        surface.renderFrame();
    },

    onDragLineHVMouseUp: function (e, context) {
        var me = this,
            plugin = context.plugin,
            surface = me.getSurface();

        plugin.hideHVLines();
        context.drawContainer.commitUndoStep();
        surface.renderFrame();
        plugin.releaseCapture();
    },

    onDragTextMouseMove: function (e, context) {
        var me = this,
            surface = me.getSurface(),
            text = me.sprites.text,
            xy = surface.getEventXY(e),
            point = {
                x: xy[0],
                y: xy[1]
            },
            hp = me.hitTestHotPoint(point, me.hitRadius.snaptext);

        if (hp && (hp.isMiddlePoint || hp.isCornerPoint)) {
            hp.setHot(true);
            me.lasthotpoint.setHot(false);
            me.lasthotpoint = hp;

            me.setAttributes({
                dockIndex: me.hotpoints.indexOf(hp)
            });

            surface.renderFrame();
        }
    },

    onDragTextMouseUp: function (e, context) {
        var me = this,
            plugin = context.plugin,
            surface = me.getSurface();

        me.lasthotpoint.setHot(false);
        me.sprites.text.setBackground(context.savedBackground);

        if (context.dockIndex != me.attr.dockIndex)
            context.drawContainer.commitUndoStep();

        surface.renderFrame();
        plugin.releaseCapture();
    },

    onDragTextMouseOut: function (e, context) {
    },

    save: function () {
        var me = this,
            s = me.saved = {
                from: me.from,
                to: me.to,
                dockIndex: me.attr.dockIndex,
                translationX: me.attr.translationX,
                translationY: me.attr.translationY,
                points: []
            },
            pts = s.points;

        Ext.each(me.attr.points, function (pt) {
            pts.push({
                x: pt.x,
                y: pt.y
            });
        });
    },

    restore: function () {
        var me = this;

        Ext.apply(me, me.saved);
        me.setAttributes({
            translationX: me.saved.translationX,
            translationY: me.saved.translationY,
            points: me.saved.points,
            dockIndex: me.saved.dockIndex
        });
    },

    inverseTranslationPoint: function (point) {
        return {
            x: point.x - (this.attr.translationX || 0),
            y: point.y - (this.attr.translationY || 0)
        }
    },

    translationPoint: function (point) {
        return {
            x: point.x + (this.attr.translationX || 0),
            y: point.y + (this.attr.translationY || 0)
        }
    },

    processDuplicationLink: function (container, from, to, link, mode) {
        var me = this,
            cnt = container,
            surface = link.getSurface(),
            duplicate;

        duplicate = me.hasDuplicationLink(container, from, to, link, mode)

        if (duplicate) {
            YZSoft.alert(RS.$('Process_DuplicationLink'), function () {
                if (mode == 'newlink') {
                    cnt.deselectAll();
                    surface.remove(link, true);
                }
                if (mode == 'existlink')
                    link.restore();

                surface.renderFrame();
            });
        }

        return duplicate;
    },

    hasDuplicationLink: function (container, from, to, link) {
        var me = this,
            cnt = container,
            surfaces = cnt.getItems();

        for (var i = 0, c = surfaces.length; i < c; i++) {
            var surface = surfaces.get(i),
                sprites = surface.getItems();

            if (!surface.isSurface)
                continue;

            for (var j = 0, c2 = sprites.length; j < c2; j++) {
                var sprite = sprites[j];

                if (sprite.isLink && sprite != link && sprite.from == from && sprite.to == to)
                    return true;
            }
        }
    },

    archive: function () {
        var me = this,
            archive = Ext.copyTo({}, me.attr, me.archiveProperties);

        var points = archive.points;
        archive.points = [];
        Ext.each(points, function (point) {
            archive.points.push({
                x: point.x,
                y: point.y
            });
        });

        archive.sprites = {};
        Ext.Object.each(me.sprites, function (name, childSprite) {
            archive.sprites[name] = Ext.copyTo({}, childSprite.attr, childSprite.archiveProperties);
        });

        return archive;
    },

    applyStyle: function (templateSprite) {
        var me = this;

        me.applySpriteStype(me, templateSprite);

        Ext.Object.each(me.sprites, function (name, childSprite) {
            var templateChildSprite = templateSprite.sprites[name];
            if (templateChildSprite) {
                if (childSprite.applyStyle)
                    childSprite.applyStyle(templateChildSprite);
                else
                    me.applySpriteStype(childSprite, templateChildSprite);
            }
        });
    },

    applySpriteStype: function (sprite, templateSprite) {
        var props = sprite.applyProperties || ['lineWidth', 'lineDash', 'strokeStyle', 'fillStyle'];
        sprite.setAttributes(Ext.copyTo({}, templateSprite.attr, props));
    }
});