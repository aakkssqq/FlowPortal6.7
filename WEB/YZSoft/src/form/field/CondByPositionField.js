/*
config
tables
*/

Ext.define('YZSoft.src.form.field.CondByPositionField', {
    extend: 'Ext.form.FieldContainer',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.edtCompareField = Ext.create('YZSoft.src.form.field.List', {
            flex: 1,
            emptyText: RS.$('All_InitiatorPosition'),
            renderItem: function (text) {
                return text;
            },
            triggers: {
                browser: {
                    cls: 'yz-trigger-position',
                    handler: function () {
                        var editor = this,
                            values = editor.getValue();

                        Ext.create('YZSoft.bpm.src.dialogs.SelLeaderTitlesDlg', {
                            autoShow: true,
                            title: RS.$('All_Caption_InitiatorPosition'),
                            initSelection: values,
                            fn: function (names) {
                                editor.setValue(names);
                            }
                        });

                    }
                }
            }
        });

        me.btnGen = Ext.create('YZSoft.src.button.InsertInPosButton', {
            text: RS.$('All_GenerateCode'),
            margin: '0 0 0 3',
            padding: '0 20',
            listeners: {
                click: function () {
                    var titles = me.edtCompareField.getValue(),
                        codes = [],
                        code;

                    Ext.each(titles, function (title) {
                        codes.push(Ext.String.format('Initiator.LeaderTitle == "{0}"', title));
                    });


                    if (codes.length != 0) {
                        code = codes.join(' || ');
                        this.insertAtCaret(code, {
                            nofocus: function () {
                                YZSoft.alert(RS.$('All_MoveCursorToInsertPos'));
                            }
                        });
                    }
                }
            }
        });

        cfg = {
            defaults: {
                submitValue: false
            },
            items: [me.edtCompareField, me.btnGen]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    attach: function (tags) {
        this.btnGen.attach(tags);
    }
});