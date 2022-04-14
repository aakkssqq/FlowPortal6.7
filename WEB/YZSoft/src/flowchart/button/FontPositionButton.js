//No Used
Ext.define('YZSoft.src.flowchart.button.FontPositionButton', {
    extend: 'Ext.button.Button',
    iconCls: 'yz-glyph yz-glyph-textformat',
    text: RS.$('All_Align'),
    iconAlign: 'top',
    constructor: function (config) {
        var me = this;

        me.menu = Ext.create('Ext.menu.Menu', {
            items: [{
                xtype: 'buttongroup',
                columns: 3,
                border: false,
                defaults: {
                    handler: function (btn) {
                        if (me.drawContainer.selection.length == 0)
                            return;
                        if (btn.type == 'horizontal') {
                            Ext.each(me.drawContainer.selection, function (select) {
                                select.sprites.text.setAttributes({
                                    textAlign: btn.value
                                });
                            });
                        }
                        if (btn.type == 'vertical') {
                            Ext.each(me.drawContainer.selection, function (select) {
                                select.sprites.text.setAttributes({
                                    textBaseline: btn.value
                                });
                            });
                        }
                        me.drawContainer.renderFrame();
                    }
                },
                items: [{
                    iconCls: 'yz-glyph yz-glyph-textformat-left',
                    iconAlign: 'top',
                    type: 'horizontal',
                    value: 'left'
                }, {
                    iconCls: 'yz-glyph yz-glyph-textformat-center',
                    type: 'horizontal',
                    value: 'center'
                }, {
                    iconCls: 'yz-glyph yz-glyph-textformat-right',
                    type: 'horizontal',
                    value: 'end'
                }, {
                    iconCls: 'yz-glyph yz-glyph-textformat-top',
                    type: 'vertical',
                    value: 'top'
                }, {
                    iconCls: 'yz-glyph yz-glyph-textformat-middle',
                    type: 'vertical',
                    value: 'middle'
                }, {
                    iconCls: 'yz-glyph yz-glyph-textformat-bottom',
                    type: 'vertical',
                    value: 'bottom'
                }]
            }]
        });

        var cfg = [me.menu];
        Ext.apply(cfg, config);
        this.callParent([cfg]);
    }
});