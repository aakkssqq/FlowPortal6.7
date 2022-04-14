//重载window.close,支持div+iframe窗体调用window.close关闭并返回值

var yzfuncbuffer_windowclose = window.close;

if (typeof (YZSoft) == 'undefined')
    YZSoft = {};

YZSoft.window = {
    getWins: function () {
        try {
            return window.opener.YZSoft.DialogManager.WINS;
        }
        catch (exp) {
            return
        }
    },

    fireEvent: function (eventName) {
        var args = Array.prototype.slice.call(arguments, 1)
        YZSoft.window.fireEventArgs(eventName, args);
    },

    fireEventArgs: function (eventName, args) {
        var f = window.frameElement;

        if (f) {
            var c = f.containerPanel;
            if (c)
                return c.fireEventArgs(eventName, args);
        }
        else {
            var wins = YZSoft.window.getWins();
            if (wins) {
                var dlgargs = wins[window.name];
                if (eventName == 'close')
                    delete wins[window.name];
                if (dlgargs && dlgargs.dlgtype == 'window') {
                    if (dlgargs.listeners && dlgargs.listeners[eventName]) {
                        var fn = dlgargs.listeners[eventName];
                        return fn.apply(dlgargs.listeners.scope || dlgargs.parentWindow, args);
                    }
                }
            }
        }
    },

    closeWindow: function () {
        var frameEle = window.frameElement;
        if (frameEle && frameEle.containerPanel) {
            if (frameEle.containerPanel.closeContainer)
                frameEle.containerPanel.closeContainer();
        }
        else {
            yzfuncbuffer_windowclose();
        }
    },

    onUnload: function () {
        YZSoft.window.fireEvent('close', { dialogResult: 'cancel' });
    }
};

window.close = function () {
    YZSoft.window.fireEvent('close', { dialogResult: 'cancel' });
    YZSoft.window.closeWindow();
};

function CloseWindow(dialogResult, returnValue) {
    var rv = {
        dialogResult: dialogResult,
        returnValue: returnValue
    };

    YZSoft.window.fireEvent('close', rv);
    YZSoft.window.closeWindow();
}

//if (window.addEventListener)
//    window.addEventListener('unload', YZSoft.window.onUnload, false);
//else if (window.attachEvent)
//    window.attachEvent('onunload', YZSoft.window.onUnload);