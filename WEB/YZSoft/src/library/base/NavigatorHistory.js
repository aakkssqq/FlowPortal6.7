
Ext.define('YZSoft.src.library.base.NavigatorHistory', {
    extend: 'Ext.Evented',
    maxSteps: 20,

    constructor: function (config) {
        var me = this;

        Ext.apply(me, config);
        me.callParent(arguments);

        me.items = new Array(me.maxSteps);
        me.begin = 0;
        me.cur = -1;
        me.end = 0;
    },

    canBack: function () {
        return this.cur != -1 && this.cur != this.begin;
    },

    canForword: function () {
        return this.cur != -1 && this.cur != this.end;
    },

    increment: function (index) {
        var me = this;

        index++;
        if (index >= me.items.length)
            index = 0;

        return index;
    },

    decreament: function (index) {
        var me = this;

        index--;
        if (index < 0)
            index = me.items.length - 1;

        return index;
    },

    push: function (item) {
        var me = this,
            isEmpty = me.cur == -1;

        item = {
            data: item
        };

        me.cur = me.increment(me.cur);

        //清除原有项
        if (me.items[me.cur])
            delete me.items[me.cur];

        me.items[me.cur] = item;

        me.end = me.cur;
        if (!isEmpty && me.end == me.begin)
            me.begin = me.increment(me.begin);

        me.fireEvent('change', me, me.canBack(), me.canForword());
    },

    popBack: function () {
        var me = this;

        if (!me.canBack())
            return null;

        me.cur = me.decreament(me.cur);
        me.fireEvent('change', me, me.canBack(), me.canForword());

        return me.items[me.cur].data;
    },

    popForword: function () {
        var me = this;

        if (!me.canForword())
            return null;

        me.cur = me.increment(me.cur);
        me.fireEvent('change', me, me.canBack(), me.canForword());

        return me.items[me.cur].data;
    },

    getCur: function () {
        return this.cur == -1 ? null : this.items[this.cur];
    },

    each: function (fn) {
        var me = this,
            cur = me.begin;

        if (me.cur == -1)
            return;

        while (cur != me.end) {
            fn(me.items[cur].data, cur == me.cur);
            cur = me.increment(cur);
        }
    }
});