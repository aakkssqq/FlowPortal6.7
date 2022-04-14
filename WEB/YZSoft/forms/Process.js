Ext.application({
    name: 'TaskProcess',
    launch: function () {
        Ext.setKeyboardMode(false);

        var mainWin = Ext.create('YZSoft.bpm.form.Process', {
            topmost: true,
            cls:'yz-bpmform-topmost',
            params: params,
            fireEventExt: function (eventName) {
                var args = Array.prototype.slice.call(arguments, 1);
                args.push(true);
                YZSoft.window.fireEventArgs(eventName, args);
            },
            close: function (rv) {
                this.hide();
                CloseWindow(rv);
            }
        });

        YZSoft.frame = Ext.create('Ext.container.Viewport', {
            layout: 'card',
            items: [mainWin]
        });
    }
});