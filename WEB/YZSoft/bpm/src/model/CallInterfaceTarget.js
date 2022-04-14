Ext.define('YZSoft.bpm.src.model.CallInterfaceTarget', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'ElementType' },
        { name: 'SParam1' },
        { name: 'InterfaceName' }
    ],

    inheritableStatics: {
        equFn: function (data1, data2) {
            return data1.ElementType == data2.ElementType && data1.SParam1 == data2.SParam1;
        }
    }
});