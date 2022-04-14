/**
* Utility class to provide a way to *approximately* measure the dimension of text
* without a drawing context.
*/
Ext.define('YZSoft.src.flowchart.TextMeasurer', {
    singleton: true,

    requires: ['Ext.util.TextMetrics'],

    measureDiv: null,
    measureCache: {},

    measureDivTpl: {
        tag: 'div',
        style: {
            overflow: 'hidden',
            position: 'relative',
            'float': 'left', // 'float' is a reserved word. Don't unquote, or it will break the CMD build.
            width: 0,
            height: 0
        },
        //<debug>
        // Tell the spec runner to ignore this element when checking if the dom is clean.
        'data-sticky': true,
        //</debug>
        children: {
            tag: 'div',
            style: {
                display: 'block',
                position: 'absolute',
                x: -100000,
                y: -100000,
                padding: 0,
                margin: 0,
                'z-index': -100000,
                'white-space': 'nowrap'
            }
        }
    },

    actualMeasureText: function (text, font) {
        var me = Ext.draw.TextMeasurer,
            measureDiv = me.measureDiv,
            FARAWAY = 100000,
            size;

        if (!measureDiv) {
            var parent = Ext.Element.create({
                //<debug>
                // Tell the spec runner to ignore this element when checking if the dom is clean.
                'data-sticky': true,
                //</debug>
                style: {
                    "overflow": "hidden",
                    "position": "relative",
                    "float": "left", // DO NOT REMOVE THE QUOTE OR IT WILL BREAK COMPRESSOR
                    "width": 0,
                    "height": 0
                }
            });
            me.measureDiv = measureDiv = Ext.Element.create({
                style: {
                    "position": 'absolute',
                    "x": FARAWAY,
                    "y": FARAWAY,
                    "z-index": -FARAWAY,
                    "white-space": "nowrap",
                    "display": 'block',
                    "padding": 0,
                    "margin": 0
                }
            });
            Ext.getBody().appendChild(parent);
            parent.appendChild(measureDiv);
        }
        if (font) {
            measureDiv.setStyle({
                font: font,
                lineHeight: 'normal'
            });
        }
        measureDiv.setText('(' + text + ')');
        size = measureDiv.getSize();
        measureDiv.setText('()');
        size.width -= measureDiv.getSize().width;
        return size;
    },

    measureTextSingleLine: function (text, font, fixWidth) {
        text = (text || '').toString();

        var cache = this.measureCache,
            chars = text.split(''),
            lineText = '',
            testLineText,
            rv = [],
            lastCachedItem, cachedItem, charactor, i, ln, size;

        if (!cache[font]) {
            cache[font] = {};
        }
        cache = cache[font];

        for (i = 0, ln = chars.length; i < ln; i++) {
            charactor = chars[i];
            testLineText = lineText + charactor;

            if (!(cachedItem = cache[testLineText])) {
                size = this.actualMeasureText(testLineText, font);
                cachedItem = cache[testLineText] = size;
            }

            if (fixWidth && lastCachedItem && cachedItem.width > fixWidth) {
                rv.push({
                    width: lastCachedItem.width,
                    height: lastCachedItem.height,
                    text: lineText
                });

                lastCachedItem = null;
                lineText = '';
                i -= 1;
            }
            else {
                lastCachedItem = cachedItem;
                lineText = testLineText;
            }
        }

        if (lineText.length) {
            rv.push({
                width: cachedItem.width,
                height: cachedItem.height,
                text: lineText
            });
        }

        return rv;
    },

    measureText: function (text, font, fixWidth) {
        var lines = text.split('\n'),
            ln = lines.length,
            height = 0,
            width = 0,
            line, i, j, sizes, lln;

        sizes = [];
        for (i = 0; i < ln; i++) {
            var childlines = this.measureTextSingleLine(lines[i], font, fixWidth);
            Ext.Array.push(sizes, childlines);

            for (j = 0, lln = childlines.length; j < lln; j++) {
                var childline = childlines[j];
                height += childline.height;
                width = Math.max(width, childline.width);
            }
        }

        return {
            width: width,
            height: height,
            sizes: sizes
        };
    }
});