
Ext.define('YZSoft.src.container.ModuleContainer', {
    extend: 'Ext.container.Container',
    layout: 'card',

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            activate: function () {
                var pnl = me.getLayout().getActiveItem();
                pnl && pnl.fireEvent('activate');
            }
        });

        me.on({
            scope: me,
            add: 'updateEmptyText',
            remove: 'updateEmptyText',
            afterRender: 'updateEmptyText'
        });
    },

    updateEmptyText: function () {
        var me = this;

        if (me.items.getCount() || me.droppingover) {
            if (me.emptyTextEl) {
                me.emptyTextEl.destroy();
                delete me.emptyTextEl;
            }
        }
        else if (me.emptyText && !me.emptyTextEl) {
            me.emptyTextEl = me.layout.getRenderTarget().createChild({
                cls: ['yz-container-empty-text', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center'],
                html: me.emptyText
            });
        }
    },

    showModule: function (opts) {
        var me = this,
            cnt = me,
            pnl, exist = false;

        if (opts.match) {
            pnl = cnt.items.findBy(opts.match.bind(opts.scope));
            if (pnl) {
                exist = true;
                //Ext.apply(pnl, opts.config);
            }
        }

        if (!pnl) {
            pnl = Ext.create(opts.xclass, opts.config);

            if (opts.created)
                opts.created.call(opts.scope, pnl);

            cnt.add(pnl);
        }

        me.setActiveModule(pnl, !exist);

        if (opts.callback)
            opts.callback.call(opts.scope, pnl, exist);

        return pnl;
    },

    setActiveModule: function (pnl, silence) {
        var me = this,
            cnt = me;

        if (cnt.getLayout().getActiveItem() != pnl) {
            silence && pnl.suspendEvent('activate');
            cnt.setActiveItem(pnl);
            silence && pnl.resumeEvent('activate');
        }
    },

    getActiveItem: function (item) {
        return this.getLayout().getActiveItem();
    },

    closeModule: function (pnl, destroy) {
        var me = this,
            prev = me.getLayout().getPrev();

        destroy = destroy !== false ? true : false;

        if (prev)
            me.getLayout().prev();

        if (destroy)
            pnl.destroy();
        else
            pnl.hide();
    }
});