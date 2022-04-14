/*
connectable: true,
resizeable:true,
*/
Ext.define('YZSoft.src.flowchart.sprite.Sprite', {
    extend: 'YZSoft.src.flowchart.sprite.Path',
    requires: [
        'YZSoft.src.flowchart.overrides.Sprite',
        'YZSoft.src.flowchart.point.activity.ConnectionPoint',
        'YZSoft.src.flowchart.point.activity.ResizePoint'
    ],
    isShape: true,
    applyStyleZone: 'shape',
    connectable: true,
    resizeable: true,
    minWidth: 20,
    minHeight: 20,
    hitRadius: {
        hotpoint: 6,
        body: 0,
        bound: 10
    },
    archiveProperties: ['translationX', 'translationY', 'x', 'y', 'width', 'height', 'lineWidth', 'lineDash', 'strokeStyle', 'fillStyle'],
    applyProperties: ['lineWidth', 'lineDash', 'strokeStyle', 'fillStyle'],
    inheritableStatics: {
        def: {
            processors: {
                display: 'string',
                selected: 'bool',
                ischild: 'bool',
                x: 'number',
                y: 'number',
                width: 'number',
                height: 'number',
                relatiedFile: 'bool',
                showExtension: 'bool'
            },
            defaults: {
                selected: false,
                ischild: false,
                x: 0,
                y: 0,
                width: 100,
                height: 80,
                relatiedFile: false,
                showExtension: false
            },
            triggers: {
                display: 'canvas',
                selected: 'canvas',
                x: 'path,hotpoints,children,position',
                y: 'path,hotpoints,children,position',
                width: 'path,hotpoints,children,size',
                height: 'path,hotpoints,children,size',
                translationX: 'hotpoints,transform,position',
                translationY: 'hotpoints,transform,position',
                strokeStyle: 'children,canvas',
                lineWidth: 'children,canvas',
                relatiedFile: 'canvas',
                showExtension: 'canvas'
            },
            updaters: {
                children: function (attr) {
                    this.updateChildren(attr);
                },
                hotpoints: function (attr) {
                    this.updateHotPoints(attr);
                },
                position: function (attr) {
                    if (this.onPositionChanged(attr) !== false)
                        this.fireEvent('positionChanged', attr);
                },
                size: function (attr) {
                    if (this.onSizeChanged(attr) !== false)
                        this.fireEvent('sizeChanged', attr);
                }
            },
            anchors: {
                ActivityMiddleTop: {
                    docked: 't',
                    pos: function (attr) {
                        return {
                            x: attr.x + attr.width / 2,
                            y: attr.y
                        }
                    }
                },
                ActivityRightMiddle: {
                    docked: 'r',
                    pos: function (attr) {
                        return {
                            x: attr.x + attr.width,
                            y: attr.y + attr.height / 2
                        }
                    }
                },
                ActivityMiddleBottom: {
                    docked: 'b',
                    pos: function (attr) {
                        return {
                            x: attr.x + attr.width / 2,
                            y: attr.y + attr.height
                        }
                    }
                },
                ActivityLeftMiddle: {
                    docked: 'l',
                    pos: function (attr) {
                        return {
                            x: attr.x,
                            y: attr.y + attr.height / 2
                        }
                    }
                }
            }
        }
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            propertyXClass = (config.property && config.property.xclass) || (me.propertyConfig && me.propertyConfig.xclass);

        var cfg = {
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (propertyXClass) {
            me.property = Ext.create(propertyXClass, Ext.apply({
                sprite: me
            }, config.property, me.propertyConfig));
        }

        me.on({
            dblclick: 'onDblClick',
            endedit: 'onEndEdit',
            scope: me
        });
    },

    updateHotPoints: function (attr) {
        this.hotpoints = [];

        if (this.resizeable)
            this.updateResizePoints(attr);

        if (this.connectable)
            this.updateConnectionPoints(attr);
    },

    updateResizePoints: function (attr) {
        var me = this,
            pts = me.hotpoints,
            ptsmap = me.hotpointsMap = me.hotpointsMap || {},
            rp = YZSoft.src.flowchart.point.activity.ResizePoint,
            x1 = attr.translationX + attr.x,
            x2 = attr.translationX + attr.x + attr.width * 0.5,
            x3 = attr.translationX + attr.x + attr.width,
            y1 = attr.translationY + attr.y,
            y2 = attr.translationY + attr.y + attr.height * 0.5,
            y3 = attr.translationY + attr.y + attr.height;

        ptsmap.r1 = ptsmap.r1 || new rp({ sprite: me, pos: 'tl' });
        ptsmap.r2 = ptsmap.r2 || new rp({ sprite: me, pos: 'tr' });
        ptsmap.r3 = ptsmap.r3 || new rp({ sprite: me, pos: 'br' });
        ptsmap.r4 = ptsmap.r4 || new rp({ sprite: me, pos: 'bl' });

        ptsmap.r1.setPos(x1, y1);
        ptsmap.r2.setPos(x3, y1);
        ptsmap.r3.setPos(x3, y3);
        ptsmap.r4.setPos(x1, y3);

        pts.push(ptsmap.r1);
        pts.push(ptsmap.r2);
        pts.push(ptsmap.r3);
        pts.push(ptsmap.r4);
    },

    updateConnectionPoints: function (attr) {
        var me = this,
            pts = me.hotpoints,
            ptsmap = me.hotpointsMap = me.hotpointsMap || {},
            cp = YZSoft.src.flowchart.point.activity.ConnectionPoint,
            anchors = me.self.def.anchors;

        Ext.Object.each(anchors, function (name, anchor) {
            if (anchor === false)
                return;

            var cpt = ptsmap[name] = ptsmap[name] || new cp({ sprite: me, name: name });
            Ext.copyTo(cpt, anchor, ['docked']);
            cpt.setPos(me.getAnchorPos(anchor.pos, attr));
            pts.push(cpt);
        });
    },

    getAnchorPos: function (fn, attr) {
        var pt = fn(attr);
        pt.x += attr.translationX;
        pt.y += attr.translationY;
        return pt;
    },

    hitTest: function (point, options) {
        var me = this,
            attr = me.attr,
            options = options || {},
            point, pointLocal, text, i;

        point = {
            x: point[0],
            y: point[1]
        };

        pointLocal = {
            x: point.x - attr.translationX,
            y: point.y - attr.translationY
        };

        if (options.child) {
            if (attr.relatiedFile) {
                var bbox = me.getRelatedFileBox(true);
                if (me.ptInBBox(pointLocal, bbox)) {
                    return {
                        sprite: me,
                        shortcut: true,
                        type: 'RelatedFile'
                    };
                }
            }
        }

        if (options.child) {
            for (i = 0; i < me.items.length; i++) {
                var sprite = me.items[i],
                    hit;

                if (sprite.selectable) {
                    hit = sprite.hitTest([pointLocal.x, pointLocal.y], options);
                    if (hit) {
                        return {
                            sprite: me,
                            hitChild: true,
                            target: sprite,
                            text: hit.text
                        };
                    }
                }
            }
        }

        if (options.text)
            text = me.hitTestText(pointLocal);

        if (me.hitTestBound(point, me.hitRadius.bound)) {
            if (me.hitTestHotPoint(point, me.hitRadius.hotpoint) ||
                me.hitTestBody(point)) {
                return {
                    sprite: me,
                    hitChild: false,
                    text: text
                };
            }
        }

        if (text) {
            return {
                sprite: me,
                hitChild: false,
                text: text
            };
        }

        return null;
    },

    hitTestBound: function (point, radius) {
        var me = this,
            bbox = me.getBBox(false),
            r = radius || me.hitRadius.bound,
            hitbbox, i, ln;

        hitbbox = {
            left: bbox.x - r,
            right: bbox.x + bbox.width + r,
            top: bbox.y - r,
            bottom: bbox.y + bbox.height + r
        };

        if (point.x >= hitbbox.left && point.x <= hitbbox.right && point.y >= hitbbox.top && point.y <= hitbbox.bottom)
            return true;
    },

    ptInBBox: function (point, bbox) {
        return point.x >= bbox.x && point.x <= bbox.x + bbox.width && point.y >= bbox.y && point.y <= bbox.y + bbox.height;
    },

    hitTestHotPoint: function (point, radius) {
        var me = this,
            hpts = me.hotpoints || [],
            radius = radius || me.hitRadius.hotpoint;

        for (var i = hpts.length - 1; i >= 0; i--) {
            var hpt = hpts[i];
            if (hpt.hitTest(point, radius))
                return hpt;
        };
    },

    hitTestBody: function (point, radius) {
        var me = this,
            bbox = me.getBBox(false),
            r = radius || me.hitRadius.body,
            hitbbox = {
                left: bbox.x - r,
                right: bbox.x + bbox.width + r,
                top: bbox.y - r,
                bottom: bbox.y + bbox.height + r
            };

        if (point.x >= hitbbox.left && point.x <= hitbbox.right && point.y >= hitbbox.top && point.y <= hitbbox.bottom)
            return true;
    },

    isSelected: function () {
        return this.attr.selected;
    },

    render: function (surface, ctx) {
        var me = this,
            attr = me.attr,
            mat = attr.matrix,
            imat = attr.inverseMatrix;

        if (Ext.Array.findBy(me.items, function (sprite) {
            return me.backgroundRenderFilter(sprite);
        })) {
            ctx.save();
            mat.toContext(ctx);
            me.renderChildren(surface, ctx, me.backgroundRenderFilter);
            ctx.restore();
        }

        me.callParent(arguments);

        mat.toContext(ctx);
        me.renderChildren(surface, ctx, me.renderFilter);

        if (attr.selected) {
            imat.toContext(ctx);
            me.renderHotPoints(surface, ctx);
        }
    },

    backgroundRenderFilter: function (sprite) {
        return sprite.isBackground;
    },

    renderFilter: function (sprite) {
        return !sprite.isBackground;
    },

    renderHotPoints: function (surface, ctx) {
        var me = this,
            attr = me.attr,
            pts = me.hotpoints = me.hotpoints || [];

        Ext.each(pts, function (pt) {
            pt.draw(ctx);
        });
    },

    getSpriteId: function () {
        return this.property.data.Id;
    },

    setSpriteId: function (newId) {
        this.property.data.Id = newId;
    },

    setSpriteName: function (newName, render) {
        var me = this;

        me.property.data.Name = newName;
        me.setSpriteText(newName, render);
    },

    getSpriteName: function () {
        return this.property.data.Name;
    },

    setRelatiedFile: function (fileid, filename) {
        var me = this;

        me.relatiedFile = fileid;
        me.relatiedFileName = filename;
        me.setAttributes({
            relatiedFile: fileid ? true : false
        });
    },

    setSpriteText: function (text, render) {
        var me = this,
            surface;

        if (me.sprites.text) {
            me.sprites.text.setAttributes({
                text: text
            });

            if (render) {
                surface = me.getSurface();
                if (surface)
                    surface.renderFrame();
            }
        }
    },

    updatePlainBBox: function (plain) {
        var attr = this.attr;
        plain.x = attr.x;
        plain.y = attr.y;
        plain.width = attr.width;
        plain.height = attr.height;
    },

    updateTransformedBBox: function (transform, plain) {
        this.attr.matrix.transformBBox(plain, this.attr.radius, transform);
    },

    onDblClick: function (e) {
        var me = this,
            surface = me.getSurface(),
            attr = me.attr,
            xy = surface.getEventXY(e),
            hitSprite;

        hitSprite = me.hitTestText({
            x: xy[0] - attr.translationX,
            y: xy[1] - attr.translationY
        });

        if (hitSprite)
            return hitSprite.fireEvent('dblclick', e);
    },

    archive: function () {
        var me = this,
            archive = me.archiveSprite(me.attr, me.archiveProperties);

        archive.sprites = {};
        Ext.Object.each(me.sprites, function (name, childSprite) {
            if (childSprite.archive) {
                archive.sprites[name] = childSprite.archive();
            }
            else {
                var data = me.archiveSprite(childSprite.attr, childSprite.archiveProperties);
                if (data)
                    archive.sprites[name] = data;
            }
        });

        return archive;
    },

    archiveSprite: function (attr, props) {
        var me = this,
            rv;

        if (props && props.length != 0) {
            rv = {};
            Ext.each(props, function (name) {
                if (me.canChangeLineStyle === false && name == 'lineDash')
                    return;

                var value = attr[name];

                if (!Ext.isObject(value))
                    rv[name] = attr[name];
                else
                    rv[name] = attr[name].config;
            });
        }

        return rv;
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
    },

    onPositionChanged: function (attr) {
    },

    onSizeChanged: function (attr) {
    },

    onEndEdit: function (text) {
        this.setSpriteName(text, false);
    },

    getXAligns: function () {
        return { m: 0 };
    },

    getYAligns: function () {
        return { m: 0 };
    }
});