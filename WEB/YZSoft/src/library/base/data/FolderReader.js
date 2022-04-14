
Ext.define('YZSoft.src.library.base.data.FolderReader', {
    extend: 'Ext.data.reader.Json',

    getData: function (data) {
        var me = this,
            success = true,
            rv = [];

        if (me.getSuccessProperty()) {
            value = me.getSuccess(data);
            if (value === false || value === 'false') {
                success = false;
            }
        }

        if (!success)
            return data;

        Ext.Object.each(data, function (key, value) {
            if (key == 'objects') {
                Ext.each(value, function (item) {
                    rv.push(Ext.apply({
                        $$$isObject: true
                    }, item));
                });
            }

            if (key == 'folders') {
                Ext.each(value, function (item) {
                    if (Ext.isString(item)) {
                        item = {
                            Name: item
                        }
                    }

                    rv.push(Ext.apply({
                        $$$isFolder: true
                    }, item));
                });
            }
        });

        return rv;
    }
});
