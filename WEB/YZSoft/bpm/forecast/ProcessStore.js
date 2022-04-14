
Ext.define('YZSoft.bpm.forecast.ProcessStore', {
    extend: 'Ext.data.Store', 
    remoteSort: false,
    model: 'Ext.data.Model',
    proxy: {
        type: 'ajax',
        url: YZSoft.$url('YZSoft.Services.REST/BPM/Task.ashx'),
        extraParams: {
            Method: 'GetProcessForecastSteps',
            processName: null,
            version: null,
            owner:null
        },
        reader: {
            rootProperty: 'children'
        }
    }
});