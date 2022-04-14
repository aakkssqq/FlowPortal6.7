Ext.define('YZSoft.src.flowchart.link.Arrow', {
    extend: 'Ext.draw.sprite.Path',
    requires: [
        'YZSoft.src.flowchart.overrides.Sprite'
    ],
    inheritableStatics: {
        def: {
            processors: {
                type: 'enums(none,solidArrow,dashedArrow,normal,solidDiamond,dashedDiamond,solidCircle,dashedCircle,cross,openedArrow)',
                x1: 'number',
                y1: 'number',
                x2: 'number',
                y2: 'number',
                r: 'number',
            },
            defaults: {
                type: 'solidArrow',
                x1: 0,
                y1: 0,
                x2: 10,
                y2: 0,
                r: 4,
                strokeStyle: '#000000',
                lineJoin: 'miter',
                miterLimit: 5
            },
            triggers: {
                type: 'path,lineJoin,fill,parent',
                x1: 'path',
                y1: 'path',
                x2: 'path',
                y2: 'path',
                r: 'path',
                strokeStyle: 'canvas,fill',
                lineWidth: 'canvas,path'
            },
            updaters: {
                lineJoin: function (attr) {
                    switch (attr.type) {
                        case 'normal':
                        case 'cross':
                            this.setAttributes({
                                lineJoin: 'round',
                                lineCap: 'round'
                            });
                            break;
                        default:
                            this.setAttributes({
                                lineJoin: 'miter',
                                lineCap: 'butt'
                            });
                            break;
                    }
                },
                fill: function (attr) {
                    switch (attr.type) {
                        case 'dashedArrow':
                        case 'dashedDiamond':
                        case 'dashedCircle':
                            this.setAttributes({
                                fillStyle: '#ffffff'
                            });
                            break;
                        case 'solidArrow':
                        case 'solidDiamond':
                        case 'solidCircle':
                            this.setAttributes({
                                fillStyle: attr.strokeStyle
                            });
                            break;
                        default:
                            this.setAttributes({
                                fillStyle: 'none'
                            });
                            break;
                    }
                },
                parent: function (attr) {
                    var parent = this.getParent();
                    if (parent)
                        parent.fireEvent('arrowTypeChanged', this, attr.type);
                }
            }
        }
    },

    updatePath: function (path, attr) {
        var me = this,
            x1 = attr.x1,
            y1 = attr.y1,
            x2 = attr.x2,
            y2 = attr.y2,
            r1 = attr.r,
            lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)), //斜边长度
            dis, x3, y3;

        switch (attr.type) {
            case 'none':
                break;
            case 'solidArrow':
            case 'dashedArrow':
                var x = 15,
                    y = 4,
                    c = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), //斜边长度
                    e = (c * attr.lineWidth / y) * 0.5;

                path.moveTo(x2 - e, y2);
                path.lineTo(x2 - e - x, y2 - y);
                path.lineTo(x2 - e - x, y2 + y);
                path.lineTo(x2 - e, y2);
                path.closePath();

                dis = x + e;
                break;
            case 'openedArrow':
                var x = 4,
                    y = 4,
                    c = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), //斜边长度
                    e = (c * attr.lineWidth / y) * 0.5;

                path.moveTo(x2 - e, y2);
                path.lineTo(x2 - e - x, y2 - y);
                path.moveTo(x2 - e, y2);
                path.lineTo(x2 - e - x, y2 + y);

                dis = x + e;
                break;
            case 'normal':
                var x = 5,
                    y = 4,
                    y = y + attr.lineWidth * y / x,
                    x = x + attr.lineWidth,
                    c = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), //斜边长度
                    e = (c * attr.lineWidth / y) * 0.5;

                path.moveTo(x2 - e - x, y2 - y);
                path.lineTo(x2 - e, y2);
                path.lineTo(x2 - e - x, y2 + y);

                dis = e;
                break;
            case 'solidDiamond':
            case 'dashedDiamond':
                var x = 6,
                    y = 3,
                    y = y + attr.lineWidth * y / x,
                    x = x + attr.lineWidth,
                    c = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), //斜边长度
                    e = (c * attr.lineWidth / y) * 0.5;

                path.moveTo(x2 - e, y2);
                path.lineTo(x2 - e - x, y2 - y);
                path.lineTo(x2 - e - x - x, y2);
                path.lineTo(x2 - e - x, y2 + y);
                path.lineTo(x2 - e, y2);
                path.closePath();

                dis = x + e;
                break;
            case 'solidCircle':
            case 'dashedCircle':
                var r = r1 + attr.lineWidth * 0.5,
                    d = r + attr.lineWidth * 0.5,
                    x = x2 - d * (x2 - x1) / lineLength,
                    y = y2 - d * (y2 - y1) / lineLength;

                path.ellipse(x, y, r, r, 0, 0, Math.PI * 2, false);
                path.closePath();

                dis = d + r;
                break;
            case 'cross':
                var x = 6,
                    y = 4,
                    x = x + attr.lineWidth,
                    y = y + attr.lineWidth;

                path.moveTo(x2 - x, y2 + y);
                path.lineTo(x2 - x - y * 2, y2 - y);
                break;
        }

        //旋转
        switch (attr.type) {
            case 'solidArrow':
            case 'dashedArrow':
            case 'normal':
            case 'solidDiamond':
            case 'dashedDiamond':
            case 'cross':
                me.setAttributes({
                    rotationCenterX: x2,
                    rotationCenterY: y2,
                    rotationRads: me.getAngle(x1, y1, x2, y2)
                });
                break;
            default:
                me.setAttributes({
                    rotationRads: 0
                });
                break;
        }

        //终点调整
        if (dis) {
            if (dis >= lineLength) {
                x3 = x1;
                y3 = y1;
            }
            else {
                x3 = x2 - dis * (x2 - x1) / lineLength;
                y3 = y2 - dis * (y2 - y1) / lineLength;
            }

            me.middlePoint = {
                x: x3,
                y: y3
            };
        }
        else {
            delete me.middlePoint;
        }
    },

    getMiddlePoint: function () {
        var me = this,
            attr = me.attr;

        return me.type == 'none' ? null : me.middlePoint;
    },

    getAngle: function (x1, y1, x2, y2) {
        var x = x2 - x1, //两点的x、y值
            y = y2 - y1,
            hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), //斜边长度
            cos = x / hypotenuse,
            radian = Math.acos(cos);

        if (y < 0)
            radian = -radian;
        else if ((y == 0) && (x < 0))
            radian = Math.PI;

        return radian;
    }
});