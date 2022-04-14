
Ext.define('YZSoft.src.ux.CustomProtocolSignal', {
    singleton: true,
    requires: [
        'YZSoft.src.ux.Signal'
    ],
    timeout: 3000,

    _createHiddenIframe: function (target, uri) {
        var iframe = document.createElement("iframe");
        iframe.src = uri;
        iframe.id = "hiddenIframe";
        iframe.style.display = "none";
        target.appendChild(iframe);
        return iframe;
    },

    openUriWithTimeoutHack: function (uri, failCb, signalId) {
        var me = this;

        if (Ext.browser.is.ABC ) {
            var iframe = document.querySelector("#hiddenIframe");
            if (!iframe) {
                iframe = this._createHiddenIframe(document.body, "about:blank");
            }
            try {
                iframe.contentWindow.location.href = uri;
            } catch (e) {
                //if (e.name == "NS_ERROR_UNKNOWN_PROTOCOL") {
                //    failCb();
                //    return;
                //}
            }
        }
        else{
            window.location = uri;
        }

        YZSoft.src.ux.Signal.wait({
            timeout: me.timeout,
            millis: 300,
            request: {
                url: YZSoft.$url('YZSoft.Services.REST/core/Signal.ashx'),
                method: 'POST',
                params: {
                    method: 'WaitSignal',
                    signalId: signalId
                }
            },
            success: function (action) {
            },
            failure: function (action) {
                failCb();
            }
        });
    },

    launch: function (uri, failCb, signalId) {
        var me = this;

        function failCallback() {
            failCb && failCb();
        }

        me.openUriWithTimeoutHack(uri, failCallback, signalId);
    }
});
