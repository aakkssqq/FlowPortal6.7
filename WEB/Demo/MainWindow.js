
Ext.application({
    name: 'FlowPortal',
    template: new Ext.Template(
        '<div class="logo"></div>',
	        '<div class="site_switch">',
	            '<strong class="switch">{companyName}</strong>',
	            '<div>',
                    [
                    '<a target="BPM" href="?StartApp=BPM">{BPMExecutePortal}</a>',
                    '<a target="EnterpriseManager" href="?StartApp=EnterpriseManager">{enterpriseManagerPortal}</a>'
                    ].join('|'),
	            '</div>',
	        '</div>',
	        '<div class="login_info">',
	            [
                '<strong>{welcome}</strong>',
	            '<a href="#">{help}</a>',
	            '<a href="javascript:YZSoft.logout()">{logout}</a>',
	            '<a class="yz_banner_lang">{language}<span></span></a>'
                ].join('|'),
	        '</div>',
	    '<div class="btm"></div>'
    ),
    data: {
        companyName: userInfo.CompanyName,
        welcome: Ext.String.format(RS.$('All_Welcome'), YZSoft.HttpUtility.htmlEncode(YZSoft.Render.getUserDisplayName(userInfo.Account, userInfo.DisplayName))),
        logout: RS.$('All_Logout'),
        help: RS.$('All_Help'),
        apps: RS.$('All_AppSamples'),
        BPMExecutePortal: RS.$('All_BPMExecutePortal'),
        enterpriseManagerPortal: RS.$('All_EnterpriseManagerPortal'),
        language: RS.$('All_Languages_Cur')
    },

    launch: function () {
        var me = this,
            url = Ext.String.format('{0}/Main.ashx', YZSoft.startApp);

        Ext.Ajax.request({
            method: 'GET',
            disableCaching: true,
            url: url,
            params: {
                method: 'GetModuleTree'
            },
            success: function (response) {
                var result = Ext.decode(response.responseText),
                    modules = result;

                if (result.success === false) {
                    result.errorMessage = Ext.String.htmlDecode(result.errorMessage);
                    YZSoft.alert(result.errorMessage);
                    return;
                }

                var mds = [];
                Ext.each(modules, function (module) {
                    var md;

                    if (module.ment) //维护中的模块
                        md = Ext.create('YZSoft.src.panel.MaintPanel', { title: module.title, message: module.ment, url: module.url });
                    else
                        md = Ext.create(module.xclass || 'YZSoft.src.frame.ClassicModule', module);

                    mds.push(md);
                });

                YZSoft.mainTab = Ext.create('YZSoft.src.tab.Main', {
                    activeTab: 0, //from 0
                    bannerHtml: me.template.apply(me.data),
                    region: 'center',
                    items: mds
                });

                YZSoft.mainTab.on({
                    single: true,
                    afterRender: function () {
                        var elLang = me.elLang = YZSoft.mainTab.getEl().down('.yz_banner_lang');
                        if (elLang) {
                            elLang.on({
                                scope: me,
                                click: 'onLangClick'
                            })
                        }
                    }
                });

                YZSoft.frame = Ext.create('Ext.container.Viewport', {
                    layout: 'card',
                    cls: 'yz-classic',
                    items: [YZSoft.mainTab]
                });
            },
            failure: function (response) {
                YZSoft.alert(Ext.String.format(RS.$('All_LoadModuleFailed_Msg'), url, response.status == 404 ? response.statusText : (response.responseText || '')));
            }
        });
    },

    onLangClick: function () {
        var me = this,
            el = me.elLang,
            picker;

        picker = Ext.create('YZSoft.src.menu.LangPicker', {
        });

        picker.showBy(el, 'tr-br');
    }
});