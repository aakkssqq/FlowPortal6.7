
Ext.USE_NATIVE_JSON = false;

var YZSoft = YZSoft || {};

Ext.apply(YZSoft,{
    version: '1.0.0',
    versionDetail: {
        major: 1,
        minor: 0,
        patch: 0
    },
    modules: {
        BPA: true
    }
});

var _alert = window.alert;
window.alert = function (message) {
    _alert(Ext.htmlDecode(message));
} 
//String.format = Ext.String.format;

YZSoft.trimRightRegex = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
String.prototype.trimRight = function () {
    if (string) {
        string = string.replace(YZSoft.trimRightRegex, '');
    }
    return string || '';
};

Number.prototype.toFixedSaved = Number.prototype.toFixed;
Number.prototype.toFixed = function (column) {
    column = column || 0;
    var pow = Math.pow(10, column);
    return (Math.round(this * pow) / pow).toFixedSaved(column);
};

YZSoft.Debug = function (v) {
}

YZSoft.clipboard = {};

YZModules = {};

//Ext.useShims = Ext.useShims || Ext.isIE; style null错误

Ext.apply(YZSoft, {
    os: {
        isMobile: Ext.os.is.iOS || Ext.os.is.Android
    }
});

$S = YZSoft.EnvSetting = {
    dlgAnimate: false,
    timeout: {
        loadReportData: 180000,
        formAction: 3000
    },
    navigater: {
        width: 200,
        width_tabnavleft: 170
    },
    form:{
        collapseCommentsPanel:true
    },
    loadMask: {
        start: 200,
        stay: 300,
        starts: {
            x: 200,
            xx: 200,
            xxx: 200
        },
        stays: {
            x: 200,
            xx: 500,
            xxx: 800,
            taskopt: 500,
            taskoptquick:300
        },
        first: {
            loadMask: {
                start: 200,
                stay: 300
            }
        },
        activate: {
            loadMask: false
        }
    },
    ajax: {
        start: 200,
        stay: 300,
        starts: {
            x: 200,
            xx: 200,
            xxx: 200
        },
        stays: {
            x: 200,
            xx: 500,
            xxx: 800
        }
    },
    msgTextArea: {
        growMin: 80,
        growMax: 160
    },
    pageSize: {
        defaultSize: 20,
        BPM: {
            drafts: 20,
            historyMyPosted: 20,
            historyMyProcessed: 20,
            historyAllAccessable: 20,
            myTask: 20,
            shareTask: 20
        },
        BPMAdmin: {
            onlineUsers: 20,
            systemUsers: 20,
            processUsage: 20,
            stepHandlingTime: 20,
            userHandlingTime: 20,
            handlingTimeDetail: 20,
            stepTimeout: 20,
            userTimeout: 20,
            timeoutDetail: 20,
            appLog: 20
        },
        xform: {
            databrowser: 10
        }
    },
    BPM: {
        TaskTrace: {
            expandAnimate: true,
            collapseAnimate: true
        },
        Form: {
            WindowModel: 'Tab', //Window - 在新窗体中打开表单，Tab - 内容窗口中增加一个Tab，Dialog - 打开div + iframe窗体对话框，ModelessDialog - 无模式对话框，ModalDialog - 模式对话框
            DlgSize: {
                Width: 836,
                Height: 600
            }
        },
        FormApplication: {
            WindowModel: 'Tab', //Window - 在新窗体中打开表单，Tab - 内容窗口中增加一个Tab，Dialog - 打开div + iframe窗体对话框，ModelessDialog - 无模式对话框，ModalDialog - 模式对话框
            DlgSize: {
                Width: 836,
                Height: 600
            }
        },
        DataBrowserWnd: {
            DlgSize: {
                Width: 600,
                Height: 420
            }
        },
        Render: {
            TaskStateMergeStep: true
        }
    },
    Excel: {
        allowExportAll: false,
        maxExportPages: 100
    },
    IM: {
        delay: {
            sendMessage: 250
        }
    }
};

YZSoft.WellKnownSID = {
    Administrators : 'S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B',
    Everyone : 'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',
    EnterpriseManagerUsers : 'S_GS_D7DF3159-4621-4781-B558-9DDC65DA4253',
    OrganizationManagerUsers : 'S_GS_D3DF3828-25DC-464b-8CE6-55E0086DFAD3',
    SystemReportUsers : 'S_GS_4EE27F53-EF71-4732-A0F0-BFCBE888B3A9',
    SA: '9864A43A-876C-46e6-829B-A7223D8B6B76'
};

YZSoft.WellKnownRSID = {
    OrganizatonRoot: '1CCFE783-7FBF-4582-B2F3-CE11F57917E7',
    ProcessRoot: '7CBB72A3-1731-4212-8C5C-9C4E0C86FE31',
    FormRoot: '036F6F25-A004-4109-962F-AD9F0A8F516A',
    ExtServerRoot: '7F14F3D7-70F7-491b-BECB-4DFC6E8BBFD3',
    SecurityGroupRoot: '11ED19A5-89CC-4940-A40B-E53FF74B0C62',
    TimeSheetRoot: '6C2E89F5-6E5D-48c0-95B9-8E0A9B4DDB0B',
    TimeManagerRoot: '84DA1440-C927-4528-A249-4D49D32B01B8',
    ReportRoot: '45D14DE0-13F1-47de-80D5-CBE657BD39C9',
    SecurityResourceRoot: 'F8ADAB36-3C91-47b9-992A-67E198690843',
    FormApplicationRoot: '79A6D413-827D-4dfa-AEA3-4C64CA715975',
    ConnectionsRoot: '70218DA3-F7E1-4541-AEB8-B8D144582CB3',
    ESBFlowRoot: 'B5173DF3-F8F4-44E9-A1FF-9346750F2525',
    ESBDSFlowRoot: '0C74F142-99B1-43EA-A94A-8E6B2B958278',
    AdminWebSiteRoot: 'B278947A-2AD1-42b2-815D-D2CD25DCBC58',
    AdminWebSiteCurStatus: '4EF94F7D-97BA-423d-B73F-04572566E562',
    AdminWebSiteLog: '95BF78B1-BC9E-4c98-A2B7-787E8CCAA96F',
    AdminWebSiteSystemUsage: '5D68E69E-D256-43c1-834C-614DA97E9805',
    AdminWebSiteProcessPerformance: '007490A7-00B6-4d4c-A25A-732187317597',
    BPASiteRoot: 'EE5117DF-FCAF-4814-AD17-32497EB0092D',
    BPALibraryRoot: '19E802FB-605A-4BD6-B5D9-3501CE842966',
    BPADocumentRoot: 'CC94E14F-9702-469C-9FC6-16763700FE5A',
    BPAGroupRoot: '06DFA056-80E9-48E2-9C2A-ED34EB40A65D',
    BPAAdminRoot: '01EC8CE8-CCCC-4196-93B3-A598813902E4',
    BPAAdminTemplates: 'B52100EA-081B-483C-92D0-46AA00C3B025',
    BPAAdminGroup: '09C6D1E5-F9F9-4E51-AAA2-4DC2DC17F09D',
    BPAAdminSecurity: 'FE9BD49A-416D-4E67-9505-84CF6DFF353D',
    BPAHelp: 'DDE2A259-8702-4FA5-86B0-9EA73FA1B6C0',
    BPARecycleBin: '6B86A356-485B-4439-AE75-B5FC3A251775'
};

Ext.apply(YZSoft, {
    //resolve client url
    //obj - classname or object
    $url: function (obj, url) {
        if (arguments.length == 1)
            return YZSoft.$url('YZSoft', obj);

        var className = Ext.isString(obj) ? obj : Ext.getClassName(obj),
            classPath = Ext.Loader.getPath(className),
            index = classPath.lastIndexOf('/');

        var rv = index != -1 ? classPath.substring(0, index + 1) : '';
        return rv + url;
    },

    //将url转换为绝对路径
    getAbsoluteUrl: function (url) {
        var a = YZSoft.getAbsoluteUrlHyperlink = YZSoft.getAbsoluteUrlHyperlink || document.createElement('a');
        a.href = url;
        return a.href;
    },

    getAbsoluteRootUrl: function () {
        var url = YZSoft.getAbsoluteUrl(YZSoft.$url('YZSoft')),
            indexSlash = url.lastIndexOf("/"),
            rootUrl = url.substr(0, indexSlash) + "/";

        return rootUrl;
    },

    testExternal: function (reg, type) {
        var external = window.external || {};

        for (var i in external) {
            if (reg.test(type ? external[i] : i)) {
                return true;
            }
        }

        return false;
    },

    getChromiumType: function _getChromiumType() {
        var REG_APPLE = /^Apple/;

        if (Ext.isIE || typeof window.scrollMaxX !== 'undefined' || REG_APPLE.test(window.navigator.vendor || '')) {
            return '';
        }

        var _track = 'track' in document.createElement('track'),
            webstoreKeysLength = window.chrome && window.chrome.webstore ? Object.keys(window.chrome.webstore).length : 0;

        // 搜狗浏览器
        if (YZSoft.testExternal(/^sogou/i, 0)) {
            return 'sogou';
        }

        // 猎豹浏览器
        if (YZSoft.testExternal(/^liebao/i, 0)) {
            return 'liebao';
        }

        // chrome
        if (window.clientInformation && window.clientInformation.permissions) {
            return 'chrome';
        }

        if (_track) {
            // 360极速浏览器
            // 360安全浏览器
            return webstoreKeysLength > 1 ? '360ee' : '360se';
        }

        return '';
    }
});

userInfo = {};
Ext.Ajax.request({
    async: false,
    url: YZSoft.$url('Default.aspx'),
    params: {
        Method: 'GetLoginUserInfo'
    },
    success: function (response) {
        var result = Ext.decode(response.responseText);
        if (result.success)
            YZSoft.LoginUser = userInfo = result.userInfo;
        else
            alert(result.errorMessage);
    },
    failure: function (response) {
        alert(Ext.String.format('Access url({0}) failed, Reason:{1}\r\n', 'Default.aspx', response.responseText));
    }
});

Ext.define('YZSoft.Flash', {
    singleton: true,

    check: function () {
        var me = this;

        if (me.flash)
            return me.flash;

        var hasFlash = 0, //是否安装了flash
            flashVersion = 0; //flash版本

        if (document.all) {
            try {
                var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                if (swf) {
                    hasFlash = 1;
                    VSwf = swf.GetVariable('$version');
                    flashVersion = parseInt(VSwf.split(' ')[1].split(',')[0]);
                }
            }
            catch (exp) {
            }
        } else {
            if (navigator.plugins && navigator.plugins.length > 0) {
                var swf = navigator.plugins['Shockwave Flash'];
                if (swf) {
                    hasFlash = 1;
                    var words = swf.description.split(' ');
                    for (var i = 0; i < words.length; ++i) {
                        if (isNaN(parseInt(words[i])))
                            continue;
                        flashVersion = parseInt(words[i]);
                    }
                }
            }
        }
        me.flash = { support: hasFlash, version: flashVersion };
        return me.flash;
    }
});

Ext.define('YZSoft.override.String', {
    override: 'Ext.String',

    formatText: function () {
        var args = [];

        for (var i = 0, l = arguments.length; i < l; i++) {
            if( i== 0)
                args.push(RS.$1(arguments[0]));
            else
                args.push(YZSoft.HttpUtility.htmlEncode(arguments[i],true));
        }

        return Ext.String.format.apply(this, args);
    },

    formatHtml: function () {
        var args = [];

        for (var i = 0, l = arguments.length; i < l; i++) {
            args.push(RS.$1(arguments[i]));
        }

        return Ext.String.format.apply(this, args);
    }
});

RS = {
    $: function (strfullname, defaultString) { //获得字符串，例如：RS['All_TopMenu_Workflow']
        //空字符串
        if (!strfullname)
            return '';

        var idx = strfullname.indexOf('.'), //字符串格式必需为 Assembly.Perfix_*,Perfix代表下载粒度,系统一次下载相同Perfix的字符串
            assembly,
            strname;

        if (idx == -1) {
            assembly = 'YZStrings';
            strname = strfullname;
        }
        else {
            assembly = strfullname.substring(0, idx);
            strname = strfullname.substring(idx + 1);
        }

        idx = strname.indexOf('_');
        if (idx == -1) {
            alert(Ext.String.format('{0}\nIncorrent string name, String name format should be:\nAssembly.Perfix_*', strfullname));
            return '';
        }

        var namespace = strname.substring(0, idx);

        RS[assembly] = RS[assembly] || {};
        var assemblyData = RS[assembly];
        var spaceData = assemblyData[namespace];

        //命名空间不存在，则加载
        if (!spaceData && spaceData !== false) {
            Ext.log({}, Ext.String.format('Load Resource assembly: {0}, namespace: {1}, trigger: {2}', assembly, namespace, strfullname));
            var url = YZSoft.$url('YZSoft.Services.REST/core/Globalization.ashx');

            Ext.Ajax.request({
                method: 'GET',
                disableCaching: true,
                async: false,
                params: { method:'GetString', assembly: assembly, namespace: namespace, lcid: userInfo ? userInfo.LCID : '' },
                url: url,
                success: function (response) {
                    var result = Ext.decode(response.responseText);
                    if (result.success)
                        assemblyData[namespace] = result.strings;
                    else {
                        assemblyData[namespace] = false;
                        alert(Ext.String.format('{0}\nLoad string resource failed!\nReason:\n{1}', strfullname, result.errorMessage));
                    }
                },
                failure: function (response) {
                    assemblyData[namespace] = false;
                    alert(Ext.String.format('Access url({0}) failed, Reason:{1}\r\n', url, response.responseText));
                }
            });
        }

        spaceData = assemblyData[namespace];
        if (spaceData) //命名空间已存在
            return spaceData[strname] === undefined ? (defaultString === undefined ? ('Miss Resources : ' + strfullname) : defaultString) : spaceData[strname];
        else //命名空间加载失败
            return defaultString === undefined ? ('Miss Resources : ' + strfullname) : defaultString;
    },
    $1: function (val) {
        if (val)
            val = val.replace(/(\r\n|\n\r|\n|\r)/g, '<br/>');
        return val;
    }
};

YZSoft.MemberProperties = [
    { propName: '.UserAccount', type: 'String' },
    { propName: '.LeaderTitle', type: 'String' },
    { propName: '.Department', type: 'String' }
],

YZSoft.UserProperties = [
    { propName: '.Account', type: 'String' },
    { propName: '.Birthday', type: 'DateTime' },
    { propName: '.CostCenter', type: 'String' },
    { propName: '.DateHired', type: 'DateTime' },
    { propName: '.Description', type: 'String' },
    { propName: '.DisplayName', type: 'String' },
    { propName: '.EMail', type: 'String' },
    { propName: '.HomePhone', type: 'String' },
    { propName: '.HRID', type: 'String' },
    { propName: '.Mobile', type: 'String' },
    { propName: '.Office', type: 'String' },
    { propName: '.OfficePhone', type: 'String' },
    { propName: '.Sex.ToString()', type: 'String' },
    { propName: '.WWWHomePage', type: 'String' },
    { propName: Ext.String.format('["{0}"]', RS.$('All_ExtAttr')), type: 'String' }
],

Ext.define('YZSoft.CodeHelper5', {
    singleton: true,

    isWellFormatedUIString: function (text) {
        return YZSoft.Utility.isString(text);
    },

    isInteger: function (text) {
        for (var i = 0, n = text.length; i < n; i++) {
            var ch = text[i];
            if (ch < '0' || ch > '9')
                return false;
        }

        return true;
    },

    isDecimal: function (text) {
        var dotFind = false;
        for (var i = 0, n = text.length; i < n; i++) {
            var ch = text[i];
            if (ch < '0' || ch > '9') {
                if (!dotFind && ch == '.')
                    dotFind = true;
                else
                    return false;
            }
        }

        return true;
    },

    isCode: function (text) {
        var me = this;

        if (me.isInteger(text) ||
            me.isDecimal(text) ||
            YZSoft.CodeHelper5.isWellFormatedUIString(text))
            return false;

        if (text.indexOf('.') != -1 ||
            text.indexOf('new') != -1 ||
            Ext.String.startsWith(text, 'Initiator') ||
            Ext.String.startsWith(text, 'CurStep') ||
            Ext.String.startsWith(text, 'LoginUser') ||
            Ext.String.startsWith(text, 'FormDataSet'))
            return true;
        else
            return false;
    },

    getUIString: function (value) {
        var text;

        if (Ext.isString(value))
            text = '"' + value + '"';
        else if (Ext.isObject(value))
            text = value.CodeText;
        else
            text = value;

        return text;
    },

    changeType: function (text, tagType, allowCode, force) {
        var me = this,
            text = Ext.String.trim(text || '');

        if (!text)
            return null;

        if (Ext.String.startsWith(text, 'return'))
            return { CodeText: text };

        switch (tagType) {
            case 'Decimal':
            case 'Double':
            case 'Single':
                if (me.isDecimal(text))
                    return Number(text);
                return (allowCode && me.isCode(text)) ? { CodeText: text} : (force ? { CodeText: text} : null);
            case 'Int16':
            case 'Int32':
            case 'Int64':
            case 'SByte':
            case 'UInt16':
            case 'UInt32':
            case 'UInt64':
            case 'Byte':
                if (me.isInteger(text))
                    return Number(text);
                return (allowCode && me.isCode(text)) ? { CodeText: text} : (force ? { CodeText: text} : null);
            case 'Boolean':
                if (text == '0' || String.Equ(text, 'false'))
                    return false;

                if (text == '1' || String.Equ(text, 'true'))
                    return true;

                return (allowCode && me.isCode(text)) ? { CodeText: text} : true;
            case 'DateTime':
                return (allowCode && me.isCode(text)) ? { CodeText: text} : (force ? { CodeText: text} : null);
            case 'String':
                if (YZSoft.CodeHelper5.isWellFormatedUIString(text))
                    return text.substr(1, text.length - 2);

                if (allowCode && me.isCode(text))
                    return { CodeText: text };

                return text;
            case 'Binary':
                return (allowCode && me.isCode(text)) ? { CodeText: text} : (force ? { CodeText: text} : null);
            default:
                return (allowCode && me.isCode(text)) ? { CodeText: text} : (force ? { CodeText: text} : null);
        }
    }
});

