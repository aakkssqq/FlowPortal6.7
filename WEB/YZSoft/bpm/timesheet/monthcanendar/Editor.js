/*
config:
sheetName  timesheet name
*/

Ext.define('YZSoft.bpm.timesheet.monthcanendar.Editor', {
    extend: 'YZSoft.bpm.timesheet.monthcanendar.ContainerBase',
    requires: [
        'Ext.draw.sprite.Line',
        'Ext.draw.sprite.Rect'
    ],
    workAreaPadding: {
        top: -1,
        left: 0,
        right: 0,
        bottom: 0
    },
    cellSize: {
        width: 26,
        height: 20
    },

    constructor: function (config) {
        var me = this,
            workAreaPadding = config.workAreaPadding || me.workAreaPadding,
            cellSize = config.cellSize || me.cellSize,
            sprites = [],
            cfg;

        me.records = {};

        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 2; k++) {
                    var line,
                        strokeStyle = (j == 0 && k == 0) ? '#666' : '#ddd';

                    if (i == 8 && (j != 0 || k != 0))
                        continue;

                    var y = me.yFromHLine(cellSize.height, workAreaPadding, (i * 3 + j) * 2 + k);

                    line = {
                        type: 'line',
                        translationX: 0.5,
                        translationY: 0.5,
                        fromX: workAreaPadding.left,
                        fromY: y,
                        toY: y,
                        dockes: {
                            toX: function (size, newAttr) {
                                return size.width - me.workAreaPadding.right;
                            }
                        },
                        strokeStyle: strokeStyle,
                        lineWidth: 1,
                        surface: 'hline'
                    };

                    if (k == 1) {
                        Ext.apply(line, {
                            lineDash: [1, 1, 1, 1, 1, 1, 1, 1],
                            lineDashOffset: 0.5
                        });
                    }

                    sprites.push(line);
                }
            }
        }

        for (var i = 0; i < 31; i++) {
            var rect = {
                type: 'rect',
                translationX: 0.5,
                translationY: 0.5,
                y: workAreaPadding.top,
                height: cellSize.height * 24 * 2,
                dockes: {
                    params: {
                        index: i
                    },
                    x: function (size, newAttr, params) {
                        return me.xFromVline(size.width, me.workAreaPadding, params.index);
                    },
                    width: function (size, newAttr, params) {
                        return me.xFromVline(size.width, me.workAreaPadding, params.index + 1) - newAttr.x;
                    }
                },
                strokeStyle: '#ddd',
                lineWidth: 1,
                fillStyle: '#fff',
                surface: 'columnground'
            };
            sprites.push(rect);
        }

        for (var i = 0; i < 32; i++) {
            var line = {
                type: 'line',
                translationX: 0.5,
                translationY: 0.5,
                fromY: workAreaPadding.top,
                toY: me.yFromHLine(cellSize.height, workAreaPadding, 48),
                dockes: {
                    params: {
                        index: i
                    },
                    fromX: function (size, newAttr, params) {
                        return me.xFromVline(size.width, me.workAreaPadding, params.index);
                    },
                    toX: function (size, newAttr, params) {
                        return newAttr.fromX;
                    }
                },
                strokeStyle: '#ddd',
                zIndex: 0,
                lineWidth: 1,
                surface: 'vline'
            };
            sprites.push(line);
        }

        cfg = {
            border: false,
            sprites: sprites,
            height: me.yFromHLine(cellSize.height, workAreaPadding, 48) + workAreaPadding.bottom,
            listeners: {
                scope: me,
                afterrender: function () {
                    me.relayEvents(me.getEl(), ['mousedown', 'mousemove', 'mouseup', 'click']);
                },
                mousedown: me.onMouseDown,
                mousemove: me.onMouseMove,
                mouseup: me.onMouseUp,
                rangeselectionend: me.onRangeselectionEnd
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.surfaces = {
            main: me.getSurface('main'),
            columnground: me.getSurface('columnground'),
            data: me.getSurface('data'),
            vline: me.getSurface('vline'),
            hline: me.getSurface('hline'),
            head: me.getSurface('head'),
            headline: me.getSurface('headline'),
            selection: me.getSurface('selection')
        };

        me.surfaces.main.element.setStyle('zIndex', 0);
        me.surfaces.columnground.element.setStyle('zIndex', 1);
        me.surfaces.data.element.setStyle('zIndex', 2);
        me.surfaces.vline.element.setStyle('zIndex', 3);
        me.surfaces.hline.element.setStyle('zIndex', 4);
        me.surfaces.head.element.setStyle('zIndex', 5);
        me.surfaces.headline.element.setStyle('zIndex', 6);
        me.surfaces.selection.element.setStyle('zIndex', 7);

        me.surfaces.data.renderFrame = function () { me.renderDataFrame(me.surfaces.data) };
        me.surfaces.data.getDirty = function () { return true };
    },

    renderDataFrame: function (surface) {
        if (surface.canvases.length == 0)
            surface.createCanvas();

        var me = this,
            ctx = surface.contexts[0],
            size = me.getSize(),
            ratio = surface.devicePixelRatio,
            sprites = [];

        if (!me.curData) {
            surface.clear();
            return;
        }

        for (var i = 0, n = 31; i < n; i++) {
            var x1 = me.xFromVline(size.width, me.workAreaPadding, i),
                x2 = me.xFromVline(size.width, me.workAreaPadding, i + 1);

            for (var j = 0; j < 24; j++) {
                for (var k = 0; k < 2; k++) {
                    if (me.getData(i, j * 2 + k)) {
                        var rect = {
                            x: x1,
                            y: me.yFromHLine(me.cellSize.height, me.workAreaPadding, j * 2 + k),
                            height: me.cellSize.height,
                            width: x2 - x1
                        };

                        sprites.push(rect);
                    }
                }
            }
        }

        surface.clear();
        ctx.fillStyle = '#28a745';

        Ext.each(sprites, function (rect) {
            ctx.beginPath();
            ctx.rect(rect.x * ratio, rect.y * ratio, rect.width * ratio, rect.height * ratio);
            ctx.closePath();
            ctx.fill();
        });
    },

    getData: function (dayIndex, halfHourIndex) {
        var me = this,
            day = me.curData.data[dayIndex],
            mask,
            index;

        if (!day)
            return false;

        if (halfHourIndex >= 24) {
            mask = 1 << (halfHourIndex - 24);
            index = 1;
        }
        else {
            mask = 1 << halfHourIndex;
            index = 0;
        }

        return (day[index] & mask) ? true : false;
    },

    setData: function (dayIndex, halfHourIndex, value) {
        var me = this,
            day = me.curData.data[dayIndex],
            mask,
            index;

        me.curData.dirty = true;

        if (halfHourIndex >= 24) {
            mask = 1 << (halfHourIndex - 24);
            index = 1;
        }
        else {
            mask = 1 << halfHourIndex;
            index = 0;
        }

        if (value)
            day[index] = day[index] | mask;
        else
            day[index] = day[index] & ~mask;
    },

    cellFromX: function (x) {
        var me = this,
            size = me.getSize();

        var index = Math.floor((x - me.workAreaPadding.left) * 31 / (size.width - me.workAreaPadding.left - me.workAreaPadding.right));
        return index;
    },

    cellFromY: function (y) {
        var me = this,
            size = me.getSize();

        var index = Math.floor((y - me.workAreaPadding.top) / me.cellSize.height);

        return index;
    },

    interset: function (v1, v2, min, max) {
        if (v1 < min && v2 < min)
            return null;

        if (v1 > max && v2 > max)
            return null;

        if (v1 < min)
            v1 = min;

        if (v2 > max)
            v2 = max;

        return {
            v1: v1,
            v2: v2
        };
    },

    regularCellX: function (x1, x2) {
        return this.interset(x1, x2, 0, this.curData.data.length - 1);
    },

    regularCellY: function (y1, y2) {
        return this.interset(y1, y2, 0, 47);
    },

    setMonth: function (year, month) {
        var me = this,
            date = new Date(year, month, 1),
            daysInMonth = Ext.Date.getDaysInMonth(date),
            columngrounds = me.surfaces.columnground.getItems();

        for (var i = 0, n = 31; i < n; i++) {
            var weekday = date.getDay(),
                weekend = weekday == 0 || weekday == 6,
                daymonth = date.getMonth();

            if (daymonth == month) {
                columngrounds[i].setAttributes({
                    fillStyle: weekend ? '#ffffcc' : '#ffffff'
                });
            }
            else {
                columngrounds[i].setAttributes({
                    fillStyle: '#f5f5f5'
                });
            }

            date = Ext.Date.add(date, Ext.Date.DAY, 1);
        }

        var monthName = year.toString() + Ext.String.leftPad(month.toString(), 2, '0');

        if (!(monthName in me.records)) {
            var emptyData = [];
            for (var i = 0; i < daysInMonth; i++)
                emptyData.push([0, 0]);

            me.records[monthName] = {
                year: year,
                month: month,
                dirty: false,
                data: emptyData
            };

            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TimeSheet.ashx'),
                params: {
                    method: 'GetMonthData',
                    sheetName: me.sheetName,
                    year: year,
                    month: month
                },
                waitMsg: {
                    msg: RS.$('All_Loading'),
                    target: me.ownerCt
                },
                success: function (action) {
                    me.curData = me.records[monthName] = {
                        year: year,
                        month: month,
                        dirty: false,
                        data: action.result
                    };

                    me.surfaces.data.renderFrame();
                }
            });
        }

        me.curData = me.records[monthName];
        me.renderFrame();
    },

    onMouseDown: function (e) {
        e.preventDefault();

        var me = this,
            x = e.getX() - me.getX(),
            y = e.getY() - me.getY(),
            surface = me.surfaces.selection,
            sprites = surface.getItems(),
            rect;

        if (sprites.length == 0) {
            surface.add({
                type: 'rect',
                translationX: 0.5,
                translationY: 0.5,
                lineDash: [3, 3, 3, 3, 3, 3, 3, 3],
                //lineDash: [1, 1, 1, 1, 1, 1, 1, 1],
                lineDashOffset: 0.5,
                strokeStyle: '#ff3300',
                lineWidth: 3,
                fillStyle: null
            });
        }

        sprites = surface.getItems(),
        rect = sprites[0];
        rect.show();

        rect.setAttributes({
            x: x,
            y: y,
            height: 0,
            width: 0
        });

        surface.renderFrame();
    },

    onMouseMove: function (e) {
        e.stopPropagation();

        var me = this,
            x = e.getX() - me.getX(),
            y = e.getY() - me.getY(),
            surface = me.surfaces.selection,
            sprites = surface.getItems(),
            rect;

        if (sprites.length == 0)
            return;

        rect = sprites[0];

        if (rect.attr.hidden)
            return;

        rect.setAttributes({
            width: x - rect.attr.x,
            height: y - rect.attr.y
        });

        surface.renderFrame();
    },

    onMouseUp: function (e) {
        e.preventDefault();

        var me = this,
            x = e.getX() - me.getX(),
            y = e.getY() - me.getY(),
            surface = me.surfaces.selection,
            sprites = surface.getItems(),
            rect;

        if (sprites.length == 0)
            return;

        rect = sprites[0];

        if (rect.attr.hidden)
            return;

        rect.hide();

        me.fireEvent('rangeselectionend', {
            x: Math.min(rect.attr.x, x),
            y: Math.min(rect.attr.y, y),
            cx: Math.max(rect.attr.x, x),
            cy: Math.max(rect.attr.y, y)
        });

        surface.renderFrame();
    },

    onRangeselectionEnd: function (rect) {
        var me = this,
            cx1 = me.cellFromX(rect.x),
            cx2 = me.cellFromX(rect.cx),
            cy1 = me.cellFromY(rect.y),
            cy2 = me.cellFromY(rect.cy);

        x = me.regularCellX(cx1, cx2);
        y = me.regularCellY(cy1, cy2);

        if (x && y) {
            var newValue = me.getData(x.v1, y.v1) ? false : true;
            for (var day = x.v1; day <= x.v2; day++) {
                for (var hh = y.v1; hh <= y.v2; hh++) {
                    me.setData(day, hh, newValue);
                }
            }
        }

        me.surfaces.data.renderFrame();
    },

    save: function () {
        var me = this,
            data = [];

        for (var propName in me.records) {
            var rec = me.records[propName];
            if (rec.dirty) {
                data.push({
                    year: rec.year,
                    month: rec.month,
                    data: rec.data
                });
            }
        }

        return data;
    },

    submit: function (fn, scope) {
        var me = this,
            data = me.save();

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/TimeSheet.ashx'),
            params: {
                method: 'SaveTimeSheetCalendar',
                sheetName: me.sheetName
            },
            jsonData: data,
            waitMsg: {
                msg: RS.$('All_Saving'),
                target: me.ownerCt,
                start:0
            },
            success: function (action) {
                for (var propName in me.records)
                    me.records[propName].dirty = false;

                if (fn) {
                    fn.call(scope, data);
                }
            }
        });
    }
});
