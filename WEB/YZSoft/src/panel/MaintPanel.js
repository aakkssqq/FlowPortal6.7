/*
*   @config
*   url : url of iframe
*   message : display message in body
*   title : null - no title
*   
*   @example
*   Ext.create('YZSoft.src.panel.MaintPanel', {
*       message: '系统建设中...'
*     });
*
*   Ext.create('YZSoft.src.panel.MaintPanel', {
*       url: 'YZSoft/Maintenance/Module.aspx',
*       message: '系统建设中...'
*     });
*/

Ext.define('YZSoft.src.panel.MaintPanel', {
    extend: 'YZSoft.src.panel.IFramePanel',
    url: YZSoft.$url('YZSoft/core/Maintenance/Module.aspx'),
    autoReload:false,
    border: false,

    constructor: function (config) {
        config.params = config.params || {};
        config.params.message = YZSoft.HttpUtility.htmlEncode(config.message);

        this.callParent([config]);
    }
});