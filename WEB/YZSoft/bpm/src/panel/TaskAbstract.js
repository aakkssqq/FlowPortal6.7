
Ext.define('YZSoft.bpm.src.panel.TaskAbstract', {
    extend: 'YZSoft.bpm.src.panel.WorklistAbstract',

    renderProcessName: function (value, metaData, record) {
        return Ext.util.Format.text(value)
    },

    renderFlags: function(value, metaData, record) {
        var me = this,
            args = arguments,
            rv = [];

        Ext.Array.each([
            me.renderStatusFlag
        ], function(func) {
            rv.push(func.apply(me, args));
        });

        return rv.join('');
    },

    renderStatusFlag: function(value, metaData, record) {
        var now = new Date(),
            state = record.data.State.State;

        switch (state) {
            case 'running':
                return Ext.String.format('<div class="yz-grid-cell-box-flag yz-color-info yz-glyph yz-glyph-eb25" data-qtip="{0}"></div>', RS.$('All_Running'));
            case 'approved':
                return Ext.String.format('<div class="yz-grid-cell-box-flag yz-color-info yz-glyph1 yz-glyph1-e624 fa fa-check-circle" data-qtip="{0}"></div>', RS.$('All_Approved'));
            case 'rejected':
                return Ext.String.format('<div class="yz-grid-cell-box-flag yz-color-warn yz-glyph yz-glyph-e62b" data-qtip="{0}"></div>', RS.$('All_Rejected'));
            case 'aborted':
                return Ext.String.format('<div class="yz-grid-cell-box-flag yz-color-warn yz-glyph yz-glyph-e606" data-qtip="{0}"></div>', RS.$('All_Aborted'));
            case 'deleted':
                return Ext.String.format('<div class="yz-grid-cell-box-flag yz-color-warn yz-glyph yz-glyph-e64d" data-qtip="{0}"></div>', RS.$('All_Deleted'));
            default:
                return Ext.String.format('<div class="yz-grid-cell-box-flag yz-color-warn yz-glyph yz-glyph-e969" data-qtip="{0}"></div>', RS.$('All_UnknownStatus'));
        }
    },

    getRowClass: function (record) {
        switch (record.data.State.State) {
            case 'aborted':
            case 'deleted':
                return 'yz-task-row yz-task-row-gray';
            case 'rejected':
                return 'yz-task-row yz-task-row-rejected';
            case 'running':
                return 'yz-task-row yz-task-row-running';
            case 'approved':
                return 'yz-task-row yz-task-row-approved';
            default:
                return 'yz-task-row';
        }
    },

    onClickSN: function(view, cell, recordIndex, cellIndex, e) {
        if (e.getTarget().tagName == 'A')
            this.openForm(this.store.getAt(recordIndex));
    },

    createButton: function(button, defaultConfig, config) {
        var xclass = button === false ? 'YZSoft.src.menu.Item' : 'YZSoft.src.button.Button';

        config = Ext.apply(defaultConfig, config);
        if (config.perm) {
            Ext.apply(config, {
                disabled: true
            });
        }

        return Ext.create(xclass, config);
    },

    createPickbackButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            iconCls: 'yz-glyph yz-glyph-e612',
            text: RS.$('All_Pickback'),
            perm: 'PickBackExt',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, 1));
            },
            handler: function() {
                YZSoft.bpm.taskoperation.Manager.Pickback(me.grid);
            }
        }, config);
    },

    createInformButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            iconCls: 'yz-glyph yz-glyph-e657',
            text: RS.$('All_Inform'),
            perm: 'Inform',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function(item) {
                YZSoft.bpm.taskoperation.Manager.Inform(me.grid);
            }
        }, config);
    },

    createInviteIndicateButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            text: RS.$('All_InviteIndicate'),
            glyph: 0xeb20,
            perm: 'InviteIndicate',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function(item) {
                YZSoft.bpm.taskoperation.Manager.InviteIndicate(me.grid);
            }
        }, config);
    },

    createPublicButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            text: RS.$('All_Public'),
            glyph: 0xe918,
            perm: 'Public',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function(item) {
                YZSoft.bpm.taskoperation.Manager.Public(me.grid);
            }
        }, config);
    },

    createTraceChartButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            text: RS.$('All_ProcessChart'),
            glyph: 0xeae5,
            handler: function(item) {
                sm = me.grid.getSelectionModel();
                recs = sm.getSelection() || [];

                if (recs.length != 1)
                    return;

                me.openTrace(recs[0], 0);
            }
        }, config);
    },

    createTraceListButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            text: RS.$('All_TraceTimeline'),
            glyph: 0xeb1e,
            handler: function(item) {
                sm = me.grid.getSelectionModel();
                recs = sm.getSelection() || [];

                if (recs.length != 1)
                    return;

                me.openTrace(recs[0], 1);
            }
        }, config);
    },

    createForecastButton: function (button, config) {
        var me = this;
        return this.createButton(button, {
            text: RS.$('All_Forecast'),
            glyph: 0xea94,
            handler: function (item) {
                sm = me.grid.getSelectionModel();
                recs = sm.getSelection() || [];

                if (recs.length != 1)
                    return;

                me.openTrace(recs[0], 2);
            }
        }, config);
    },

    createTraceButton: function(button, config) {
        var me = this;

        me.menuTraceChart = me.createTraceChartButton(false);
        me.menuTraceList = me.createTraceListButton(false);
        me.menuForecast = me.createForecastButton(false);
        return this.createButton(button, {
            text: RS.$('All_TaskTrace'),
            glyph:0xeb10,
            menu: { items: [me.menuTraceChart, me.menuTraceList, me.menuForecast] },
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, null, 1, 1));
            }
        }, config);
    },

    createAbortButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            iconCls: 'yz-glyph yz-glyph-e606',
            text: RS.$('All_Abort'),
            perm: 'Abort',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function(item) {
                YZSoft.bpm.taskoperation.Manager.Abort(me.grid);
            }
        }, config);
    },

    createDeleteButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            iconCls: 'yz-glyph yz-glyph-delete',
            text: RS.$('All_Delete'),
            perm: 'Delete',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function(item) {
                YZSoft.bpm.taskoperation.Manager.Delete(me.grid);
            }
        }, config);
    },

    createContinueButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            text: RS.$('All_ContinueTask'),
            glyph: 0xe951,
            perm: 'Continue',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function(item) {
                YZSoft.bpm.taskoperation.Manager.Restore(me.grid);
            }
        }, config);
    },

    createReturnToInitiatorButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            iconCls: 'yz-glyph yz-glyph-e612',
            text: RS.$('All_ReturnToIniaiator'),
            perm: 'RecedeRestart',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function(item) {
                YZSoft.bpm.taskoperation.Manager.ReturnToInitiator(me.grid);
            }
        }, config);
    },

    createReturnToInitiatorButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            iconCls: 'yz-glyph yz-glyph-e612',
            text: RS.$('All_ReturnToIniaiator'),
            perm: 'RecedeRestart',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function(item) {
                YZSoft.bpm.taskoperation.Manager.ReturnToInitiator(me.grid);
            }
        }, config);
    },

    createRecedeBackButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            iconCls: 'yz-glyph yz-glyph-ea40',
            text: RS.$('All_RecedeBack'),
            perm: 'RecedeBack',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, 1));
            },
            handler: function() {
                YZSoft.bpm.taskoperation.Manager.TaskRecedeBack(me.grid);
            }
        }, config);
    },

    createJumpButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            text: RS.$('All_Jump'),
            glyph: 0xeb1f,
            perm: 'Jump',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, 1));
            },
            handler: function(item) {
                YZSoft.bpm.taskoperation.Manager.Jump(me.grid);
            }
        }, config);
    },

    createTransferButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            iconCls: 'yz-glyph yz-glyph-e60e',
            text: RS.$('All_Transfer'),
            perm: 'Transfer',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, 1));
            },
            handler: function(item) {
                YZSoft.bpm.taskoperation.Manager.TaskTransfer(me.grid);
            }
        }, config);
    },

    createChangeOwnerButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            text: RS.$('All_ChangeOwner'),
            glyph: 0xeae1,
            perm: 'AssignOwner',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, 1));
            },
            handler: function(item) {
                YZSoft.bpm.taskoperation.Manager.AssignOwner(me.grid);
            }
        }, config);
    },

    createRejectButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            iconCls: 'yz-glyph yz-glyph-reject',
            text: RS.$('All_Reject'),
            perm: 'Reject',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function(item) {
                YZSoft.bpm.taskoperation.Manager.Reject(me.grid);
            }
        }, config);
    },

    createReActiveButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            iconCls: 'yz-glyph yz-glyph-e997',
            text: RS.$('All_ReActive'),
            perm: 'ReActive',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function(item) {
                YZSoft.bpm.taskoperation.Manager.ReActive(me.grid);
            }
        }, config);
    },

    createRepairButton: function(button, config) {
        var me = this;
        return this.createButton(button, {
            text: RS.$('All_RepairTask'),
            glyph: 0xeabf,
            perm: 'Repair',
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, 1));
            },
            handler: function(item) {
                YZSoft.bpm.taskoperation.Manager.Repair(me.grid);
            }
        }, config);
    },

    handover: function (recs, method) {
        var me = this,
            items = [],
            params;

        recs = Ext.Array.from(recs);

        if (recs.length == 0)
            return;

        params = {
            Method: method || 'HandoverSteps',
            uid: me.uid
        };

        for (var i = 0; i < recs.length; i++) {
            items.push({
                ID: i,
                TaskID: recs[i].data.TaskID
            });
        };

        YZSoft.bpm.taskoperation.Manager.Handover(me.grid, params, items);
    }
});