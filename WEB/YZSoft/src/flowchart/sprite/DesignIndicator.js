
//移动指示
Ext.define('YZSoft.src.flowchart.sprite.DesignIndicator', {
    extend: 'Ext.draw.sprite.Rect',
    requires: [
        'YZSoft.src.flowchart.overrides.Sprite'
    ],
    inheritableStatics: {
        def: {
            processors: {
            },
            defaults: {
                width: 105,
                height: 26,
                radius: 3,
                fillStyle: '#f2f2f2',
                strokeStyle: '#d1d1d1',
                lineWidth: 1,
                translationX: 0.5,
                translationY: 0.5
            },
            triggers: {
                x: 'path,children',
                y: 'path,children',
                width: 'path,children',
                height: 'path,children'
            },
            updaters: {
                children: function (attr) {
                    this.updateChildren(attr);
                }
            }
        }
    },
    sprites: {
        text: {
            xclass: 'YZSoft.src.flowchart.sprite.Text',
            text: 'X:0 Y:0',
            textAlign: 'center',
            textBaseline: 'middle',
            fontFamily: 'Verdana',
            fontSize: 12,
            fillStyle: 'black',
            background: {
                fillStyle: 'none'
            }
        }
    },

    updateChildText: function (sprite, attr) {
        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            x: Math.floor(attr.x + attr.width / 2),
            y: Math.floor(attr.y + attr.height / 2)
        });
    },

    render: function (surface, ctx) {
        var me = this,
            attr = me.attr,
            mat = attr.matrix,
            imat = attr.inverseMatrix;

        me.callParent(arguments);

        mat.toContext(ctx);
        me.renderChildren(surface, ctx);

        if (attr.selected) {
            imat.toContext(ctx);
            me.renderHotPoints(surface, ctx);
        }
    },

    setText: function (text) {
        this.sprites.text.setAttributes({
            text: text
        });
    },

    setPosition: function (x, y) {
        this.setAttributes({
            translationX: Math.round(x) + 0.5,
            translationY: Math.round(y) + 0.5
        });
    },

    hitTest: function () {
        return false;
    }
});
