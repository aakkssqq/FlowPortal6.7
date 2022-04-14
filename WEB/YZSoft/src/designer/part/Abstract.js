
Ext.define('YZSoft.src.designer.part.Abstract', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.designer.dd.DragSourcePart',
        'YZSoft.src.designer.archive.Manager',
        'YZSoft.src.designer.runtime.ClassManager'
    ],
    layout: 'fit',
    isPart: true,
    focusable:true,
    extraCopyProperty:[], //需要从组建复制到Part的属性
    draggable: true,
    getChildContainers: Ext.emptyFn,
    saveChildContainerConfig: Ext.emptyFn,
    onOptClick: Ext.emptyFn,
    prepareComp:Ext.emptyFn,
    privates: {
        initDraggable: function () {
            var me = this,
                cfg;

            cfg = Ext.apply({
            }, {
                isPart: true,
                getDragData: me.getDragData.bind(me)
            }, Ext.isBoolean(me.draggable) ? null : me.draggable);

            me.dd = new YZSoft.src.designer.dd.DragSourcePart(me, cfg);
        },
        prepareItems: function (items, applyDefaults) {
            var me = this,
                items = Ext.isArray(items) ? items : [items],
                rv = [], part;

            Ext.each(items, function (item) {
                if (item.ctype) {//内部part构造时可能没有ccfg(子项)，如：YZSoft.src.designer.part.Category
                    Ext.apply(item, {
                        designModel: true,
                        xclass: item.xclass || YZSoft.src.designer.runtime.ClassManager.getXClass(item.ctype)
                    });

                    me.prepareComp(item);
                }
            });

            return me.callParent(arguments);
        }
    },
    inheritableStatics: {
        onDrop: function (dcnt, data, fn) {
            fn && fn();
        }
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            ccfg = config.ccfg;

        //转换ccfg,内部part使用items,不使用ccfg,如：YZSoft.src.designer.container.chart.Category
        if (ccfg) {
            if (ccfg.itemid)
                config.itemid = ccfg.itemid;

            if (ccfg.dsid)
                config.dsid = ccfg.dsid;

            Ext.copy(config, ccfg, me.extraCopyProperty);

            if (ccfg.ctype) //内部part构造时可能没有ccfg(子项)，如：YZSoft.src.designer.part.Category
                ccfg.xclass = ccfg.xclass || YZSoft.src.designer.runtime.ClassManager.getXClass(ccfg.ctype);

            config.items = [ccfg];
        }

        me.callParent([config]);
        me.addCls(['yz-indicator-part', 'yz-part']);

        me.on({
            single:true,
            afterrender: function () {
                var html = me.optHtml;
                if (html) {
                    me.optEls = me.el.appendChild({
                        cls:'yz-part-opt-cnt'
                    }, false);

                    html = [
                        '<div class="d-flex flex-row">',
                            html,
                        '</div>'].join('');

                    me.optEls.setHtml(html);
                }

                me.on({
                    scope:me,
                    element: 'el',
                    delegate: '.yz-part-opt-cnt',
                    click: 'onOptClick'
                });
            }
        });
    },

    onOptClick: function (e, t, eOpts) {
        var me = this,
            del = e.getTarget('.delete');

        if (del) {
            e.stopEvent();
            me.deletePart(true);
        }
    },

    deletePart: function (confirm) {
        var me = this;

        if (confirm) {
            Ext.Msg.show({
                msg: Ext.String.format(RS.$('ReportDesigner_Msg_DeletePart'), me.itemid),
                buttons: Ext.Msg.OKCANCEL,
                defaultButton: 'cancel',
                icon: Ext.Msg.INFO,
                fn: function (btn, text) {
                    if (btn != 'ok')
                        return;

                    me.destroy();
                }
            });
        }
        else {
            me.destroy();
        }
    },

    getComp: function () {
        return this.items && this.items.getAt && this.items.getAt(0);
    },

    getDragData: function (e) {
        var me = this;

        return Ext.apply({}, {
            isPart: true,
            part: me,
        }, me.dragdata);
    },

    createGhost: function (cls) {
        var me = this;

        if (me.ghostPanel)
            me.unghost();

        return {
            xtype: 'container',
            id: me.id + '-ghost',
            renderTo: Ext.getBody(),
            floating: true,
            constrain: false,
            shadow: false,
        };
    },

    ghost: function (cls) {
        var me = this,
            box = me.getBox();

        Ext.suspendLayouts();

        ghostPanel = me.ghostPanel = Ext.widget(me.createGhost(cls));

        ghostPanel.setXY([box.x, box.y]);
        ghostPanel.setSize(box.width, box.height);
        ghostPanel.floatParent = me.floatParent;

        ghostPanel.setHtml(me.el.dom.outerHTML);
        Ext.resumeLayouts(true);

        me.elVisMode = me.el.getVisibilityMode();
        me.el.setVisibilityMode(Ext.Element.CLIP);
        me.el.hide();

        return ghostPanel;
    },

    unghost: function () {
        var me = this,
            el = me.el;

        if (!me.ghostPanel)
            return;

        me.ghostPanel.destroy();
        delete me.ghostPanel;

        el.show();
        el.setVisibilityMode(me.elVisMode);
    },

    save: function (components) {
        var me = this,
            comp = me.getComp(),
            children = me.getChildContainers(),
            items = [], cfg;

        if (comp.isDesignContainer) {
            cfg = YZSoft.src.designer.archive.Manager.archive(comp, me) || {};
            cfg.items = comp.save(components);
        }
        else {
            Ext.each(children, function (childContainer) {
                var childContainerConfig = me.saveChildContainerConfig(childContainer) || {};

                Ext.apply(childContainerConfig, {
                    items: childContainer.save(components)
                });

                items.push(childContainerConfig);
            });

            cfg = YZSoft.src.designer.archive.Manager.archive(comp, me) || {};

            if (items.length) {
                Ext.apply(cfg, {
                    items: items
                });
            }
        }

        return cfg;
    },

    //修正part删除时，父容器高度不自动缩小
    destroy: function () {
        var me = this,
            cnt = me.ownerCt;

        me.callParent();

        if (cnt && !cnt.isDestroyed && !cnt.isDestroying) {
            cnt.hide();
            cnt.show();
        }
    }
});