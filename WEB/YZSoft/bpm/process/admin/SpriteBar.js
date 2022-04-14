
Ext.define('YZSoft.bpm.process.admin.SpriteBar', {
    extend: 'Ext.panel.Panel',
    scrollable: true,
    //cls: 'yz-designer-accordion-toolbar-sprite',

    constructor: function (config) {
        var me = this,
            shapes = config.shapes || me.shapes,
            items = [],
            cfg;

        Ext.each(shapes.categroys, function (cat) {
            var catPanelCfg = Ext.clone(cat),
                citems = catPanelCfg.items = [];

            items.push(catPanelCfg);
            for (shapeName in cat.items) {
                var btnCfg = cat.items[shapeName];

                if (Ext.isString(btnCfg)) {
                    btnCfg = {
                        sprite: {
                            xclass: shapes.spriteSpace + '.' + shapeName,
                            text: btnCfg,
                            drag: {
                                sprites: {
                                    text: {
                                        text: btnCfg
                                    }
                                },
                                property: {
                                    xclass: shapes.propertySpace + '.' + shapeName,
                                    data: {
                                        Name: btnCfg
                                    }
                                }
                            }
                        }
                    };
                }

                Ext.apply(btnCfg, {
                    listeners: {
                        drag: function (e, sprite) {
                            me.fireEvent('dragSprite', e, sprite);
                        }
                    }
                });

                citems.push(btnCfg);
            }
        });

        cfg = {
            layout: {
                type: 'accordion',
                hideCollapseTool: true,
                titleCollapse: true,
                animate: true
            },
            defaults: {
                xtype: 'panel',
                scrollable: 'y',
                bodyStyle: 'background-color:#add8e6',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    xclass: 'YZSoft.src.flowchart.toolbar.SpriteButton',
                    margin: '10 0 0 0'
                }
            },
            items: items
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});