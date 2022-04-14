Ext.define('YZSoft.src.jmap.link.Link', {
    extend: 'YZSoft.src.jmap.link.LinkAbstract',
    isLink: true,
    inheritableStatics: {
        def: {
            processors: {
                fromX: 'number',
                fromY: 'number',
                toX: 'number',
                toY: 'number'
            },
            defaults: {
                fromX: 0,
                fromY: 0,
                toX: 1,
                toY: 1,
                lineWidth: 1,
                strokeOpacity: 1,
                strokeStyle: '#d7dde1',
                lineJoin: 'round'
            },
            triggers: {
                fromX: 'path,children',
                fromY: 'path,children',
                toX: 'path,children',
                toY: 'path,children'
            }
        }
    },
    sprites: {
        startArrow: {
            xclass: 'YZSoft.src.flowchart.link.Arrow',
            type: 'solidCircle',
            strokeStyle: '#00a2df'
        },
        endArrow: {
            xclass: 'YZSoft.src.flowchart.link.Arrow',
            type: 'solidCircle',
            strokeStyle: '#00a2df'
        }
    },
    bezierXFactor:0.5,
    bezierYFactor:0,

    onPositionUpdate: function () {
        var me = this,
            fromTree = me.getFromTree(),
            fromRecord = me.getFromRecord(),
            toTree = me.getToTree(),
            toRecord = me.getToRecord(),
            surface = me.getSurface(),
            fromTreeScroller = fromTree && fromTree.getScrollable(),
            fromEl,toEl;

        if (!fromTree || !fromRecord || !toTree || !toRecord || !surface)
            return;

        fromEl = Ext.get(me.lookupVisibleNode(fromTree, fromRecord));
        toEl = Ext.get(me.lookupVisibleNode(toTree, toRecord));

        if (!fromEl || !toEl)
            return;

        me.setAttributes({
            fromX: 5,
            fromY: fromEl.getY() - fromTree.getY() + fromEl.getHeight() / 2,
            toX: surface.renderElement.getWidth() - 5,
            toY: toEl.getY() - toTree.getY() + fromEl.getHeight() / 2
        });

        surface.renderFrame();
    },

    updateChildStartArrow: function (sprite, attr) {
        var x1 = attr.fromX,
            y1 = Math.floor(attr.fromY) + 0.5,
            x2 = attr.toX,
            y2 = Math.floor(attr.toY) + 0.5;

        sprite.setAttributes({
            x1: x2 + 3,
            y1: y1,
            x2: x1 - 3,
            y2: y1,
            r:2.5,
            lineWidth: attr.lineWidth
        });
    },

    updateChildEndArrow: function (sprite, attr) {
        var x1 = attr.fromX,
            y1 = Math.floor(attr.fromY) + 0.5,
            x2 = attr.toX,
            y2 = Math.floor(attr.toY) + 0.5;

        sprite.setAttributes({
            x1: x1 - 3,
            y1: y2,
            x2: x2 + 3,
            y2: y2,
            r: 2.5,
            lineWidth: attr.lineWidth
        });
    },

    updatePath: function (path, attr) {
        var me = this,
            x1 = attr.fromX,
            y1 = Math.floor(attr.fromY) + 0.5,
            x2 = attr.toX,
            y2 = Math.floor(attr.toY) + 0.5,
            w = x2 - x1,
            h = y2 - y1,
            bezierXFactor = me.bezierXFactor,
            bezierYFactor = me.bezierYFactor;

        path.moveTo(x1, y1);
        path.bezierCurveTo(x1 + w * bezierXFactor, y1 + h * bezierYFactor, x2 - w * bezierXFactor, y2 - h * bezierYFactor, x2, y2);
    }
});