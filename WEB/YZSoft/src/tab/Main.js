Ext.define('YZSoft.src.tab.Main', {

    constructor: function (config) {
        var xclass = Ext.String.format('YZSoft.src.frame.{0}.MainTab', YZSoft.theme);

        return Ext.create(xclass, config);
    } 
});