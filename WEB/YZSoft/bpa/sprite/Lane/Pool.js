
//泳池
Ext.define('YZSoft.bpa.sprite.Lane.Pool', {
    extend: 'YZSoft.bpa.sprite.Lane.Sprite',
    isPool: true,
    rangeSelect:false,
    minWidth: 41,
    minHeight: 60,
    resizeSnapRadius: 6,
    inheritableStatics: {
        def: {
            processors: {
                titlesize: 'number'
            },
            defaults: {
                titlesize: 40,
                fillStyle: '#fff'
            },
            triggers: {
                titlesize: 'path,children',
                fillStyle: 'children'
            }
        }
    },
    sprites: {
        rect: {
            xclass: 'YZSoft.bpa.sprite.basic.Rect'
        },
        text: {
            xclass: 'YZSoft.src.flowchart.sprite.BoxText',
            text: '',
            textAlign: 'center',
            textBaseline: 'middle',
            fontFamily: RS.$('All_BPA_FontFamily'),
            fontSize: 13,
            fillStyle: 'black',
            background: {
                fillStyle: 'none'
            },
            editable: true
        }
    },

    constructor: function (config) {
        var me = this,
            sprites = {};

        config = config || {};
        config.sprites = config.sprites || {};

        for (name in me.sprites)
            sprites[name] = me.sprites[name];

        for (name in config.sprites) {
            if (Ext.String.startsWith(name, 'Separator')) {
                sprites[name] = {
                    xclass: me.separatorXClass
                };
            }
        }

        for (name in config.sprites) {
            if (Ext.String.startsWith(name, 'Lane')) {
                sprites[name] = {
                    xclass: me.laneXClass
                };
            }
        }

        me.sprites = sprites;
        me.callParent(arguments);

        for (name in sprites) {
            if (Ext.String.startsWith(name, 'Separator')) {
                me.sprites[name].on({
                    scope: me,
                    destroy: 'onSeparatorDestroy'
                });

                delete me.sprites[name];
            }

            if (Ext.String.startsWith(name, 'Lane')) {
                me.sprites[name].on({
                    scope: me,
                    destroy: 'onLaneDestroy'
                });

                delete me.sprites[name];
            }
        }

        me.updateMinsize();

        me.on({
            scope: me,
            mousemove: 'onMouseMove',
            draglanelinemousemove: 'onDragLaneLineMouseMove',
            draglanelinemouseup: 'onDragLaneLineMouseUp',
            draglanelinemouseout: 'onDragLaneLineMouseOut',
            dragseparatorlinemousemove: 'onDragSeparatorLineMouseMove',
            dragseparatorlinemouseup: 'onDragSeparatorLineMouseUp',
            dragseparatorlinemouseout: 'onDragSeparatorLineMouseOut',
            dragseparatortitlemousemove: 'onDragSeparatorTitleMouseMove',
            dragseparatortitlemouseup: 'onDragSeparatorTitleMouseUp',
            dragseparatortitlemouseout: 'onDragSeparatorTitleMouseOut',
        });
    },

    archive: function () {
        var me = this,
            lanes = me.getLanes(),
            sps = me.getSeparators(),
            archive = me.callParent(arguments),
            i;

        for (i = 0; i < lanes.length; i++) {
            var lane = lanes[i];
            archive.sprites['Lane' + i] = lane.archive();
        }

        for (i = 0; i < sps.length; i++) {
            var sp = sps[i];
            archive.sprites['Separator' + i] = sp.archive();
        }

        return archive;
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x, y);
        path.lineTo(x + w, y);
        path.lineTo(x + w, y + h);
        path.lineTo(x, y + h);
        path.closePath();
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

        if (!me.isSelected())
            return;

        var laneAnchor = me.hitTestLaneResizeableAnchor(point);
        if (laneAnchor) {
            plugin.setCursor(laneAnchor.lane.isVerti ? 'clickdragvline' : 'clickdraghline', function () {
                cnt.createUndoStep('Drag Lane');
                plugin.setCapture({
                    target: me,
                    eventPerfix: 'draglaneline',
                    cursor: laneAnchor.lane.isVerti ? 'dragvline' : 'draghline',
                    context: {
                        pool: me,
                        lane: laneAnchor.lane
                    }
                });
            });
            return false;
        }

        var spAnchor = me.hitTestSeparatorResizeableAnchor(point);
        if (spAnchor) {
            plugin.setCursor(spAnchor.sp.isHoriz ? 'clickdraghline' : 'clickdragvline', function () {
                cnt.createUndoStep('Drag Separator');
                plugin.setCapture({
                    target: me,
                    eventPerfix: 'dragseparatorline',
                    cursor: spAnchor.sp.isHoriz ? 'draghline' : 'dragvline',
                    context: {
                        pool: me,
                        sp: spAnchor.sp
                    }
                });
            });
            return false;
        }

        var spTitleAnchor = me.hitTestSeparatorTitleResizeableAnchor(point);
        if (spTitleAnchor) {
            plugin.setCursor(spTitleAnchor.sp.isHoriz ? 'clickdragvline' : 'clickdraghline', function () {
                cnt.createUndoStep('Drag Separator Title');
                plugin.setCapture({
                    target: me,
                    eventPerfix: 'dragseparatortitle',
                    cursor: spTitleAnchor.sp.isHoriz ? 'dragvline' : 'draghline',
                    context: {
                        pool: me,
                        sp: spTitleAnchor.sp,
                        sps: me.getSeparators()
                    }
                });
            });
            return false;
        }
    },

    hitTestLaneResizeableAnchor: function (point, radius) {
        var me = this,
            anchors = me.getLaneAnchors(),
            radius = radius || me.resizeSnapRadius,
            i;

        for (i = 1; i < anchors.length - 1; i++) {
            var anchor = anchors[i];
            if (me.hitTestLaneAnchor(anchor, point, radius))
                return anchor;
        }
    },

    hitTestSeparatorResizeableAnchor: function (point, radius) {
        var me = this,
            anchors = me.getSeparatorAnchors(),
            radius = radius || me.resizeSnapRadius,
            i;

        for (i = 0; i < anchors.length; i++) {
            var anchor = anchors[i];
            if (me.hitTestSeparatorAnchor(anchor, point, radius))
                return anchor;
        }
    },

    hitTestSeparatorTitleResizeableAnchor: function (point, radius) {
        var me = this,
            anchors = me.getSeparatorTitleAnchors(),
            radius = radius || me.resizeSnapRadius,
            i;

        for (i = 0; i < anchors.length; i++) {
            var anchor = anchors[i];
            if (me.hitTestSeparatorTitleAnchor(anchor, point, radius))
                return anchor;
        }
    },

    hitTestLaneAnchor: function (anchor, point, radius) {
        var me = this,
            xAttr = me.isVerti ? 'x' : 'y',
            yAttr = me.isVerti ? 'y' : 'x',
            hAttr = me.isVerti ? 'height' : 'width',
            border = anchor.lane.getBorder(anchor, true);

        if (Math.abs(border[xAttr] - point[xAttr]) <= radius &&
            point[yAttr] >= border[yAttr] &&
            point[yAttr] <= border[yAttr] + border[hAttr])
            return true;
        else
            return false;
    },

    hitTestSeparatorAnchor: function (anchor, point, radius) {
        var me = this,
            xAttr = me.isVerti ? 'x' : 'y',
            yAttr = me.isVerti ? 'y' : 'x',
            wAttr = me.isVerti ? 'width' : 'height',
            border = anchor.sp.getBorder(anchor, true);

        if (Math.abs(border[yAttr] - point[yAttr]) <= radius &&
            point[xAttr] >= border[xAttr] &&
            point[xAttr] <= border[xAttr] + border[wAttr])
            return true;
        else
            return false;
    },

    hitTestSeparatorTitleAnchor: function (anchor, point, radius) {
        var me = this,
            xAttr = me.isVerti ? 'x' : 'y',
            yAttr = me.isVerti ? 'y' : 'x',
            hAttr = me.isVerti ? 'height' : 'width',
            border = anchor.sp.getTitleBorder(anchor, true);

        if (Math.abs(border[xAttr] - point[xAttr]) <= radius &&
            point[yAttr] >= border[yAttr] &&
            point[yAttr] <= border[yAttr] + border[hAttr])
            return true;
        else
            return false;
    },

    getLanes: function () {
        var me = this,
            lanes = [],
            i;

        for (i = 0; i < me.items.length; i++) {
            var sprite = me.items[i];
            if (sprite.isLane)
                lanes.push(sprite);
        }

        return lanes;
    },

    getSeparators: function () {
        var me = this,
            sps = [],
            i;

        for (i = 0; i < me.items.length; i++) {
            var sprite = me.items[i];
            if (sprite.isSeparator)
                sps.push(sprite);
        }

        return sps;
    },

    getLaneAnchors: function () {
        var me = this,
            lanes = me.getLanes(),
            anchors = [],
            i;

        for (i = 0; i < lanes.length; i++) {
            var lane = lanes[i];

            if (i == 0) {
                anchors.push({
                    pool: me,
                    lane: lane,
                    border: 'start',
                    lineIndex: i
                });
            }

            anchors.push({
                pool: me,
                lane: lane,
                border: 'end',
                lineIndex: i + 1
            });
        }

        return anchors;
    },

    getSeparatorAnchors: function () {
        var me = this,
            sps = me.getSeparators(),
            anchors = [],
            i;

        for (i = 0; i < sps.length; i++) {
            var sp = sps[i];

            anchors.push({
                pool: me,
                sp: sp,
                border: 'end'
            });
        }

        return anchors;
    },

    getSeparatorTitleAnchors: function () {
        var me = this,
            sps = me.getSeparators(),
            anchors = [],
            i;

        for (i = 0; i < sps.length; i++) {
            var sp = sps[i];

            anchors.push({
                pool: me,
                sp: sp,
                border: 'end'
            });
        }

        return anchors;
    },

    insertLane: function (lane, lineIndex) {
        var me = this,
            attr = me.attr,
            lanes = me.getLanes(),
            wAttr = me.isVerti ? 'width' : 'height',
            insertIndex = me.insertIndexFromLineIndex(lineIndex),
            i;

        if (lanes.length == 0) {
            laneAttr = {};
            laneAttr[wAttr] = me.attr[wAttr] - me.getMaxSeparatorTitleSize(),
            lane.setAttributes(laneAttr);
        }

        me.insert(insertIndex, lane);
        me.adjustLanesAndPoolSize();
        me.updateMinsize();

        lane.on({
            scope: me,
            destroy: 'onLaneDestroy'
        });
    },

    insertSeparator: function (sp, pos) {
        var me = this,
            attr = me.attr,
            wAttr = me.isVerti ? 'width' : 'height',
            insertIndex = me.insertIndexFromSeparatorPosition(pos),
            i;

        me.insert(insertIndex, sp);
        me.adjustSeparator();
        me.adjustLanesAndPoolSize();
        me.updateMinsize();

        sp.on({
            scope: me,
            destroy: 'onSeparatorDestroy'
        });
    },

    onLaneDestroy: function (sprite) {
        var me = this;
        Ext.Array.remove(me.items, sprite);
        me.adjustLanesAndPoolSize();
        me.updateMinsize();
    },

    onSeparatorDestroy: function (sprite) {
        var me = this;
        Ext.Array.remove(me.items, sprite);
        me.adjustSeparator();
        me.adjustLanesAndPoolSize();
        me.updateMinsize();
    },

    adjustLanesAndPoolSize: function () {
        var me = this,
            attr = me.attr,
            lanes = me.getLanes(),
            xAttr = me.isVerti ? 'x' : 'y',
            yAttr = me.isVerti ? 'y' : 'x',
            wAttr = me.isVerti ? 'width' : 'height',
            hAttr = me.isVerti ? 'height' : 'width',
            w = me.getMaxSeparatorTitleSize();

        if (lanes.length == 0)
            return;

        Ext.each(lanes, function (lane) {
            var laneAttr = {};

            laneAttr[xAttr] = w;
            laneAttr[yAttr] = attr.titlesize;
            laneAttr[hAttr] = attr[hAttr] - attr.titlesize;
            laneAttr.translationX = 0;
            laneAttr.translationY = 0;

            lane.setAttributes(laneAttr);
            w += lane.attr[wAttr];
        });

        var poolAttr = {};
        poolAttr[wAttr] = w;
        me.setAttributes(poolAttr);
    },

    adjustSeparator: function () {
        var me = this,
            attr = me.attr,
            sps = me.getSeparators(),
            xAttr = me.isVerti ? 'x' : 'y',
            yAttr = me.isVerti ? 'y' : 'x',
            wAttr = me.isVerti ? 'width' : 'height',
            hAttr = me.isVerti ? 'height' : 'width',
            h = attr.titlesize;

        Ext.each(sps, function (sp) {
            var spAttr = {};

            spAttr[xAttr] = 0;
            spAttr[yAttr] = h;
            spAttr[wAttr] = attr[wAttr];
            spAttr[hAttr] = sp.attr[hAttr] + sp.attr[yAttr] - h;
            spAttr.translationX = 0;
            spAttr.translationY = 0;

            sp.setAttributes(spAttr);
            h += sp.attr[hAttr];
        });
    },

    insertIndexFromLineIndex: function (lineIndex) {
        var me = this,
            curLineIndex = -1,
            i;

        for (i = 0, laneIndex = 0; i < me.items.length; i++) {
            var sprite = me.items[i];
            if (sprite.isLane) {
                curLineIndex++;
                if (curLineIndex >= lineIndex)
                    break;
            }
        }

        return i;
    },

    insertIndexFromSeparatorPosition: function (pos) {
        var me = this,
            yAttr = me.isVerti ? 'y' : 'x',
            hAttr = me.isVerti ? 'height' : 'width',
            i;

        pos += me.attr.titlesize;

        for (i = 0; i < me.items.length; i++) {
            var sprite = me.items[i];
            if (sprite.isSeparator) {
                var attr = sprite.attr;
                if (attr[yAttr] + attr[hAttr] >= pos)
                    break;
            }

            if (sprite.isLane)
                break;
        }

        return i;
    },

    updateMinsize: function () {
        var me = this,
            attr = me.attr,
            lanes = me.getLanes(),
            wsize = me.getMaxSeparatorTitleSize(),
            sps = me.getSeparators(),
            hsize = attr.titlesize,
            lanetitlesize = 0,
            wAttr = me.isVerti ? 'width' : 'height',
            hAttr = me.isVerti ? 'height' : 'width',
            mwAttr = me.isVerti ? 'minWidth' : 'minHeight',
            mhAttr = me.isVerti ? 'minHeight' : 'minWidth',
            i;

        for (i = 0; i < lanes.length; i++) {
            var lane = lanes[i];

            if (i != lanes.length - 1)
                wsize += lane.attr[wAttr];
        }

        if (sps.length == 0) {
            hsize += me.getMaxLaneTitleSize() + 20;
        }
        else {
            for (i = 0; i < sps.length; i++) {
                var sp = sps[i];
                hsize += sp.attr[hAttr];
            }
        }

        me[mwAttr] = wsize + 20;
        me[mhAttr] = hsize;
    },

    getMaxSeparatorTitleSize: function () {
        var me = this,
            sps = me.getSeparators(),
            titlesize = 0,
            i;

        for (i = 0; i < sps.length; i++) {
            var sp = sps[i];
            titlesize = Math.max(titlesize, sp.attr.titlesize);
        }

        return titlesize;
    },

    getMaxLaneTitleSize: function () {
        var me = this,
            lanes = me.getLanes(),
            lanetitlesize = 0,
            i;

        for (i = 0; i < lanes.length; i++) {
            var lane = lanes[i];
            lanetitlesize = Math.max(lanetitlesize, lane.attr.titlesize);
        }

        return lanetitlesize;
    },

    updateChildren: function (attr) {
        var me = this,
            wAttr = me.isVerti ? 'width' : 'height',
            hAttr = me.isVerti ? 'height' : 'width',
            size = me.getMaxSeparatorTitleSize(),
            i, ln;

        me.callParent(arguments);

        for (i = 0, ln = me.items.length; i < ln; i++) {
            var sprite = me.items[i];
            if (sprite.isLane) {
                var laneAttr = {};
                laneAttr[hAttr] = attr[hAttr] - attr.titlesize;

                if (i != ln - 1)
                    size += sprite.attr[wAttr];
                else
                    laneAttr[wAttr] = attr[wAttr] - size;

                sprite.setAttributes(laneAttr);
            }
            if (sprite.isSeparator) {
                var spAttr = {};
                spAttr[wAttr] = attr[wAttr];
                sprite.setAttributes(spAttr);
            }
        }
    },

    onDragLaneLineMouseMove: function (e, context) {
        var me = this,
            plugin = context.plugin,
            surface = me.getSurface(),
            xAttr = me.isVerti ? 'x' : 'y',
            yAttr = me.isVerti ? 'y' : 'x',
            wAttr = me.isVerti ? 'width' : 'height',
            hAttr = me.isVerti ? 'height' : 'width',
            xy = surface.getEventXY(e),
            lane1 = context.lane,
            lane1Trans = lane1.getTotalTranslation(),
            lane2 = me.nextLane(lane1),
            lane2Trans = lane2.getTotalTranslation(),
            point, lane1Attr, lane1Neww, lane2Attr, lane2Neww;

        point = {
            x: xy[0],
            y: xy[1]
        };

        lane1Neww = point[xAttr] - lane1Trans[xAttr] - lane1.attr[xAttr];

        if (lane1Neww <= lane1.attr[wAttr])
            lane1Neww = Math.max(lane1Neww, Math.min(20, lane1.attr[wAttr]));
        else
            lane1Neww = Math.min(lane1Neww, lane1.attr[wAttr] + lane2.attr[wAttr] - Math.min(20, lane2.attr[wAttr]));

        lane2Neww = lane1.attr[wAttr] + lane2.attr[wAttr] - lane1Neww;

        lane1Attr = {};
        lane1Attr[wAttr] = lane1Neww;
        lane1.setAttributes(lane1Attr);

        lane2Attr = {};
        lane2Attr[xAttr] = lane1.attr[xAttr] + lane1.attr[wAttr];
        lane2Attr[wAttr] = lane2Neww;
        lane2.setAttributes(lane2Attr);

        surface.renderFrame();
    },

    onDragLaneLineMouseUp: function (e, context) {
        var me = this,
            plugin = context.plugin,
            surface = me.getSurface();

        context.drawContainer.commitUndoStep();
        me.updateMinsize();
        surface.renderFrame();
        plugin.releaseCapture();
    },

    onDragLaneLineMouseOut: function (e, context) {
    },

    onDragSeparatorLineMouseMove: function (e, context) {
        var me = this,
            plugin = context.plugin,
            surface = me.getSurface(),
            xAttr = me.isVerti ? 'x' : 'y',
            yAttr = me.isVerti ? 'y' : 'x',
            wAttr = me.isVerti ? 'width' : 'height',
            hAttr = me.isVerti ? 'height' : 'width',
            xy = surface.getEventXY(e),
            sp1 = context.sp,
            sp1Trans = sp1.getTotalTranslation(),
            sp2 = me.nextSeparator(sp1),
            sp2Trans,
            point, sp1Attr, sp1Newh, sp2Attr, sp2Newh;

        point = {
            x: xy[0],
            y: xy[1]
        };

        sp1Newh = point[yAttr] - sp1Trans[yAttr] - sp1.attr[yAttr];

        if (sp1Newh <= sp1.attr[hAttr]) {
            sp1Newh = Math.max(sp1Newh, Math.min(20 + (me.prevSeparator(sp1) ? 0 : me.getMaxLaneTitleSize()), sp1.attr[hAttr]));
        }
        else {
            if (sp2)
                sp1Newh = Math.min(sp1Newh, sp1.attr[hAttr] + sp2.attr[hAttr] - Math.min(20, sp2.attr[hAttr]));
            else
                sp1Newh = Math.min(sp1Newh, me.attr[hAttr] - sp1.attr[yAttr]);
        }

        if (sp2)
            sp2Newh = sp1.attr[hAttr] + sp2.attr[hAttr] - sp1Newh;

        sp1Attr = {};
        sp1Attr[hAttr] = sp1Newh;
        sp1.setAttributes(sp1Attr);

        if (sp2) {
            sp2Trans = sp2.getTotalTranslation();
            sp2Attr = {};
            sp2Attr[yAttr] = sp1.attr[yAttr] + sp1.attr[hAttr];
            sp2Attr[hAttr] = sp2Newh;
            sp2.setAttributes(sp2Attr);
        }

        surface.renderFrame();
    },

    onDragSeparatorLineMouseUp: function (e, context) {
        var me = this,
            plugin = context.plugin,
            surface = me.getSurface();

        context.drawContainer.commitUndoStep();
        me.updateMinsize();
        surface.renderFrame();
        plugin.releaseCapture();
    },

    onDragSeparatorLineMouseOut: function (e, context) {
    },

    onDragSeparatorTitleMouseMove: function (e, context) {
        var me = this,
            plugin = context.plugin,
            surface = me.getSurface(),
            xAttr = me.isVerti ? 'x' : 'y',
            yAttr = me.isVerti ? 'y' : 'x',
            wAttr = me.isVerti ? 'width' : 'height',
            hAttr = me.isVerti ? 'height' : 'width',
            xy = surface.getEventXY(e),
            sprite = context.sp,
            trans = sprite.getTotalTranslation(),
            point, newTitleSize;

        point = {
            x: xy[0],
            y: xy[1]
        };

        newTitleSize = point[xAttr] - trans[xAttr] - sprite.attr[xAttr];

        newTitleSize = Math.max(newTitleSize, 21);
        newTitleSize = Math.min(newTitleSize, me.attr.width - 20);

        Ext.each(context.sps, function (sp) {
            sp.setAttributes({
                titlesize: newTitleSize
            });
        });

        me.adjustLanesAndPoolSize();

        surface.renderFrame();
    },

    onDragSeparatorTitleMouseUp: function (e, context) {
        var me = this,
            plugin = context.plugin,
            surface = me.getSurface();

        context.drawContainer.commitUndoStep();
        me.updateMinsize();
        surface.renderFrame();
        plugin.releaseCapture();
    },

    onDragSeparatorTitleMouseOut: function (e, context) {
    },

    nextLane: function (lane) {
        return this.nextItem(lane, function (sprite) {
            return sprite.isLane
        });
    },

    nextSeparator: function (separator) {
        return this.nextItem(separator, function (sprite) {
            return sprite.isSeparator
        });
    },

    prevLane: function (lane) {
        return this.prevItem(lane, function (sprite) {
            return sprite.isLane
        });
    },

    prevSeparator: function (separator) {
        return this.prevItem(separator, function (sprite) {
            return sprite.isSeparator
        });
    }
});