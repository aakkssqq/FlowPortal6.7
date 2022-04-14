
Ext.define('YZSoft.src.designer.part.ReportSearchField', {
    extend: 'YZSoft.src.designer.part.Abstract',
    requires: [
        'YZSoft.src.designer.archive.Manager'
    ],
    extraCopyProperty: ['binddsid'],
    opts: {
        tag: 'div',
        cls: 'yz-searchfield-opt-cnt',
        children: [{
            cls: 'd-flex flex-row',
            children: [{
                cls: 'opt changetype'
            }, {
                cls: 'opt remove'
            }]
        }]
    },
    config: {
        changeTypeOpt: true,
        removeOpt: true
    },
    layout: {
        type: 'fit'
    },
    draggable: {
        ddGroup: 'reportsearchfield'
    },
    cls: 'yz-part-report-searchfield',
    inheritableStatics: {
        onDrop: function (dcnt, data, fn) {
            var me = this,
                designer = dcnt.designer,
                cfg;

            cfg = {
                fieldLabel: data.record.data.text,
                binddsid: data.dsNode.get('text'),
                xdatabind: data.record.data.text
            };

            fn && fn(cfg);
        }
    },

    prepareComp: function(config) {
        Ext.apply(config, {
            skipLabelForAttribute: true  //设计时禁止，在label上点击触发focus或下拉框展开
        });
    },

    constructor: function (config) {
        var me = this;

        me.optEls = Ext.dom.Element.create(me.opts);

        me.changeTypeEl = me.optEls.down('.changetype');
        me.removeEl = me.optEls.down('.remove');
        me.changeTypeEl.setVisibilityMode(Ext.Element.DISPLAY);
        me.removeEl.setVisibilityMode(Ext.Element.DISPLAY);

        me.callParent(arguments);

        me.on({
            single: true,
            afterrender: function () {
                me.body.el.appendChild(me.optEls);

                me.optEls.on({
                    scope: me,
                    click: 'onOptClick'
                });
            }
        });
    },

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        if (me.binddsid)
            me.dsNode = me.designer.getDSNode(me.binddsid);
    },

    updateChangeTypeOpt: function (newValue) {
        this.changeTypeEl.setVisible(newValue);
    },

    updateRemoveOpt: function (newValue) {
        this.removeEl.setVisible(newValue);
    },

    onOptClick: function (e) {
        var me = this,
            changeType = e.getTarget('.changetype'),
            remove = e.getTarget('.remove');

        if (changeType) {
            e.stopEvent();
            me.onChangeTypeClick(changeType);
        }

        if (remove) {
            e.stopEvent();
            me.deletePart();
        }
    },

    onChangeTypeClick: function (changeTypeDom) {
        var me = this,
            menu;

        menu = Ext.create('Ext.menu.Menu', {
            shadow: false,
            bodyPadding: '3 0',
            defaults: {
                padding: '3 20 3 12'
            },
            items: [{
                glyph: 0xeb27,
                text: RS.$('Designer_FieldType_Text'),
                handler: function () {
                    me.changeComponentType('report.search.field.text');
                }
            }, {
                glyph: 0xeb21,
                text: RS.$('Designer_FieldType_Number'),
                handler: function () {
                    me.changeComponentType('report.search.field.number');
                }
            }, {
                glyph: 0xe60b,
                text: RS.$('Designer_FieldType_Date'),
                handler: function () {
                    me.changeComponentType('report.search.field.date');
                }
            }, {
                glyph: 0xeb15,
                text: RS.$('Designer_FieldType_ComboBox'),
                handler: function () {
                    me.changeComponentType('report.search.field.combobox');
                }
            }, {
                glyph: 0xeae1,
                text: RS.$('Designer_FieldType_User'),
                handler: function () {
                    me.changeComponentType('report.search.field.user');
                }
            }]
        });

        menu.showBy(changeTypeDom, 'tr-br',[0,20]);
        menu.focus();
    },

    deletePart: function () {
        var me = this,
            formfield = me.getComp(),
            fieldName = formfield.getFieldLabel();

        Ext.Msg.show({
            msg: Ext.String.format(RS.$('ReportDesigner_Msg_DeleteSearchField'), fieldName),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                me.destroy();
            }
        });
    },

    changeComponentType: function (ctype, config) {
        var me = this,
            comp = me.getComp(),
            designer = me.designer,
            itemid = designer.dcnt.nextid(ctype),
            index = me.items.indexOf(comp),
            cfg = YZSoft.src.designer.archive.Manager.archive(comp, me);

        Ext.apply(cfg, {
            ctype: ctype
        }, me.componentConfig);

        Ext.apply(cfg, config);

        me.itemid = itemid;

        Ext.suspendLayouts();
        me.remove(comp);
        me.insert(index, cfg);
        Ext.resumeLayouts(true);

        designer.dcnt.fireEvent('selectionchange', me, null, me, null);
    }
});