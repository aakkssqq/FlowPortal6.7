
Ext.define('YZSoft.bpm.timesheet.monthcanendar.YAxis', {
    extend: 'YZSoft.bpm.timesheet.monthcanendar.ContainerBase',
    requires: [
        'Ext.draw.sprite.Line',
        'Ext.draw.sprite.Text',
        'Ext.draw.sprite.Rect'
    ],
    workAreaPadding: {
        top: -1,
        left: 1,
        right: 0,
        bottom: 0
    },
    cellSize: {
        width: 26,
        height: 20
    },
    hourText: '12am,1am,2am,3am,4am,5am,6am,7am,8am,9am,10am,11am,12pm,1pm,2pm,3pm,4pm,5pm,6pm,7pm,8pm,9pm,10pm,11pm',

    constructor: function (config) {
        var me = this,
            workAreaPadding = config.workAreaPadding || me.workAreaPadding,
            cellSize = config.cellSize || me.cellSize,
            items = [];

        me.hourText = (config.hourText || me.hourText).split(',');
        delete config.hourText;

        for (var i = 0; i <= 8; i++) {
            for (var j = 0; j < 3; j++) {
                var line,
                        strokeStyle = j == 0 ? '#666' : '#ddd';

                if (i == 8 && j != 0)
                    continue;

                var y = me.yFromHLine(cellSize.height, workAreaPadding, (i * 3 + j) * 2);

                line = {
                    type: 'line',
                    translationX: 0.5,
                    translationY: 0.5,
                    fromX: workAreaPadding.left,
                    fromY: y,
                    toX: config.width - workAreaPadding.right,
                    toY: y,
                    strokeStyle: strokeStyle,
                    lineWidth: 1,
                    surface: 'headline'
                };
                items.push(line);
            }
        }

        for (var i = 0; i < 24; i++) {

            var rect = {
                type: 'rect',
                x: workAreaPadding.left,
                y: me.yFromHLine(cellSize.height, workAreaPadding, i * 2),
                width: config.width - workAreaPadding.left - workAreaPadding.right,
                height: cellSize.height * 2,
                lineWidth: 0,
                fillStyle: '#f6f9fc',
                surface: 'head'
            };

            items.push(rect);

            var text = {
                type: 'text',
                x: config.width - workAreaPadding.right - 5,
                y: me.yFromHLine(cellSize.height, workAreaPadding, i * 2) + 5,
                textAlign: 'end',
                textBaseline: 'top',
                text: me.hourText[i],
                fontFamily: 'helvetica, arial, sans-serif',
                fontSize: '12px',
                fontWeight: 300,
                fillStyle: '#666',
                surface: 'headtext'
            }
            items.push(text);
        }

        var cfg = {
            border: false,
            sprites: items,
            height: me.yFromHLine(cellSize.height, workAreaPadding, 48) + workAreaPadding.bottom
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.surfaces = {
            main: me.getSurface('main'),
            head: me.getSurface('head'),
            headline: me.getSurface('headline'),
            headtext: me.getSurface('headtext')
        };

        me.surfaces.main.element.setStyle('zIndex', 0);
        me.surfaces.head.element.setStyle('zIndex', 1);
        me.surfaces.headline.element.setStyle('zIndex', 2);
        me.surfaces.headtext.element.setStyle('zIndex', 3);
    }
});
