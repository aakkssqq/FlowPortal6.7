﻿
//五角星
Ext.define('YZSoft.bpa.sprite.General.Pentagon', {
    extend: 'YZSoft.bpa.sprite.General.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 70,
                height: 70
            },
            anchors: {
                ActivityLeftMiddle: {
                    docked: 'l',
                    pos: function (attr) {
                        var x = attr.x,
                        y = attr.y,
                        w = attr.width,
                        h = attr.height;

                        return {
                            x: x,
                            y: y + h * 0.38
                        }
                    }
                },
                ActivityRightMiddle: {
                    docked: 'r',
                    pos: function (attr) {
                        var x = attr.x,
                        y = attr.y,
                        w = attr.width,
                        h = attr.height;

                        return {
                            x: x + w,
                            y: y + h * 0.38
                        }
                    }
                },
                ActivityMiddleBottom: {
                    docked: 'b',
                    pos: function (attr) {
                        var x = attr.x,
                        y = attr.y,
                        w = attr.width,
                        h = attr.height;

                        return {
                            x: x + w * 0.5,
                            y: y + h * 0.76
                        }
                    }
                }
            }
        }
    },

    updateChildText: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: x + w * 0.15,
            top: y + h * 0.20,
            width: w * 0.70,
            height: h * 0.65,
            paddingtop: (attr.lineWidth * 0.5 || 0) + 2,
            paddingleft: (attr.lineWidth * 0.5 || 0) + 2,
            paddingright: (attr.lineWidth * 0.5 || 0) + 2,
            paddingbottom: (attr.lineWidth * 0.5 || 0) + 2
        });
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x + w * 0.62, y + h * 0.38);
        path.lineTo(x + w * 0.5, y);
        path.lineTo(x + w * 0.38, y + h * 0.38);
        path.lineTo(x, y + h * 0.38);
        path.lineTo(x + w * 0.3, y + h * 0.62);
        path.lineTo(x + w * 0.18, y + h);
        path.lineTo(x + w * 0.5, y + h * 0.76);
        path.lineTo(x + w * 0.82, y + h);
        path.lineTo(x + w * 0.7, y + h * 0.62);
        path.lineTo(x + w, y + h * 0.38);
        path.closePath();
    }
});
