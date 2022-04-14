
Ext.define('YZSoft.src.media.VideoPlayer', {
    extend: 'YZSoft.src.media.Abstract',
    requires: [
        'YZSoft.src.util.Image'
    ],
    fn: null,
    config: {
        posterUrl: null,
        posterImage: null,
        baseCls: 'yz-video'
    },
    cls: ['yz-video'],

    template: [{
        reference: 'ghost',
        classList: ['yz-video-ghost']
    }, {
        tag: 'video',
        reference: 'media',
        'webkit-playsinline': '',
        playsinline: '',
        classList: ['yz-video-video']
    }, {
        tag: 'div',
        reference: 'close',
        classList: ['yz-video-close']
    }, {
        tag: 'div',
        reference: 'loadmask',
        classList: ['yz-video-loadmask']
    }, {
        tag: 'div',
        reference: 'bigplay',
        classList: ['yz-video-bigplay']
    }, {
        tag: 'div',
        reference: 'controls',
        classList: ['yz-video-controls'],
        children: [{
            tag: 'div',
            reference: 'smallplay',
            classList: ['yz-video-smallplay']
        }, {
            tag: 'div',
            reference: 'curtime',
            classList: ['yz-video-curtime']
        }, {
            tag: 'div',
            reference: 'progressWrap',
            classList: ['yz-video-progress'],
            children: [{
                tag: 'div',
                reference: 'progressBar',
                classList: ['yz-video-progress-bar'],
                children: [{
                    tag: 'div',
                    reference: 'progressPos',
                    classList: ['yz-video-progress-pos'],
                    children: [{
                        tag: 'div',
                        reference: 'thumb',
                        classList: ['yz-video-progress-thumb']
                    }]
                }]
            }]
        }, {
            tag: 'div',
            reference: 'duration',
            classList: ['yz-video-duration']
        }]
    }],

    initElement: function () {
        var me = this,
            posterImage = me.getPosterImage();

        me.callParent();

        me.addCls('yz-video');

        me.media.set({
            controls: undefined
        });

        me.media.hide();

        me.bigplay.on({
            click: function () {
                if (!me.isPlaying())
                    me.play();
            }
        });

        me.smallplay.on({
            click: function () {
                if (me.isPlaying()) {
                    me.pause();
                } else {
                    me.play();
                }
            }
        });

        me.close.on({
            click: function (e) {
                if (me.config.fn)
                    me.config.fn.call(me.config.scope, me);
            }
        });

        me.ghost.on({
            click: function (e) {
                if (me.config.fn)
                    me.config.fn.call(me.config.scope, me);
            }
        });

        me.media.on({
            scope: me,
            pause: 'onPause',
            click: 'onMaskTap'
        });

        me.addMediaListener({
            playing: 'onPlaying',
            waiting: 'onWaiting'
        });

        me.duration.setHtml('00:00');
        me.curtime.setHtml('00:00');

        me.thumb.on({
            scope: me,
            dragstart: 'onThumbDragStart',
            drag: 'onThumbDrag',
            dragend: 'onThumbDragEnd'
        });

        if (posterImage) {
            YZSoft.src.util.Image.image2base64(posterImage, function (base64) {
                me.ghost.setStyle('background-image', 'url(' + base64 + ')');
                me.play();
            });
        }
        else {
            me.play();
        }
    },

    updateEnableControls: function (enableControls) {
    },

    onThumbDragStart: function (e, thumb) {
        var me = this,
            duration = me.durationSec;

        if (!duration || e.absDeltaX <= e.absDeltaY) {
            return false;
        }
        else {
            e.stopPropagation();
        }

        me.pause();
        me.dragStartValue = me.progressPos.getWidth();
        me.dragTotalWidth = me.progressBar.getWidth();
        me.draging = true;
    },

    onThumbDrag: function (e, thumb) {
        var me = this,
            deltaX = e.deltaX,
            totalWidth = me.dragTotalWidth,
            curValue = Ext.Number.constrain(me.dragStartValue + deltaX, 0, totalWidth),
            per = curValue / totalWidth;

        e.stopPropagation();

        me.progressPos.setStyle('width', per * 100 + '%');
        me.setCurrentTime(per * me.durationSec);
    },

    onThumbDragEnd: function (thumb, e) {
        this.draging = false;
        this.play();
    },

    formatMediaDuration: function (value) {
        var m = Math.floor(value / 60),
            s = Math.floor(value % 60);

        return Ext.String.format('{0}:{1}', Ext.String.leftPad(m, 2, '0'), Ext.String.leftPad(s, 2, '0'));
    },

    applyUrl: function (url) {
        return [].concat(url);
    },

    updateUrl: function (newUrl) {
        var me = this,
            media = me.media,
            newLn = newUrl.length,
            existingSources = media.query('source'),
            oldLn = existingSources.length,
            i;

        for (i = 0; i < oldLn; i++) {
            Ext.fly(existingSources[i]).destroy();
        }

        for (i = 0; i < newLn; i++) {
            media.appendChild(Ext.Element.create({
                tag: 'source',
                src: newUrl[i]
            }));
        }

        if (me.isPlaying()) {
            me.play();
        }
    },

    updatePosterUrl: function (newUrl) {
        var me = this,
            ghost = this.ghost;

        if (ghost) {
            ghost.setStyle('background-image', 'url(' + newUrl + ')');
        }
    },

    updateProgress: function () {
        var me = this,
            duration = me.durationSec = me.getDuration(),
            duration = Math.max(me.durationSec, 1),
            time = me.getCurrentTime();

        me.progressPos.setStyle('width', (time / duration) * 100 + '%');
    },

    onPlay: function () {
        var me = this,
            cls = 'yz-video-showoptions';

        me.callParent(arguments);

        me.removeCls(cls);
        if (me.timerOpt) {
            clearTimeout(me.timerOpt);
            delete me.timerOpt;
        }

        me.addCls('yz-video-playing');
        me.curtime.setHtml('00:00');
    },

    onCanPlay: function () {
        var me = this,
            duration = me.durationSec = me.getDuration();

        me.callParent(arguments);

        me.addCls('yz-video-canplay');
        me.media.show();
        me.ghost.hide();
        me.duration.setHtml(me.formatMediaDuration(duration));
    },

    onPlaying: function () {
        var me = this;

        me.removeCls('yz-video-waiting');

        me.timer = setInterval(function () {
            me.updateProgress()
        }, 10);
    },

    onTimeUpdate: function () {
        var me = this,
            duration = Math.max(me.durationSec, 1),
            time = me.getCurrentTime();

        me.callParent(arguments);
        me.curtime.setHtml(me.formatMediaDuration(time));
        if (!me.draging)
            me.progressPos.setStyle('width', (time / duration) * 100 + '%');
    },

    onPause: function () {
        var me = this;

        me.callParent(arguments);
        me.removeCls('yz-video-waiting')
        me.removeCls('yz-video-playing')

        if (me.timer) {
            clearInterval(me.timer);
            delete me.timer;
        }
    },

    onEnd: function () {
        var me = this;

        me.addCls('yz-video-showoptions');
        me.callParent(arguments);
    },

    onWaiting: function () {
        var me = this;

        me.addCls('yz-video-waiting');
    },

    onMaskTap: function () {
        var me = this,
            cls = 'yz-video-showoptions';

        if (me.el.hasCls(cls)) {
            if (me.timerOpt) {
                clearTimeout(me.timerOpt);
                delete me.timerOpt;
            }
            me.removeCls(cls);
        }
        else {
            me.addCls(cls);
            me.timerOpt = Ext.defer(function () {
                if (me.isPlaying()) {
                    if (me.timerOpt) {
                        me.removeCls(cls);
                        delete me.timerOpt;
                    }
                }
            }, 4000);
        }
    },

    destroy: function () {
        var me = this;

        me.stop();
        if (me.timer) {
            clearInterval(me.timer);
            delete me.timer;
        }

        if (me.timerOpt) {
            clearTimeout(me.timerOpt);
            delete me.timerOpt;
        }

        me.callParent(arguments);
    }
});