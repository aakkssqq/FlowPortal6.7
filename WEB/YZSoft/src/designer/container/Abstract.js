
Ext.define('YZSoft.src.designer.container.Abstract', {
    extend: 'Ext.container.Container',
    isDesignContainer:true,
    ddGroup: '',
    partSelectCls:'yz-part-select',
    innercompSelectCls: 'yz-part-innercomp-select',
    defaultDropIndicatorHeight: 72,
    privates: {
        prepareItems: function (items, applyDefaults) {
            var me = this;

            items = me.wrapParts(items);
            return me.callParent(arguments);
        }
    },
    selectionStack: [],

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            single: true,
            afterRender: function () {
                me.dropZone = me.createDropZone();
            }
        });

        me.on({
            scope:me,
            add: 'updateEmptyText',
            remove: 'updateEmptyText',
            afterRender: 'updateEmptyText'
        });

        me.addCls('yz-indicator-designcontainer');
    },

    createDropZone: function () {
        var me = this;

        return Ext.create('YZSoft.src.designer.dd.DropZone', me, {
            ddGroup: me.ddGroup
        });
    },

    getPartFromId: function (itemid) {
        return this.down(Ext.String.format('[itemid={0}]', itemid));
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
                cls: ['yz-container-empty-text','d-flex','flex-column','align-items-center', 'justify-content-center'],
                html: me.emptyText
            });
        }
    },

    onDropEnter: function (source, e, data) {
        this.droppingover = true;
        this.updateEmptyText();
    },

    onDropOver: function (source, e, data) {
        this.droppingover = true;
        this.updateEmptyText();
    },

    onDropOut: function (source, e, data) {
        this.droppingover = false;
        this.updateEmptyText();
    },

    onDropEnd: function (source, e, data) {
        this.droppingover = false;
        this.updateEmptyText();
    },

    select: function (part, innerComponent) {
        if (part.selectable === false)
            return;

        var me = this,
            partSelectCls = me.partSelectCls,
            innercompSelectCls = me.innercompSelectCls,
            curPart = me.currentselection,
            curInnerComponent = me.curInnerComponent;

        if (curPart === part &&
            curInnerComponent === innerComponent)
            return;

        me.currentselection = part;
        me.curInnerComponent = innerComponent;

        if (innerComponent) {
            curPart && curPart.removeCls(partSelectCls);
            curInnerComponent && curInnerComponent.removeCls(innercompSelectCls);
            innerComponent && innerComponent.addCls(innercompSelectCls);
        }
        else {
            curPart && curPart.removeCls(partSelectCls);
            curInnerComponent && curInnerComponent.removeCls(innercompSelectCls);
            part && part.addCls(partSelectCls);
        }

        if (curPart && curInnerComponent)
            curPart.fireEvent('innerComponentDeselect', curInnerComponent)

        me.fireEvent('selectionchange', part, innerComponent, curPart, curInnerComponent);

        if (curPart)
            me.selectionStack.push([curPart, curInnerComponent]);

        Ext.destroy(me.partListeners);
        Ext.destroy(me.innerCompListeners);

        if (part) {
            me.partListeners = part.on({
                destroyable: true,
                destroy: function () {
                    me.currentselection = null;
                    me.curInnerComponent = null;
                    me.selectPrev();
                }
            });
        }

        if (innerComponent) {
            me.innerCompListeners = innerComponent.on({
                destroyable: true,
                destroy: function () {
                    me.curInnerComponent = null;
                    me.selectPrev();
                }
            });
        }
    },

    selectPrev: function () {
        var me = this,
            stack = me.selectionStack,
            last,part,innerComp;

        while (last = stack.pop()) {
            part = last[0];
            innerComp = last[1];

            if (innerComp && (innerComp.isDestroyed || innerComp.isDestroying))
                continue;

            if (part && (part.isDestroyed || part.isDestroying))
                continue;

            me.select(part, innerComp);
            break;
        }
    },

    createDropIndicator: function (source, data) {
        var me = this,
            body;

        body = me.layout.getRenderTarget();
        me.dropIndicator = body.appendChild({
            role: 'presentation',
            cls: 'yz-dd-part-indicator'
        }, false);

        if (data.fromToolbar)
            me.dropIndicator.setHeight(data.height || me.defaultDropIndicatorHeight);

        if (data.isPart)
            me.dropIndicator.setHeight(data.part.getHeight());

        return me.dropIndicator;
    },

    onDrop: function (source, e, data) {
        var me = this,
            designer = me.designer,
            index = me.layout.getRenderTarget().indexOf(me.dropIndicator.dom),
            ctype = data.ctype,
            partDefine = me.designer.dcnt.partManager.parts[ctype],
            config, partClass, createpart, part;

        if (partDefine) {
            Ext.require(partDefine.xclass, function () {
                partClass = Ext.ClassManager.get(partDefine.xclass);

                partClass.onDrop(me, data, function (config) {
                    config = config || {};
                    Ext.apply(config, {
                        ctype: data.ctype,
                        itemid: me.designer.dcnt.nextid(ctype)
                    });

                    part = me.insert(index, config);
                    designer.dcnt.select(part);
                });
            });
        }
        else {
            YZSoft.Error.raise(RS.$('Designer_InvalidCType') + data.ctype);
        }
    },

    onDorpPart: function (part) {
    },

    save: function (components) {
        var me = this,
            items = [];

        me.items.each(function (part) {
            var itemid = part.itemid,
                cfg = part.save(components);

            components[itemid] = cfg;
            items.push(itemid);
        });

        return items;
    },

    wrapPart: function (cfg) {
        var me = this,
            ctype = cfg.ctype,
            partDefine = me.designer.dcnt.partManager.parts[ctype],
            partConfig;

        if (partDefine) {
            partConfig = Ext.apply({
                xclass: partDefine.xclass,
                designer: me.designer,
                isPart: true,
                ccfg: cfg
            }, partDefine.config);

            return partConfig;
        }
        else {
            YZSoft.Error.raise(RS.$('Designer_InvalidCType') + ctype);
        }
    },

    wrapParts: function (items) {
        if (!items)
            return items;

        var me = this,
            items = Ext.isArray(items) ? items:[items],
            rv = [], part;

        Ext.each(items, function (item) {
            part = item.isPart ? item : me.wrapPart(item);
            part && rv.push(part);
        });

        return rv;
    }
});