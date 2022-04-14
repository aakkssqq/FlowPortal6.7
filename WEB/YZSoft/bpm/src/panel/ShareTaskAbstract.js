
Ext.define('YZSoft.bpm.src.panel.ShareTaskAbstract', {
    extend: 'YZSoft.bpm.src.panel.WorklistAbstract',

    renderFlags: function (value, metaData, record) {
        var me = this,
            args = arguments,
            rv = [];

        Ext.Array.each([
            me.renderTimeoutFlag
        ], function (func) {
            rv.push(func.apply(me, args));
        });

        return rv.join('');
    }
});