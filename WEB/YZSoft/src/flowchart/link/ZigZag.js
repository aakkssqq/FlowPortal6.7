Ext.define('YZSoft.src.flowchart.link.ZigZag', {
    extend: 'YZSoft.src.flowchart.link.Link',
    staticData: {
        LineType: 'ZigZag'
    },
    gaps: {
        ext: 20,
        offset: 20
    },
    dock2index:{t:0,r:1,b:2,l:3},

    constructor: function (config) {
        var me = this;

        config.points = config.points || [];
        if (config.dockIndex == -1 || config.dockIndex >= (config.points.length - 1) * 2 + 1)
            config.dockIndex = me.getSuggestDockIndex(config.points);

        this.data = Ext.apply(this.data || {}, {
            LineType: 'ZigZag'
        });

        me.callParent(arguments);
    },

    updatePath: function (path, attr) {
        var me = this;
        me.callParent(arguments);
        me.updateAlignSnaps();
    },

    updateAlignSnaps: function () {
        var me = this,
            snaps = me.alignSnaps = {
                x: [],
                y: []
            },
            pts = me.attr.points || [];

        for (var i = pts.length - 1; i >= 1; i--) {
            var p1 = pts[i - 1],
                p2 = pts[i],
                isHorz = p1.y == p2.y,
                isVert = p1.x == p2.x;

            p1 = me.translationPoint(p1);
            if (isHorz)
                snaps.y.push({
                    t: 'm',
                    value: p1.y,
                    type: 'line',
                    isLine: true,
                    tag: me,
                    line: me.getLine(pts, i - 1)
                });
            else {
                snaps.x.push({
                    t: 'm',
                    value: p1.x,
                    type: 'line',
                    isLine: true,
                    tag: me,
                    line: me.getLine(pts, i - 1)
                });
            }
        }
    },

    getAlignSnaps: function () {
        return this.alignSnaps;
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
            var text = me.hitTestText(point);
            if (text) {
                plugin.setCursor('clickdraglinktext', function () {
                    var savedBackground = Ext.clone(me.sprites.text.background);

                    cnt.createUndoStep('Drag Text');

                    me.lasthotpoint = me.hotpoints[me.attr.dockIndex];
                    me.lasthotpoint.setHot(true);

                    me.sprites.text.setBackground({
                        fillStyle: '#ffff00'
                    });

                    me.getSurface().renderFrame();

                    plugin.setCapture({
                        target: me,
                        eventPerfix: 'draglinktext',
                        cursor: 'draglinktext',
                        context: {
                            link: me,
                            dockIndex: me.attr.dockIndex,
                            savedBackground: savedBackground
                        }
                    });
                });

                return;
            }

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

            var line = me.hitTestLine(point);
            if (line) {
                plugin.setCursor(line.isHorz ? 'clickdraghline' : 'clickdragvline', function () {
                    me.save();
                    cnt.createUndoStep('Drag Path');
                    plugin.setCapture({
                        target: me,
                        eventPerfix: 'draglinehv',
                        cursor: line.isHorz ? 'draghline' : 'dragvline',
                        context: {
                            link: me,
                            points: me.attr.points,
                            line: line,
                            mode: 'existlink'
                        }
                    });
                });
                return;
            }
        }
        else {
            me.callParent(arguments);
        }
    },

    dragPathTPToPoint: function (point, context) {
        var me = this,
            from = me.getVirtualPoint(me.from),
            to = me.getVirtualPointPair(from, point),
            points;

        points = me.genZigZagPath(
            from,
            to);

        me.setAttributes({
            translationX: 0,
            translationY: 0,
            points: points,
            dockIndex: me.getSuggestDockIndex(points)
        });
    },

    dragPathTPToCnnPoint: function (hotpoint, context) {
        var me = this,
            from = me.getVirtualPoint(me.from),
            to = me.getVirtualPoint(hotpoint),
            points;

        if (hotpoint == me.to) {
            me.restore();
            return;
        }

        points = me.genZigZagPath(
            from,
            to);

        me.setAttributes({
            translationX: 0,
            translationY: 0,
            points: points,
            dockIndex: me.getSuggestDockIndex(points)
        });
    },

    dragPathFPToPoint: function (point, context) {
        var me = this,
            to = me.getVirtualPoint(me.to),
            from = me.getVirtualPointPair(to, point),
            points;

        points = me.genZigZagPath(
            from,
            to);

        me.setAttributes({
            translationX: 0,
            translationY: 0,
            points: points,
            dockIndex: me.getSuggestDockIndex(points)
        });
    },

    dragPathFPToCnnPoint: function (hotpoint, context) {
        var me = this,
            to = me.getVirtualPoint(me.to),
            from = me.getVirtualPoint(hotpoint),
            points;

        if (hotpoint == me.from) {
            me.restore();
            return;
        }

        points = me.genZigZagPath(
            from,
            to);

        me.setAttributes({
            translationX: 0,
            translationY: 0,
            points: points,
            dockIndex: me.getSuggestDockIndex(points)
        });
    },

    dragLineHVTo: function (point, context) {
        var me = this,
            pts = Ext.Array.clone(context.points || []),
            line = context.line,
            dockPoint = pts[Math.floor(me.attr.dockIndex / 2)];

        point = me.inverseTranslationPoint(point);

        if (line.index == 0) {
            if (((me.from.index == 1 || me.from.index == 3) && line.isVert) ||
                ((me.from.index == 0 || me.from.index == 2) && line.isHorz)) {
                pts.splice(0, 0, {
                    x: pts[0].x,
                    y: pts[0].y
                });

                context.points = pts;
                line = context.line = me.getLine(pts, 1);
            }
            else {
                var pt = me.getSplitPoint(line, true, me.gaps.ext);
                pts.splice(1, 0, pt.copy());
                pts.splice(1, 0, pt.copy());

                context.points = pts;
                line = context.line = me.getLine(pts, 2);
            }
        }

        if (line.index == pts.length - 2) {
            if (((me.to.docked == 'r' || me.to.docked == 'l') && line.isVert) ||
                ((me.to.docked == 't' || me.to.docked == 'b') && line.isHorz)) {
                pts.push({
                    x: pts[pts.length - 1].x,
                    y: pts[pts.length - 1].y
                });

                context.points = pts;
                line = context.line = me.getLine(pts, pts.length - 3);
            }
            else {
                var pt = me.getSplitPoint(line, false, me.gaps.ext);
                pts.splice(pts.length - 1, 0, pt.copy());
                pts.splice(pts.length - 1, 0, pt.copy());

                context.points = pts;
                line = context.line = me.getLine(pts, line.index);
            }
        }

        if (line.isHorz) {
            line.from.point.y = point.y;
            line.to.point.y = point.y;
        }
        else {
            line.from.point.x = point.x;
            line.to.point.x = point.x;
        }

        var result = me.uniqueLink(pts),
            npts = result.points,
            nindex;

        for (var i = pts.indexOf(dockPoint); i >= 0; i--) {
            var testpt = pts[i],
                index = npts.indexOf(testpt);

            if (index != -1) {
                nindex = index * 2 + (me.attr.dockIndex % 2);
                break;
            }
        }

        me.setAttributes({
            points: npts,
            dockIndex: me.getSuggestDockIndex(npts)
        });
    },

    regionFromBBox: function (bbox) {
        return Ext.util.Region.from({
            top: bbox.y,
            left: bbox.x,
            right: bbox.x + bbox.width,
            bottom: bbox.y + bbox.height
        });
    },

    getVirtualPoint: function (cnnPoint) {
        var me = this,
            bbox = cnnPoint.sprite.getBBox(false),
            rv;

        rv = {
            point: new Ext.util.Point(cnnPoint.x, cnnPoint.y),
            bbox: me.regionFromBBox(bbox),
            docked: cnnPoint.docked
        };

        return rv;
    },

    getVirtualPointPair: function (from, topt) {
        var me = this,
            bbox = from.bbox,
            size = bbox.getSize(),
            maps, map, vp;

        maps = {
            t: {
                docked: 'b',
                x: 0,
                y: -size.height
            },
            r: {
                docked: 'l',
                x: size.width,
                y: 0
            },
            b: {
                docked: 't',
                x: 0,
                y: size.height
            },
            l: {
                docked: 'r',
                x: -size.width,
                y: 0
            }
        };
        map = maps[from.docked];
        vp = {
            point: new Ext.util.Point(topt.x, topt.y),
            bbox: bbox.copy(),
            docked: map.docked
        };

        vp.bbox.translateBy(topt.x - from.point.x + map.x, topt.y - from.point.y + map.y);
        return vp;
    },

    getRows: function (from, to) {
        var me = this,
            yCoords = [],
            g = me.gaps;

        yCoords[0] = from.bbox.top - 1 - (from.docked == 't' ? g.ext : g.offset);
        yCoords[1] = from.bbox.top + from.bbox.getSize().height / 2;
        yCoords[2] = from.bbox.bottom + 1 + (from.docked == 'b' ? g.ext : g.offset);

        yCoords[3] = to.bbox.top - 1 - (to.docked == 't' ? g.ext : g.offset);
        yCoords[4] = to.bbox.top + to.bbox.getSize().height / 2;
        yCoords[5] = to.bbox.bottom + 1 + (to.docked == 'b' ? g.ext : g.offset);

        for (var i = 0; i < yCoords.length; i++)
            yCoords[i] = { idx: i, v: yCoords[i] };

        yCoords.sort(function (a, b) { return a.v - b.v; });
        return yCoords;
    },

    getCols: function (from, to) {
        var me = this,
            xCoords = [],
            g = me.gaps;

        xCoords[0] = from.bbox.left - 1 - (from.docked == 'l' ? g.ext : g.offset);
        xCoords[1] = from.bbox.left + from.bbox.getSize().width / 2;
        xCoords[2] = from.bbox.right + 1 + (from.docked == 'r' ? g.ext : g.offset);

        xCoords[3] = to.bbox.left - 1 - (to.docked == 'l' ? g.ext : g.offset);
        xCoords[4] = to.bbox.left + to.bbox.getSize().width / 2;
        xCoords[5] = to.bbox.right + 1 + (to.docked == 'r' ? g.ext : g.offset);

        for (var i = 0; i < xCoords.length; i++)
            xCoords[i] = { idx: i, v: xCoords[i] };

        xCoords.sort(function (a, b) { return a.v - b.v; });
        return xCoords;
    },

    getCellPos: function (index) {
        switch (index) {
            case 0:
                return [0, 1];
            case 2:
                return [2, 1];
            case 3:
                return [1, 0];
            default:
                return [1, 2];
        }
    },

    getCell: function (cells, orgrow, orgcol) {
        for (var r = 0; r < 6; r++) {
            for (var c = 0; c < 6; c++) {
                var cell = cells[r][c];
                if (cell.orgrow == orgrow && cell.orgcol == orgcol)
                    return cell;
            }
        }
    },

    getFromCell: function (cells, index) {
        var pos = this.getCellPos(index);
        return this.getCell(cells, pos[0], pos[1]);
    },

    getToCell: function (cells, index) {
        var pos = this.getCellPos(index);
        return this.getCell(cells, pos[0] + 3, pos[1] + 3);
    },

    isSameLine: function (pt1, pt2, pt3) {
        if (Math.floor(pt1.x) == Math.floor(pt2.x) &&
            Math.floor(pt2.x) == Math.floor(pt3.x))
            return true;

        if (Math.floor(pt1.y) == Math.floor(pt2.y) &&
            Math.floor(pt2.y) == Math.floor(pt3.y))
            return true;

        return false;
    },

    uniqueLink: function (points, indexs) {
        var me = this,
            modified = false,
            pts = Ext.Array.clone(points),
            indexs = indexs || [];

        for (var i = 2; i < pts.length; i++) {
            if (me.isSameLine(pts[i - 2], pts[i - 1], pts[i])) {
                if (pts[i].x == pts[i - 1].x)
                    pts[i].x == pts[i - 2].x;

                if (pts[i].y == pts[i - 1].y)
                    pts[i].y == pts[i - 2].y;

                modified = true;
                pts.splice(i - 1, 1);

                for (var j = 0; j < indexs.length; j++) {
                    if (indexs[j] >= i - 1)
                        indexs[j] -= 1;
                }
                i = 2 - 1; //必须重头开始计算，而不是重i-1开始。
            }
        }
        return {
            modified: modified,
            points: pts
        };
    },

    findLineIndex: function (line) {
        var me = this,
            pts = me.attr.points;

        for (var i = 0, lineCount = pts.length - 1; i < lineCount; i++) {
            var p1 = pts[i],
                p2 = pts[i + 1],
                p = line.to.point,
                x1 = Math.min(p1.x, p2.x),
                x2 = Math.max(p1.x, p2.x),
                y1 = Math.min(p1.y, p2.y),
                y2 = Math.max(p1.y, p2.y);

            if ((p1.x == p2.x && p.x == p1.x && p.y >= y1 && p.y <= y2) ||
                (p1.y == p2.y && p.y == p1.y && p.x >= x1 && p.x <= x2))
                return i;
        }
    },

    getPathInter: function (from, to, cells, toCell, addedCell) {
        var me = this,
            points = [];

        points.push(to.point.clone());

        if (addedCell)
            points.push(addedCell.point.clone());

        var cell = toCell;
        while (cell) {
            points.push(cell.point.clone());
            cell = cell.preCell;
        }

        points.push(from.point.clone());

        points = me.uniqueLink(points).points;
        points.reverse();

        return points;
    },

    getPath: function (from, to, cells, fromCell, toCell) {
        if (!toCell.preCell && fromCell != toCell)
            return [];

        return this.getPathInter(from, to, cells, toCell, null);
    },

    getDistances: function (cell1, cell2) {
        return Math.abs(cell1.point.x - cell2.point.x) + Math.abs(cell1.point.y - cell2.point.y);
    },

    getSumDistance: function (points, point) {
        var distSum = 0;

        Ext.each(points, function (pt) {
            distSum += pt.getDistanceTo(point);
        });

        return distSum;
    },

    getCurCellInOpenList: function (cells, toCell) {
        var curCell = null;

        for (var r = 0; r < 6; r++) {
            for (var c = 0; c < 6; c++) {
                var cell = cells[r][c];
                if (!cell.open)
                    continue;

                if (cell == toCell)
                    continue;

                if (curCell == null) {
                    curCell = cell;
                    continue;
                }

                if (cell.linePiece < curCell.linePiece) {
                    curCell = cell;
                    continue;
                }

                if (cell.linePiece == curCell.linePiece) {
                    if (cell.distances + this.getDistances(cell, toCell) <
                        curCell.distances + this.getDistances(curCell, toCell)) {
                        curCell = cell;
                        continue;
                    }

                    if (cell.distances + this.getDistances(cell, toCell) ==
                        curCell.distances + this.getDistances(curCell, toCell)) {
                        if (cell.sumDistFromStartPoint < curCell.sumDistFromStartPoint) {
                            curCell = cell;
                            continue;
                        }
                    }
                }
            }
        }

        return curCell;
    },

    calcZigZagPath: function (cells, fromCell, toCell, from, to) {
        fromCell.open = true;
        fromCell.linePiece = 1;

        while (1) {
            var curCell = this.getCurCellInOpenList(cells, toCell);
            if (curCell == null)
                break;

            curCell.open = false;
            curCell.closed = true;

            for (var i = 0; i < 4; i++) {
                var next;

                if (i == 0)
                    next = { r: curCell.row - 1, c: curCell.col };
                if (i == 1)
                    next = { r: curCell.row, c: curCell.col + 1 };
                if (i == 2)
                    next = { r: curCell.row + 1, c: curCell.col };
                if (i == 3)
                    next = { r: curCell.row, c: curCell.col - 1 };

                if (next.r < 0 || next.c < 0 || next.r > 5 || next.c > 5)
                    continue;

                var cellNext = cells[next.r][next.c];

                if (!cellNext.allowPath || cellNext.closed)
                    continue;

                var points = this.getPathInter(from, to, cells, curCell, cellNext);
                var dist = curCell.distances + this.getDistances(curCell, cellNext);
                var linePiece = points.length - 1;
                var sumDistFromStartPoint = this.getSumDistance(points, from);

                if (cellNext.open == false ||
                    linePiece < cellNext.linePiece ||
                    (linePiece == cellNext.linePiece && dist < cellNext.distances) ||
                    (linePiece == cellNext.linePiece && dist == cellNext.distances && sumDistFromStartPoint < cellNext.sumDistFromStartPoint)) {
                    cellNext.open = true;
                    cellNext.preCell = curCell;
                    cellNext.distances = dist;
                    cellNext.linePiece = linePiece;
                    cellNext.sumDistFromStartPoint = sumDistFromStartPoint;
                }
            }
        }
    },

    genZigZagPath: function (from, to) {
        var me = this,
            off = me.gaps.offset,
            yCoords = me.getRows(from, to),
            xCoords = me.getCols(from, to);

        var rcBound1 = from.bbox.copy();
        rcBound1.adjust(-off, off, off, -off);
        var rcBound2 = to.bbox.copy();
        rcBound2.adjust(-off, off, off, -off);

        var cells = [];
        for (var r = 0; r < 6; r++) {
            var row = [];
            cells.push(row);
            for (var c = 0; c < 6; c++) {
                var point = new Ext.util.Point(xCoords[c].v, yCoords[r].v);
                var cell = {
                    orgrow: yCoords[r].idx,
                    orgcol: xCoords[c].idx,
                    point: point,
                    row: r,
                    col: c,
                    distances: 0,
                    linePiece: 0,
                    allowPath: !point.isContainedBy(rcBound1) && !point.isContainedBy(rcBound2),
                    open: false,
                    closed: false,
                    sumDistFromStartPoint: 0
                };

                row.push(cell);
            }
        }

        var fromCell = me.getFromCell(cells, me.dock2index[from.docked]);
        var toCell = me.getToCell(cells, me.dock2index[to.docked]);

        me.calcZigZagPath(cells, fromCell, toCell, from, to);
        var points = me.getPath(from, to, cells, fromCell, toCell);

        if (points.length < 2) {
            for (var row = 0; row < 6; row++) {
                for (var col = 0; col < 6; col++) {
                    var cell = cells[row][col];
                    cell.allowPath = true;
                    cell.open = false;
                    cell.closed = false;
                }
            }

            me.calcZigZagPath(cells, fromCell, toCell, from, to);
            points = me.getPath(from, to, cells, fromCell, toCell);
        }

        return points;
    },

    getSplitPoint: function (line, nearFrom, gap) {
        var me = this,
            pt1 = new Ext.util.Point(line.from.point.x, line.from.point.y),
            pt2 = new Ext.util.Point(line.to.point.x, line.to.point.y),
            dist = pt1.getDistanceTo(pt2);

        var fromgap = dist / 2;
        if (fromgap > gap)
            fromgap = gap;

        if (!nearFrom)
            fromgap = dist - fromgap;

        var pt = new Ext.util.Point(
            pt1.x + fromgap * (pt2.x - pt1.x) / dist,
            pt1.y + fromgap * (pt2.y - pt1.y) / dist
        );

        return pt;
    },

    moveEndPointSplit: function (v1, v2, nv, gap) {
        gap = Math.min(gap, Math.abs(v2 - v1));

        if (v2 >= v1) {
            if (nv < v1 + gap)
                return nv - (v1 + gap);
        }
        else {
            if (nv > v1 - gap)
                return nv - (v1 - gap);
        }

        return 0;
    },

    getSuggestDockIndex: function (points) {
        var dist = -1,
            index;

        for (var i = 1; i < points.length; i++) {
            var p1 = points[i - 1],
                p2 = points[i],
                d = Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);

            if (d > dist) {
                dist = d;
                index = (i - 1) * 2 + 1;
            }
        }

        return index
    },

    onToSpriteMoved: function () {
        var me = this,
            ptsSaved = me.saved.points,
            pts = [],
            to = me.inverseTranslationPoint(me.to),
            line;

        Ext.each(ptsSaved, function (pt) {
            pts.push({
                x: pt.x,
                y: pt.y
            });
        });

        if (pts.length <= 3) {
            line = me.getLine(pts, 0);
            var pt = me.getSplitPoint(line, true, me.gaps.ext);
            for (var i = 0; i < 4 - pts.length; i++) {
                pts.splice(1, 0, { x: pt.x, y: pt.y });
                pts.splice(1, 0, { x: pt.x, y: pt.y });
            }
        }

        line = me.getLine(pts, pts.length - 2);

        var x = line.isHorz ? 'x' : 'y',
            y = x == 'x' ? 'y' : 'x',
            offset = me.moveEndPointSplit(line.from.point[x], line.to.point[x], to[x], me.gaps.ext);

        line.to.point.x = to.x;
        line.to.point.y = to.y;

        line.from.point[y] = to[y];

        if (offset != 0) {
            line.from.point[x] += offset;
            pts[pts.length - 3][x] += offset;
        }

        var result = me.uniqueLink(pts);
        me.setAttributes({
            points: result.points,
            dockIndex: me.getSuggestDockIndex(result.points)
        });
    },

    onFromSpriteMoved: function () {
        var me = this,
            ptsSaved = me.saved.points,
            pts = [],
            from = me.inverseTranslationPoint(me.from),
            line;

        Ext.each(ptsSaved, function (pt) {
            pts.push({
                x: pt.x,
                y: pt.y
            });
        });

        if (pts.length <= 3) {
            line = me.getLine(pts, pts.length - 2);
            var pt = me.getSplitPoint(line, false, me.gaps.ext);
            for (var i = 0; i < 4 - pts.length; i++) {
                pts.splice(pts.length - 1, 0, { x: pt.x, y: pt.y });
                pts.splice(pts.length - 1, 0, { x: pt.x, y: pt.y });
            }
        }

        line = me.getLine(pts, 0);

        var x = line.isHorz ? 'x' : 'y',
            y = x == 'x' ? 'y' : 'x',
            offset = me.moveEndPointSplit(line.to.point[x], line.from.point[x], from[x], me.gaps.ext);

        line.from.point.x = from.x;
        line.from.point.y = from.y;

        line.to.point[y] = from[y];

        if (offset != 0) {
            line.to.point[x] += offset;
            pts[2][x] += offset;
        }

        var result = me.uniqueLink(pts);
        me.setAttributes({
            points: result.points,
            dockIndex: me.getSuggestDockIndex(result.points)
        });
    }
});