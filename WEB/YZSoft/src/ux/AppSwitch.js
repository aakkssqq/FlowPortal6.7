
Ext.define('YZSoft.src.ux.AppSwitch', {
    extend: 'Ext.Evented',
    singleton: true,
    wins: {},

    openApp: function (startApp) {
        var me = this,
            wins = me.wins,
            winname = startApp,
            win = wins[winname],
            url = Ext.String.format('?StartApp={0}', startApp),
            openPrams = [];

        if (String.Equ(YZSoft.startApp, startApp))
            return;

        if (win) {
            if (win && win.window) {
                if (!win.window.closed) {
                    win.window.focus();
                    return;
                }
                delete wins[winname];
            }
        }

        //openPrams.push('fullscreen=yes'); //全屏模式连下面的windows bar也被盖掉了

        win = {
            window: window.open(url, winname, openPrams.join(','))
        }

        if (win.window) {
            wins[winname] = win;
            Ext.defer(function () {
                win.window.focus();
            }, 1);
        }
        else {
            YZSoft.alert(me.popupblocked || RS.$('All_PopupBlockerWarn'));
        }
    }
});