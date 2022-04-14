/*
config
sprite
*/
Ext.define('YZSoft.bpm.src.flowchart.property.Property', {
    mixins: ['Ext.mixin.Observable'],
    requires: ['YZSoft.bpm.src.flowchart.property.Defaultes'],

    constructor: function (config) {
        var me = this;

        me.data = Ext.apply(Ext.clone(me.defaultData) || {}, config.data);
        me.data = Ext.apply(me.data, me.staticData);
        me.data = Ext.apply(me.data, config.staticData);
        delete config.data;

        me.mixins.observable.constructor.call(me, config);
        me.callParent([config]);

        me.fireEvent('propertyChanged', me.data);

        config.sprite.on({
            scope: me,
            propertyMenuClicked: 'showProperty'
        });
    },

    saveData: function (data) {
        return Ext.apply(this.data, data);
    },

    showProperty: function () {
        var me = this,
            cfg = Ext.clone(me.dialog);

        me.fireEvent('beforeShowNodeProperty', me.sprite, me);
        me.sprite.fireEvent('beforeShowNodeProperty', me.sprite, me);
        me.sprite.getSurface().drawContainer.fireEvent('beforeShowNodeProperty', me.sprite, me);

        cfg = Ext.apply(cfg, {
            autoShow: true,
            data: me.data,
            property: me,
            fn: function (data) {
                var dcnt = me.sprite.getSurface().drawContainer;

                me.sprite.getSurface().drawContainer.fireEvent('beforeNodePropertyChange', me.sprite, me);
                me.data = me.saveData(data) || me.data;

                if (dcnt.showExtension)
                    me.sprite.setDirty(true);

                me.fireEvent('propertyChanged', me.data);
                me.sprite.fireEvent('propertyChanged', me.data);
                dcnt.fireEvent('nodePropertyChanged', me.sprite, me);
            }
        });

        Ext.create(me.dialog.xclass, cfg);
    }
});