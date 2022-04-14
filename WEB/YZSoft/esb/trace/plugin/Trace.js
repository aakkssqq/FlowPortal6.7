/*
events:
spritemousemove
spritemouseup
spritemousedown
spritemouseover
spritemouseout
spriteclick
spritedblclick
spritetap
*/
Ext.define('YZSoft.esb.trace.plugin.Trace', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.yzesbtraceevents',
    overlayCls: 'yz-overlay-flowchart-designer',
    mixins: {
        observable: 'Ext.mixin.Observable'
    },
    mouseMoveEvents: {
        mousemove: true,
        mouseover: true,
        mouseout: true
    },

    spriteMouseMoveEvents: {
        spritemousemove: true,
        spritemouseover: true,
        spritemouseout: true
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
        var me = this,
            handleEvent = 'handleEvent';

        me.drawContainer = drawContainer;
        me.drawContainer.designPlugin = me;

        me.addContainerListener(drawContainer, {
            click: handleEvent,
            dblclick: handleEvent,
            mousedown: handleEvent,
            mousemove: handleEvent,
            mouseup: handleEvent,
            mouseover: handleEvent,
            mouseout: handleEvent,
            priority: 1001,
            scope: me
        });
    },

    hasSpriteMouseMoveListeners: function () {
        var listeners = this.drawContainer.hasListeners,
            name;
        for (name in this.spriteMouseMoveEvents) {
            if (name in listeners) {
                return true;
            }
        }
        return false;
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
                            return sprite;
                    }
                }
            }
        }

        return null;
    },

    handleEvent: function (e) {
        var me = this,
            drawContainer = me.drawContainer,
            isMouseMoveEvent = e.type in me.mouseMoveEvents,
            lastSprite = me.lastSprite,
            sprite;

        if (isMouseMoveEvent && !me.hasSpriteMouseMoveListeners()) {
            return;
        }

        sprite = me.hitTestEvent(e);

        if (isMouseMoveEvent && !Ext.Object.equals(sprite, lastSprite)) {
            if (sprite) {
                drawContainer.fireEvent('spritemouseover', sprite, e);
            }
            if (lastSprite) {
                drawContainer.fireEvent('spritemouseout', lastSprite, e);
            }
        }

        if (sprite) {
            if (e.type != 'mouseout') //追踪消息遮盖sprite时引起闪烁
                drawContainer.fireEvent('sprite' + e.type, sprite, e);
        }
        else {
            drawContainer.fireEvent('container' + e.type, e);
        }

        me.lastSprite = sprite;
    }
});