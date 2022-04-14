
Ext.define('YZSoft.bpm.src.flowchart.UndoItem', {

    constructor: function (config) {
        var me = this,
            selection = config.drawContainer.getSelection();

        Ext.apply(me, config);
        me.process = Ext.clone(config.drawContainer.saveProcess({
            spriteSaved: function (sprite, data) {
                data.selectedIndex = Ext.Array.indexOf(selection, sprite);
            }
        }));
    },

    restore: function () {
        var me = this,
            selection = [];

        me.drawContainer.loadProcess(me.process, {
            spriteCreated: function (sprite, data) {
                if (data.selectedIndex != -1) {
                    selection.push({
                        index: data.selectedIndex,
                        sprite: sprite
                    });
                }
            },
            beforeRender: function () {
                selection = Ext.Array.sort(selection, function (a, b) {
                    return a.index - b.index;
                });

                var sprites = [];
                Ext.each(selection, function (item) {
                    sprites.push(item.sprite);
                });
                me.drawContainer.select(sprites);
            }
        });
    }
});