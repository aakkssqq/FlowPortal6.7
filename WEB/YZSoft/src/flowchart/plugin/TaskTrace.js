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
Ext.define('YZSoft.src.flowchart.plugin.TaskTrace', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.tasktraceevents',

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

    init: function (drawContainer) {
        var handleEvent = 'handleEvent';

        this.drawContainer = drawContainer;

        drawContainer.addElementListener({
            click: handleEvent,
            dblclick: handleEvent,
            mousedown: handleEvent,
            mousemove: handleEvent,
            mouseup: handleEvent,
            mouseover: handleEvent,
            mouseout: handleEvent,
            priority: 1001,
            scope: this
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

    hitTestEvent: function (e) {
        surface = this.drawContainer.getSurface('shape');
        if(surface)
            return surface.hitTestEvent(e);
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

        me.lastSprite = sprite;
    }
});