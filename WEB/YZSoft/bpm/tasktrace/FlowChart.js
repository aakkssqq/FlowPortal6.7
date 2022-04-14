/*
config
    TaskID
*/

Ext.define('YZSoft.bpm.tasktrace.FlowChart', {
    extend: 'YZSoft.bpm.process.FlowChart',
    requires: [
        'YZSoft.src.flowchart.plugin.TaskTrace',
        'YZSoft.bpm.src.ux.Render'
    ],
    containerConfig: {
        plugins: ['tasktraceevents']
    },
    html: '<div class="yz-tasktrace-tipdiv" style="position:absolute;top:-1px;left:0px;right:0px;width:100%;z-index:99;pointer-events:none;"></div>',

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.drawContainer.on({
            scope: me,
            spritemouseover: 'onSpriteMouseOver',
            spritemouseout: 'onSpriteMouseOut'
        });

        me.on({
            single: true,
            afterRender: function () {
                me.tipDiv = me.getEl().down('.yz-tasktrace-tipdiv', false);
                me.ttip = Ext.create('Ext.panel.Panel', {
                    renderTo: me.tipDiv,
                    header: false,
                    border: false,
                    html: '&nbsp;'
                });
                me.tipDiv.hide();
                me.tipDiv.on({
                    hide: function () {
                    }
                });
            }
        });
    },

    openTask: function (taskid, config) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/FlowChart.ashx'),
            params: { Method: 'GetTaskTraceInfo', TaskID: taskid },
            success: function (action) {
                var rv = action.result;

                me.drawContainer.loadProcess(rv.Process);
                me.drawContainer.applyTaskInfo(rv.Steps);

                me.steps = rv.Steps;

                config && config.fn && config.fn(action.result);
            }
        }, config));
    },

    onSpriteMouseOver: function (sprite, event, eOpts) {
        var me = this;

        sprite = sprite.sprite;
        if (me.lastOverSprite === sprite)
            return;

        if (sprite.isShape) {
            me.drawContainer.setStyle('cursor', 'pointer');

            var steps = me.getAllInstanceOf(sprite, me.steps);
            if (steps.length != 0) {
                var html = sprite.node.IsHumanStep ? me.getTipHtmlForHumanStep(steps) : (sprite.node.ElementTypeName=='InformNode' ? me.getTipHtmlForInformStep(steps) : me.getTipHtmlForAutoStep(steps));
                me.ttip.update(html);

                me.tipDiv.slideIn('t', {   //*****动画效果
                    duration: 150
                });

                me.lastOverSprite = sprite;
            }
        }
    },

    onSpriteMouseOut: function (sprite, event, eOpts) {
        var me = this;

        sprite = sprite.sprite;
        if (sprite.isShape) {
            me.drawContainer.setStyle('cursor', 'default');

            if (me.tipDiv.isVisible()) {
                me.tipDiv.slideOut('t', {
                    duration: 100
                });

                delete me.lastOverSprite;
            }
        }
    },

    getAllInstanceOf: function (sprite, steps) {
        var me = this,
            rv = [];

        steps = steps || [];

        Ext.each(steps, function (step) {
            if (me.drawContainer.isInstanceOf(sprite, step))
                rv.push(step);
        });

        return rv;
    },

    getTipHtmlForHumanStep: function (steps) {
        var me = this,
            str = [];

        str.push('<table class="yz-tasktrace-tip" cellspacing="1" cellpadding="1">');
        str.push(Ext.String.format('<tr class="head"><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td style="width:99%">{6}</td></tr>',
            RS.$('All_Index'),
            RS.$('All_StepID'),
            RS.$('All_Date'),
            RS.$('All_Owner'),
            RS.$('All_Handler'),
            RS.$('All_SelAction'),
            RS.$('All_SignComments')));

        for (var i = 0; i < steps.length; i++) {
            var step = steps[i];

            if (step.Finished) {
                str.push(Ext.String.format('<tr><td style="text-align:center">{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td></tr>',
                    i + 1,
                    step.StepID,
                    step.FinishAt,
                    YZSoft.bpm.src.ux.Render.renderStepOwnerExt(step),
                    YZSoft.bpm.src.ux.Render.renderStepHandlerExt(step, false),
                    YZSoft.HttpUtility.htmlEncode(step.SelActionDisplayString),
                    YZSoft.HttpUtility.htmlEncode(step.Comments, true)));
            }
            else {
                str.push(Ext.String.format('<tr class="processing"><td style="text-align:center">{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td></td></tr>',
                    i + 1,
                    step.StepID,
                    step.ReceiveAt,
                    YZSoft.bpm.src.ux.Render.renderStepOwnerExt(step),
                    YZSoft.bpm.src.ux.Render.renderStepRecipientExt(step, false),
                    RS.$('All_Running')));
            }
        }
        str.push('</table>');
        return str.join('');
    },

    getTipHtmlForInformStep: function (steps) {
        var me = this,
            str = [];

        str.push('<table class="yz-tasktrace-tip" cellspacing="1" cellpadding="1">');
        str.push(Ext.String.format('<tr class="head"><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td style="width:99%">{4}</td></tr>',
            RS.$('All_Index'),
            RS.$('All_StepID'),
            RS.$('All_Date'),
            RS.$('All_Owner'),
            RS.$('All_SignComments')));

        for (var i = 0; i < steps.length; i++) {
            var step = steps[i];

            if (step.Finished) {
                str.push(Ext.String.format('<tr><td style="text-align:center">{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td></tr>',
                    i + 1,
                    step.StepID,
                    step.FinishAt,
                    YZSoft.bpm.src.ux.Render.renderStepOwnerExt(step),
                    YZSoft.HttpUtility.htmlEncode(step.Comments, true)));
            }
            else {
                str.push(Ext.String.format('<tr class="processing"><td style="text-align:center">{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td></td></tr>',
                    i + 1,
                    step.StepID,
                    step.ReceiveAt,
                    YZSoft.bpm.src.ux.Render.renderStepOwnerExt(step)));
            }
        }
        str.push('</table>');
        return str.join('');
    },

    getTipHtmlForAutoStep: function (steps) {
        var me = this,
            str = [];

        str.push('<table class="yz-tasktrace-tip" cellspacing="1" cellpadding="1">');
        str.push(Ext.String.format('<tr class="head"><td>{0}</td><td>{1}</td><td style="width:99%">{2}</td></tr>',
            RS.$('All_Index'),
            RS.$('All_StepID'),
            RS.$('All_Date')));

        for (var i = 0; i < steps.length; i++) {
            var step = steps[i];

            if (step.Finished) {
                str.push(Ext.String.format('<tr><td style="text-align:center">{0}</td><td>{1}</td><td>{2}</td></tr>',
                    i + 1,
                    step.StepID,
                    step.FinishAt));
            }
            else {
                str.push(Ext.String.format('<tr class="processing"><td style="text-align:center">{0}</td><td>{1}</td><td>{2}</td></tr>',
                    i + 1,
                    step.StepID,
                    step.ReceiveAt));
            }
        }
        str.push('</table>');
        return str.join('');
    }
});