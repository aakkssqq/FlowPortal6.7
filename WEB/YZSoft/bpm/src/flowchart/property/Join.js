/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.Join', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog: {
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.Join'
    },
    staticData: {
        ElementTypeName: 'JoinNode'
    },
    defaultData: {
        JoinType: 'Normal'
    },

    getLinkCfg: function () {
      return {
          configVote: this.data.JoinType == 'Vote'
        };
    }
});