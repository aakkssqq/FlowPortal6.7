/*
*/
Ext.define('YZSoft.bpa.sprite.Sprite', {
    extend: 'YZSoft.src.flowchart.sprite.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                lineJoin: 'round'
            }
        }
    },
    propertyConfig: {
        xclass: 'YZSoft.bpa.sprite.Properties.Activity.Property'
    },

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            scope: me,
            beforeShowNodeProperty: 'onBeforeShowNodeProperty',
            propertyChanged: 'onPropertyChanged'
        });
    },

    onPropertyChanged: function (data) {
        this.setSpriteText(data.Name, true);
    },

    onBeforeShowNodeProperty: function (sprite, property) {
        property.data.Name = sprite.getSpriteName();
    },

    getXAligns: function () {
        var me = this,
            attr = me.attr,
            s = attr.width * 0.5;

        return { m: 0, s: -s, e: s };
    },

    getYAligns: function () {
        var me = this,
            attr = me.attr,
            s = attr.height * 0.5;

        return { m: 0, s: -s, e: s };
    },

    getExtensionText: function () {
        var me = this,
            property = YZSoft.bpaDisplayProperty ? YZSoft.bpaDisplayProperty : ['Order'],
            rv = [];

        if (!me.assisit) {
            Ext.each(property, function (propertyName) {
                var text = me.property.data[propertyName];
                if (!Ext.isEmpty(text))
                    rv.push(text);
            });
        }

        return rv;
    }
});