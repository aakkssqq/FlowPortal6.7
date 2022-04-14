
Ext.define('YZSoft.src.progress.CircleProgressMask', {
    extend: 'Ext.LoadMask',
    xtype: 'circleprogressmask',
    referenceHolder: true,
    extraCls: 'yz-cic-mask-normal',

    childEls: [
        'msgWrapEl',
        'msgEl',
        'indicatorBg',
        'msgTextEl',
        'spinerHolderOne025',
        'spinerHolderTwo025',
        'spinerHolderOne2550',
        'spinerHolderTwo2550',
        'spinerHolderOne5075',
        'spinerHolderTwo5075',
        'spinerHolderOne75100',
        'spinerHolderTwo75100',
        'spiner1',
        'spiner2',
        'spiner3',
        'spiner4'
    ],

    renderTpl: [
        '<div id="{id}-msgWrapEl" data-ref="msgWrapEl" class="{[values.$comp.msgWrapCls]} yz-cic-mask-bg">',
        '<div id="{id}-msgEl" data-ref="msgEl" role="{role}" class="yz-cic-loader-inner" style="width:{circleWidth}px;height:{circleHeight}px;">',
            '<div id="{id}-indicatorBg" data-ref="indicatorBg" class="yz-cic-loader-bg" style="border-width:{borderWidth}px">',
                '<div id="{id}-msgTextEl" data-ref="msgTextEl" class="yz-cic-loader-message">{msg}</div>',
            '</div>',
            '<div id="{id}-spinerHolderOne025" data-ref="spinerHolderOne025" class="yz-cic-loader-spiner-holder-one yz-cic-loader-animate-0-25-a">',
                '<div id="{id}-spinerHolderTwo025" data-ref="spinerHolderTwo025" class="yz-cic-loader-spiner-holder-two yz-cic-loader-animate-0-25-b">',
                    '<div id="{id}-spiner1" data-ref="spiner1" class="yz-cic-loader-loader-spiner" style="border-width:{borderWidth}px"></div>',
                '</div>',
            '</div>',
            '<div id="{id}-spinerHolderOne2550" data-ref="spinerHolderOne2550" class="yz-cic-loader-spiner-holder-one yz-cic-loader-animate-25-50-a">',
                '<div id="{id}-spinerHolderTwo2550" data-ref="spinerHolderTwo2550" class="yz-cic-loader-spiner-holder-two yz-cic-loader-animate-25-50-b">',
                    '<div id="{id}-spiner2" data-ref="spiner2" class="yz-cic-loader-loader-spiner" style="border-width:{borderWidth}px"></div>',
                '</div>',
            '</div>',
            '<div id="{id}-spinerHolderOne5075" data-ref="spinerHolderOne5075" class="yz-cic-loader-spiner-holder-one yz-cic-loader-animate-50-75-a">',
                '<div id="{id}-spinerHolderTwo5075" data-ref="spinerHolderTwo5075" class="yz-cic-loader-spiner-holder-two yz-cic-loader-animate-50-75-b">',
                    '<div id="{id}-spiner3" data-ref="spiner3" class="yz-cic-loader-loader-spiner" style="border-width:{borderWidth}px"></div>',
                '</div>',
            '</div>',
            '<div id="{id}-spinerHolderOne75100" data-ref="spinerHolderOne75100" class="yz-cic-loader-spiner-holder-one yz-cic-loader-animate-75-100-a">',
                '<div id="{id}-spinerHolderTwo75100" data-ref="spinerHolderTwo75100" class="yz-cic-loader-spiner-holder-two yz-cic-loader-animate-75-100-b">',
                    '<div id="{id}-spiner4" data-ref="spiner4" class="yz-cic-loader-loader-spiner" style="border-width:{borderWidth}px"></div>',
                '</div>',
            '</div>',
        '</div>',
        '</div>'
     ],

    config: {
        borderWidth: 5,
        circleWidth: 50,
        circleHeight: 50
    },

    constructor: function (config) {
        //if (config.extraCls)
        config.cls = [config.cls || this.cls, config.extraCls || this.extraCls];
        this.callParent([config]);

        this.setProgress(0);
    },

    initRenderData: function () {
        var result = this.callParent(arguments);

        result.borderWidth = this.borderWidth;
        result.circleWidth = this.circleWidth;
        result.circleHeight = this.circleHeight;
        return result;
    },

    setProgress: function (progress) {
        var transformPropertyName = Ext.browser.getVendorProperyName('transform');
        progress = Math.floor(progress);

        if (progress < 25) {
            var angle = -90 + (progress / 100) * 360;
            this.spinerHolderTwo025.dom.style[transformPropertyName] = 'rotate(' + angle + 'deg)';
        }
        else if (progress >= 25 && progress < 50) {
            var angle = -90 + ((progress - 25) / 100) * 360;
            this.spinerHolderTwo025.dom.style[transformPropertyName] = 'rotate(0deg)';
            this.spinerHolderTwo2550.dom.style[transformPropertyName] = 'rotate(' + angle + 'deg)';
        }
        else if (progress >= 50 && progress < 75) {
            var angle = -90 + ((progress - 50) / 100) * 360;
            this.spinerHolderTwo025.dom.style[transformPropertyName] = 'rotate(0deg)';
            this.spinerHolderTwo2550.dom.style[transformPropertyName] = 'rotate(0deg)';
            this.spinerHolderTwo5075.dom.style[transformPropertyName] = 'rotate(' + angle + 'deg)';
        }
        else if (progress >= 75 && progress <= 100) {
            var angle = -90 + ((progress - 75) / 100) * 360;
            this.spinerHolderTwo025.dom.style[transformPropertyName] = 'rotate(0deg)';
            this.spinerHolderTwo2550.dom.style[transformPropertyName] = 'rotate(0deg)';
            this.spinerHolderTwo5075.dom.style[transformPropertyName] = 'rotate(0deg)';
            this.spinerHolderTwo75100.dom.style[transformPropertyName] = 'rotate(' + angle + 'deg)';
        }

        this.msg = progress + '%';
        this.msgTextEl.setHtml(this.msg);
    }
});