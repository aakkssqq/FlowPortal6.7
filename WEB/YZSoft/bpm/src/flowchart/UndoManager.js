
Ext.define('YZSoft.bpm.src.flowchart.UndoManager', {
    extend: 'Ext.Evented',
    maxSteps: 100,

    constructor: function (config) {
        var me = this;

        Ext.apply(me, config);
        me.callParent(arguments);

        me.items = new Array(me.maxSteps);
        me.begin = -1;
        me.cur = 0;
        me.end = 0;
        me.curVersion = 0;
        me.lastVersion = 0;

    },

    clearDirty: function () {
        this.lastVersion = this.curVersion;
    },

    getDirty: function () {
        return this.lastVersion != this.curVersion;
    },

    canUndo: function () {
        if (this.begin == -1)
            return false;

        return this.cur != this.begin;
    },

    canRedo: function () {
        if (this.begin == -1)
            return false;

        return this.cur != this.end;
    },

    push: function (item) {
        item = {
            ver: this.curVersion,
            data: item
        };

        this.curVersion++;

        if (this.items[this.cur])
            delete this.items[this.cur];

        this.items[this.cur] = item;

        this.cur++;
        if (this.cur >= this.items.length)
            this.cur = 0;

        if (this.items[this.cur])
            delete this.items[this.cur];
        this.items[this.cur] = null;

        this.end = this.cur;

        if (this.begin == -1)
            this.begin = 0;

        if (this.end == this.begin) {
            this.begin++;
            if (this.begin >= this.items.length)
                this.begin = 0;
        }

        this.fireEvent('change', this, this.canUndo(), this.canRedo());
    },

    popUndo: function (fn) {
        if (!this.canUndo())
            return null;

        if (this.cur == this.end) {
            if (!this.items[this.cur])
                delete this.items[this.cur];

            this.items[this.cur] = {
                ver: this.curVersion,
                data: fn()
            };
        }

        this.cur--;
        if (this.cur < 0)
            this.cur = this.items.length - 1;

        this.curVersion = this.items[this.cur].ver;
        return this.items[this.cur].data;
    },

    popRedo: function () {
        if (!this.canRedo())
            return null;

        this.cur++;
        if (this.cur >= this.items.length)
            this.cur = 0;

        this.curVersion = this.items[this.cur].ver;
        return this.items[this.cur].data;
    }
});