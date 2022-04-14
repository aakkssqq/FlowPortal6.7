
Ext.define('YZSoft.bpm.timesheet.monthcanendar.XAxis', {
    extend: 'YZSoft.bpm.timesheet.monthcanendar.ContainerBase',
    workAreaPadding: {
        top: 0,
        left: 50,
        right: 8,
        bottom: 6
    },
    cellSize: {
        width: 26,
        height: 20
    },

    constructor: function (config) {
        var me = this,
            workAreaPadding = config.workAreaPadding || me.workAreaPadding,
            cellSize = config.cellSize || me.cellSize;

        var items = [];

        for (var i = 0; i < 31; i++) {
            var rect = {
                type: 'rect',
                translationX: 0.5,
                translationY: 0.5,
                y: workAreaPadding.top,
                height: config.height - workAreaPadding.top - workAreaPadding.bottom,
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
                fillStyle: '#ffffff',
                surface: 'head'
            };
            items.push(rect);

            var text = {
                type: 'text',
                y: workAreaPadding.top + 5,
                dockes: {
                    params: {
                        index: i
                    },
                    x: function (size, newAttr, params) {
                        return me.xFromVline(size.width, me.workAreaPadding, params.index) + 5;
                    }
                },
                textAlign: 'start',
                textBaseline: 'top',
                text: i + 1,
                fontFamily: 'helvetica',
                fontSize: '12px',
                fontWeight: 300,
                fillStyle: '#666',
                surface: 'headtextday'
            }
            items.push(text);

            var text = {
                type: 'text',
                y: config.height - workAreaPadding.bottom - 5,
                dockes: {
                    params: {
                        index: i
                    },
                    x: function (size, newAttr, params) {
                        return me.xFromVline(size.width, me.workAreaPadding, params.index+1) - 5;
                    }
                },
                textAlign: 'end',
                textBaseline: 'bottom',
                text: '',
                fontFamily: 'helvetica, arial, sans-serif',
                fontSize: '12px',
                fontWeight: 300,
                fillStyle: '#666',
                surface: 'headtextweekday'
            }
            items.push(text);
        }

        var cfg = {
            border: false,
            sprites: items,
            bodyStyle: 'background-color:#d3e1f1'
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.surfaces = {
            main: me.getSurface('main'),
            head: me.getSurface('head'),
            headtextday: me.getSurface('headtextday'),
            headtextweekday: me.getSurface('headtextweekday')
        };

        me.surfaces.main.element.setStyle('zIndex', 0);
        me.surfaces.head.element.setStyle('zIndex', 1);
        me.surfaces.headtextday.element.setStyle('zIndex', 2);
        me.surfaces.headtextweekday.element.setStyle('zIndex', 2);
    },

    setMonth: function (year, month) {
        var me = this,
            date = new Date(year, month, 1),
            headers = me.surfaces.head.getItems(),
            headtextdays = me.surfaces.headtextday.getItems(),
            headtextweekdays = me.surfaces.headtextweekday.getItems();

        for (var i = 0, n = 31; i < n; i++) {
            var weekday = date.getDay(),
                weekend = weekday == 0 || weekday == 6,
                daymonth = date.getMonth();

            if (daymonth == month) {
                headers[i].setAttributes({
                    fillStyle: weekend ? '#ffffcc' : '#ffffff'
                });

                headtextdays[i].setAttributes({
                    fillStyle: '#666',
                    text: date.getDate()
                });

                headtextweekdays[i].setAttributes({
                    fillStyle: '#666',
                    text: Ext.Date.dayNames[weekday]
                });
            }
            else {
                headers[i].setAttributes({
                    fillStyle: '#f5f5f5'
                });

                headtextdays[i].setAttributes({
                    fillStyle: '#ccc',
                    text: date.getDate()
                });

                headtextweekdays[i].setAttributes({
                    fillStyle: '#ccc',
                    text: Ext.Date.dayNames[weekday]
                });
            }

            date = Ext.Date.add(date, Ext.Date.DAY, 1);
        }

        me.renderFrame();
    }
});