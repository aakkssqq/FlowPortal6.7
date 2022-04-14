/*
config:
timesheet  timesheet name
*/

Ext.define('YZSoft.bpm.timesheet.monthcanendar.ContainerBase', {
    extend: 'Ext.draw.Container',
    requires: [
        'Ext.draw.sprite.Line',
        'Ext.draw.sprite.Rect'
    ],

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);
    },

    xFromVline: function (surfaceWidth, workAreaPadding, vlineIndex) {
        return workAreaPadding.left + Math.floor((surfaceWidth - workAreaPadding.left - workAreaPadding.right) * vlineIndex / 31);
    },

    yFromHLine: function (cellHeight, workAreaPadding, hlineIndex) {
        return workAreaPadding.top + cellHeight * hlineIndex;
    },

    onResize: function(width, height, oldWidth, oldHeight) {
        var me = this;

        me.callParent(arguments);

        Ext.each(me.getItems().items, function (surface) {
            if (surface.isSurface) {
                me.updateSpritesSize(surface.getItems(), {width:width,height:height});
            }
        });

        me.renderFrame();
    },

    updateSpritesSize: function (sprites, size) {
        Ext.each(sprites, function (sprite) {
            var newAttr = {},
                dockes = sprite.attr ? sprite.config.dockes : sprite.dockes;

            Ext.each(dockes, function (dock) {
                for (attrName in dock) {
                    if (attrName != 'params' && dock.hasOwnProperty(attrName)) {
                        newAttr[attrName] = dock[attrName].call(sprite, size, newAttr, dock['params'])
                    }
                }
            });

            if (sprite.attr)
                sprite.setAttributes(newAttr);
            else
                Ext.apply(sprite,newAttr);
        });
    }
});
