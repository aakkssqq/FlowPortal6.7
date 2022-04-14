/*
*/
Ext.define('YZSoft.src.flowchart.sprite.BoxText', {
    extend: 'YZSoft.src.flowchart.sprite.Text',
    fixWidth: true,
    supportTextAlign: true,
    canChangeTextAlign: true,
    supportTextVAlign: true,
    canChangeTextVAlign: true,
    archiveProperties: ['text', 'fillStyle', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'underline', 'textAlign', 'textBaseline', 'background'],
    applyProperties: ['fillStyle', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'underline', 'textAlign', 'textBaseline', 'background'],
    inheritableStatics: {
        def: {
            processors: {
                left: 'number',
                top: 'number',
                width: 'number',
                height: 'number',
                paddingtop: 'number',
                paddingleft: 'number',
                paddingbottom: 'number',
                paddingright: 'number',
                orientation: 'string'  //horizontal / vertical
            },
            defaults: {
                left: 0,
                top: 0,
                width: 100,
                height: 20,
                paddingtop: 0,
                paddingleft: 0,
                paddingbottom: 0,
                paddingright: 0,
                orientation: 'horizontal'
            },
            triggers: {
                left: 'textpos',
                top: 'textpos',
                width: 'textpos',
                height: 'textpos',
                paddingtop: 'textpos',
                paddingleft: 'textpos',
                paddingbottom: 'textpos',
                paddingright: 'textpos',
                orientation: 'textpos',
                textAlign: 'textpos',
                textBaseline: 'textpos'
            },
            updaters: {
                textpos: function (attr) {
                    this.updateTextPos(attr);
                }
            }
        }
    },

    updateTextPos: function (attr) {
        var me = this,
            x, y;

        if (attr.orientation != 'vertical') {
            switch (attr.textAlign) {
                case 'start':
                    x = attr.left + attr.paddingleft;
                    break;
                case 'center':
                    x = attr.left + attr.width * 0.5;
                    break;
                case 'end':
                    x = attr.left + attr.width - attr.paddingright;
                    break;
            }

            switch (attr.textBaseline) {
                case 'top':
                    y = attr.top + attr.paddingtop;
                    break;
                case 'middle':
                    y = attr.top + attr.height * 0.5;
                    break;
                case 'bottom':
                    y = attr.top + attr.height - attr.paddingbottom;
                    break;
            }

            me.setAttributes({
                fixWidth: me.fixWidth ? attr.width - attr.paddingleft - attr.paddingright : 0,
                x: x,
                y: y
            });
        }
        else {
            switch (attr.textAlign) {
                case 'start':
                    x = attr.left + attr.paddingbottom;
                    break;
                case 'center':
                    x = attr.left + attr.height * 0.5;
                    break;
                case 'end':
                    x = attr.left + attr.height - attr.paddingtop;
                    break;
            }

            switch (attr.textBaseline) {
                case 'top':
                    y = attr.top + attr.height + attr.paddingleft;
                    break;
                case 'middle':
                    y = attr.top + attr.height + attr.width * 0.5;
                    break;
                case 'bottom':
                    y = attr.top + attr.height + attr.width - attr.paddingright;
                    break;
            }

            me.setAttributes({
                fixWidth: me.fixWidth ? attr.height - attr.paddingtop - attr.paddingbottom : 0,
                x: x,
                y: y,
                rotationCenterX: attr.left,
                rotationCenterY: attr.top + attr.height,
                rotationRads: -Math.PI / 2
            });
        }
    }
});
