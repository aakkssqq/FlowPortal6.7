
Ext.define('YZSoft.forms.field.Barcode', {
    extend: 'YZSoft.forms.field.Element',

    getEleTypeConfig: function () {
        var me = this,
            config = me.callParent(arguments);

        Ext.apply(config, {
            sDataBind: me.getDataBind(),
            Express: me.getExp(),
            HiddenExpress: me.getHiddenExp(),
            barcodeFormat: me.getAttribute('BarcodeFormat'),
            pureBarcode: me.getAttributeBool('PureBarcode')
        });

        return config;
    },

    getValue: function () {
        return this.value || '';
    },

    setValue: function (value) {
        var me = this,
            et = me.getEleType(),
            imgEl, url;

        me.value = value;

        imgEl = me.down('.yz-barcode-image', false);
        if (!imgEl)
            imgEl = Ext.dom.Helper.append(me.dom, '<img class="yz-barcode-image" />', true);

        if (value) {
            url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/util/Barcode.ashx'), Ext.Object.toQueryString({
                method: 'Encode',
                format: et.barcodeFormat,
                pureBarcode: et.pureBarcode,
                text: value,
                width: me.getWidth(),
                height: me.getHeight(true)
            }));
        }
        else {
            url = '';
        }

        imgEl.dom.src = url;
    }
});