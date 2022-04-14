Ext.define('YZSoft.src.util.Image', {
    singleton: true,

    getImageDisplaySize: function (naturalSize, maxBox) {
        var scale = Math.max(Math.max(naturalSize.width / 180, naturalSize.height / 200), 1),
            width = naturalSize.width / scale,
            height = naturalSize.height / scale;

        return {
            width: width,
            height: height
        };
    },

    image2base64: function (img, fn, scope) {
        var me = this;

        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);

        var base64 = canvas.toDataURL("image/png");
        fn.call(scope, base64);
    },

    url2base64: function (url, fn, scope) {
        var me = this;

        var img = me.image = new Image();
        img.onload = function () {
            img.onload = null;

            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);

            var base64 = canvas.toDataURL("image/png");
            fn.call(scope, base64);
        }

        img.src = url;
    }
});