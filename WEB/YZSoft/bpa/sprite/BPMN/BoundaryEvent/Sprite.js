Ext.define('YZSoft.bpa.sprite.BPMN.BoundaryEvent.Sprite', {
    extend: 'YZSoft.bpa.sprite.BPMN.Sprite',
    switchable: true,
    snapRadius: 8,
    singleSelection: true,
    deleteWithHolder: true,
    canChangeLineStyle: false,
    inheritableStatics: {
        def: {
            defaults: {
                width: 36,
                height: 36,
                strokeStyle: '#000',
                fillStyle: '#fff',
                lineWidth: 1
            },
            triggers: {
                strokeStyle: 'canvas,children'
            }
        }
    },

    constructor: function (config) {
        var me = this;
        me.callParent(arguments);

        me.on({
            scope: me,
            dragnewspriteMouseMove: 'onDragNewSpriteMouseMove',
            dragnewspriteMouseUp: 'onDragNewSpriteMouseUp',
            beginDragDropSelection: 'onBeginDragDropSelection',
            dragSpriteMouseMove: 'onDragSpriteMouseMove',
            dragSpriteMouseUp: 'onDragSpriteMouseUp'
        });
    },

    updateChildText: function (sprite, attr) {
        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            x: Math.floor(attr.x + attr.width / 2),
            y: Math.floor(attr.y + attr.height + 8)
        });
    },

    updateChildEllipse: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.5,
            ry = h * 0.5;

        sprite.setAttributes({
            cx: cx,
            cy: cy,
            rx: rx - sprite.gap,
            ry: ry - sprite.gap,
            strokeStyle: attr.strokeStyle
        });
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            cx = x + w * 0.5,
            cy = y + h * 0.5,
            rx = w * 0.5,
            ry = h * 0.5;

        path.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2, false);
        path.closePath();
    },

    onDragNewSpriteMouseMove: function (e, opts) {
        var me = this,
            designer = opts.designer,
            context = opts.context,
            plugin = context.plugin,
            bbox = context.bbox,
            cntDrag = opts.cntDrag,
            surfaceDrag = cntDrag.getSurface(),
            cntTag = opts.cntTag,
            surfaceTag = cntTag.getSurface('shape'),
            xyDrag = surfaceDrag.getEventXY(e),
            inclipbox = opts.inclipbox,
            ptDrag, snap, snapx, snapy;

        ptDrag = {
            x: xyDrag[0],
            y: xyDrag[1]
        };

        snap = context.snapTag = me.getSnapTag(e, cntTag, { x: 0, y: 0 }, me.snapRadius);

        if (inclipbox)
            cntDrag.setCursor(snap ? 'dragnewsprite' : 'dragnewspritedeny');

        if (snap) {
            cntTag.setHotBox(snap.sprite);

            snapx = { value: snap.x, offset: 0 };
            snapy = { value: snap.y, offset: 0 };

            switch (snap.docked.dock) {
                case 'left':
                case 'right':
                    snapy = plugin.snapHLine(e, me.snapRadius.hvline, null, me.spriteSnapExceptFn, 0, { m: 0 }, context, { m: true }) || snapy;
                    break;
                case 'top':
                case 'bottom':
                    snapx = plugin.snapVLine(e, me.snapRadius.hvline, null, me.spriteSnapExceptFn, 0, { m: 0 }, context, { m: true }) || snapx;
                    break;
            }

            ptDrag.x = snap.sprite.getSurface().el.getX() + snapx.value - snapx.offset;
            ptDrag.y = snap.sprite.getSurface().el.getY() + snapy.value - snapy.offset;
        }
        else {
            cntTag.setHotBox(null);
            if (plugin)
                plugin.hideHVLines();
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
            surfaceTag = cntTag.getSurface(me.tagSurface || 'shape');

        if (snap) {
            me.setAttributes({
                translationX: me.attr.translationX - surfaceTag.el.getX(),
                translationY: me.attr.translationY - surfaceTag.el.getY()
            });

            me.docked = snap.docked;

            cntTag.fireEvent('beforeDorpNewSprite', me);
            surfaceTag.add(me);

            me.setHolder(snap.sprite);

            designer.hideHVLines();
            cntTag.deselectAll(true);
            cntTag.select(me);
            cntTag.setHotBox(null);

            cntTag.fireEvent('dorpNewSprite', me);

            return false;
        }
        else {
            return false;
        }
    },

    onBeginDragDropSelection: function (e, context) {
        var me = this,
            attr = me.attr,
            links = Ext.Array.union(context.innerlinks, context.tlinks, context.flinks);

        me._transSaved = Ext.copyTo({}, attr, 'translationX,translationY');

        Ext.each(links, function (link) {
            link.save();
        });
    },

    spriteSnapExceptFn: function (sprite, axis, context) {
        if (sprite)
            return sprite !== (context.snapTag && context.snapTag.sprite);
    },

    onDragSpriteMouseMove: function (e, context) {
        var me = this,
            plugin = context.plugin,
            overlay = context.overlay,
            cnt = plugin.drawContainer,
            surface = me.getSurface(),
            xy = surface.getEventXY(e),
            point = {
                x: xy[0],
                y: xy[1]
            },
            excepts = Ext.Array.union(context.sprites, context.innerlinks),
            snap, snapy, snapx;

        snap = context.snapTag = me.getSnapTag(e, cnt, context.offset, me.snapRadius);
        if (snap) {
            overlay.setCursor('dragselection');
            cnt.setHotBox(snap.sprite);

            snapx = { value: snap.x };
            snapy = { value: snap.y };

            switch (snap.docked.dock) {
                case 'left':
                case 'right':
                    snapy = plugin.snapHLine(e, me.snapRadius.hvline, excepts, me.spriteSnapExceptFn, context.offset.y, { m: 0 }, context, { m: true }) || snapy;
                    break;
                case 'top':
                case 'bottom':
                    snapx = plugin.snapVLine(e, me.snapRadius.hvline, excepts, me.spriteSnapExceptFn, context.offset.x, { m: 0 }, context, { m: true }) || snapx;
                    break;
            }

            point.y = snapy.value - context.offset.y;
            point.x = snapx.value - context.offset.x;

            var x = point.x - context.point.x,
                y = point.y - context.point.y;

            if (x || y) {
                plugin.moveSelections(context, x, y);

                context.point = point;
                context.moved = context.moved || (x || y ? true : false);
                cnt.renderFrame();
            }
        }
        else {
            overlay.setCursor('dragnewspritedeny');
            cnt.setHotBox(null);

            var x = point.x - context.point.x,
                y = point.y - context.point.y;

            if (x || y) {
                plugin.hideHVLines();
                plugin.moveSelections(context, x, y);

                context.point = point;
                context.moved = context.moved || (x || y ? true : false);
                cnt.renderFrame();
            }
        }

        return false;
    },

    onDragSpriteMouseUp: function (e, context) {
        var me = this,
            plugin = context.plugin,
            snap = context.snapTag,
            cnt = plugin.drawContainer,
            links = Ext.Array.union(context.innerlinks, context.tlinks, context.flinks);

        plugin.hideHVLines();
        cnt.setHotBox(null);

        if (snap) {
            me.setHolder(snap.sprite);
            me.docked = snap.docked;
            cnt.fireEvent('dorpSelecton', context);
        }
        else {
            me.setAttributes(me._transSaved);
            Ext.each(links, function (link) {
                link.restore();
            });
        }

        cnt.renderFrame();

        plugin.releaseCapture();
        return false;
    },

    getSnapTag: function (e, drawContainer, offset, radius) {
        var me = this,
            radius = radius || me.snapRadius,
            surfaces = drawContainer.getItems(),
            i, j, snap;

        for (i = surfaces.length - 1; i >= 0; i--) {
            var surface = surfaces.get(i),
                sprites = surface.getItems(),
                xy = surface.getEventXY(e),
                x = xy[0] + offset.x,
                y = xy[1] + offset.y;

            for (j = sprites.length - 1; j >= 0; j--) {
                var sprite = sprites[j],
                    bbox;

                if (!sprite.supportBoundaryEvent)
                    continue;

                bbox = sprite.getBBox(false);
                bbox.left = bbox.x;
                bbox.top = bbox.y;
                bbox.right = bbox.x + bbox.width;
                bbox.bottom = bbox.y + bbox.height;

                if (x >= bbox.left && x <= bbox.right && Math.abs(y - bbox.top) <= radius) {
                    return {
                        sprite: sprite,
                        docked: {
                            dock: 'top',
                            offset: x - bbox.left
                        },
                        x: x,
                        y: bbox.top
                    };
                }

                if (x >= bbox.left && x <= bbox.right && Math.abs(y - bbox.bottom) <= radius) {
                    return {
                        sprite: sprite,
                        docked: {
                            dock: 'bottom',
                            offset: x - bbox.left
                        },
                        x: x,
                        y: bbox.bottom
                    };
                }

                if (y >= bbox.top && y <= bbox.bottom && Math.abs(x - bbox.left) <= radius) {
                    return {
                        sprite: sprite,
                        docked: {
                            dock: 'left',
                            offset: y - bbox.top
                        },
                        x: bbox.left,
                        y: y
                    };
                }

                if (y >= bbox.top && y <= bbox.bottom && Math.abs(x - bbox.right) <= radius) {
                    return {
                        sprite: sprite,
                        docked: {
                            dock: 'right',
                            offset: y - bbox.top
                        },
                        x: bbox.right,
                        y: y
                    };
                }
            }
        }
    },

    setHolder: function (holderSprite) {
        var me = this,
            rv = [];

        if (me.holder) {
            Ext.Array.remove(me.holder.holdItems, me);
            rv.push(me.holder);
        }

        me.holder = holderSprite;
        holderSprite.holdItems = holderSprite.holdItems || [];
        Ext.Array.include(holderSprite.holdItems, me);
        rv.push(holderSprite);

        return rv;
    },

    onAfterLoadNodes: function (spritesById) {
        if (this.docked)
            this.setHolder(spritesById[this.docked.holder]);
    },

    onBeforeReplace: function (newSprite) {
        if (this.holder)
            newSprite.setHolder(this.holder);
    },

    onSaveNode: function (node) {
        if (this.holder) {
            node.docked = Ext.apply({
                holder: this.holder.getSpriteId()
            }, this.docked.docked);
        }
    },

    onSwitchClick: function (e) {
        var me = this,
            menu, panel;

        panel = Ext.create('YZSoft.bpa.sprite.BPMN.BoundaryEvent.panel.Switch', {
            listeners: {
                scope: me,
                select: function (xclass) {
                    me.getSurface().ownerCt.changeType(me, xclass);
                }
            }
        });

        menu = Ext.create('Ext.menu.Menu', {
            cls: 'yz-menu',
            bodyBorder: false,
            bodyStyle: 'padding:0px 0px;',
            showSeparator: false,
            items: [panel]
        });
        menu.showAt(e.getXY());
        menu.focus();
    },

    destroy: function () {
        var me = this;

        if (me.holder) {
            Ext.Array.remove(me.holder.holdItems, me);
            me.holder = null;
        }
        me.callParent(arguments);
    }
});