Ext.define('YZSoft.CodeHelper', {
    singleton: true,

    isWellFormatedUIString: function (text) {
        return YZSoft.Utility.isString(text);
    },

    isInteger: function (text) {
        for (var i = 0, n = text.length; i < n; i++) {
            var ch = text[i];
            if (ch < '0' || ch > '9')
                return false;
        }

        return true;
    },

    isDecimal: function (text) {
        var dotFind = false;
        for (var i = 0, n = text.length; i < n; i++) {
            var ch = text[i];
            if (ch < '0' || ch > '9') {
                if (!dotFind && ch == '.')
                    dotFind = true;
                else
                    return false;
            }
        }

        return true;
    },

    isCode: function (text) {
        var me = this;

        if (me.isInteger(text) ||
            me.isDecimal(text) ||
            me.isWellFormatedUIString(text))
            return false;

        if (text.indexOf('.') != -1 ||
            text.indexOf('new') != -1 ||
            Ext.String.startsWith(text, 'Initiator') ||
            Ext.String.startsWith(text, 'CurStep') ||
            Ext.String.startsWith(text, 'LoginUser') ||
            Ext.String.startsWith(text, 'FormDataSet'))
            return true;
        else
            return false;
    },

    getUIString: function (value) {
        var text;

        if (Ext.isString(value))
            text = '"' + value + '"';
        else if (Ext.isObject(value))
            text = value.code;
        else
            text = value;

        return text;
    },

    changeType: function (text, tagType, allowCode, force) {
        var me = this,
            text = Ext.String.trim(text || '');

        if (!text)
            return null;

        if (Ext.String.startsWith(text, 'return')) {
            return {
                tinyCode: 'bpm',
                code: text
            };
        }

        switch (tagType) {
            case 'Decimal':
            case 'Double':
            case 'Single':
                if (me.isDecimal(text))
                    return Number(text);

                if (allowCode && me.isCode(text)) {
                    return {
                        tinyCode: 'bpm',
                        code: text
                    };
                }
                else if (force) {
                    return {
                        tinyCode: 'bpm',
                        code: text
                    };
                }
                else {
                    return null;
                }
            case 'Int16':
            case 'Int32':
            case 'Int64':
            case 'SByte':
            case 'UInt16':
            case 'UInt32':
            case 'UInt64':
            case 'Byte':
                if (me.isInteger(text))
                    return Number(text);

                if (allowCode && me.isCode(text)) {
                    return {
                        tinyCode: 'bpm',
                        code: text
                    };
                }
                else if (force) {
                    return {
                        tinyCode: 'bpm',
                        code: text
                    };
                }
                else {
                    return null;
                }
            case 'Boolean':
                if (text == '0' || String.Equ(text, 'false'))
                    return false;

                if (text == '1' || String.Equ(text, 'true'))
                    return true;

                if (allowCode && me.isCode(text)) {
                    return {
                        tinyCode: 'bpm',
                        code: text
                    };
                }
                else if (force) {
                    return {
                        tinyCode: 'bpm',
                        code: text
                    };
                }
                else {
                    return null;
                }
            case 'DateTime':
                if (allowCode && me.isCode(text)) {
                    return {
                        tinyCode: 'bpm',
                        code: text
                    };
                }
                else if (force) {
                    return {
                        tinyCode: 'bpm',
                        code: text
                    };
                }
                else {
                    return null;
                }
            case 'String':
                if (me.isWellFormatedUIString(text))
                    return text.substr(1, text.length - 2);

                if (allowCode && me.isCode(text)) {
                    return {
                        tinyCode: 'bpm',
                        code: text
                    };
                }

                return text;

            case 'Binary':
                if (allowCode && me.isCode(text)) {
                    return {
                        tinyCode: 'bpm',
                        code: text
                    };
                }
                else if (force) {
                    return {
                        tinyCode: 'bpm',
                        code: text
                    };
                }
                else {
                    return null;
                }
            default:
                if (me.isDecimal(text))
                    return Number(text);

                if (me.isInteger(text))
                    return Number(text);

                if (allowCode && me.isCode(text)) {
                    return {
                        tinyCode: 'bpm',
                        code: text
                    };
                }

                return text;
        }
    }
});

Ext.define('YZSoft.Enum', {
    singleton: true,
    DATA: {},

    //BPM.ParticipantLeaderType
    VTOS: function (enumName, value) {
        if (!this.DATA[enumName]) {
            this.request(enumName);
        }

        if (this.DATA[enumName])
            return this.DATA[enumName].VTOS[value];
    },

    STOV: function (enumName, string) {
        if (!this.DATA[enumName]) {
            this.request(enumName);
        }

        if (this.DATA[enumName])
            return this.DATA[enumName].STOV[string];
    },

    request: function (enumName) {
        var me = this,
            url = YZSoft.$url('YZSoft.Services.REST/MDM/Enum.ashx');

        Ext.Ajax.request({
            method: 'GET',
            async: false,
            params: { method: 'GetEnumDefine', enumName: enumName },
            url: url,
            success: function (response) {
                var result = Ext.decode(response.responseText);

                if (result.success) {
                    var data = me.DATA[enumName] = {
                        VTOS: result.data,
                        STOV: {}
                    };

                    for (var v in data.VTOS) {
                        var s = data.VTOS[v];
                        data.STOV[s] = Number(v);
                    }
                }
                else
                    alert(Ext.String.format('{0}\nLoad enum failed!\nReason:\n{1}', enumName, result.errorMessage));
            },
            failure: function (response) {
                alert(Ext.String.format('Access url({0}) failed, Reason:{1}\r\n', url, response.responseText));
            }
        });
    }
});

(function () {
    function show() {
        switch (this.type) {
            case 'error':
            case 'http':
                Ext.Msg.show({
                    title: this.title || RS.$('All_MsgTitle_Error'),
                    msg: YZSoft.HttpUtility.htmlEncode(this.msg,true),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
                break;
            case 'responseError':
                break;
            case 'customError':
                Ext.Msg.show({
                    title: this.title || RS.$('All_Warning'),
                    msg: YZSoft.HttpUtility.htmlEncode(this.msg,true),
                    buttons: Ext.Msg.OK,
                    icon: this.icon || Ext.Msg.ERROR
                });

                break;
            case 'native':
                var errmsg = Ext.String.format(RS.$('All_JSErr_Msg'), this.msg, this.url, this.line);
                //YZSoft.alert(errmsg);有的时候显不出来，比如在流程库界面加一句错误的代码
                alert(errmsg);
                break;
            default:
                Ext.Msg.show({
                    title: this.title || RS.$('All_MsgTitle_Error'),
                    msg: YZSoft.HttpUtility.htmlEncode(this.msg,true),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
                break;
        }
    };

    YZSoft.Error = function (config) {
        if (Ext.isString(config))
            config = { type: 'error', msg: config };

        var error = new Error(Ext.encode(config));

        Ext.apply(error, config);
        Ext.apply(error, { show: show });

        return error;
    };

    Ext.apply(YZSoft.Error, {
        raise: function (err) {
            err = err || {};
            if (Ext.isString(err)) {
                var args = Ext.toArray(arguments, 1);
                args.splice(0, 0, err);
                err = {
                    type: 'error',
                    msg: Ext.String.format.apply(undefined, args)
                };
            }

            var me = this,
            method = me.raise.caller,
            msg, name;

            if (method) {
                if (!err.sourceMethod && (name = method.$name)) {
                    err.sourceMethod = name;
                }
                if (!err.sourceClass && (name = method.$owner) && (name = name.$className)) {
                    err.sourceClass = name;
                }
            }

            Ext.log(err);

            throw new YZSoft.Error(err);
        },

        parse: function (message, url, line) {
            var err;
            var msg = message || '';

            if (msg.substring(0, 8) == 'Error: {') //safari
                msg = msg.substring(7);

            if (msg.substring(0, 17) == 'Uncaught Error: {') //chrome
                msg = msg.substring(16);

            if (msg.length != 0 && msg.charAt(0) == '{') {
                err = Ext.decode(msg);
                err.url = err.url || url;
                err.line = err.line || line;
            }
            else {
                err = {
                    type: 'native',
                    msg: msg,
                    url: url,
                    line: line
                };
            }

            return new YZSoft.Error(err);
        },

        fromNativeError: function (err, url, line) {
            var err = {
                type: 'native',
                msg: err.message,
                url: url,
                line: line
            };

            return new YZSoft.Error(err);
        }
    });
})();

window.onerror = function (message, url, line, column, error) {
    url = YZSoft.errorUrl || url;
    delete YZSoft.errorUrl;

    Ext.log({level:'warn'},Ext.String.format('[Uncatch Error!!!] {0}, url:{1}, line:{2}', message, url, line));

    var err;

    if (error)
        err = error.show ? error : YZSoft.Error.fromNativeError(error, url, line);
    else
        err = YZSoft.Error.parse(message, url, line);

    err.show();
    return true;
};

YZSoft.NameChecker = {
    ObjectNameReg: /^[^\\\/:*?"<>|]+$/,
    //文件名规则:/^[^\\\/:*?"<>|]+$/,
    //http://www.cnblogs.com/wenanry/archive/2010/09/06/1819552.html

    IsValidObjectName: function (str) {
        if (YZSoft.NameChecker.ObjectNameReg.test(str))
            return true;
        else
            return Ext.String.format(RS.$('All_ObjectNameIncludeInvalidChar'), '\\\/:*?"<>|');
    }
};

$objname = YZSoft.NameChecker.IsValidObjectName;

YZSoft.alert = function (message, title, fn, scope) {
    if (Ext.isFunction(title)) {
        scope = fn;
        fn = title;
        title = '';
    }

    if (Ext.isIE) {
        alert(message);
        if (fn)
            fn.call(scope);
    }
    else {
        Ext.Msg.show({
            title: title || RS.$('All_Alert_Title'),
            msg: Ext.util.Format.nl2br(message),
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.INFO,
            fn: function () {
                if (fn)
                    fn.call(scope);
            }
        });
    }
};

Ext.define('YZSoft.override.Component', {
    override: 'Ext.Component',

    initComponent: function () {
        var me = this;

        me.on({
            activate: function () {
                if (me.onActivate) {
                    me.activateTime = me.activateTime || 0;

                    var args = [me.activateTime];

                    Ext.each(arguments, function (arg) {
                        args.push(arg);
                    });

                    me.activateTime++;
                    me.onActivate.apply(me, args)
                }
            }
        });

        me.callParent(arguments);
    },

    /*
    延时关闭的mask
    {
        msg:RS.$('All_Save_Succeed'),
        autoClose: 500
    }
    */
    mask: function (msg, msgCls, elHeight) {
        var me = this,
            setting = $S.loadMask,
            stays = setting.stays,
            stay, maskEl ;

        if (Ext.isObject(msg)) {
            me.callParent([msg.msg, msgCls || msg.msgCls, elHeight]);

            if (msg.autoClose == true)
                stay = setting.stay;
            else if (Ext.isString(msg.autoClose))
                stay = stays[msg.autoClose];
            else
                stay = msg.autoClose;

            if (stay) {
                Ext.defer(function () {
                    me.unmask();
                    msg.fn && msg.fn();
                }, stay);
            }
        }
        else {
            me.callParent(arguments);
        }
    },

    yzmaximize: function () {
        var me = this,
            ownerCt = me.ownerCt,
            maximizedCls = 'yz-maximized',
            position = me.ownerCt.items.indexOf(me);

        YZSoft.frame.add(me);
        YZSoft.frame.setActiveItem(me);

        me.addCls(maximizedCls);
        me.yzmaximized = true;

        me.on({
            single: true,
            yzrestore: function () {
                YZSoft.frame.getLayout().prev();

                ownerCt.insert(position, me);
                ownerCt.setActiveTab && ownerCt.setActiveTab(position);
                me.removeCls(maximizedCls);
                me.yzmaximized = false;
            }
        });
    },

    yzrestore: function () {
        this.fireEvent('yzrestore');
    }
});

//让view的LoadMask支持 store加载时operation中的loadMask和mbox
Ext.define('YZSoft.override.LoadMask', {
    override: 'Ext.LoadMask',
    msg: RS.$('All_Loading'),

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);
        me.msgSaved = me.msg;
        me.msgClsSaved = me.msgCls;

        //bug修正,容器销毁时loadmask未销毁
        if (config && config.target) {
            config.target.on({
                destroy: function () {
                    if (!me.destroyed)
                        me.destroy();
                }
            });
        }
    },

    setText: function (msg) {
        this.msg = msg;
    },

    setMsgCls: function (msgCls) {
        this.msgCls = msgCls;
    },

    afterShow: function () {
        var me = this;

        me.callParent(arguments);
        me.msg = me.msgSaved;
        me.msgCls = me.msgClsSaved;
    },

    //支持msgCls
    syncMaskState: function () {
        var me = this;

        if (me.isVisible())
            me.msgWrapEl.setCls(['x-mask-msg', me.msgCls]);

        me.callParent(arguments);
    },

    onBeforeLoad: function (store, operation, eOpts, final) {
        if (!store) { //loadMask bind到store的时候，store已经处于loading状态
            this.callParent(arguments);
            return;
        }

        var me = this,
            opt = operation,
            mbox = opt && opt.getMbox(),
            loadMask = opt && opt.getLoadMask();

        if (mbox || !loadMask)
            return;

        if (loadMask && loadMask.target && !me.yzextloadmask)
            return;

        if (final) {
            me.showByOperation = opt;
            loadMask.showTime = Ext.Date.now();
            me.callParent(arguments);
            return;
        }

        if (loadMask.msg)
            me.setText(loadMask.msg);

        //暂时禁用
        //if (loadMask.msgCls) 
        //    me.setMsgCls(loadMask.msgCls);

        if (!loadMask.start) {
            me.onBeforeLoad(store, operation, eOpts, true);
        }
        else {
            me.stayTimer = Ext.defer(function () {
                delete me.stayTimer;
                me.onBeforeLoad(store, operation, eOpts, true);
            }, loadMask.start);
        }
    },

    onLoad: function (store, records, successful, operation, eOpts) {
        var me = this;

        //推送加载会吧主动加载的mask hide掉，导致延时失效,showByOperation为空时表示未显示，此时必须执行onLoad
        if (me.showByOperation && me.showByOperation !== operation)
            return;

        if (me.stayTimer) {
            Ext.undefer(me.stayTimer);
            delete me.stayTimer;
        }

        me.callParent(arguments);
    }
});

Ext.define('YZSoft.override.data.operation.Operation', {
    override: 'Ext.data.operation.Operation',
    config: {
        mbox: null,
        loadMask: null
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

        //缺省的loadMask,注：不能放到config中，会引起继承，比如委托后再翻页，会出现委托的loadMask
        if (!config.loadMask && config.loadMask !== false) {
            config.loadMask = {
                msg: RS.$('All_Loading'),
                start: $S.loadMask.start,
                stay: $S.loadMask.stay
            }
        }

        me.callParent(arguments);
    },

    applyLoadMask: function (loadMask) {
        var me = this,
            loadMaskSetting = $S.loadMask,
            starts = loadMaskSetting.starts,
            stays = loadMaskSetting.stays;

        if (loadMask === false) {
            loadMask = false;
        }
        else if (loadMask === true) {
            loadMask = {
                msg: RS.$('All_Loading'),
                start: 0,
                stay: loadMaskSetting.stay
            }
        }
        else if (Ext.isString(loadMask)) {
            loadMask = {
                msg: loadMask,
                start: 0,
                stay: loadMaskSetting.stay
            }
        }
        else {
            loadMask = Ext.clone(loadMask)
            delete loadMask.showTime;
            loadMask.msg = loadMask.msg || RS.$('All_Loading');

            if ('start' in loadMask) {
                if (Ext.isString(loadMask.start))
                    loadMask.start = starts[loadMask.start];
            }
            else {
                loadMask.start = loadMaskSetting.start;
            }

            if ('stay' in loadMask) {
                if (Ext.isString(loadMask.stay))
                    loadMask.stay = stays[loadMask.stay];
            }
            else {
                loadMask.stay = loadMaskSetting.stay;
            }
        }

        return loadMask;
    },

    //记录store加载开始时间
    execute: function () {
        this.beginTime = Ext.Date.now();
        this.callParent(arguments);
    },

    //增加Store加载成功延时时间，支持operation中的mbox和loadMask.stay
    triggerCallbacks: function (final) {
        var me = this,
            mbox = me.getMbox(),
            loadMask = me.getLoadMask();

        if (final) {
            me.callParent(arguments);
            return;
        }

        if (mbox) {
            if (mbox.isHidden()) {
                me.triggerCallbacks(true);
            }
            else {
                me.deferDestroy = true;

                mbox.on({
                    single: true,
                    scope: this,
                    hide: function () {
                        me.triggerCallbacks(true);

                        delete me.deferDestroy;
                        me.destroy();
                    }
                });
            }

            return;
        }

        //必需使用loadMask的showTime，loadMask未显示过此处不延时
        if (loadMask && loadMask.stay && loadMask.showTime) {
            var tick = loadMask.stay - Ext.Date.getElapsed(loadMask.showTime);
            if (tick > 0) {
                me.deferDestroy = true;

                Ext.defer(function () {
                    me.triggerCallbacks(true);

                    delete me.deferDestroy;
                    me.destroy();
                }, tick);
                return;
            }
        }

        me.triggerCallbacks(true);
    },

    getErrorMessage: function () {
        var me = this,
            err = me.getError();

        if (Ext.isObject(err))
            return Ext.String.format('{0} {1}\n{2}', err.status, err.statusText, me.getRequest().getUrl());
        else
            return err;
    },

    //支持deferDestroy
    destroy: function () {
        if (this.deferDestroy === true)
            return;

        this.callParent(arguments);
    }
});

Ext.define('YZSoft.override.Store', {
    override: 'Ext.data.Store',

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            beforeLoad: function (store, operation, eOpts) {
                var opt = operation,
                    loadMask = opt && opt.getLoadMask();

                if (loadMask && loadMask.target) {
                    var myMask = new Ext.LoadMask(Ext.apply({
                        store: me,
                        yzextloadmask: true,
                        hide: function () {
                            this.destroy();
                        }
                    }, loadMask));

                    myMask.onBeforeLoad(me, operation);
                }
            },
            load: function (store, records, successful, operation, eOpts) {
                var request = operation && operation.getRequest();
                if (successful && request)
                    me.lastParams = request.getParams(); //支持lastParams
            }
        });
    },

    //reload时不继承loadMask和mbox
    reload: function () {
        var me = this,
            loadMask,mbox;

        if (me.lastOptions) {
            loadMask = me.lastOptions.loadMask;
            mbox = me.lastOptions.mbox;

            delete me.lastOptions.loadMask;
            delete me.lastOptions.mbox;

            me.callParent(arguments);

            me.lastOptions.loadMask = loadMask;
            me.lastOptions.mbox = mbox;
        }
        else {
            me.callParent(arguments);
        }
    }
});

