Ext.define('YZSoft.src.jmap.link.RangeLink', {
    extend: 'YZSoft.src.jmap.link.LinkAbstract',
    isRangeLink: true,
    inheritableStatics: {
        def: {
            processors: {
                fromX: 'number',
                fromY: 'number',
                fromHeight: 'number',
                toX: 'number',
                toY: 'number',
                toHeight: 'number'
            },
            defaults: {
                fromX: 0,
                fromY: 0,
                fromHeight:0,
                toX: 1,
                toY: 1,
                toHeight:1,
                lineWidth: 1,
                fillOpacity: 0.1,
                strokeStyle: 'none',
                fillStyle:'#00a2df',
                lineJoin: 'round'
            },
            triggers: {
                fromX: 'path,children',
                fromY: 'path,children',
                fromHeight: 'path,children',
                toX: 'path,children',
                toY: 'path,children',
                toHeight: 'path,children'
            }
        }
    },
    bezierXFactor: 0.5,
    bezierYFactor: 0,

    onPositionUpdate: function () {
        var me = this,
            fromTree = me.getFromTree(),
            fromRecord = me.getFromRecord(),
            toTree = me.getToTree(),
            toRecord = me.getToRecord(),
            surface = me.getSurface(),
            fromEl, toEl;

        if (!fromTree || !fromRecord || !toTree || !toRecord || !surface)
            return;

        fromEl = Ext.get(me.lookupVisibleNode(fromTree, fromRecord));
        toEl = Ext.get(me.lookupVisibleNode(toTree, toRecord));

        if (!fromEl || !toEl)
            return;

        me.setAttributes({
            fromX: 5,
            fromY: fromEl.getY() - fromTree.getY(),
            fromHeight: me.getNodeTotalHeight(fromTree, fromRecord),
            toX: surface.renderElement.getWidth() - 5,
            toY: toEl.getY() - toTree.getY(),
            toHeight: me.getNodeTotalHeight(toTree, toRecord),
        });

        surface.renderFrame();
    },

    getNodeTotalHeight: function (tree, record) {
        var me = this,
            view = tree.getView(),
            records = Ext.Array.push([record], record.childNodes),
            height = 0;

        Ext.each(records, function (record) {
            if (record.isVisible()) {
                height += Ext.fly(view.getNode(record)).getHeight();
            }
        });

        return height - 2;
    },

    updatePath: function (path, attr) {
        var me = this,
            x1 = attr.fromX,
            y1 = Math.floor(attr.fromY) + 0.5,
            h1 = attr.fromHeight,
            x2 = attr.toX,
            y2 = Math.floor(attr.toY) + 0.5,
            h2 = attr.toHeight,
            w = x2 - x1,
            h = y2 - y1,
            bezierXFactor = me.bezierXFactor,
            bezierYFactor = me.bezierYFactor;

        path.moveTo(x1, y1 + h1);
        path.lineTo(x1, y1);
        path.bezierCurveTo(x1 + w * bezierXFactor, y1 + h * bezierYFactor, x2 - w * bezierXFactor, y2 - h * bezierYFactor, x2, y2);
        path.lineTo(x2, y2 + h2);
        path.bezierCurveTo(x2 - w * bezierXFactor, y2 + h2 - h * bezierYFactor, x1 + w * bezierXFactor, y1 + h1 + h * bezierYFactor, x1, y1 + h1);
        path.closePath();
    }
});