
Ext.define('YZSoft.src.ux.WindowManager', {
    singleton: true,
    WINS: {},

    OpenWindow: function (id, url, params, config) {
        var me = this;

        id = id || Ext.id();
        id = YZSoft.util.hex.encode(id);
        params = params || {};
        config = config || {};
        url = Ext.String.urlAppend(url, Ext.Object.toQueryString(params));

        var dlgParams = [];
        dlgParams.push('menubar=' + (config.menubar || 'no')); //菜单栏是否可见 
        dlgParams.push('toolbar=' + (config.toolbar || 'no')); //窗口工具栏是否可见
        dlgParams.push('location=' + (config.location || 'yes')); //位置栏是否可见
        dlgParams.push('status=' + (config.status || 'yes')); //窗口被激活后是否浮在其它窗口之上
        dlgParams.push('resizable=' + (config.resizable || 'yes')); //窗口大小是否可调整
        dlgParams.push('scrollbars=' + (config.scrollbars || 'yes')); //窗口是否可有滚动栏
        dlgParams.push('top=' + (config.top || 100)); //窗口距屏幕左边界的像素长度
        dlgParams.push('left =' + (config.left || 100)); //窗口距屏幕上边界的像素长度
        dlgParams.push('width=' + (config.width || '764') + 'px');
        dlgParams.push('height=' + (config.height || '533') + 'px');
        dlgParams.push('alwaysRaised=' + (config.alwaysRaised || 'yes')); //指定窗口悬浮在所有窗口之上
        dlgParams.push('depended=' + (config.depended || 'yes')); //是否和父窗口同时关闭
        dlgParams.push('titlebar=' + (config.titlebar || 'no')); //窗口题目栏是否可见
        dlgParams.push('z-look=' + 'yes'); //窗口被激活后是否浮在其它窗口之上

        //无模式对话框
        var dialogArguments = {
            id: id,
            dlgtype: 'window',
            parentWindow: window,
            listeners: config.listeners
        };

        var item = me.WINS[id];
        if (item && item.window) {
            if (!item.window.closed) {
                item.window.focus();
                return;
            }
            delete me.WINS[id];
        }

        var win = window.open(url, id, dlgParams.join(','));
        if (win) {
            //保存开窗信息
            dialogArguments.window = win;
            me.WINS[win.name] = dialogArguments;
            Ext.defer(function () { win.focus() }, 1);
        }
        else {
            YZSoft.alert(config.popupblocked || RS.$('All_PopupBlockerWarn'));
        }
    },

    intervalCheck: function () {
        var me = this;

        for (var id in me.WINS) {
            var item = me.WINS[id];
            if (item && item.window && item.window.closed) {
                delete me.WINS[id];
                if (item.listeners && item.listeners['close']) {
                    var fn = item.listeners['close'];
                    return fn.call(item.listeners.scope, { dialogResult: 'cancel' });
                }
            }
        }
    }
}, function () {
    this.interval = Ext.Function.interval(this.intervalCheck, 1000, this);
    YZSoft.DialogManager = {
        WINS: this.WINS
    };
});