Ext.define('YZSoft.override.toolbar.Paging', {
    override: 'Ext.toolbar.Paging',

    //刷新时必出loadMask
    doRefresh: function () {
        var me = this,
            store = me.store,
            current = store.currentPage;

        if (me.fireEvent('beforechange', me, current) !== false) {
            store.loadPage(current, {
                loadMask: true
            });
            return true;
        }
        return false;
    }
});

Ext.define('YZSoft.Ajax', {
    extend: 'Ext.data.Connection',
    singleton: true,
    autoAbort: false,

    errMessageFromResponse: function (config, response) {
        return Ext.String.format(RS.$('All_Ajax_HttpFail_Msg'), config.url) + (response.responseText || '');
    },

    regularWaitMsg: function (wait) {
        var ajaxSetting = $S.ajax,
            starts = ajaxSetting.starts,
            stays = ajaxSetting.stays;

        if (!wait) {
            wait = {
                disabled: true
            };
        }
        else if (wait === true) {
            wait = {
                msg: RS.$('All_Submiting'),
                target: Ext.getBody(),
                start: ajaxSetting.start,
                stay: ajaxSetting.stay
            };
        }
        else if (Ext.isString(wait)) {
            wait = {
                msg: wait,
                target: Ext.getBody(),
                start: ajaxSetting.start,
                stay: ajaxSetting.stay
            };
        }
        else {
            wait.msg = wait.msg || RS.$('All_Submiting');
            wait.target = wait.target || Ext.getBody();

            if ('start' in wait) {
                if (Ext.isString(wait.start))
                    wait.start = starts[wait.start];
            }
            else {
                wait.start = ajaxSetting.start;
            }

            if ('stay' in wait) {
                if (Ext.isString(wait.stay))
                    wait.stay = stays[wait.stay];
            }
            else {
                wait.stay = ajaxSetting.stay;
            }
        }

        wait = Ext.apply(wait, {
            clearTimer: function () {
                var me = this;

                if (me.showTimer) {
                    Ext.undefer(me.showTimer);
                    delete me.showTimer;
                }
            },
            hide: function () {
                var me = this,
                    fn = me.fn || Ext.emptyFn;

                if (me.disabled)
                    return;

                if (me.target.destroyed)
                    return;

                me.target.masked && me.target.unmask();
                fn && fn();
            },
            onBeginRequest: function () {
                var me = this;

                if (me.disabled) {
                    return;
                }

                if (me.start) { //延时呈现mask
                    me.showTimer = Ext.defer(function () {
                        me.beginTime = Ext.Date.now();
                        me.target.rendered && me.target.mask(me.msg, me.msgCls);
                    }, me.start);
                }
                else { //立即呈现mask
                    me.beginTime = Ext.Date.now();
                    me.target.rendered && me.target.mask(me.msg ,me.msgCls);
                }
            },
            onFailure: function (request, fn) {
                var me = this,
                    fn = fn || Ext.emptyFn;

                me.clearTimer();

                if (me.disabled) {
                    fn();
                    return;
                }

                //尚未显示mask
                if (!me.beginTime) {
                    fn();
                    return;
                }

                me.hide();
                fn();
            },
            onSuccess: function (reqtest, fn) {
                var me = this,
                    fn = fn || Ext.emptyFn,
                    ticks;

                me.clearTimer();

                if (me.disabled) {
                    fn();
                    return;
                }

                //尚未显示mask
                if (!me.beginTime) {
                    fn();
                    return;
                }

                ticks = me.stay - Ext.Date.getElapsed(me.beginTime);
                if (ticks > 0) {    //mask关闭时间未到
                    Ext.defer(function () {
                        me.hide();
                        fn();
                    }, ticks);
                }
                else {  //mask关闭时间已到
                    me.hide();
                    fn();
                }
            }
        });

        return wait;
    },

    //config.waitMsg - {msg:'正在保存',delay:500} or '正在保存'
    //config.waitMsgOK - {msg:'已保存',delay:500} or '已保存'
    request: function (config) {
        var me = this,
            wait = config.waitMsg = me.regularWaitMsg(config.waitMsg),
            tag, cfg, rv;

        wait.onBeginRequest(me);

        cfg = {
            method: 'GET',
            disableCaching: true
        };

        //IE async undefined 错误
        if (Ext.isEmpty(config.async))
            delete config.async;

        Ext.apply(cfg, config);

        Ext.apply(cfg, {
            url: config.url,
            success: function (response) {
                var action, fail;

                fail = function (action) {
                    wait.onFailure(me, function () {
                        if (config.failure)
                            config.failure.call(config.scope || config, action);
                        else
                            YZSoft.alert(action.result.errorMessage);
                    });
                };

                //获得返回数据
                try {
                    if (config.requestend)
                        config.requestend.call(config.scope || config);

                    action = {
                        result: Ext.decode(response.responseText),
                        response: response,
                        responseText: response.responseText
                    };
                }
                catch (e) {
                    action = {
                        result: {
                            success: false,
                            clientError: true,
                            errorMessage:e.message || e
                        },
                        response: response,
                        responseText: response.responseText
                    };

                    fail(action);
                    return;
                }

                if (action.result.success === false) {
                    fail(action);
                    return;
                }

                wait.onSuccess(me, function () {
                    if (config.success)
                        config.success.call(config.scope || config, action);
                });
            },
            failure: function (response) {
                wait.onFailure(me, function () {
                    var errorMessage,
                        action;

                    if (config.requestend)
                        config.requestend.call(config.scope || config);

                    errorMessage = Ext.String.format(RS.$('All_Ajax_HttpFail_Msg'), config.url) + (response.status == 404 ? response.statusText : (response.responseText || ''));

                    if (config.exception) {
                        YZSoft.alert(errorMessage, function () {
                            action = {
                                result: {
                                    errorMessage: errorMessage
                                },
                                response: response,
                                responseText: response.responseText
                            };
                            config.exception.call(config.scope || config, action);
                        });
                    }
                    else if (config.failure) {
                        action = {
                            result: {
                                exception: true,
                                errorMessage: errorMessage
                            },
                            response: response,
                            responseText: response.responseText
                        };

                        config.failure.call(config.scope || config, action);
                    }
                    else {
                        YZSoft.alert(errorMessage);
                    }
                });
            }
        });

        return me.callParent([cfg]);
    }
});

Ext.define('YZZoft.override.data.JsonStore', {
    override: 'Ext.data.JsonStore',

    constructor: function (config) {
        this.callParent(arguments);

        proxy = this.getProxy();
        proxy.on('exception', this.loadexcetion, this);
    },

    getUniName: function (fieldName, prefix, seed, increment, prefixAsName) {
        var me = this,
            seed = (!seed && seed !== 0) ? 1 : seed,
            increment = increment ? increment : 1;

        if (prefixAsName) {
            var index = me.findBy(function (rec) {
                if (rec.get(fieldName) == prefix)
                    return true;
            });

            if (index == -1)
                return prefix;
        }

        for (var i = seed; ; i += increment) {
            var name = prefix + i;

            var index = me.findBy(function (rec) {
                if (rec.get(fieldName) == name)
                    return true;
            });

            if (index == -1)
                return name;
        }
    },

    //throw err会引起panel layout错误(layout不更新)
    loadexcetion: function (store, response, operation, eOpts) {
        var err;

        try {
            err = Ext.decode(response.responseText || {errorMessage:''});
        }
        catch (exp) {
            Ext.log.warn(Ext.String.format(RS.$('All_JsonDecodeError'), store.url, response.responseText));
            return;
        }

        Ext.log.warn(Ext.String.format(RS.$('All_StoreLoadException'), store.url, err.errorMessage));
    }
});

/*********已整理**********/
Ext.define('YZSoft.override.view.AbstractView', {
    override: 'Ext.view.AbstractView',
    loadingText: RS.$('All_Loading')
});

Ext.define('YZSoft.override.Date', {
    override: 'Ext.Date',
    monthNames: [
       RS.$('All_Month1'),
       RS.$('All_Month2'),
       RS.$('All_Month3'),
       RS.$('All_Month4'),
       RS.$('All_Month5'),
       RS.$('All_Month6'),
       RS.$('All_Month7'),
       RS.$('All_Month8'),
       RS.$('All_Month9'),
       RS.$('All_Month10'),
       RS.$('All_Month11'),
       RS.$('All_Month12')
    ],
    dayNames:[
       RS.$('All_Week7Short'),
       RS.$('All_Week1Short'),
       RS.$('All_Week2Short'),
       RS.$('All_Week3Short'),
       RS.$('All_Week4Short'),
       RS.$('All_Week5Short'),
       RS.$('All_Week6Short'),
       RS.$('All_Week7Short')
    ],
    dayNamesW: [
        RS.$('All_Week7'),
        RS.$('All_Week1'),
        RS.$('All_Week2'),
        RS.$('All_Week3'),
        RS.$('All_Week4'),
        RS.$('All_Week5'),
        RS.$('All_Week6'),
        RS.$('All_Week7')
    ],
    dayNamesZ: [
        RS.$('All__WeekDayName10'),
        RS.$('All__WeekDayName11'),
        RS.$('All__WeekDayName12'),
        RS.$('All__WeekDayName13'),
        RS.$('All__WeekDayName14'),
        RS.$('All__WeekDayName15'),
        RS.$('All__WeekDayName16')
    ]
});

Ext.define('YZSoft.override.DatePicker', {
    override: 'Ext.DatePicker',
    todayText: RS.$('All_Today'),
    nextText: RS.$('All_NextMonth'),
    prevText: RS.$('All_PrevMonth'),
    okText: RS.$('All_OK'),
    cancelText: RS.$('All_Cancel'),
    format: 'Y-m-d'
});

Ext.define('YZSoft.override.form.field.Date', {
    override:'Ext.form.field.Date',
    format:'Y-m-d'
});

Ext.define('YZSoft.override.toolbar.Paging', {
    override: 'Ext.toolbar.Paging',
    beforePageText: RS.$('All_Paging_BeforePageText'),
    afterPageText: RS.$('All_PagingToolbar_afterPageText'),
    firstText: RS.$('All_Paging_FirstText'),
    prevText: RS.$('All_PagingToolbar_prevText'),
    nextText: RS.$('All_PagingToolbar_nextText'),
    lastText: RS.$('All_PagingToolbar_lastText'),
    refreshText: RS.$('All_Refresh'),
    displayMsg: RS.$('All_PagingToolbar_displayMsg'),
    emptyMsg: RS.$('All_PagingToolbar_emptyMsg')
});

Ext.define('YZSoft.override.window.Window', {
    override: 'Ext.window.Window',
    closeToolText: ''
});

Ext.define('YZSoft.override.window.MessageBox', {
    override:'Ext.window.MessageBox',
    buttonText: {
        ok: RS.$('All_OK'),
        cancel: RS.$('All_Cancel'),
        yes: RS.$('All_Yes'),
        no: RS.$('All_No')
    }
});

Ext.define('YZSoft.override.grid.property.HeaderContainer', {
    override: 'Ext.grid.property.HeaderContainer',
    nameText: RS.$('All_Property_Name'),
    valueText: RS.$('All_Property_Value'),
    dateFormat: 'Y-m-d'
});

Ext.define('YZSoft.override.grid.header.Container', {
    override: 'Ext.grid.header.Container',
    sortAscText: RS.$('All_SortAsc'),
    sortDescText: RS.$('All_SortDesc'),
    sortClearText: RS.$('All_SortClear'),
    columnsText: RS.$('All_Columns')
});

Ext.define("YZSoft.override.it.grid.feature.Grouping", {
    override: "Ext.grid.feature.Grouping",

    groupByText: RS.$('All_GroupByText'),
    showGroupsText: RS.$('All_ShowGroupsText'),
    expandTip: '',
    collapseTip: ''
});

//日期扩展
Ext.apply(Ext.Date.formatCodes, {
    g: "(this.getHours() == 0 ? 0 :((this.getHours() % 12) ? this.getHours() % 12 : 12))",
    a: "(this.getHours() < 12 ? RS.$('All__AM') : RS.$('All__PM'))",
    A: "(this.getHours() <= 7 ? RS.$('All__DayLE7') : (this.getHours() <= 11 ? RS.$('All__DayLE11'):(this.getHours() <= 13 ? RS.$('All__DayLE13'):(this.getHours() <= 17 ? RS.$('All__DayLE17'):RS.$('All__DayG17')))))",
    L: "Ext.Date.dayNamesZ[this.getDay()]",
    v: "Ext.Date.dayNamesW[this.getDay()]",
    V: "(Ext.Date.format(this,'Y-m-d') == Ext.Date.format(new Date(),'Y-m-d') ? RS.$('All_Today'):Ext.Date.dayNamesW[this.getDay()])",
    Q: "Ext.String.leftPad(Ext.Date.add(this,Ext.Date.DAY,6).getMonth() + 1, 2, '0')",
    q: "Ext.String.leftPad(Ext.Date.add(this,Ext.Date.DAY,6).getDate(), 2, '0')"
});

Ext.define('YZSoft.override.form.field.Text', {
    override: 'Ext.form.field.Text',
    blankText: RS.$('All_BlankText')
});

