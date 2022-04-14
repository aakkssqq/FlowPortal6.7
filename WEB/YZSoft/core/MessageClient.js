Ext.define('YZSoft.core.MessageClient', {
    singleton: true,
    queue: [],
    timeout: $S.timeout.formAction,
    shakehandstimeout: 500,

    registerListener: function (target) {
        var me = this;

        var callback = function (e) {
            me.onresponse(e)
        };

        if (window.addEventListener)
            window.addEventListener('message', callback, false);
        else if (window.attachEvent)
            window.attachEvent('onmessage', callback);
    },

    find: function (window) {
        for (var i = 0; i < this.queue.length; i++) {
            var queueItem = this.queue[i];
            if (queueItem.window == window) {
                return queueItem;
            }
        }

        return null;
    },

    request: function (config) {
        config.origin = config.origin || '*';

        var queueItem = this.find(config.target);
        if (!queueItem) {
            queueItem = {
                window: config.target,
                requests: [config]
            }
            this.queue.push(queueItem);
            this.sendNext(queueItem);
        }
        else {
            if (queueItem.requests.length == 0) {
                queueItem.requests.push(config);
                this.sendNext(queueItem);
            }
            else {
                queueItem.requests.push(config);
            }
        }
    },

    sendNext: function (queueItem) {
        if (queueItem.requests.length == 0)
            return;

        var request = queueItem.requests[0];
        var message = Ext.copyTo({}, request, 'channel,params');

        message = Ext.encode(message);
        request.shakehandsTimeouter = Ext.defer(this.onShakehandsTimeout, request.shakehandstimeout || this.shakehandstimeout, this, [queueItem, request]);
        request.timeouter = Ext.defer(this.onRequestTimeout, request.timeout || this.timeout, this, [queueItem, request]);
        request.target.postMessage(message, request.origin);
    },

    onresponse: function (e) {
        var data = (Ext.isString(e.data) && e.data[0] == '{') ? Ext.decode(e.data) : e.data;

        if (!data || data.channel != 'BPM:2020')
            return;

        var me = this,
            params = data.params || {},
            result = params.result;

        var queueItem = this.find(e.source);
        if (queueItem && queueItem.requests.length >= 1) {
            var request = queueItem.requests[0];

            if (result == 'hello-ok!') {
                clearTimeout(request.shakehandsTimeouter);
            }
            else {
                clearTimeout(request.shakehandsTimeouter);
                clearTimeout(request.timeouter);

                me.removeRequest(queueItem, request);

                var fn = request[result];
                if (fn)
                    fn.call(request.scope || request, e, params, request);
            }
        }
    },

    onShakehandsTimeout: function (queueItem, request) {
        clearTimeout(request.timeouter);
        this.removeRequest(queueItem, request);

        var fn = request.shakehandsTimeout;
        if (fn)
            fn.call(request.scope || request, request);
    },

    onRequestTimeout: function (queueItem, request) {
        this.removeRequest(queueItem, request);

        var fn = request.requestTimeout;
        if (fn)
            fn.call(request.scope || request, request);
    },

    removeRequest: function (queueItem, request) {
        if (queueItem && queueItem.requests.length >= 1) {
            queueItem.requests.shift();
            if (queueItem.requests.length >= 1)
                this.sendNext(queueItem);
            else
                Ext.Array.remove(this.queue, queueItem);
        }
    }
}, function () {
    this.registerListener();
});