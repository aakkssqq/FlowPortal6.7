Ext.define('YZSoft.bpm.src.model.Step', {
    extend: 'Ext.data.Model',
    idProperty: 'StepID',
    fields: [
        {name:'StepID'},
        {name:'NodeName'},
        {name:'NodeDisplayName'},
        {name:'SelAction'},
        {name:'OwnerAccount'},
        {name:'OwnerDisplayName'},
        {name:'AgentAccount'},
        {name:'AgentDisplayName'},
        {name:'HandlerAccount'},
        {name:'HandlerDisplayName'},
        {name:'ReceiveAt'},
        {name:'FinishAt'},
        {name:'AutoProcess'},
        {name:'Comments'},
        {name:'Share'},
        {name:'Finished',defaultValue:false}
    ]
});