YZSoft.DateExtras = {
    formats: [
        { hours: 1.5, fmt: RS.$('All__DateFmt_Hours') },
        { days: 0, fmt: RS.$('All__DateFmt_Days0') },
        { days: 1, fmt: RS.$('All__DateFmt_Days1') },
        { days: 2, fmt: RS.$('All__DateFmt_Days2') },
        { weeks: 0, fmt: RS.$('All__DateFmt_Weeks0') },
        { weeks: 1, fmt: RS.$('All__DateFmt_Weeks1') },
        { months: 0, fmt: RS.$('All__DateFmt_Months0') },
        { years: 0, fmt: RS.$('All__DateFmt_Years0') },
        { fmt: RS.$('All__DateFmt_fmt') }
    ],
    funcs: {
        hours: function (date, now) {
            if (date > now)
                return -1;

            return Ext.Date.getElapsed(date, now) / 1000 / 60 / 60;
        },
        days: function (date, now) {
            if (date > now)
                return -1;

            date = Ext.Date.clearTime(date, true);
            now = Ext.Date.clearTime(now, true);

            return Ext.Date.getElapsed(date, now) / 1000 / 60 / 60 / 24;
        },
        weeks: function (date, now) {
            if (date > now)
                return -1;

            date = Ext.Date.clearTime(date, true);
            now = Ext.Date.clearTime(now, true);

            date = Ext.Date.add(date, Ext.Date.DAY, -date.getDay());
            now = Ext.Date.add(now, Ext.Date.DAY, -now.getDay());

            return Ext.Date.getElapsed(date, now) / 1000 / 60 / 60 / 24 / 7;
        },
        months: function (date, now) {
            if (date > now)
                return -1;

            return (now.getFullYear() * 12 + now.getMonth()) - (date.getFullYear() * 12 + date.getMonth());
        },
        years: function (date, now) {
            if (date > now)
                return -1;

            return now.getFullYear() - date.getFullYear();
        }
    },

    toFriendlyString: function (date, formats) {
        var util = YZSoft.DateExtras,
            fs = formats || util.formats,
            funcs = util.funcs;

        if (!fs.processed) {
            fs.processed = true;

            for (var i = 0; i < fs.length; i++) {
                var f = fs[i];

                var funcName;
                for (funcName in f) {
                    if (funcName)
                        break;
                }
                if (funcName == 'fmt')
                    funcName = null;

                f.funcName = funcName;
                f.func = function (date, dateNow, me) {
                    if (!me.funcName)
                        return true;

                    var func = YZSoft.DateExtras.funcs[me.funcName];

                    if (!func)
                        return true;

                    var value = func(date, dateNow);
                    return (value != -1 && value <= me[me.funcName]);
                }
            }
        }

        var now = new Date();
        for (var i = 0; i < fs.length; i++) {
            var f = fs[i];
            if (f.func(date, now, f)) {
                return Ext.Date.format(date, f.fmt);
            }
        }
    },

    getWeekFirstDate: function (date) {
        //星期一为第一天  
        var weeknow = date.getDay();

        //因为是以星期一为第一天，所以要判断weeknow等于0时，要向前推6天。  
        weeknow = (weeknow == 0 ? (7 - 1) : (weeknow - 1));
        var daydiff = (-1) * weeknow;

        //本周第一天
        date = Ext.Date.add(date, Ext.Date.DAY, daydiff);
        return Ext.Date.clearTime(date);
    },

    getWeekFirstDateByWeekNo: function (year, month, week) {
        var firstDate = Ext.Date.getWeekFirstDate(new Date(year, month - 1, 1));
        return Ext.Date.add(firstDate, Ext.Date.DAY, (week - 1) * 7);
    },

    getWeekOfMonth: function (date) {
        var firstDate = Ext.Date.getWeekFirstDate(new Date(date.getFullYear(), date.getMonth(), 1)),
            days = Ext.Date.diff(firstDate, date, Ext.Date.DAY);

        return Math.floor(days / 7) + (days % 7 ? 1 : 0) + 1;
    }
};

Ext.apply(Ext.Date, YZSoft.DateExtras);

YZSoft.util = {};

YZSoft.util.hex = {
    encode: function (str) {
        str = String(str);

        var r = '';
        var e = str.length;
        var c = 0;
        var h;
        while (c < e) {
            h = str.charCodeAt(c++).toString(16);
            while (h.length < 3) h = '0' + h;
            r += h;
        }
        return r;
    },

    decode: function (str) {
        var r = '';
        var e = str.length;
        var s;
        while (e >= 0) {
            s = e - 3;
            r = String.fromCharCode('0x' + str.substring(s, e)) + r;
            e = s;
        }
        return r;
    }
};

YZSoft.util.xml = {
    xmlNodeNameEncode: function (value) {
        return !value ? value : String(value).replace(/@/g, '_x0040_').replace(/:/g, '_x003A_').replace('$', '_x0024_');
    },

    xmlValueEncode: function (value) {
        var rv = '';
        for (var i = 0; i < value.length; i++) {
            var ch = value.charAt(i);
            var code = ch.charCodeAt(0);
            var j = '<>"&\''.indexOf(ch);
            if (j != -1) {
                rv += '&' + ['lt', 'gt', 'quot', 'amp', 'apos'][j] + ';';
            }
            else if (code < 32 && code != 10 && code != 13) {
                //rv += '&#' + code + ';'; //忽略非打印字符，非打印字符是不会显示的会引起以后查询时的误解
            }
            else {
                rv += ch;
            }
        }
        return rv;
    },

    encode: function (nodename, jsondata, opt, deep) {
        var n = this.xmlNodeNameEncode(nodename);
        var d = jsondata;
        var hs = this.getHeadSpace(deep);
        if (!Ext.isDefined(d) || d === null) {
            return hs + this.encodeItem(n, '');
        }
        else if (Ext.isString(d)) {
            return hs + this.encodeItem(n, this.xmlValueEncode(d));
        }
        else if (typeof d == 'number') {
            return hs + this.encodeItem(n, d);
        }
        else if (Ext.isBoolean(d)) {
            return hs + this.encodeItem(n, d);
        }
        var vs = Ext.isArray(d) ? jsondata : [d];
        deep = deep || 0;
        var rv = [];
        if (deep == 0)
            rv.push('<?xml version="1.0"?>');
        if (vs.length == 0) {
            rv.push(hs + '<' + n + '>');
            rv.push(hs + '</' + n + '>');
        }
        else {
            for (var i = 0; i < vs.length; i++) {
                var v = vs[i];
                rv.push(hs + '<' + n + '>');

                for (var p in v) {
                    var pv = v[p];
                    rv.push(this.encode(p, pv, null, deep + 1));

                }
                rv.push(hs + '</' + n + '>');
            }
        }
        return rv.join('\r\n');
    },

    getHeadSpace: function (deep) {
        var spc = '';
        for (var i = 0; i < deep * 4; i++)
            spc += ' ';
        return spc;
    },

    encodeItem: function (p, v) {
        return '<' + p + '>' + v + '</' + p + '>';
    }
};

Ext.selectNode = function (selector, root, dom) {
    if (!root)
        return;

    return Ext.fly(root).down(selector, dom === false ? false : true);
};

Ext.findParent = function (selector, root, dom) {
    if (!root)
        return;

    return Ext.fly(root).up(selector, undefined, dom === false ? false : true);
};

Ext.define('YZSoft.override.window.MessageBox', {
    override: 'Ext.window.MessageBox',
    defaultButtonCls:'yz-btn-default',

    initComponent: function (cfg) {
        var me = this,
            buttonAlign = (cfg && cfg.buttonAlign) || 'end';

        me.callParent(arguments);

        me.topContainer.setLayout({
            type: 'vbox',
            align: 'stretch'
        });

        me.bottomTb.getLayout().setPack(buttonAlign);
    },

    show: function (cfg) {
        var dlg = this.callParent(arguments);

        if (cfg.validateEmpty) {
            var textarea = dlg.textArea,
                okbtn = dlg.msgButtons[0];

            okbtn.setDisabled(!Ext.String.trim(textarea.getValue()));

            var change = function () {
                okbtn.setDisabled(!Ext.String.trim(textarea.getValue()));
            };

            var hide = function () {
                okbtn.setDisabled(false);

                textarea.un('change', change);
                dlg.un('hide', hide);
            };

            textarea.on('change', change);
            dlg.on('beforehide', hide);
        }

        return dlg;
    },

    reconfigure: function (cfg) {
        var me = this,
            msgButtons = me.msgButtons;

        me.callParent(arguments);

        for (var i = 0; i < 4; i++)
            msgButtons[i].removeCls(me.defaultButtonCls);

        if ('defaultButton' in cfg) {
            msgButtons[cfg.defaultButton].addCls(me.defaultButtonCls);
        }
        else {
            for (var i = 0; i < 4; i++) {
                if (!msgButtons[i].isHidden()) {
                    msgButtons[i].addCls(me.defaultButtonCls);
                    return;
                }
            }
        }
    },

    btnCallback: function (btn, event) {
        var me = this,
            msgButtons = me.msgButtons;

        if (event && event.type == 'keydown') { //回车总是出发缺省按钮（而不是当前focus按钮）
            Ext.each(msgButtons, function (button) {
                if (button.hasCls(me.defaultButtonCls)) {
                    btn = button;
                    return false;
                }
            });
        }

        me.callParent([btn, event]);
    }
});

YZSoft.util.pad = function (n) {
    return n < 10 ? '0' + n : n;
};

Date.prototype.toString = function () {
    //return this.format('Y-m-d H:i:s');以下代码效率更高
    var pad = YZSoft.util.pad;
    return this.getFullYear() + '-' +
                pad(this.getMonth() + 1) + '-' +
                pad(this.getDate()) + ' ' +
                pad(this.getHours()) + ':' +
                pad(this.getMinutes()) + ':' +
                pad(this.getSeconds());
};

Ext.JSON.encodeDate = function (o) {
    return '"' + o.toString() + '"';
};

Number.prototype.toFileSize = function () {
    var dw = ['KB', 'MB', 'GB', 'TB']
    var result = Math.ceil(this / 1024) + ' ' + dw[0]
    for (var i = 1; i < dw.length; i++) {
        var c = (this / Math.pow(1024, i + 1)).toFixed(2)
        if (c < 1) return result
        result = c + ' ' + dw[i]
    }
    return result
}

Ext.applyIf(String, {
    Equ: function (str1, str2) {
        if (Ext.isString(str1) && Ext.isString(str2))
            return ((str1 || '').toLowerCase() == (str2 || '').toLowerCase());
        else
            return str1 == str2;
    }
});

Ext.apply(Ext.form.VTypes, {
    objname: function (val, field) {
        var err = $objname(val);
        return err === true;
    },

    daterange: function (val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return false;
        }

        if (field.startDateField) {
            var start = Ext.getCmp(field.startDateField);
            if (!start.maxValue || start.maxValue.getTime() != date.getTime()) {
                start.setMaxValue(date);
                start.validate();
            }
        }
        else if (field.endDateField) {
            var end = Ext.getCmp(field.endDateField);
            if (!end.minValue || end.minValue.getTime() != date.getTime()) {
                end.setMinValue(date);
                end.validate();
            }
        }
        return true;
    },

    password: function (val, field) {
        if (field.initialPassField) {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },

    objnameText:Ext.String.format(RS.$('All_ObjectNameIncludeInvalidChar'), '\\\/:*?"<>|'),
    passwordText: RS.$('All_PwdCfm_Diff')
});

Ext.define('YZSoft.Utility', {
    singleton: true,

    isNumber: function (w) {
        if (Ext.isNumber(w))
            return true;

        if (!Ext.isString(w))
            return false;

        var l = w.length, d;

        for (var i = 0; i < l; i++) {
            if (!d && i >= 15) //超过16位
                return false;

            var c = w.charCodeAt(i);


            if (c == 46) {
                if (d) { return false; } else { d = true; }
            }
            else if (c < 48 || c > 57)
                return false;
        }
        return !(l == 0 || (!d && l != 1 && w.charCodeAt(0) == 48));
    },

    isString: function (w) {
        if (!Ext.isString(w))
            return false;

        w = Ext.String.trim(w);

        var l = w.length;
        if (l < 2)
            return false;

        var s = w.charAt(0),
            e = w.charAt(l - 1);

        return (s == e && (s == '\'' || s == '"'));
    },

    isConstant: function (w) {
        return this.isNumber(w) || this.isString(w);
    },

    getConstantValue: function (w) {
        if (this.isNumber(w))
            return Number(w);

        if (this.isString(w)){
            w = Ext.String.trim(w);
            return w.substr(1, w.length - 2);
        }

        return null;
    },

    combineDate: function (date, time) {
        if (!date || !time)
            return null;

        if (!Ext.isDate(date) || !Ext.isDate(time))
            return null;

        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
    }
});

YZSoft.HttpUtility = {
    htmlEncode: function (str, returnToBR) {
        var rv = Ext.util.Format.htmlEncode(str);
        if (returnToBR && rv)
            rv = rv.replace(/(\r\n|\n\r|\n|\r)/g, '<br/>');
        return rv;
    },

    htmlDecode: function (str) {
        var rv = Ext.util.Format.htmlDecode(str);
    },

    jsEncode: function (str) {
        var rv = '';
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            switch (c) {
                case '\"':
                    rv += "\\\"";
                    break;
                case '\'':
                    rv += "\\\'";
                    break;
                case '\\':
                    rv += "\\\\";
                    break;
                case '\b':
                    rv += "\\b";
                    break;
                case '\f':
                    rv += "\\f";
                    break;
                case '\n':
                    rv += "\\n";
                    break;
                case '\r':
                    rv += "\\r";
                    break;
                case '\t':
                    rv += "\\t";
                    break;
                default:
                    rv += c;
            }
        }
        return rv;
    },

    inlineJSEncode: function (str) {
        return YZSoft.HttpUtility.jsEncode(YZSoft.HttpUtility.htmlEncode(str));
    },

    parseKeyValue: function (str, splitchar, lowercaseName) {
        str = str || '';
        splitchar = splitchar || '';
        var splen = splitchar.length;
        var idx = str.indexOf(splitchar);
        var rv = {};
        if (idx == -1) {
            rv.key = '';
            rv.value = Ext.String.trim(str || '');
        }
        else {
            rv.key = Ext.String.trim(str.substring(0, idx) || '');
            rv.value = Ext.String.trim(str.substring(idx + splen));
        }

        if (lowercaseName)
            rv.key = rv.key.toLowerCase();

        return rv;
    },

    attrDecode: function (str) {
        if (!str || str.indexOf('&') == -1)
            return str;

        var chs = [];
        var count = str.length;
        for (var i = 0; i < count; i++) {
            var ch = str.charAt(i);
            if (ch == '&') {
                var index = str.indexOf('#', i);
                if (index != -1) {
                    var flag = str.substring(i + 1, index - i - 1).toLowerCase();
                    if (flag == 'amp') { chs.push("&"); i += 3; continue; }
                    if (flag == 'cln') { chs.push(":"); i += 3; continue; }
                    if (flag == 'sem') { chs.push(";"); i += 3; continue; }
                    if (flag == 'cma') { chs.push(","); i += 3; continue; }
                    if (flag == 'gt') { chs.push(">"); i += 2; continue; }
                }
            }

            chs.push(ch);
        }

        return chs.join('');
    } 
};

YZSoft.Render = {
    getUserDisplayName: function (account, displayName) {
        if (!displayName)
            return account;
        else
            return displayName + '(' + account + ')';
    },

    renderString: function (value) {
        value = (!value && value !== 0) ? '' : value;
        return YZSoft.HttpUtility.htmlEncode(value, true);
    },


    renderUserName: function (account, displayName) {
        return YZSoft.HttpUtility.htmlEncode(YZSoft.Render.getUserDisplayName(account, displayName));
    },

    renderHandlingTime: function (minutes) {
        if (minutes == -1)
            return RS.$('All_HandlingTime_NoCal');

        var h = Math.floor(minutes / 60);
        var m = minutes % 60;

        var rv = '';
        if (h)
            rv += h + RS.$('All_UnitHour');

        if (m)
            rv += m + RS.$('All_UnitMinute');

        if (rv.length == 0)
            rv = RS.$('All_LTOneMinute');

        return rv;
    },

    renderDateYMD: function (date) {
        return Ext.Date.format(date, 'Y-m-d');
    },

    renderDateYMDHM: function (date) {
        return Ext.Date.format(date, 'Y-m-d H:i');
    },

    renderFileSize: function (size) {
        return size.toFileSize();
    },

    renderSIDType: function (value) {
        return RS.$('All_Enum_SIDType_' + value)
    },

    renderCode5: function (value, encode) {
        if (encode !== false)
            encode = true;

        if (Ext.isString(value)) {
            return '"' + (encode ? YZSoft.HttpUtility.htmlEncode(value, false) : value) + '"';
        }
        else if (Ext.isObject(value)) {
            if (encode)
                return '<span class="yz-grid-cell-codetext">' + YZSoft.HttpUtility.htmlEncode(value.CodeText) + '</span>';
            else
                return value.CodeText;
        }
        else
            return value;
    },

    renderCode: function (value, encode) {
        if (encode !== false)
            encode = true;

        if (Ext.isString(value)) {
            return '"' + (encode ? YZSoft.HttpUtility.htmlEncode(value, false) : value) + '"';
        }
        else if (Ext.isObject(value)) {
            if (encode)
                return '<span class="yz-grid-cell-codetext">' + YZSoft.HttpUtility.htmlEncode(value.code) + '</span>';
            else
                return value.code;
        }
        else
            return value;
    }
};

