Ext.define('YZSoft.bpm.src.model.StoreFolder', {
    extend: 'Ext.data.TreeModel',
    idProperty: 'path',
    fields: [
        { name: 'rsid' }
    ],
    isPreventDrag: function () {
        var me = this;

        return me.isRoot();
    },
    isPreventDrop: function (records, position, dragData, e, eOpts) {
        if (this.isRoot() && position != 'append')
            return true;
    },
    getStorePath: function () {
        var field = 'text',
            separator = '/';

        var path = [this.get(field)],
            parent = this.parentNode;

        while (!parent.isRoot()) {
            path.unshift(parent.get(field));
            parent = parent.parentNode;
        }
        return path.join(separator);
    },
    updatePath: function () {
        var path = this.getStorePath();

        this.set('path', this.getStorePath());
        this.set('rsid', this.data.rsid.substring(0, this.data.rsid.indexOf('://') + 3) + path);

        Ext.Array.each(this.childNodes, function (rec) {
            rec.updatePath();
        });
    }
});