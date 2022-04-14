/*
*   expandIcon
*   collapseIcon
*/
Ext.define('YZSoft.src.button.PanelExpandButton', {
    extend: 'Ext.button.Button',
    expandGlyph: 0xe604,
    collapseGlyph: 0xe60a,
    iconAlign: 'right',
    updateStatus: Ext.emptyFn,

    constructor: function (config) {
        this.callParent([config]);

        this.on('beforerender', this.onUpdateStatus, this);
        this.on('click', this.onToggle, this);
    },

    onUpdateStatus: function () {
        var panel = this.expandPanel;

        this.setGlyph(panel.isHidden() ? this.expandGlyph : this.collapseGlyph);
    },

    onToggle: function () {
        var me = this,
            panel = me.expandPanel,
            floatingParentSelector = panel.floatingParentSelector || '.yz-identity-floating-target';

        if (panel.floating) {
            if (panel.isHidden()) {
                if (!panel.floatingParent) {
                    panel.shadow = false;
                    panel.addCls('yz-panel-expand-floatingtop');
                    panel.floatingParent = panel.floatingContainer.el.down(floatingParentSelector);
                    panel.render(panel.floatingParent.dom);
                    panel.showBy(panel.floatingParent, 'tl-tl');
                    panel.setWidth('100%');
                    panel.floatingContainer.on({
                        destroy: function () {
                            panel.destroy();
                        }
                    });
                }
                else {
                    panel.showBy(panel.floatingParent, 'tl-tl');
                }

                panel.el.stopAnimation();
                panel.el.setOpacity(0);
                panel.el.animate({
                    duration: 100,
                    to: {
                        opacity: 1
                    }
                });
            }
            else {
                panel.hide();
            }
        }
        else {
            panel[panel.isHidden() ? 'show' : 'hide']();
        }

        this.onUpdateStatus();
    }
});