Ext.define('YZSoft.Data.JsonLoader', {
    extend: Ext.util.Observable,
    constructor: function (config) {
        Ext.apply(this, config);
        this.callParent(config);
    },

    load: function (params) {
        Ext.Ajax.request({
            method: 'GET',
            disableCaching: true,
            async: false,
            url: this.url,
            params: this.params,
            scope: this,
            success: function (response) {
                this.json = Ext.util.JSON.decode(response.responseText);
                return this.json;
            }
        });
    }
});

/*
支持storeexception显示
showStoreErr: true,{cls:'my-grid-errmsg'} default false
*/
Ext.define('YZSoft.override.grid.Panel', {
    override: 'Ext.grid.Panel',
    bufferedRenderer: false,
    showStoreErr: false,
    errCls: 'yz-grid-errmsg',
    headerBorders: false,
    rowLines: true,
    border: false,

    initComponent: function () {
        var me = this,
            store = me.getStore();

        me.callParent(arguments);

        if (me.showStoreErr && store) {
            var proxy = store.getProxy();
            proxy.on({
                exception: function (proxy, request, operation, eOpts) {
                    me.onStoreErr(Ext.isObject(operation.error) ? operation.error.statusText : operation.error);
                }
            });

            store.on({
                beforeload: function () {
                    if (me.errEl)
                        me.errEl.hide();
                }
            });
        }
    },

    onStoreErr: function (errorMessage) {
        var me = this,
            errCfg = me.showStoreErr;

        if (!Ext.isObject(errCfg)) {
            errCfg = {
                cls: me.errCls,
                errorMessage: errorMessage
            }
        }

        me.showError(errCfg);
    },

    showError: function (errCfg) {
        var me = this;

        var html = Ext.String.format('<div class="{0} yz-grid-errmsg-default"><div class="yz-grid-errmsg-wrap"><div class="yz-grid-errmsg-text">{1}</div></div></div>',
            errCfg.cls,
            RS.$1(errCfg.errorMessage));

        if (!me.errEl) {
            me.errEl = Ext.get(Ext.core.DomHelper.insertHtml('beforeEnd', me.getView().getTargetEl().dom, html));
        }
        else {
            me.errEl.show();
            me.errEl.down('.yz-grid-errmsg-text', true).innerHTML = RS.$1(errCfg.errorMessage);
        }
    },

    destroy: function () {
        var me = this;
        if (me.errEl)
            me.errEl.destroy();
        me.callParent(arguments);
    },

    moveSelectionUp: function () {
        var sm = this.getSelectionModel(),
            store = this.getStore();

        if (sm && store) {
            for (var i = 1; i < store.getCount(); i++) {
                if (sm.isSelected(i)) {
                    var r = store.getAt(i);
                    store.removeAt(i);
                    store.insert(i - 1, r);

                    sm.select(i - 1, true);
                }
            }
        }
    },

    moveUp: function (records, step) {
        var records = Ext.isArray(records) ? records : [records],
            store = this.getStore();

        step = step || 1;

        if (store) {
            for (var i = step; i < store.getCount(); i++) {
                var r = store.getAt(i);
                if (Ext.Array.contains(records, r)) {
                    store.removeAt(i);
                    store.insert(i - step, r);
                }
            }

            this.getView().refresh();
        }
    },

    moveSelectionDown: function () {
        var sm = this.getSelectionModel();
        var store = this.getStore();

        if (sm && store) {
            for (var i = store.getCount() - 1; i >= 0; i--) {
                if (sm.isSelected(i)) {
                    var r = store.getAt(i);
                    store.removeAt(i);
                    store.insert(i + 1, r);

                    sm.select(i + 1, true);
                }
            }
        }
    },

    moveDown: function (records, step) {
        var records = Ext.isArray(records) ? records : [records],
            store = this.getStore();

        step = step || 1;

        if (store) {
            for (var i = store.getCount() - 1; i >= 0; i--) {
                var r = store.getAt(i);
                if (Ext.Array.contains(records, r)) {
                    store.removeAt(i);
                    store.insert(i + step, r);
                }
            }

            this.getView().refresh();
        }
    },

    removeAllSelection: function () {
        this.store.remove(this.getSelectionModel().getSelection());
    },

    canEdit: function () {
        var sm = this.getSelectionModel();
        return (sm && sm.getCount() == 1);
    },

    canDelete: function () {
        var sm = this.getSelectionModel();
        return (sm && sm.getCount() >= 1);
    },

    canMoveUp: function () {
        var sm = this.getSelectionModel();
        return (sm && sm.getCount() >= 1 && !sm.isSelected(0));
    },

    canMoveDown: function () {
        var sm = this.getSelectionModel(),
            store = this.getStore();
        return (sm && store && sm.getCount() >= 1 && !sm.isSelected(store.getCount() - 1));
    },

    addRecords: function (recs, select, equFn, useNewAdded) {
        if (!recs)
            return;

        var recs = Ext.isArray(recs) ? recs : [recs],
            select = select !== false,
            me = this,
            nrecs = [],
            addedrecs = [],
            model = me.store.getModel(),
            equFn = equFn || model.equFn;

        Ext.each(recs, function (rec) {
            rec = rec.data || rec;

            var nrec = null;
            if (equFn) {
                me.store.each(function (recStore) {
                    if (equFn.call(recStore, recStore.data, rec)) {
                        nrec = recStore;
                        return false;
                    }
                });
            }
            else {
                var nrec = me.store.getById(model.getIdFromData(rec));
            }

            if (!nrec) {
                nrec = me.store.add(rec)[0];
                addedrecs.push(nrec);
            }

            nrecs.push(nrec);
        });

        var rv = useNewAdded ? addedrecs : nrecs;
        if (select)
            me.getSelectionModel().select(rv);

        return rv;
    },

    syncRecords: function (srcStore, recs, select, equFn) {
        if (!recs)
            return;

        var recs = Ext.isArray(recs) ? recs : [recs],
            select = select !== false,
            me = this,
            removeRecs = [],
            tagStore = me.getStore(),
            model = tagStore.getModel(),
            equFn = equFn || model.equFn;

        tagStore.each(function (tagRec) {
            var srcRec = srcStore.getData().findBy(function (srcRec) {
                if (equFn)
                    return equFn.call(tagRec, srcRec.data, tagRec.data);
                else
                    return model.getIdFromData(srcRec.data) == tagRec.getId();
            });

            if (srcRec) {
                var rec = Ext.Array.findBy(recs, function (selRec) {
                    if (equFn)
                        return equFn.call(srcRec, srcRec.data, selRec.data);
                    else
                        return model.getIdFromData(srcRec.data) == model.getIdFromData(selRec.data);
                });

                if(!rec)
                    removeRecs.push(tagRec);
            }
        });

        tagStore.remove(removeRecs);
        recs = me.addRecords(recs, false, equFn, true);
        me.getSelectionModel().select(recs);
    }
});

Ext.define('YZSoft.override.view.Table', {
    override: 'Ext.view.Table',
    stripeRows: true
});

Ext.define('YZSoft.ViewManager', {
    singleton: true,

    getModuleTab: function (sender) {
        return sender.up('[cls~=yz-s-module-tab]');
    },

    getModuleContainer: function (sender) {
        return sender.up('[cls~=yz-s-module-cnt]');
    },

    addView: function (sender, xclass, config, showFn, createFn) {
        var me = this,
            tab = me.getModuleTab(sender),
            pnl;

        if (config.id) {
            config.id = tab.id + '-' + config.id;
            pnl = tab.getComponent(config.id);
        }

        if (pnl) {
            pnl.show();
            showFn && showFn(pnl);
        }
        else {
            config = Ext.apply(config, {
                closable: true,
                border: false
            });

            pnl = Ext.create(xclass, config);

            pnl.on({
                single: true,
                afterrender: function () {
                    if (this.onActivate) {
                        this.activateTime = 1;
                        this.onActivate.apply(this, [0])
                    }
                }
            });

            tab.add(pnl);
            tab.layout.setActiveItem(pnl);
            createFn && createFn(pnl);
        }

        return pnl
    },

    find: function (sender, id) {
        var me = this,
            tab = me.getModuleTab(sender),
            pnl = tab.getComponent(id);

        if (pnl)
            return pnl;
    },

    add: function (sender, panel) {
        var me = this,
            tab = me.getModuleTab(sender);

        tab.add(panel);
        tab.layout.setActiveItem(panel);
    },

    show: function (panel) {
        panel.show();
    }
});

YZSoft.UIHelper = {
    IsOptEnable: function (pnl, grid, permName, minSelection, maxSelection) {
        if (arguments.length >= 6)
            return YZSoft.UIHelper.IsOptEnableExt.apply(this, arguments);

        if (!Ext.isEmpty(permName)) {
            //模块权限
            if (!grid || (pnl && pnl.perm && Ext.isDefined(pnl.perm[permName]))) {
                if (!pnl.perm[permName])
                    return false;
            }
            else { //记录权限或未定义的权限
                var sm = grid.getSelectionModel();
                var recs = sm.getSelection() || [];

                for (var i = 0; i < recs.length; i++) {
                    if (!Ext.isObject(recs[i].data.perm)) //记录上未给出权限信息,开发过程中可能未定义权限，故允许请求的操作
                        break;

                    if (recs[i].data.perm[permName] !== true)  //当前记录不允许请求的权限
                        return false;
                }
            }
        }

        //权限允许的情况下检查选中项数量要求
        return YZSoft.UIHelper.IsOptEnableNoPerm(grid, minSelection, maxSelection);
    },

    IsOptEnableExt: function (modulePerm, modulePermName, sm, recordPermName, minSelection, maxSelection) {

        sm = sm.getSelectionModel ? sm.getSelectionModel() : sm;

        if (modulePermName) {
            if (!modulePerm || modulePerm[modulePermName] !== true)
                return false;
        }

        if (recordPermName) {
            var recs = sm.getSelection() || [];

            for (var i = 0; i < recs.length; i++) {
                if (recs[i].data.perm[recordPermName] !== true)
                    return false;
            }
        }

        //权限允许的情况下检查选中项数量要求
        return YZSoft.UIHelper.IsOptEnableNoPerm(sm, minSelection, maxSelection);
    },

    IsOptEnableNoPerm: function (sm, minSelection, maxSelection) {
        sm = sm.getSelectionModel ? sm.getSelectionModel() : sm;
        minSelection = minSelection || 0;
        maxSelection = maxSelection || -1;

        //对是否选择无要求
        if (minSelection == 0 && maxSelection == -1)
            return true;

        var recs = sm.getSelection() || [];

        //未满足最少选择项要求
        if (recs.length < minSelection)
            return false;

        //未满足最多选择项要求
        if (maxSelection != -1 && recs.length > maxSelection)
            return false;

        return true;
    }
};

/*****bug修正********/
Ext.define('YZSoft.override.LoadMask', {
    override: 'Ext.LoadMask',

    getStoreListeners: function (store) {

        //beforeLoad -> beforeload
        var rv = this.callParent(arguments);
        if (rv.beforeLoad) {
            rv.beforeload = rv.beforeLoad;
            delete rv.beforeLoad;
        }

        return rv;
    }
});

Ext.define('Ext.override.selection.Model', {
    override: 'Ext.selection.Model',

    reselect: function (selection) {
        if (!selection)
            return;

        var me = this,
            recs = me.getSelection(),
            model = me.store.getModel(),
            orecs = new Ext.util.MixedCollection(),
            nrecs = new Ext.util.MixedCollection();

        Ext.each(recs, function (rec) {
            orecs.add(rec.getId(), rec);
        });

        Ext.each(selection, function (data) {
            var id = model.getIdFromData(data);
            nrecs.add(id, data);
        });

        //delete selection
        Ext.each(recs, function (rec) {
            if (nrecs.indexOfKey(rec.getId()) == -1)
                me.deselect(rec);
        });

        //add new selection
        Ext.each(selection, function (data) {
            var id = model.getIdFromData(data);
            if (orecs.indexOfKey(id) == -1) {
                var rec = me.store.getById(id);
                if (rec)
                    me.select(rec);
            }
        });
    }
});

/*
store.load(operation) 支持同步加载
operation.async : false
*/
Ext.define('Ext.override.data.ProxyStore', {
    override: 'Ext.data.ProxyStore',

    load: function (options) {
        var me = this,
            oldvalue, rv;

        if (options && options.async == false) {
            oldvalue = me.getAsynchronousLoad();
            me.setAsynchronousLoad(false);
            rv = me.callParent(arguments);
            me.setAsynchronousLoad(oldvalue);
            return rv;
        }
        else {
            return me.callParent(arguments);
        }
    }
});

Ext.define('Ext.override.data.proxy.Server', {
    override: 'Ext.data.proxy.Server',

    buildRequest: function (operation) {
        var request = this.callParent(arguments);

        if (operation.config && operation.config.async === false)   //只在必要的时候设置，以免覆盖缺省状态
            request.async = operation.config.async;

        return request;
    }
});

Ext.define('Ext.override.data.Request', {
    override: 'Ext.data.Request',

    getCurrentConfig: function () {
        var config = this.callParent(arguments);

        if (this.async === false) //只在必要的时候设置，以免覆盖缺省状态
            config.async = this.async;

        return config;
    }
});

/*
增加枚举类型支持(union存储)
example:
--YZSoft.bpm.src.model.Participant
    { name: 'LeaderType', yzenum: { type: 'BPM.ParticipantLeaderType', store: 'LParam1'} }
*/
Ext.define('Ext.override.data.Model', {
    override: 'Ext.data.Model',

    get: function (fieldName) {
        var field = this.getField(fieldName);
        if (field && field.yzenum) {
            var v = this.get(field.yzenum.store);
            return YZSoft.Enum.VTOS(field.yzenum.type, v);
        }

        return this.callParent(arguments);
    },

    set: function (fieldName, newValue, options) {
        var field = this.getField(fieldName),
            rv;
        if (field && field.yzenum) {
            var v = YZSoft.Enum.STOV(field.yzenum.type, newValue);
            rv = this.set(field.yzenum.store, v);
        }
        else
            rv = this.callParent(arguments);

        if (this.fireEvent)
            this.fireEvent(fieldName + 'changed', newValue);
    }
});

/*
config:
dateFormat :日期类型缺省Y-m-d
convert    :example:{Unknown:''}
emptyText  true 使用缺省值：<span style="color:#999">未设置</span>
*/
Ext.define('YZSoft.override.form.field.Display', {
    override: 'Ext.form.field.Display',
    dateFormat: 'Y-m-d',

    getDisplayValue: function () {
        var me = this,
            value = me.getRawValue();

        if (!me.renderer) {
            if (Ext.isDate(value))
                return Ext.Date.format(value, me.dateFormat);

            if (me.convert) {
                if (me.convert.hasOwnProperty(value))
                    return me.emptyConvert(me.convert[value]);
            }
        }

        return me.emptyConvert(me.callParent(arguments));
    },

    emptyConvert: function (display) {
        if (Ext.isEmpty(display) && this.emptyText) {
            if (this.emptyText === true)
                display = Ext.String.format('<span style="color:#999">{0}</span>',RS.$('All_DisplayFieldEmptyText'));
            else
                display = this.emptyText;
        }

        return display;
    }
});

Ext.define('YZSoft.override.grid.column.Check', {
    override: 'Ext.grid.column.Check',

    processEvent: function (type, view, cell, recordIndex, cellIndex, e, rec, row) {
        var disableDataIndex = this.disableDataIndex,
            rv;

        if (disableDataIndex) {
            var disabledSaved = this.disabled;
            this.disabled = rec.data[disableDataIndex] === true;

            rv = this.callParent(arguments);

            this.disabled = disabledSaved;
        }
        else {
            rv = this.callParent(arguments);
        }
        return rv;
    },

    renderer: function (value, p, rec) {
        var disableDataIndex = this.disableDataIndex,
            rv;

        if (disableDataIndex) {
            var disabledSaved = this.disabled;
            this.disabled = rec.data[disableDataIndex] === true;

            rv = this.defaultRenderer(value, p, rec);

            this.disabled = disabledSaved;
        }
        else {
            rv = this.defaultRenderer(value, p, rec);
        }
        return rv;
    }
});

