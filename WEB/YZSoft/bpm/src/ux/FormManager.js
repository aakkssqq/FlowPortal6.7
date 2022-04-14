/*
dlgModel:dialog/window/tab
*/

Ext.define('YZSoft.bpm.src.ux.FormManager', {
    singleton: true,
    requires: [
        'YZSoft.src.ux.WindowManager'
    ],
    map: {
        OpenWindow: 'Window',
        IFrameDialog: 'Dialog',
        Tab: 'Tab'
    },

    parseType: function (sender, dlgtype, exttypes) {
        dlgtype = (dlgtype || '').replace(/;/g, ',');

        var me = this,
            types = dlgtype.split(','),
            rv = [],
            map;

        Ext.each(exttypes, function (type) {
            types.push(type);
        });

        Ext.each(types, function (type) {
            type = Ext.String.trim(type);

            if (!type)
                return;

            type = me.map.hasOwnProperty(type) ? me.map[type] : type;
            if (type == 'Tab' && (!sender || !YZSoft.ViewManager.getModuleTab(sender)))
                return;

            rv.push(type);
        });

        return rv;
    },

    getShowFormAPI: function (sender, dlgtype) {
        var me = this,
            types = this.parseType(sender, dlgtype, [$S.BPM.Form.WindowModel, 'Window']);

        for (var i = 0; i < types.length; i++) {
            var api = me.showFormTypes[types[i]];
            if (api)
                return api;
        }
    },

    getShowFormAppAPI: function (sender, dlgtype) {
        var me = this,
            types = this.parseType(sender, dlgtype, [$S.BPM.FormApplication.WindowModel, 'Dialog']);

        for (var i = 0; i < types.length; i++) {
            var api = me.showFormTypes[types[i]];
            if (api)
                return api;
        }
    },

    openWindow: function (sender, id, url, xclass, params, cfg) {
        cfg.popupblocked = RS.$('All_PopupBlockerFormWarn');
        YZSoft.src.ux.WindowManager.OpenWindow(id, url, params, cfg);
    },

    addAsTab: function (sender, id, url, xclass, params, cfg) {
        Ext.apply(cfg, {
            id: id,
            params: params,
            closable: true,
            border: false
        });

        //var form = Ext.create(xclass, cfg);

        //将窗口添加到顶层viewport
        /*
        form.on({
        close: function () {
        YZSoft.frame123.getLayout().prev();
        }
        });

        YZSoft.frame123.add(form);
        YZSoft.frame123.setActiveItem(form);
        */

        YZSoft.ViewManager.addView(sender, xclass, cfg)
    },

    openIFrameDialog: function (sender, id, url, xclass, params, cfg) {
        var me = this,
            cfg = cfg || {},
            panel,dlg;

        panel = Ext.create(xclass, {
            params: params,
            border: false,
            topmost: true,
            fireEventExt: function (eventName) {
                var args = Array.prototype.slice.call(arguments, 1);
                args.push(true);
                this.fireEventArgs(eventName, args);
            },
            listeners: cfg.listeners,
            close: function () {
                this.dlg.close();
            }
        });

        dlg = Ext.create('Ext.window.Window', Ext.apply({ //777777
            title: cfg.title,
            autoShow: true,
            layout: 'fit',
            items: [panel],
            width: cfg.width,
            height: cfg.height,
            bodyPadding: '0 10 10 10',
            maximizable:true,
            fn: function (data) {
            }
        }, cfg.window));

        panel.dlg = dlg;
    },

    openDraft: function (draftid, cfg) {
        cfg = cfg || {};

        var me = this,
            id = 'BPM_Draft_' + draftid,
            params = Ext.apply({ did: draftid }, cfg.params),
            api = me.getShowFormAPI(cfg.sender, cfg.dlgModel);

        cfg.title = cfg.title || Ext.String.format('{0} -{1}', RS.$('All_Draft'), cfg.processName);
        cfg.width = cfg.width || $S.BPM.Form.DlgSize.Width;
        cfg.height = cfg.height || $S.BPM.Form.DlgSize.Height;

        api(cfg.sender, id, YZSoft.$url('YZSoft/Forms/Post.aspx'), 'YZSoft.bpm.form.Post', params, cfg);
    },

    openPostWindow: function (processName, cfg) {
        cfg = cfg || {};

        var me = this,
            id = 'BPM_PostProcess_' + YZSoft.util.hex.encode(processName),
            params = Ext.apply({ pn: processName }, cfg.params),
            api = me.getShowFormAPI(cfg.sender, cfg.dlgModel);

        cfg.title = cfg.title || Ext.String.format('{0} - {1}', RS.$('All_StartProcess'), processName);
        cfg.width = cfg.width || $S.BPM.Form.DlgSize.Width;
        cfg.height = cfg.height || $S.BPM.Form.DlgSize.Height;

        api(cfg.sender, id, YZSoft.$url('YZSoft/Forms/Post.aspx'), 'YZSoft.bpm.form.Post', params, cfg);
    },

    openDelegationPostWindow: function (processName, cfg) {
        var me = this;

        YZSoft.SelMemberDlg.show({
            title: RS.$('All_DelegationPost_SelUser'),
            fn: function (user) {
                if (user == null)
                    return;

                cfg = cfg || {};

                var id = 'BPM_PostProcessDelegation_' + YZSoft.util.hex.encode(processName),
                    params = Ext.apply({ pn: processName, owner: user.MemberFullName }, cfg.params),
                    api = me.getShowFormAPI(cfg.sender, cfg.dlgModel);

                cfg.title = cfg.title || Ext.String.format('{0} - {1}', RS.$('All_StartProcess'), processName);
                cfg.width = cfg.width || $S.BPM.Form.DlgSize.Width;
                cfg.height = cfg.height || $S.BPM.Form.DlgSize.Height;

                api(cfg.sender, id, YZSoft.$url('YZSoft/Forms/Post.aspx'), 'YZSoft.bpm.form.Post', params, cfg);
            }
        });
    },

    openShareTask: function (stepid, cfg) {
        cfg = cfg || {};

        var me = this,
            id = 'BPM_Share_' + stepid,
            params = Ext.apply({ pid: stepid }, cfg.params),
            api = me.getShowFormAPI(cfg.sender, cfg.dlgModel);

        cfg.title = cfg.title || (cfg.sn ? cfg.sn : Ext.String.format(RS.$('All_Title_ShareTask'), stepid));
        cfg.width = cfg.width || $S.BPM.Form.DlgSize.Width;
        cfg.height = cfg.height || $S.BPM.Form.DlgSize.Height;

        api(cfg.sender, id, YZSoft.$url('YZSoft/Forms/Process.aspx'), 'YZSoft.bpm.form.Process', params, cfg);
    },

    openTaskForProcess: function (stepid, cfg) {
        cfg = cfg || {};

        var me = this,
            id = 'BPM_Process_' + stepid,
            params = Ext.apply({ pid: stepid }, cfg.params),
            api = me.getShowFormAPI(cfg.sender, cfg.dlgModel);

        cfg.title = cfg.title || (cfg.sn ? cfg.sn : Ext.String.format(RS.$('All_Title_TaskProcess'), stepid));
        cfg.width = cfg.width || $S.BPM.Form.DlgSize.Width;
        cfg.height = cfg.height || $S.BPM.Form.DlgSize.Height;

        api(cfg.sender, id, YZSoft.$url('YZSoft/Forms/Process.aspx'), 'YZSoft.bpm.form.Process', params, cfg);
    },

    openTaskForRead: function (taskid, cfg) {
        cfg = cfg || {};

        var me = this,
            id = 'BPM_ReadTask_' + taskid + ((cfg.params || {}).spn || ''),
            params = Ext.apply({ tid: taskid }, cfg.params),
            api = me.getShowFormAPI(cfg.sender, cfg.dlgModel);

        cfg.title = cfg.title || (cfg.sn ? cfg.sn : Ext.String.format(RS.$('All_Title_ReadTask'), taskid));
        cfg.width = cfg.width || $S.BPM.Form.DlgSize.Width;
        cfg.height = cfg.height || $S.BPM.Form.DlgSize.Height;

        api(cfg.sender, id, YZSoft.$url('YZSoft/Forms/Read.aspx'), 'YZSoft.bpm.form.Read', params, cfg);
    },

    openSnapshot: function (taskid, version, stepid, cfg) {
        cfg = cfg || {};
        stepid = stepid == -1 ? '' : stepid;

        var me = this,
            id = 'BPM_Snapshot_' + taskid + '_' + version + '_' + stepid,
            params = Ext.apply({ tid: taskid, ver: version }, cfg.params),
            api = me.getShowFormAPI(cfg.sender, cfg.dlgModel),
            url = Ext.isEmpty(stepid) ? 'YZSoft/Forms/Read.aspx' : 'YZSoft/Forms/Process.aspx',
            xclass = Ext.isEmpty(stepid) ? 'YZSoft.bpm.form.Read' : 'YZSoft.bpm.form.Process';

        if (!Ext.isEmpty(stepid))
            params.pid = stepid;

        cfg.title = cfg.title || Ext.String.format(RS.$('All_Snapshot_Title'), version);
        cfg.width = cfg.width || $S.BPM.Form.DlgSize.Width;
        cfg.height = cfg.height || $S.BPM.Form.DlgSize.Height;

        api(cfg.sender, id, YZSoft.$url(url), xclass, params, cfg);
    },

    openFormApplication: function (appName, key, formState, cfg) {
        cfg = cfg || {};

        var me = this,
            id = 'FormApplication_' + YZSoft.util.hex.encode(appName) + '_key_' + YZSoft.util.hex.encode(key),
            params = Ext.apply({ md: 'App', app: appName, key: key, formstate: formState }, cfg.params),
            api = me.getShowFormAppAPI(cfg.sender, cfg.dlgModel);

        cfg.title = cfg.title || (appName + '-' + (Ext.isEmpty(key) ? RS.$('All_FormApp_New') : key));
        cfg.width = cfg.width || $S.BPM.FormApplication.DlgSize.Width;
        cfg.height = cfg.height || $S.BPM.FormApplication.DlgSize.Height;

        api(cfg.sender, id, YZSoft.$url('YZSoft/Forms/FormApplication.aspx'), 'YZSoft.bpm.form.FormApplication', params, cfg);
    }

}, function () {
    this.showFormTypes = {
        Window: this.openWindow,
        Tab: YZSoft.os.isMobile ? this.openWindow : this.addAsTab,
        Dialog: this.openIFrameDialog
    }
});
