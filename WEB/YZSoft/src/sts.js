/*
tbar/items,
store,
sm,
request:{
    url,     default:Permision.ashx
    params:{
        Method
    }
}
------------examples----------------
    me.sts = Ext.create('YZSoft.src.sts', {
        tbar: me.toolBar,
        store: me.store,
        sm: me.grid.getSelectionModel(),
        request: {
            params: {
                Method: 'GetTaskPermision'
            }
        }
    });
*/
Ext.define('YZSoft.src.sts', {
    url: YZSoft.$url('YZSoft.Services.REST/BPM/Permision.ashx'),

    constructor: function (config) {
        var me = this,
            tbar = config.tbar,
            perms = me.perms = [],
            buttons = me.buttons = [];

        Ext.apply(me, config);
        me.request.url = me.request.url || me.url;

        var items = Ext.Array.merge(tbar ? tbar.query('*') : [], config.items || []);
        Ext.each(items, function (itm) {
            if (itm.hidden !== true && itm.updateStatus && itm.updateStatus != Ext.emptyFn) {
                if (itm.perm && Ext.Array.indexOf(perms, itm.perm) == -1)
                    perms.push(itm.perm);

                buttons.push(itm);
            }
        });

        if (me.store)
            me.store.on('load', me.onUpdateStatus, me);

        if (me.sm)
            me.sm.on('selectionchange', me.onUpdateStatus, me);
    },

    onUpdateStatus: function () {
        var me = this,
            recs = me.sm.getSelection(),
            ids = [],
            params = {},
            loadingRecs = [],
            url = me.request.url;

        if (me.perms.length != 0) {
            //获得需要解决记录权限的records
            Ext.each(recs, function (rec) {
                if (!rec.data.perm || !rec.data.perm.recordPerm) {
                    ids.push(me.getId(rec));
                    loadingRecs.push(rec);

                    rec.data.perm = rec.data.perm || {};
                    rec.data.perm.recordPerm = 'waiting';
                }
            });

            if (ids.length != 0) {
                Ext.apply(params, me.request.params);
                params.perms = me.perms.join(',');
                params.ids = ids.join(',');

                Ext.each(this.buttons, function (btn) {
                    if (btn.perm)
                        btn.setDisabled(true);
                });

                Ext.Ajax.request({
                    url: url,
                    async: !!me.request.async, //async undefined 错误
                    params: params,
                    success: function (response) {
                        var result = Ext.decode(response.responseText);

                        if (result.success) {
                            Ext.each(loadingRecs, function (rec) {
                                rec.data.perm.recordPerm = true;
                                Ext.applyIf(rec.data.perm, result.perms[me.getId(rec)]);
                            });
                            me.doUpdateStatus();
                        }
                        else {
                            alert(Ext.String.format('Load permision failed!\nReason:\n{0}', result.errorMessage));
                        }
                    },
                    failure: function (response) {
                        alert(Ext.String.format('Access url({0}) failed, Reason:{1}\r\n', url, response.responseText));
                    }
                });
                return;
            }
        }

        me.doUpdateStatus();
    },

    doUpdateStatus: function () {
        var me = this,
            recs = me.sm.getSelection(),
            waiting = false;

        Ext.each(recs, function (rec) {
            var perm = rec.perm;
            if (perm && perm.recordPerm == 'waiting') {
                waiting = true;
                return false;
            }
        });

        Ext.suspendLayouts();
        try {
            Ext.each(me.buttons, function (btn) {
                if (!waiting || !btn.perm)
                    btn.updateStatus();
            });
        }
        finally {
            Ext.resumeLayouts(true);
        }
    },

    getId: function (rec){
        return rec.getId();
    }
});