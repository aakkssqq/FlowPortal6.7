Ext.define('YZSoft.src.flowchart.link.PloyLine', {
    extend: 'YZSoft.src.flowchart.link.Link',
    staticData: {
        LineType: 'Line'
    },

    constructor: function (config) {
        var me = this;

        this.data = Ext.apply(this.data || {}, {
            LineType: 'PloyLine'
        });

        me.callParent(arguments);
    },

    onMouseMove: function (e, context) {
        var me = this,
            cnt = context.drawContainer,
            plugin = context.plugin,
            surface = me.getSurface(),
            xy = surface.getEventXY(e),
            point;

        point = {
            x: xy[0],
            y: xy[1]
        };

        if (me.isSelected()) {
            var hp = me.hitTestHotPoint(point);
            if (hp) {
                if (hp.isToPoint) {
                    plugin.setCursor('clickdragtopoint', function () {
                        me.save();
                        cnt.createUndoStep('Drag To Point');
                        plugin.setCapture({
                            target: me,
                            eventPerfix: 'dragtopoint',
                            cursor: 'dragtopoint',
                            context: {
                                link: me,
                                mode: 'existlink'
                            }
                        });
                    });
                    return;
                }
                if (hp.isFromPoint) {
                    plugin.setCursor('clickdragfrompoint', function () {
                        me.save();
                        cnt.createUndoStep('Drag From Point');
                        plugin.setCapture({
                            target: me,
                            eventPerfix: 'dragfrompoint',
                            cursor: 'dragfrompoint',
                            context: {
                                link: me
                            }
                        });
                    });
                    return;
                }
            }
        }
        else {
            me.callParent(arguments);
        }
    },

    dragPathTPToPoint: function (point, context) {
        var me = this,
            from = me.from,
            to = point;

        var points = [];
        points.push({ x: from.x, y: from.y });
        points.push({ x: to.x, y: to.y });

        me.setAttributes({
            points: points
        });
    },

    dragPathTPToCnnPoint: function (hotpoint, context) {
        var me = this,
            from = me.from,
            to = hotpoint;

        var points = [];
        points.push({ x: from.x, y: from.y });
        points.push({ x: to.x, y: to.y });

        me.setAttributes({
            points: points
        });
    },

    dragPathFPToPoint: function (point, context) {
        var me = this,
            from = point,
            to = me.to;

        var points = [];
        points.push({ x: from.x, y: from.y });
        points.push({ x: to.x, y: to.y });

        me.setAttributes({
            points: points
        });
    },

    dragPathFPToCnnPoint: function (hotpoint, context) {
        var me = this,
            from = hotpoint,
            to = me.to;

        var points = [];
        points.push({ x: from.x, y: from.y });
        points.push({ x: to.x, y: to.y });

        me.setAttributes({
            points: points
        });
    },

    onToSpriteMoved: function () {
        this.dragPathTPToCnnPoint(this.to);
    },

    onFromSpriteMoved: function () {
        this.dragPathFPToCnnPoint(this.from);
    }
});