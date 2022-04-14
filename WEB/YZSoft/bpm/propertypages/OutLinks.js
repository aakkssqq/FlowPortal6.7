/*
config:
systemLinksFieldConfig
groups
*/
Ext.define('YZSoft.bpm.propertypages.OutLinks', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('Process_Title_OutLinks'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            defaults: {
            },
            items: [{
                xclass: 'YZSoft.bpm.src.editor.OutLinksField',
                fieldLabel: RS.$('Process_OutLinks_Links'),
                flex: 1,
                name: 'links',
                labelAlign: 'top'
            }, Ext.apply({
                xclass: 'YZSoft.bpm.src.editor.SystemLinksField',
                fieldLabel: RS.$('Process_OutLinks_SystemLinks'),
                flex: 1,
                name: 'SystemLinks',
                labelAlign: 'top'
            }, config.systemLinksFieldConfig), {
                xtype: 'fieldset',
                title: RS.$('Process_FieldSet_RecedableGroups'),
                layout: 'anchor',
                padding: '3 16 4 16',
                margin: '3 0 1 0',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: RS.$('All_RecedebackGroup'),
                    anchor: '50%',
                    name: 'RecedeBackGroup',
                    reference: 'edtRecedeBackGroup'
                }, {
                    xclass: 'YZSoft.src.form.field.List',
                    fieldLabel: RS.$('Process_RecedableGroups'),
                    name: 'RecedeBackExtGroups',
                    renderItem: function (text) {
                        return text;
                    },
                    triggers: {
                        search: {
                            cls: 'yz-trigger-browser',
                            handler: function () {
                                this.onBrowser()
                            }
                        }
                    },
                    listeners: {
                        browserClick: function (values) {
                            var refs = me.getReferences(),
                                editor = this;

                            if (!me.dlg) {
                                me.dlg = Ext.create('YZSoft.bpm.src.dialogs.SelRecedeBackGroupDlg', {
                                    title: RS.$('Process_Title_SelRecedeBackGroup'),
                                    groups: config.groups,
                                    closeAction: 'hide',
                                    fn: function (groups) {
                                        editor.setValue(groups);
                                    }
                                });
                            }

                            me.dlg.show({
                                myGroupName: refs.edtRecedeBackGroup.getValue(),
                                value: editor.getValue()
                            });
                        },
                        change: function () {
                            me.updateStatus();
                        }
                    }
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getOutLinksSource: function (sprites) {
        var rv = [];

        Ext.each(sprites, function (sprite) {
            rv.push({
                text: sprite.data.DisplayString,
                tag: sprite
            });
        });

        return rv;
    },

    fill: function (data) {
        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function (commit) {
        var rv = this.getValuesSubmit();

        if (commit) {
            for (var i = 0; i < rv.links.length; i++) {
                rv.links[i].tag.orderIndex = i;
            }

            delete rv.links;
        }

        return rv;
    },

    updateStatus: function () {
    }
});