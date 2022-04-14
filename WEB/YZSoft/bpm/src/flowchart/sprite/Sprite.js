/*
connectable: true,
resizeable:true,
*/
Ext.define('YZSoft.bpm.src.flowchart.sprite.Sprite', {
    extend: 'YZSoft.src.flowchart.sprite.Image',
    connectable: true,
    resizeable: false,
    inheritableStatics: {
        def: {
            defaults: {
                width: 32,
                height: 32
            },
            anchors: {
                ActivityMiddleTop: {
                    docked: 't',
                    pos: function (attr) {
                        return {
                            x: attr.x + attr.width / 2,
                            y: attr.y - 2
                        }
                    }
                },
                ActivityRightMiddle: {
                    docked: 'r',
                    pos: function (attr) {
                        return {
                            x: attr.x + attr.width + 1,
                            y: attr.y + attr.height / 2
                        }
                    }
                },
                ActivityMiddleBottom: {
                    docked: 'b',
                    pos: function (attr) {
                        return {
                            x: attr.x + attr.width / 2,
                            y: attr.y + attr.height + 1
                        }
                    }
                },
                ActivityLeftMiddle: {
                    docked: 'l',
                    pos: function (attr) {
                        return {
                            x: attr.x - 2,
                            y: attr.y + attr.height / 2
                        }
                    }
                }
            }
        }
    },
    sprites: {
        text: {
            xclass: 'YZSoft.src.flowchart.sprite.Text',
            text: '',
            textAlign: 'center',
            textBaseline: 'top',
            fontSize: 12,
            fillStyle: 'black',
            background: {
                fillStyle: 'none'
            },
            debug: {
                bbox: false
            }
        }
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

    updateChildText: function (sprite, attr) {
        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            x: Math.floor(attr.x + attr.width / 2),
            y: Math.floor(attr.y + attr.height + 6)
        });
    },

    getSpriteId: function () {
        return this.getSpriteName();
    },

    setSpriteId: function (newId) {
        this.setSpriteName(newId, false);
    },

    onPropertyChanged: function (data) {
        this.setSpriteText(data.Name, true);
    },

    onBeforeShowNodeProperty: function (sprite, property) {
        property.data.Name = sprite.getSpriteName();
    }
});