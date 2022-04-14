/*
*/

Ext.define('YZSoft.src.ux.EmptyText', {
    singleton: true,
    requires: [
        'Ext.Glyph'
    ],
    normal: new Ext.Template(
        '{text}'
    ),
    tplGlyph: new Ext.Template(
        '<div class="{cls}" style="width:{width};height:{height};font-size:{height};line-height:{height};font-family:{fontFamily};color:{color}">{character}</div>'
    ),
    tplText: new Ext.Template(
        '<div class="{cls}" style="font-size:{fontSize};line-height:{lineHeight};margin:{margin}">{text}</div>'
    ),
    tplCenterWrap: new Ext.Template(
        '<div class="x-grid-empty d-flex flex-column align-items-center justify-content-center">{html}</div>'
    ),

    create: function (config) {
        var me = this,
            center = config.center,
            text = config.text,
            glyph = config.glyph,
            text = config.text,
            htmls = [],
            glyphHtml,textHtml,html;

        if (glyph) {
            if (!Ext.isObject(glyph)) {
                glyph = {
                    glyph: glyph,
                }
            }

            glyph = {
                glyph: new Ext.Glyph(glyph.glyph),
                cls: glyph.cls || 'yz-emptytext-glyph',
                width: glyph.width || 60,
                height: glyph.height || 60,
                color: glyph.color || '#d0d0d0'
            }

            glyphHtml = me.tplGlyph.apply({
                character: glyph.glyph.character,
                cls: glyph.cls,
                width: glyph.width + 'px',
                height: glyph.height + 'px',
                color: glyph.color,
                fontFamily: glyph.glyph.getStyle()['font-family']
            });

            htmls.push(glyphHtml);
        }

        if (text) {
            if (Ext.isString(text)) {
                text = {
                    text: text
                };
            }

            text = {
                cls: text.cls || 'yz-emptytext-text',
                fontSize: text.fontSize || 13,
                margin: text.margin || '10px 0 60px 0',
                text: text.text
            };

            if (!('lineHeight' in text))
                text.lineHeight = Math.ceil(text.fontSize * 1.3);

            textHtml = me.tplText.apply({
                cls: text.cls,
                fontSize: text.fontSize + 'px',
                lineHeight: text.lineHeight + 'px',
                margin: text.margin,
                text: text.text
            });

            htmls.push(textHtml);
        }


        html = htmls.join('');

        if (center) {
            html = me.tplCenterWrap.apply({
                html: html
            });
        }

        return html;
    }
});