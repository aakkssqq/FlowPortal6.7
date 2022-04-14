
//条带
Ext.define('YZSoft.bpa.sprite.FlowChart.PaperTape', {
    extend: 'YZSoft.bpa.sprite.FlowChart.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 100,
                height: 70
            },
            anchors: {
                ActivityMiddleTop: {
                    docked: 't',
                    pos: function (attr) {
                        var x = attr.x,
                            y = attr.y,
                            w = attr.width,
                            h = attr.height;

                        return {
                            x: x + w / 2,
                            y: y + Math.min(Math.min(w, h) / 8, w / 12)
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
                            x: x + w / 2,
                            y: y + h - Math.min(Math.min(w, h) / 8, w / 12)
                        }
                    }
                }
            }
        }
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x, y + Math.min(Math.min(w, h) / 8, w / 12));
        path.quadraticCurveTo(x + w * 0.25, y + 3 * Math.min(Math.min(w, h) / 8, w / 12), x + w * 0.5, y + Math.min(Math.min(w, h) / 8, w / 12));
        path.quadraticCurveTo(x + w * 0.75, y - Math.min(Math.min(w, h) / 8, w / 12), x + w, y + Math.min(Math.min(w, h) / 8, w / 12));
        path.lineTo(x + w, y + h - Math.min(Math.min(w, h) / 8, w / 12));
        path.quadraticCurveTo(x + w * 0.75, y + h - 3 * Math.min(Math.min(w, h) / 8, w / 12), x + w * 0.5, y + h - Math.min(Math.min(w, h) / 8, w / 12));
        path.quadraticCurveTo(x + w * 0.25, y + h + Math.min(Math.min(w, h) / 8, w / 12), x, y + h - Math.min(Math.min(w, h) / 8, w / 12));
        path.closePath();
    }
});
