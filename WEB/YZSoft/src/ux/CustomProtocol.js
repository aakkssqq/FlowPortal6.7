
Ext.define('YZSoft.src.ux.CustomProtocol', {
    singleton: true,
    timeout: 3000,

    _registerEvent: function (target, eventType, cb) {
        if (target.addEventListener) {
            target.addEventListener(eventType, cb);
            return {
                remove: function () {
                    target.removeEventListener(eventType, cb);
                }
            };
        }
        else {
            target.attachEvent(eventType, cb);
            return {
                remove: function () {
                    target.detachEvent(eventType, cb);
                }
            };
        }
    },

    _createHiddenIframe: function (target, uri) {
        var iframe = document.createElement("iframe");
        iframe.src = uri;
        iframe.id = "hiddenIframe";
        iframe.style.display = "none";
        target.appendChild(iframe);
        return iframe;
    },

    openUriWithHiddenFrame: function (uri, failCb) {

        var timeout = setTimeout(function () {
            failCb();
            handler.remove();
        }, this.timeout);

        var iframe = document.querySelector("#hiddenIframe");
        if (!iframe) {
            iframe = this._createHiddenIframe(document.body, "about:blank");
        }

        var handler = this._registerEvent(window, "blur", onBlur);

        function onBlur() {
            clearTimeout(timeout);
            handler.remove();
        }

        iframe.contentWindow.location.href = uri;
    },

    openUriWithTimeoutHack: function (uri, failCb) {
        var timeout = setTimeout(function () {
            failCb();
            handler.remove();
        }, this.timeout);

        var handler = this._registerEvent(window, "blur", onBlur);

        function onBlur() {
            clearTimeout(timeout);
            handler.remove();
        }

        window.location = uri;
    },

    openUriUsingFirefox: function (uri, failCb) {
        var iframe = document.querySelector("#hiddenIframe");
        if (!iframe) {
            iframe = this._createHiddenIframe(document.body, "about:blank");
        }
        try {
            iframe.contentWindow.location.href = uri;
        } catch (e) {
            if (e.name == "NS_ERROR_UNKNOWN_PROTOCOL") {
                failCb();
            }
        }
    },

    openUriUsingIE: function (uri, failCb) {
        //check if OS is Win 8 or 8.1
        var ua = navigator.userAgent.toLowerCase();
        var isWin8 = /windows nt 6.2/.test(ua) || /windows nt 6.3/.test(ua);

        if (isWin8) {
            this.openUriUsingIEInWindows8(uri, failCb);
        } else {
            if (this.getInternetExplorerVersion() === 10) {
                this.openUriUsingIE10InWindows7(uri, failCb);
            } else if (this.getInternetExplorerVersion() === 9 || this.getInternetExplorerVersion() === 11) {
                this.openUriWithHiddenFrame(uri, failCb);
            } else {
                this.openUriInNewWindowHack(uri, failCb);
            }
        }
    },

    openUriUsingIE10InWindows7: function (uri, failCb) {
        var timeout = setTimeout(failCb, this.timeout);
        window.addEventListener("blur", function () {
            clearTimeout(timeout);
        });

        var iframe = document.querySelector("#hiddenIframe");
        if (!iframe) {
            iframe = this._createHiddenIframe(document.body, "about:blank");
        }
        try {
            iframe.contentWindow.location.href = uri;
        } catch (e) {
            failCb();
            clearTimeout(timeout);
        }
    },

    openUriInNewWindowHack: function (uri, failCb) {
        var myWindow = window.open('', '', 'width=0,height=0');

        myWindow.document.write("<iframe src='" + uri + "'></iframe>");
        setTimeout(function () {
            try {
                myWindow.location.href;
                myWindow.setTimeout("window.close()", this.timeout);
            } catch (e) {
                myWindow.close();
                failCb();
            }
        }, this.timeout);
    },

    openUriUsingIEInWindows8: function (uri, failCb) {
        if (navigator.msLaunchUri) {
            navigator.msLaunchUri(uri,
                function () {
                    window.location = uri;
                },
                failCb
            );
        }
    },

    checkBrowser: function () {
        var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        return {
            isOpera: isOpera,
            isFirefox: typeof InstallTrigger !== 'undefined',
            isSafari: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
            isChrome: !!window.chrome && !isOpera,
            isIE: /*@cc_on!@*/false || !!document.documentMode   // At least IE6
        }
    },

    getInternetExplorerVersion: function () {
        var rv = -1;
        if (navigator.appName === "Microsoft Internet Explorer") {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        else if (navigator.appName === "Netscape") {
            var ua = navigator.userAgent;
            var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
        }
        return rv;
    },

    launch: function (uri, failCb) {
        var browser = this.checkBrowser();

        function failCallback() {
            failCb && failCb();
        }

        if (browser.isFirefox) {
            this.openUriUsingFirefox(uri, failCallback);
        } else if (browser.isChrome) {
            this.openUriWithTimeoutHack(uri, failCallback);
        } else if (browser.isIE) {
            this.openUriUsingIE(uri, failCallback);
        } else {
            this.openUriWithTimeoutHack(uri, failCallback);
        }
    }
});
