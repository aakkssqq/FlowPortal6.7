
Ext.define('YZSoft.bpm.forecast.TaskStore', {
    extend: 'Ext.data.Store',
    remoteSort: false,
    model: 'Ext.data.Model',
    proxy: {
        type: 'ajax',
        url: YZSoft.$url('YZSoft.Services.REST/BPM/Task.ashx'),
        extraParams: {
            Method: 'GetTaskForecastSteps',
            TaskID: null
        },
        reader: {
            rootProperty: 'children'
        }
    }
});