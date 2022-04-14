
Ext.define('YZSoft.bpm.form.Post', {
    extend: 'YZSoft.bpm.form.BPMFormBase',
    border: false,

    constructor: function (config) {
        var me = this,
            collapseCommentsPanel = config.collapseCommentsPanel === undefined ? $S.form.collapseCommentsPanel : config.collapseCommentsPanel;

        me.btnSave = me.createButton(true, {
            iconCls: 'yz-glyph yz-glyph-save',
            text: RS.$('All_Save'),
            handler: function (item) {
                me.save();
            }
        });

        me.btnChart = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_ProcessChart'),
            glyph: 0xeae5,
            handler: function (item) {
                me.getPostForecastData(function (data) {
                    me.openFlowChart(data, 0);
                });
            }
        });

        me.btnForecast = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Forecast'),
            glyph: 0xea94,
            handler: function (item) {
                me.getPostForecastData(function (data) {
                    me.openFlowChart(data, 1);
                });
            }
        });

        me.btnPrint = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e61f',
            text: RS.$('All_Print'),
            handler: function (item) {
                me.print();
            }
        });

        me.btnRefresh = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            text: RS.$('All_Refresh'),
            handler: function (item) {
                me.refresh();
            }
        });

        me.summaryPanel = Ext.create('Ext.panel.Panel', {
            width: 200,
            region: 'east',
            border: false,
            title: RS.$('Form_Task_Summary'),
            hidden: true,
            header: false,
            split: {
                cls: 'yz-spliter',
                size: 5,
                collapseOnDblClick: false,
                collapsible: true
            }
        });

        me.commentsPanel = Ext.create('YZSoft.bpm.form.Comments', {
            hidden: collapseCommentsPanel !== false,
            post: true,
            region: 'north'
        });

        me.btnComments = Ext.create('YZSoft.src.button.PanelExpandButton', {
            text: RS.$('All_ExpandComments'),
            expandPanel: me.commentsPanel
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            //disabled: true 不能用disable后面enable时，所有控件都会亮
            cls: ['yz-tbar-module', 'yz-tbar-bpmform', 'yz-tbar-bpmform-loading'],
            items: []
        });

        me.formPanel = Ext.create('YZSoft.src.panel.IFramePanel', {
            region: 'center',
            cls: 'yz-border-t',
            border: false,
            params: config.params,
            listeners: {
                yzafterrender: function () {
                    me.init(config);
                },
                close: function () {
                    me.close();
                }
            }
        });

        var cfg = {
            layout: 'border',
            tbar: me.toolbar,
            border: false,
            items: [me.commentsPanel, me.formPanel, me.summaryPanel]
        };

        me.formCard = Ext.create('Ext.panel.Panel', cfg);

        cfg = {
            layout: 'card',
            border: false,
            items: [me.formCard]
        };
        Ext.apply(cfg, config);

        me.callParent([cfg]);

        me.on({
            positionChange: function (newPosition) {
                me.fireFormEvent({
                    event: 'positionChange',
                    params: {
                        newPosition: newPosition
                    }
                });
            }
        });

        me.formPanel.on({
            onload: function () {
                if (me.cmbInitiatorPosition) {
                    var position = me.cmbInitiatorPosition.getValue();
                    Ext.defer(function () {
                        me.fireFormEvent({
                            event: 'positionChange',
                            params: {
                                newPosition: position
                            }
                        });
                    }, 1);
                }
            }
        });
    },

    createPostButton: function (link) {
        var me = this;
        return me.createButton(true, {
            iconCls: 'yz-glyph yz-glyph-e612',
            text: link.DisplayString,
            link: link,
            handler: function () {
                me.post(this.link);
            }
        });
    },

    init: function (config) {
        var me = this;

        me.request({
            async: false,
            params: Ext.apply(Ext.clone(config.params), {
                method: 'GetPostInfo'
            }),
            success: function (action) {
                var result = action.result,
                    nodePerms = result.NodePermisions,
                    draftHeader = result.DraftHeader;

                me.PersistParams = result.PersistParams ? result.PersistParams.split(/[,;]/g) : [];

                Ext.apply(me.params, draftHeader && draftHeader.UrlParams);
                me.params.version = result.version;
                me.params.pn = result.pn;
                me.formPanel.load(result.url);

                var btns = [];
                if (config.params.NewTestingTemplate) {
                    btns.push(me.createSaveAsTestingTemplateButton());
                    btns.push('|');
                    btns.push(me.btnChart);
                    btns.push(me.btnForecast);
                    btns.push('|');
                    btns.push(me.btnPrint);
                    btns.push(me.btnRefresh);
                }
                else {
                    if (result.subModel == 'TestingTemplate') {
                        btns.push(me.createSaveTestingTemplateButton(config.params.did));
                        btns.push('|');
                        btns.push(me.btnChart);
                        btns.push(me.btnForecast);
                        btns.push('|');
                        btns.push(me.btnPrint);
                        btns.push(me.btnRefresh);
                    }
                    else {
                        //添加提交按钮
                        Ext.each(result.links, function (link) {
                            btns.push(me.createPostButton(link));
                        });

                        btns.push('|');

                        if (result.subModel == 'Post') {
                            btns.push(me.createSaveAsDraftButton());
                            btns.push(me.createSaveAsTemplateButton());
                        }
                        else if (result.subModel == 'Draft') {
                            btns.push(me.createSaveDraftButton(config.params.did));
                            btns.push(me.createSaveAsTemplateButton());
                        }
                        else {
                            btns.push(me.createSaveTemplateButton(config.params.did));
                        }

                        btns.push('|');
                        btns.push(me.btnChart);
                        btns.push(me.btnForecast);
                        btns.push('|');
                        btns.push(me.btnPrint);
                        btns.push(me.btnRefresh);
                        btns.push('|');
                        btns.push(me.btnComments);
                        btns.push('->');
                        btns.push(RS.$('Form_PostPosition'));
                        btns.push(me.createPositionCombobox(result.positions, result.selectPosition, result.delagation));
                    }
                }

                me.commentsPanel.edtComments.setValue(result.Comments);
                me.commentsPanel.btnInviteIndicate.setDisabled(!nodePerms.InviteIndicate);
                me.commentsPanel.btnConsign.setDisabled(!nodePerms.Consign);

                if (nodePerms.InviteIndicate) {
                    var users = (draftHeader && draftHeader.InviteIndicateUsers) || [];
                    if (users.length != 0) {
                        me.commentsPanel.btnInviteIndicate.setPressed(true);
                        me.commentsPanel.lstInviteIndicateUsers.setValue(users);
                        me.commentsPanel.setVisible(true);
                    }
                }

                if (nodePerms.Consign) {
                    var enable = draftHeader && draftHeader.ConsignEnabled,
                                users = (draftHeader && draftHeader.ConsignUsers) || [];

                    if (enable && users.length != 0) {
                        me.commentsPanel.btnConsign.setPressed(true);
                        me.commentsPanel.lstConsignUsers.setValue(users);
                        me.commentsPanel.chkConsignRoutingType.setValue(draftHeader && draftHeader.ConsignRoutingType);
                        me.commentsPanel.chkConsignReturnType.setValue(draftHeader && draftHeader.ConsignReturnType);
                        me.commentsPanel.setVisible(true);
                    }
                }

                var declare = result.ParticipantDeclares || [];
                me.commentsPanel.setParticipantDeclares(declare, draftHeader && draftHeader.Context && draftHeader.Context.Routing);
                if (declare.length != 0) {
                    me.commentsPanel.show();
                }

                me.toolbar.add(btns);
            },
            failure: function (action) {
                me.reportErrorInForm(action.result.errorMessage);
            }
        });
    },

    createSaveAsDraftButton: function () {
        var me = this;

        return Ext.create('YZSoft.src.button.Button', {
            text: RS.$('Form_SaveAsDraft'),
            glyph: 0xeb08,
            handler: function (item) {
                if (!this.draftid)
                    me.saveAsDraft(this);
                else
                    me.saveDraft(this.draftid);
            }
        });
    },

    createSaveAsTemplateButton: function () {
        var me = this;

        return Ext.create('YZSoft.src.button.Button', {
            text: RS.$('Form_SaveAsTemplate'),
            glyph: 0xea97,
            handler: function (item) {
                if (!this.draftid)
                    me.saveAsFormTemplate(this);
                else
                    me.saveFormTemplate(this.draftid);
            }
        });
    },

    createSaveAsTestingTemplateButton: function () {
        var me = this;

        return Ext.create('YZSoft.src.button.Button', {
            text: RS.$('Form_SaveAsTestingTemplate'),
            glyph: 0xe616,
            handler: function (item) {
                if (!this.draftid)
                    me.saveAsTestingTemplate(this);
                else
                    me.saveTestingTemplate(this.draftid);
            }
        });
    },

    createSaveDraftButton: function (did) {
        var me = this;

        return Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_SaveDraft'),
            glyph: 0xe616,
            draftid: did,
            handler: function (item) {
                me.saveDraft(this.draftid);
            }
        });
    },

    createSaveTemplateButton: function (did) {
        var me = this;

        return Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_SaveFormTemplate'),
            glyph: 0xe616,
            draftid: did,
            handler: function (item) {
                me.saveFormTemplate(this.draftid);
            }
        });
    },

    createSaveTestingTemplateButton: function (did) {
        var me = this;

        return Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_SaveTestingFormInstance'),
            glyph: 0xe616,
            draftid: did,
            handler: function (item) {
                me.saveTestingTemplate(this.draftid);
            }
        });
    },

    post: function (link, ignorePrompt) {
        var me = this,
            persistParams = me.PersistParams || [];

        var data = {
            Header: {
                Method: 'Post',
                ProcessName: me.params.pn,
                ProcessVersion: me.params.version,
                DraftGuid: me.params.did,
                OwnerMemberFullName: me.getOwnerFullName(),
                Action: link.DisplayString,
                Comment: me.getComments(),
                UrlParams: persistParams.length == 0 ? undefined : Ext.copyTo({}, me.params, persistParams)
            }
        };

        var err = me.checkComments();
        if (err) {
            YZSoft.alert(err);
            return;
        }

        //加签信息
        Ext.apply(data.Header, me.getConsignInfo());

        //阅示信息
        Ext.apply(data.Header, me.getInviteIndicateInfo());

        //路由信息
        Ext.apply(data.Header, {
            Context: {
                Routing: me.getRoutingInfo()
            }
        });

        me.callFormApi({
            method: 'post',
            params: {
                action: link.DisplayString,
                validationGroup: link.ValidationGroup,
                data: data
            },
            success: function (formData) {

                data = me.mergeResponse(data, formData);
                me.encodeHeader(data.Header);

                var cfg = {
                    waitMsg: { msg: RS.$('All_Submiting'), target: me },
                    success: function (rv) {
                        me.fireFormEvent({
                            event: 'afterPost',
                            params: rv,
                            success: function () {
                                var msg = me.getPostResultMessage(rv);
                                Ext.Msg.show({
                                    title: RS.$('Form_PostSuccess_Title'),
                                    msg: RS.$1(msg),
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.INFO,
                                    fn: function () {
                                        me.fireEventExt('afterPost', rv);
                                        me.fireEventExt('afterSubmit', 'Post', rv);
                                        me.fireEventExt('modified', 'Post', rv);
                                        me.fireEventExt('submit', 'Post', rv);
                                        me.close();
                                    }
                                });
                            }
                        });
                    }
                };

                if (ignorePrompt !== true) {
                    me.postConfirm(link, function () {
                        me.ajaxPost(data, cfg);
                    });
                }
                else {
                    me.ajaxPost(data, cfg);
                }
            }
        });
    }
});