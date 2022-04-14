/*
property:
    btnAdd
    btnRemove
events:
    addClick
    removeClick
*/

Ext.define('YZSoft.src.toolbar.SelectionOptBar', {
    extend: 'Ext.container.Container',
    border: false,

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnAdd = Ext.create('Ext.button.Button', {
            disabled: true,
            padding: 3,
            margin: 3,
            text: '->',
            handler: function () {
                me.fireEvent('addClick');
            }
        });

        me.btnRemove = Ext.create('Ext.button.Button', {
            disabled: true,
            padding: 3,
            margin: 3,
            text: '<-',
            handler: function () {
                me.fireEvent('removeClick');
            }
        });

        cfg = {
            layout: 'center',
            width: 38,
            items: [{
                xtype: 'component',
                cls: 'yz-glyph yz-glyph-eadd',
                style: 'font-size:18px;color:#aeabac'
            }]
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});