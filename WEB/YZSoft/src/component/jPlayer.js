//if (typeof (SWFUpload) == 'undefined')
Ext.Loader.loadScript({ url: YZSoft.$url('YZSoft/src/jQuery/jPlayer/skin/blue.monday/css/jplayer.blue.monday.min.css') });
//Ext.Loader.loadScript({ url: YZSoft.$url('YZSoft/src/jQuery/jPlayer/skin/pink.flag/css/jplayer.pink.flag.min.css') });
Ext.Loader.loadScript({ url: YZSoft.$url('YZSoft/src/jQuery/jquery.min.js') });
Ext.Loader.loadScript({ url: YZSoft.$url('YZSoft/src/jQuery/jPlayer/jquery.jplayer.min.js') });

/*
config:
jplayerConfig

events:
ready
play
abort
ended

examples:
me.cmp1 = Ext.create('YZSoft.src.component.jPlayer', {
    region: 'north',
    listeners: {
        ready: function () {
            this.setMedia({
                title: 'Bubble',
                m4a: "http://jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
                oga: "http://jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
            });
        }
    }
});
me.cmp2 = Ext.create('YZSoft.src.component.jPlayer', {
    region: 'north',
    cls: 'yz-jplayer-onsite',
    listeners: {
        ready: function () {
            this.setMedia({
                title: 'Bubble',
                m4a: "http://jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
                oga: "http://jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
            });
        }
    }
});
*/

Ext.define('YZSoft.src.component.jPlayer', {
    extend: 'Ext.Component',
    renderTpl: new Ext.XTemplate(
        '<tpl for=".">',
        '<div class="jp-jplayer"></div>',
        '<div class="jp-audio" id="{audioid}" role="application" aria-label="media player">',
	        '<div class="jp-type-single">',
		        '<div class="jp-gui jp-interface">',
			        '<div class="jp-controls">',
				        '<button class="jp-play" role="button" tabindex="0">play</button>',
				        '<button class="jp-stop" role="button" tabindex="0">stop</button>',
			        '</div>',
			        '<div class="jp-progress">',
				        '<div class="jp-seek-bar">',
					        '<div class="jp-play-bar"></div>',
				        '</div>',
			        '</div>',
			        '<div class="jp-volume-controls">',
				        '<button class="jp-mute" role="button" tabindex="0">mute</button>',
				        '<button class="jp-volume-max" role="button" tabindex="0">max volume</button>',
				        '<div class="jp-volume-bar">',
					        '<div class="jp-volume-bar-value"></div>',
				        '</div>',
			        '</div>',
			        '<div class="jp-time-holder">',
				        '<div class="jp-current-time" role="timer" aria-label="time">&nbsp;</div>',
				        '<div class="jp-duration" role="timer" aria-label="duration">&nbsp;</div>',
				        '<div class="jp-toggles">',
					        '<button class="jp-repeat" role="button" tabindex="0">repeat</button>',
				        '</div>',
			        '</div>',
		        '</div>',
		        '<div class="jp-details">',
			        '<div class="jp-title" aria-label="title">&nbsp;</div>',
		        '</div>',
		        '<div class="jp-no-solution">',
			        '<span>Update Required</span>',
			        'To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.',
		        '</div>',
	        '</div>',
        '</div>',
        '</tpl>'
    ),
    data: {
    },

    initRenderData: function () {
        return Ext.apply(this.callParent(), {
            audioid: this.getId() + '-audio'
        });
    },

    constructor: function (config) {
        var me = this;

        var cfg = {
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (me.rendered) {
            me.onAfterRender();
        }
        else {
            me.on({
                scope: me,
                single: true,
                afterrender: 'onAfterRender'
            });
        }
    },

    onAfterRender: function () {
        var me = this,
            elJplayer = me.elJplayer = me.getEl().down('.jp-jplayer', false),
            elAudio = me.elAudio = me.getEl().down('.jp-audio', false);

        $(elJplayer.dom).jPlayer(Ext.apply({
            ready: function (event) {
                me.fireEvent('ready', this);
            },
            abort: function (event) {
                me.fireEvent('abort', this);
            },
            ended: function (event) {
                me.fireEvent('ended', this);
            },
            play: function (event) {
                me.fireEvent('play', this);
            },
            cssSelectorAncestor: '#' + me.elAudio.getId(),
            swfPath: YZSoft.$url('YZSoft/src/jQuery/jPlayer'),
            supplied: 'm4a, oga',
            wmode: 'window',
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true
        }, me.jplayerConfig));
    },

    /*
    {
    title: 'Bubble',
    m4a: "http://jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
    oga: "http://jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
    }
    */
    setMedia: function (config) {
        var me = this;
        $(me.elJplayer.dom).jPlayer("setMedia", config);
    },

    play: function () {
        $(this.elJplayer.dom).jPlayer('play');
    },

    pauseOthers: function () {
        $(this.elJplayer.dom).jPlayer('pauseOthers');
    }
});