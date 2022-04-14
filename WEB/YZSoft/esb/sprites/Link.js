Ext.define('YZSoft.esb.sprites.Link', {
    extend: 'Ext.draw.sprite.Path',
    requires: [
        'YZSoft.src.flowchart.overrides.Sprite'
    ],
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
                strokeStyle: '#666',
                lineJoin: 'round'
            },
            triggers: {
                fromX: 'path,children',
                fromY: 'path,children',
                toX: 'path,children',
                toY: 'path,children'
            },
            updaters: {
                children: function (attr) {
                    this.updateChildren(attr);
                }
            }
        }
    },
    sprites: {
        startArrow: {
            xclass: 'YZSoft.src.flowchart.link.Arrow',
            type: 'none'
        },
        endArrow: {
            xclass: 'YZSoft.src.flowchart.link.Arrow',
            type: 'openedArrow'
        }
    },

    updateChildStartArrow: function (sprite, attr) {
        var x1 = attr.fromX,
            y1 = Math.floor(attr.fromY) + 0.5,
            x2 = attr.toX,
            y2 = Math.floor(attr.toY) + 0.5;

        sprite.setAttributes({
            x1: x2,
            y1: y2,
            x2: x1,
            y2: y1,
            strokeStyle: attr.strokeStyle,
            lineWidth: attr.lineWidth
        });
    },

    updateChildEndArrow: function (sprite, attr) {
        var x1 = attr.fromX,
            y1 = Math.floor(attr.fromY) + 0.5,
            x2 = attr.toX,
            y2 = Math.floor(attr.toY) + 0.5;

        sprite.setAttributes({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            strokeStyle: attr.strokeStyle,
            lineWidth: attr.lineWidth
        });
    },

    updatePath: function (path, attr) {
        var me = this,
            x1 = attr.fromX,
            y1 = Math.floor(attr.fromY) + 0.5,
            x2 = attr.toX,
            y2 = Math.floor(attr.toY) + 0.5;

        path.moveTo(x1, y1);
        path.lineTo(x2, y2);
    },

    render: function (surface, ctx) {
        var me = this,
            mat = me.attr.matrix,
            attr = me.attr;

        me.callParent(arguments);

        mat.toContext(ctx);
        me.renderChildren(surface, ctx);
    }
});