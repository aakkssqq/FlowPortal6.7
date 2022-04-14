
Ext.define('YZSoft.esb.ux.ClassManager', {
    singleton: true,

    getSpriteXClass: function (componentName) {
        return Ext.String.format('YZSoft.esb.sprites.{0}.Sprite', componentName);
    }
});