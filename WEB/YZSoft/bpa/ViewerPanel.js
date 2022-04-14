
Ext.define('YZSoft.bpa.ViewerPanel', {
    extend: 'YZSoft.bpa.DesignerPanel',

    toolPanelConfig: {
        hidden: true
    },
    tabMainConfig: {
        hidden: true
    },
    tabbarMainConfig: {
        hidden: true
    },
    headerBarConfig: {
        hidden: true
    },
    btnCloseOnMDIHeaderConfig: {
        hidden: false
    },
    propertyPanelConfig: {
        pnlReportsConfig: {
            toolPanelConfig: {
                hidden: true
            },
            pnlDocumentConfig: {
                padding:'30 0 0 0',
                readOnly: true
            }
        },
        pnlSpriteFileConfig: {
            toolPanelConfig: {
                hidden: true
            },
            pnlDocumentConfig: {
                readOnly: true
            }
        }
    },
    CTRLSSave:false
});