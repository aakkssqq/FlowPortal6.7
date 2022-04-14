
Ext.define('YZSoft.src.view.SupervisorView', {
    extend: 'Ext.view.View',
    emptyText: Ext.String.format('<span style="color:#999">{0}</span>',RS.$('All_NotSet')),
    trackOver: true,
    overItemCls: 'yz-dataview-item-over',
    itemSelector: 'div.yz-dataview-item',
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">',
            '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-supervisor">',
                '<div class="imgwrap">',
                    '<img class="headshort" src="{Account:this.renderUrl}"/>',
                '</div>',
                '<div class="username"><span class="yz-s-uid" uid="{Account:text}" tip-align="t50-b50">{Title:text}</span></div>',
            '</div>',
        '</tpl>',
        {
            renderUrl: function (value) {
                var url = YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'),
                    params = {
                        Method: 'GetHeadshot',
                        account: value,
                        thumbnail: 'L',
                        _dc: +new Date()
                    };

                return Ext.String.urlAppend(url, Ext.Object.toQueryString(params));
            }
        }
    ),

    constructor: function (config) {
        var me = this;

        var cfg = {
            store: Ext.create('Ext.data.Store', {
                model: 'Ext.data.Model'
            })
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    prepareData: function (data, recordIndex, record) {
        if (data.FGYWEnabled && data.FGYWs.length != 0)
            data.Title = Ext.String.format("{0}({1})", data.UserName, data.FGYWs.join(';'));
        else
            data.Title = data.UserName;

        return this.callParent(arguments);
    }
});