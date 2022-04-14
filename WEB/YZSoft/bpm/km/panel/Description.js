
Ext.define('YZSoft.bpm.km.panel.Description', {
    extend: 'Ext.panel.Panel',
    cls: 'yz-pnl-bpakm',
    ui:'light',
    header: {
        cls:'yz-header-bpakm'
    },

    setData: function (desc) {
        this.setHtml(Ext.util.Format.text(desc));
    }
});