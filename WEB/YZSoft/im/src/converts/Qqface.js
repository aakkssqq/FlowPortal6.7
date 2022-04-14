
Ext.define('YZSoft.im.src.converts.Qqface', {
    singleton: true,
    requires: ['YZSoft.im.src.face.Faces'],

    convert: function (id) {
        var me = this,
            url;

        url = Ext.String.format(YZSoft.$url('YZSoft/im/resources/faces/{0}.gif'), id);

        return Ext.String.format('<img class="yz-social-item-qqface" src="{0}" align="center"/>', url);
    },

    convertLM: function (id) {
        var me = this,
            faces = Ext.Array.union(YZSoft.im.src.face.Faces.qq),
            findFace;

        Ext.Array.each(faces, function (face) {
            if (face.id == id) {
                findFace = face;
                return false;
            }
        });

        if (findFace)
            return Ext.String.format('[{0}]', findFace.text);

        return RS.$('All__MessageConvert_Face');
    }
});
