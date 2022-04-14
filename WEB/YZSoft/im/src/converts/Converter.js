
Ext.define('YZSoft.im.src.converts.Converter', {
    singleton: true,
    requires: [
        //'YZSoft.src.util.Image'
    ],
    inlineRegxs: [
        /\{imageFile:\d{9,}\}/gi,
        /\{localImageFile:[^\}]{1,}\}/gi,
        /\{vedioFile:\d{9,}\}/gi,
        /\{localVedioFile:[^\}]{1,}\}/gi,
        /\{docFile:\d{9,}[^\}]*\}/gi,
        /\{audioFile:\d{9,}\}/gi,
        /\{localAudioFile:[^\}]{1,}\}/gi,
        /\{qqface:[^\}]{1,}\}/gi,
        /\{taskRejected:\d{1,}\}/gi,
        /\{taskApproved:\d{1,}\}/gi
    ],
    blockRegxs: {
        manualRemind: /^\{"manualRemind":[\s\S]*\}$/i,
        systemRemind: /^\{"systemRemind":[\s\S]*\}$/i,
        localDocFile: /^\{"localDocFile":[\s\S]*\}$/i,
        exceptionStep: /^\{"exceptionStep":[\s\S]*\}$/i
    },
    typeRegxs: [
        /^\{imageFile:\d{9,}\}$/i,
        /^\{localImageFile:[^\}]{1,}\}$/i,
        /^\{vedioFile:\d{9,}\}$/i,
        /^\{localVedioFile:[^\}]{1,}\}$/i,
        /^\{docFile:\d{9,}[^\}]*\}$/i,
        /^\{audioFile:\d{9,}\}$/i,
        /^\{localAudioFile:[^\}]{1,}\}$/i,
        /^\{qqface:[^\}]{1,}\}$/i
    ],
    regFace: /\[[^\]]*\]/gi,

    convert: function (txt, convertType) {
        var me = this,
            type = type || '',
            blocktype;

        Ext.Object.each(me.blockRegxs, function (type, regx) {
            if (regx.test(txt)) {
                blocktype = type;
                return false;
            }
        });

        if (blocktype) {
            var className = Ext.String.capitalize(blocktype),
                xclass = 'YZSoft.im.src.converts.' + className,
                obj = Ext.decode(txt, true),
                convertor,fn;

            Ext.Loader.syncRequire(xclass);

            convertor = YZSoft.im.src.converts[className];
            fn = convertor['convert' + convertType] || convertor['convert'];

            if (obj && fn)
                return fn(obj);
        }

        for (var i = 0; i < me.inlineRegxs.length; i++) {
            var regx = me.inlineRegxs[i],
                fn;

            txt = (txt || '').replace(regx, function (str, p1, p2, offset, s) {
                var msg = str.substr(1, str.length - 2) || '',
                    index = msg.indexOf(':'),
                    items = msg.split(':'),
                    type = index != -1 ? msg.substr(0, index) : '',
                    id = index != -1 ? msg.substr(index + 1) : '';

                var rv = me.convertItem(type, id, convertType);
                return rv;
            });
        }

        return txt;
    },

    convertLastMessage: function (txt) {
        return this.convert(txt, 'LM');
    },

    convertItem: function (type, id, convertType) {
        var className = Ext.String.capitalize(type),
            xclass = 'YZSoft.im.src.converts.' + className,
            convertFnName = 'convert' + convertType,
            convertor,fn;

        Ext.Loader.syncRequire(xclass);

        convertor = YZSoft.im.src.converts[className];
        fn = convertor['convert' + convertType] || convertor['convert'];

        return fn ? fn(id) : '';
    },

    getMessageType: function (txt) {
        var me = this,
            regxs = me.typeRegxs;

        if (regxs[0].test(txt))
            return 'image';
        if (regxs[1].test(txt))
            return 'image';
        if (regxs[2].test(txt))
            return 'video';
        if (regxs[3].test(txt))
            return 'video';
        if (regxs[4].test(txt))
            return 'doc';
        if (regxs[5].test(txt))
            return 'audio';
        if (regxs[6].test(txt))
            return 'audio';
        if (regxs[7].test(txt))
            return 'qqface';

        return 'text';
    },

    encodeFace: function (txt) {
        var me = this,
            regx = me.regFace;

        return (txt || '').replace(regx, me.replacerFace.bind(me));
    },

    replacerFace: function (str, p1, p2, offset, s) {
        var me = this,
            faceText = str.substr(1, str.length - 2),
            faces = Ext.Array.union(YZSoft.src.panel.social.Faces.qq),
            findFace;

        Ext.Array.each(faces, function (face) {
            if (face.text == faceText) {
                findFace = face;
                return false;
            }
        });

        if (findFace)
            return Ext.String.format('{qqface:{0}}', findFace.id);

        return '[' + faceText + ']';
    }
});
