
String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
}

saveLoginInfo = function (uid, pwd) {
    var me = this;

    try {
        localStorage.setItem('uid', uid);
    }
    catch (exp) {
    }
},

getLoginInfo = function () {
    var rv = {};

    if (localStorage) {
        try {
            rv.uid = localStorage.getItem('uid');
        }
        catch (exp) {
            rv.uid = '';
        }
    }

    return rv;
}

$.extend(application, {
    lastuid: getLoginInfo().uid,
    headurl: application.root + 'YZSoft/attachment/Download.ashx',

    toQueryString: function (object) {
        var me = this,
            paramObjects = [],
            params = [],
            name, value;

        for (name in object) {
            if (object.hasOwnProperty(name)) {
                value = object[name];
                params.push(encodeURIComponent(name) + '=' + encodeURIComponent(String(value)));
            }
        }

        return params.join('&');
    },

    getHeadUrl: function (uid) {
        var me = this,
            lastuid = me.lastuid;

        if (lastuid && uid == lastuid) {
            return me.headurl + '?' + me.toQueryString({
                method: 'GetHeadshot',
                thumbnail: 'M',
                empty: 'SignIn-EmptyHead.png',
                account: lastuid
            });
        }
        else {
            return me.root + 'YZSoft/attachment/img/SignIn-EmptyHead.png'
        }
    },

    updateStatus: function () {
        var me = this,
            uidEl = application.uidEl,
            value = uidEl.val();

        $('.head').css({
            'background-image': 'url(' + application.getHeadUrl(value) + ')'
        });
    },

    loginNT: function () {
        var me = this;

        $('.tip').html('&nbsp;');

        $.ajax({
            url: 'Default.aspx',
            cache: false,
            data: {
                method: 'LoginNT'
            },
            complete: function () {
            },
            error: function (response) {
                //NT登录取消进这里，无需显示错误信息
            },
            success: function (data) {
                if (data.success === false) {
                    $('.tip').html(data.errorMessage);
                    return;
                }

                window.location.replace(application.returnUrl);
            },
            dataType: 'json'
        });
    },

    alert: function (message, closeFn, scope) {
        var me = this,
            html;

        html = [
            '<div class="alt-message">',
                message,
                '<div>',
                '</div>',
            '</div>'
        ].join('');

        $.fancybox.open(html, {
            afterClose: function () {
                if (closeFn)
                    closeFn.call(scope);
            }
        });
    },

    checkBrowser: function (args) {
        var me = this,
            msg = String.format(application.strings.browserWarn, $.browser.name, $.browser.version);

        //$.browser.msie = 9;
        //$.browser.versionNumber = 9;
        if ($.browser.msie) {
            if ($.browser.versionNumber < 10) {
                me.alert(msg, function () {
                    if (args.close)
                        args.close.call(args.scope);
                });

                return;
            }
        }

        if (args.success)
            args.success.call(args.scope);
    }
});

$(document).ready(function () {
    var lastuid = application.lastuid;

    application.ready = true;
    application.uidEl = $('.yz-input.uid input');
    application.pwdEl = $('.yz-input.pwd input');

    application.uidEl.val(lastuid || '');

    application.updateStatus();

    if (!application.uidEl.val())
        application.uidEl.focus();
    else
        application.pwdEl.focus();

    //给账号文本框添加回车事件，光标切换到密码文本框
    $('.yz-input.uid input').keydown(function (e) {
        var curKey = e.which;
        if (curKey == 13) {
            $('.yz-input.pwd input').focus();
        }
    });

    //给密码文本框添加回车事件，自动选择BPM登录
    $('.yz-input.pwd input').keydown(function (e) {
        var curKey = e.which,
            disabled = $('.yz-login-body').hasClass('web-login-denied');

        if (curKey == 13) {
            //选择左边的BPM登录按钮
            if (!disabled)
                $('.yz-btn.login').click();

            //选择右边的NT登录按钮
            //$(".yz-btn.loginnt").click();
        }
    });

    //点击登录
    $('.yz-btn.login').click(function (e) {
        var me = this,
            uid = application.uidEl.val(),
            pwd = application.pwdEl.val(),
            disabled = $('.yz-login-body').hasClass('web-login-denied'),
            loading = $(me).hasClass('loading');

        e.preventDefault();

        if (disabled)
            return;

        if (loading)
            return;

        //未输入密码
        if (!uid) {
            $('.tip').html(application.strings.enterAccount);
            return;
        }

        $('.tip').html('&nbsp;');
        $(me).addClass('loading');

        //向服务器请求RSA公钥
        $.ajax({
            url: 'Default.aspx',
            cache: false,
            data: {
                method: 'GetPublicKey',
                json: true
            },
            complete: function () {
            },
            error: function (response) {
                //$(me).removeClass('loading');
                $.error(response.responseText);
            },
            success: function (data) {
                var encrypt = new JSEncrypt();
                encrypt.setPublicKey(data.publicKey);

                $.ajax({
                    url: 'Default.aspx',
                    cache: false,
                    data: {
                        method: 'Login',
                        json: true,
                        keystore: data.keystore,
                        uid: encrypt.encrypt(uid),
                        uep: encrypt.encrypt(pwd)
                    },
                    complete: function () {
                        $(me).removeClass('loading');
                    },
                    error: function (response) {
                        $.error(response.responseText);
                    },
                    success: function (data) {
                        if (data.success === false) {
                            $('.tip').html(data.errorMessage);
                            return;
                        }

                        saveLoginInfo(uid, pwd);
                        window.location.replace(application.returnUrl);
                    },
                    dataType: 'json'
                });
            },
            dataType: 'json'
        });
    });

    $('.yz-btn.loginnt').click(function () {
        var me = this,
            disabled = $('.yz-login-body').hasClass('nt-login-denied');

        if (disabled)
            return;

        application.loginNT();
    });

    $('.lang-item').click(function () {
        var me = this,
            lcid = $(me).attr('lcid');

        if ($(me).hasClass('selected'))
            return;

        $.ajax({
            url: 'Default.aspx',
            cache: false,
            data: {
                method: 'SetLanguage',
                lcid: lcid
            },
            success: function () {
                window.location.reload(true);
            },
            dataType: 'json'
        });
    });

    application.uidEl.on('keyup paste', function () {
        application.updateStatus();
    });

    var afterCall = function () {
        if (application.ntOnly && application.logoutType != 'logout') {
            application.loginNT();
        }
    }

    application.checkBrowser({
        success: function () {
            afterCall();
        },
        close: function () {
            afterCall();
        }
    });
});

window.onerror = function (message, url, lineNo) {
    var msg = 'line:' + lineNo + ',' + url + '\n' + message;

    if (application.ready)
        application.alert(msg);
    else
        alert(msg);
};