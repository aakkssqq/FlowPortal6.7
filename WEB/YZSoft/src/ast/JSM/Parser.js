
Ext.define('YZSoft.src.ast.JSM.Parser', {
    extend: 'Ext.Evented',
    config: {
        jsmCode:null
    },
    statics: {
        parse: function (jsm, success, fail) {
            var me = this;

            YZSoft.Ajax.request({
                method: 'POST',
                url: YZSoft.$url('YZSoft.Services.REST/Parser/JSM.ashx'),
                params: {
                    method: 'GetASTTree'
                },
                jsonData: jsm,
                success: function (action) {
                    success && success(action.result);
                },
                failure: function (action) {
                    fail && fail(action.result);
                }
            });
        }
    },

    updateJsmCode: function (newValue, oldValue) {
        var me = this;

        me.self.parse(newValue, function (ast) {
            me.fireEvent('astchanged', ast);
        }, function (result) {
            me.fireEvent('parseFailed', result);
        });
    }
});