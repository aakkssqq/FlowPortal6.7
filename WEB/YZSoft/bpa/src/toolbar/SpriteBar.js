
Ext.define('YZSoft.bpa.src.toolbar.SpriteBar', {
    extend: 'Ext.container.Container',
    requires: ['YZSoft.bpa.Categories'],
    cls: 'yz-designer-pnl-spritebar',

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            layout: 'card',
            items: []
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.setCategories(config.categories || me.categories);
    },

    setCategories: function (categories) {
        var me = this,
            catdefs = YZSoft.bpa.Categories.getCategories(categories),
            items = [],
            toolbar;

        toolbar = me.items.findBy(function (item) {
            return item.categories.join(',') == categories.join(',');
        });

        if (!toolbar) {
            Ext.Object.each(catdefs, function (catName, cat) {
                var catPanelCfg = Ext.clone(cat),
                citems = catPanelCfg.items = [];

                items.push(catPanelCfg);
                for (shapeName in cat.shapes) {
                    var btnCfg = cat.shapes[shapeName];

                    Ext.apply(btnCfg, {
                        listeners: {
                            drag: function (e, sprite) {
                                me.fireEvent('dragSprite', e, sprite);
                            }
                        }
                    });

                    btnCfg.sprite.drag = btnCfg.sprite.drag || {};
                    btnCfg.sprite.drag.property = btnCfg.sprite.drag.property || {};
                    btnCfg.sprite.drag.property.data = btnCfg.sprite.drag.property.data || {};
                    btnCfg.sprite.drag.property.data.Id = btnCfg.sprite.drag.Id || shapeName;
                    btnCfg.sprite.drag.property.xclass = btnCfg.sprite.drag.property.xclass;
                    citems.push(btnCfg);
                }
            });

            toolbar = Ext.create('Ext.container.Container', {
                layout: {
                    type: 'accordion',
                    hideCollapseTool: true,
                    titleCollapse: true,
                    animate: true
                },
                defaults: {
                    xclass: 'YZSoft.src.flowchart.toolbar.Container',
                    cls: 'yz-designer-accordion-toolbar-sprite',
                    defaults: {
                        xclass: 'YZSoft.bpa.src.toolbar.SpriteButton',
                        margin: '10 0 0 0',
                        width: 50
                    }
                },
                items: items
            });

            me.add(toolbar);
        }

        me.getLayout().setActiveItem(toolbar);
        me.categories = toolbar.categories = categories;
    }
});