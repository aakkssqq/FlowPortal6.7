/*
messageCat
tables
inheriable
value:
{
"ProviderName": "Mail",
"Enabled": true,
"Inheri": false,
"Title": "222",
"Message": "",
"AttachmentsCode": "Context.Current.GetAttachments(Convert.ToString(FormDataSet[\"Purchase.RequestDate\"])).ToNotifyAttachments()"
}
*/

Ext.define('YZSoft.bpm.src.editor.MessageItemField', {
    extend: 'YZSoft.src.form.FieldContainer',
    referenceHolder: true,
    style: 'background-color:#f0f0f0;',
    padding:'0 5 5 0',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    inheriable: true,

    constructor: function (config) {
        var me = this,
            inheriable = 'inheriable' in config ? config.inheriable : me.inheriable,
            cfg;

        cfg = {
            defaults: {
                margin: 0,
                listeners: {
                    change: function () {
                        me.fireEvent('change');
                        me.updateStatus();
                    }
                },
                defaults: {
                    listeners: {
                        change: function () {
                            me.fireEvent('change');
                            me.updateStatus();
                        }
                    }
                }
            },
            items: [{
                xtype: 'container',
                style:'background-color:#f5f5f5;',
                layout: 'hbox',
                padding: '2 3 2 10',
                items: [{
                    xtype: 'checkbox',
                    boxLabel: RS.$('All_NotifyItemEnable'),
                    value: config.inheriable === false,
                    reference: 'chkEnable'
                }, {
                    xtype: 'checkbox',
                    boxLabel: RS.$('All_InheriParentNotifyMessage'),
                    hidden: !inheriable,
                    reference: 'chkInheri',
                    margin: '0 0 0 20'
                }, {
                    xtype: 'tbfill'
                }, {
                    xtype: 'button',
                    text: RS.$('All_CopyDefaultNotifyMessage'),
                    hidden: !inheriable,
                    reference: 'btnCopy',
                    handler: function () {
                        if (!me.record)
                            return;

                        me.getInheriMessage(me.inheri.parent, me.messageCat, me.record.data.Name, function (value) {
                            var refs = me.getReferences(),
                                contentType = me.contentType;

                            if (Ext.Array.contains(contentType, 'Title'))
                                refs.edtTitle.setValue(value.Title);

                            if (Ext.Array.contains(contentType, 'MessageOnly') || Ext.Array.contains(contextType, 'Message'))
                                refs.edtMessage.setValue(value.Message);

                            if (Ext.Array.contains(contentType, 'Attachment'))
                                refs.edtAttachmentCode.setValue(value.AttachmentsCode);
                        });
                    }
                }, {
                    xtype: 'button',
                    text: RS.$('All_ShowDefaultNotifyMessage'),
                    hidden: !inheriable,
                    reference: 'btnView',
                    margin: '0 0 0 2',
                    handler: function () {
                        if (!me.record)
                            return;

                        me.getInheriMessage(me.inheri.parent, me.messageCat, me.record.data.Name, function (value) {
                            Ext.create('YZSoft.bpm.src.dialogs.MessagePreviewDlg', {
                                autoShow: true,
                                title: Ext.String.format('{0} - {1}', RS.$('All_NotifyContent'), me.record.data.Name),
                                contentType: me.contentType,
                                data: value
                            });
                        });
                    }
                }]
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_Title'),
                reference: 'edtTitle',
                labelAlign: 'top',
                labelSeparator: false,
                labelClsExtra:'yz-form-field-label-message'
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('All_Content'),
                reference: 'edtMessage',
                labelAlign: 'top',
                labelSeparator: false,
                labelClsExtra: 'yz-form-field-label-message',
                inputAttrTpl: new Ext.XTemplate([
                    'wrap="off"'
                ]),
                flex: 1
            }, {
                xtype: 'container',
                layout: 'hbox',
                margin: '-1 0 0 0',
                items: [{
                    xclass: 'YZSoft.src.form.field.CodeSuggestField',
                    reference: 'edtCodeSuggest',
                    tables: config.tables,
                    dlgConfig: {
                        processLink: true
                    },
                    emptyText: RS.$('All_CodeSuggest_EmptyText'),
                    flex: 1
                }, {
                    xclass: 'YZSoft.src.button.InsertInPosButton',
                    reference: 'btnInsert',
                    text: RS.$('All_Insert'),
                    margin: '0 0 0 1',
                    listeners: {
                        click: function () {
                            var refs = me.getReferences();
                            this.insertAtCaret('<%=' + refs.edtCodeSuggest.getValue() + '%>', {
                                nofocus: function () {
                                    YZSoft.alert(RS.$('All_MoveCursorToInsertPos'));
                                }
                            });
                        }
                    }
                }]
            }, {
                xclass: 'YZSoft.bpm.src.form.field.MailAttachmentField',
                fieldLabel: RS.$('All_Attachment'),
                reference: 'edtAttachmentCode',
                labelAlign: 'top',
                labelSeparator: false,
                labelClsExtra: 'yz-form-field-label-message',
                tables: config.tables,
                emptyText: RS.$('Process_AttachmentCode_EmptyText')
            }]
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        var refs = me.getReferences();
        refs.btnInsert.attach([refs.edtTitle, refs.edtMessage]);

        me.on({
            tablesChanged: function (tables) {
                refs.edtCodeSuggest.tables = tables;
                refs.edtAttachmentCode.tables = tables;
            }
        });

        me.updateStatus();
    },

    getInheriMessage: function (parent, messageCat, providerName, callback, scope) {
        var me = this;

        if (!parent) {
            YZSoft.alert(RS.$('All_NoDefaultNotifyMessage'));
            return;
        }

        parent.getMessageGroups(function (messageGroups) {
            var messageGroup = Ext.Array.findBy((messageGroups || []), function (group) {
                if (group.MessageCat == messageCat)
                    return true;
            });
            var messageItems = (messageGroup || {}).MessageItems;
            var messageItem = Ext.Array.findBy((messageItems || []), function (item) {
                if (item.ProviderName == providerName)
                    return true;
            });

            if (!messageItem || messageItem.Inheri) //使用上一级的
                me.getInheriMessage(parent.getParentMessageContainer ? parent.getParentMessageContainer() : null, messageCat, providerName, callback, scope);
            else if (messageItem.Enabled) //使用本级消息
                callback.call(scope || me, messageItem);
        });
    },

    setContentType: function (contentType) {
        var me = this,
            refs = me.getReferences();

        me.contentType = contentType;

        refs.edtTitle.setVisible(Ext.Array.contains(contentType, 'Title'));
        refs.edtMessage.setVisible(Ext.Array.contains(contentType, 'MessageOnly') || Ext.Array.contains(contentType, 'Message'));
        refs.edtAttachmentCode.setVisible(Ext.Array.contains(contentType, 'Attachment'));
    },

    setValue: function (value) {
        var me = this,
            refs = me.getReferences();

        refs.chkEnable.setValue(value.Enabled);
        refs.chkInheri.setValue(value.Inheri);
        refs.edtTitle.setValue(value.Title);
        refs.edtMessage.setValue(value.Message);
        refs.edtAttachmentCode.setValue(value.AttachmentsCode);

        me.value = value;
        me.updateStatus();
    },

    getValue: function () {
        var me = this,
            refs = me.getReferences();

        var rv = {
            ProviderName: me.value.ProviderName,
            Enabled: refs.chkEnable.getValue(),
            Inheri: refs.chkInheri.getValue(),
            Title: refs.edtTitle.getValue(),
            Message: refs.edtMessage.getValue(),
            AttachmentsCode: refs.edtAttachmentCode.getValue()
        };

        return rv;
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            code = refs.edtCodeSuggest.getValue();

        if (refs.chkEnable.getValue()) {
            refs.chkInheri.setDisabled(false);

            if (!refs.chkInheri.isHidden() && refs.chkInheri.getValue()) {
                refs.edtTitle.setDisabled(true);
                refs.edtMessage.setDisabled(true);
                refs.edtCodeSuggest.setDisabled(true);
                refs.btnInsert.setDisabled(true);
                refs.edtAttachmentCode.setDisabled(true);
            }
            else {
                refs.edtTitle.setDisabled(false);
                refs.edtMessage.setDisabled(false);
                refs.edtCodeSuggest.setDisabled(false);
                refs.btnInsert.setDisabled(!code);
                refs.edtAttachmentCode.setDisabled(false);
            }
        }
        else {
            refs.chkInheri.setValue(false);
            refs.chkInheri.setDisabled(true);

            refs.edtTitle.setDisabled(true);
            refs.edtMessage.setDisabled(true);
            refs.edtCodeSuggest.setDisabled(true);
            refs.btnInsert.setDisabled(true);
            refs.edtAttachmentCode.setDisabled(true);
        }
    }
})