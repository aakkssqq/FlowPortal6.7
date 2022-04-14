
Ext.define('YZSoft.src.tab.Module', {

    constructor: function (config) {
        var xclass = Ext.String.format('YZSoft.src.frame.{0}.ModuleTab', YZSoft.theme);

        return Ext.create(xclass, config);
    }
});