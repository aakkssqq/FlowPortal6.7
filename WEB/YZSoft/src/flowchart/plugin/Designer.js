
Ext.define('YZSoft.src.flowchart.plugin.Designer', {
    extend: 'Ext.plugin.Abstract',
    requires: [
        'Ext.util.Region'
    ],
    alias: 'plugin.yzflowchartdesigner',
    overlayCls: 'yz-overlay-flowchart-designer',
    mixins: {
        observable: 'Ext.mixin.Observable'
    },
    dblClickMS: 300,
    dropTriggerOffset: 3,
    hitRadius: {
        connectionPoint: 3
    },
    snapRadius: {
        hvline: 3,
        resize: 0
    },
    hvline: {
        strokeStyle: '#000000',
        strokeOpacity: 0.4,
        lineWidth: 1
    },
    selectionRect: {
        translationX: 0.5,
        translationY: 0.5,
        lineDash: [3, 3, 3, 3, 3, 3, 3, 3],
        //lineDash: [1, 1, 1, 1, 1, 1, 1, 1],
        lineDashOffset: 0.5,
        strokeStyle: '#000000',
        strokeOpacity: 1,
        lineWidth: 1,
        fillStyle: null
    },
    cursorType: {
        'default': 'yz-cursor-default',
        pointer: 'yz-cursor-pointer',
        dragtopoint: 'yz-cursor-drag-link-topoint',
        dragfrompoint: 'yz-cursor-drag-link-frompoint',
        draghline: 'yz-cursor-drag-link-hline',
        dragvline: 'yz-cursor-drag-link-vline',
        clickselectshape: 'yz-cursor-click-select-shape',
        clickmoveshape: 'yz-cursor-click-move-shape',
        clickselectlink: 'yz-cursor-click-select-link',
        clickdragnewlink: 'yz-cursor-click-drag-new-link',
        clickdragtopoint: 'yz-cursor-click-drag-topoint',
        clickdragfrompoint: 'yz-cursor-click-drag-frompoint',
        clickdraghline: 'yz-cursor-click-drag-hline',
        clickdragvline: 'yz-cursor-click-drag-vline',
        dragselection: 'yz-cursor-drag-selection',
        dragselrect: 'yz-cursor-drag-selection-rect',
        dragnewsprite: 'yz-cursor-drag-new-sprite',
        dragnewspriteintoolbox: 'yz-cursor-drag-new-sprite-toolbox',
        dragnewspritedeny: 'yz-cursor-drag-new-sprite-deny',
        clickdraglinktext: 'yz-cursor-click-drag-link-text',
        draglinktext: 'yz-cursor-drag-link-text',
        resizetl: 'yz-cursor-resize-tl',
        resizetr: 'yz-cursor-resize-tr',
        resizebr: 'yz-cursor-resize-br',
        resizebl: 'yz-cursor-resize-bl',
        applystyle: 'yz-cursor-applystyle'
    },
    listeners: {
        dragselectionmousemove: 'onDragSelectionMouseMove',
        dragselectionmouseup: 'onDragSelectionMouseUp',
        dragselectionmouseout: 'onDragSelectionMouseOut',
        dragselrectmousemove: 'onDragSelectionRectangleMouseMove',
        dragselrectmouseup: 'onDragSelectionRectangleMouseUp',
        dragselrectmouseout: 'onDragSelectionRectangleMouseOut',
        dragnewspritemousemove: 'onDragNewSpriteMouseMove',
        dragnewspritemouseup: 'onDragNewSpriteMouseUp',
        dragnewspritemouseout: 'onDragNewSpriteMouseOut',
        resizemousemove: 'onResizeMouseMove',
        resizemouseup: 'onResizeMouseUp',
        resizemouseout: 'onResizeMouseOut'
    },

    constructor: function (config) {
        var me = this;
        me.mixins.observable.constructor.apply(me, arguments);
        me.callParent(arguments);
    },

    addContainerListener: function (drawContainer) {
        var me = this,
            args = Array.prototype.slice.call(arguments, 1)

        if (drawContainer.rendered) {
            drawContainer.body.el.on.apply(drawContainer.body.el, args);
        } else {
            drawContainer.on({
                single: true,
                render: function () {
                    drawContainer.body.el.on.apply(drawContainer.body.el, args);
                }
            });
        }
    },

    init: function (drawContainer) {
        var me = this;

        me.drawContainer = drawContainer;
        me.drawContainer.designPlugin = me;


        me.addContainerListener(drawContainer, {
            keydown: 'onKeyDown',
            keypress: 'onKeyPress',
            keyup: 'onKeyUp',
            mousedown: 'onMouseDown',
            mousemove: 'onMouseMove',
            mouseup: 'onMouseUp',
            mouseout: 'onMouseOut',
            contextmenu: 'onContextMenu',
            priority: 1001,
            scope: me
        });

        me.drawContainer.getSurface('events');

        drawContainer.on({
            scope: me,
            processLoading: function () {
                delete this.drawContainer.designIndicators;
            },
            commandMoveShape: 'onCommandMoveShape',
            commandResizeShape: 'onCommandResizeShape',
            selectionchange: 'onSelectionChange',
            applyStyle: 'onApplyStyle'
        });
    },

    onKeyDown: function (e, t, eOpts) {
        e.stopEvent();
    },

    onKeyPress: function (e, t, eOpts) {
        e.stopEvent();
    },

    onKeyUp: function (e, t, eOpts) {
        e.stopEvent();
    },

    onCommandMoveShape: function (sprite, x, y) {
        this.moveShape(sprite, x, y);
    },

    onCommandResizeShape: function (sprite, width, height) {
        this.resizeShape(sprite, width, height);
    },

    onApplyStyle: function (sprite) {
        this.applyStyleData = sprite;
    },

    hitTestSprite: function (sprite, e, option) {
        var surface = sprite.getSurface(),
            xy = surface && surface.getEventXY(e);

        if (!xy)
            return false;

        return sprite.hitTest(xy, option);
    },

    hitTestEvent: function (e, option) {
        var me = this,
            cnt = me.drawContainer,
            surfaces = cnt.getItems(),
            hits = [],
            surface, sprite, i, ln, hit;

        for (i = cnt.selection.length - 1; i >= 0; i--) {
            sprite = cnt.selection[i];

            if (sprite.selectionHitFirst !== false) {
                if (hit = me.hitTestSprite(sprite, e, option)) {
                    hits.push(hit);
                }
            }
        }

        for (i = surfaces.length - 1; i >= 0; i--) {
            surface = surfaces.get(i);
            if (surface.isSurface) {
                hit = surface.hitTestEvent(e, option);
                if (hit) {
                    hits.push(hit);
                }
            }
        }

        for (i = 0, ln = hits.length; i < ln; i++) {
            var hit = hits[i];
            if (hit.shortcut) {
                return hit;
            }
        }

        for (i = 0, ln = hits.length; i < ln; i++) {
            var hit = hits[i];
            if (hit.hitBody) {
                me.lastSprite = hit.sprite;
                return hit;
            }
        }

        for (i = 0, ln = hits.length; i < ln; i++) {
            var hit = hits[i];
            if (!hit.hitBody) {
                return hit;
            }
        }

        delete me.lastSprite;
        return null;
    },

    getSnapCnnPoint: function (e, excepts) {
        var me = this,
            cnt = me.drawContainer,
            surfaces = cnt.getItems();

        for (i = surfaces.length - 1; i >= 0; i--) {
            var surface = surfaces.get(i),
                sprites = surface.getItems(),
                xy = surface.getEventXY(e),
                point = {
                    x: xy[0],
                    y: xy[1]
                };

            for (j = sprites.length - 1; j >= 0; j--) {
                var sprite = sprites[j];

                if (sprite.isShape && sprite.hitTestBound && sprite.hitTestHotPoint) {
                    if (sprite.hitTestBound(point)) {
                        var hp = sprite.hitTestHotPoint(point, sprite.hitRadius.snap);
                        if (hp && hp.isConnectionPoint && !Ext.Array.contains(excepts, hp))
                            return hp;
                    }
                }
            }
        }
    },

    snapHLine: function (e, radius, excepts, exceptFn, offset, lines, context, option) {
        return this.snapHVLine(e, true, radius, excepts, exceptFn, offset, lines, context, option);
    },

    snapVLine: function (e, radius, excepts, exceptFn, offset, lines, context, option) {
        return this.snapHVLine(e, false, radius, excepts, exceptFn, offset, lines, context, option);
    },

    snapHVLine: function (e, horz, radius, excepts, exceptFn, offset, lines, context, option) {
        var me = this,
            cnt = me.drawContainer,
            snapAttr = horz ? 'y' : 'x',
            snap = me.getSnapHVLine(e, horz, radius, excepts, exceptFn, offset, lines, context, option);

        if (snap) {
            cnt.designIndicators = cnt.designIndicators || {};
            var line = cnt.designIndicators[snapAttr];

            if (!line) {
                line = cnt.designIndicators[snapAttr] = Ext.create('YZSoft.src.flowchart.sprite.HVSnapLine', Ext.apply({}, me.hvline));
                cnt.getSurface('snap').add(line);
            }
            else {
                line.show();
            }

            if (snapAttr == 'y') {
                line.setAttributes({
                    fromX: 0,
                    fromY: Math.floor(snap.value),
                    toX: 100000,
                    toY: Math.floor(snap.value)
                });
            }
            else {
                line.setAttributes({
                    fromX: Math.floor(snap.value),
                    fromY: 0,
                    toX: Math.floor(snap.value),
                    toY: 100000
                });
            }

            line.getSurface().renderFrame();
        }
        else {
            cnt.designIndicators = cnt.designIndicators || {};
            var line = cnt.designIndicators[snapAttr];

            if (line && !line.attr.hidden) {
                line.hide();
                line.getSurface().renderFrame();
            }
        }

        return snap;
    },

    hideHVLines: function () {
        var me = this,
            cnt = me.drawContainer,
            hvlines = cnt.designIndicators || {};

        if (hvlines.x)
            hvlines.x.hide();

        if (hvlines.y)
            hvlines.y.hide();

        cnt.getSurface('snap').renderFrame();
    },

    getSnapHVLine: function (e, horz, radius, excepts, exceptFn, offset, lines, context, option) {
        var me = this,
            cnt = me.drawContainer,
            snapAttr = horz ? 'y' : 'x',
            radius = radius || me.snapRadius.hvline,
            surfaces = cnt.getItems(),
            snapBorder = snapBorder === true,
            i, j, snaps = [], tagsnap;

        excepts = excepts || [];
        exceptFn = exceptFn || Ext.emptyFn;
        offset = offset || 0;
        context = context || {};

        for (i = surfaces.length - 1; i >= 0; i--) {
            var surface = surfaces.get(i),
                sprites = surface.getItems(),
                xy = surface.getEventXY(e),
                point = xy[horz ? 1 : 0];

            for (j = sprites.length - 1; j >= 0; j--) {
                var sprite = sprites[j];

                if (Ext.Array.contains(excepts, sprite))
                    continue;

                if (exceptFn && exceptFn(sprite, null, context) === true)
                    continue;

                var snap;
                if (sprite.getAlignSnaps)
                    snap = sprite.getAlignSnaps(option);
                else if (sprite.isShape && sprite.alignSnapTag !== false)
                    snap = me.getAlignSnapsForSprite(sprite, option)

                if (snap) {
                    Ext.Object.each(lines, function (type, value) {
                        Ext.each(snap[snapAttr], function (snap) {
                            if (snap.t == type) {
                                snap.distance = Math.abs(snap.value - (point + offset + value));
                                if (snap.distance <= radius &&
                                    (!exceptFn || exceptFn(null, snap, context) !== true)) {
                                    if (!tagsnap || snap.distance < tagsnap.distance) {
                                        tagsnap = snap;
                                        tagsnap.offset = offset + value;
                                        return true;
                                    }
                                }
                            }
                        });
                    });
                }
            }
        }

        return tagsnap;
    },

    getAlignSnapsForSprite: function (sprite, option) {
        var me = this,
            bbox = sprite.getBBox(false),
            x1 = bbox.x,
            x2 = bbox.x + bbox.width * 0.5,
            x3 = bbox.x + bbox.width,
            y1 = bbox.y,
            y2 = bbox.y + bbox.height * 0.5,
            y3 = bbox.y + bbox.height,
            cfg = {
                type: 'shape',
                tag: me
            },
            snaps = {
                x: [],
                y: []
            };

        if (option.s) {
            snaps.x.push({
                t: 's',
                value: x1
            });
            snaps.y.push({
                t: 's',
                value: y1
            });
        }

        if (option.m) {
            snaps.x.push({
                t: 'm',
                value: x2
            });
            snaps.y.push({
                t: 'm',
                value: y2
            });
        }

        if (option.e) {
            snaps.x.push({
                t: 'e',
                value: x3
            });
            snaps.y.push({
                t: 'e',
                value: y3
            });
        }

        return snaps;
    },

    onDblClick: function (e) {
        e.stopEvent();

        var me = this,
            cnt = me.drawContainer,
            hit = me.hitTestEvent(e, { child: true, text: true }),
            sprite = hit && (hit.target || hit.sprite);

        if (sprite) {
            cnt.deselectAll(true);
            cnt.select(hit.target || hit.sprite);
            cnt.renderFrame();

            hit.sprite.fireEvent('dblclick', e);
            cnt.fireEvent('spritedblclick', sprite, e);
        }
    },

    onMouseUp: function (e) {
        delete this.dropHold;
    },

    onMouseOut: function (e) {
        delete this.dropHold;
    },

    onContextMenu: function (e) {
        e.stopEvent();

        var me = this,
            cnt = me.drawContainer,
            sprites = cnt.selection,
            hit = me.hitTestEvent(e),
            sprite = hit && hit.hitBody !== false && hit.sprite,
            menu;

        if (sprites.length >= 2) {
            cnt.fireEvent('selectioncontextmenu', sprites, e);
        }
        else {
            if (sprite) {
                sprite.fireEvent('contextmenu', e);
                cnt.fireEvent('spritecontextmenu', sprite, e);
            }
            else {
                cnt.fireEvent('bodycontextmenu', e);
            }
        }
    },

    onSelectionChange: function (cnt, selection) {
        var me = this;

        if (selection.length == 1 && selection[0].switchable) {
            indicator = me.getSwitchIndicator();
            indicator.attach(selection[0]);
            indicator.show();
        }
        else {
            me.hideSwitchIndicator();
        }
    },

    onMouseMove: function (e) {
        e.stopEvent();

        var me = this,
            cnt = me.drawContainer,
            hit, sprite;

        if (me.dropHold &&
            (Math.abs(e.clientX - me.dropHold.clientX) >= me.dropTriggerOffset || Math.abs(e.clientY - me.dropHold.clientY) >= me.dropTriggerOffset)) {
            me.beginDragDropSelection(e, me.dropHold.sprite);
            return;
        }

        if (me.applyStyleData) {
            me.setCursor('applystyle', function () {
                hit = me.hitTestEvent(e, {
                    child: false,
                    text: false
                });

                sprite = hit && hit.sprite;

                if (sprite)
                    cnt.applyStyle(sprite, me.applyStyleData);

                cnt.deselectAll();
                if (sprite)
                    cnt.select(sprite);

                delete me.applyStyleData;

                cnt.renderFrame();
            });
        }
        else if (e.ctrlKey) {
            hit = me.hitTestEvent(e, {
                child: false,
                text: false
            });
            sprite = hit && hit.sprite;

            if (!sprite) {
                me.setCursor('default', function () {
                    cnt.deselectAll();
                    cnt.renderFrame();
                });
            }
            else if (sprite.isShape) {
                if (!sprite.isSelected()) {
                    me.setCursor('clickmoveshape', function () {
                        cnt.select(sprite);
                        cnt.renderFrame();
                    });
                }
                else {
                    me.setCursor('clickmoveshape', function () {
                        cnt.deselect(sprite);
                        cnt.renderFrame();
                    });
                }
            }
        }
        else {
            hit = me.hitTestEvent(e, {
                child: true,
                text: false
            });
            sprite = hit && (hit.target || hit.sprite);

            if (!sprite) {
                if (cnt.selection.length != 1 || cnt.selection[0].fireEvent('mousemove', e, {
                    drawContainer: cnt,
                    plugin: me
                }) !== false) {
                    me.setCursor('default', function (e) {
                        var surface = cnt.getSurface('drag'),
                        xy = surface.getEventXY(e),
                        point, rect;

                        point = {
                            x: xy[0],
                            y: xy[1]
                        };

                        cnt.deselectAll();

                        rect = Ext.create('Ext.draw.sprite.Rect', Ext.apply({}, me.selectionRect, {
                            width: 0,
                            height: 0
                        }));
                        surface.add(rect);

                        me.setCapture({
                            target: me,
                            eventPerfix: 'dragselrect',
                            cursor: 'dragselrect',
                            clipbox: me.getClipBox(),
                            context: {
                                rect: rect,
                                point: point
                            }
                        });

                        cnt.renderFrame();
                    });
                }
            }
            else if (sprite.isShape) {
                var xy = sprite.getSurface().getEventXY(e),
                hotpoint;

                if (hit.shortcut) {
                    me.setCursor('pointer', function (e) {
                        cnt.fireEvent('shortcutclick', sprite, hit.type);
                    });
                }
                else {
                    hotpoint = sprite.hitTestHotPoint({
                        x: xy[0],
                        y: xy[1]
                    });

                    if (hotpoint && hotpoint.isConnectionPoint) {
                        me.setCursor('clickdragnewlink', function (e) {

                            link = Ext.create(cnt.linkXClass, Ext.apply({
                                from: hotpoint,
                                autoPath: true
                            }, cnt.linkCfg));

                            cnt.getSurface('link').add(link);
                            cnt.select(link);

                            me.setCapture({
                                target: link,
                                eventPerfix: 'dragtopoint',
                                cursor: 'dragtopoint',
                                clipbox: me.getClipBox(),
                                context: {
                                    link: me,
                                    mode: 'newlink'
                                }
                            });

                            cnt.renderFrame();
                        });
                    }
                    else if (hotpoint && hotpoint.isResizePoint) {
                        me.setCursor('resize' + hotpoint.pos, function (e) {
                            cnt.deselectAll(true);
                            cnt.select(sprite);
                            cnt.renderFrame();
                            me.beginResizeSprite(e, sprite, hotpoint);
                        });
                    }
                    else if (!sprite.isSelected()) {
                        if (sprite.fireEvent('mousemove', e, {
                            drawContainer: cnt,
                            plugin: me
                        }) !== false) {
                            if (sprite.attr && sprite.attr.ischild) {
                                me.setCursor('clickselectshape', function () {
                                    cnt.deselectAll(true);
                                    cnt.select(sprite);
                                    cnt.renderFrame();
                                });
                            }
                            else {
                                me.setCursor('clickmoveshape', function () {
                                    cnt.deselectAll(true);
                                    cnt.select(sprite);
                                    cnt.renderFrame();

                                    me.dropHold = me.dropHold || {
                                        time: new Date(),
                                        clientX: e.clientX,
                                        clientY: e.clientY,
                                        sprite: sprite
                                    };
                                });
                            }
                        }
                    }
                    else {
                        if (sprite.fireEvent('mousemove', e, {
                            drawContainer: cnt,
                            plugin: me
                        }) !== false) {
                            if (sprite.attr && sprite.attr.ischild) {
                                me.setCursor('clickselectshape', function () {
                                });
                            }
                            else {
                                me.setCursor('clickmoveshape', function () {
                                    me.dropHold = me.dropHold || {
                                        time: new Date(),
                                        clientX: e.clientX,
                                        clientY: e.clientY,
                                        sprite: sprite
                                    };
                                });
                            }
                        }
                    }
                }
            }
            else if (sprite.isLink) {
                sprite.fireEvent('mousemove', e, {
                    drawContainer: cnt,
                    plugin: me
                });
            }
            else {
                sprite.fireEvent('mousemove', e, {
                    drawContainer: cnt,
                    plugin: me
                });
            }
        }
    },

    onMouseDown: function (e) {
        e.stopEvent();

        var me = this,
            cnt = me.drawContainer,
            hit = me.hitTestEvent(e),
            sprite = hit && hit.hitBody !== false && hit.sprite;

        if (me.lastClickTime && Ext.Date.getElapsed(me.lastClickTime) <= me.dblClickMS) {
            me.onDblClick(e);
            return;
        }

        me.lastClickTime = new Date();

        //2017-10-11 时培根 IE10滚动条回跳
        cnt.focus();

        if (e.button == 2) {
            if (!sprite) {
                cnt.deselectAll();
                cnt.renderFrame();
            }
            else if (!sprite.isSelected()) {
                cnt.deselectAll(true);
                cnt.select(sprite);
                cnt.renderFrame();
            }
        }
        else {
            if (cnt.lastCursor && cnt.lastCursor.fn) {
                cnt.lastCursor.fn.call(cnt.lastCursor.scope || me, e);
                delete cnt.lastCursor.fn;
                return;
            }
        }
    },

    setCursor: function (cursor, fn, scope) {
        var me = this,
            cnt = me.drawContainer;

        if (!cnt.lastCursor || cnt.lastCursor.cursor != cursor) {
            if (cnt.lastCursor)
                cnt.removeCls(me.cursorType[cnt.lastCursor.cursor])

            if (cursor)
                cnt.addCls(me.cursorType[cursor]);
        }

        if (cnt.lastCursor)
            delete cnt.lastCursor.fn;

        cnt.lastCursor = {
            cursor: cursor,
            fn: fn,
            scope: scope
        };
    },

    createDragOverlay: function () {
        var me = this,
            overlay,
            el = Ext.dom.Element;

        overlay = me.overlay = Ext.getBody().createChild({
            role: 'presentation',
            cls: me.overlayCls,
            style: 'position:absolute;top:0px;left:0px;z-index:99999;background-color:rgba(255,255,255,0)',
            html: '&#160;'
        });

        Ext.apply(this.overlay, {
            setCursor: function (cursor) {
                if (!this.lastCursor || this.lastCursor != cursor) {
                    if (this.lastCursor)
                        this.removeCls(me.cursorType[this.lastCursor])

                    if (cursor)
                        this.addCls(me.cursorType[cursor]);

                    this.lastCursor = cursor;
                }
            }
        });

        overlay.unselectable();
        overlay.setSize(el.getDocumentWidth(), el.getDocumentHeight());
        overlay.set({
            'yz-spec-capture': 1
        });

        overlay.show();
    },

    getClipBox: function () {
        var cmp = this.drawContainer.up(),
            box = cmp.getBox(true, false);

        box.right = box.left + cmp.getEl().dom.clientWidth - 1;
        box.bottom = box.top + cmp.getEl().dom.clientHeight - 1;
        return box;
    },

    clipEvent: function (e, box) {
        e.pageX = Math.max(box.left, e.pageX);
        e.pageX = Math.min(box.right, e.pageX);
        e.pageY = Math.max(box.top, e.pageY);
        e.pageY = Math.min(box.bottom, e.pageY);
    },

    setCapture: function (config) {
        var me = this;

        me.capture = config;
        me.createDragOverlay();
        me.overlay.setCursor(config.cursor);

        me.overlay.on({
            scope: me,
            mousemove: function (e) {
                if (me.capture.clipbox)
                    me.clipEvent(e, me.capture.clipbox);

                me.capture.target.fireEvent(config.eventPerfix + 'mousemove', e, Ext.apply(me.capture.context, {
                    drawContainer: me.drawContainer,
                    plugin: me,
                    overlay: me.overlay
                }));
            },
            mouseup: function (e) {
                if (me.capture.clipbox)
                    me.clipEvent(e, me.capture.clipbox);

                me.capture.target.fireEvent(config.eventPerfix + 'mouseup', e, Ext.apply(me.capture.context, {
                    drawContainer: me.drawContainer,
                    plugin: me,
                    overlay: me.overlay
                }));
            },
            mouseout: function (e) {
                if (me.capture.clipbox)
                    me.clipEvent(e, me.capture.clipbox);

                me.capture.target.fireEvent(config.eventPerfix + 'mouseout', e, Ext.apply(me.capture.context, {
                    drawContainer: me.drawContainer,
                    plugin: me,
                    overlay: me.overlay
                }));
            }
        });
    },

    releaseCapture: function () {
        var me = this,
            cnt = me.drawContainer;

        if (me.capture)
            delete me.capture;

        if (me.overlay) {
            me.overlay.destroy();
            delete me.overlay;
        }

        //2017-10-11 时培根 IE10滚动条回跳
        cnt.focus();
    },

    onDragSelectionRectangleMouseMove: function (e, context) {
        var me = this,
            rect = context.rect,
            surface = rect.getSurface(),
            xy = surface && surface.getEventXY(e),
            pt1 = context.point,
            pt2;

        if (!surface)
            return;

        pt2 = {
            x: xy[0],
            y: xy[1]
        };

        rect.setAttributes({
            x: Math.min(pt1.x, pt2.x),
            y: Math.min(pt1.y, pt2.y),
            width: Math.abs(pt2.x - pt1.x),
            height: Math.abs(pt2.y - pt1.y)
        });

        surface.renderFrame();
    },

    onDragSelectionRectangleMouseUp: function (e, context) {
        var me = this,
            cnt = me.drawContainer,
            rect = context.rect,
            surface = rect.getSurface(),
            xy = surface.getEventXY(e),
            pt1 = context.point,
            pt2,
            selrc,
            items;

        pt2 = {
            x: xy[0],
            y: xy[1]
        };

        selrc = {
            x: Math.min(pt1.x, pt2.x),
            y: Math.min(pt1.y, pt2.y),
            width: Math.abs(pt2.x - pt1.x),
            height: Math.abs(pt2.y - pt1.y)
        };

        items = me.getItemsInRect(selrc);

        surface.remove(rect, true);

        cnt.deselectAll(true);
        cnt.select(items);

        cnt.renderFrame();
        me.releaseCapture();
    },

    onDragSelectionRectangleMouseOut: function (e, context) {
    },

    getItemsInRect: function (rect) {
        var me = this,
            cnt = me.drawContainer,
            surfaces = cnt.getItems(),
            items = [];

        for (var i = 0, c = surfaces.length; i < c; i++) {
            var surface = surfaces.get(i),
                sprites = surface.getItems();

            if (!surface.isSurface)
                continue;

            for (var j = 0, c2 = sprites.length; j < c2; j++) {
                var sprite = sprites[j];

                if (sprite.isShape && sprite.rangeSelect !== false) {
                    var bbox = sprite.getBBox(false);
                    if (me.intersect(rect, bbox))
                        items.push(sprite);
                }
            }
        }

        return items;
    },

    intersect: function (rc1, rc2) {
        var me = this,
            t = Math.max(rc1.y, rc2.y),
            r = Math.min(rc1.x + rc1.width, rc2.x + rc2.width),
            b = Math.min(rc1.y + rc1.height, rc2.y + rc2.height),
            l = Math.max(rc1.x, rc2.x);

        return (b > t && r > l);
    },

    beginDragDropSelection: function (e, sprite) {
        var me = this,
            cnt = me.drawContainer,
            surface = cnt.getSurface(),
            xy = surface.getEventXY(e),
            point = {
                x: xy[0],
                y: xy[1]
            },
            bbox = sprite.getBBox(false),
            offset = {
                x: bbox.x + bbox.width / 2 - point.x,
                y: bbox.y + bbox.height / 2 - point.y
            },
            context = cnt.prepareSelectionData(),
            clipBox = me.getClipBox(),
            cntbox = me.drawContainer.getBox(true, false),
            region;

        Ext.each(context.sprites, function (sprite) {
            sprite.fireEvent('beginDragDropSelection', e, context);
        });

        Ext.each(context.sprites, function (sprite) {
            var bbox = sprite.getBBox(false);
            var reg = new Ext.util.Region(bbox.y, bbox.x + bbox.width, bbox.y + bbox.height, bbox.x);
            region = region ? region.union(reg) : reg;
        });

        clipBox.left = Math.max(clipBox.left, cntbox.x + (bbox.x - region.left));
        clipBox.top = Math.max(clipBox.top, cntbox.y + (bbox.y - region.top));
        clipBox.right = Math.min(clipBox.right, cntbox.x + cntbox.width - (region.right - (bbox.x + bbox.width)));
        clipBox.bottom = Math.min(clipBox.bottom, cntbox.y + cntbox.height - (region.bottom - (bbox.y + bbox.height)));
        clipBox.left -= offset.x;
        clipBox.right -= offset.x;
        clipBox.top -= offset.y;
        clipBox.bottom -= offset.y;

        Ext.apply(context, {
            sprite: sprite,
            point: point,
            offset: offset
        });

        me.setCapture({
            target: me,
            eventPerfix: 'dragselection',
            cursor: 'dragselection',
            clipbox: clipBox,
            context: context
        });

        cnt.fireEvent('beforeDragSelecton', context);
    },

    beginResizeSprite: function (e, sprite, hotpoint) {
        var me = this,
            cnt = me.drawContainer,
            surface = cnt.getSurface(),
            xy = surface.getEventXY(e),
            clipBox = me.getClipBox(),
            offset;

        offset = {
            x: hotpoint.x - xy[0],
            y: hotpoint.y - xy[1]
        };

        me.setCapture({
            target: me,
            eventPerfix: 'resize',
            cursor: 'resize' + hotpoint.pos,
            clipbox: clipBox,
            context: {
                sprite: sprite,
                hotpoint: hotpoint,
                links: me.prepareLinksForSpriteResize(sprite),
                offset: offset
            }
        });
    },

    spriteSnapExceptFn: function (sprite, axis, context) {
        if (axis && axis.isLine) {
            if (axis.tag.from && axis.line.index == 0 && Ext.Array.contains(context.sprites, axis.tag.from.sprite))
                return true;
            if (axis.tag.to && axis.line.index == axis.tag.attr.points.length - 2 && Ext.Array.contains(context.sprites, axis.tag.to.sprite))
                return true;
        }
    },

    onDragSelectionMouseMove: function (e, context) {
        var me = this,
            cnt = me.drawContainer,
            surface = cnt.getSurface(),
            xy = surface.getEventXY(e),
            point = {
                x: xy[0],
                y: xy[1]
            },
            excepts = Ext.Array.union(context.sprites, context.innerlinks),
            sprite = context.sprite,
            snapy, snapx;

        if (context.sprites.length != 1 || (context.sprites.length == 1 && context.sprites[0].fireEvent('dragSpriteMouseMove', e, context) !== false)) {
            snapx = me.snapVLine(e, me.snapRadius.hvline, excepts, me.spriteSnapExceptFn, context.offset.x, sprite.getXAligns(), context, { s: true, m: true, e: true });
            snapy = me.snapHLine(e, me.snapRadius.hvline, excepts, me.spriteSnapExceptFn, context.offset.y, sprite.getYAligns(), context, { s: true, m: true, e: true });

            if (snapy)
                point.y = snapy.value - snapy.offset;
            if (snapx)
                point.x = snapx.value - snapx.offset;

            var x = point.x - context.point.x,
                y = point.y - context.point.y;

            if (x || y) {
                me.moveSelections(context, x, y);
                context.point = point;
                context.moved = context.moved || (x || y ? true : false);

                var attr = context.sprite.attr,
                    indicator = me.getDesignIndicator();

                indicator.setText('X:' + Math.round(attr.translationX + attr.x + attr.width / 2) + ' Y:' + Math.round(attr.translationY + attr.y + attr.height / 2));
                indicator.setPosition(
                    attr.translationX + attr.x + attr.width * 0.5 - indicator.attr.width * 0.5,
                    attr.translationY + attr.y + attr.height + 4
                );

                cnt.renderFrame();
            }
        }
    },

    onDragSelectionMouseUp: function (e, context) {
        var me = this,
            cnt = me.drawContainer;

        if (context.sprites.length != 1 || (context.sprites.length == 1 && context.sprites[0].fireEvent('dragSpriteMouseUp', e, context) !== false)) {
            me.hideHVLines();
            me.hideDesignIndicator();

            if (context.moved) {
                cnt.fireEvent('dorpSelecton', context);
                cnt.renderFrame();
            }
        }

        me.releaseCapture();
    },

    onDragSelectionMouseOut: function (e) {
    },

    moveSelections: function (context, x, y) {
        Ext.each(context.sprites, function (sprite) {
            sprite.setAttributes({
                translationX: x + (sprite.attr.translationX || 0),
                translationY: y + (sprite.attr.translationY || 0)
            });
        });

        Ext.each(context.holdItems, function (sprite) {
            sprite.setAttributes({
                translationX: x + (sprite.attr.translationX || 0),
                translationY: y + (sprite.attr.translationY || 0)
            });
        });

        Ext.each(context.innerlinks, function (link) {
            link.setAttributes({
                translationX: x + (link.attr.translationX || 0),
                translationY: y + (link.attr.translationY || 0)
            });
        });

        Ext.each(context.tlinks, function (link) {
            link.onToSpriteMoved();
        });

        Ext.each(context.flinks, function (link) {
            link.onFromSpriteMoved();
        });
    },

    moveShape: function (sprite, x, y) {
        var me = this,
            cnt = me.drawContainer,
            context = cnt.prepareSelectionData([sprite]);

        me.moveSelections(context, x, y);
    },

    resizeShape: function (sprite, width, height) {
        var me = this,
            cnt = me.drawContainer;

        sprite.setAttributes({
            width: width,
            height: height
        });

        me.onShapeSizeChanged(sprite);
    },

    beginDragDropNewSprite: function (e, sprite, toolpanel, toolboxext) {
        var me = this,
            cnt = me.drawContainer,
            surface = cnt.getSurface(),
            xy = surface.getEventXY(e),
            bbox = sprite.getBBox(false),
            toolbox = toolpanel.getBox(true, false),
            context = {}; // cnt.prepareSelectionData();

        Ext.each(['left', 'top', 'right', 'bottom'], function (p) {
            toolbox[p] += toolboxext[p] || 0;
        });

        Ext.apply(context, {
            sprite: sprite,
            clipbox: me.getClipBox(),
            toolbox: toolbox,
            bbox: bbox
        });

        me.setCapture({
            target: me,
            eventPerfix: 'dragnewsprite',
            cursor: 'dragnewsprite',
            context: context
        });

        var cnt = context.dragContainer = Ext.create('Ext.draw.Container', {
            x: 0,
            y: 0,
            renderTo: me.overlay,
            width: me.overlay.getWidth(),
            height: me.overlay.getHeight(),
            border: false,
            bodyStyle: 'background-color:transparent',
            style: 'position:absolute',
            sprites: [sprite],
            setCursor: function (cursor) {
                if (!this.lastCursor || this.lastCursor != cursor) {
                    if (this.lastCursor)
                        this.removeCls(me.cursorType[this.lastCursor])

                    if (cursor)
                        this.addCls(me.cursorType[cursor]);

                    this.lastCursor = cursor;
                }
            }
        });

        cnt.el.down('.x-surface-canvas').set({
            'yz-spec-capture':1
        });

        me.onDragNewSpriteMouseMove(e, context);
    },

    onDragNewSpriteMouseMove: function (e, context) {
        var me = this,
            sprite = context.sprite,
            bbox = context.bbox,
            cntTag = me.drawContainer,
            surfaceTag = cntTag.getSurface('shape'),
            cntDrag = context.dragContainer,
            surfaceDrag = cntDrag.getSurface(),
            xy = surfaceDrag.getEventXY(e),
            ptDrag = {
                x: xy[0],
                y: xy[1]
            },
            clipbox = context.clipbox,
            toolbox = context.toolbox,
            inclipbox, intoolbox, cursor, snapy, snapx;

        //改变光标形状
        //uu1uu BUG：IE在鼠标按下移动状态下不能改变光标
        //https://support.microsoft.com/en-us/kb/2743603
        inclipbox = ptDrag.x >= clipbox.left && ptDrag.y >= clipbox.top && ptDrag.x <= clipbox.right && ptDrag.y <= clipbox.bottom;
        intoolbox = ptDrag.x >= toolbox.left && ptDrag.y >= toolbox.top && ptDrag.x <= toolbox.right && ptDrag.y <= toolbox.bottom;
        cursor = inclipbox ? 'dragnewsprite' : (intoolbox ? 'dragnewspriteintoolbox' : 'dragnewspritedeny');

        cntDrag.setCursor(cursor);

        if (sprite.fireEvent('dragnewspriteMouseMove', e, {
            inclipbox: inclipbox,
            designer: me,
            cntDrag: cntDrag,
            cntTag: cntTag,
            context: context
        }) !== false) {
            if (inclipbox) {
                snapx = me.snapVLine(e, me.snapRadius.hvline, null, null, 0, sprite.getXAligns(), context, { s: true, m: true, e: true });
                snapy = me.snapHLine(e, me.snapRadius.hvline, null, null, 0, sprite.getYAligns(), context, { s: true, m: true, e: true });

                if (snapy)
                    ptDrag.y = surfaceTag.el.getY() + snapy.value - snapy.offset;
                if (snapx)
                    ptDrag.x = surfaceTag.el.getX() + snapx.value - snapx.offset;
            }
            else {
                me.hideHVLines();
            }

            sprite.setAttributes({
                translationX: ptDrag.x - bbox.width * 0.5,
                translationY: ptDrag.y - bbox.height * 0.5
            });
        }

        surfaceDrag.renderFrame();
    },

    onDragNewSpriteMouseUp: function (e, context) {
        var me = this,
            sprite = context.sprite,
            cntTag = me.drawContainer,
            surfaceTag = cntTag.getSurface(sprite.tagSurface || 'shape'),
            cntDrag = context.dragContainer,
            surfaceDrag = cntDrag.getSurface();

        if (cntDrag.lastCursor != 'dragnewsprite') {
            surfaceDrag.remove(sprite, true);
            surfaceTag.renderFrame();
            me.releaseCapture();
            return;
        }

        surfaceDrag.remove(sprite, false);

        if (sprite.fireEvent('dragnewspriteMouseUp', e, {
            designer: me,
            cntDrag: cntDrag,
            cntTag: cntTag,
            context: context
        }) !== false) {
            sprite.setAttributes({
                translationX: sprite.attr.translationX - surfaceTag.el.getX(),
                translationY: sprite.attr.translationY - surfaceTag.el.getY()
            });

            cntTag.fireEvent('beforeDorpNewSprite', sprite);
            surfaceTag.add(sprite);

            me.hideHVLines();
            cntTag.deselectAll(true);
            cntTag.select(sprite);

            cntTag.fireEvent('dorpNewSprite', sprite);
            cntTag.fireEvent('addNewSprite', sprite);
        }

        cntTag.renderFrame();
        me.releaseCapture();
    },

    onDragNewSpriteMouseOut: function (e, context) {
    },

    onResizeMouseMove: function (e, context) {
        var me = this,
            cnt = me.drawContainer,
            surface = cnt.getSurface(),
            xy = surface.getEventXY(e),
            sprite = context.sprite,
            pt = context.hotpoint,
            offset = context.offset,
            attr = sprite.attr,
            links = context.links,
            excepts = Ext.Array.union([context.sprite], links.innerlinks, links.inlinks, links.outlinks),
            point, snapy, snapx;

        point = {
            x: xy[0],
            y: xy[1]
        };

        snapx = me.snapVLine(e, me.snapRadius.resize, excepts, Ext.emptyFn, offset.x, { s: 0, m: 0, e: 0 }, context, { s: pt.pos[1] == 'l', m: false, e: pt.pos[1] == 'r' });
        snapy = me.snapHLine(e, me.snapRadius.resize, excepts, Ext.emptyFn, offset.y, { s: 0, m: 0, e: 0 }, context, { s: pt.pos[0] == 't', m: false, e: pt.pos[0] == 'b' });

        var x = point.x + offset.x,
            y = point.y + offset.y;

        if (snapy)
            y = snapy.value;
        if (snapx)
            x = snapx.value;

        for (var i = 0; i < 2; i++) {
            switch (pt.pos[i]) {
                case 'r':
                    var realw = Math.max(x - attr.translationX, sprite.minWidth);
                    if (realw != x - attr.translationX)
                        me.hideHVLines();

                    sprite.setAttributes({
                        width: realw
                    });
                    break;
                case 'b':
                    var realh = Math.max(y - attr.translationY, sprite.minHeight);
                    if (realh != y - attr.translationY)
                        me.hideHVLines();

                    sprite.setAttributes({
                        height: realh
                    });
                    break;
                case 'l':
                    var realx = Math.min(x, attr.translationX + attr.width - sprite.minWidth);
                    if (realx != x)
                        me.hideHVLines();

                    sprite.setAttributes({
                        translationX: realx,
                        width: attr.translationX + attr.width - realx
                    });
                    break;
                case 't':
                    var realy = Math.min(y, attr.translationY + attr.height - sprite.minHeight);

                    if (realy != y)
                        me.hideHVLines();

                    sprite.setAttributes({
                        translationY: realy,
                        height: attr.translationY + attr.height - realy
                    });
                    break;
            }
        }

        me.onShapeSizeChanged(sprite, links);

        var indicator = me.getDesignIndicator();
        indicator.setText('W:' + attr.width + ' H:' + attr.height);
        indicator.setPosition(
            attr.translationX + attr.width * 0.5 - indicator.attr.width * 0.5,
            attr.translationY + attr.height + 4
        );

        cnt.renderFrame();
    },

    onResizeMouseUp: function (e, context) {
        var me = this;

        me.hideHVLines();
        me.hideDesignIndicator();
        me.releaseCapture();
    },

    onResizeMouseOut: function (e, context) {
    },

    getDesignIndicator: function () {
        var me = this,
            cnt = me.drawContainer,
            indicators = cnt.designIndicators = cnt.designIndicators || {},
            indicator = indicators['possizeindicator'];

        if (!indicator) {
            indicator = indicators['possizeindicator'] = Ext.create('YZSoft.src.flowchart.sprite.DesignIndicator', Ext.apply({}, cnt.resizeIndicatorCfg, {
            }));
            cnt.getSurface('indicator').add(indicator);
        }
        else {
            indicator.show();
        }
        return indicator;
    },

    hideDesignIndicator: function () {
        var me = this,
            cnt = me.drawContainer,
            indicator = cnt.designIndicators && cnt.designIndicators.possizeindicator;

        if (indicator) {
            indicator.hide();
            indicator.getSurface().renderFrame();
        }
    },

    getSwitchIndicator: function () {
        var me = this,
            cnt = me.drawContainer,
            indicators = cnt.designIndicators = cnt.designIndicators || {},
            indicator = indicators['switchindicator'];

        if (!indicator) {
            indicator = indicators['switchindicator'] = Ext.create('YZSoft.src.flowchart.sprite.SwitchIndicator', Ext.apply({}, cnt.switchIndicatorCfg, {
                hidden: true,
                x: 100,
                y: 100
            }));
            cnt.getSurface('indicator').add(indicator);
        }
        return indicator;
    },

    hideSwitchIndicator: function () {
        var me = this,
            cnt = me.drawContainer,
            indicator = cnt.designIndicators && cnt.designIndicators.switchindicator;

        if (indicator) {
            indicator.hide();
            indicator.detach();
            indicator.getSurface().renderFrame();
        }
    },

    prepareLinksForSpriteResize: function (sprite) {
        var me = this,
            cnt = me.drawContainer,
            surfaces = cnt.getItems(),
            rv, allsprites = [];

        rv = {
            inlinks: [],
            outlinks: [],
            innerlinks: []
        };

        allsprites.push(sprite);
        if (sprite.resizeUpdateHoldItemPosition && sprite.getHoldItems)
            allsprites = Ext.Array.union(allsprites, sprite.getHoldItems());

        for (i = 0, it = surfaces.length; i < it; i++) {
            var surface = surfaces.get(i),
                sprites = surface.getItems();

            for (j = 0, jt = sprites.length; j < jt; j++) {
                var link = sprites[j];

                if (!link.isLink || !link.from || !link.to)
                    continue;

                var from = link.from.sprite,
                    to = link.to.sprite,
                    f = Ext.Array.contains(allsprites, from),
                    t = Ext.Array.contains(allsprites, to);

                link.save();

                if (f && t)
                    rv.innerlinks.push(link);
                else if (f)
                    rv.outlinks.push(link);
                else if (t)
                    rv.inlinks.push(link);
            }
        }

        return rv;
    },

    onShapeSizeChanged: function (sprite, links) {
        var me = this,
            links = links || me.prepareLinksForSpriteResize(sprite);

        sprite.fireEvent('sizeChangedUI');

        Ext.each(links.innerlinks, function (link) {
            link.onFromSpriteMoved();
            var saved = link.saved
            link.save();
            link.onToSpriteMoved();
            link.saved = saved;
        });

        Ext.each(links.inlinks, function (link) {
            link.onToSpriteMoved();
        });

        Ext.each(links.outlinks, function (link) {
            link.onFromSpriteMoved();
        });
    }
});