Ext.define('YZSoft.override.Element', {
    override: 'Ext.Element',

    scrollIntoView: function (container, hscroll) {
        var c = Ext.getDom(container) || Ext.getBody().dom,
            el = this.dom,
            o = this.getOffsetsTo(c),
            l = o[0] + c.scrollLeft,
            t = o[1] + c.scrollTop,
            b = t + el.offsetHeight + 40,
            r = l + el.offsetWidth,
            ch = c.clientHeight,
            ct = parseInt(c.scrollTop, 10),
            cl = parseInt(c.scrollLeft, 10),
            cb = ct + ch,
            cr = cl + c.clientWidth;

        if (el.offsetHeight > ch || t < ct) {
            c.scrollTop = t;
        }
        else if (b > cb) {
            c.scrollTop = b - ch;
        }

        c.scrollTop = c.scrollTop;

        if (hscroll !== false) {
            if (el.offsetWidth > c.clientWidth || l < cl) {
                c.scrollLeft = l;
            }
            else if (r > cr) {
                c.scrollLeft = r - c.clientWidth;
            }
            c.scrollLeft = c.scrollLeft;
        }
        return this;
    }
});

/*
增加 spellcheck属性，缺省false
*/
Ext.define('YZSoft.override.form.field.Base', {
    override: 'Ext.form.field.Base',
    spellcheck: false,
    preventAutoFill: true,

    getSubTplData: function (fieldData) {
        var me = this,
            data = me.callParent(arguments);

        data.inputAttrTpl += ' spellcheck="' + me.spellcheck + '"';

        if (me.preventAutoFill) {
            if ((me.inputType || '').toLowerCase() == 'password')
                data.inputAttrTpl += ' autocomplete="new-password"';
        }

        return data;
    }
});

/*
lineArray true/false:value是line array
*/
Ext.define('YZSoft.override.form.field.TextArea', {
    override: 'Ext.form.field.TextArea',
    lineArray: false,

    setValue: function (value) {
        if (this.lineArray === true && Ext.isArray(value))
            value = value.join('\r\n');

        return this.callParent([value]);
    },

    getValue: function () {
        var val = this.callParent(arguments);

        if (this.lineArray === true)
            return (val || '').replace(/\r\n/g, '\n').split('\n');
        else
            return val;
    }
});

/*
config
clicksToEdit 3:模式3，当前行选中，鼠标单击后在规定时间内未发生双击启动编辑
             false:不启用点击编辑
editDelay - 编辑延时,缺省350
events:
beforeedit column editor将会接受到beforeedit事件
*/
Ext.define('YZSoft.override.grid.plugin.CellEditing', {
    override: 'Ext.grid.plugin.CellEditing',
    editDelay: 350,

    constructor: function (config) {
        var me = this;

        if (config.clicksToEdit === false) {
            Ext.apply(config, {
                triggerEvent: 'yzstartedit',
                clicksToEdit: 1
            });
        }

        me.callParent([config]);

        me.on({
            beforeedit: function (editor, context, eOpts) {
                var celleditor = editor.getEditor(context.record, context.column);

                me.context = context; //deactive时异常修复
                return celleditor.field.fireEvent('beforeedit', context, editor);
            }
        });
    },

    initEditTriggers: function () {
        var me = this;

        if (me.clicksToEdit === 3)
            me.triggerEvent = 'yzcellstartedit'

        me.callParent(arguments);

        if (me.clicksToEdit === 3) {
            me.mon(me.view, 'beforecellclick', function (view, cell, colIdx, record, row, rowIdx, e) {
                if (me.grid.getSelectionModel().isRowSelected(record)) {
                    me.defer = Ext.defer(function () {
                        if (me.defer)
                            me.view.fireEvent('yzcellstartedit', view, cell, colIdx, record, row, rowIdx,e);
                    }, me.editDelay);
                }
            }, me);

            me.mon(me.view, 'celldblclick', function () {
                if (me.defer) {
                    clearTimeout(me.defer);
                    delete me.defer;
                }
            }, me);
        }
    }
});

Ext.define('YZSoft.override.form.Panel', {
    override: 'Ext.form.Panel',

    getValuesSubmit: function () {
        return this.getForm().getValues(false,false,false,true,true);
    }
});

Ext.define('YZSoft.override.form.CheckboxGroup', {
    override: 'Ext.form.CheckboxGroup',
    returnArray: false,

    getModelData: function () {
        if (this.returnArray) {
            var values = {},
                boxes = this.getBoxes(),
                b,
                bLen = boxes.length,
                box, name, inputValue, bucket;

            for (b = 0; b < bLen; b++) {
                box = boxes[b];
                name = box.getName();
                inputValue = box.inputValue;
                if (box.getValue()) {
                    if (values.hasOwnProperty(name)) {
                        bucket = values[name];
                        if (!Ext.isArray(bucket)) {
                            bucket = values[name] = [
                                    bucket
                                ];
                        }
                        bucket.push(inputValue);
                    } else {
                        values[name] = [inputValue];
                    }
                }
                else {
                    values[name] = values[name] || [];
                }
            }
            return values;
        }
        else
            return this.callParent(arguments);
    }
});

Ext.define('YZSoft.override.selection.TreeModel', {
    override: 'Ext.selection.TreeModel',

    selectByPhyPath: function (path, fn, deep) {
        var me = this,
            paths = path.split('/'),
            store = me.getStore(),
            deep = deep || 0,
            node = store.getRoot();

        for (var i = 2; i < paths.length; i++) {
            var text = paths[i],
                child = node.findChild('text', text);

            if (child) {
                if (i == paths.length - 1) {
                    var selected = me.isSelected(child);
                    me.select(child);
                    fn && fn(child, selected);
                    return child;
                }
                else {
                    node = child;
                    continue;
                }
            }
            else {
                //防止死循环，这加了，另一人删除了，就会变成死循环。
                if (deep > paths.length)
                    return;

                if (node.isExpanded()) {
                    store.load({
                        node: node,
                        callback: function () {
                            me.selectByPhyPath(path, fn, deep + 1);
                        }
                    });
                }
                else {
                    node.expand(false, function () {
                        me.selectByPhyPath(path, fn, deep + 1);
                    }, me);
                }
            }
        }
    }
});

Ext.define('YZSoft.override.grid.column.RowNumberer', {
    override: 'Ext.grid.column.RowNumberer',
    desc: false,

    defaultRenderer: function (value, metaData, record, rowIdx, colIdx, dataSource, view) {
        if (this.desc) {
            var rowspan = this.rowspan,
                page = dataSource.currentPage,
                result = view.store.getCount() - view.store.indexOf(record) - 1;

            if (metaData && rowspan) {
                metaData.tdAttr = 'rowspan="' + rowspan + '"';
            }

            return result + 1;
        }

        return this.callParent(arguments);
    }
});

YZSoft.SelUserDlg = {
    show: function () {
        var dlg = YZSoft.SelUserDlg = Ext.create('YZSoft.bpm.src.dialogs.SelUserDlg', {
            closeAction: 'hide'
        });

        dlg.show.apply(dlg, arguments);
    }
};

YZSoft.SelUsersDlg = {
    show: function () {
        var dlg = YZSoft.SelUsersDlg = Ext.create('YZSoft.bpm.src.dialogs.SelUsersDlg', {
            closeAction: 'hide'
        });

        dlg.show.apply(dlg, arguments);
    }
};

YZSoft.SelMemberDlg = {
    show: function () {
        var dlg = YZSoft.SelMemberDlg = Ext.create('YZSoft.bpm.src.dialogs.SelMemberDlg', {
            closeAction: 'hide'
        });

        dlg.show.apply(dlg, arguments);
    }
};

YZSoft.SelMembersDlg = {
    show: function () {
        var dlg = YZSoft.SelMembersDlg = Ext.create('YZSoft.bpm.src.dialogs.SelMembersDlg', {
            closeAction: 'hide'
        });

        dlg.show.apply(dlg, arguments);
    }
};

Ext.apply(YZSoft, {
    showSitemap: function (url) {
        var panel = Ext.create('YZSoft.src.panel.SiteMapPanel', {
            url: url,
            backPanel: YZSoft.frame123.getLayout().getActiveItem()
        });
        YZSoft.frame123.add(panel);
        YZSoft.frame123.getLayout().setActiveItem(panel);
    }
});

//支持复杂类型,ComboBox value在Object类型下setValue无法选中值
Ext.define('YZSoft.override.form.field.ComboBox', {
    override: 'Ext.form.field.ComboBox',

    setValue: function (v) {
        if (this.value2Record)
            v = this.value2Record(this,v);
        this.callParent([v]);
    }
});

Ext.apply(YZSoft, {
    goto: function (moduleids, callback, scope) {

        var mainTab = YZSoft.mainTab,
            moduleids = Ext.isArray(moduleids) ? moduleids : moduleids.split('/');

        mainTab && mainTab.goto && mainTab.goto(moduleids, callback, scope);
    },
    logout: function () {
        var params = {
            action:'logout',
            ReturnUrl: window.location.href
        };
        window.location.href = Ext.String.urlAppend(YZSoft.loginUrl, Ext.Object.toQueryString(params));
    },
    changeuser: function () {
        window.location.href = Ext.String.format('{0}?action=changeuser', YZSoft.loginUrl);
    }
});

//支持自定义Class Namespace,例如 Demo、XYSoft,将使用和YZSoft并列的目录
Ext.define('YZSoft.override.Inventory', {
    override: 'Ext.Inventory',

    getPath: function (className) {
        var me = this,
            paths = me.paths,
            ret = '',
            prefix;

        if (className in paths) {
            ret = paths[className];
        } else {
            prefix = me.getPrefix(className);

            if (prefix) {
                className = className.substring(prefix.length + 1);
                ret = paths[prefix];
            }
            if (!prefix) {
                var names = className.split('.');
                if (names.length >= 1) {
                    prefix = names[0];
                    if (prefix != 'YZSoft') {
                        className = className.substring(prefix.length + 1);
                        ret = YZSoft.$url(prefix);
                    }
                }
            }

            if (ret)
                ret += '/';

            ret += className.replace(me.dotRe, '/') + '.js';
        }

        return ret;
    }
});

Ext.define('YZSoft.override.tree.Panel', {
    override: 'Ext.tree.Panel',

    expandTo: function (rec, options) {
        options = options || {};

        var me = this,
            index = 0,
            current = me.getRootNode(),
            view = me.getView(),
            callback = options.callback,
            scope = options.scope,
            path = [];

        while (rec) {
            path = Ext.Array.insert(path, 0, [rec]);
            rec = rec.parentNode;
        }

        expander = function (newChildren) {
            var node = this,
                len, i, value;

            // We've arrived at the end of the path.
            if (++index === path.length) {
                view.getSelectionModel().select(node);
                return Ext.callback(callback, scope || me, [true, node, view.getNode(node)]);
            }

            // Find the next child in the path if it's there and expand it.
            for (i = 0, len = newChildren ? newChildren.length : 0; i < len; i++) {
                var cnode = newChildren[i];
                if (cnode === path[index]) {
                    return cnode.expand(false, expander);
                }
            }

            // If we get here, there's been a miss along the path, and the operation is a fail.
            node = this;
            Ext.callback(callback, scope || me, [false, node, view.getNode(node)]);
        };
        current.expand(false, expander);
    }
});

Ext.define('YZSoft.override.Object', {
    override: 'Ext.Object',

    findAll: function (obj, fn, scope, result) {
        var me = this;

        result = result || [];

        if (Ext.isArray(obj)) {
            Ext.Array.each(obj, function (obj) {
                me.findAll(obj, fn, scope, result);
            });
        }
        else if (Ext.isSimpleObject(obj)) {
            if (fn.call(null, obj) === true) {
                result.push(obj);
            }
            else {
                for (property in obj) {
                    if (obj.hasOwnProperty(property))
                        me.findAll(obj[property], fn, scope, result);
                }
            }
        }

        return result;
    }
});

Ext.define('YZSoft.override.button.Button', {
    override: 'Ext.button.Button',
    config: {
        badgeText: null
    },
    _hasBadgeCls: 'yz-hasbadge',
    _noBadgeCls: 'yz-nobadge',
    afterTpl: [
        '<span id="{id}-badgeEl" data-ref="badgeEl" class="yz-badge">' +
            ' {badgeText}' +
        '</span>'
    ],

    initComponent: function () {
        var me = this,
            badgeText = me.badgeText;

        me[badgeText ? 'addCls' : 'removeCls'](me._hasBadgeCls);
        me[badgeText ? 'removeCls' : 'addCls'](me._noBadgeCls);

        me.callParent(arguments);
    },

    doToggle: function () {
        var me = this;

        if (me.enableToggle && me.allowDepress === false && me.pressed)
            me.fireEvent('clickOnPressedState', me);

        me.callParent(arguments);
    },

    getTemplateArgs: function () {
        var me = this,
            rv;

        rv = me.callParent(arguments);

        Ext.apply(rv, {
            badgeText: me.badgeText
        });

        return rv;
    },

    getAfterMarkup: function (values) {
        return this.getTpl('afterTpl').apply(values);
    },

    updateBadgeText: function (badgeText, oldText) {
        var me = this,
            badgeEl;

        badgeText = badgeText == null ? '' : String(badgeText);
        oldText = oldText || '';

        if (me.rendered) {
            me[badgeText ? 'addCls' : 'removeCls'](me._hasBadgeCls);
            me[badgeText ? 'removeCls' : 'addCls'](me._noBadgeCls);

            badgeEl = me.el.down('.yz-badge', true);
            badgeEl.innerHTML = badgeText;
        }
    }
});

Ext.define('YZSoft.override.draw.engine.Canvas', {
    override: 'Ext.draw.engine.Canvas',

    afterCachedConfig: function () {
        this.callParent(arguments);

        var me = this,
            i, ln = me.canvases.length;

        for (i = 0; i < ln; i++) {
            me.contexts[i] = null;
            me.canvases[i].destroy();
            me.canvases[i] = null;
        }
        me.contexts = [];
        me.canvases = [];
    }
});

Ext.define('YZSoft.override.form.field.ComboBox', {
    override: 'Ext.form.field.ComboBox',

    getGrowWidth: function () {
        var me = this,
            filters = [],
            rv;

        me.store.getFilters().each(function (filter) {
            filters.push(filter);
        });
        me.store.clearFilter(true);

        rv = me.callParent();

        me.store.addFilter(filters,true);
        return rv;
    }
});

Ext.define('YZSoft.override.Format', {
    override: 'Ext.util.Format',
    currencyPrecision: 2,
    currencyAtEnd: false,

    mediaDurationM: function (value) {
        var m = Math.floor(value / 60),
            s = Math.floor(value % 60),
            rv = '';

        if (m > 0) {
            rv += m + "'";
            s = Ext.String.leftPad(s, 2, '0');
        }

        rv += s + "''";
        return rv;
    },

    currency: function (v, currencySign, decimals, end) {
        var me = this,
            negativeSign = '',
            format = ",0",
            i = 0;

        me.currencySign = me.currencySign || RS.$('All_DefaultCurrency');

        v = v - 0;
        if (v < 0) {
            v = -v;
            negativeSign = '-';
        }
        decimals = Ext.isDefined(decimals) ? decimals : me.currencyPrecision;
        format += (decimals > 0 ? '.' : '');
        for (; i < decimals; i++) {
            format += '0';
        }

        v = me.number(v, format);
        currencySign = currencySign === false ? '' : (currencySign || me.currencySign);

        if ((end || me.currencyAtEnd) === true) {
            return Ext.String.format("{0}{1}{2}", negativeSign, v, currencySign);
        } else {
            return Ext.String.format("{0}{1}{2}", negativeSign, currencySign, v);
        }
    }
});

//grid padding 时拖拉Indicator位置不对
Ext.define('YZSoft.override.view.DropZone', {
    override: 'Ext.view.DropZone',

    positionIndicator: function (node, data, e) {
        var me = this,
            view = me.view,
            pos = me.getPosition(e, node),
            overRecord = view.getRecord(node),
            draggingRecords = data.records,
            indicatorX, indicatorY;

        if (!Ext.Array.contains(draggingRecords, overRecord) && (
            pos === 'before' && !me.containsRecordAtOffset(draggingRecords, overRecord, -1) ||
            pos === 'after' && !me.containsRecordAtOffset(draggingRecords, overRecord, 1)
        )) {
            me.valid = true;

            if (me.overRecord !== overRecord || me.currentPosition !== pos) {

                indicatorX = Ext.fly(node).getX() - view.el.getX() - view.el.getPadding('l') - 1;
                indicatorY = Ext.fly(node).getY() - view.el.getY() - view.el.getPadding('t');

                if (pos === 'after') {
                    indicatorY += Ext.fly(node).getHeight();
                }
                // If view is scrolled using CSS translate, account for then when positioning the indicator
                if (view.touchScroll === 2) {
                    indicatorX += view.getScrollX();
                    indicatorY += view.getScrollY();
                }
                me.getIndicator().setWidth(Ext.fly(node).getWidth()).showAt(indicatorX, indicatorY);

                // Cache the overRecord and the 'before' or 'after' indicator.
                me.overRecord = overRecord;
                me.currentPosition = pos;
            }
        } else {
            delete me.currentPosition; //bug fix
            me.invalidateDrop();
        }
    },
});

