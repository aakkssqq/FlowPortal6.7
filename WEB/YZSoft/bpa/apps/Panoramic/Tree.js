Ext.define('YZSoft.bpa.apps.Panoramic.Tree', {
    extend: 'YZSoft.src.chart.Tree',
    spriteConfig: {
        Lib:{
        },
        Strategic: {
            //fillStyle: 'rgba(34,198,239,0.25)'
        },
        Operation: {
            //fillStyle: 'green'
        },
        Support: {
            //fillStyle: 'blue'
        }
    },

    getSpriteDefaultConfig: function (rec) {
        return this.spriteConfig[rec.data.type];
    }
});