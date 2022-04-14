
Ext.define('YZSoft.esb.designer.plugin.Designer', {
    extend: 'Ext.plugin.Abstract',
    requires: [
        'Ext.util.Region'
    ],
    alias: 'plugin.yzesbdesigner',
    overlayCls: 'yz-overlay-flowchart-designer',
    mixins: {
        observable: 'Ext.mixin.Observable'
    },
    dblClickMS: 300,
    dropTriggerOffset: 3,
    hitRadius: {
        connectionPoint: 3
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
        dragnewspritemousemove: 'onDragNewSpriteMouseMove',
        dragnewspritemouseup: 'onDragNewSpriteMouseUp',
        dragnewspritemouseout: 'onDragNewSpriteMouseOut'
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
            }
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
            surface, sprites, sprite, i, j, hit;
        
        for (i = surfaces.length - 1; i >= 0; i--) {
            surface = surfaces.get(i);
            if (surface.isSurface) {
                sprites = surface.getItems();

                for (j = 0; j < sprites.length; j++) {
                    sprite = sprites[j];
                    if (sprite.selectable !== false) {
                        hit = me.hitTestSprite(sprite, e, option);
                        if (hit)
                            return hit;
                    }
                }
            }
        }

        return null;
    },

    moveSelections: function (context, x, y) {
        Ext.each(context.sprites, function (sprite) {
            sprite.setAttributes({
                translationX: x + (sprite.attr.translationX || 0),
                translationY: y + (sprite.attr.translationY || 0)
            });
        });
    },

    getBefore: function (e, offset) {
        offset = offset || {
            x: 0,
            y: 0
        };

        var me = this,
            dcnt = me.drawContainer,
            surface = dcnt.getSurface('main'),
            sprites = surface.getItems(),
            xy = surface.getEventXY(e),
            x = xy[0] + offset.x,
            y = xy[1] + offset.y,
            sprite,bbox;

        for (i = 1; i < sprites.length; i++) {
            sprite = sprites[i];
            bbox = sprite.getBBox(true);

            if (!sprite.isIndicator &&
                y >= bbox.y - bbox.height/2 && y <= bbox.y + bbox.height + bbox.height/2 &&
                x <= bbox.x + bbox.width/2)
                return sprite;
        }
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
                    cnt.deselectAll();
                    cnt.renderFrame();
                });
            }
        }
        else {
            if (!sprite.isSelected()) {
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
                        if (sprite.dragable === false) {
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
                        if (sprite.dragable === false) {
                            me.setCursor('clickselectshape', function () {
                                cnt.deselectAll(true);
                                cnt.select(sprite);
                                cnt.renderFrame();
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

    beginDragDropSelection: function (e, sprite) {
        var me = this,
            cnt = me.drawContainer,
            surface = cnt.getSurface('main'),
            dragSurface = cnt.getSurface('drag'),
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
            region,
            beforeSprite = surface.getNextSprite(sprite)

        Ext.each(context.sprites, function (sprite) {
            dragSurface.add(sprite);
            surface.rePosition();
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
            offset: offset,
            beforeSprite: beforeSprite
        });

        me.setCapture({
            target: me,
            eventPerfix: 'dragselection',
            cursor: 'dragselection',
            clipbox: clipBox,
            context: context
        });

        cnt.fireEvent('beforeDragSelecton', context);
        me.showDropPositionIndicator(beforeSprite, sprite);

        cnt.renderFrame();
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
            beforeSprite = me.getBefore(e, context.offset) || context.beforeSprite;

        if (context.sprites.length != 1 || (context.sprites.length == 1 && context.sprites[0].fireEvent('dragSpriteMouseMove', e, context) !== false)) {
            me.showDropPositionIndicator(beforeSprite, context.sprites[0]);

            var x = point.x - context.point.x,
                y = point.y - context.point.y;

            if (x || y) {
                me.moveSelections(context, x, y);
                context.point = point;
                context.moved = context.moved || (x || y ? true : false);

                cnt.renderFrame();
            }
        }
    },

    onDragSelectionMouseUp: function (e, context) {
        var me = this,
            cnt = me.drawContainer,
            mainSurface = cnt.getSurface('main'),
            dragSurface = cnt.getSurface('drag'),
            sprite = context.sprite,
            beforeSprite = me.getBefore(e,context.offset) || context.beforeSprite;

        me.hideDropPositionIndicator();

        if (context.sprites.length != 1 || (context.sprites.length == 1 && context.sprites[0].fireEvent('dragSpriteMouseUp', e, context) !== false)) {
            sprite.setAttributes({
                translationX: 0,
                translationY: 0
            });

            mainSurface.insertBefore(sprite, beforeSprite);

            if (context.moved) {
                cnt.fireEvent('dorpSelecton', context);
                cnt.renderFrame();
            }

            cnt.renderFrame();
        }

        me.releaseCapture();
    },

    onDragSelectionMouseOut: function (e) {
    },

    beginDragDropNewSprite: function (e, sprite, toolpanel, toolboxext) {
        var me = this,
            cnt = me.drawContainer,
            surface = cnt.getSurface(),
            xy = surface.getEventXY(e),
            bbox = sprite.getBBox(false),
            toolbox = toolpanel.getBox(true, false),
            context = {},
            cnt;

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

        cnt = context.dragContainer = Ext.create('Ext.draw.Container', {
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
            inclipbox, intoolbox, cursor, beforeSprite;

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
                beforeSprite = me.getBefore(e);

                if (beforeSprite)
                    me.showDropPositionIndicator(beforeSprite, sprite);
            }
            else {
                me.hideDropPositionIndicator();
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
            surfaceTag = cntTag.getSurface(sprite.tagSurface || 'main'),
            cntDrag = context.dragContainer,
            surfaceDrag = cntDrag.getSurface(),
            beforeSprite = me.getBefore(e);

        if (cntDrag.lastCursor != 'dragnewsprite') {
            surfaceDrag.remove(sprite, true);
            surfaceTag.renderFrame();
            me.releaseCapture();
            return;
        }

        surfaceDrag.remove(sprite, false);
        me.hideDropPositionIndicator();

        if (sprite.fireEvent('dragnewspriteMouseUp', e, {
            designer: me,
            cntDrag: cntDrag,
            cntTag: cntTag,
            context: context
        }) !== false) {
            if (beforeSprite) {
                sprite.setAttributes({
                    translationX: 0,
                    translationY: 0
                });

                cntTag.fireEvent('beforeDorpNewSprite', sprite);
                surfaceTag.insertBefore(sprite, beforeSprite);
                sprite.setSpriteText(sprite.property.name);

                cntTag.deselectAll(true);
                cntTag.select(sprite);

                cntTag.fireEvent('dorpNewSprite', sprite);
                cntTag.fireEvent('addNewSprite', sprite);
            }
        }

        cntTag.renderFrame();
        me.releaseCapture();
    },

    onDragNewSpriteMouseOut: function (e, context) {
    },

    showDropPositionIndicator: function (before, sprite) {
        var me = this,
            dcnt = me.drawContainer,
            surface = dcnt.getSurface('main'),
            indicator;

        if (before) {
            dcnt.designIndicators = dcnt.designIndicators || {};
            indicatorType = (sprite && sprite.isFlowControlNode) ? 'DropPositionControl' : 'DropPositionAction';
            indicator = dcnt.designIndicators[indicatorType];

            if (!indicator) {
                indicator = dcnt.designIndicators[indicatorType] = Ext.create('YZSoft.esb.designer.indicator.' + indicatorType, Ext.apply({
                }, me.DropPositionIndicator));

                surface.insertBefore(indicator, before);
                indicator.before = before;
            }
            else {
                indicator.show();

                if (indicator.before !== before) {
                    surface.remove(indicator);
                    surface.insertBefore(indicator, before);
                    indicator.before = before;
                }
                else {
                    surface.rePosition();
                }
            }

            indicator.getSurface().renderFrame();
        }
        else {
            me.hideDropPositionIndicator();
        }

        return indicator;
    },

    hideDropPositionIndicator: function () {
        var me = this,
            dcnt = me.drawContainer,
            surface = dcnt.getSurface('main'),
            indicator;

        dcnt.designIndicators = dcnt.designIndicators || {};

        Ext.Array.each(['DropPositionControl', 'DropPositionAction'], function (indicatorType) {
            indicator = dcnt.designIndicators[indicatorType];

            if (indicator && !indicator.attr.hidden) {
                indicator.hide();
                surface.rePosition();
                surface.renderFrame();
            }
        });
    }
});