//tree padding 时拖拉Indicator位置不对
Ext.define('YZSoft.override.tree.ViewDropZone', {
    override: 'Ext.tree.ViewDropZone',

    onNodeOver: function (node, dragZone, e, data) {
        var position = this.getPosition(e, node),
            returnCls = this.dropNotAllowed,
            view = this.view,
            targetNode = view.getRecord(node),
            indicator = this.getIndicator(),
            indicatorX, indicatorY;

        // auto node expand check
        this.cancelExpand();
        if (position === 'append' && !this.expandProcId && !Ext.Array.contains(data.records, targetNode) && !targetNode.isLeaf() && !targetNode.isExpanded()) {
            this.queueExpand(targetNode);
        }

        if (this.isValidDropPoint(node, position, dragZone, e, data)) {
            this.valid = true;
            this.currentPosition = position;
            this.overRecord = targetNode;

            indicator.setWidth(Ext.fly(node).getWidth());

            indicatorX = Ext.fly(node).getX() - view.el.getX() - view.el.getPadding('l');
            indicatorY = Ext.fly(node).getY() - view.el.getY() - view.el.getPadding('t') - 1;

            indicatorY = Ext.fly(node).getY() - Ext.fly(view.el).getY() - 1;

            // If view is scrolled using CSS translate, account for then when positioning the indicator
            if (view.touchScroll === 2) {
                indicatorX += view.getScrollX();
                indicatorY += view.getScrollY();
            }

            /*
             * In the code below we show the proxy again. The reason for doing this is showing the indicator will
             * call toFront, causing it to get a new z-index which can sometimes push the proxy behind it. We always 
             * want the proxy to be above, so calling show on the proxy will call toFront and bring it forward.
             */
            if (position === 'before') {
                returnCls = targetNode.isFirst() ? Ext.baseCSSPrefix + 'tree-drop-ok-above' : Ext.baseCSSPrefix + 'tree-drop-ok-between';
                indicator.showAt(indicatorX, indicatorY);
                dragZone.proxy.show();
            } else if (position === 'after') {
                returnCls = targetNode.isLast() ? Ext.baseCSSPrefix + 'tree-drop-ok-below' : Ext.baseCSSPrefix + 'tree-drop-ok-between';
                indicatorY += Ext.fly(node).getHeight();
                indicator.showAt(indicatorX, indicatorY);
                dragZone.proxy.show();
            } else {
                returnCls = Ext.baseCSSPrefix + 'tree-drop-ok-append';
                // @TODO: set a class on the parent folder node to be able to style it
                indicator.hide();
            }
        } else {
            this.valid = false;
        }

        this.currentCls = returnCls;
        return returnCls;
    }
});

//对Grid view拖拉，增加拖动事件
Ext.define('YZSoft.override.grid.ViewDropZone', {
    override: 'Ext.grid.ViewDropZone',

    onNodeOver: function (node, dragZone, e, data) {
        var me = this,
            view = me.view,
            targetRecord = view.getRecord(node);

        if (view.fireEvent('nodedragover', targetRecord, null, data, e) === false){
            me.invalidateDrop();
            return false;
        }

        return me.callParent(arguments);
    },

    onContainerOver: function (dd, e, data) {
        var me = this,
            view = me.view;

        if (view.fireEvent('containerdragover', data, e) === false) {
            me.invalidateDrop();
            return false;
        }

        return me.callParent(arguments);
    }
});

//防止canvas分裂
Ext.define('YZSoft.override.draw.engine.Canvas', {
    override: 'Ext.draw.engine.Canvas',
    splitThreshold: 1000000
});

//ExtJS6 ajax错误
Ext.define('YZSoft.override.data.request.Ajax', {
    override: 'Ext.data.request.Ajax',

    openRequest: function (options, requestOptions, async, username, password) {
        var me = this,
            xhr = me.newRequest(options);
        if (username) {
            xhr.open(requestOptions.method, requestOptions.url, async, username, password);
        } else {
            if (me.isXdr) {
                xhr.open(requestOptions.method, requestOptions.url);
            } else {
                xhr.open(requestOptions.method, requestOptions.url, async);
            }
        }
        if (options.binary || me.binary) {
            if (window.Uint8Array) {
                xhr.responseType = 'arraybuffer';
            } else if (xhr.overrideMimeType) {
                // In some older non-IE browsers, e.g. ff 3.6, that do not
                // support Uint8Array, a mime type override is required so that
                // the unprocessed binary data can be read from the responseText
                // (see createResponse())
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            } else if (!Ext.isIE) {
                Ext.log.warn("Your browser does not support loading binary data using Ajax.");
            }
        }
        //if (options.responseType) {
        //    xhr.responseType = options.responseType;
        //}
        if (options.withCredentials || me.withCredentials) {
            xhr.withCredentials = true;
        }
        return xhr;
    }
});

Ext.define('YZSoft.override.data.reader.Reader', {
    override: 'Ext.data.reader.Reader',
    config: {
        messageProperty: 'errorMessage'
    }
});

//preventHideWhenMouseOnTip 在tip上移动鼠标时，不隐藏tip
Ext.define('YZSoft.override.tip.ToolTip', {
    override: 'Ext.tip.ToolTip',
    preventHideWhenMouseOnTip: false,

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        if (me.preventHideWhenMouseOnTip) {
            me.on({
                element: 'el',
                mouseenter: function () {
                    me.mouseontipbody = true;
                    me.clearTimer('hide');
                },
                mouseleave: function () {
                    delete me.mouseontipbody;
                    me.delayHide();
                }
            });
        }
    },

    handleTargetOut: function () {
        var me = this;

        if (me.preventHideWhenMouseOnTip && me.mouseontipbody)
            return;

        me.callParent(arguments);
    }
});

