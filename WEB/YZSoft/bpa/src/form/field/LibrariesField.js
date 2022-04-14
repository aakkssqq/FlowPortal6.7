
/*
config
*/
Ext.define('YZSoft.bpa.src.form.field.LibrariesField', {
    extend: 'Ext.form.FieldContainer',

    constructor: function (config) {
        var me = this,
            btns = [],
            libs, cfg;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Library.ashx'),
            params: {
                Method: 'GetUserLibraries',
                libType: 'BPAFile'
            },
            success: function (action) {
                libs = action.result;
            }
        });

        Ext.each(libs, function (lib) {
            btns.push(Ext.create('Ext.button.Button', {
                text: lib.Name,
                folderid: lib.FolderID,
                padding: '7 10'
            }));
        });

        me.segBtns = Ext.create('Ext.button.Segmented', {
            items: btns,
            allowMultiple: true
        });

        cfg = {
            items: [me.segBtns]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getValue: function () {
        var me = this,
            rv = [];

        me.segBtns.items.each(function (btn) {
            if (btn.pressed) {
                rv.push(btn.folderid);
            }
        });

        return rv;
    }
});