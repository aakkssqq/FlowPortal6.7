Ext.define('YZSoft.bpm.src.flowchart.sprite.Condition', {
    extend: 'YZSoft.bpm.src.flowchart.sprite.Sprite',
    src: 'images/condition.png',

    setName: function (newName, render) {
        this.Name = newName;
    },

    onPropertyChanged: function (data) {
        this.setSpriteText(data.ExpressMean, true);
    }
});
