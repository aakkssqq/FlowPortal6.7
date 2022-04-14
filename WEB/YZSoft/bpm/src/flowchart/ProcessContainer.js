/*
config
    processName
    processVersion
events:
    processLoaded
*/
Ext.define('YZSoft.bpm.src.flowchart.ProcessContainer', {
    extend: 'YZSoft.bpm.src.flowchart.Container',
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],
    border: false,
    bodyCls: 'yz-flowchart-bg',

    applyTaskInfo: function (steps, startindex, count) {
        var me = this,
            sprites = me.getAllNodes(),
            surfaces, stepsRegulared = [];

        surfaces = {
            bg: me.getSurface('runtimeBackGround'),
            text: me.getSurface('runtimeText')
        };

        startindex = startindex || 0;
        count = (count || count === 0) ? count : steps.length - startindex;

        for (var i = startindex; i < count; i++) {
            var step = steps[i];
            if (!steps[i].Finished)
                me.pushStepIfNotExist(stepsRegulared, step);
        }

        for (var i = count-1; i >= startindex; i--) {
            var step = steps[i];
            if (step.Finished)
                me.pushStepIfNotExist(stepsRegulared, step);
        }

        Ext.Array.each(stepsRegulared, function (step) {
            me.applyStepInfo(surfaces, sprites, step);
        });

        for (var p in surfaces) {
            if (surfaces.hasOwnProperty(p))
                surfaces[p].renderFrame();
        }
    },

    pushStepIfNotExist: function (steps, step) {
        var existStep = Ext.Array.findBy(steps, function (tmpstep) {
            var runtimeNodeName1 = tmpstep.NodeNameOrg,
                runtimeNodeName2 = step.NodeNameOrg,
                index;

            if (step.IsHumanStep && tmpstep.IsHumanStep) { //层级审批节点名处理
                index = runtimeNodeName1.indexOf('\\');
                if (index != -1)
                    runtimeNodeName1 = runtimeNodeName1.substring(0, index);

                index = runtimeNodeName2.indexOf('\\');
                if (index != -1)
                    runtimeNodeName2 = runtimeNodeName2.substring(0, index);
            }

            return String.Equ(runtimeNodeName1, runtimeNodeName2);
        });

        if (!existStep)
            steps.push(step);
    },

    tryGetSprite: function (sprites, step) {
        var me = this;

        return Ext.Array.findBy(sprites, function (sprite) {
            return me.isInstanceOf(sprite, step);
        });
    },

    applyStepInfo: function (surfaces, sprites, step) {
        var me = this,
            sprite = me.tryGetSprite(sprites, step);

        if (!sprite)
            return;

        if (sprite.runtimeInfo) {
            for (var p in sprite.runtimeInfo) {
                if (sprite.runtimeInfo.hasOwnProperty(p))
                    sprite.runtimeInfo[p].destroy();
            }
        }

        sprite.runtimeInfo = sprite.runtimeInfo || {};

        //背景
        if (!step.Finished) {
            sprite.runtimeInfo.bg = me.createHotSprite(sprite);
            surfaces.bg.add(sprite.runtimeInfo.bg);
        }

        //文字
        var txtConfig = {};
        if (step.Finished) {
            txtConfig.fillStyle = 'red';
            if (step.IsHumanStep) {
                txtConfig.text = Ext.String.format('{0}\n{1}\n{2}',
                    YZSoft.bpm.src.ux.Render.renderStepHandlerExt(step, true),
                    step.FinishAt,
                    YZSoft.HttpUtility.htmlEncode(step.SelActionDisplayString));
            }
            else {
                txtConfig.text = step.FinishAt;
            }
        }
        else {
            txtConfig.fillStyle = 'green';
            if (step.IsHumanStep) {
                txtConfig.text = Ext.String.format('{0}\n{1}\n{2}',
                        YZSoft.bpm.src.ux.Render.renderStepRecipientExt(step, false),
                        step.ReceiveAt,
                        RS.$('All_Running'));
            }
            else {
                txtConfig.text = Ext.String.format("{0}\n{1}", step.ReceiveAt,
                        RS.$('All_Wait'));
            }
        }

        sprite.runtimeInfo.text = me.createTextSprite(sprite, txtConfig);
        surfaces.text.add(sprite.runtimeInfo.text);
    },

    createHotSprite: function (sprite, config) {
        var me = this,
            bbox = sprite.getBBox(false);

        return Ext.create('Ext.draw.sprite.Rect', Ext.apply({
            isRuntimeHotBox: true,
            tagSprite: sprite,
            x: bbox.x - 4.5,
            y: bbox.y - 4.5,
            width: bbox.width + 8,
            height: bbox.height + 8,
            fillStyle: '#ffffcc',
            strokeStyle: '#00C000',
            lineWidth: 3
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
            translationY: 28,
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
    },

    isInstanceOf: function (sprite, step) {
        var runtimeNodeName = step.NodeNameOrg || step.NodeName, //加签步骤取NodeNameOrg
            node = sprite && sprite.property && sprite.property.data,
            id = sprite.getSpriteId();

        if (!node)
            return false;

        if (node.ElementTypeName == 'InformNode' && !step.Memo)
            return false;

        if (String.Equ(runtimeNodeName, id))
            return true;

        //层级审批带"\"号
        var index = runtimeNodeName.indexOf('\\');
        if (index != -1) {
            if (!step.IsHumanStep)
                return false;

            runtimeNodeName = runtimeNodeName.substring(0, index);
            if (String.Equ(runtimeNodeName, id, true))
                return true;
        }

        return false;
    }
});