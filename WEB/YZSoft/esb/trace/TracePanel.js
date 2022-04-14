
/*
events:
    loadtaskfailure
*/
Ext.define('YZSoft.esb.trace.TracePanel', {
    extend: 'YZSoft.esb.flowchart.AbstractPanel',
    taskId: -1,

    constructor: function (config) {
        var me = this,
            cfg;

        me.drawContainer = Ext.create('YZSoft.esb.trace.DrawContainer', {
            minWidth: 500
        });

        me.pnlDesignContainer = Ext.create('Ext.container.Container', {
            region: 'center',
            layout: 'fit',
            scrollable: false,
            items: [me.drawContainer]
        });

        me.pnlProperty = Ext.create('YZSoft.esb.trace.PropertyPanel', {
            region: 'east',
            width: 432,
            minWidth: 432,
            split: {
                size: 5
            },
            style: 'background-color:#fff;',
            designer: me
        });

        me.btnRun = Ext.create('Ext.button.Button', {
            text: RS.$('All_ESBTrace_Retry'),
            cls: 'yz-size-icon-12',
            glyph: 0xea86,
            hidden: true,
            handler: function (item) {
                me.runContinue(me.task.TaskID);
            }
        });

        me.maxminbtn = Ext.create('Ext.Button', {
            iconCls: 'yz-glyph yz-glyph-e98b',
            tooltip: RS.$('All_Window_Maximize'),
            disabled: false,
            scope: me,
            handler: function () {
                if (me.yzmaximized) {
                    me.maxminbtn.setIconCls('yz-glyph yz-glyph-e98b');
                    me.maxminbtn.setTooltip(RS.$('All_Window_Maximize'));
                    me.yzrestore();
                }
                else {
                    me.maxminbtn.setIconCls('yz-glyph yz-glyph-e98c');
                    me.maxminbtn.setTooltip(RS.$('All_Window_Restore'));
                    me.yzmaximize();
                }
            }
        });

        cfg = {
            layout: 'border',
            tbar: {
                cls: 'yz-tbar-module yz-border-b',
                items: [
                    me.btnRun,
                    '->',
                    me.maxminbtn
                ]
            },
            items:[
                me.pnlDesignContainer,
                me.pnlProperty
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            afterLayout: function () {
                me.openTask(me.taskId, {
                    fn: function (traceInfo) {
                        var notDoneStep = me.getFirstNotDoneStep(traceInfo.steps),
                            sprite = (notDoneStep && me.getSpriteByName(notDoneStep.NodeName)) || me.getListenerSprite();

                        if (String.Equ(traceInfo.task.Status,'Interrupted') && traceInfo.task.AsyncCall)
                            me.btnRun.show();

                        if (sprite) {
                            me.drawContainer.deselectAll(true);
                            me.drawContainer.select(sprite);
                            me.drawContainer.renderFrame();
                        }
                    }
                });
            }
        });

        me.pnlProperty.relayEvents(me.drawContainer, ['selectionchange']);
    },

    getFirstNotDoneStep: function (steps) {
        return Ext.Array.findBy(steps, function (step) {
            return step.Status != 'Done';
        });
    },

    runContinue: function (taskId) {
        var me = this,
            sprites = me.drawContainer.getSelection(),
            lastSelectedSprite = sprites[0],
            lastSelectedNodeName = lastSelectedSprite && lastSelectedSprite.sprites.text.attr.text;

        me.btnRun.setDisabled(true);

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/ESB/Instance/Service.ashx'),
            params: {
                method: 'RunContinue',
                taskId: taskId
            },
            waitMsg: {
                msg: RS.$('All_Loading'),
                target: me
            },
            success: function (action) {
                var trace = me.traceInfo = action.result.trace;

                me.task = trace.task;

                if (me.destroyed)
                    return;

                me.loadDoc(trace.flow, true);
                me.applyTaskInfo(trace.steps);
                me.drawContainer.renderFrame();

                if (action.result.error) {
                    var notDoneStep = me.getFirstNotDoneStep(trace.steps),
                        sprite = notDoneStep && me.getSpriteByName(notDoneStep.NodeName);

                    me.drawContainer.deselectAll(true);
                    sprite && me.drawContainer.select(sprite);
                    me.drawContainer.renderFrame();

                    YZSoft.alert(action.result.errorMessage, function () {
                        me.btnRun.setDisabled(false);
                    });
                }
                else {
                    me.btnRun.hide();

                    var sprite = lastSelectedNodeName && me.getSpriteByName(lastSelectedNodeName);

                    me.drawContainer.deselectAll(true);
                    sprite && me.drawContainer.select(sprite);
                    me.drawContainer.renderFrame();
                }

                me.fireEvent('afterrun');
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage, function () {
                });
            }
        });
    },

    openTask: function (taskId, config) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/ESB/Instance/Service.ashx'),
            params: {
                method: 'GetInstanceTraceInfo',
                taskId: taskId
            },
            waitMsg: {
                msg: RS.$('All_Loading'),
                target: me
            },
            success: function (action) {
                var trace = me.traceInfo = action.result;

                me.task = trace.task;

                if (me.destroyed)
                    return;

                me.loadDoc(trace.flow, true);
                me.applyTaskInfo(trace.steps);
                me.drawContainer.renderFrame();

                config && config.fn && config.fn(trace);
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage, function () {
                    me.fireEvent('loadtaskfailure', action.result);
                });
            }
        });
    },

    applyTaskInfo: function (steps) {
        var me = this,
            sprite

        Ext.Array.each(steps, function (step) {
            sprite = me.getSpriteByName(step.NodeName);

            if (sprite) {
                if (sprite.runtimeInfo) {
                    for (var p in sprite.runtimeInfo) {
                        if (sprite.runtimeInfo.hasOwnProperty(p))
                            sprite.runtimeInfo[p].destroy();
                    }
                }

                me.applySpriteInfo(sprite, step);
            }
        });
    },

    applySpriteInfo: function (sprite, step) {
        var me = this,
            mainSurface = me.drawContainer.getSurface('trace'),
            statusConfig, txtConfig;

        sprite.step = step;
        sprite.runtimeInfo = sprite.runtimeInfo || {};

        //文字
        statusConfig = {
            Status: step.Status
        };

        if (statusConfig) {
            sprite.runtimeInfo.status = me.createStatusSprite(sprite, statusConfig);
            mainSurface.add(sprite.runtimeInfo.status);
        }

        //文字
        if (step.Status == 'Done') {
            txtConfig = {
                fillStyle: 'green',
                text: step.FinishedAt
            };
        }
        else
        {
            txtConfig = {
                fillStyle: 'red',
                text: step.CreateAt
            };
        }

        if (txtConfig) {
            sprite.runtimeInfo.text = me.createTextSprite(sprite, txtConfig);
            mainSurface.add(sprite.runtimeInfo.text);
        }
    },

    createStatusSprite: function (sprite, config) {
        var me = this,
            bbox = sprite.getBBox(false),
            x = bbox.x + bbox.width,
            y = bbox.y,
            src;

        if (config.Status == 'Done')
            src = YZSoft.$url(me, 'images/done.png');
        else
            src = YZSoft.$url(me, 'images/error.png');

        return Ext.create('YZSoft.src.flowchart.sprite.Image', Ext.apply({
            tagSprite: sprite,
            x: x,
            y: y,
            translationX: -6,
            translationY: -6,
            width: 16,
            height: 16,
            src: src,
        }, config));
    },

    createTextSprite: function (sprite, config) {
        var me = this,
            bbox = sprite.getBBox(false),
            x = bbox.x + bbox.width / 2,
            y = bbox.y + bbox.height;

        return Ext.create('YZSoft.src.flowchart.sprite.Text', Ext.apply({
            isRuntimeText: true,
            tagSprite: sprite,
            x: x,
            y: y,
            translationX: 0,
            translationY: 38,
            textAlign: 'center',
            textBaseline: 'top',
            fontSize: '8.25pt',
            fontFamily: 'Tahoma',
            background: {
                fillStyle: 'white',
                fillOpacity: 0.5,
                strokeStyle: 'none'
            },
            debug: {
                bbox: false
            }
        }, config));
    }
});