//增加window左侧和右侧贴边功能
// dock:'rightRS.$('BPA_EPC_Or')left'
Ext.define('YZSoft.override.window.Window', {
    override: 'Ext.window.Window',
    shadow: false,
    liveDrag: true,
    dock: '',
    floatingClose: false,

    constructor: function (config) {
        var me = this,
            dock = (config && config.dock) || me.dock,
            cfg = {};

        if (dock) {
            cfg = {
                fixed: true,
                shadow: false,
                resizable: false,
                minimizable: false,
                maximizable: false,
                draggable: false,
                height:'100%'
            }
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (dock) {
            me.addCls(['yz-window-dock', 'yz-window-dock-' + dock]);

            if (me.floatingClose)
                me.addCls(['yz-window-dock-hideclose']);

            if (me.floatingClose) {
                var createCloseBtn = function () {
                    me.btnclose = Ext.create('Ext.Component', {
                        cls: 'yz-window-dock-close',
                        renderTo: me.el,
                        listeners: {
                            element: 'el',
                            click: function () {
                                me.close();
                            }
                        }
                    });
                }

                if (me.rendered) {
                    createCloseBtn();
                }
                else {
                    me.on({
                        single: true,
                        render: function () {
                            createCloseBtn();
                        }
                    });
                }
            }

            Ext.getBody().on({
                resize: function () {
                    me.setHeight(Ext.getBody().getHeight());
                }
            });
        }
    },

    onShow: function(animateTarget, callback, scope) {
        var me = this,
            dock = me.dock,
            duration = 350,
            easing = 'easeInOut';

        me.callParent(arguments);

        if (dock == 'right') {
            me.el.setOpacity(0);

            me.el.setHeight('auto');
            me.el.setTop(0);
            me.el.setBottom(0);
            me.el.setLeft('auto');
            me.el.setRight(0);

            Ext.create('Ext.fx.Anim', {
                target: me.el,
                duration: duration,
                easing: easing,
                from: {
                    opacity: 1,
                    right: -me.getWidth()
                },
                to: {
                    opacity: 1,
                    right: 0
                }
            });
        }
        else if (dock == 'left') {
            me.el.setOpacity(0);

            me.el.setHeight('auto');
            me.el.setTop(0);
            me.el.setBottom(0);
            me.el.setLeft(0);
            me.el.setRight('auto');

            Ext.create('Ext.fx.Anim', {
                target: me.el,
                duration: duration,
                easing: easing,
                from: {
                    opacity: 1,
                    left: -me.getWidth()
                },
                to: {
                    opacity: 1,
                    left: 0
                }
            });
        }
    },

    onHide: function (animateTarget, callback, scope) {
        var me = this,
            args = arguments,
            dock = me.dock,
            duration = 280,
            easing = 'easeInOut',
            callParent = Ext.Function.bind(me.callParent, me, arguments);

        if (me.dockHideAnimateDone) {
            delete me.dockHideAnimateDone;
            me.callParent(arguments);
            return;
        }

        if (dock == 'right') {
            Ext.create('Ext.fx.Anim', {
                target: me.el,
                duration: duration,
                easing: easing,
                from: {
                    right: 0
                },
                to: {
                    right: -me.getWidth()
                },
                callback: function () {
                    me.dockHideAnimateDone = true
                    me.onHide.apply(me, args);
                }
            });
        }
        else if (dock == 'left') {
            Ext.create('Ext.fx.Anim', {
                target: me.el,
                duration: duration,
                easing: easing,
                from: {
                    left: 0
                },
                to: {
                    left: -me.getWidth()
                },
                callback: function () {
                    me.dockHideAnimateDone = true
                    me.onHide.apply(me, args);
                }
            });
        }
        else {
            me.callParent(arguments);
        }
    },

    closeDialog: function () {
        if (this.autoClose !== false) {
            if (this.closeAction == 'hide')
                this.hide();
            else
                this.close();
        }

        if (this.fn)
            this.fn.apply(this.scope || this, arguments);
    },

    /**
    el.shake({
    direction: 'y', //default 'x'
    shakes: 10,     //default:3
    excitement: 4,  //default:1
    duration:50,    //default:50
    callback:function(){},
    scope:me
    });
    */
    shake: function (o) {
        o = Ext.applyIf(o || {}, {
            shakes: 3,
            excitement: 1,
            direction: 'x',
            duration: 50
        });
        var me = this,
            c = o.direction.toUpperCase(),
            pos = me['get' + c](),
            attr = (c == 'X') ? 'x' : 'y',
            s = o.shakes,
            r = s * 2,
            e = o.excitement * 2,
            animArg = {},
            t;

        t = animArg = {
            to: {
            },
            duration: o.duration,
            callback: function () {
                if (--r > 0)
                    animFn();
                else {
                    me['set' + c](pos, false);
                    if (o.callback)
                        o.callback.call(o.scope || me);
                }
            }
        };

        function animFn() {
            t.to[attr] = (r & 1) ? pos - (s-- * e) : pos + (s * e);
            me.animate(animArg);
        }

        animFn();
        return me;
    }
});

Ext.define('YZSoft.override.column.RowNumberer', {
    override: 'Ext.grid.column.RowNumberer',
    width: 34,
    resizable:true
});

Ext.define('YZSoft.override.event.publisher.Gesture', {
    override: 'Ext.event.publisher.Gesture',

    //修正：overlay消息发送到了原点击对象上
    publishGestures: function (claimed) {
        var me = this,
            events = me.events,
            gestureTargets = me.gestureTargets;

        if (me.events.length && events[0].target && events[0].target.getAttribute) {
            if (events[0].target.getAttribute('yz-spec-capture'))
                me.gestureTargets = me.getPropagatingTargets(events[0].target);
        }

        me.callParent(arguments);
    }
});

Ext.define('YZSoft.override.dd.DragDropManager', {
    override: 'Ext.dd.DragDropManager',
    useCache: false, //重要，当拖动指示器工作时，控件大小会在移动中改变,true状态下拖动计算有误

    //修正系统bug,有时会触发系统拖动
    handleMouseMove: function (e) {
        e.preventDefault();
        return this.callParent(arguments)
    },

    //bug修正，系统不支持嵌套的drop target，总是以第一个注册的drop target为拖动目标
    regDragDrop: function (oDD, sGroup) {
        var me = this;

        me.callParent(arguments);
        me.sortids(sGroup);
    },

    sortids: function (sGroup) {
        var me = this,
            items = [],
            id;

        for (id in me.ids[sGroup]) {
            items.push({
                id: id,
                drop: me.ids[sGroup][id]
            });
        }

        me.ids[sGroup] = {};

        while (items.length) {
            for (var i = 0; i < items.length; i++){
                var item = items[i],
                    child;

                child = Ext.Array.findBy(items, function (item1) {
                    return item1 !== item && item.drop.el.contains(item1.drop.el);
                });

                if (!child || item.drop.el.isDestroyed) {
                    Ext.Array.removeAt(items, i);
                    i--;
                    me.ids[sGroup][item.id] = item.drop;
                }
            }
        }
    },

    //支持dropZone嵌套的拖动
    fireEvents: function (e, isDrop) {
        var me = this,
            isTouch = Ext.supports.Touch,
            dragCurrent = me.dragCurrent,
            mousePoint = me.currentPoint,
            allTargets = [],
            oldOvers = [],  // cache the previous dragOver array
            outEvts = [],
            overEvts = [],
            dropEvts = [],
            enterEvts = [],
            dragEl, overTarget, overTargetEl, needsSort, i, len, sGroup, overDragEl;

        // If the user did the mouse up outside of the window, we could
        // get here even though we have ended the drag.
        if (!dragCurrent || dragCurrent.isLocked()) {
            return;
        }

        // Touch's delegated event system means that the mousemove (which will be a touchmove really) target will be the element that the listener was requested for, NOT the actual lowest
        // level target . So we have to use elementFromPoint to find the target which we are currently over.
        //
        // If we need to use the current mousemove target to find the over el,
        // but pointer-events is not supported, AND the delta position does not place the mouse outside of the dragEl,
        // temporarily move the dragEl away, and fake the mousemove target by using document.elementFromPoint
        // while it's out of the way.
        // The pointer events implementation is bugged in IE9/10 and opera, so fallback even if they report that they support it.
        // IE8m do not support it so they will auto fall back
        overDragEl = !(dragCurrent.deltaX < 0 || dragCurrent.deltaY < 0);
        if (isTouch || (!me.notifyOccluded && (!Ext.supports.CSSPointerEvents || Ext.isIE10m || Ext.isOpera) && overDragEl)) {
            dragEl = dragCurrent.getDragEl();
            // Temporarily hide the dragEl instead of moving it off the page. Moving the el off the page can cause
            // problems when in an iframe with IE8 standards. See EXTJSIV-11728.
            if (overDragEl) {
                dragEl.style.visibility = 'hidden';
            }
            // In Win10, dragging outside the browser window will cause elementFromPoint to
            // return null. In these cases, default to the document.
            // We are about to change the event target so that it behaves like a mouse
            // event, not a touch event.  We first need to prototype chain a new object
            // to the original event, to avoid modifying the original.
            e = e.chain({
                target: me.elementFromPoint(e.clientX, e.clientY) || document.documentElement
            });
            if (overDragEl) {
                dragEl.style.visibility = 'visible';
            }
        }

        // Check to see if the object(s) we were hovering over is no longer
        // being hovered over so we can fire the onDragOut event
        for (i in me.dragOvers) {

            overTarget = me.dragOvers[i];
            delete me.dragOvers[i];

            // Check to make sure that the component hasn't been destroyed in the middle of a drag operation.
            if (!me.isTypeOfDD(overTarget) || overTarget.destroyed) {
                continue;
            }

            // On mouseup/pointerup/touchend, we destroy our
            // pointerMoveListeners, (see handleMouseUp). So will will recieve no
            // further move notifications to cause the terminating "out"
            // events, so create the out events now.
            if (isDrop) {
                outEvts.push(overTarget);
            } else {
                // If notifyOccluded set, we use mouse position
                if (me.notifyOccluded) {
                    if (!this.isOverTarget(mousePoint, overTarget, me.mode)) {
                        outEvts.push(overTarget);
                    }
                }
                // Otherwise we use event source of the mousemove event
                else {
                    if (!e.within(overTarget.getEl())) {
                        outEvts.push(overTarget);
                    }
                }
            }

            oldOvers[i] = true;
            oldOvers[i] = overTarget; //99199 记录原来over项
        }

        // Collect all targets which are members of the same ddGoups that the dragCurrent is a member of, and which may receive mouseover and drop notifications.
        // This is preparatory to seeing which one(s) we are currently over
        // Begin by iterating through the ddGroups of which the dragCurrent is a member
        for (sGroup in dragCurrent.groups) {
            if ("string" !== typeof sGroup) {
                continue;
            }

            // Loop over the registered members of each group, testing each as a potential target
            for (i in me.ids[sGroup]) {
                overTarget = me.ids[sGroup][i];

                // The target is valid if it is a DD type
                // And it's got a DOM element
                // And it's configured to be a drop target
                // And it's not locked
                // And the DOM element is fully visible with no hidden ancestors
                // And it's either not the dragCurrent, or, if it is, tha dragCurrent is configured to not ignore itself.
                if (me.isTypeOfDD(overTarget) &&
                    (overTargetEl = overTarget.getEl()) &&
                    (overTarget.isTarget) &&
                    (!overTarget.isLocked()) &&
                    (Ext.fly(overTargetEl).isVisible(true)) &&
                    ((overTarget !== dragCurrent) || (dragCurrent.ignoreSelf === false))) {

                    // If notifyOccluded set, we use mouse position
                    if (me.notifyOccluded) {

                        // Only sort by zIndex if there were some which had a floating zIndex value
                        if ((overTarget.zIndex = me.getZIndex(overTargetEl)) !== -1) {
                            needsSort = true;
                        }
                        allTargets.push(overTarget);
                    }
                    // Otherwise we use event source of the mousemove event
                    else {
                        if (e.within(overTargetEl)) {
                            allTargets.push(overTarget);


                            break;
                        }
                    }
                }
            }
        }

        // If there were floating targets, sort the highest zIndex to the top
        if (needsSort) {
            Ext.Array.sort(allTargets, me.byZIndex);
        }

        // Loop through possible targets, notifying the one(s) we are over.
        // Usually we only deliver events to the topmost.
        for (i = 0, len = allTargets.length; i < len; i++) {
            overTarget = allTargets[i];

            // If we are over the overTarget, queue it up to recieve an event of whatever type we are handling
            if (me.isOverTarget(mousePoint, overTarget, me.mode)) {
                // look for drop interactions
                if (isDrop) {
                    dropEvts.push(overTarget);
                    // look for drag enter and drag over interactions
                } else {

                    // initial drag over: dragEnter fires
                    if (!oldOvers[overTarget.id]) {
                        enterEvts.push(overTarget);
                        // subsequent drag overs: dragOver fires

                        //原来over项和当前over项（overTarget）不同，则将原来over项设置到outEvts
                        for (var k in oldOvers) {
                            if (overTarget.id != k && !Ext.Array.contains(outEvts, oldOvers[k])) {
                                //delete dragCurrent.cachedTarget;
                                outEvts.push(oldOvers[k]);
                            }
                        }

                        var outids = [];
                        for (var k = 0; k < outEvts.length; k++) {
                            outids.push(outEvts[k].id);
                        }
                        //Ext.log('out:' + outids.join(',') + ',enter:' + enterEvts[0].id);

                    } else {
                        overEvts.push(overTarget);
                    }
                    me.dragOvers[overTarget.id] = overTarget;
                }

                // Unless this DragDropManager has been explicitly configured to deliver events to multiple targets, then we are done.
                if (!me.notifyOccluded) {
                    break;
                }
            }
            else {
            }
        }

        if (me.mode) {
            if (enterEvts.length) {
                dragCurrent.onDragEnter(e, enterEvts);
            }

            if (overEvts.length) {
                dragCurrent.b4DragOver(e, overEvts);
                dragCurrent.onDragOver(e, overEvts);
            }

            if (dropEvts.length) {
                dragCurrent.b4DragDrop(e, dropEvts);
                dragCurrent.onDragDrop(e, dropEvts);
            }

            // fire dragout events.
            // These are fires on mouseup/pointerup/touchend
            // in addition to the dropEvt, so must happen *after* the drop
            if (outEvts.length) {
                dragCurrent.b4DragOut(e, outEvts);
                dragCurrent.onDragOut(e, outEvts);
            }
        } else {
            // fire over events
            for (i = 0, len = overEvts.length; i < len; ++i) {
               // Ext.log('overEvts:' + overEvts[i].id);
                //delete dragCurrent.cachedTarget;

                dragCurrent.b4DragOver(e, overEvts[i].id);
                dragCurrent.onDragOver(e, overEvts[i].id);
            }

            // fire drop events
            for (i = 0, len = dropEvts.length; i < len; ++i) {
                //delete dragCurrent.cachedTarget;

                dragCurrent.b4DragDrop(e, dropEvts[i].id);
                dragCurrent.onDragDrop(e, dropEvts[i].id);
            }

            // fire dragout events.
            // These are fires on mouseup/pointerup/touchend
            // in addition to the dropEvt, so must happen *after* the drop
            for (i = 0, len = outEvts.length; i < len; ++i) {
                 //Ext.log('outEvts:' + outEvts[i].id);
                //delete dragCurrent.cachedTarget;
                dragCurrent.b4DragOut(e, outEvts[i].id);
                dragCurrent.onDragOut(e, outEvts[i].id);
            }

            //99199 先发送outEvts再发送enterEvts
            // fire enter events
            for (i = 0, len = enterEvts.length; i < len; ++i) {
                // Ext.log('enterEvts:' + enterEvts[i].id);
                //delete dragCurrent.cachedTarget;

                // dc.b4DragEnter(e, oDD.id);
                dragCurrent.onDragEnter(e, enterEvts[i].id);
            }
        }

        // notify about a drop that did not find a target
        if (isDrop && !dropEvts.length) {
            dragCurrent.onInvalidDrop(e);
        }
    }
});

Ext.define('YZSoft.override.panel.DragSource', {
    override: 'Ext.dd.DragSource',
    animRepair: false, //改变缺省值，去掉拖动无效结束动画

    //使afterRepair受animRepair控制
    afterRepair: function () {
        var me = this;
        if (Ext.enableFx && me.animRepair) {
            me.el.highlight(me.repairHighlightColor);
        }
        me.dragging = false;
    }
});

Ext.define('YZSoft.override.dd.DragDrop', {
    override: 'Ext.dd.DragDrop',

    //支持多个ddGroup（ddGroup属性支持数组）
    addToGroup: function (sGroup) {
        var me = this;

        if (Ext.isArray(sGroup)){
            Ext.each(sGroup, function (group) {
                me.addToGroup(group);
            });
        }
        else {
            me.callParent(arguments);
        }
    }
});

//拖动到chart上时，mousemove消息接收不到
Ext.define('YZSoft.override.chart.interactions.Abstract', {
    override: 'Ext.chart.interactions.Abstract',

    addChartListener: function () {
        var me = this,
            chart = me.getChart(),
            gestures = me.getGestures(),
            gesture;

        if (!me.getEnabled()) {
            return;
        }

        function insertGesture(name, fn) {
            chart.addElementListener(
                name,
                // wrap the handler so it does not fire if the event is locked by another interaction 
                me.listeners[name] = function (e) {
                    if (chart.designModel) {
                        if (me.type == 'rotate') //禁用rotate interaction
                            return;

                        if (e.type == 'mousemove' && Ext.dd.DragDropManager.dragCurrent) //拖动过程中禁用interactions
                            return;
                    }

                    var locks = me.getLocks(), result;
                    if (me.getEnabled() && (!(name in locks) || locks[name] === me)) {
                        result = (Ext.isFunction(fn) ? fn : me[fn]).apply(this, arguments);
                        if (result === false && e && e.stopPropagation) {
                            e.stopPropagation();
                        }
                        return result;
                    }
                },
                me
            );
        }

        me.listeners = me.listeners || {};
        for (gesture in gestures) {
            insertGesture(gesture, gestures[gesture]);
        }
    }
});

Ext.define('YZSoft.override.chart.series.StackedCartesian', {
    override: 'Ext.chart.series.StackedCartesian',
    config: {
        yFieldsColors: null //增加yFieldsColors属性
    },

    //更新theme colors时，自动附加上yFieldsColors中对某些yField指定的颜色
    updateThemeColors: function (colors) {
        var me = this,
            colors = Ext.Array.from(colors),
            yFieldsColors = Ext.Array.from(me._yFieldsColors),
            i;

        for (i = 0; i < colors.length; i++) {
            if (yFieldsColors[i])
                colors[i] = yFieldsColors[i];
        }

        me.callParent(arguments);
    },

    //获得缺省yField colors
    getDefaultSubColors: function () {
        var me = this,
            chart = me.getChart(),
            theme = chart.getTheme(),
            colors = (theme && theme.getColors()),
            colorIndex = 0,
            series = chart.getSeries(),
            seriesCount = series && series.length,
            i, seriesItem, seriesColors, seriesColorCount;

        for (i = 0; i < seriesCount; i++) {
            seriesItem = series[i];
            seriesColorCount = seriesItem.themeColorCount();
            seriesColors = chart.circularCopyArray(colors, colorIndex, seriesColorCount);
            colorIndex += seriesColorCount;

            if (seriesItem == me)
                return seriesColors;
        }
    },

    //获取yFieldsColors时，补齐yField列数
    getYFieldsColors: function () {
        var me = this,
            yFieldsColors = Ext.Array.from(me.callParent()),
            yField = Ext.Array.from(me.getYField()),
            rv = [],
            i;

        for (i = 0; i < yField.length; i++) {
            if (yFieldsColors[i])
                rv.push(yFieldsColors[i]);
            else
                rv.push(null);
        }

        return rv;
    },

    //更新yFieldsColors时，自动触发将themecolors更新为缺省值
    updateYFieldsColors: function () {
        var me = this,
            colors = me.getDefaultSubColors();

        me.updateThemeColors(colors);

        if (!me.isConfiguring) {
            var chart = this.getChart();

            if (chart) {
                chart.refreshLegendStore();
            }
        }
    }
});

Ext.define('YZSoft.override.Ext.view.DragZone', {
    override: 'Ext.view.DragZone',

    //在actioncolumn上支持移动action
    onTriggerGesture: function (view, record, item, index, e) {
        var isMoveActopn = e.getTarget('.yz-action-move'),
            navModel;

        if ((e.pointerType === 'touch' && e.type !== 'longpress') || (!isMoveActopn && e.position && e.position.isEqual(e.view.actionPosition))) {
            return;
        }

        if (!this.isPreventDrag(e, record, item, index)) {
            navModel = view.getNavigationModel();

            if (e.position) {
                navModel.setPosition(e.position);
            }
            else {
                navModel.setPosition(index);
            }
            this.handleMouseDown(e);
        }
    }
});

//在title中增加修改标记
Ext.define('YZSoft.override.panel.Panel', {
    override: 'Ext.panel.Panel',
    dirtyHtml: '<span class="yz-process-dirty-flag">*</span>',
    expandToolText: RS.$('All_ExpandPanel'),

    setTitle: function (title, markedTitle) {
        var me = this;

        if (markedTitle !== true)
            me.realTitle = title;

        me.callParent(arguments);
    },

    getTitle: function () {
        var me = this;

        return me.realTitle || me.callParent(arguments);
    },

    markDirty: function (dirty) {
        var me = this,
            realTitle = me.realTitle = me.realTitle || me.getTitle();

        me.dirty = dirty;
        me.setTitle(realTitle + (dirty ? '<span class="yz-process-dirty-flag">*</span>' : ''), true);
    }
});

//chart destroy时，没有调用destroyChart，导致报表设计器在加载过程中马上关闭会出错
Ext.define('YZSoft.override.chart.AbstractChart', {
    override: 'Ext.chart.AbstractChart',

    destroy: function () {
        this.destroyChart();
        this.callParent();
    }
});

Ext.define('YZSoft.override.dom.Element', {
    override: 'Ext.dom.Element',

    //floating center在可视区域中间，缺省会在内容的中间，滚动时在可视区外
    inheritableStatics: {
        getViewportHeight: function () {
            return Ext.isIE9m ? DOC.documentElement.clientHeight : window.innerHeight;
        }
    }
});

Ext.define('YZSoft.src.overrides.chart.series.Pie3D', {
    override: 'Ext.chart.series.Pie3D',

    //新创建的sprite没有应用highlight效果
    getSprites: function (createMissing) {
        var me = this,
            orglen = me.sprites.length,
            sprites = me.callParent(arguments),
            highlight = me.getHighlight();

        if (sprites.length > orglen) {
            me.updateHighlight(highlight, highlight);
        }

        return sprites;
    }
});

Ext.define('YZSoft.src.overrides.chart.series.Line', {
    override: 'Ext.chart.series.Line',

    //不正确
    provideLegendInfo: function (target) {
        var me = this,
            style = me.getStyleByIndex(0); //这才是series的实际颜色

        target.push({
            name: me.getTitle() || me.getYField() || me.getId(),
            mark: style.strokeStyle || 'black',
            disabled: me.getHidden(),
            series: me.getId(),
            index: 0
        });
    }
});

Ext.define('YZSoft.src.overrides.chart.series.Radar', {
    override: 'Ext.chart.series.Radar',

    //不正确
    provideLegendInfo: function (target) {
        var me = this,
            style = me.getStyleByIndex(0), //这才是series的实际颜色
            fill = style.fillStyle;

        if (Ext.isArray(fill)) {
            fill = fill[0];
        }

        //排除透明色
        if (fill == 'none')
            fill = null;

        target.push({
            name: me.getTitle() || me.getYField() || me.getId(),
            mark: (Ext.isObject(fill) ? fill.stops && fill.stops[0].color : fill) || style.strokeStyle || 'black',
            disabled: me.getHidden(),
            series: me.getId(),
            index: 0
        });
    }
});


Ext.define('YZSoft.src.overrides.util.Format', {
    override: 'Ext.util.Format',
    singleton: true,

    friendlyDate: function (value, format, formattext) {
        format = format || RS.$('All_Date_Format_i');
        formattext = formattext || '{0}';

        return Ext.String.format('<span data-qtip="{1}">{0}</span >',
            Ext.Date.toFriendlyString(value),
            Ext.String.format(formattext, Ext.Date.format(value, format))
        );
    },

    text: function (value, nullText) {
        nullText = nullText || '';

        if (Ext.String.startsWith(nullText, '$$'))
            nullText = RS.$(nullText.substring(2));

        value = (!value && value !== 0) ? '' : value.toString();
        value = Ext.String.htmlEncode(value);
        value = Ext.util.Format.nl2br(value);
        value = value || nullText;

        return value;
    },

    dataType: function (value) {
        return (value || {}).name || 'String';
    },

    sex: function (value, unknowText) {
        if (value == 'Unknown')
            return unknowText || RS.$('All_Sex');

        return RS.$('All_' + value);
    },

    old: function (value) {
        if (!value)
            return RS.$('All_Birthday');

        return Ext.String.format(RS.$('All_Old'), Math.ceil(Ext.Date.getElapsed(value, new Date()) / 1000 / 60 / 60 / 24 / 365), Ext.util.Format.date(value, 'Y-m-d'));
    },

    toElapsedString: function (minutes) {
        var day = Math.floor(minutes / 60 / 24),
            hours = Math.floor((minutes / 60) % 24),
            minutes = Math.ceil(minutes % 60),
            strHours = Ext.String.leftPad(hours, 2, '0'),
            strMinutes = Ext.String.leftPad(minutes, 2, '0');

        if (day)
            return Ext.String.format(RS.$('All__TimeSpanFormatDHM'), day, strHours, strMinutes);

        if (hours)
            return Ext.String.format(RS.$('All__TimeSpanFormatHM'), hours, strMinutes);

        return Ext.String.format(RS.$('All__TimeSpanFormatM'), minutes);
    },

    test: function (value) {
        value = (!value && value !== 0) ? '' : value;
        value = Ext.String.htmlEncode(value);
        value = Ext.util.Format.nl2br(value);
        return YZSoft.HttpUtility.htmlEncode(value, true) + 'aaa';
    }
});

Ext.define('YZSoft.src.overrides.grid.Panel', {
    override: 'Ext.grid.Panel',
    emptyCls: 'x-grid-empty d-flex flex-column align-items-center justify-content-center'
});

//Ext.define('YZSoft.src.overrides.tree.Column', {
//    override: 'Ext.tree.Column',

//    treeRenderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
//        var me = this,
//            cls = record.get('cls'),
//            rendererData;

//        // The initial render will inject the cls into the TD's attributes. 
//        // If cls is ever *changed*, then the full rendering path is followed. 
//        if (metaData && cls) {
//            metaData.tdCls += ' ' + cls;
//        }

//        rendererData = me.initTemplateRendererData(value, metaData, record, rowIdx, colIdx, store, view);

//        return me.lookupTpl('cellTpl').apply(rendererData);
//    },
//});

Ext.setGlyphFontFamily('yzglyphs');


//Ext.define('YZSoft.override.view.Table', {
//    override: 'Ext.view.Table',
//    enableTextSelection: true //qml99199允许选择grid中的文字
//});

//var chromiumType = YZSoft.getChromiumType();
//Ext.is360 = YZSoft.getChromiumType() === '360ee';
YZSoft.uploadMissCookie = Ext.isSafari || true;